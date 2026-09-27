/**
 * PLANNER ACTA — Inicialização do Firebase Web SDK
 * Projeto: ACTA (acta-551f5)
 * Web App: ACTA web (1:698222751783:web:d7b009ea072c74632e5e02)
 *
 * NOTA DE SEGURANÇA:
 * - Apenas parâmetros públicos do Web App são utilizados aqui.
 * - NUNCA incluir chaves privadas de servidor, tokens administrativos ou service accounts.
 */

(function(window) {
  'use strict';

  // Configuração pública oficial do Firebase Web App (acta-551f5)
  const firebaseConfig = {
    apiKey: 'AIzaSyD10sv54FRMCFYmBYMePq-I5FMP9s0P_gQ',
    authDomain: 'acta-551f5.firebaseapp.com',
    projectId: 'acta-551f5',
    storageBucket: 'acta-551f5.firebasestorage.app',
    messagingSenderId: '698222751783',
    appId: '1:698222751783:web:d7b009ea072c74632e5e02',
    measurementId: 'G-F5ZDT3ZZPM'
  };

  let initializedApp = null;
  let authInstance = null;
  let firestoreInstance = null;

  function initFirebase() {
    if (!window.firebase) {
      console.warn('[ACTA Firebase] SDK do Firebase não encontrado no escopo global.');
      return false;
    }

    try {
      if (!window.firebase.apps.length) {
        // Se a apiKey estiver vazia, tenta verificar se o Firebase hosting injetou init
        if (!firebaseConfig.apiKey) {
          console.info('[ACTA Firebase] Inicializando com configuração pública do projeto...');
        }
        initializedApp = window.firebase.initializeApp(firebaseConfig);
      } else {
        initializedApp = window.firebase.app();
      }

      authInstance = window.firebase.auth();
      firestoreInstance = window.firebase.firestore();

      // Configuração de persistência offline resiliente
      if (firestoreInstance.enablePersistence) {
        firestoreInstance.enablePersistence({ synchronizeTabs: true }).catch(function(err) {
          if (err.code === 'failed-precondition') {
            // Múltiplas abas abertas simultaneamente (persistência em apenas uma)
          } else if (err.code === 'unimplemented') {
            // Navegador não suporta persistência nativa
          }
        });
      }

      return true;
    } catch (err) {
      console.error('[ACTA Firebase] Erro ao inicializar Firebase:', err);
      return false;
    }
  }

  // Tenta inicializar se os SDKs já foram carregados
  if (window.firebase) {
    initFirebase();
  }

  window.ActaFirebase = {
    config: firebaseConfig,
    init: initFirebase,
    getApp: function() { return initializedApp || (window.firebase && window.firebase.apps.length ? window.firebase.app() : null); },
    getAuth: function() { return authInstance || (window.firebase ? window.firebase.auth() : null); },
    getFirestore: function() { return firestoreInstance || (window.firebase ? window.firebase.firestore() : null); },
    setApiKey: function(key) {
      if (key && typeof key === 'string') {
        localStorage.setItem('ACTA_FIREBASE_API_KEY', key.trim());
        firebaseConfig.apiKey = key.trim();
        if (window.firebase) {
          try {
            if (window.firebase.apps.length) {
              window.firebase.app().delete().then(function() {
                initFirebase();
              });
            } else {
              initFirebase();
            }
          } catch(e) {}
        }
      }
    }
  };
})(window);
