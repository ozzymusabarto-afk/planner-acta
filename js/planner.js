/**
 * PLANNER ACTA — Motor de Planejamento Direto
 * Filosofia: Criança → Material → Conteúdo → Período.
 * Sem burocracia escolar; organização ágil do caminho pedagógico da família.
 */

(function(window) {
  'use strict';

  const ActaPlanner = {
    selectedPeriod: 'Semana de 15 a 21 de setembro',

    SUBJECT_ICONS: {
      'português': { icon: 'fa-book', color: 'text-[#A95337]', bg: 'bg-[#FAF7F0]' },
      'matemática': { icon: 'fa-calculator', color: 'text-[#1E3A5F]', bg: 'bg-[#FAF7F0]' },
      'ciências': { icon: 'fa-seedling', color: 'text-[#2F5233]', bg: 'bg-[#FAF7F0]' },
      'história': { icon: 'fa-landmark', color: 'text-[#8C472E]', bg: 'bg-[#FAF7F0]' },
      'geografia': { icon: 'fa-earth-americas', color: 'text-[#325B6C]', bg: 'bg-[#FAF7F0]' },
      'literatura': { icon: 'fa-book-open', color: 'text-[#2F5233]', bg: 'bg-[#FAF7F0]' },
      'arte': { icon: 'fa-palette', color: 'text-[#7C3AED]', bg: 'bg-[#FAF7F0]' }
    },

    getSubjectMeta: function(subject) {
      if (!subject) return { icon: 'fa-book-bookmark', color: 'text-[#2F5233]', bg: 'bg-[#FAF7F0]' };
      const subLower = subject.toLowerCase();
      for (const [key, val] of Object.entries(this.SUBJECT_ICONS)) {
        if (subLower.includes(key)) return val;
      }
      return { icon: 'fa-book-bookmark', color: 'text-[#2F5233]', bg: 'bg-[#FAF7F0]' };
    },

    /**
     * Renderiza o planejamento semanal organizado em blocos diários
     */
    renderWeekScheduleHTML: function(scheduleData, activePerson) {
      if (!scheduleData || scheduleData.length === 0) {
        return `
          <div class="planner-card p-8 text-center bg-white border border-[#E8E2D5] text-[#667267] shadow-xs">
            <i class="fa-regular fa-calendar-check text-3xl text-[#8E9A8F] mb-2"></i>
            <p class="text-sm font-medium">Nenhum planejamento registrado para este período.</p>
            <button 
              type="button" 
              onclick="ActaPlanner.openNewPlanModal()"
              class="hero-btn-green text-xs font-semibold px-4 py-2 rounded-full shadow-xs inline-flex items-center gap-1.5 mt-3"
            >
              <i class="fa-solid fa-plus text-[10px]"></i>
              <span>Planejar primeira atividade</span>
            </button>
          </div>
        `;
      }

      let html = '<div class="space-y-4">';

      scheduleData.forEach(day => {
        html += `
          <div class="planner-card overflow-hidden bg-white border border-[#E8E2D5] shadow-xs">
            <!-- Cabeçalho do Dia com Marcador Temático -->
            <div class="bg-[#FDFBF7] px-4 py-2.5 border-b border-[#E8E2D5] flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="planner-bullet"></span>
                <span class="text-xs font-bold uppercase tracking-wider text-[#28302A]">
                  ${day.dayTitle}
                </span>
                <span class="text-[11px] text-[#2F5233] font-bold font-mono px-2 py-0.5 rounded-full bg-[#EBF3ED]">${day.dateLabel ? `• dia ${day.dateLabel}` : ''}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[11px] text-[#667267] font-medium">${day.items.length} ${day.items.length === 1 ? 'conteúdo' : 'conteúdos'}</span>
                <button 
                  type="button" 
                  onclick="ActaPlanner.openNewPlanModal(null, '${day.dayKey}')" 
                  class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white border border-[#E8E2D5] text-[#2F5233] hover:bg-[#EBF3ED] transition flex items-center gap-1 shadow-2xs"
                  title="Adicionar mais uma aula neste dia"
                >
                  <i class="fa-solid fa-plus text-[9px]"></i>
                  <span>Aula</span>
                </button>
              </div>
            </div>

            <!-- Lista de Atividades do Dia -->
            <div class="divide-y divide-[#F0ECE4]">
        `;

        day.items.forEach((item, itemIdx) => {
          const meta = this.getSubjectMeta(item.subject);
          const isDone = item.status === 'concluido';

          html += `
            <div class="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FDFBF7] transition ${isDone ? 'bg-[#FAFBF9]/80' : ''}">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg ${meta.bg} border border-[#E8E2D5] flex items-center justify-center shrink-0">
                  <i class="fa-solid ${meta.icon} ${meta.color} text-sm"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-[#28302A] block ${isDone ? 'line-through text-[#8E9A8F]' : ''}">${item.subject}</span>
                    ${isDone ? '<span class="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#EBF3ED] text-[#2F5233]">Concluída</span>' : ''}
                  </div>
                  <span class="text-xs text-[#667267] font-medium ${isDone ? 'line-through text-[#A3ADA4]' : ''}">${item.content}</span>
                </div>
              </div>

              <div class="flex items-center gap-1.5 self-end sm:self-auto shrink-0 flex-wrap justify-end">
                <!-- Botão 1-Clique: Concluir Aula -->
                <button 
                  type="button"
                  onclick="if(window.ActaCurriculum){ window.ActaCurriculum.togglePlanItemStatus('${day.dayKey}', ${itemIdx}); if(window.ActaApp) window.ActaApp.renderSemanaTab(); }"
                  class="text-[11px] font-semibold px-2.5 py-1 rounded-full border transition flex items-center gap-1 ${isDone ? 'bg-[#EBF3ED] text-[#2F5233] border-[#2F5233]/30 font-bold' : 'bg-white text-[#667267] border-[#E8E2D5] hover:bg-[#FAF7F0]'}"
                  title="${isDone ? 'Aula concluída! Clique para reabrir' : 'Clique para marcar aula como concluída'}"
                >
                  <i class="fa-solid ${isDone ? 'fa-circle-check text-[#2F5233]' : 'fa-circle text-[#D4CBBF]'} text-xs"></i>
                  <span>${isDone ? 'Feita' : 'Concluir'}</span>
                </button>

                <!-- Botão 1-Clique: Adiar / Remanejar -->
                <button 
                  type="button" 
                  onclick="ActaPlanner.promptRescheduleItem('${day.dayKey}', ${itemIdx})"
                  class="text-[11px] font-medium px-2.5 py-1 rounded-full border border-[#E8E2D5] bg-white text-[#1E3A5F] hover:bg-[#E9EFF6] transition flex items-center gap-1"
                  title="Não deu essa aula hoje? Clique para adiar para outro dia"
                >
                  <i class="fa-solid fa-forward-step text-[10px]"></i>
                  <span>Adiar</span>
                </button>

                <!-- Botão Ver Conteúdo -->
                <button 
                  type="button" 
                  onclick="ActaApp.viewContentDetails('${item.materialId || ''}', '${encodeURIComponent(item.content)}', '${item.subject}')"
                  class="text-xs font-medium px-2.5 py-1 rounded-full border border-[#E8E2D5] text-[#28302A] hover:bg-[#F4EFE6] transition"
                  title="Ver índice do livro"
                >
                  Ver
                </button>

                <!-- Botão Registrar Vivência -->
                <button 
                  type="button" 
                  onclick="ActaApp.openQuickRegisterFromPlan('${item.materialId || ''}', '${encodeURIComponent(item.content)}', '${item.subject}')"
                  class="hero-btn-green text-xs font-semibold px-3 py-1 rounded-full shadow-xs transition"
                  title="Registrar o que aconteceu"
                >
                  Registrar
                </button>

                <!-- Excluir Item -->
                <button 
                  type="button" 
                  onclick="ActaPlanner.deletePlanItem('${day.dayKey}', ${itemIdx})"
                  class="text-[#8E9A8F] hover:text-[#A95337] p-1 transition"
                  title="Remover do planejamento"
                >
                  <i class="fa-solid fa-trash-can text-xs"></i>
                </button>
              </div>
            </div>
          `;
        });

        html += `
            </div>
          </div>
        `;
      });

      html += '</div>';
      return html;
    },

    promptRescheduleItem: function(fromDayKey, itemIndex) {
      const dayNames = {
        'segunda': 'Segunda-feira',
        'terca': 'Terça-feira',
        'quarta': 'Quarta-feira',
        'quinta': 'Quinta-feira',
        'sexta': 'Sexta-feira',
        'sabado': 'Sábado'
      };
      const daysOrder = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
      const currentIdx = daysOrder.indexOf(fromDayKey);
      const defaultNextDay = daysOrder[(currentIdx + 1) % daysOrder.length];

      const targetDay = prompt(
        `Adiar aula de hoje para qual dia?\n\nDigite o dia de destino (ex: ${defaultNextDay}, terca, quarta, quinta, sexta ou sabado):`,
        defaultNextDay
      );

      if (targetDay && daysOrder.includes(targetDay.toLowerCase().trim())) {
        const toDayKey = targetDay.toLowerCase().trim();
        const ok = window.ActaCurriculum && typeof window.ActaCurriculum.reschedulePlanItem === 'function'
          ? window.ActaCurriculum.reschedulePlanItem(fromDayKey, itemIndex, toDayKey)
          : false;

        if (ok) {
          if (window.ActaApp && typeof window.ActaApp.renderSemanaTab === 'function') {
            window.ActaApp.renderSemanaTab();
          }
          if (window.ActaApp && typeof window.ActaApp.showToast === 'function') {
            window.ActaApp.showToast(`Aula adiada com sucesso para ${dayNames[toDayKey]}!`);
          }
        }
      }
    },

    openNewPlanModal: function(preselectedChildId, preselectedDayKey) {
      const storage = window.ActaStorage;
      if (!storage) return;

      const modal = document.getElementById('modalNewPlan');
      if (!modal) return;

      const people = storage.getPeople();
      const materials = storage.getMaterials();
      const activePerson = preselectedChildId ? storage.getPersonById(preselectedChildId) : storage.getActivePerson();

      // Popular seletor de criança
      const childSelect = document.getElementById('planChildSelect');
      childSelect.innerHTML = people.map(p => `
        <option value="${p.id}" ${activePerson && activePerson.id === p.id ? 'selected' : ''}>${p.name}</option>
      `).join('');

      // Pré-selecionar dia da semana se informado
      const daySelect = document.getElementById('planDaySelect');
      if (daySelect && preselectedDayKey) {
        daySelect.value = preselectedDayKey;
      }

      // Popular seletor de material
      const matSelect = document.getElementById('planMaterialSelect');
      matSelect.innerHTML = `
        <option value="">Selecione um material da Biblioteca...</option>
        ${materials.map(m => `
          <option value="${m.id}" data-subject="${m.subject}">${m.title} (${m.subject})</option>
        `).join('')}
        <option value="outro">+ Outro material / atividade livre</option>
      `;

      // Atualizar tópicos ao trocar de material
      matSelect.onchange = () => this.updateTopicOptions(matSelect.value);

      // Limpar campos
      document.getElementById('planContentSelect').innerHTML = '<option value="">Primeiro selecione o material acima...</option>';
      document.getElementById('planCustomContent').value = '';
      document.getElementById('planPeriodInput').value = this.selectedPeriod;

      modal.classList.remove('hidden');
    },

    updateTopicOptions: function(materialId) {
      const storage = window.ActaStorage;
      const contentSelect = document.getElementById('planContentSelect');
      const customContentDiv = document.getElementById('planCustomContentDiv');

      if (!materialId || materialId === 'outro') {
        contentSelect.innerHTML = '<option value="">Digite o conteúdo abaixo...</option>';
        if (customContentDiv) customContentDiv.classList.remove('hidden');
        return;
      }

      const mat = storage.getMaterialById(materialId);
      if (!mat || !mat.topics || mat.topics.length === 0) {
        contentSelect.innerHTML = '<option value="">Nenhum tópico no índice (digite abaixo)</option>';
        if (customContentDiv) customContentDiv.classList.remove('hidden');
        return;
      }

      contentSelect.innerHTML = `
        <option value="">Selecione um tópico do índice...</option>
        ${mat.topics.map(t => `<option value="${t.title}">${t.title}</option>`).join('')}
        <option value="__custom__">+ Outro conteúdo deste material</option>
      `;

      contentSelect.onchange = () => {
        if (contentSelect.value === '__custom__') {
          if (customContentDiv) customContentDiv.classList.remove('hidden');
        } else {
          if (customContentDiv) customContentDiv.classList.add('hidden');
        }
      };
    },

    savePlanFromModal: function() {
      const storage = window.ActaStorage;
      const childId = document.getElementById('planChildSelect').value;
      const materialId = document.getElementById('planMaterialSelect').value;
      const contentSelect = document.getElementById('planContentSelect');
      const customContent = document.getElementById('planCustomContent').value.trim();
      const period = document.getElementById('planPeriodInput').value.trim() || 'Semana atual';
      const dayKey = document.getElementById('planDaySelect').value;

      let contentTitle = contentSelect.value;
      if (!contentTitle || contentTitle === '__custom__') {
        contentTitle = customContent;
      }

      if (!contentTitle) {
        alert('Por favor, informe o conteúdo a ser planejado.');
        return;
      }

      let subject = 'Geral';
      if (materialId && materialId !== 'outro') {
        const mat = storage.getMaterialById(materialId);
        if (mat) subject = mat.subject;
      } else {
        const customSubject = document.getElementById('planCustomSubject');
        if (customSubject && customSubject.value.trim()) {
          subject = customSubject.value.trim();
        }
      }

      // 1. Salvar no repositório de planos gerais
      storage.savePlan({
        personId: childId,
        materialId: materialId,
        subject: subject,
        contentTitle: contentTitle,
        period: period,
        dayKey: dayKey,
        status: 'planejado'
      });

      // 2. Sincronizar na grade semanal atual (weekSchedule)
      const data = storage.getData();
      let dayBlock = data.weekSchedule.find(d => d.dayKey === dayKey);
      if (!dayBlock) {
        const dayTitles = {
          segunda: 'Segunda-feira',
          terca: 'Terça-feira',
          quarta: 'Quarta-feira',
          quinta: 'Quinta-feira',
          sexta: 'Sexta-feira',
          sabado: 'Sábado'
        };
        dayBlock = {
          dayKey: dayKey,
          dayTitle: dayTitles[dayKey] || 'Dia da semana',
          dateLabel: '',
          items: []
        };
        data.weekSchedule.push(dayBlock);
      }

      dayBlock.items.push({
        subject: subject,
        content: contentTitle,
        materialId: materialId,
        icon: 'fa-book'
      });

      storage.saveWeekSchedule(data.weekSchedule);

      // 3. Fechar modal e atualizar interface
      document.getElementById('modalNewPlan').classList.add('hidden');
      if (window.ActaApp && typeof window.ActaApp.renderSemanaTab === 'function') {
        window.ActaApp.renderSemanaTab();
      }
    },

    deletePlanItem: function(dayKey, index) {
      if (confirm('Deseja remover este conteúdo do planejamento?')) {
        const storage = window.ActaStorage;
        const data = storage.getData();
        const dayBlock = data.weekSchedule.find(d => d.dayKey === dayKey);
        if (dayBlock && dayBlock.items) {
          dayBlock.items.splice(index, 1);
          storage.saveWeekSchedule(data.weekSchedule);
          if (window.ActaApp && typeof window.ActaApp.renderSemanaTab === 'function') {
            window.ActaApp.renderSemanaTab();
          }
        }
      }
    }
  };

  window.ActaPlanner = ActaPlanner;
})(window);
