/**
 * PLANNER ACTA — Controlador da Interface
 * Gerencia o "Caderno Inteligente da Família", navegação lateral e reatividade dos módulos.
 */

(function(window) {
  'use strict';

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
      document.documentElement.setAttribute('data-theme', themeName);
      ActaStorage.setActiveTheme(themeName);
      
      const themeSelect = document.getElementById('themeSidebarSelect');
      if (themeSelect) themeSelect.value = themeName;
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
      if (tabName === 'biblioteca') this.renderMaterialsTab();
      if (tabName === 'semana') this.renderSemanaTab();
      if (tabName === 'caminhada') this.renderCaminhadaTab();
      if (tabName === 'dossie') this.renderDossieTab();

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    renderSidebar: function() {
      const activePerson = ActaStorage.getActivePerson();
      const sidebarPill = document.getElementById('sidebarActiveChildPill');
      if (sidebarPill && activePerson) {
        sidebarPill.innerHTML = `
          <div class="w-7 h-7 rounded-full bg-[#EBF3ED] text-[#2F5233] flex items-center justify-center text-sm font-bold shrink-0">
            ${activePerson.avatar || '👦'}
          </div>
          <div class="text-left truncate">
            <span class="text-xs font-bold text-[#28302A] block leading-none truncate">${activePerson.name}</span>
            <span class="text-[10px] text-[#667267] block leading-none mt-1 truncate">${activePerson.info || ''}</span>
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

      container.innerHTML = people.map(p => {
        const isActive = activePerson && activePerson.id === p.id;
        return `
          <div 
            onclick="ActaApp.selectChild('${p.id}')"
            class="flex flex-col items-center p-3 rounded-2xl cursor-pointer transition border ${isActive ? 'bg-[#FAF7F0] border-[#2F5233] shadow-sm ring-2 ring-[#2F5233]/20' : 'bg-white border-[#E8E2D5] hover:bg-[#FAF7F0]'}"
            style="min-width: 110px;"
          >
            <div class="w-14 h-14 rounded-full bg-[#FAF7F0] border-2 ${isActive ? 'border-[#2F5233]' : 'border-[#E8E2D5]'} flex items-center justify-center text-3xl shadow-inner mb-2">
              ${p.avatar || '👦'}
            </div>
            <span class="text-xs font-bold text-[#28302A] text-center">${p.name}</span>
            <span class="text-[10px] text-[#667267] text-center truncate max-w-[100px]">${p.info || 'Explorador'}</span>
          </div>
        `;
      }).join('') + `
        <div 
          onclick="ActaApp.openModal('modalNewPerson')"
          class="flex flex-col items-center justify-center p-3 rounded-2xl cursor-pointer border-2 border-dashed border-[#E8E2D5] hover:border-[#2F5233] hover:bg-[#FAF7F0] transition text-[#667267]"
          style="min-width: 110px;"
        >
          <div class="w-14 h-14 rounded-full border border-dashed border-[#8E9A8F] flex items-center justify-center text-xl mb-2 text-[#8E9A8F]">
            <i class="fa-solid fa-plus"></i>
          </div>
          <span class="text-xs font-bold text-[#28302A] text-center">Adicionar criança</span>
        </div>
      `;
    },

    selectChild: function(personId) {
      ActaStorage.setActivePerson(personId);
      this.renderSidebar();
      this.renderCasaTab();
      this.renderCriancasTab();
      this.renderSemanaTab();
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

      container.innerHTML = people.map(p => {
        const isActive = activePerson && activePerson.id === p.id;
        return `
          <div class="acta-card p-5 bg-white border border-[#E8E2D5] flex items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full bg-[#FAF7F0] border border-[#E8E2D5] flex items-center justify-center text-3xl shadow-inner shrink-0">
                ${p.avatar || '👦'}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-editorial-title text-base font-bold text-[#28302A]">${p.name}</h3>
                  ${isActive ? '<span class="text-[10px] bg-[#EBF3ED] text-[#2F5233] font-bold px-2.5 py-0.5 rounded-full">Ativo</span>' : ''}
                </div>
                <p class="text-xs text-[#667267] mt-0.5">${p.info || 'Explorador(a)'}</p>
                ${p.notes ? `<p class="text-[11px] text-[#8E9A8F] italic mt-1.5">"${p.notes}"</p>` : ''}
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
        info: infoInput && infoInput.value.trim() ? infoInput.value.trim() : 'Explorador(a)',
        avatar: avatarInput ? avatarInput.value : '👦',
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
          <div class="w-10 h-10 rounded-full bg-[#FAF7F0] border border-[#E8E2D5] flex items-center justify-center text-xl shrink-0">
            ${activePerson.avatar || '👦'}
          </div>
          <div>
            <span class="text-sm font-bold text-[#28302A] block leading-tight">${activePerson.name}</span>
            <span class="text-xs text-[#667267] block leading-tight">${activePerson.info || 'Explorador'}</span>
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
          <div class="w-10 h-10 rounded-full bg-[#FAF7F0] border border-[#E8E2D5] flex items-center justify-center text-xl shrink-0">
            ${activePerson.avatar || '👦'}
          </div>
          <div>
            <span class="text-sm font-bold text-[#28302A] block leading-tight">${activePerson.name}</span>
            <span class="text-xs text-[#667267] block leading-tight">${activePerson.info || 'Explorador'}</span>
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
    // TELA 7: DOSSIÊ DE ACOMPANHAMENTO
    // ==========================================
    renderDossieTab: function() {
      const container = document.getElementById('dossiePreviewContainer');
      const childSelect = document.getElementById('dossieChildFilter');
      const activePerson = ActaStorage.getActivePerson();
      const people = ActaStorage.getPeople();

      if (!container) return;

      if (childSelect && childSelect.options.length <= 1) {
        childSelect.innerHTML = people.map(p => `
          <option value="${p.id}" ${activePerson && activePerson.id === p.id ? 'selected' : ''}>${p.name}</option>
        `).join('');
      }

      const selectedChildId = childSelect ? childSelect.value : (activePerson ? activePerson.id : 'p1');
      container.innerHTML = ActaReports.generateDossieHTML({
        personId: selectedChildId,
        periodLabel: 'Agosto — Setembro 2025'
      });
    },

    printCurrentDossie: function() {
      window.print();
    },

    // ==========================================
    // TELA 8: CONFIGURAÇÕES & TEMAS
    // ==========================================
    renderConfiguracoesTab: function() {
      // Temas já disponíveis para seleção com 1 clique
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
