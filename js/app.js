/**
 * PLANNER ACTA — Controlador da Interface
 * Gerencia o "Caderno Inteligente da Família", navegação lateral e reatividade dos módulos.
 */

(function(window) {
  'use strict';

  const THEME_VISUALS = {
    natureza: {
      name: 'Natureza',
      banner: 'assets/banner-natureza.jpg',
      planejar: 'assets/illus-planejar-natureza.png',
      registrar: 'assets/illus-registrar-natureza.png',
      acompanhar: 'assets/illus-acompanhar-natureza.png',
      sideCard: 'assets/card-pequenos-natureza.jpg',
      sidebarDecor: 'assets/sidebar-decor-natureza.png',
      bannerOverlay: 'transparent'
    },
    classico: {
      name: 'Clássico',
      banner: 'assets/banner-classico.jpg',
      planejar: 'assets/illus-planejar-classico.jpg',
      registrar: 'assets/illus-registrar-classico.jpg',
      acompanhar: 'assets/illus-acompanhar-classico.jpg',
      sideCard: 'assets/card-pequenos-classico.jpg',
      sidebarDecor: 'assets/sidebar-decor-classico.png',
      bannerOverlay: 'transparent'
    },
    alegre: {
      name: 'Alegre',
      banner: 'assets/banner-alegre.jpg',
      planejar: 'assets/illus-planejar-alegre.jpg',
      registrar: 'assets/illus-registrar-alegre.jpg',
      acompanhar: 'assets/illus-acompanhar-alegre.jpg',
      sideCard: 'assets/card-pequenos-alegre.jpg',
      sidebarDecor: 'assets/sidebar-decor-alegre.png',
      bannerOverlay: 'transparent'
    },
    elegante: {
      name: 'Elegante',
      banner: 'assets/banner-elegante.jpg',
      planejar: 'assets/illus-planejar-elegante.jpg',
      registrar: 'assets/illus-registrar-elegante.jpg',
      acompanhar: 'assets/illus-acompanhar-elegante.jpg',
      sideCard: 'assets/card-pequenos-elegante.jpg',
      sidebarDecor: 'assets/sidebar-decor-elegante.png',
      bannerOverlay: 'transparent'
    },
    criativo: {
      name: 'Criativo',
      banner: 'assets/banner-criativo.jpg',
      planejar: 'assets/illus-planejar-criativo.jpg',
      registrar: 'assets/illus-registrar-criativo.jpg',
      acompanhar: 'assets/illus-acompanhar-criativo.jpg',
      sideCard: 'assets/card-pequenos-criativo.jpg',
      sidebarDecor: 'assets/sidebar-decor-criativo.png',
      bannerOverlay: 'transparent'
    },
    romantico: {
      name: 'Romântico',
      banner: 'assets/banner-romantico.jpg',
      planejar: 'assets/illus-planejar-natureza.png',
      registrar: 'assets/illus-registrar-natureza.png',
      acompanhar: 'assets/illus-acompanhar-natureza.png',
      sideCard: 'assets/card-pequenos-natureza.jpg',
      sidebarDecor: 'assets/sidebar-decor-natureza.png',
      bannerOverlay: 'transparent'
    }
  };

  const ActaApp = {
    currentTab: 'casa',
    tempEvidenceImg: '',
    selectedSubjectFilter: 'Todos',
    selectedActivities: ['Exercícios'],
    selectedResult: 'compreendeu',

    init: function() {
      // 0. Checagem de Ativação Automática via URL (Link Mágico / Hotmart)
      this.checkUrlActivation();

      // 1. Aplicar tema salvo
      const savedTheme = ActaStorage.getActiveTheme();
      this.applyTheme(savedTheme);

      // Registrar métrica de visita única por sessão
      if (typeof ActaStorage.logVisitOncePerSession === 'function') {
        ActaStorage.logVisitOncePerSession();
      }

      // 2. Inicializar observador de autenticação (Firebase Auth)
      this.initAuth();

      // 3. Renderizar componentes iniciais
      this.renderSidebar();
      this.renderCasaTab();
      this.renderCriancasTab();
      this.renderMaterialsTab();
      this.renderSemanaTab();
      this.setupRegistrosForm();
      this.renderCaminhadaTab();
      this.renderDossieTab();
      this.renderConfiguracoesTab();

      // 4. Setup de navegação e listeners
      this.setupNavigation();
      this.updateProNavigationUI();
    },

    checkUrlActivation: function() {
      try {
        if (typeof window === 'undefined' || !window.location || !window.location.search) return;
        const params = new URLSearchParams(window.location.search);
        const key = params.get('ativar') || params.get('key') || params.get('chave') || params.get('cupom');
        const isHotmartSuccess = params.get('status') === 'approved' || params.get('hotmart') === 'success';

        if (key || isHotmartSuccess) {
          const codeToUse = key || 'HOTMART-PRO';
          if (typeof ActaStorage.activatePremium === 'function') {
            const success = ActaStorage.activatePremium(codeToUse);
            if (success) {
              if (window.history && window.history.replaceState) {
                const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
                window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
              }

              setTimeout(() => {
                this.showToast('🎉 Parabéns! Seu Planner ACTA Completo foi liberado com sucesso!');
                this.updateProNavigationUI();
                this.refreshAllTabs();
              }, 400);
            }
          }
        }
      } catch (e) {
        console.warn('Erro ao processar URL de ativação:', e);
      }
    },

    // ==========================================
    // AUTENTICAÇÃO E PORTAL DE ACESSO
    // ==========================================
    initAuth: function() {
      if (window.ActaAuth && typeof window.ActaAuth.onAuthStateChanged === 'function') {
        window.ActaAuth.onAuthStateChanged(user => {
          this.handleAuthStateChange(user);
        });
      }
    },

    handleAuthStateChange: function(user) {
      const portal = document.getElementById('actaAuthPortal');
      const userNameEl = document.getElementById('sidebarUserName');
      const userBadgeEl = document.getElementById('sidebarUserBadge');
      const userInitialEl = document.getElementById('sidebarUserInitial');

      if (user) {
        if (portal) portal.classList.add('hidden');
        if (userNameEl) {
          userNameEl.textContent = user.displayName || (user.email ? user.email.split('@')[0] : 'Minha Família');
        }
        if (userBadgeEl) {
          const profile = window.ActaAuth.getUserProfile();
          userBadgeEl.textContent = (profile && profile.plan === 'premium') ? 'Premium' : 'Free';
        }
        if (userInitialEl) {
          const name = user.displayName || user.email || 'A';
          userInitialEl.textContent = name.charAt(0).toUpperCase();
        }
        this.refreshAllTabs();
        this.updateProNavigationUI();
        if (window.ActaTutorial && typeof window.ActaTutorial.checkAutoStart === 'function') {
          window.ActaTutorial.checkAutoStart(user.uid);
        }
      } else {
        if (portal) portal.classList.remove('hidden');
        if (userNameEl) userNameEl.textContent = 'Minha Família';
        if (userBadgeEl) userBadgeEl.textContent = 'Visitante';
        if (userInitialEl) userInitialEl.innerHTML = '<i class="fa-solid fa-user"></i>';
        this.clearPrivateViews();
      }
    },

    clearPrivateViews: function() {
      const containerIds = [
        'peopleGrid', 'sidebarActiveChildPill', 'timelineFeed',
        'recordsTableBody', 'materialsGrid', 'bookshelfContainer',
        'cinematecaGrid', 'calendarGrid', 'evaluationsList', 'extrasGrid'
      ];
      containerIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '';
      });
    },

    switchAuthTab: function(tab) {
      const btnIn = document.getElementById('authTabBtnSignIn');
      const btnUp = document.getElementById('authTabBtnSignUp');
      const formIn = document.getElementById('authFormSignIn');
      const formUp = document.getElementById('authFormSignUp');
      const formReset = document.getElementById('authFormResetPassword');
      const alertEl = document.getElementById('authAlertMessage');

      if (alertEl) alertEl.classList.add('hidden');
      if (formReset) formReset.classList.add('hidden');

      if (tab === 'signup') {
        if (btnUp) {
          btnUp.className = 'flex-1 py-2.5 text-center border-b-2 border-[#2F5233] text-[#2F5233]';
        }
        if (btnIn) {
          btnIn.className = 'flex-1 py-2.5 text-center text-[#8E9A8F] hover:text-[#28302A] border-b-2 border-transparent';
        }
        if (formIn) formIn.classList.add('hidden');
        if (formUp) formUp.classList.remove('hidden');
      } else {
        if (btnIn) {
          btnIn.className = 'flex-1 py-2.5 text-center border-b-2 border-[#2F5233] text-[#2F5233]';
        }
        if (btnUp) {
          btnUp.className = 'flex-1 py-2.5 text-center text-[#8E9A8F] hover:text-[#28302A] border-b-2 border-transparent';
        }
        if (formIn) formIn.classList.remove('hidden');
        if (formUp) formUp.classList.add('hidden');
      }
    },

    showResetPasswordView: function() {
      const formIn = document.getElementById('authFormSignIn');
      const formUp = document.getElementById('authFormSignUp');
      const formReset = document.getElementById('authFormResetPassword');
      const alertEl = document.getElementById('authAlertMessage');

      if (alertEl) alertEl.classList.add('hidden');
      if (formIn) formIn.classList.add('hidden');
      if (formUp) formUp.classList.add('hidden');
      if (formReset) formReset.classList.remove('hidden');
    },

    showAuthAlert: function(message, type) {
      const alertEl = document.getElementById('authAlertMessage');
      if (!alertEl) return;
      alertEl.textContent = message;
      alertEl.classList.remove('hidden', 'bg-rose-50', 'border-rose-200', 'text-rose-700', 'bg-emerald-50', 'border-emerald-200', 'text-emerald-700');
      if (type === 'error') {
        alertEl.classList.add('bg-rose-50', 'border-rose-200', 'text-rose-700');
      } else {
        alertEl.classList.add('bg-emerald-50', 'border-emerald-200', 'text-emerald-700');
      }
    },

    handleSignInSubmit: async function() {
      const email = document.getElementById('authSignInEmail')?.value;
      const pass = document.getElementById('authSignInPassword')?.value;
      const btn = document.getElementById('btnAuthSignInSubmit');
      if (!btn) return;

      const originalHtml = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Acessando...';

      try {
        await window.ActaAuth.signIn(email, pass);
        this.showToast('Login realizado com sucesso! Bem-vindo(a) ao ACTA.');
      } catch (err) {
        this.showAuthAlert(err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
      }
    },

    handleSignUpSubmit: async function() {
      const name = document.getElementById('authSignUpName')?.value;
      const email = document.getElementById('authSignUpEmail')?.value;
      const pass = document.getElementById('authSignUpPassword')?.value;
      const confirmPass = document.getElementById('authSignUpConfirmPassword')?.value;
      const btn = document.getElementById('btnAuthSignUpSubmit');
      if (!btn) return;

      const originalHtml = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Criando conta...';

      try {
        await window.ActaAuth.signUp(name, email, pass, confirmPass);
        this.showToast('Conta criada com sucesso! Seu espaço individual foi preparado.');
      } catch (err) {
        this.showAuthAlert(err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
      }
    },

    handleResetPasswordSubmit: async function() {
      const email = document.getElementById('authResetEmail')?.value;
      const btn = document.getElementById('btnAuthResetSubmit');
      if (!btn) return;

      const originalHtml = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin mr-1"></i> Enviando...';

      try {
        const msg = await window.ActaAuth.resetPassword(email);
        this.showAuthAlert(msg, 'success');
      } catch (err) {
        this.showAuthAlert(err.message, 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalHtml;
      }
    },

    handleSignOut: async function() {
      if (confirm('Deseja realmente sair da sua conta? Seus dados salvos continuam seguros na nuvem.')) {
        await window.ActaAuth.signOut();
        this.showToast('Sessão encerrada com segurança.');
      }
    },

    openAuthModal: function(tab) {
      const portal = document.getElementById('actaAuthPortal');
      if (portal) {
        portal.classList.remove('hidden');
        this.switchAuthTab(tab || 'signin');
      }
    },

    closeAuthModal: function() {
      const portal = document.getElementById('actaAuthPortal');
      if (portal) {
        portal.classList.add('hidden');
      }
    },

    refreshAllTabs: function() {
      this.renderSidebar();
      this.renderCasaTab();
      this.renderCriancasTab();
      this.renderMaterialsTab();
      this.renderSemanaTab();
      this.renderCaminhadaTab();
      this.renderDossieTab();
      this.renderConfiguracoesTab();
      if (window.ActaCulture) {
        if (typeof window.ActaCulture.renderBookshelf === 'function') window.ActaCulture.renderBookshelf();
        if (typeof window.ActaCulture.renderCinemateca === 'function') window.ActaCulture.renderCinemateca();
      }
      if (window.ActaCalendar && typeof window.ActaCalendar.render === 'function') {
        window.ActaCalendar.render();
      }
      if (window.ActaDiagnostic && typeof window.ActaDiagnostic.render === 'function') {
        window.ActaDiagnostic.render();
      }
      if (window.ActaExtras && typeof window.ActaExtras.render === 'function') {
        window.ActaExtras.render();
      }
      if (window.ActaRecords && typeof window.ActaRecords.renderTimelineTab === 'function') {
        window.ActaRecords.renderTimelineTab();
      }
    },

    // ==========================================
    // TEMAS E NAVEGAÇÃO
    // ==========================================
    applyTheme: function(themeName) {
      if (!themeName || !THEME_VISUALS[themeName]) {
        themeName = 'natureza';
      }

      document.documentElement.setAttribute('data-theme', themeName);
      document.body.setAttribute('data-theme', themeName);
      ActaStorage.setActiveTheme(themeName);
      
      const themeSelect = document.getElementById('themeSidebarSelect');
      if (themeSelect) themeSelect.value = themeName;

      // Obter configuração visual completa do tema
      const visuals = THEME_VISUALS[themeName];

      // 1. Atualizar Banner Superior da Página Inicial
      const bannerEl = document.getElementById('heroBannerContainer');
      const overlayEl = document.getElementById('heroBannerOverlay');
      if (bannerEl) {
        bannerEl.style.backgroundImage = `url('${visuals.banner}')`;
      }
      if (overlayEl) {
        overlayEl.style.background = visuals.bannerOverlay;
      }

      // 2. Atualizar Ilustrações dos 3 Cartões de Ação na Home
      const pImg = document.getElementById('illusPlanejarImg');
      const rImg = document.getElementById('illusRegistrarImg');
      const aImg = document.getElementById('illusAcompanharImg');
      if (pImg) pImg.src = visuals.planejar;
      if (rImg) rImg.src = visuals.registrar;
      if (aImg) aImg.src = visuals.acompanhar;

      // 3. Atualizar Cartão Motivacional Lateral da Home
      const sideCardImg = document.getElementById('homeMotivationalCardImg');
      if (sideCardImg) sideCardImg.src = visuals.sideCard;

      // 4. Atualizar Decoração Temática da Base da Sidebar
      const sidebarDecorImg = document.getElementById('sidebarDecorImg');
      if (sidebarDecorImg) sidebarDecorImg.src = visuals.sidebarDecor;

      // 5. Atualizar os cartões de tema visual na Home com destaque instantâneo
      document.querySelectorAll('.theme-card-option').forEach(card => {
        const theme = card.getAttribute('data-theme-name');
        const checkIcon = card.querySelector('.theme-check-icon');
        if (theme === themeName) {
          card.classList.add('shadow-md', 'scale-105');
          card.style.borderColor = 'var(--primary)';
          card.style.boxShadow = '0 0 0 3px var(--primary-light), 0 4px 14px rgba(0,0,0,0.08)';
          if (checkIcon) {
            checkIcon.classList.remove('hidden');
            checkIcon.style.backgroundColor = 'var(--primary)';
          }
        } else {
          card.classList.remove('shadow-md', 'scale-105');
          card.style.borderColor = 'var(--border-color)';
          card.style.boxShadow = 'none';
          if (checkIcon) checkIcon.classList.add('hidden');
        }
      });
    },

    setupNavigation: function() {
      document.querySelectorAll('[data-nav-target]').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.getAttribute('data-nav-target');
          this.switchTab(target);
        });
      });
    },

    switchTab: function(tabName) {
      // Aliases para manter compatibilidade
      if (tabName === 'hoje') tabName = 'casa';
      if (tabName === 'pessoas') tabName = 'criancas';
      if (tabName === 'materiais') tabName = 'biblioteca';
      if (tabName === 'planejamento') tabName = 'semana';
      if (tabName === 'registrar') tabName = 'registros';
      if (tabName === 'acompanhamento' || tabName === 'timeline') tabName = 'caminhada';
      if (tabName === 'relatorios') tabName = 'dossie';

      this.currentTab = tabName;

      // Ocultar todas as abas
      document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.add('hidden'));

      // Exibir aba ativa
      const activePane = document.getElementById(`tab-${tabName}`);
      if (activePane) {
        activePane.classList.remove('hidden');
      }

      // Atualizar botões da barra lateral e menu mobile
      document.querySelectorAll('[data-nav-target]').forEach(btn => {
        const target = btn.getAttribute('data-nav-target');
        if (target === tabName || (target === 'casa' && tabName === 'casa')) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      // Validação de Abas Exclusivas do Plano ACTA Completo (PRO)
      const proTabs = ['leituras', 'filmes', 'passeios', 'caminhada', 'linhadotempo', 'dossie'];
      const isProTab = proTabs.includes(tabName);
      const isPremium = typeof ActaStorage.isPremiumUser === 'function' ? ActaStorage.isPremiumUser() : false;

      if (isProTab && !isPremium) {
        this.renderProLockView(tabName, activePane);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      } else if (activePane) {
        const oldShowcase = activePane.querySelector('.acta-pro-showcase');
        if (oldShowcase) oldShowcase.remove();
        activePane.querySelectorAll(':scope > div:not(.acta-pro-showcase)').forEach(el => el.classList.remove('hidden'));
      }

      // Atualizar dados ao entrar na aba
      if (tabName === 'casa') this.renderCasaTab();
      if (tabName === 'criancas') this.renderCriancasTab();
      if (tabName === 'avaliacoes') this.renderAvaliacoesTab();
      if (tabName === 'biblioteca') this.renderMaterialsTab();
      if (tabName === 'leituras') this.renderLeiturasTab();
      if (tabName === 'filmes') this.renderFilmesTab();
      if (tabName === 'calendario') this.renderCalendarioTab();
      if (tabName === 'semana') this.renderSemanaTab();
      if (tabName === 'registros') this.updateRegisterDropdowns();
      if (tabName === 'passeios') this.renderPasseiosTab();
      if (tabName === 'caminhada') this.renderCaminhadaTab();
      if (tabName === 'linhadotempo') this.renderLinhaDoTempoTab();
      if (tabName === 'dossie') this.renderDossieTab();
      if (tabName === 'configuracoes') this.renderConfiguracoesTab();

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // ==========================================
    // TELA: LEITURAS & LITERATURA
    // ==========================================
    renderLeiturasTab: function() {
      if (window.ActaCulture) {
        const childSelect = document.getElementById('readingFilterChildSelect');
        if (childSelect) {
          const people = ActaStorage.getPeople();
          const curr = childSelect.value || 'all';
          childSelect.innerHTML = `<option value="all">Todas as crianças</option>` + people.map(p => `
            <option value="${p.id}">${p.name}</option>
          `).join('');
          childSelect.value = curr;
        }
        const container = document.getElementById('readingsShelfContainer');
        if (container) container.innerHTML = window.ActaCulture.renderBookshelfHTML();
      }
    },

    onReadingFilterChange: function() {
      if (!window.ActaCulture) return;
      const childSelect = document.getElementById('readingFilterChildSelect');
      const catSelect = document.getElementById('readingFilterCatSelect');
      const statusSelect = document.getElementById('readingFilterStatusSelect');
      if (childSelect) window.ActaCulture.readingFilters.childId = childSelect.value;
      if (catSelect) window.ActaCulture.readingFilters.category = catSelect.value;
      if (statusSelect) window.ActaCulture.readingFilters.status = statusSelect.value;
      const container = document.getElementById('readingsShelfContainer');
      if (container) container.innerHTML = window.ActaCulture.renderBookshelfHTML();
    },

    // ==========================================
    // TELA: FILMES & CULTURA
    // ==========================================
    renderFilmesTab: function() {
      if (window.ActaCulture) {
        const childSelect = document.getElementById('movieFilterChildSelect');
        if (childSelect) {
          const people = ActaStorage.getPeople();
          const curr = childSelect.value || 'all';
          childSelect.innerHTML = `<option value="all">Toda a família</option>` + people.map(p => `
            <option value="${p.id}">${p.name}</option>
          `).join('');
          childSelect.value = curr;
        }
        const container = document.getElementById('moviesCinematecaContainer');
        if (container) container.innerHTML = window.ActaCulture.renderCinematecaHTML();
        const moviesCountBadge = document.getElementById('moviesCountBadge');
        if (moviesCountBadge) {
          const movies = ActaStorage.getMovies ? ActaStorage.getMovies() : [];
          moviesCountBadge.textContent = movies.length;
        }
      }
    },

    onMovieFilterChange: function() {
      if (!window.ActaCulture) return;
      const childSelect = document.getElementById('movieFilterChildSelect');
      const catSelect = document.getElementById('movieFilterCatSelect');
      if (childSelect) window.ActaCulture.movieFilters.childId = childSelect.value;
      if (catSelect) window.ActaCulture.movieFilters.category = catSelect.value;
      const container = document.getElementById('moviesCinematecaContainer');
      if (container) container.innerHTML = window.ActaCulture.renderCinematecaHTML();
    },

    renderSidebar: function() {
      const activePerson = ActaStorage.getActivePerson();
      const sidebarPill = document.getElementById('sidebarActiveChildPill');
      if (sidebarPill && activePerson) {
        sidebarPill.innerHTML = `
          <div class="w-8 h-8 rounded-full overflow-hidden border border-[#CCD8CD] bg-[#EBF3ED] flex items-center justify-center shrink-0">
            ${ActaStorage.renderAvatarHTML(activePerson.avatar, 'w-full h-full object-cover', activePerson.name)}
          </div>
          <div class="text-left truncate">
            <span class="text-xs font-bold text-[#28302A] block leading-none truncate">${activePerson.name}</span>
          </div>
        `;
      }
      this.updateProNavigationUI();
    },

    // ==========================================
    // TELA 1: MINHA CASA (DASHBOARD PRINCIPAL)
    // ==========================================
    renderCasaTab: function() {
      const people = ActaStorage.getPeople();
      const activePerson = ActaStorage.getActivePerson();
      const container = document.getElementById('casaChildrenList');
      if (!container) return;

      container.innerHTML = people.map((p, idx) => {
        const isActive = activePerson && activePerson.id === p.id;
        let cardBgClass = 'bg-[#FAF7F0] border-[#E8E2D5]';
        
        if (p.name.toLowerCase().includes('joão') || p.name.toLowerCase().includes('joao')) {
          cardBgClass = 'card-child-joao';
        } else if (p.name.toLowerCase().includes('sofia')) {
          cardBgClass = 'card-child-sofia';
        } else if (idx % 2 === 0) {
          cardBgClass = 'bg-[#F0F7F2] border-[#D9EADB]';
        } else {
          cardBgClass = 'bg-[#FFF6ED] border-[#FCE6D2]';
        }

        return `
          <div 
            onclick="ActaApp.selectChild('${p.id}')"
            class="shrink-0 flex items-center justify-between p-3 sm:px-4 sm:py-3.5 rounded-2xl cursor-pointer transition border ${cardBgClass} ${isActive ? 'ring-2 ring-[#2F5233] shadow-sm' : 'hover:shadow-sm'} min-w-[220px] sm:min-w-[240px]"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-12 h-12 rounded-full overflow-hidden border-2 ${isActive ? 'border-[#2F5233]' : 'border-white'} shadow-xs shrink-0 bg-white">
                ${ActaStorage.renderAvatarHTML(p.avatar, 'w-full h-full object-cover', p.name)}
              </div>
              <div class="text-left min-w-0">
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="text-base font-bold text-[#28302A] leading-tight truncate">${p.name}</span>
                  ${isActive ? '<span class="text-[10px] bg-[#2F5233] text-white font-bold px-2 py-0.5 rounded-full shrink-0">Ativo</span>' : ''}
                </div>
                <span class="text-[11px] text-[#667267] block mt-0.5 truncate">${p.schoolYearLabel ? p.schoolYearLabel.split('(')[0].trim() : 'Estudante'}</span>
              </div>
            </div>
            ${isActive ? '<i class="fa-solid fa-circle-check text-sm text-[#2F5233] ml-3 shrink-0"></i>' : '<i class="fa-solid fa-chevron-right text-xs text-[#8E9A8F] ml-3 shrink-0"></i>'}
          </div>
        `;
      }).join('') + `
        <div 
          onclick="ActaApp.openModal('modalNewPerson')"
          class="card-child-add shrink-0 flex items-center gap-3 p-3 sm:px-4 sm:py-3.5 rounded-2xl cursor-pointer transition text-[#667267] hover:text-[#28302A] min-w-[200px]"
        >
          <div class="w-11 h-11 rounded-full border-2 border-dashed border-[#8E9A8F] flex items-center justify-center text-base text-[#8E9A8F] shrink-0">
            <i class="fa-solid fa-plus"></i>
          </div>
          <div class="text-left">
            <span class="text-xs font-bold text-[#28302A] block leading-tight">Adicionar criança</span>
            <span class="text-[10px] text-[#8E9A8F] block mt-0.5">Novo membro da família</span>
          </div>
        </div>
      `;

      // Atualiza indicador de formação cultural na Home
      const statsText = document.getElementById('casaCultureStatsText');
      if (statsText) {
        const readings = ActaStorage.getReadings ? ActaStorage.getReadings() : [];
        const movies = ActaStorage.getMovies ? ActaStorage.getMovies() : [];
        const completedReadings = readings.filter(r => (r.status || 'concluido') === 'concluido').length;
        statsText.innerHTML = `<strong>${completedReadings}</strong> ${completedReadings === 1 ? 'livro lido' : 'livros lidos'} · <strong>${movies.length}</strong> ${movies.length === 1 ? 'filme em família' : 'filmes em família'}`;
      }

      // Renderiza as Aulas de Hoje no Roteiro Diário da Home
      const todayTitleEl = document.getElementById('casaTodayTitle');
      const todaySubtitleEl = document.getElementById('casaTodaySubtitle');
      const todayListEl = document.getElementById('casaTodayList');

      if (todayListEl) {
        const dayKeys = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
        const dayTitles = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const now = new Date();
        const dayIndex = now.getDay();
        const currentDayKey = dayKeys[dayIndex];
        const currentDayTitle = dayTitles[dayIndex];

        let schedule = ActaStorage.getWeekSchedule() || [];
        // Se a semana estiver totalmente vazia e a criança ativa tiver ano letivo, auto-gera
        const totalItems = schedule.reduce((acc, d) => acc + (d.items ? d.items.length : 0), 0);
        if (totalItems === 0 && activePerson && activePerson.schoolYear && window.ActaCurriculum && typeof window.ActaCurriculum.applyGradeToSchedule === 'function') {
          schedule = window.ActaCurriculum.applyGradeToSchedule(activePerson.id, activePerson.schoolYear, ['ingles'], false);
        }

        let todayBlock = schedule.find(d => d.dayKey === currentDayKey);
        if (!todayBlock && (currentDayKey === 'domingo' || currentDayKey === 'sabado')) {
          todayBlock = schedule.find(d => d.dayKey === 'segunda') || schedule[0];
        }

        const childName = activePerson ? activePerson.name : 'Estudante';

        if (todayTitleEl) {
          todayTitleEl.textContent = `Aulas de Hoje • ${currentDayTitle}`;
        }
        if (todaySubtitleEl) {
          todaySubtitleEl.textContent = `Rotina de estudos para ${childName}`;
        }

        const items = todayBlock ? (todayBlock.items || []) : [];

        if (items.length === 0) {
          todayListEl.innerHTML = `
            <div class="p-6 text-center rounded-2xl bg-[#FAF7F0] border border-[#E8E2D5] text-[#667267] space-y-2">
              <i class="fa-regular fa-sun text-2xl text-[#8E9A8F]"></i>
              <p class="text-xs font-medium">Nenhuma aula específica programada para hoje.</p>
              <div class="flex items-center justify-center gap-2 pt-1 flex-wrap">
                <button type="button" onclick="ActaPlanner.openNewPlanModal(null, '${todayBlock ? todayBlock.dayKey : 'segunda'}')" class="text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#EBF3ED] text-[#2F5233] border border-[#2F5233]/30 hover:bg-[#2F5233] hover:text-white transition shadow-2xs">
                  + Adicionar Aula Hoje
                </button>
                <button type="button" onclick="ActaApp.switchTab('leituras')" class="text-xs font-medium px-3.5 py-1.5 rounded-full bg-white text-[#28302A] border border-[#E8E2D5] hover:bg-[#FAF7F0] transition shadow-2xs">
                  Ver Leituras Livres
                </button>
              </div>
            </div>
          `;
        } else {
          todayListEl.innerHTML = items.map((item, itemIdx) => {
            const meta = (window.ActaPlanner && typeof window.ActaPlanner.getSubjectMeta === 'function') 
              ? window.ActaPlanner.getSubjectMeta(item.subject) 
              : { icon: 'fa-book', color: 'text-[#2F5233]', bg: 'bg-[#FAF7F0]' };
            const isDone = item.status === 'concluido';

            return `
              <div class="p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${isDone ? 'bg-[#FAFBF9] border-[#2F5233]/30' : 'bg-white border-[#E8E2D5] hover:border-[#2F5233]/40 shadow-2xs'}">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-8 h-8 rounded-xl ${meta.bg} border border-[#E8E2D5] flex items-center justify-center shrink-0">
                    <i class="fa-solid ${meta.icon} ${meta.color} text-xs"></i>
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5">
                      <span class="text-xs font-bold text-[#28302A] truncate ${isDone ? 'line-through text-[#8E9A8F]' : ''}">${item.subject}</span>
                      ${isDone ? '<span class="text-[9px] bg-[#EBF3ED] text-[#2F5233] font-bold px-1.5 py-0.2 rounded-full">Feita</span>' : ''}
                    </div>
                    <span class="text-[11px] text-[#667267] block truncate ${isDone ? 'line-through text-[#A3ADA4]' : ''}">${item.content}</span>
                  </div>
                </div>

                <div class="flex items-center gap-1.5 shrink-0">
                  <button 
                    type="button"
                    onclick="if(window.ActaCurriculum){ window.ActaCurriculum.togglePlanItemStatus('${todayBlock.dayKey}', ${itemIdx}); ActaApp.renderCasaTab(); }"
                    class="text-xs px-2.5 py-1 rounded-full border transition font-semibold flex items-center gap-1 ${isDone ? 'bg-[#EBF3ED] text-[#2F5233] border-[#2F5233]/30' : 'bg-[#FAF7F0] text-[#667267] border-[#E8E2D5] hover:bg-[#EBF3ED] hover:text-[#2F5233]'}"
                    title="${isDone ? 'Aula concluída! Clique para reabrir' : 'Marcar como feita'}"
                  >
                    <i class="fa-solid ${isDone ? 'fa-circle-check text-[#2F5233]' : 'fa-circle text-[#D4CBBF]'} text-[11px]"></i>
                    <span>${isDone ? 'Feita' : 'Concluir'}</span>
                  </button>

                  <button 
                    type="button" 
                    onclick="ActaApp.openQuickRegisterFromPlan('${item.materialId || ''}', '${encodeURIComponent(item.content)}', '${item.subject}')"
                    class="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EBF3ED] text-[#2F5233] hover:bg-[#2F5233] hover:text-white transition shadow-2xs"
                    title="Registrar vivência"
                  >
                    Registrar
                  </button>
                </div>
              </div>
            `;
          }).join('');
        }
      }

      // Atualiza também os botões de tema visual se houver
      const currentTheme = ActaStorage.getActiveTheme();
      this.applyTheme(currentTheme);
    },

    selectChild: function(personId) {
      ActaStorage.setActivePerson(personId);
      this.renderSidebar();
      this.renderCasaTab();
      this.renderCriancasTab();
      this.renderSemanaTab();
      this.renderLeiturasTab();
      this.renderFilmesTab();
      this.renderCaminhadaTab();
      this.renderDossieTab();
      this.updateRegisterDropdowns();
      const p = ActaStorage.getActivePerson();
      this.showToast(`Acompanhando agora: ${p ? p.name : ''}`);
    },

    // ==========================================
    // TELA 2: CRIANÇAS
    // ==========================================
    calculateAgeAndGrade: function(birthDateString) {
      if (!birthDateString) return null;
      const today = new Date();
      const birth = new Date(birthDateString);
      if (isNaN(birth.getTime())) return null;

      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      if (age < 0) age = 0;

      let recommendedGrade = 'fund1_1ano';
      let recommendedLabel = '1º Ano do Ensino Fundamental (6 a 7 anos)';

      if (age <= 5) {
        recommendedGrade = 'infantil';
        recommendedLabel = 'Educação Infantil (4 a 5 anos)';
      } else if (age === 6 || age === 7) {
        recommendedGrade = 'fund1_1ano';
        recommendedLabel = '1º Ano do Ensino Fundamental (6 a 7 anos)';
      } else if (age === 8) {
        recommendedGrade = 'fund1_2ano';
        recommendedLabel = '2º Ano do Ensino Fundamental (7 a 8 anos)';
      } else if (age === 9) {
        recommendedGrade = 'fund1_3ano';
        recommendedLabel = '3º Ano do Ensino Fundamental (8 a 9 anos)';
      } else if (age === 10) {
        recommendedGrade = 'fund1_5ano';
        recommendedLabel = '5º Ano do Ensino Fundamental (10 a 11 anos)';
      } else if (age === 11) {
        recommendedGrade = 'fund1_5ano';
        recommendedLabel = '5º Ano do Ensino Fundamental (10 a 11 anos)';
      } else if (age >= 12 && age <= 14) {
        recommendedGrade = 'fund2_6a9ano';
        recommendedLabel = 'Anos Finais: 6º ao 9º Ano (11 a 15 anos)';
      } else if (age >= 15) {
        recommendedGrade = 'ensino_medio';
        recommendedLabel = 'Ensino Médio (1º ao 3º Ano)';
      }

      return { age, recommendedGrade, recommendedLabel };
    },

    onBirthDateChange: function(val) {
      const calc = this.calculateAgeAndGrade(val);
      const feedback = document.getElementById('personAgeFeedback');
      const feedbackText = document.getElementById('personAgeFeedbackText');
      const schoolYearSelect = document.getElementById('newPersonSchoolYear');

      if (calc) {
        if (schoolYearSelect) {
          schoolYearSelect.value = calc.recommendedGrade;
        }
        if (feedback && feedbackText) {
          feedbackText.textContent = `${calc.age} anos — Série sugerida: ${calc.recommendedLabel}`;
          feedback.classList.remove('hidden');
        }
      } else if (feedback) {
        feedback.classList.add('hidden');
      }
    },

    openNewPersonModal: function() {
      if (typeof ActaStorage.isPremiumUser === 'function' && !ActaStorage.isPremiumUser()) {
        const currentPeople = ActaStorage.getPeople();
        if (currentPeople.length >= 2) {
          this.openUpgradeModal('No Plano Gratuito você pode acompanhar até 2 crianças. Para cadastrar 3 ou mais filhos sem limites e liberar toda a biblioteca, cinemateca, estante cultural e relatórios, adquira o Planner ACTA Completo por apenas R$ 34,99!');
          return;
        }
      }

      const editId = document.getElementById('editPersonId');
      const nameInput = document.getElementById('newPersonName');
      const birthInput = document.getElementById('newPersonBirthDate');
      const schoolYearSelect = document.getElementById('newPersonSchoolYear');
      const notesInput = document.getElementById('newPersonNotes');
      const avatarInput = document.getElementById('newPersonAvatar');
      const title = document.getElementById('modalPersonTitle');
      const sub = document.getElementById('modalPersonSub');
      const btn = document.getElementById('btnSubmitPersonForm');
      const feedback = document.getElementById('personAgeFeedback');

      if (editId) editId.value = '';
      if (nameInput) nameInput.value = '';
      if (birthInput) birthInput.value = '';
      if (schoolYearSelect) schoolYearSelect.value = 'fund1_1ano';
      if (notesInput) notesInput.value = '';
      if (avatarInput) avatarInput.value = 'assets/avatars/avatar-menino-castanho.png';
      if (title) title.textContent = 'Adicionar Criança';
      if (sub) sub.textContent = 'Cadastre com carinho para acompanhar a caminhada.';
      if (btn) btn.textContent = 'Cadastrar Criança';
      if (feedback) feedback.classList.add('hidden');

      this.openModal('modalNewPerson');
    },

    openEditPersonModal: function(personId) {
      const person = ActaStorage.getPersonById(personId);
      if (!person) return;

      const editId = document.getElementById('editPersonId');
      const nameInput = document.getElementById('newPersonName');
      const birthInput = document.getElementById('newPersonBirthDate');
      const schoolYearSelect = document.getElementById('newPersonSchoolYear');
      const notesInput = document.getElementById('newPersonNotes');
      const avatarInput = document.getElementById('newPersonAvatar');
      const title = document.getElementById('modalPersonTitle');
      const sub = document.getElementById('modalPersonSub');
      const btn = document.getElementById('btnSubmitPersonForm');

      if (editId) editId.value = person.id;
      if (nameInput) nameInput.value = person.name || '';
      if (birthInput) birthInput.value = person.birthDate || '';
      if (schoolYearSelect && person.schoolYear) schoolYearSelect.value = person.schoolYear;
      if (notesInput) notesInput.value = person.notes || '';
      if (avatarInput) avatarInput.value = person.avatar || 'assets/avatars/avatar-menino-castanho.png';
      if (title) title.textContent = `Editar Perfil de ${person.name}`;
      if (sub) sub.textContent = 'Atualize data de nascimento, ano escolar e observações.';
      if (btn) btn.textContent = 'Salvar Alterações';

      if (person.birthDate) {
        this.onBirthDateChange(person.birthDate);
      } else {
        const feedback = document.getElementById('personAgeFeedback');
        if (feedback) feedback.classList.add('hidden');
      }

      this.openModal('modalNewPerson');
    },

    openCurriculumModal: function(childId) {
      if (childId) {
        if (typeof ActaStorage.setActivePerson === 'function') {
          ActaStorage.setActivePerson(childId);
        } else if (typeof ActaStorage.setActivePersonId === 'function') {
          ActaStorage.setActivePersonId(childId);
        }
        this.renderSidebar();
      }
      if (window.ActaCurriculum && typeof window.ActaCurriculum.openCurriculumModal === 'function') {
        window.ActaCurriculum.openCurriculumModal(childId);
      } else {
        this.openModal('modalCurriculumGrade');
      }
    },

    renderCriancasTab: function() {
      const container = document.getElementById('criancasCardsContainer');
      if (!container) return;

      const people = ActaStorage.getPeople();
      const activePerson = ActaStorage.getActivePerson();
      const allReadings = ActaStorage.getReadings ? ActaStorage.getReadings() : [];
      const allMovies = ActaStorage.getMovies ? ActaStorage.getMovies() : [];

      container.innerHTML = people.map(p => {
        const isActive = activePerson && activePerson.id === p.id;
        const childReadings = allReadings.filter(r => r.personId === p.id && (r.status || 'concluido') === 'concluido').length;
        const childMovies = allMovies.filter(m => m.personId === p.id).length;
        const ageLabel = p.birthDate ? `${this.calculateAgeAndGrade(p.birthDate)?.age || ''} anos` : (p.age ? `${p.age} anos` : '');

        return `
          <div class="acta-card p-5 bg-white border border-[#E8E2D5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div 
                onclick="ActaApp.openAvatarModalForPerson('${p.id}')" 
                title="Clique para trocar avatar" 
                class="w-16 h-16 rounded-full bg-[#FAF7F0] border-2 border-[#E8E2D5] hover:border-[#2F5233] flex items-center justify-center shadow-xs shrink-0 overflow-hidden cursor-pointer relative group transition-all"
              >
                ${ActaStorage.renderAvatarHTML(p.avatar, 'w-full h-full object-cover', p.name)}
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-full text-white text-xs">
                  <i class="fa-solid fa-pencil"></i>
                </div>
              </div>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="font-editorial-title text-base font-bold text-[#28302A]">${p.name}</h3>
                  ${isActive ? '<span class="text-[10px] bg-[#EBF3ED] text-[#2F5233] font-bold px-2.5 py-0.5 rounded-full">Ativo</span>' : ''}
                  ${p.schoolYearLabel ? `<span class="text-[10px] font-semibold bg-[#FAF7F0] text-[#2F5233] border border-[#2F5233]/20 px-2.5 py-0.5 rounded-full break-words whitespace-normal inline-flex items-center">🎓 ${p.schoolYearLabel}</span>` : ''}
                  ${ageLabel ? `<span class="text-[10px] font-semibold bg-[#FAF7F0] text-[#667267] border border-[#E8E2D5] px-2 py-0.5 rounded-full">🎂 ${ageLabel}</span>` : ''}
                </div>
                ${p.notes ? `<p class="text-[11px] text-[#8E9A8F] italic mt-0.5">"${p.notes}"</p>` : ''}
                <div class="flex items-center gap-2 pt-1.5 flex-wrap">
                  <span class="text-[10px] font-semibold bg-[#FAF7F0] text-[#2F5233] border border-[#E8E2D5] px-2 py-0.5 rounded-full">
                    📚 ${childReadings} ${childReadings === 1 ? 'leitura' : 'leituras'}
                  </span>
                  <span class="text-[10px] font-semibold bg-[#FAF7F0] text-[#3D6B78] border border-[#E8E2D5] px-2 py-0.5 rounded-full">
                    🎬 ${childMovies} ${childMovies === 1 ? 'filme' : 'filmes'}
                  </span>
                  <button 
                    type="button" 
                    onclick="ActaApp.openEditPersonModal('${p.id}')" 
                    class="text-[11px] text-[#1E3A5F] hover:text-[#0F2238] hover:underline font-semibold inline-flex items-center gap-1 ml-1"
                  >
                    <i class="fa-solid fa-user-pen text-[10px]"></i> Editar dados
                  </button>
                  <button 
                    type="button" 
                    onclick="ActaApp.openAvatarModalForPerson('${p.id}')" 
                    class="text-[11px] text-[#2F5233] hover:text-[#1F3822] hover:underline font-semibold inline-flex items-center gap-1 ml-1"
                  >
                    <i class="fa-solid fa-wand-magic-sparkles text-[10px]"></i> Trocar personagem
                  </button>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button 
                type="button" 
                onclick="ActaApp.openCurriculumModal('${p.id}')" 
                class="text-xs font-semibold px-3.5 py-2 rounded-full border border-[#2F5233]/20 bg-[#FAF7F0] text-[#2F5233] hover:bg-[#EBF3ED] transition flex items-center gap-1.5 shadow-2xs"
                title="Configurar ou aplicar grade curricular sugerida para esta criança"
              >
                <i class="fa-solid fa-wand-magic-sparkles text-[11px]"></i>
                <span>Grade Curricular</span>
              </button>
              <button 
                type="button" 
                onclick="ActaApp.selectChild('${p.id}')"
                class="text-xs font-semibold px-4 py-2 rounded-full border transition ${isActive ? 'bg-[#2F5233] text-white border-[#2F5233]' : 'bg-[#FAF7F0] text-[#28302A] border-[#E8E2D5] hover:bg-[#F4EFE6]'}"
              >
                ${isActive ? 'Selecionado' : 'Selecionar'}
              </button>
            </div>
          </div>
        `;
      }).join('');
    },

    savePersonForm: function() {
      const editId = document.getElementById('editPersonId');
      const nameInput = document.getElementById('newPersonName');
      const birthInput = document.getElementById('newPersonBirthDate');
      const schoolYearSelect = document.getElementById('newPersonSchoolYear');
      const notesInput = document.getElementById('newPersonNotes');
      const avatarInput = document.getElementById('newPersonAvatar');

      if (!nameInput || !nameInput.value.trim()) {
        alert('Por favor, informe o nome da criança.');
        return;
      }

      const birthDate = birthInput ? birthInput.value : '';
      const calc = this.calculateAgeAndGrade(birthDate);
      const schoolYear = schoolYearSelect ? schoolYearSelect.value : (calc ? calc.recommendedGrade : 'fund1_1ano');
      const schoolYearLabel = (schoolYearSelect && schoolYearSelect.selectedOptions && schoolYearSelect.selectedOptions[0])
        ? schoolYearSelect.selectedOptions[0].text
        : (calc ? calc.recommendedLabel : '1º Ano do Ensino Fundamental');

      const isEdit = editId && editId.value;

      if (isEdit) {
        const existing = ActaStorage.getPersonById(editId.value);
        if (existing) {
          existing.name = nameInput.value.trim();
          existing.birthDate = birthDate;
          if (calc) existing.age = calc.age;
          existing.schoolYear = schoolYear;
          existing.schoolYearLabel = schoolYearLabel;
          if (avatarInput && avatarInput.value) existing.avatar = avatarInput.value;
          existing.notes = notesInput ? notesInput.value.trim() : '';

          ActaStorage.updatePerson(existing);

          // Atualiza a grade semanal para o novo ano escolar
          if (window.ActaCurriculum && typeof window.ActaCurriculum.applyGradeToSchedule === 'function') {
            window.ActaCurriculum.applyGradeToSchedule(existing.id, schoolYear, ['ingles'], true);
          }

          this.showToast(`Dados de ${existing.name} atualizados com sucesso!`);
        }
      } else {
        const newPerson = {
          name: nameInput.value.trim(),
          birthDate: birthDate,
          age: calc ? calc.age : null,
          info: '',
          avatar: avatarInput && avatarInput.value ? avatarInput.value : 'assets/avatars/avatar-menino-castanho.png',
          schoolYear: schoolYear,
          schoolYearLabel: schoolYearLabel,
          notes: notesInput ? notesInput.value.trim() : ''
        };

        const added = ActaStorage.addPerson(newPerson);
        if (window.ActaCurriculum && typeof window.ActaCurriculum.applyGradeToSchedule === 'function') {
          window.ActaCurriculum.applyGradeToSchedule(added.id, schoolYear, ['ingles'], true);
        }
        this.showToast(`Criança adicionada com carinho!`);
      }

      this.closeModal('modalNewPerson');
      this.renderSidebar();
      this.renderCasaTab();
      this.renderCriancasTab();
      this.renderSemanaTab();
      this.updateRegisterDropdowns();
    },

    saveNewPerson: function() {
      this.savePersonForm();
    },

    // ==========================================
    // TELA 3: MINHA BIBLIOTECA
    // ==========================================
    renderMaterialsTab: function() {
      const container = document.getElementById('bookshelfContainer');
      const indexContainer = document.getElementById('inspectedMaterialIndexContainer');
      const inspectedTitle = document.getElementById('inspectedMaterialTitle');
      const inspectedSub = document.getElementById('inspectedMaterialSub');
      if (!container) return;

      const materials = ActaStorage.getMaterials();
      container.innerHTML = ActaMaterials.renderBookshelfHTML(materials, this.selectedSubjectFilter);

      // Renderiza o índice do livro atualmente inspecionado
      const inspectedMat = ActaStorage.getMaterialById(ActaMaterials.activeInspectedMaterialId) || materials[0];
      if (inspectedMat && indexContainer) {
        if (inspectedTitle) inspectedTitle.textContent = `${inspectedMat.subject} — ${inspectedMat.title}`;
        if (inspectedSub) inspectedSub.textContent = `${inspectedMat.topics ? inspectedMat.topics.length : 0} tópicos organizados no sumário`;
        indexContainer.innerHTML = ActaMaterials.renderInspectedIndexHTML(inspectedMat);
      }
    },

    filterLibraryBySubject: function(subject, btnElement) {
      this.selectedSubjectFilter = subject;
      document.querySelectorAll('.lib-filter-pill').forEach(b => {
        b.classList.remove('bg-[#2F5233]', 'text-white');
        b.classList.add('bg-white', 'text-[#28302A]');
      });
      if (btnElement) {
        btnElement.classList.add('bg-[#2F5233]', 'text-white');
        btnElement.classList.remove('bg-white', 'text-[#28302A]');
      }
      this.renderMaterialsTab();
    },

    organizePastedIndex: function() {
      const rawTextArea = document.getElementById('matRawIndex');
      const previewContainer = document.getElementById('parsedIndexPreview');
      if (!rawTextArea || !previewContainer) return;

      const raw = rawTextArea.value;
      if (!raw.trim()) {
        previewContainer.innerHTML = '<p class="text-xs text-[#A95337] italic">Cole o texto do sumário primeiro.</p>';
        return;
      }

      const parsed = ActaMaterials.parseIndexText(raw);
      previewContainer.innerHTML = ActaMaterials.renderInspectedIndexHTML({ topics: parsed });
      this.showToast(`Índice interpretado: ${parsed.length} itens organizados!`);
    },

    saveNewMaterial: function() {
      const subjectInput = document.getElementById('matSubject');
      const titleInput = document.getElementById('matTitle');
      const subtitleInput = document.getElementById('matSubtitle');
      const authorInput = document.getElementById('matAuthor');
      const rawIndexInput = document.getElementById('matRawIndex');

      if (!titleInput || !titleInput.value.trim()) {
        alert('Por favor, informe o título do material.');
        return;
      }

      const rawText = rawIndexInput ? rawIndexInput.value : '';
      const topics = ActaMaterials.parseIndexText(rawText);

      const newMaterial = {
        subject: subjectInput ? subjectInput.value.trim() : 'Geral',
        title: titleInput.value.trim(),
        subtitle: subtitleInput ? subtitleInput.value.trim() : '',
        author: authorInput ? authorInput.value.trim() : 'Edição ACTA',
        rawIndex: rawText,
        topics: topics
      };

      const saved = ActaStorage.saveMaterial(newMaterial);
      ActaMaterials.activeInspectedMaterialId = saved.id;
      this.closeModal('modalNewMaterial');

      titleInput.value = '';
      if (subtitleInput) subtitleInput.value = '';
      if (authorInput) authorInput.value = '';
      if (rawIndexInput) rawIndexInput.value = '';
      const prev = document.getElementById('parsedIndexPreview');
      if (prev) prev.innerHTML = '';

      this.renderMaterialsTab();
      this.updateRegisterDropdowns();
      this.showToast(`Livro adicionado à biblioteca!`);
    },

    viewContentDetails: function(materialId, encodedTopicTitle, subject) {
      const topicTitle = decodeURIComponent(encodedTopicTitle);
      const modal = document.getElementById('modalViewContent');
      const titleEl = document.getElementById('modalViewContentTitle');
      const bodyEl = document.getElementById('modalViewContentBody');

      if (titleEl) titleEl.textContent = topicTitle;
      if (bodyEl) {
        const mat = ActaStorage.getMaterialById(materialId);
        bodyEl.innerHTML = `
          <div class="space-y-2 text-xs text-[#667267]">
            <p><strong>Disciplina:</strong> ${subject}</p>
            ${mat ? `<p><strong>Livro:</strong> ${mat.title} ${mat.subtitle ? `(${mat.subtitle})` : ''}</p>` : ''}
            <p class="pt-2 text-[#28302A] leading-relaxed">
              Este conteúdo faz parte do percurso planejado para a semana. Você pode realizar a explicação, exercícios ou leitura e registrar o aprendizado quando concluir.
            </p>
          </div>
        `;
      }
      this.openModal('modalViewContent');
    },

    openQuickRegisterFromPlan: function(materialId, encodedTopicTitle, subject) {
      const topicTitle = decodeURIComponent(encodedTopicTitle);
      this.switchTab('registros');
      this.prefillRegisterForm(subject, topicTitle, materialId);
    },

    openQuickRegisterFromTopic: function(encodedTopicTitle, materialId, subject) {
      const topicTitle = decodeURIComponent(encodedTopicTitle);
      this.switchTab('registros');
      this.prefillRegisterForm(subject, topicTitle, materialId);
    },

    // ==========================================
    // TELA 4: SEMANA (PLANEJAMENTO SEMANAL)
    // ==========================================
    renderSemanaTab: function() {
      const activePerson = ActaStorage.getActivePerson();
      const childHeaderEl = document.getElementById('semanaActiveChildHeader');
      const scheduleContainer = document.getElementById('semanaScheduleContainer');

      if (childHeaderEl && activePerson) {
        childHeaderEl.innerHTML = `
          <div class="w-10 h-10 rounded-full overflow-hidden border border-[#CCD8CD] bg-[#FAF7F0] flex items-center justify-center shrink-0">
            ${ActaStorage.renderAvatarHTML(activePerson.avatar, 'w-full h-full object-cover', activePerson.name)}
          </div>
          <div>
            <span class="text-sm font-bold text-[#28302A] block leading-tight">${activePerson.name}</span>
            <span class="text-[11px] text-[#2F5233] font-semibold">${activePerson.schoolYearLabel || 'Planejamento Ativo'}</span>
          </div>
        `;
      }

      if (scheduleContainer) {
        let scheduleData = ActaStorage.getWeekSchedule();
        const totalItems = (scheduleData || []).reduce((acc, d) => acc + (d.items ? d.items.length : 0), 0);
        // Se a semana estiver totalmente vazia e houver uma série/ano cadastrado para a criança ativa, auto-popula
        if (totalItems === 0 && activePerson && activePerson.schoolYear && window.ActaCurriculum && typeof window.ActaCurriculum.applyGradeToSchedule === 'function') {
          scheduleData = window.ActaCurriculum.applyGradeToSchedule(activePerson.id, activePerson.schoolYear, ['ingles'], false);
        }
        scheduleContainer.innerHTML = ActaPlanner.renderWeekScheduleHTML(scheduleData, activePerson);
      }

      const rangeEl = document.getElementById('semanaWeekRangeLabel');
      if (rangeEl && window.ActaCurriculum && typeof window.ActaCurriculum.getCurrentWeekRangeLabel === 'function') {
        rangeEl.textContent = window.ActaCurriculum.getCurrentWeekRangeLabel();
      }
    },

    // ==========================================
    // TELA 5: REGISTROS (NOVO REGISTRO)
    // ==========================================
    setupRegistrosForm: function() {
      this.updateRegisterDropdowns();

      // Checkboxes de Atividade Realizada
      const actContainer = document.getElementById('regActivityCheckboxes');
      if (actContainer) {
        actContainer.innerHTML = ActaRecords.ACTIVITY_OPTIONS.map(act => `
          <label class="flex items-center gap-2 text-xs font-medium text-[#28302A] cursor-pointer hover:text-[#2F5233] transition select-none">
            <input 
              type="checkbox" 
              name="regActivity" 
              value="${act.label}" 
              ${act.label === 'Exercícios' ? 'checked' : ''}
              onchange="ActaApp.onActivityCheckboxesChanged()"
              class="w-4 h-4 rounded border-[#E8E2D5] text-[#2F5233] focus:ring-[#2F5233]"
            >
            <span>${act.label}</span>
          </label>
        `).join('');
      }

      // Botões de Como Foi?
      const resContainer = document.getElementById('regResultPills');
      if (resContainer) {
        resContainer.innerHTML = ActaRecords.RESULT_OPTIONS.map((res, idx) => `
          <button 
            type="button" 
            onclick="ActaApp.selectRegisterResult('${res.id}', this)"
            class="reg-result-pill text-xs font-semibold px-4 py-2 rounded-full border transition flex items-center gap-1.5 ${idx === 0 ? res.pillClass + ' ring-2 ring-[#2F5233]/20 shadow-sm' : 'bg-white border-[#E8E2D5] text-[#667267]'}"
            data-id="${res.id}"
          >
            <i class="fa-solid ${res.icon} text-[11px]"></i>
            <span>${res.label}</span>
          </button>
        `).join('');
      }

      // Virtudes & Bons Hábitos
      const virtuesContainer = document.getElementById('regVirtuesPills');
      if (virtuesContainer) {
        const virtuesList = [
          'Atenção', 'Diligência', 'Ordem', 'Paciência', 
          'Perseverança', 'Respeito', 'Amor ao Estudo', 'Fortaleza', 
          'Generosidade', 'Obediência', 'Curiosidade', 'Capricho'
        ];
        virtuesContainer.innerHTML = virtuesList.map(v => `
          <button 
            type="button" 
            onclick="ActaApp.toggleRegVirtuePill(this)" 
            data-value="${v}"
            class="reg-virtue-pill text-[11px] px-2.5 py-1 rounded-full border border-[#E8E2D5] bg-[#FAF7F0] text-[#667267] hover:border-[#2F5233]/40 transition-all select-none flex items-center gap-1 font-medium"
          >
            <span>★</span>
            <span>${v}</span>
          </button>
        `).join('');
      }

      // Input de foto de evidência
      const fileInput = document.getElementById('regEvidencePhotoInput');
      if (fileInput) {
        fileInput.addEventListener('change', (e) => this.handleEvidencePhotoUpload(e));
      }
    },

    toggleRegVirtuePill: function(btn) {
      if (!btn) return;
      const isActive = btn.classList.contains('acta-pill-active');
      if (isActive) {
        btn.classList.remove('acta-pill-active', 'bg-[#2F5233]', 'text-white', 'border-[#2F5233]', 'shadow-xs', 'font-bold');
        btn.classList.add('bg-[#FAF7F0]', 'text-[#667267]', 'border-[#E8E2D5]', 'font-medium');
        const check = btn.querySelector('.pill-check');
        if (check) check.remove();
      } else {
        btn.classList.add('acta-pill-active', 'bg-[#2F5233]', 'text-white', 'border-[#2F5233]', 'shadow-xs', 'font-bold');
        btn.classList.remove('bg-[#FAF7F0]', 'text-[#667267]', 'border-[#E8E2D5]', 'font-medium');
        if (!btn.querySelector('.pill-check')) {
          const check = document.createElement('span');
          check.className = 'pill-check text-[10px] font-bold mr-0.5';
          check.textContent = '✓';
          btn.prepend(check);
        }
      }
    },

    updateRegisterDropdowns: function() {
      const people = ActaStorage.getPeople();
      const activePerson = ActaStorage.getActivePerson();
      const materials = ActaStorage.getMaterials();

      // Select Criança
      const personSelect = document.getElementById('regChildSelect');
      if (personSelect) {
        personSelect.innerHTML = people.map(p => `
          <option value="${p.id}" ${activePerson && activePerson.id === p.id ? 'selected' : ''}>
            ${p.name}
          </option>
        `).join('');

        this.onRegChildChange(personSelect.value);
      }

      // Select Disciplina
      const subjSelect = document.getElementById('regSubjectSelect');
      if (subjSelect) {
        const uniqueSubjects = [...new Set(materials.map(m => m.subject))];
        subjSelect.innerHTML = uniqueSubjects.map(s => `<option value="${s}">${s}</option>`).join('') + `
          <option value="História">História</option>
          <option value="Geografia">Geografia</option>
          <option value="Arte">Arte</option>
          <option value="Outra">Outra disciplina...</option>
        `;
      }
    },

    onRegChildChange: function(personId) {
      const avatarEl = document.getElementById('regChildAvatarPreview');
      if (!avatarEl) return;
      const person = ActaStorage.getPersonById(personId) || ActaStorage.getActivePerson();
      if (person) {
        avatarEl.innerHTML = ActaStorage.renderAvatarHTML(person.avatar, 'w-full h-full object-cover', person.name);
      } else {
        avatarEl.innerHTML = '<span class="text-sm">👦</span>';
      }
    },

    onActivityCheckboxesChanged: function() {
      const checkedBoxes = document.querySelectorAll('input[name="regActivity"]:checked');
      this.selectedActivities = Array.from(checkedBoxes).map(cb => cb.value);
    },

    selectRegisterResult: function(resultId, btnElement) {
      document.querySelectorAll('.reg-result-pill').forEach(btn => {
        btn.classList.remove('status-pill-compreendeu', 'status-pill-desenvolvendo', 'status-pill-retomar', 'ring-2', 'ring-[#2F5233]/20', 'shadow-sm');
        btn.classList.add('bg-white', 'border-[#E8E2D5]', 'text-[#667267]');
      });

      btnElement.classList.remove('bg-white', 'border-[#E8E2D5]', 'text-[#667267]');
      btnElement.classList.add('ring-2', 'ring-[#2F5233]/20', 'shadow-sm');

      if (resultId === 'compreendeu') btnElement.classList.add('status-pill-compreendeu');
      if (resultId === 'em_pratica') btnElement.classList.add('status-pill-desenvolvendo');
      if (resultId === 'revisar') btnElement.classList.add('status-pill-retomar');

      this.selectedResult = resultId;
    },

    prefillRegisterForm: function(subject, contentTitle, materialId) {
      const subjSelect = document.getElementById('regSubjectSelect');
      const contentInput = document.getElementById('regContentInput');

      if (subject && subjSelect) {
        subjSelect.value = subject;
      }
      if (contentTitle && contentInput) {
        contentInput.value = contentTitle;
      }
      if (materialId) {
        contentInput.dataset.materialId = materialId;
      }
    },

    handleEvidencePhotoUpload: function(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.tempEvidenceImg = e.target.result;
        const preview = document.getElementById('regPhotoThumbnailContainer');
        const img = document.getElementById('regPhotoThumbnailImg');
        if (preview && img) {
          img.src = this.tempEvidenceImg;
          preview.classList.remove('hidden');
        }
      };
      reader.readAsDataURL(file);
    },

    removeEvidencePhoto: function() {
      this.tempEvidenceImg = '';
      const preview = document.getElementById('regPhotoThumbnailContainer');
      const fileInput = document.getElementById('regEvidencePhotoInput');
      if (preview) preview.classList.add('hidden');
      if (fileInput) fileInput.value = '';
    },

    saveDailyRecord: function() {
      const personSelect = document.getElementById('regChildSelect');
      const subjSelect = document.getElementById('regSubjectSelect');
      const contentInput = document.getElementById('regContentInput');
      const notesInput = document.getElementById('regNotesInput');

      const personId = personSelect ? personSelect.value : '';
      const person = ActaStorage.getPeople().find(p => p.id === personId) || ActaStorage.getActivePerson();
      const subject = subjSelect ? subjSelect.value : 'Geral';
      const content = contentInput ? contentInput.value.trim() : 'Atividade do dia';
      const materialId = contentInput ? (contentInput.dataset.materialId || '') : '';
      const notes = notesInput ? notesInput.value.trim() : '';

      this.onActivityCheckboxesChanged();
      const narrative = ActaRecords.generateNarrative(subject, content, this.selectedActivities, this.selectedResult);

      const selectedVirtues = Array.from(document.querySelectorAll('#regVirtuesPills .acta-pill-active')).map(b => b.dataset.value);

      const record = {
        personId: person ? person.id : 'p1',
        personName: person ? person.name : 'João',
        materialId: materialId,
        subject: subject,
        contentTitle: content,
        activityType: this.selectedActivities.join(' + ') || 'Estudo',
        result: this.selectedResult || 'compreendeu',
        virtues: selectedVirtues,
        date: new Date().toISOString().split('T')[0],
        formattedDate: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }),
        autoSummary: narrative,
        notes: notes,
        evidenceImg: this.tempEvidenceImg || ''
      };

      ActaStorage.addRecord(record);

      // Limpar formulário
      if (contentInput) contentInput.value = '';
      if (notesInput) notesInput.value = '';
      document.querySelectorAll('#regVirtuesPills .acta-pill-active').forEach(b => this.toggleRegVirtuePill(b));
      this.removeEvidencePhoto();

      // Atualizar visualizações
      this.renderCaminhadaTab();
      this.renderDossieTab();
      this.renderCasaTab();
      this.renderMaterialsTab();

      this.showToast('✅ Registro anotado no caderno da família!');

      // Transição suave para a tela Caminhada para ver o registro
      setTimeout(() => {
        this.switchTab('caminhada');
      }, 400);
    },

    // ==========================================
    // TELA 6: CAMINHADA (ACOMPANHAMENTO VISUAL)
    // ==========================================
    renderCaminhadaTab: function() {
      const activePerson = ActaStorage.getActivePerson();
      const childHeaderEl = document.getElementById('caminhadaActiveChildHeader');
      const achievementsContainer = document.getElementById('caminhadaAchievementsContainer');
      const timelineContainer = document.getElementById('caminhadaTimelineContainer');

      if (childHeaderEl && activePerson) {
        childHeaderEl.innerHTML = `
          <div class="w-10 h-10 rounded-full overflow-hidden border border-[#CCD8CD] bg-[#FAF7F0] flex items-center justify-center shrink-0">
            ${ActaStorage.renderAvatarHTML(activePerson.avatar, 'w-full h-full object-cover', activePerson.name)}
          </div>
          <div>
            <span class="text-sm font-bold text-[#28302A] block leading-tight">${activePerson.name}</span>
          </div>
        `;
      }

      // Conquistas recentes
      if (achievementsContainer) {
        const achievements = ActaStorage.getAchievements();
        achievementsContainer.innerHTML = achievements.map(ach => `
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] text-xs">
            <div class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-lg bg-[#EBF3ED] text-[#2F5233] flex items-center justify-center text-xs shrink-0">
                <i class="fa-solid ${ach.icon}"></i>
              </div>
              <span class="font-medium text-[#28302A]">${ach.title}</span>
            </div>
            <span class="text-[10px] text-[#8E9A8F] font-mono shrink-0">${ach.date}</span>
          </div>
        `).join('');
      }

      // Linha do tempo na Caminhada
      if (timelineContainer) {
        const records = activePerson ? ActaStorage.getRecords(activePerson.id) : ActaStorage.getRecords();
        timelineContainer.innerHTML = ActaRecords.renderTimelineHTML(records);
      }
    },

    // ==========================================
    // TELA: AVALIAÇÕES / DIAGNÓSTICO
    // ==========================================
    renderAvaliacoesTab: function() {
      const container = document.getElementById('evaluationsListContainer');
      const childSelect = document.getElementById('evalChildFilter');
      const people = ActaStorage.getPeople();
      const activePerson = ActaStorage.getActivePerson();

      if (childSelect) {
        const currVal = childSelect.value;
        const exists = people.some(p => p.id === currVal);
        const selectedId = exists ? currVal : (activePerson ? activePerson.id : (people[0] ? people[0].id : ''));
        childSelect.innerHTML = people.map(p => `
          <option value="${p.id}" ${p.id === selectedId ? 'selected' : ''}>${p.name}</option>
        `).join('');
      }

      const childId = childSelect ? childSelect.value : (activePerson ? activePerson.id : 'p1');
      if (container && window.ActaDiagnostic) {
        container.innerHTML = ActaDiagnostic.renderEvaluationsListHTML(childId);
      }
    },

    saveDiagnosticEval: function() {
      const childId = document.getElementById('diagEvalChildSelect').value;
      const date = document.getElementById('diagEvalDate').value || new Date().toISOString().substring(0, 10);
      
      const evalObj = {
        personId: childId,
        date: date,
        evaluator: 'Família',
        portugues: {
          leitura: document.getElementById('diagPortLeitura').value,
          compreensao: document.getElementById('diagPortCompreensao').value,
          escrita: document.getElementById('diagPortEscrita').value,
          vocabulario: document.getElementById('diagPortVocabulario').value
        },
        matematica: {
          raciocinio: document.getElementById('diagMatRaciocinio').value,
          operacoes: document.getElementById('diagMatOperacoes').value,
          problemas: document.getElementById('diagMatProblemas').value,
          calculo: document.getElementById('diagMatCalculo').value
        },
        summaryStrengths: document.getElementById('diagStrengths').value.trim(),
        summaryRetomar: document.getElementById('diagRetomar').value.trim(),
        summaryNotes: document.getElementById('diagNotes').value.trim()
      };

      ActaStorage.saveEvaluation(evalObj);
      this.closeModal('modalDiagnosticEval');
      this.showToast('✅ Avaliação diagnóstica arquivada no dossiê!');
      this.renderAvaliacoesTab();
      this.renderDossieTab();
    },

    deleteEvaluation: function(id) {
      if (confirm('Deseja excluir esta avaliação diagnóstica?')) {
        ActaStorage.deleteEvaluation(id);
        this.renderAvaliacoesTab();
        this.renderDossieTab();
        this.showToast('Avaliação removida.');
      }
    },

    // ==========================================
    // TELA: CALENDÁRIO FAMILIAR
    // ==========================================
    currentCalendarYear: new Date().getFullYear(),
    currentCalendarMonth: new Date().getMonth(),

    renderCalendarioTab: function() {
      const gridContainer = document.getElementById('familyCalendarGridContainer');
      const eventsContainer = document.getElementById('familyCalendarEventsList');

      if (gridContainer && window.ActaCalendar) {
        gridContainer.innerHTML = ActaCalendar.renderCalendarHTML(this.currentCalendarYear, this.currentCalendarMonth);
      }

      if (eventsContainer) {
        const events = ActaStorage.getCalendarEvents();
        if (events.length === 0) {
          eventsContainer.innerHTML = '<p class="text-xs text-[#667267] italic">Nenhum período de descanso, viagem ou recesso cadastrado ainda.</p>';
        } else {
          eventsContainer.innerHTML = events.map(ev => `
            <div class="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] text-xs">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full ${ev.highlight ? 'bg-[#D97706]' : 'bg-[#2F5233]'}"></span>
                <strong class="text-[#28302A]">${ev.title}</strong>
                <span class="text-[10px] text-[#667267]">(${ev.type})</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-[11px] font-mono text-[#8E9A8F]">${ev.startDate} a ${ev.endDate}</span>
                <button onclick="ActaApp.deleteCalendarEvent('${ev.id}')" class="text-red-400 hover:text-red-600 text-xs" title="Remover"><i class="fa-solid fa-trash-can"></i></button>
              </div>
            </div>
          `).join('');
        }
      }
    },

    changeCalendarMonth: function(delta) {
      this.currentCalendarMonth += delta;
      if (this.currentCalendarMonth > 11) {
        this.currentCalendarMonth = 0;
        this.currentCalendarYear++;
      } else if (this.currentCalendarMonth < 0) {
        this.currentCalendarMonth = 11;
        this.currentCalendarYear--;
      }
      this.renderCalendarioTab();
    },

    saveCalendarPeriod: function() {
      const id = (document.getElementById('calEventId') || {}).value || '';
      const title = document.getElementById('calEventTitle').value.trim();
      const type = document.getElementById('calEventType').value;
      const highlight = document.getElementById('calEventHighlight').value === 'true';
      const startDate = document.getElementById('calEventStart').value;
      const endDate = document.getElementById('calEventEnd').value;
      const notes = document.getElementById('calEventNotes').value.trim();

      if (!title || !startDate || !endDate) {
        alert('Por favor, informe o título e as datas de início e fim.');
        return;
      }

      const eventData = {
        title,
        type,
        startDate,
        endDate,
        highlight,
        notes
      };
      if (id) eventData.id = id;

      ActaStorage.saveCalendarEvent(eventData);

      this.closeModal('modalCalendarPeriod');
      this.showToast(id ? '✅ Período atualizado com sucesso!' : '✅ Período marcado no calendário!');
      this.renderCalendarioTab();
    },

    deleteCalendarEvent: function(id) {
      if (confirm('Deseja remover este período do calendário?')) {
        ActaStorage.deleteCalendarEvent(id);
        this.renderCalendarioTab();
        this.showToast('Período removido.');
      }
    },

    // ==========================================
    // TELA: PASSEIOS & EXTRAS
    // ==========================================
    extraTypeFilter: 'all',
    tempExtraPhoto: '',

    renderPasseiosTab: function() {
      const container = document.getElementById('extrasListContainer');
      const childSelect = document.getElementById('extraChildFilter');
      const people = ActaStorage.getPeople();
      const activePerson = ActaStorage.getActivePerson();

      if (childSelect) {
        const currVal = childSelect.value;
        const exists = people.some(p => p.id === currVal);
        const selectedId = exists ? currVal : (activePerson ? activePerson.id : (people[0] ? people[0].id : ''));
        childSelect.innerHTML = people.map(p => `
          <option value="${p.id}" ${p.id === selectedId ? 'selected' : ''}>${p.name}</option>
        `).join('');
      }

      const childId = childSelect ? childSelect.value : (activePerson ? activePerson.id : 'p1');
      if (container && window.ActaExtras) {
        container.innerHTML = ActaExtras.renderExtrasListHTML(childId, this.extraTypeFilter);
      }
    },

    filterExtrasByType: function(type, btn) {
      this.extraTypeFilter = type;
      document.querySelectorAll('.extra-filter-pill').forEach(b => {
        b.classList.remove('bg-[#2F5233]', 'text-white', 'active');
        b.classList.add('bg-[#FAF7F0]', 'text-[#28302A]');
      });
      if (btn) {
        btn.classList.add('bg-[#2F5233]', 'text-white', 'active');
        btn.classList.remove('bg-[#FAF7F0]', 'text-[#28302A]');
      }
      this.renderPasseiosTab();
    },

    saveNewExtra: function() {
      const title = document.getElementById('extraTitleInput').value.trim();
      const type = document.getElementById('extraTypeSelect').value;
      const childId = document.getElementById('extraChildSelect').value;
      const date = document.getElementById('extraDateInput').value;
      const location = document.getElementById('extraLocationInput').value.trim();
      const description = document.getElementById('extraDescInput').value.trim();

      if (!title || !childId || !date) return;

      ActaStorage.saveExtra({
        personId: childId,
        title,
        type,
        date,
        location,
        description,
        photo: this.tempExtraPhoto || ''
      });

      this.tempExtraPhoto = '';
      const thumb = document.getElementById('extraPhotoThumbContainer');
      if (thumb) thumb.classList.add('hidden');

      this.closeModal('modalNewExtra');
      this.showToast('✅ Vivência adicionada ao caderno da família!');
      this.renderPasseiosTab();
      this.renderLinhaDoTempoTab();
      this.renderDossieTab();
    },

    deleteExtra: function(id) {
      if (confirm('Deseja excluir esta vivência/passeio?')) {
        ActaStorage.deleteExtra(id);
        this.renderPasseiosTab();
        this.renderLinhaDoTempoTab();
        this.renderDossieTab();
        this.showToast('Vivência removida.');
      }
    },

    // ==========================================
    // TELA: LINHA DO TEMPO PEDAGÓGICA COMPLETA
    // ==========================================
    renderLinhaDoTempoTab: function() {
      const container = document.getElementById('fullMonthlyTimelineContainer');
      const childSelect = document.getElementById('timelineChildFilter');
      const people = ActaStorage.getPeople();
      const activePerson = ActaStorage.getActivePerson();

      if (childSelect) {
        const currVal = childSelect.value;
        const exists = people.some(p => p.id === currVal);
        const selectedId = exists ? currVal : (activePerson ? activePerson.id : (people[0] ? people[0].id : ''));
        childSelect.innerHTML = people.map(p => `
          <option value="${p.id}" ${p.id === selectedId ? 'selected' : ''}>${p.name}</option>
        `).join('');
      }

      const childId = childSelect ? childSelect.value : (activePerson ? activePerson.id : 'p1');
      if (container && window.ActaRecords) {
        container.innerHTML = ActaRecords.renderFullTimelineByMonthHTML(childId);
      }
    },

    // ==========================================
    // PLANEJAMENTO DIRETO: CRIANÇA -> MATERIAL -> CONTEÚDO -> PERÍODO
    // ==========================================
    onPlanMaterialChange: function(materialId) {
      const contentSelect = document.getElementById('planContentSelect');
      if (!contentSelect) return;
      const materials = ActaStorage.getMaterials();
      const mat = materials.find(m => m.id === materialId);
      if (!mat || !mat.indexList || mat.indexList.length === 0) {
        contentSelect.innerHTML = '<option value="">Material sem tópicos de índice cadastrados</option>';
        return;
      }
      contentSelect.innerHTML = mat.indexList.map(item => `
        <option value="${item.id}">${item.code || ''} ${item.title}</option>
      `).join('');
    },

    saveDirectPlan: function() {
      if (window.ActaPlanner && typeof window.ActaPlanner.savePlanFromModal === 'function') {
        return window.ActaPlanner.savePlanFromModal();
      }
    },

    // ==========================================
    // TELA 11: DOSSIÊ DE ACOMPANHAMENTO & RELATÓRIOS
    // ==========================================
    renderDossieTab: function() {
      const container = document.getElementById('dossiePreviewContainer');
      const childSelect = document.getElementById('dossieChildFilter');
      const typeSelect = document.getElementById('dossieTypeSelect');
      const activePerson = ActaStorage.getActivePerson();
      const people = ActaStorage.getPeople();

      if (!container) return;

      if (childSelect) {
        const currVal = childSelect.value;
        const exists = people.some(p => p.id === currVal);
        const selectedId = exists ? currVal : (activePerson ? activePerson.id : (people[0] ? people[0].id : ''));
        childSelect.innerHTML = people.map(p => `
          <option value="${p.id}" ${p.id === selectedId ? 'selected' : ''}>${p.name}</option>
        `).join('');
      }

      const selectedChildId = childSelect ? childSelect.value : (activePerson ? activePerson.id : 'p1');
      const selectedType = typeSelect ? typeSelect.value : 'resumo';

      const incReadingsEl = document.getElementById('dossieIncReadings');
      const incMoviesEl = document.getElementById('dossieIncMovies');
      const incExtrasEl = document.getElementById('dossieIncExtras');

      const includeReadings = incReadingsEl ? incReadingsEl.checked : true;
      const includeMovies = incMoviesEl ? incMoviesEl.checked : true;
      const includeExtras = incExtrasEl ? incExtrasEl.checked : true;

      container.innerHTML = ActaReports.generateDossieHTML({
        type: selectedType,
        personId: selectedChildId,
        includeReadings,
        includeMovies,
        includeExtras,
        periodLabel: 'Ano Pedagógico em Curso'
      });
    },

    printCurrentDossie: function() {
      window.print();
    },

    // ==========================================
    // TELA 12: CONFIGURAÇÕES & TEMAS
    // ==========================================
    renderConfiguracoesTab: function() {
      const isPremium = typeof ActaStorage.isPremiumUser === 'function' ? ActaStorage.isPremiumUser() : false;
      const isExpired = typeof ActaStorage.isLicenseExpired === 'function' ? ActaStorage.isLicenseExpired() : false;
      const lic = typeof ActaStorage.getLicenseInfo === 'function' ? ActaStorage.getLicenseInfo() : { isPremium: false, daysRemaining: 0 };
      const badgeContainer = document.getElementById('configPlanBadgeContainer');
      const bodyContainer = document.getElementById('configPlanBodyContainer');

      if (badgeContainer) {
        if (isPremium) {
          const expText = lic.expirationDate ? ` • Válido até ${lic.expirationDate.toLocaleDateString('pt-BR')}` : '';
          badgeContainer.innerHTML = `
            <span class="text-xs px-3 py-1 rounded-full bg-[#FEF3C7] border border-[#F59E0B]/30 text-[#B45309] font-bold flex items-center gap-1.5 shadow-2xs">
              <i class="fa-solid fa-crown text-[11px]"></i>
              <span>Plano ACTA Anual Ativo${expText}</span>
            </span>
          `;
        } else if (isExpired) {
          badgeContainer.innerHTML = `
            <span class="text-xs px-3 py-1 rounded-full bg-[#FBECE8] border border-[#DC2626]/30 text-[#DC2626] font-bold flex items-center gap-1.5 shadow-2xs">
              <i class="fa-solid fa-clock-rotate-left text-[11px]"></i>
              <span>Anuidade Expirada • Renovar</span>
            </span>
          `;
        } else {
          badgeContainer.innerHTML = `
            <span class="text-xs px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#E8E2D5] text-[#667267] font-semibold flex items-center gap-1.5">
              <span>Plano Gratuito</span>
            </span>
          `;
        }
      }

      if (bodyContainer) {
        if (isPremium) {
          const daysText = lic.daysRemaining > 0 ? `Restam ${lic.daysRemaining} dias de acesso anual.` : 'Acesso da Administradora / Ilimitado.';
          bodyContainer.innerHTML = `
            <div class="p-4 rounded-2xl bg-[#EBF3ED] border border-[#2F5233]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div class="space-y-1">
                <span class="text-xs font-bold text-[#28302A] block">⭐ Sua família possui Acesso Anual Ativo!</span>
                <p class="text-[11px] text-[#667267]">Todos os 14 módulos (Leituras, Filmes, Passeios, Acompanhamento, Linha do Tempo e Dossiês Oficiais) estão liberados. ${daysText}</p>
              </div>
              <span class="text-[11px] text-[#2F5233] font-bold px-3 py-1 rounded-full bg-white border border-[#2F5233]/20 shadow-2xs shrink-0">
                ${lic.daysRemaining > 0 ? `${lic.daysRemaining} dias restantes` : 'Vitalício / Coordenação'}
              </span>
            </div>
          `;
        } else if (isExpired) {
          bodyContainer.innerHTML = `
            <div class="p-4 rounded-2xl bg-[#FBECE8] border border-[#DC2626]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-[#991B1B]">⚠️ Sua anuidade anual encerrou o ciclo letivo</span>
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-white text-[#991B1B] font-bold border border-[#DC2626]/20">R$ 34,99/ano</span>
                </div>
                <p class="text-[11px] text-[#667267] max-w-xl">
                  Seus dados e relatórios estão guardados com total segurança. Para continuar registrando leituras, emitindo novos relatórios e acompanhando seus filhos no novo ciclo, renove sua anuidade no Hotmart.
                </p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <a 
                  href="${ActaStorage.HOTMART_CHECKOUT_URL}" 
                  target="_blank" 
                  class="hero-btn-green text-xs font-bold px-4 py-2 rounded-full shadow-xs flex items-center gap-1.5 transition"
                >
                  <i class="fa-solid fa-arrows-rotate"></i>
                  <span>Renovar Anuidade (R$ 34,99)</span>
                </a>
                <button 
                  type="button" 
                  onclick="ActaApp.openUpgradeModal('Renovação de Anuidade: Digite o novo código de ativação do Hotmart para liberar mais 1 ano de acesso completo.')" 
                  class="text-xs font-bold px-3.5 py-2 rounded-full bg-white border border-[#CCD8CD] text-[#28302A] hover:bg-[#FAF7F0] shadow-2xs transition"
                >
                  Ativar Chave
                </button>
              </div>
            </div>
          `;
        } else {
          bodyContainer.innerHTML = `
            <div class="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8E2D5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-[#28302A]">Experimente o Planner ACTA Completo</span>
                  <span class="text-[10px] px-2 py-0.5 rounded-full bg-[#EBF3ED] text-[#2F5233] font-bold">R$ 34,99 / ano</span>
                </div>
                <p class="text-[11px] text-[#667267] max-w-xl">
                  Desbloqueie a Estante Cultural de Leituras, Cinemateca da Família, Diário de Passeios & Museus, Gráficos de Evolução, Linha do Tempo e Dossiês Oficiais para impressão.
                </p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <a 
                  href="${ActaStorage.HOTMART_CHECKOUT_URL}" 
                  target="_blank" 
                  class="hero-btn-green text-xs font-bold px-4 py-2 rounded-full shadow-xs flex items-center gap-1.5 transition"
                >
                  <i class="fa-solid fa-bag-shopping"></i>
                  <span>Comprar no Hotmart</span>
                </a>
                <button 
                  type="button" 
                  onclick="ActaApp.openUpgradeModal()" 
                  class="text-xs font-bold px-3.5 py-2 rounded-full bg-white border border-[#CCD8CD] text-[#28302A] hover:bg-[#FAF7F0] shadow-2xs transition"
                >
                  Ativar Código
                </button>
              </div>
            </div>
          `;
        }
      }
    },

    // ==========================================
    // SELETOR DE AVATAR ILUSTRADO (PARES MENINO & MENINA)
    // ==========================================
    editingPersonIdForAvatar: null,

    renderAvatarPicker: function() {
      const container = document.getElementById('avatarPickerGrid');
      const hiddenInput = document.getElementById('newPersonAvatar');
      if (!container || !hiddenInput) return;

      const options = ActaStorage.AVATAR_OPTIONS || [];
      const current = hiddenInput.value || (options[0] ? options[0].src : 'assets/avatars/avatar-menino-castanho.png');

      container.innerHTML = options.map(opt => {
        const isSelected = opt.src === current;
        return `
          <button 
            type="button" 
            onclick="ActaApp.selectAvatarOption('${opt.src}')"
            class="avatar-option-btn relative p-1.5 rounded-2xl border-2 transition-all flex items-center justify-center aspect-square ${isSelected ? 'border-[#2F5233] bg-[#EBF3ED] shadow-sm scale-105 ring-2 ring-[#2F5233]/20' : 'border-[#E8E2D5] bg-white hover:border-[#CCD8CD] hover:bg-[#FAF7F0]'}"
            title="Selecionar avatar"
          >
            <div class="w-14 h-14 rounded-full overflow-hidden border border-white shadow-xs">
              <img src="${opt.src}" alt="Personagem" class="w-full h-full object-cover">
            </div>
            ${isSelected ? '<span class="absolute -top-1 -right-1 w-5 h-5 bg-[#2F5233] text-white rounded-full flex items-center justify-center text-[10px] shadow-xs"><i class="fa-solid fa-check"></i></span>' : ''}
          </button>
        `;
      }).join('');
    },

    selectAvatarOption: function(src) {
      const hiddenInput = document.getElementById('newPersonAvatar');
      if (hiddenInput) hiddenInput.value = src;
      this.renderAvatarPicker();
    },

    openAvatarModalForPerson: function(personId) {
      this.editingPersonIdForAvatar = personId;
      const person = ActaStorage.getPersonById(personId);
      if (!person) return;

      const titleEl = document.getElementById('editAvatarPersonName');
      if (titleEl) titleEl.textContent = person.name;

      const container = document.getElementById('editAvatarPickerGrid');
      if (container) {
        const options = ActaStorage.AVATAR_OPTIONS || [];
        const current = person.avatar;

        container.innerHTML = options.map(opt => {
          const isSelected = opt.src === current || (opt.src.includes(current) || current.includes(opt.src));
          return `
            <button 
              type="button" 
              onclick="ActaApp.selectAvatarForPerson('${personId}', '${opt.src}')"
              class="avatar-option-btn relative p-1.5 rounded-2xl border-2 transition-all flex items-center justify-center aspect-square ${isSelected ? 'border-[#2F5233] bg-[#EBF3ED] shadow-sm scale-105 ring-2 ring-[#2F5233]/20' : 'border-[#E8E2D5] bg-white hover:border-[#CCD8CD] hover:bg-[#FAF7F0]'}"
              title="Selecionar avatar"
            >
              <div class="w-14 h-14 rounded-full overflow-hidden border border-white shadow-xs">
                <img src="${opt.src}" alt="Personagem" class="w-full h-full object-cover">
              </div>
              ${isSelected ? '<span class="absolute -top-1 -right-1 w-5 h-5 bg-[#2F5233] text-white rounded-full flex items-center justify-center text-[10px] shadow-xs"><i class="fa-solid fa-check"></i></span>' : ''}
            </button>
          `;
        }).join('');
      }

      this.openModal('modalEditAvatar');
    },

    selectAvatarForPerson: function(personId, src) {
      const person = ActaStorage.getPersonById(personId);
      if (!person) return;
      person.avatar = src;
      ActaStorage.updatePerson(person);
      this.closeModal('modalEditAvatar');
      this.renderSidebar();
      this.renderCasaTab();
      this.renderCriancasTab();
      this.showToast(`Avatar de ${person.name} atualizado com carinho!`);
    },

    // ==========================================
    // MODAIS & UTILS
    // ==========================================
    openModal: function(modalId) {
      const modal = document.getElementById(modalId);
      const overlay = document.getElementById('modalOverlay');
      if (modal && overlay) {
        // Garante que qualquer outro modal irmão fique oculto
        const siblings = overlay.querySelectorAll(':scope > div');
        siblings.forEach(s => s.classList.add('hidden'));

        overlay.classList.remove('hidden');
        modal.classList.remove('hidden');
        
        const people = ActaStorage.getPeople();
        const activePerson = ActaStorage.getActivePerson();
        const materials = ActaStorage.getMaterials();

        if (modalId === 'modalCurriculumGrade') {
          if (window.ActaCurriculum && typeof window.ActaCurriculum.updateGradePreview === 'function') {
            const childSelect = document.getElementById('curriculumChildSelect');
            const gradeSelect = document.getElementById('curriculumGradeSelect');
            if (childSelect) {
              childSelect.innerHTML = people.map(p => `
                <option value="${p.id}" ${activePerson && activePerson.id === p.id ? 'selected' : ''}>
                  ${p.name} ${p.schoolYearLabel ? '(' + p.schoolYearLabel + ')' : ''}
                </option>
              `).join('');
            }
            if (gradeSelect && window.ActaCurriculum.GRADES_CONFIG) {
              gradeSelect.innerHTML = Object.entries(window.ActaCurriculum.GRADES_CONFIG).map(([key, val]) => `
                <option value="${key}">${val.label}</option>
              `).join('');
              if (activePerson && activePerson.schoolYear && window.ActaCurriculum.GRADES_CONFIG[activePerson.schoolYear]) {
                gradeSelect.value = activePerson.schoolYear;
              }
            }
            window.ActaCurriculum.updateGradePreview();
          }
        } else if (modalId === 'modalNewPerson') {
          this.renderAvatarPicker();
        } else if (modalId === 'modalDiagnosticEval') {
          const childSel = document.getElementById('diagEvalChildSelect');
          if (childSel) {
            childSel.innerHTML = people.map(p => `
              <option value="${p.id}" ${activePerson && activePerson.id === p.id ? 'selected' : ''}>${p.name}</option>
            `).join('');
          }
          const dateInput = document.getElementById('diagEvalDate');
          if (dateInput && !dateInput.value) {
            dateInput.value = new Date().toISOString().substring(0, 10);
          }
        } else if (modalId === 'modalCalendarPeriod') {
          const startIn = document.getElementById('calEventStart');
          const endIn = document.getElementById('calEventEnd');
          const today = new Date().toISOString().substring(0, 10);
          if (startIn && !startIn.value) startIn.value = today;
          if (endIn && !endIn.value) endIn.value = today;
        } else if (modalId === 'modalNewExtra') {
          const childSel = document.getElementById('extraChildSelect');
          if (childSel) {
            childSel.innerHTML = people.map(p => `
              <option value="${p.id}" ${activePerson && activePerson.id === p.id ? 'selected' : ''}>${p.name}</option>
            `).join('');
          }
          const dateInput = document.getElementById('extraDateInput');
          if (dateInput && !dateInput.value) {
            dateInput.value = new Date().toISOString().substring(0, 10);
          }
          const photoInput = document.getElementById('extraPhotoInput');
          if (photoInput && !photoInput.dataset.bound) {
            photoInput.addEventListener('change', (e) => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  this.tempExtraPhoto = event.target.result;
                  const thumb = document.getElementById('extraPhotoThumbContainer');
                  const thumbImg = document.getElementById('extraPhotoThumbImg');
                  if (thumb && thumbImg) {
                    thumbImg.src = this.tempExtraPhoto;
                    thumb.classList.remove('hidden');
                  }
                };
                reader.readAsDataURL(file);
              }
            });
            photoInput.dataset.bound = 'true';
          }
        } else if (modalId === 'modalNewPlan') {
          if (window.ActaPlanner && typeof window.ActaPlanner.openNewPlanModal === 'function') {
            const activeP = ActaStorage.getActivePerson();
            window.ActaPlanner.openNewPlanModal(activeP ? activeP.id : null);
          }
        }
      }
    },

    closeModal: function(modalId) {
      const modal = document.getElementById(modalId);
      const overlay = document.getElementById('modalOverlay');
      if (modal) modal.classList.add('hidden');
      if (overlay) overlay.classList.add('hidden');
    },

    handleBackupUpload: function(event) {
      const file = event && event.target && event.target.files && event.target.files[0];
      if (!file) return;
      if (!confirm('Deseja realmente restaurar os dados deste arquivo de backup? Os dados atuais serão substituídos pelo backup.')) {
        event.target.value = '';
        return;
      }
      ActaStorage.importBackupJSON(file)
        .then(() => {
          this.closeModal('modalBackup');
          this.showToast('✅ Cópia de segurança restaurada com sucesso!');
          this.refreshAllTabs();
        })
        .catch((err) => {
          alert('Erro ao importar backup: ' + (err && err.message ? err.message : err));
        })
        .finally(() => {
          event.target.value = '';
        });
    },

    renderProLockView: function(tabName, paneEl) {
      if (!paneEl) return;

      // Esconde o conteúdo interno padrão da aba
      paneEl.querySelectorAll(':scope > div:not(.acta-pro-showcase)').forEach(el => el.classList.add('hidden'));

      let showcase = paneEl.querySelector('.acta-pro-showcase');
      if (!showcase) {
        showcase = document.createElement('div');
        showcase.className = 'acta-pro-showcase planner-card p-6 sm:p-10 bg-white border border-[#E8E2D5] rounded-3xl space-y-8 shadow-xs max-w-3xl mx-auto my-4';
        paneEl.appendChild(showcase);
      }
      showcase.classList.remove('hidden');

      const infoMap = {
        leituras: {
          badge: 'Formação Moral & Literária',
          icon: 'fa-book-open-reader',
          title: 'Estante Cultural de Leituras & Virtudes',
          sub: 'Cultive a imaginação moral, o gosto pelos clássicos e a vida interior dos seus filhos.',
          items: [
            'Estante viva com capas e status de leitura por criança',
            'Registro das virtudes trabalhadas em cada conto ou romance',
            'Anotação de passagens marcantes, diálogos e reflexões em família',
            'Metas anuais de leitura com incentivo ao hábito diário'
          ]
        },
        filmes: {
          badge: 'Cultura & Bons Costumes',
          icon: 'fa-film',
          title: 'Cinemateca da Família & Valores',
          sub: 'Cinema com propósito: documentários, clássicos, biografias e conversas à mesa.',
          items: [
            'Catálogo com cartazes, faixa etária recomendada e gênero',
            'Anotações de virtudes e conversas geradas após a sessão',
            'Avaliação afetiva com estrelas e memórias em família',
            'Histórico das noites de cinema e aprendizados compartilhados'
          ]
        },
        passeios: {
          badge: 'Experiências Vivas',
          icon: 'fa-compass',
          title: 'Passeios, Museus & Atividades Extras',
          sub: '“Nem tudo o que educa precisa estar dentro de uma sala de aula.”',
          items: [
            'Registro de visitas a museus, planetários, teatros e viagens',
            'Diário de projetos manuais, jardinagem, culinária e oficinas',
            'Espaço para anexar fotos de evidências e memórias afetivas',
            'Histórico de aprendizagem vivencial da família'
          ]
        },
        caminhada: {
          badge: 'Métricas Pedagógicas',
          icon: 'fa-chart-simple',
          title: 'Acompanhamento & Evolução Pedagógica',
          sub: 'Visualize o crescimento dos seus filhos com relatórios e gráficos claros.',
          items: [
            'Gráficos de horas de aula e progresso por disciplina',
            'Taxa de aproveitamento pedagógico (Compreendeu / Em desenvolvimento)',
            'Visão panorâmica para planejamento dos próximos bimestres',
            'Estatísticas prontas para prestar contas ou comprovação escolar'
          ]
        },
        linhadotempo: {
          badge: 'Memória Afetiva',
          icon: 'fa-timeline',
          title: 'Linha do Tempo da Jornada',
          sub: 'Um álbum cronológico vivo de todas as conquistas e marcos do ano letivo.',
          items: [
            'Histórico unificado: aulas, livros lidos, filmes e passeios',
            'Filtro individual por filho para acompanhar a biografia de cada um',
            'Fotos, registros de diário e anotações dos pais em ordem temporal',
            'Uma recordação eterna do crescimento dos seus filhos'
          ]
        },
        dossie: {
          badge: 'Documentação Oficial',
          icon: 'fa-file-invoice',
          title: 'Dossiês & Relatórios Oficiais para Impressão',
          sub: 'Portfólio escolar e documentação formal formatada com elegância.',
          items: [
            'Emissão em PDF oficial de histórico de estudos e frequência',
            'Compilação de matérias, livros concluídos e diagnósticos',
            'Documentação para conselhos, escolas e arquivo familiar',
            'Diagramação limpa e profissional com carimbo da família'
          ]
        }
      };

      const info = infoMap[tabName] || {
        badge: 'Recurso Exclusivo',
        icon: 'fa-crown',
        title: 'Módulo Exclusivo do Planner ACTA Completo',
        sub: 'Desenvolvido especialmente para as famílias que buscam uma experiência integral.',
        items: ['Acesso ilimitado a todas as ferramentas extras', 'Suporte à educação da família']
      };

      showcase.innerHTML = `
        <div class="text-center space-y-3">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] text-[11px] font-bold border border-[#F59E0B]/30 shadow-2xs">
            <i class="fa-solid fa-crown text-[10px]"></i>
            <span>${info.badge}</span>
          </div>
          <h2 class="font-editorial-serif text-2xl sm:text-3xl font-bold text-[#28302A] tracking-tight">
            ${info.title}
          </h2>
          <div class="planner-title-vignette mx-auto"></div>
          <p class="text-xs sm:text-sm text-[#667267] max-w-xl mx-auto italic">
            ${info.sub}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          ${info.items.map(item => `
            <div class="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FAF7F0] border border-[#E8E2D5]">
              <div class="w-5 h-5 rounded-full bg-[#2F5233]/15 text-[#2F5233] flex items-center justify-center text-[10px] shrink-0 mt-0.5 font-bold">
                <i class="fa-solid fa-check"></i>
              </div>
              <span class="text-xs text-[#28302A] leading-snug font-medium">${item}</span>
            </div>
          `).join('')}
        </div>

        <!-- Card de Oferta Hotmart -->
        <div class="p-6 rounded-2xl bg-gradient-to-br from-[#FAF7F0] to-[#EBF3ED] border border-[#2F5233]/30 space-y-4 text-center">
          <div class="space-y-1">
            <span class="text-[10px] uppercase font-bold tracking-widest text-[#2F5233]">Oferta Especial de Lançamento</span>
            <div class="flex items-baseline justify-center gap-1">
              <span class="text-xs text-[#667267] font-medium">por apenas</span>
              <span class="font-editorial-serif text-3xl font-bold text-[#2F5233]">R$ 34,99</span>
            </div>
            <p class="text-[11px] text-[#667267]">Pagamento único • Acesso vitalício da sua família • Sem mensalidades</p>
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a 
              href="${ActaStorage.HOTMART_CHECKOUT_URL}" 
              target="_blank" 
              class="w-full sm:w-auto hero-btn-green px-6 py-3 rounded-full text-xs font-bold shadow-md hover:scale-[1.02] transition flex items-center justify-center gap-2"
            >
              <i class="fa-solid fa-bag-shopping"></i>
              <span>Adquirir no Hotmart (R$ 34,99)</span>
              <i class="fa-solid fa-arrow-up-right-from-square text-[10px] ml-1"></i>
            </a>

            <button 
              type="button" 
              onclick="ActaApp.openUpgradeModal()" 
              class="w-full sm:w-auto px-5 py-3 rounded-full bg-white border border-[#CCD8CD] text-xs font-bold text-[#28302A] hover:bg-[#FAF7F0] shadow-2xs transition flex items-center justify-center gap-1.5"
            >
              <i class="fa-solid fa-key text-[#D97706]"></i>
              <span>Já comprou? Digite seu Código</span>
            </button>
          </div>
        </div>
      `;
    },

    openUpgradeModal: function(optionalMessage) {
      const msgEl = document.getElementById('upgradeModalCustomMessage');
      if (msgEl) {
        if (optionalMessage) {
          msgEl.textContent = optionalMessage;
          msgEl.classList.remove('hidden');
        } else {
          msgEl.classList.add('hidden');
        }
      }
      this.openModal('modalUpgradePlan');
    },

    handleActivateLicense: function() {
      const input = document.getElementById('inputActivationKey');
      const key = input ? input.value.trim() : '';
      if (!key) {
        alert('Por favor, informe a chave de ativação ou e-mail de compra.');
        return;
      }
      const success = ActaStorage.activatePremium(key);
      if (success) {
        this.closeModal('modalUpgradePlan');
        this.showToast('🎉 Parabéns! Seu Planner ACTA Completo foi ativado com sucesso! Todos os módulos liberados.');
        this.updateProNavigationUI();
        this.refreshAllTabs();
        this.switchTab(this.currentTab || 'casa');
      } else {
        alert('Código de ativação não reconhecido. Verifique e tente novamente ou entre em contato com o suporte.');
      }
    },

    updateProNavigationUI: function() {
      const isPremium = typeof ActaStorage.isPremiumUser === 'function' ? ActaStorage.isPremiumUser() : false;
      const isExpired = typeof ActaStorage.isLicenseExpired === 'function' ? ActaStorage.isLicenseExpired() : false;
      const badgeEl = document.getElementById('sidebarUserBadge');
      if (badgeEl) {
        if (isPremium) {
          const lic = typeof ActaStorage.getLicenseInfo === 'function' ? ActaStorage.getLicenseInfo() : { daysRemaining: 0 };
          const daysLabel = lic.daysRemaining > 0 ? ` (${lic.daysRemaining}d)` : '';
          badgeEl.innerHTML = `<span class="text-[#B45309] font-bold">⭐ PRO${daysLabel}</span>`;
          badgeEl.className = 'text-[9px] px-1.5 py-0.2 rounded bg-[#FEF3C7] border border-[#F59E0B]/30 font-semibold';
          badgeEl.onclick = null;
          badgeEl.title = lic.daysRemaining > 0 ? `Plano ACTA Anual Ativo • Restam ${lic.daysRemaining} dias` : 'Plano ACTA Ativo';
        } else if (isExpired) {
          badgeEl.innerHTML = '<span class="text-[#DC2626] font-bold animate-pulse">⚠️ Renovar</span>';
          badgeEl.className = 'text-[9px] px-1.5 py-0.2 rounded bg-[#FBECE8] border border-[#DC2626]/30 text-[#DC2626] font-semibold cursor-pointer';
          badgeEl.onclick = () => this.openUpgradeModal('⚠️ Sua anuidade do Planner ACTA chegou ao fim do ciclo letivo de 1 ano. Para continuar com todos os módulos culturais, relatórios oficiais e biblioteca liberados para o novo ano letivo, renove sua assinatura anual por apenas R$ 34,99!');
          badgeEl.title = 'Anuidade Expirada • Clique para renovar';
        } else {
          badgeEl.innerHTML = 'Free • <span class="underline">Upgrade</span>';
          badgeEl.className = 'text-[9px] px-1.5 py-0.2 rounded bg-[#FAF7F0] border border-[#E8E2D5] text-[#667267] font-semibold cursor-pointer hover:text-[#2F5233]';
          badgeEl.onclick = () => this.openUpgradeModal();
          badgeEl.title = 'Clique para conhecer o plano Completo';
        }
      }

      // Selos PRO nos botões do menu lateral
      const proTabs = ['leituras', 'filmes', 'passeios', 'caminhada', 'linhadotempo', 'dossie'];
      proTabs.forEach(tab => {
        const btn = document.querySelector(`[data-nav-target="${tab}"]`);
        if (btn) {
          let tag = btn.querySelector('.sidebar-pro-tag');
          if (!isPremium) {
            if (!tag) {
              tag = document.createElement('span');
              tag.className = 'sidebar-pro-tag ml-auto text-[8px] font-bold px-1.5 py-0.2 rounded bg-[#FAF7F0] border border-[#D97706]/40 text-[#D97706]';
              tag.textContent = 'PRO';
              btn.appendChild(tag);
            }
          } else {
            if (tag) tag.remove();
          }
        }
      });
    },

    // ==========================================
    // PAINEL DA ADMINISTRADORA (PIN, VENDAS, CHAVES & SUPORTE LOCAL)
    // ==========================================
    openAdminPinModal: function() {
      const pinInput = document.getElementById('adminPinInput');
      const errEl = document.getElementById('adminPinError');
      if (pinInput) pinInput.value = '';
      if (errEl) errEl.classList.add('hidden');
      this.openModal('modalAdminPin');
      setTimeout(() => pinInput && pinInput.focus(), 150);
    },

    handleVerifyAdminPin: function() {
      const pinInput = document.getElementById('adminPinInput');
      const errEl = document.getElementById('adminPinError');
      const pin = pinInput ? pinInput.value.trim() : '';

      if (ActaStorage.validateAdminPin(pin)) {
        ActaStorage.setAdminAuthenticated(true);
        this.closeModal('modalAdminPin');
        this.showToast('👑 Bem-vinda ao Painel da Administradora!');
        this.openAdminDashboard('metrics');
      } else {
        if (errEl) {
          errEl.textContent = 'Código PIN incorreto. O PIN padrão inicial é 2026.';
          errEl.classList.remove('hidden');
        }
      }
    },

    openAdminDashboard: function(defaultTab = 'metrics') {
      this.openModal('modalAdminDashboard');
      this.switchAdminTab(defaultTab);
    },

    switchAdminTab: function(tabName) {
      document.querySelectorAll('.admin-tab-btn').forEach(btn => {
        if (btn.getAttribute('data-admin-tab') === tabName) {
          btn.className = 'admin-tab-btn py-2 px-3.5 text-xs font-bold rounded-xl bg-[#2F5233] text-white shadow-xs transition';
        } else {
          btn.className = 'admin-tab-btn py-2 px-3.5 text-xs font-semibold rounded-xl bg-[#FAF7F0] text-[#667267] hover:bg-white border border-[#E8E2D5] transition';
        }
      });

      document.querySelectorAll('.admin-tab-pane').forEach(p => p.classList.add('hidden'));
      const activePane = document.getElementById(`admin-pane-${tabName}`);
      if (activePane) activePane.classList.remove('hidden');

      if (tabName === 'metrics') this.renderAdminMetricsTab();
      if (tabName === 'keys') this.renderAdminKeysTab();
      if (tabName === 'support') this.renderAdminSupportTab();
      if (tabName === 'simulator') this.renderAdminSimulatorTab();
      if (tabName === 'config') this.renderAdminConfigTab();
    },

    renderAdminMetricsTab: function() {
      const metrics = ActaStorage.getAdminMetrics();
      const formatBRL = (v) => 'R$ ' + Number(v).toFixed(2).replace('.', ',');

      const container = document.getElementById('adminMetricsContent');
      if (!container) return;

      container.innerHTML = `
        <!-- Cards de Destaque -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div class="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8E2D5] space-y-1">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-bold text-[#667267] uppercase tracking-wider block">Acessos de Famílias</span>
              <button 
                type="button" 
                onclick="ActaApp.handleResetVisitsMetric()" 
                class="text-[9px] text-[#8E9A8F] hover:text-[#DC2626] p-1 rounded transition" 
                title="Zerar acessos para começar limpo no lançamento oficial"
              >
                <i class="fa-solid fa-arrows-rotate"></i> Zerar
              </button>
            </div>
            <div class="text-2xl font-bold text-[#28302A]">${metrics.visits}</div>
            <span class="text-[10px] text-[#2F5233] font-semibold"><i class="fa-solid fa-user-group"></i> Visitas de famílias externas</span>
          </div>

          <div class="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8E2D5] space-y-1">
            <span class="text-[10px] font-bold text-[#667267] uppercase tracking-wider block">Crianças / Famílias</span>
            <div class="text-2xl font-bold text-[#28302A]">${metrics.registeredChildren}</div>
            <span class="text-[10px] text-[#667267]"><i class="fa-solid fa-child"></i> Perfis criados no app</span>
          </div>

          <div class="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8E2D5] space-y-1">
            <span class="text-[10px] font-bold text-[#667267] uppercase tracking-wider block">Vendas / Licenças</span>
            <div class="text-2xl font-bold text-[#2F5233]">${metrics.salesCount}</div>
            <span class="text-[10px] text-[#667267]">Preço: R$ 34,99 cada</span>
          </div>

          <div class="p-4 rounded-2xl bg-[#EBF3ED] border border-[#2F5233]/20 space-y-1">
            <span class="text-[10px] font-bold text-[#2F5233] uppercase tracking-wider block">Líquido Total</span>
            <div class="text-2xl font-bold text-[#2F5233]">${formatBRL(metrics.netRevenue)}</div>
            <span class="text-[10px] text-[#2F5233] font-semibold">Bruto: ${formatBRL(metrics.grossRevenue)}</span>
          </div>
        </div>

        <!-- RELATÓRIO DE DIVISÃO COM A AMIGA (50% / 50%) -->
        <div class="p-5 rounded-2xl bg-gradient-to-br from-white to-[#FAF7F0] border border-[#E8E2D5] space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E2D5] pb-3">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-[#FEF3C7] text-[#B45309] flex items-center justify-center text-xs">
                <i class="fa-solid fa-handshake-simple"></i>
              </span>
              <div>
                <h4 class="text-xs font-bold text-[#28302A]">Relatório de Divisão da Parceria (50% / 50%)</h4>
                <p class="text-[11px] text-[#667267]">Divisão transparente após desconto estimado das taxas da plataforma (~9,9%).</p>
              </div>
            </div>
            <div class="flex items-center gap-2 flex-wrap">
              <button 
                type="button" 
                onclick="ActaApp.handleCopySplitReport()"
                class="text-xs px-3 py-1.5 rounded-full bg-white border border-[#CCD8CD] text-[#28302A] hover:bg-[#FAF7F0] font-semibold transition flex items-center gap-1.5 shadow-2xs"
                title="Copia o relatório para a sua área de transferência (Ctrl + V)"
              >
                <i class="fa-solid fa-copy text-[#2F5233]"></i>
                <span>Copiar Relatório</span>
              </button>
              <button 
                type="button" 
                onclick="ActaApp.handleOpenWhatsAppReport()"
                class="text-xs px-3 py-1.5 rounded-full bg-[#EBF3ED] border border-[#2F5233]/25 text-[#2F5233] hover:bg-[#dfeee2] font-bold transition flex items-center gap-1.5 shadow-2xs"
                title="Abre o WhatsApp com o texto já pronto para enviar à sua amiga"
              >
                <i class="fa-brands fa-whatsapp text-emerald-600 text-sm"></i>
                <span>Enviar pelo WhatsApp</span>
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div class="p-3 rounded-xl bg-white border border-[#E8E2D5] flex items-center justify-between">
              <div>
                <span class="text-[10px] font-bold text-[#667267] uppercase block">Sua Parte (Você - 50%)</span>
                <span class="text-base font-bold text-[#2F5233]">${formatBRL(metrics.splitAmount)}</span>
              </div>
              <i class="fa-solid fa-user-check text-[#2F5233] text-lg opacity-40"></i>
            </div>
            <div class="p-3 rounded-xl bg-white border border-[#E8E2D5] flex items-center justify-between">
              <div>
                <span class="text-[10px] font-bold text-[#667267] uppercase block">Parte da Amiga (Parceira - 50%)</span>
                <span class="text-base font-bold text-[#1E3A5F]">${formatBRL(metrics.splitAmount)}</span>
              </div>
              <i class="fa-solid fa-heart text-[#1E3A5F] text-lg opacity-40"></i>
            </div>
          </div>
        </div>

        <!-- Ação Rápida de Registro Manual de Venda -->
        <div class="p-4 rounded-2xl bg-white border border-[#E8E2D5] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h5 class="text-xs font-bold text-[#28302A]">Registrar Venda Direta (PIX ou Dinheiro)</h5>
            <p class="text-[11px] text-[#667267]">Soma +1 venda de R$ 34,99 ao relatório financeiro para atualizar o rateio automaticamente.</p>
          </div>
          <button 
            type="button" 
            onclick="ActaApp.handleRecordManualSale()" 
            class="hero-btn-green text-xs font-bold px-4 py-2 rounded-full shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <i class="fa-solid fa-plus text-[10px]"></i>
            <span>+ Registrar Venda (R$ 34,99)</span>
          </button>
        </div>
      `;
    },

    handleCopySplitReport: function() {
      const m = ActaStorage.getAdminMetrics();
      const formatBRL = (v) => 'R$ ' + Number(v).toFixed(2).replace('.', ',');
      const text = `📊 *RELATÓRIO DE VENDAS - PLANNER ACTA*\n` +
        `Data: ${new Date().toLocaleDateString('pt-BR')}\n` +
        `--------------------------------\n` +
        `Total de Licenças: ${m.salesCount} vendas (R$ 34,99)\n` +
        `Faturamento Bruto: ${formatBRL(m.grossRevenue)}\n` +
        `Taxas estimadas (~9,9%): ${formatBRL(m.estimatedFees)}\n` +
        `Líquido Total: ${formatBRL(m.netRevenue)}\n` +
        `--------------------------------\n` +
        `Sua Parte (Você - 50%): ${formatBRL(m.splitAmount)}\n` +
        `Parte da Parceira (50%): ${formatBRL(m.splitAmount)}\n` +
        `--------------------------------\n` +
        `Planner ACTA • Gestão em Família`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          this.showToast('📋 Relatório copiado! Agora basta abrir o WhatsApp e dar Colar (Ctrl + V).');
        }).catch(() => {
          alert(text);
        });
      } else {
        alert(text);
      }
    },

    handleOpenWhatsAppReport: function() {
      const m = ActaStorage.getAdminMetrics();
      const formatBRL = (v) => 'R$ ' + Number(v).toFixed(2).replace('.', ',');
      const text = `📊 *RELATÓRIO DE VENDAS - PLANNER ACTA*\n` +
        `Data: ${new Date().toLocaleDateString('pt-BR')}\n` +
        `--------------------------------\n` +
        `Total de Licenças: ${m.salesCount} vendas (R$ 34,99)\n` +
        `Faturamento Bruto: ${formatBRL(m.grossRevenue)}\n` +
        `Taxas estimadas (~9,9%): ${formatBRL(m.estimatedFees)}\n` +
        `Líquido Total: ${formatBRL(m.netRevenue)}\n` +
        `--------------------------------\n` +
        `Sua Parte (Você - 50%): ${formatBRL(m.splitAmount)}\n` +
        `Parte da Parceira (50%): ${formatBRL(m.splitAmount)}\n` +
        `--------------------------------\n` +
        `Planner ACTA • Gestão em Família`;

      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');
      this.showToast('📲 Abrindo WhatsApp com o relatório pronto!');
    },

    handleResetVisitsMetric: function() {
      if (confirm('Deseja zerar a contagem de acessos de teste para iniciar o lançamento oficial limpo?')) {
        ActaStorage.resetVisitsMetric();
        this.showToast('🔄 Contador de acessos zerado para o lançamento!');
        this.renderAdminMetricsTab();
      }
    },

    handleRecordManualSale: function() {
      ActaStorage.recordManualSale();
      this.showToast('✅ Venda registrada com sucesso no relatório financeiro!');
      this.renderAdminMetricsTab();
    },

    renderAdminKeysTab: function() {
      const keys = JSON.parse(localStorage.getItem('ACTA_ADMIN_KEYS') || '[]');
      const container = document.getElementById('adminKeysContent');
      if (!container) return;

      container.innerHTML = `
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E8E2D5] pb-3">
          <div>
            <h4 class="text-xs font-bold text-[#28302A]">Gerador de Chaves de Ativação</h4>
            <p class="text-[11px] text-[#667267]">Gere códigos para enviar para clientes que comprarem por PIX ou pelo Hotmart.</p>
          </div>
          <button 
            type="button" 
            onclick="ActaApp.handleGenerateAdminKey()"
            class="hero-btn-green text-xs font-bold px-4 py-2 rounded-full shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <i class="fa-solid fa-key text-[10px]"></i>
            <span>+ Gerar Nova Chave</span>
          </button>
        </div>

        <div class="space-y-2 pt-2">
          ${keys.length === 0 ? `
            <div class="p-8 text-center bg-[#FAF7F0] rounded-2xl border border-[#E8E2D5] text-[#667267] text-xs">
              Nenhuma chave gerada manualmente ainda. Clique no botão acima para gerar a primeira chave oficial.
            </div>
          ` : keys.map(k => `
            <div class="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8E2D5] flex items-center justify-between text-xs">
              <div class="space-y-0.5">
                <span class="font-mono font-bold text-[#2F5233] text-sm">${k.key}</span>
                <span class="text-[10px] text-[#667267] block">${k.notes} • Criada em ${new Date(k.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
              <button 
                type="button" 
                onclick="navigator.clipboard.writeText('${k.key}'); ActaApp.showToast('Chave ${k.key} copiada!');"
                class="px-3 py-1.5 rounded-lg bg-white border border-[#CCD8CD] text-[11px] font-bold text-[#28302A] hover:bg-[#FAF7F0] transition shadow-2xs"
              >
                Copiar Chave
              </button>
            </div>
          `).join('')}
        </div>
      `;
    },

    handleGenerateAdminKey: function() {
      const notes = prompt('Para quem é esta chave? (Ex: Nome da cliente, venda Hotmart, etc.):', 'Venda Hotmart');
      if (notes === null) return;
      const newKey = ActaStorage.generateNewKey(notes);
      this.showToast(`🔑 Chave gerada com sucesso: ${newKey.key}`);
      this.renderAdminKeysTab();
    },

    renderAdminSupportTab: function() {
      const messages = ActaStorage.getSupportMessages();
      const container = document.getElementById('adminSupportContent');
      if (!container) return;

      container.innerHTML = `
        <div class="border-b border-[#E8E2D5] pb-3">
          <h4 class="text-xs font-bold text-[#28302A]">Central de Mensagens e Suporte Local</h4>
          <p class="text-[11px] text-[#667267]">Todas as dúvidas deixadas pelas famílias ficam salvas aqui, sem encher sua caixa de e-mail.</p>
        </div>

        <div class="space-y-3 pt-2">
          ${messages.length === 0 ? `
            <div class="p-8 text-center bg-[#FAF7F0] rounded-2xl border border-[#E8E2D5] text-[#667267] text-xs">
              Nenhuma mensagem de suporte recebida no momento. Tudo tranquilo!
            </div>
          ` : messages.map(m => `
            <div class="p-4 bg-[#FAF7F0] rounded-2xl border border-[#E8E2D5] space-y-2.5 text-xs">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-[#28302A]">${m.sender}</span>
                  <span class="text-[10px] px-2 py-0.5 rounded-full ${m.status === 'respondido' ? 'bg-[#EBF3ED] text-[#2F5233]' : 'bg-[#FEF3C7] text-[#B45309]'} font-bold">
                    ${m.status === 'respondido' ? '✅ Respondido' : '⏳ Pendente'}
                  </span>
                </div>
                <span class="text-[10px] text-[#8E9A8F]">${new Date(m.createdAt).toLocaleDateString('pt-BR')}</span>
              </div>
              <p class="font-semibold text-[#28302A] text-[11px]">${m.subject}</p>
              <p class="text-[#667267] bg-white p-3 rounded-xl border border-[#E8E2D5] leading-relaxed">${m.message}</p>
              ${m.reply ? `
                <div class="p-2.5 rounded-xl bg-[#EBF3ED] border border-[#2F5233]/20 text-[11px] text-[#2F5233]">
                  <strong>Sua Resposta:</strong> ${m.reply}
                </div>
              ` : `
                <button 
                  type="button" 
                  onclick="ActaApp.handleReplySupportModal('${m.id}')"
                  class="hero-btn-green text-xs font-bold px-3.5 py-1.5 rounded-full shadow-2xs"
                >
                  Responder / Concluir
                </button>
              `}
            </div>
          `).join('')}
        </div>
      `;
    },

    handleReplySupportModal: function(msgId) {
      const reply = prompt('Digite sua resposta para esta família:');
      if (!reply) return;
      ActaStorage.replySupportMessage(msgId, reply);
      this.showToast('✅ Resposta gravada localmente com sucesso!');
      this.renderAdminSupportTab();
    },

    renderAdminSimulatorTab: function() {
      const currentRole = ActaStorage.getSimulatedRole();
      const container = document.getElementById('adminSimulatorContent');
      if (!container) return;

      container.innerHTML = `
        <div class="border-b border-[#E8E2D5] pb-3">
          <h4 class="text-xs font-bold text-[#28302A]">Simulador de Visão de Usuário (Auditoria)</h4>
          <p class="text-[11px] text-[#667267]">Alterne instantaneamente o modo de exibição para testar como o app se comporta em cada plano.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div 
            onclick="ActaApp.handleSetSimulatedRole('normal')" 
            class="p-4 rounded-2xl border cursor-pointer transition ${currentRole === 'normal' ? 'bg-[#EBF3ED] border-[#2F5233] shadow-xs' : 'bg-[#FAF7F0] border-[#E8E2D5] hover:bg-white'}"
          >
            <div class="flex items-center gap-2 font-bold text-xs text-[#28302A] mb-1">
              <span>👑 Administradora</span>
            </div>
            <p class="text-[11px] text-[#667267]">Acesso irrestrito vitalício e painel de controle.</p>
          </div>

          <div 
            onclick="ActaApp.handleSetSimulatedRole('free')" 
            class="p-4 rounded-2xl border cursor-pointer transition ${currentRole === 'free' ? 'bg-[#EBF3ED] border-[#2F5233] shadow-xs' : 'bg-[#FAF7F0] border-[#E8E2D5] hover:bg-white'}"
          >
            <div class="flex items-center gap-2 font-bold text-xs text-[#28302A] mb-1">
              <span>👁️ Usuário Free</span>
            </div>
            <p class="text-[11px] text-[#667267]">Auditar bloqueios, selos PRO e vitrines de compra.</p>
          </div>

          <div 
            onclick="ActaApp.handleSetSimulatedRole('pro')" 
            class="p-4 rounded-2xl border cursor-pointer transition ${currentRole === 'pro' ? 'bg-[#EBF3ED] border-[#2F5233] shadow-xs' : 'bg-[#FAF7F0] border-[#E8E2D5] hover:bg-white'}"
          >
            <div class="flex items-center gap-2 font-bold text-xs text-[#28302A] mb-1">
              <span>⭐ Assinatura Ativa</span>
            </div>
            <p class="text-[11px] text-[#667267]">Visão da compradora com anuidade em dia e tudo liberado.</p>
          </div>

          <div 
            onclick="ActaApp.handleSetSimulatedRole('expired')" 
            class="p-4 rounded-2xl border cursor-pointer transition ${currentRole === 'expired' ? 'bg-[#FBECE8] border-[#DC2626] shadow-xs' : 'bg-[#FAF7F0] border-[#E8E2D5] hover:bg-white'}"
          >
            <div class="flex items-center gap-2 font-bold text-xs text-[#DC2626] mb-1">
              <span>⏳ Anuidade Expirada</span>
            </div>
            <p class="text-[11px] text-[#667267]">Testa o bloqueio de encerramento do ciclo de 1 ano e botão de renovação.</p>
          </div>
        </div>
      `;
    },

    handleSetSimulatedRole: function(role) {
      ActaStorage.setSimulatedRole(role);
      this.updateProNavigationUI();
      this.refreshAllTabs();
      this.switchTab(this.currentTab || 'casa');
      this.showToast(`Modo alterado para: ${role.toUpperCase()}`);
      this.renderAdminSimulatorTab();
    },

    renderAdminConfigTab: function() {
      const pin = ActaStorage.getAdminPin();
      const url = ActaStorage.HOTMART_CHECKOUT_URL;
      const announcement = localStorage.getItem('ACTA_ADMIN_ANNOUNCEMENT') || '';

      const container = document.getElementById('adminConfigContent');
      if (!container) return;

      container.innerHTML = `
        <div class="border-b border-[#E8E2D5] pb-3">
          <h4 class="text-xs font-bold text-[#28302A]">Configurações da Administradora</h4>
          <p class="text-[11px] text-[#667267]">Ajuste o seu código PIN secreto, link do Hotmart e avisos para as famílias.</p>
        </div>

        <form onsubmit="event.preventDefault(); ActaApp.handleSaveAdminConfig();" class="space-y-4 pt-2 text-xs">
          <div>
            <label class="block font-bold text-[#28302A] mb-1">Código PIN Secreto de Acesso (Atual: ${pin})</label>
            <input type="text" id="adminNewPinInput" value="${pin}" maxlength="8" class="w-full sm:w-64 p-2.5 border border-[#CCD8CD] rounded-xl font-mono text-sm bg-[#FAF7F0] focus:bg-white focus:outline-none">
            <span class="text-[10px] text-[#667267] block mt-1">Mínimo de 4 dígitos para proteger o seu painel de controle.</span>
          </div>

          <div>
            <label class="block font-bold text-[#28302A] mb-1">Link da Página de Checkout do Hotmart</label>
            <input type="url" id="adminHotmartUrlInput" value="${url}" placeholder="https://pay.hotmart.com/SEU_CODIGO" class="w-full p-2.5 border border-[#CCD8CD] rounded-xl font-mono text-xs bg-[#FAF7F0] focus:bg-white focus:outline-none">
            <span class="text-[10px] text-[#667267] block mt-1">Cole aqui o link do seu produto no Hotmart quando criar a página de vendas.</span>
          </div>

          <div>
            <label class="block font-bold text-[#28302A] mb-1">Mural de Avisos da Coordenação (Opcional)</label>
            <textarea id="adminAnnouncementInput" rows="2" placeholder="Ex: Sejam bem-vindas à semana de planejamento!..." class="w-full p-2.5 border border-[#CCD8CD] rounded-xl text-xs bg-[#FAF7F0] focus:bg-white focus:outline-none">${announcement}</textarea>
          </div>

          <div class="pt-2">
            <button type="submit" class="hero-btn-green font-bold px-6 py-2.5 rounded-full shadow-xs">
              Salvar Configurações
            </button>
          </div>
        </form>
      `;
    },

    handleSaveAdminConfig: function() {
      const pinInput = document.getElementById('adminNewPinInput');
      const urlInput = document.getElementById('adminHotmartUrlInput');
      const annInput = document.getElementById('adminAnnouncementInput');

      if (pinInput && pinInput.value.trim().length >= 4) {
        ActaStorage.setAdminPin(pinInput.value.trim());
      }
      if (urlInput && urlInput.value.trim()) {
        ActaStorage.HOTMART_CHECKOUT_URL = urlInput.value.trim();
        localStorage.setItem('ACTA_HOTMART_CHECKOUT_URL', urlInput.value.trim());
      }
      if (annInput) {
        ActaStorage.setAdminAnnouncement(annInput.value.trim());
      }

      this.showToast('✅ Configurações da Administradora salvas com sucesso!');
      this.renderAdminConfigTab();
    },

    // Modal de Suporte Local para as famílias
    openSupportModal: function() {
      this.openModal('modalSupport');
    },

    handleSendSupportMessage: function() {
      const nameInput = document.getElementById('supportSenderName');
      const subInput = document.getElementById('supportSubject');
      const msgInput = document.getElementById('supportMessageText');

      const name = nameInput ? nameInput.value.trim() : '';
      const subject = subInput ? subInput.value.trim() : '';
      const message = msgInput ? msgInput.value.trim() : '';

      if (!message) {
        alert('Por favor, escreva sua mensagem ou dúvida.');
        return;
      }

      ActaStorage.addSupportMessage(name, subject, message);
      this.closeModal('modalSupport');
      this.showToast('💌 Mensagem enviada para a coordenação com sucesso!');

      if (msgInput) msgInput.value = '';
    },

    previewImage: function(imgUrl) {
      const modal = document.getElementById('modalImagePreview');
      const img = document.getElementById('modalImagePreviewSrc');
      if (modal && img) {
        img.src = imgUrl;
        this.openModal('modalImagePreview');
      }
    },

    showToast: function(message) {
      const toast = document.getElementById('appToast');
      if (!toast) return;

      toast.textContent = message;
      toast.classList.remove('translate-y-20', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');

      setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-20', 'opacity-0');
      }, 3200);
    }
  };

  window.ActaApp = ActaApp;

  document.addEventListener('DOMContentLoaded', () => {
    ActaApp.init();
  });
})(window);
