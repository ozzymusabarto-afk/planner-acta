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
      // 1. Aplicar tema salvo
      const savedTheme = ActaStorage.getActiveTheme();
      this.applyTheme(savedTheme);

      // 2. Renderizar componentes iniciais
      this.renderSidebar();
      this.renderCasaTab();
      this.renderCriancasTab();
      this.renderMaterialsTab();
      this.renderSemanaTab();
      this.setupRegistrosForm();
      this.renderCaminhadaTab();
      this.renderDossieTab();
      this.renderConfiguracoesTab();

      // 3. Setup de navegação e listeners
      this.setupNavigation();
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

      // Atualizar dados ao entrar na aba
      if (tabName === 'casa') this.renderCasaTab();
      if (tabName === 'criancas') this.renderCriancasTab();
      if (tabName === 'avaliacoes') this.renderAvaliacoesTab();
      if (tabName === 'biblioteca') this.renderMaterialsTab();
      if (tabName === 'leituras') this.renderLeiturasTab();
      if (tabName === 'filmes') this.renderFilmesTab();
      if (tabName === 'calendario') this.renderCalendarioTab();
      if (tabName === 'semana') this.renderSemanaTab();
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
            class="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl cursor-pointer transition border ${cardBgClass} ${isActive ? 'ring-2 ring-[#2F5233] shadow-sm' : 'hover:shadow-sm'}"
            style="min-width: 200px;"
          >
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full overflow-hidden border border-white shadow-xs shrink-0 bg-white">
                ${ActaStorage.renderAvatarHTML(p.avatar, 'w-full h-full object-cover', p.name)}
              </div>
              <div class="text-left">
                <div class="flex items-center gap-2">
                  <span class="text-base font-bold text-[#28302A] leading-tight">${p.name}</span>
                  ${isActive ? '<span class="text-[9px] bg-[#2F5233] text-white font-bold px-1.5 py-0.5 rounded-full">Ativo</span>' : ''}
                </div>
              </div>
            </div>
            <i class="fa-solid fa-chevron-right text-xs text-[#8E9A8F] ml-2"></i>
          </div>
        `;
      }).join('') + `
        <div 
          onclick="ActaApp.openModal('modalNewPerson')"
          class="card-child-add flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl cursor-pointer transition text-[#667267] hover:text-[#28302A]"
          style="min-width: 200px;"
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

      // Atualiza também os botões de tema visual na Home
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
                <div class="flex items-center gap-2">
                  <h3 class="font-editorial-title text-base font-bold text-[#28302A]">${p.name}</h3>
                  ${isActive ? '<span class="text-[10px] bg-[#EBF3ED] text-[#2F5233] font-bold px-2.5 py-0.5 rounded-full">Ativo</span>' : ''}
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
                    onclick="ActaApp.openAvatarModalForPerson('${p.id}')" 
                    class="text-[11px] text-[#2F5233] hover:text-[#1F3822] hover:underline font-semibold inline-flex items-center gap-1 ml-1"
                  >
                    <i class="fa-solid fa-wand-magic-sparkles text-[10px]"></i> Trocar personagem
                  </button>
                </div>
              </div>
            </div>

            <button 
              type="button" 
              onclick="ActaApp.selectChild('${p.id}')"
              class="text-xs font-semibold px-4 py-2 rounded-full border transition ${isActive ? 'bg-[#2F5233] text-white border-[#2F5233]' : 'bg-[#FAF7F0] text-[#28302A] border-[#E8E2D5] hover:bg-[#F4EFE6]'}"
            >
              ${isActive ? 'Selecionado' : 'Selecionar'}
            </button>
          </div>
        `;
      }).join('');
    },

    saveNewPerson: function() {
      const nameInput = document.getElementById('newPersonName');
      const infoInput = document.getElementById('newPersonInfo');
      const avatarInput = document.getElementById('newPersonAvatar');
      const notesInput = document.getElementById('newPersonNotes');

      if (!nameInput || !nameInput.value.trim()) {
        alert('Por favor, informe o nome da criança.');
        return;
      }

      const newPerson = {
        name: nameInput.value.trim(),
        info: infoInput && infoInput.value.trim() ? infoInput.value.trim().replace(/explorad(a|or)?\s*(•|-)?\s*/gi, '').trim() : '',
        avatar: avatarInput && avatarInput.value ? avatarInput.value : 'assets/avatars/avatar-menino-castanho.png',
        notes: notesInput ? notesInput.value.trim() : ''
      };

      ActaStorage.addPerson(newPerson);
      this.closeModal('modalNewPerson');

      nameInput.value = '';
      if (infoInput) infoInput.value = '';
      if (notesInput) notesInput.value = '';

      this.renderSidebar();
      this.renderCasaTab();
      this.renderCriancasTab();
      this.updateRegisterDropdowns();
      this.showToast(`Criança adicionada com carinho!`);
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
          </div>
        `;
      }

      if (scheduleContainer) {
        const scheduleData = ActaStorage.getWeekSchedule();
        scheduleContainer.innerHTML = ActaPlanner.renderWeekScheduleHTML(scheduleData, activePerson);
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

      // Input de foto de evidência
      const fileInput = document.getElementById('regEvidencePhotoInput');
      if (fileInput) {
        fileInput.addEventListener('change', (e) => this.handleEvidencePhotoUpload(e));
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
            ${p.avatar || '👦'} ${p.name}
          </option>
        `).join('');
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

      const record = {
        personId: person ? person.id : 'p1',
        personName: person ? person.name : 'João',
        materialId: materialId,
        subject: subject,
        contentTitle: content,
        activityType: this.selectedActivities.join(' + ') || 'Estudo',
        result: this.selectedResult || 'compreendeu',
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

      if (childSelect && (childSelect.options.length <= 1 || childSelect.dataset.populated !== 'true')) {
        childSelect.innerHTML = people.map(p => `
          <option value="${p.id}" ${activePerson && activePerson.id === p.id ? 'selected' : ''}>${p.name}</option>
        `).join('');
        childSelect.dataset.populated = 'true';
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
      const title = document.getElementById('calEventTitle').value.trim();
      const type = document.getElementById('calEventType').value;
      const highlight = document.getElementById('calEventHighlight').value === 'true';
      const startDate = document.getElementById('calEventStart').value;
      const endDate = document.getElementById('calEventEnd').value;
      const notes = document.getElementById('calEventNotes').value.trim();

      if (!title || !startDate || !endDate) return;

      ActaStorage.saveCalendarEvent({
        title,
        type,
        startDate,
        endDate,
        highlight,
        notes
      });

      this.closeModal('modalCalendarPeriod');
      this.showToast('✅ Período marcado no calendário!');
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

      if (childSelect && (childSelect.options.length <= 1 || childSelect.dataset.populated !== 'true')) {
        childSelect.innerHTML = people.map(p => `
          <option value="${p.id}" ${activePerson && activePerson.id === p.id ? 'selected' : ''}>${p.name}</option>
        `).join('');
        childSelect.dataset.populated = 'true';
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

      if (childSelect && (childSelect.options.length <= 1 || childSelect.dataset.populated !== 'true')) {
        childSelect.innerHTML = people.map(p => `
          <option value="${p.id}" ${activePerson && activePerson.id === p.id ? 'selected' : ''}>${p.name}</option>
        `).join('');
        childSelect.dataset.populated = 'true';
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
      const childId = document.getElementById('planChildSelect').value;
      const dayKey = document.getElementById('planDaySelect').value;
      const materialId = document.getElementById('planMaterialSelect').value;
      const contentId = document.getElementById('planContentSelect').value;

      if (!childId || !materialId || !contentId) {
        alert('Por favor, selecione a criança, o material e o conteúdo.');
        return;
      }

      ActaPlanner.planDirectContent(childId, materialId, contentId, dayKey);
      this.closeModal('modalNewPlan');
      this.showToast('✅ Estudo adicionado ao planejamento semanal!');
      this.renderSemanaTab();
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

      if (childSelect && (childSelect.options.length <= 1 || childSelect.dataset.populated !== 'true')) {
        childSelect.innerHTML = people.map(p => `
          <option value="${p.id}" ${activePerson && activePerson.id === p.id ? 'selected' : ''}>${p.name}</option>
        `).join('');
        childSelect.dataset.populated = 'true';
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
      // Temas já disponíveis para seleção com 1 clique
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
        overlay.classList.remove('hidden');
        modal.classList.remove('hidden');
        
        const people = ActaStorage.getPeople();
        const activePerson = ActaStorage.getActivePerson();
        const materials = ActaStorage.getMaterials();

        if (modalId === 'modalNewPerson') {
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
          const childSel = document.getElementById('planChildSelect');
          if (childSel) {
            childSel.innerHTML = people.map(p => `
              <option value="${p.id}" ${activePerson && activePerson.id === p.id ? 'selected' : ''}>${p.name}</option>
            `).join('');
          }
          const matSel = document.getElementById('planMaterialSelect');
          if (matSel) {
            matSel.innerHTML = materials.map(m => `
              <option value="${m.id}">${m.subject} — ${m.title}</option>
            `).join('');
            if (materials.length > 0) {
              this.onPlanMaterialChange(materials[0].id);
            }
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
