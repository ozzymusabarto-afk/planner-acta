/**
 * PLANNER ACTA — Sincronizador com Cloud Firestore
 * 
 * Arquitetura de Isolamento:
 * /users/{uid}                    <-- Perfil do usuário (imutável: plan, status, schemaVersion)
 *   ├── children/{childId}        <-- Perfis das crianças cadastradas
 *   ├── materials/{materialId}    <-- Materiais de estudo cadastrados
 *   ├── plans/{planId}            <-- Planejamentos de estudo
 *   ├── records/{recordId}        <-- Registros diários de aprendizagem
 *   ├── diagnostics/{diagId}      <-- Avaliações diagnósticas
 *   ├── calendar/{calendarId}     <-- Eventos do calendário familiar
 *   ├── extras/{extraId}          <-- Passeios, museus e atividades extras
 *   ├── readings/{readingId}      <-- Estante de leituras e virtudes
 *   ├── movies/{movieId}          <-- Cinemateca familiar e reflexões
 *   └── settings/preferences      <-- Preferências gerais (tema, visualização, etc.)
 */

(function(window) {
  'use strict';

  const SCHEMA_VERSION = 1;
  let isSyncing = false;
  let pendingSyncTimeout = null;

  function getFirestore() {
    if (window.ActaFirebase && window.ActaFirebase.getFirestore) {
      return window.ActaFirebase.getFirestore();
    }
    return window.firebase ? window.firebase.firestore() : null;
  }

  function getFieldServerTimestamp() {
    if (window.firebase && window.firebase.firestore && window.firebase.firestore.FieldValue) {
      return window.firebase.firestore.FieldValue.serverTimestamp();
    }
    return new Date().toISOString();
  }

  const ActaFirestoreSync = {
    SCHEMA_VERSION: SCHEMA_VERSION,

    /**
     * Inicializa o perfil do usuário em /users/{uid} após novo cadastro
     */
    initUserProfile: async function(user, displayName) {
      const db = getFirestore();
      if (!db || !user) return null;

      const userRef = db.collection('users').doc(user.uid);
      const now = new Date().toISOString();

      const profileData = {
        uid: user.uid,
        email: user.email || '',
        displayName: displayName || user.displayName || 'Família ACTA',
        plan: 'free',
        status: 'active',
        schemaVersion: SCHEMA_VERSION,
        createdAt: now,
        updatedAt: now
      };

      try {
        const snap = await userRef.get();
        if (!snap.exists) {
          await userRef.set(profileData);
        }
        return profileData;
      } catch (err) {
        console.error('[ACTA Firestore] Erro ao criar perfil inicial:', err);
        throw err;
      }
    },

    /**
     * Carrega todos os dados do usuário a partir do Firestore sob /users/{uid}
     */
    loadUserData: async function(uid) {
      const db = getFirestore();
      if (!db || !uid) return null;

      try {
        const userRef = db.collection('users').doc(uid);
        const userDoc = await userRef.get();

        let profile = null;
        if (!userDoc.exists) {
          const authUser = window.ActaAuth ? window.ActaAuth.getCurrentUser() : null;
          profile = await this.initUserProfile(authUser || { uid: uid }, 'Família ACTA');
        } else {
          profile = userDoc.data();
        }

        // Carrega todas as subcoleções privadas em paralelo
        const collections = [
          'children', 'materials', 'plans', 'records',
          'diagnostics', 'calendar', 'extras', 'readings', 'movies'
        ];

        const results = await Promise.all(
          collections.map(col => userRef.collection(col).get().catch(err => {
            console.warn(`[ACTA Firestore] Aviso ao buscar coleção ${col}:`, err);
            return { docs: [] };
          }))
        );

        // Busca preferências
        let settingsDoc = null;
        try {
          settingsDoc = await userRef.collection('settings').doc('preferences').get();
        } catch(e) {}

        const settingsData = (settingsDoc && settingsDoc.exists) ? settingsDoc.data() : {};

        // Monta o estado unificado para o usuário
        const userData = {
          schemaVersion: SCHEMA_VERSION,
          contextMode: settingsData.contextMode || 'Minha família',
          activeTheme: settingsData.activeTheme || 'natureza',
          activePersonId: settingsData.activePersonId || null,
          people: results[0].docs.map(d => ({ id: d.id, ...d.data() })),
          materials: results[1].docs.map(d => ({ id: d.id, ...d.data() })),
          plans: results[2].docs.map(d => ({ id: d.id, ...d.data() })),
          records: results[3].docs.map(d => ({ id: d.id, ...d.data() })),
          evaluations: results[4].docs.map(d => ({ id: d.id, ...d.data() })),
          calendarEvents: results[5].docs.map(d => ({ id: d.id, ...d.data() })),
          extras: results[6].docs.map(d => ({ id: d.id, ...d.data() })),
          readings: results[7].docs.map(d => ({ id: d.id, ...d.data() })),
          movies: results[8].docs.map(d => ({ id: d.id, ...d.data() })),
          weekSchedule: Array.isArray(settingsData.weekSchedule) ? settingsData.weekSchedule : (window.ActaStorage ? window.ActaStorage.EMPTY_WEEK_SCHEDULE : []),
          achievements: settingsData.achievements || []
        };

        // Atualiza ActaStorage em memória e cache do usuário
        if (window.ActaStorage && window.ActaStorage.setUserDataSet) {
          window.ActaStorage.setUserDataSet(uid, userData);
        }

        return profile;
      } catch (err) {
        console.error('[ACTA Firestore] Erro ao carregar dados do usuário:', err);
        return null;
      }
    },

    /**
     * Salva documento de uma subcoleção privada (/users/{uid}/{collection}/{docId})
     */
    saveEntityDoc: async function(uid, subcollection, docId, data) {
      const db = getFirestore();
      if (!db || !uid || !subcollection || !docId) return;

      try {
        const docRef = db.collection('users').doc(uid).collection(subcollection).doc(docId);
        const payload = Object.assign({}, data, {
          updatedAt: new Date().toISOString()
        });
        delete payload.id; // Evita redundância
        if (subcollection === 'diagnostics') {
          delete payload.wellnessContext; // Sanitização estrita: dados privados de rotina/sono/bem-estar NUNCA vão para a nuvem
        }
        await docRef.set(payload, { merge: true });
      } catch (err) {
        console.error(`[ACTA Firestore] Erro ao salvar ${subcollection}/${docId}:`, err);
      }
    },

    /**
     * Remove documento de uma subcoleção privada
     */
    deleteEntityDoc: async function(uid, subcollection, docId) {
      const db = getFirestore();
      if (!db || !uid || !subcollection || !docId) return;

      try {
        await db.collection('users').doc(uid).collection(subcollection).doc(docId).delete();
      } catch (err) {
        console.error(`[ACTA Firestore] Erro ao excluir ${subcollection}/${docId}:`, err);
      }
    },

    /**
     * Salva as preferências gerais sob /users/{uid}/settings/preferences
     */
    saveSettings: async function(uid, settings) {
      const db = getFirestore();
      if (!db || !uid) return;

      try {
        const docRef = db.collection('users').doc(uid).collection('settings').doc('preferences');
        await docRef.set(Object.assign({}, settings, {
          updatedAt: new Date().toISOString()
        }), { merge: true });
      } catch (err) {
        console.error('[ACTA Firestore] Erro ao salvar configurações:', err);
      }
    },

    /**
     * Sincronização em segundo plano do estado completo do usuário
     */
    scheduleSync: function(uid, fullData) {
      if (!uid) return;
      if (pendingSyncTimeout) {
        clearTimeout(pendingSyncTimeout);
      }

      pendingSyncTimeout = setTimeout(async () => {
        if (isSyncing) return;
        isSyncing = true;
        try {
          const db = getFirestore();
          if (!db) return;

          // Validação rigorosa de identidade: impede gravação em UID incorreto
          const activeUid = window.ActaAuth && typeof window.ActaAuth.getUserUid === 'function' ? window.ActaAuth.getUserUid() : null;
          if (!activeUid || activeUid !== uid) {
            console.warn('[ACTA Firestore] Sincronização abortada: UID da fila não confere com usuário logado.');
            return;
          }

          const userRef = db.collection('users').doc(uid);

          // Salva preferências
          const settingsPayload = {
            contextMode: fullData.contextMode || 'Minha família',
            activeTheme: fullData.activeTheme || 'natureza',
            activePersonId: fullData.activePersonId || null,
            weekSchedule: fullData.weekSchedule || {},
            achievements: fullData.achievements || [],
            updatedAt: new Date().toISOString()
          };
          await userRef.collection('settings').doc('preferences').set(settingsPayload, { merge: true });

          // Sincroniza coleções com batch seguro
          const syncArray = async (items, colName) => {
            if (!Array.isArray(items)) return;
            for (const item of items) {
              if (item && item.id) {
                const itemRef = userRef.collection(colName).doc(item.id);
                const clone = Object.assign({}, item);
                delete clone.id;
                if (colName === 'diagnostics') {
                  delete clone.wellnessContext; // Sanitização estrita: dados privados de rotina/sono/bem-estar NUNCA vão para a nuvem
                }
                await itemRef.set(clone, { merge: true });
              }
            }
          };

          await syncArray(fullData.people, 'children');
          await syncArray(fullData.materials, 'materials');
          await syncArray(fullData.plans, 'plans');
          await syncArray(fullData.records, 'records');
          await syncArray(fullData.evaluations, 'diagnostics');
          await syncArray(fullData.calendarEvents, 'calendar');
          await syncArray(fullData.extras, 'extras');
          await syncArray(fullData.readings, 'readings');
          await syncArray(fullData.movies, 'movies');

        } catch (err) {
          console.error('[ACTA Firestore] Erro na sincronização agendada:', err);
        } finally {
          isSyncing = false;
        }
      }, 1000);
    },

    /**
     * Limpa a sessão local na memória
     */
    clearLocalSession: function(previousUid) {
      if (pendingSyncTimeout) {
        clearTimeout(pendingSyncTimeout);
        pendingSyncTimeout = null;
      }
      isSyncing = false;
      if (window.ActaStorage && window.ActaStorage.resetUserSession) {
        window.ActaStorage.resetUserSession(true, previousUid);
      }
    }
  };

  window.ActaFirestoreSync = ActaFirestoreSync;
})(window);
