/**
 * PLANNER ACTA — Gerenciador de Autenticação (Firebase Authentication)
 * 
 * Funcionalidades:
 * - Cadastro individual seguro (nome, email, senha)
 * - Login com validação
 * - Logout seguro (encerra sessão e limpa cache volátil)
 * - Redefinição de senha via e-mail oficial do Firebase
 * - Tradução de códigos de erro para português amigável
 * - Eventos reativos de mudança de estado de autenticação
 */

(function(window) {
  'use strict';

  const AUTH_STATE_KEY = 'ACTA_CURRENT_USER_UID';
  const listeners = [];
  let currentUser = null;
  let userProfile = null;
  let isAuthReady = false;

  function translateAuthError(error) {
    if (!error) return 'Ocorreu um erro desconhecido. Tente novamente.';
    const code = error.code || '';
    switch (code) {
      case 'auth/invalid-email':
        return 'O endereço de e-mail informado não é válido.';
      case 'auth/user-disabled':
        return 'Esta conta foi suspensa ou desativada.';
      case 'auth/user-not-found':
        return 'Nenhuma conta encontrada com este endereço de e-mail.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'E-mail ou senha incorretos. Verifique e tente novamente.';
      case 'auth/email-already-in-use':
        return 'Já existe uma conta cadastrada com este e-mail.';
      case 'auth/weak-password':
        return 'A senha é muito fraca. Utilize pelo menos 6 caracteres.';
      case 'auth/network-request-failed':
        return 'Falha de conexão com a rede. Verifique seu acesso à internet.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas sem sucesso. Por segurança, tente novamente em alguns instantes.';
      case 'auth/api-key-not-valid':
      case 'auth/invalid-api-key':
        return 'Configuração da chave de API pública do Firebase pendente.';
      default:
        return error.message || 'Erro durante a operação. Tente novamente.';
    }
  }

  function notifyListeners(user) {
    listeners.forEach(function(callback) {
      try {
        callback(user);
      } catch (err) {
        console.error('[ACTA Auth] Erro no listener de autenticação:', err);
      }
    });
  }

  function getAuth() {
    if (window.ActaFirebase && window.ActaFirebase.getAuth) {
      return window.ActaFirebase.getAuth();
    }
    return window.firebase ? window.firebase.auth() : null;
  }

  // Inicializa o observador de estado do Firebase Auth
  function initAuthObserver() {
    const auth = getAuth();
    if (!auth) {
      console.warn('[ACTA Auth] SDK de autenticação ainda não carregado. Aguardando...');
      setTimeout(initAuthObserver, 150);
      return;
    }

    auth.onAuthStateChanged(async function(user) {
      currentUser = user;
      isAuthReady = true;

      if (user) {
        localStorage.setItem(AUTH_STATE_KEY, user.uid);
        // Sincroniza dados com o Firestore para este UID isolado
        if (window.ActaFirestoreSync) {
          try {
            userProfile = await window.ActaFirestoreSync.loadUserData(user.uid);
          } catch (err) {
            console.warn('[ACTA Auth] Aviso ao carregar perfil do Firestore:', err);
          }
        }
      } else {
        const prevUid = currentUser ? currentUser.uid : localStorage.getItem(AUTH_STATE_KEY);
        localStorage.removeItem(AUTH_STATE_KEY);
        userProfile = null;
        if (window.ActaFirestoreSync) {
          window.ActaFirestoreSync.clearLocalSession(prevUid);
        }
      }

      notifyListeners(currentUser);
    }, function(error) {
      console.error('[ACTA Auth] Erro no observador onAuthStateChanged:', error);
      isAuthReady = true;
      notifyListeners(null);
    });
  }

  // Inicia observer quando a janela estiver pronta
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuthObserver);
  } else {
    initAuthObserver();
  }

  const ActaAuth = {
    /**
     * Cadastra um novo usuário no Firebase Authentication
     * e cria o perfil individual inicial sob /users/{uid}
     */
    signUp: async function(name, email, password, confirmPassword) {
      if (!name || !name.trim()) {
        throw new Error('Por favor, informe seu nome.');
      }
      if (!email || !email.trim()) {
        throw new Error('Por favor, informe um endereço de e-mail válido.');
      }
      if (!password || password.length < 6) {
        throw new Error('A senha deve conter no mínimo 6 caracteres.');
      }
      if (password !== confirmPassword) {
        throw new Error('A confirmação de senha não confere com a senha digitada.');
      }

      const auth = getAuth();
      if (!auth) {
        throw new Error('Serviço de autenticação não disponível no momento.');
      }

      try {
        const userCredential = await auth.createUserWithEmailAndPassword(email.trim(), password);
        const user = userCredential.user;

        // Atualiza displayName no Firebase Auth
        if (user.updateProfile) {
          await user.updateProfile({ displayName: name.trim() });
        }

        // Inicializa o perfil e espaço individual no Firestore sob /users/{uid}
        if (window.ActaFirestoreSync) {
          await window.ActaFirestoreSync.initUserProfile(user, name.trim());
        }

        return user;
      } catch (err) {
        throw new Error(translateAuthError(err));
      }
    },

    /**
     * Realiza login com e-mail e senha
     */
    signIn: async function(email, password) {
      if (!email || !email.trim()) {
        throw new Error('Por favor, informe seu e-mail.');
      }
      if (!password) {
        throw new Error('Por favor, informe sua senha.');
      }

      const auth = getAuth();
      if (!auth) {
        throw new Error('Serviço de autenticação não disponível no momento.');
      }

      try {
        const userCredential = await auth.signInWithEmailAndPassword(email.trim(), password);
        return userCredential.user;
      } catch (err) {
        throw new Error(translateAuthError(err));
      }
    },

    /**
     * Encerra a sessão do usuário de forma segura.
     * Os dados no Firestore e backup local permanecem preservados.
     */
    signOut: async function() {
      const auth = getAuth();
      const prevUid = currentUser ? currentUser.uid : localStorage.getItem(AUTH_STATE_KEY);
      if (auth) {
        await auth.signOut();
      }
      currentUser = null;
      userProfile = null;
      localStorage.removeItem(AUTH_STATE_KEY);
      if (window.ActaFirestoreSync) {
        window.ActaFirestoreSync.clearLocalSession(prevUid);
      }
      notifyListeners(null);
    },

    /**
     * Envia e-mail oficial para redefinição de senha
     */
    resetPassword: async function(email) {
      if (!email || !email.trim()) {
        throw new Error('Por favor, informe o e-mail cadastrado para redefinir a senha.');
      }

      const auth = getAuth();
      if (!auth) {
        throw new Error('Serviço de autenticação não disponível no momento.');
      }

      try {
        await auth.sendPasswordResetEmail(email.trim());
        return 'Link de redefinição enviado com sucesso! Verifique sua caixa de entrada e pasta de spam.';
      } catch (err) {
        throw new Error(translateAuthError(err));
      }
    },

    /**
     * Retorna o usuário autenticado atualmente
     */
    getCurrentUser: function() {
      return currentUser;
    },

    /**
     * Retorna o UID do usuário atual (ou null se visitante)
     */
    getUserUid: function() {
      return currentUser ? currentUser.uid : null;
    },

    /**
     * Retorna os metadados do perfil do Firestore (/users/{uid})
     */
    getUserProfile: function() {
      return userProfile;
    },

    /**
     * Verifica se há usuário autenticado
     */
    isAuthenticated: function() {
      return Boolean(currentUser && currentUser.uid);
    },

    /**
     * Registra callback para mudanças de estado de autenticação
     */
    onAuthStateChanged: function(callback) {
      if (typeof callback === 'function') {
        listeners.push(callback);
        if (isAuthReady) {
          callback(currentUser);
        }
      }
    },

    /**
     * Traduz erros do Firebase para português
     */
    translateError: translateAuthError
  };

  window.ActaAuth = ActaAuth;
})(window);
