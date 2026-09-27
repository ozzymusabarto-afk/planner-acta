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
      const totalItems = (scheduleData || []).reduce((acc, d) => acc + (d.items ? d.items.length : 0), 0);
      let html = '';

      if (totalItems === 0) {
        html += `
          <div class="planner-card p-6 bg-gradient-to-r from-[#FAF7F0] via-white to-[#EBF3ED] border-2 border-[#2F5233]/20 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm mb-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-[#2F5233] text-white flex items-center justify-center shrink-0 shadow-md">
                <i class="fa-solid fa-graduation-cap text-xl"></i>
              </div>
              <div>
                <h4 class="text-sm font-bold text-[#28302A]">Grade Semanal de ${activePerson ? activePerson.name : 'Estudos'}</h4>
                <p class="text-xs text-[#667267] mt-0.5">
                  ${activePerson && activePerson.schoolYearLabel ? `Série configurada: <strong>${activePerson.schoolYearLabel}</strong>.` : 'Nenhuma aula distribuída para esta semana ainda.'}
                  Clique no botão para gerar o cronograma com os dias da semana e matérias sugeridas!
                </p>
              </div>
            </div>
            <button 
              type="button" 
              onclick="if(window.ActaApp) ActaApp.openCurriculumModal('${activePerson ? activePerson.id : ''}')"
              class="hero-btn-green text-xs font-bold px-5 py-2.5 rounded-full shadow-md flex items-center gap-2 shrink-0 whitespace-nowrap hover:scale-[1.02] transition"
            >
              <i class="fa-solid fa-wand-magic-sparkles text-xs"></i>
              <span>Gerar Grade Automática</span>
            </button>
          </div>
        `;
      } else {
        html += `
          <div class="p-3 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl flex items-center justify-between gap-3 shadow-2xs mb-4">
            <div class="flex items-center gap-2 text-xs text-[#667267]">
              <i class="fa-solid fa-layer-group text-[#2F5233]"></i>
              <span>Grade ativa: <strong class="text-[#28302A]">${activePerson ? (activePerson.schoolYearLabel || 'Personalizada') : 'Semanal'}</strong> (${totalItems} aulas na semana)</span>
            </div>
            <button 
              type="button" 
              onclick="if(window.ActaApp) ActaApp.openCurriculumModal('${activePerson ? activePerson.id : ''}')"
              class="text-[11px] font-bold px-3 py-1 rounded-full bg-white border border-[#2F5233]/30 text-[#2F5233] hover:bg-[#EBF3ED] transition flex items-center gap-1 shadow-2xs"
              title="Alterar ou personalizar matérias da grade"
            >
              <i class="fa-solid fa-sliders text-[10px]"></i>
              <span>Ajustar Grade</span>
            </button>
          </div>
        `;
      }

      if (!scheduleData || scheduleData.length === 0) {
        return html + `
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

      html += '<div class="space-y-4">';

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
                  onclick="ActaPlanner.openRescheduleModal('${day.dayKey}', ${itemIdx})"
                  class="text-[11px] font-medium px-2.5 py-1 rounded-full border border-[#E8E2D5] bg-white text-[#1E3A5F] hover:bg-[#E9EFF6] transition flex items-center gap-1"
                  title="Não deu essa aula hoje? Clique para remanejar ou trocar com outro dia"
                >
                  <i class="fa-solid fa-arrows-split-up-and-left text-[10px]"></i>
                  <span>Remanejar / Adiar</span>
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

    openRescheduleModal: function(fromDayKey, itemIndex) {
      const storage = window.ActaStorage;
      if (!storage) return;

      const schedule = storage.getWeekSchedule();
      if (!Array.isArray(schedule)) return;

      const fromDay = schedule.find(d => d.dayKey === fromDayKey);
      if (!fromDay || !fromDay.items[itemIndex]) return;

      const item = fromDay.items[itemIndex];
      const modal = document.getElementById('modalRescheduleClass');
      const overlay = document.getElementById('modalOverlay');
      const subEl = document.getElementById('rescheduleClassSubtitle');
      const bodyEl = document.getElementById('rescheduleModalBody');

      if (!modal || !bodyEl) return;

      if (subEl) {
        subEl.textContent = `${item.subject} • Atualmente em ${fromDay.dayTitle}`;
      }

      // Monta as opções para os outros dias da semana
      let html = `
        <div class="p-3 bg-[#FAF7F0] border border-[#CCD8CD] rounded-2xl text-xs space-y-1">
          <div class="font-bold text-[#28302A] flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#1E3A5F]"></span>
            <span>Aula: <strong>${item.subject}</strong></span>
          </div>
          <p class="text-[#667267]">${item.content}</p>
          <p class="text-[11px] text-[#8E9A8F]">Dia de origem: <strong>${fromDay.dayTitle}</strong> (${fromDay.items.length} ${fromDay.items.length === 1 ? 'aula' : 'aulas'} programadas)</p>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-[#28302A]">Para qual dia deseja remanejar?</span>
            <span class="text-[11px] text-[#667267]">Equilíbrio de carga horária</span>
          </div>

          <div class="space-y-2.5">
      `;

      schedule.forEach(day => {
        if (day.dayKey === fromDayKey) return; // não mostra o próprio dia

        // Verifica se o dia de destino já tem essa mesma matéria
        const subjectLower = item.subject.toLowerCase().trim();
        const existingSubjectItem = day.items.find(i => {
          const sub = i.subject.toLowerCase().trim();
          return sub === subjectLower || sub.includes(subjectLower.split(' ')[0]);
        });
        const hasSameSubject = !!existingSubjectItem;

        if (hasSameSubject) {
          html += `
            <div class="p-3 rounded-2xl border border-[#F59E0B]/50 bg-[#FFFBEB] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-[#92400E]">${day.dayTitle}</span>
                  <span class="text-[10px] bg-white text-[#92400E] px-2 py-0.5 rounded-full border border-[#F59E0B]/40 font-semibold">${day.items.length} ${day.items.length === 1 ? 'aula' : 'aulas'}</span>
                </div>
                <p class="text-[11px] text-[#B45309] mt-0.5">
                  ⚠️ Já tem <strong>${existingSubjectItem.subject}</strong> neste dia.
                </p>
              </div>
              <div class="flex items-center gap-1.5 self-end sm:self-auto shrink-0 flex-wrap">
                <!-- Botão Inteligente: Trocar de Lugar (Permutar) -->
                <button 
                  type="button" 
                  onclick="ActaPlanner.openSwapSelect('${fromDayKey}', ${itemIndex}, '${day.dayKey}')"
                  class="text-xs font-bold px-3 py-1.5 bg-[#F59E0B] text-white rounded-full hover:bg-[#D97706] transition shadow-xs flex items-center gap-1"
                  title="Trocar com outra matéria para não sobrecarregar nenhum dia"
                >
                  <i class="fa-solid fa-arrow-right-arrow-left text-[10px]"></i>
                  <span>Trocar c/ outra</span>
                </button>
                <button 
                  type="button" 
                  onclick="ActaPlanner.executeMovePlanItem('${fromDayKey}', ${itemIndex}, '${day.dayKey}')"
                  class="text-[11px] font-medium px-2.5 py-1.5 bg-white text-[#92400E] border border-[#F59E0B]/40 rounded-full hover:bg-[#FEF3C7] transition"
                  title="Adicionar mesmo assim neste dia"
                >
                  Adicionar
                </button>
              </div>
            </div>
          `;
        } else {
          html += `
            <div class="p-3 rounded-2xl border border-[#E8E2D5] bg-white hover:border-[#2F5233]/40 flex items-center justify-between gap-3 transition shadow-2xs">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs font-bold text-[#28302A]">${day.dayTitle}</span>
                  <span class="text-[10px] bg-[#FAF7F0] text-[#667267] px-2 py-0.5 rounded-full border border-[#E8E2D5] font-semibold">${day.items.length} ${day.items.length === 1 ? 'aula' : 'aulas'}</span>
                  <span class="text-[10px] bg-[#EBF3ED] text-[#2F5233] px-2 py-0.5 rounded-full font-semibold">✨ Livre desta matéria</span>
                </div>
                <p class="text-[11px] text-[#667267] mt-0.5">Dia ideal para remanejar sem duplicar conteúdos.</p>
              </div>
              <button 
                type="button" 
                onclick="ActaPlanner.executeMovePlanItem('${fromDayKey}', ${itemIndex}, '${day.dayKey}')"
                class="hero-btn-green text-xs font-bold px-3.5 py-1.5 rounded-full shadow-2xs flex items-center gap-1 shrink-0"
              >
                <span>Mover</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
            </div>
          `;
        }
      });

      html += `
          </div>
        </div>
      `;

      bodyEl.innerHTML = html;

      // Abre overlay e modal
      if (overlay) {
        Array.from(overlay.children).forEach(c => c.classList.add('hidden'));
        overlay.classList.remove('hidden');
      }
      modal.classList.remove('hidden');
    },

    closeRescheduleModal: function() {
      const modal = document.getElementById('modalRescheduleClass');
      const overlay = document.getElementById('modalOverlay');
      if (modal) modal.classList.add('hidden');
      if (overlay) overlay.classList.add('hidden');
    },

    executeMovePlanItem: function(fromDayKey, itemIndex, toDayKey) {
      if (window.ActaCurriculum && typeof window.ActaCurriculum.reschedulePlanItem === 'function') {
        const ok = window.ActaCurriculum.reschedulePlanItem(fromDayKey, itemIndex, toDayKey);
        if (ok) {
          this.closeRescheduleModal();
          if (window.ActaApp && typeof window.ActaApp.renderSemanaTab === 'function') {
            window.ActaApp.renderSemanaTab();
          }
          if (window.ActaApp && typeof window.ActaApp.showToast === 'function') {
            window.ActaApp.showToast('Aula remanejada com sucesso!');
          }
        }
      }
    },

    openSwapSelect: function(fromDayKey, fromItemIndex, toDayKey) {
      const storage = window.ActaStorage;
      if (!storage) return;

      const schedule = storage.getWeekSchedule();
      const toDay = schedule.find(d => d.dayKey === toDayKey);
      const fromDay = schedule.find(d => d.dayKey === fromDayKey);
      const fromItem = fromDay ? fromDay.items[fromItemIndex] : null;
      const bodyEl = document.getElementById('rescheduleModalBody');

      if (!toDay || !fromItem || !bodyEl) return;

      let html = `
        <div class="p-3 bg-[#FEF3C7]/60 border border-[#F59E0B]/30 rounded-2xl text-xs space-y-1">
          <p class="font-bold text-[#92400E]">Trocar aula sem alterar o número de aulas de cada dia:</p>
          <p class="text-[11px] text-[#B45309]">
            A aula de <strong>${fromItem.subject}</strong> irá para ${toDay.dayTitle}. Escolha abaixo qual aula de ${toDay.dayTitle} virá para ${fromDay.dayTitle}:
          </p>
        </div>

        <div class="space-y-2">
          <span class="text-xs font-bold text-[#28302A] block">Aulas de ${toDay.dayTitle}:</span>
      `;

      toDay.items.forEach((targetItem, targetIdx) => {
        html += `
          <div class="p-3 rounded-2xl border border-[#E8E2D5] bg-white hover:border-[#1E3A5F] flex items-center justify-between gap-3 transition shadow-2xs">
            <div>
              <span class="text-xs font-bold text-[#28302A] block">${targetItem.subject}</span>
              <span class="text-[11px] text-[#667267] block">${targetItem.content}</span>
            </div>
            <button 
              type="button" 
              onclick="ActaPlanner.executeSwapPlanItems('${fromDayKey}', ${fromItemIndex}, '${toDayKey}', ${targetIdx})"
              class="text-xs font-bold px-3 py-1.5 bg-[#1E3A5F] text-white rounded-full hover:bg-[#0F2238] transition shadow-xs flex items-center gap-1 shrink-0"
            >
              <i class="fa-solid fa-arrow-right-arrow-left text-[10px]"></i>
              <span>Trocar por esta</span>
            </button>
          </div>
        `;
      });

      html += `
        </div>
        <div class="pt-2 flex justify-start">
          <button type="button" onclick="ActaPlanner.openRescheduleModal('${fromDayKey}', ${fromItemIndex})" class="text-xs text-[#667267] hover:text-[#28302A] flex items-center gap-1">
            <i class="fa-solid fa-arrow-left text-[10px]"></i>
            <span>Voltar às opções de dias</span>
          </button>
        </div>
      `;

      bodyEl.innerHTML = html;
    },

    executeSwapPlanItems: function(fromDayKey, fromItemIndex, toDayKey, toItemIndex) {
      if (window.ActaCurriculum && typeof window.ActaCurriculum.swapPlanItems === 'function') {
        const ok = window.ActaCurriculum.swapPlanItems(fromDayKey, fromItemIndex, toDayKey, toItemIndex);
        if (ok) {
          this.closeRescheduleModal();
          if (window.ActaApp && typeof window.ActaApp.renderSemanaTab === 'function') {
            window.ActaApp.renderSemanaTab();
          }
          if (window.ActaApp && typeof window.ActaApp.showToast === 'function') {
            window.ActaApp.showToast('Aulas trocadas com sucesso! Carga horária mantida em perfeito equilíbrio.');
          }
        }
      }
    },

    promptRescheduleItem: function(fromDayKey, itemIndex) {
      this.openRescheduleModal(fromDayKey, itemIndex);
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
