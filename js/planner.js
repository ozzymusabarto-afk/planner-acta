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
      'arte': { icon: 'fa-palette', color: 'text-[#7C3AED]', bg: 'bg-[#FAF7F0]' },
      'latim': { icon: 'fa-feather-pointed', color: 'text-[#8B5CF6]', bg: 'bg-[#FAF7F0]' },
      'inglês': { icon: 'fa-language', color: 'text-[#2563EB]', bg: 'bg-[#FAF7F0]' },
      'ingles': { icon: 'fa-language', color: 'text-[#2563EB]', bg: 'bg-[#FAF7F0]' },
      'espanhol': { icon: 'fa-earth-americas', color: 'text-[#EA580C]', bg: 'bg-[#FAF7F0]' },
      'música': { icon: 'fa-music', color: 'text-[#D97706]', bg: 'bg-[#FAF7F0]' },
      'musica': { icon: 'fa-music', color: 'text-[#D97706]', bg: 'bg-[#FAF7F0]' },
      'religião': { icon: 'fa-hands-praying', color: 'text-[#059669]', bg: 'bg-[#FAF7F0]' },
      'virtudes': { icon: 'fa-heart', color: 'text-[#E11D48]', bg: 'bg-[#FAF7F0]' },
      'filosofia': { icon: 'fa-lightbulb', color: 'text-[#4F46E5]', bg: 'bg-[#FAF7F0]' },
      'lógica': { icon: 'fa-brain', color: 'text-[#4F46E5]', bg: 'bg-[#FAF7F0]' },
      'robótica': { icon: 'fa-robot', color: 'text-[#0284C7]', bg: 'bg-[#FAF7F0]' },
      'programação': { icon: 'fa-code', color: 'text-[#0284C7]', bg: 'bg-[#FAF7F0]' }
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
        const completedItems = (scheduleData || []).reduce((acc, d) => {
          return acc + ((d.items || []).filter(i => i.status === 'concluido').length);
        }, 0);
        const pct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

        let motivationalMsg = 'Comece marcando as lições concluídas do dia!';
        if (pct === 100) motivationalMsg = '🌟 Parabéns! Todas as aulas da semana foram concluídas com louvor!';
        else if (pct >= 80) motivationalMsg = 'Reta final da semana! Quase tudo concluído com constância.';
        else if (pct >= 50) motivationalMsg = 'Mais da metade da semana concluída! Ótimo ritmo de estudos.';
        else if (pct > 0) motivationalMsg = 'Bom início de semana! Passo a passo o aprendizado se consolida.';

        html += `
          <div class="planner-card p-4 bg-gradient-to-r from-[#FAF7F0] via-white to-[#EBF3ED] border border-[#CCD8CD] rounded-2xl shadow-2xs mb-4 space-y-2.5">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl ${pct === 100 ? 'bg-[#2F5233]' : 'bg-[#1E3A5F]'} text-white flex items-center justify-center text-xs shrink-0 shadow-xs">
                  <i class="fa-solid ${pct === 100 ? 'fa-award' : 'fa-chart-pie'}"></i>
                </div>
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="text-xs font-bold text-[#28302A]">
                      Progresso Semanal: <strong>${completedItems} de ${totalItems} aulas concluídas</strong> (${pct}%)
                    </span>
                    ${pct === 100 ? '<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#EBF3ED] text-[#2F5233]">Concluída!</span>' : ''}
                  </div>
                  <span class="text-[11px] text-[#667267] font-medium">${motivationalMsg}</span>
                </div>
              </div>
              <div class="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button 
                  type="button" 
                  onclick="if(window.ActaCurriculum) ActaCurriculum.openCurriculumModal('${activePerson ? activePerson.id : ''}')"
                  class="text-[11px] font-bold px-3 py-1.5 rounded-full bg-white border border-[#2F5233]/30 text-[#2F5233] hover:bg-[#EBF3ED] transition flex items-center gap-1 shadow-2xs"
                  title="Ajustar matérias e grade da semana"
                >
                  <i class="fa-solid fa-sliders text-[10px]"></i>
                  <span>Ajustar Grade</span>
                </button>
                <button 
                  type="button" 
                  onclick="ActaPlanner.printWeekSchedule()"
                  class="text-[11px] font-bold px-3 py-1.5 rounded-full bg-white border border-[#CCD8CD] text-[#28302A] hover:bg-[#FAF7F0] transition flex items-center gap-1 shadow-2xs"
                  title="Imprimir folha A4 com a grade semanal"
                >
                  <i class="fa-solid fa-print text-[#667267] text-[10px]"></i>
                  <span>Imprimir Folha</span>
                </button>
              </div>
            </div>

            <!-- Barra de Progresso Animada -->
            <div class="w-full bg-[#E8E2D5] h-2.5 rounded-full overflow-hidden shadow-inner">
              <div class="bg-gradient-to-r from-[#2F5233] to-[#437549] h-full rounded-full transition-all duration-500 ease-out" style="width: ${pct}%"></div>
            </div>
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
                  class="text-[11px] font-bold px-3 py-1 rounded-full bg-[#EBF3ED] border border-[#2F5233]/30 text-[#2F5233] hover:bg-[#2F5233] hover:text-white transition flex items-center gap-1 shadow-2xs"
                  title="Incluir mais uma aula ou matéria neste dia"
                >
                  <i class="fa-solid fa-plus text-[9px]"></i>
                  <span>+ Incluir Aula</span>
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
                  class="text-[11px] font-medium px-2 py-1 rounded-full border border-[#E8E2D5] text-[#8E9A8F] hover:text-[#A95337] hover:border-[#A95337]/40 hover:bg-rose-50/70 transition flex items-center gap-1"
                  title="Excluir esta aula do planejamento"
                >
                  <i class="fa-solid fa-trash-can text-[10px]"></i>
                  <span>Excluir</span>
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

    onSubjectChange: function(subjectVal) {
      const group = document.getElementById('planCustomSubjectGroup');
      const input = document.getElementById('planCustomSubjectInput');
      if (group) {
        if (subjectVal === '__custom__') {
          group.classList.remove('hidden');
          if (input) input.focus();
        } else {
          group.classList.add('hidden');
        }
      }
    },

    toggleLinkMaterial: function(checked) {
      const group = document.getElementById('planMaterialGroup');
      const matSelect = document.getElementById('planMaterialSelect');
      if (group) {
        if (checked) {
          group.classList.remove('hidden');
          const storage = window.ActaStorage;
          const materials = storage ? storage.getMaterials() : [];
          if (matSelect) {
            matSelect.innerHTML = `
              <option value="">Selecione um material da Biblioteca...</option>
              ${materials.map(m => `
                <option value="${m.id}">${m.subject ? m.subject + ' — ' : ''}${m.title}</option>
              `).join('')}
            `;
            if (materials.length > 0) {
              this.updateTopicOptions(matSelect.value);
            }
          }
        } else {
          group.classList.add('hidden');
        }
      }
    },

    updateTopicOptions: function(materialId) {
      const storage = window.ActaStorage;
      const contentSelect = document.getElementById('planContentSelect');
      if (!contentSelect) return;

      if (!materialId) {
        contentSelect.innerHTML = '<option value="">Primeiro selecione um material acima...</option>';
        return;
      }

      const mat = storage ? storage.getMaterialById(materialId) : null;
      const topics = mat ? (mat.topics || mat.indexList || []) : [];

      if (topics.length === 0) {
        contentSelect.innerHTML = '<option value="">Material sem tópicos cadastrados no sumário</option>';
        return;
      }

      contentSelect.innerHTML = `
        <option value="">Selecione um tópico do sumário...</option>
        ${topics.map(t => {
          const title = t.title || t.name || t;
          const code = t.code ? `${t.code} ` : '';
          return `<option value="${title}">${code}${title}</option>`;
        }).join('')}
      `;

      // Auto-selecionar matéria correspondente se possível
      if (mat && mat.subject) {
        const subjSelect = document.getElementById('planSubjectSelect');
        if (subjSelect) {
          const matchOpt = Array.from(subjSelect.options).find(opt => 
            opt.value.toLowerCase().includes(mat.subject.toLowerCase()) || 
            mat.subject.toLowerCase().includes(opt.value.toLowerCase())
          );
          if (matchOpt) {
            subjSelect.value = matchOpt.value;
            this.onSubjectChange(matchOpt.value);
          }
        }
      }
    },

    onTopicSelectChange: function(topicVal) {
      if (topicVal) {
        const customInput = document.getElementById('planCustomContent');
        if (customInput) {
          customInput.value = topicVal;
        }
      }
    },

    openNewPlanModal: function(preselectedChildId, preselectedDayKey) {
      const storage = window.ActaStorage;
      if (!storage) return;

      const people = storage.getPeople();
      const activePerson = preselectedChildId ? storage.getPersonById(preselectedChildId) : storage.getActivePerson();

      // Popular seletor de criança
      const childSelect = document.getElementById('planChildSelect');
      if (childSelect) {
        childSelect.innerHTML = people.map(p => `
          <option value="${p.id}" ${activePerson && activePerson.id === p.id ? 'selected' : ''}>${p.name}</option>
        `).join('');
      }

      // Pré-selecionar dia da semana se informado
      const daySelect = document.getElementById('planDaySelect');
      if (daySelect && preselectedDayKey) {
        daySelect.value = preselectedDayKey;
      }

      // Resetar campos do formulário
      const subjSelect = document.getElementById('planSubjectSelect');
      if (subjSelect) subjSelect.value = 'Língua Portuguesa';
      this.onSubjectChange('Língua Portuguesa');

      const customSubj = document.getElementById('planCustomSubjectInput');
      if (customSubj) customSubj.value = '';

      const customContent = document.getElementById('planCustomContent');
      if (customContent) customContent.value = '';

      const linkCb = document.getElementById('planLinkMaterialCheckbox');
      if (linkCb) {
        linkCb.checked = false;
        this.toggleLinkMaterial(false);
      }

      const modal = document.getElementById('modalNewPlan');
      const overlay = document.getElementById('modalOverlay');
      if (overlay) {
        const siblings = overlay.querySelectorAll(':scope > div');
        siblings.forEach(s => s.classList.add('hidden'));
        overlay.classList.remove('hidden');
      }
      if (modal) modal.classList.remove('hidden');
    },

    savePlanFromModal: function() {
      const storage = window.ActaStorage;
      if (!storage) return;

      const childSelect = document.getElementById('planChildSelect');
      const daySelect = document.getElementById('planDaySelect');
      const subjSelect = document.getElementById('planSubjectSelect');
      const customSubjInput = document.getElementById('planCustomSubjectInput');
      const customContentInput = document.getElementById('planCustomContent');
      const linkCb = document.getElementById('planLinkMaterialCheckbox');
      const matSelect = document.getElementById('planMaterialSelect');

      const childId = childSelect ? childSelect.value : '';
      const dayKey = daySelect ? daySelect.value : 'segunda';

      let subject = subjSelect ? subjSelect.value : 'Língua Portuguesa';
      if (subject === '__custom__') {
        subject = customSubjInput ? customSubjInput.value.trim() : '';
        if (!subject) subject = 'Atividade Complementar';
      }

      let content = customContentInput ? customContentInput.value.trim() : '';
      if (!content) {
        alert('Por favor, informe o conteúdo ou lição da aula a ser realizada.');
        if (customContentInput) customContentInput.focus();
        return;
      }

      let materialId = (linkCb && linkCb.checked && matSelect) ? matSelect.value : null;

      // 1. Salvar no repositório de planos gerais
      storage.savePlan({
        personId: childId,
        materialId: materialId || '',
        subject: subject,
        contentTitle: content,
        period: 'Semana atual',
        dayKey: dayKey,
        status: 'planejado'
      });

      // 2. Sincronizar na grade semanal atual (weekSchedule)
      const data = storage.getData();
      if (!Array.isArray(data.weekSchedule)) data.weekSchedule = [];

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

      if (!Array.isArray(dayBlock.items)) dayBlock.items = [];

      const meta = this.getSubjectMeta(subject);
      dayBlock.items.push({
        subject: subject,
        content: content,
        materialId: materialId,
        status: 'planejado',
        icon: meta.icon
      });

      storage.saveWeekSchedule(data.weekSchedule);

      // 3. Fechar modal e atualizar interface
      if (window.ActaApp && typeof window.ActaApp.closeModal === 'function') {
        window.ActaApp.closeModal('modalNewPlan');
      } else {
        const modal = document.getElementById('modalNewPlan');
        const overlay = document.getElementById('modalOverlay');
        if (modal) modal.classList.add('hidden');
        if (overlay) overlay.classList.add('hidden');
      }

      if (window.ActaApp && typeof window.ActaApp.renderSemanaTab === 'function') {
        window.ActaApp.renderSemanaTab();
      }

      if (window.ActaApp && typeof window.ActaApp.showToast === 'function') {
        window.ActaApp.showToast(`✅ Aula de ${subject} adicionada para ${dayBlock.dayTitle}!`);
      }
    },

    planDirectContent: function(childId, materialId, contentId, dayKey) {
      const storage = window.ActaStorage;
      if (!storage) return;

      const mat = storage.getMaterialById(materialId);
      const subject = mat ? mat.subject : 'Estudo';
      let contentTitle = 'Conteúdo';

      if (mat) {
        const topics = mat.topics || mat.indexList || [];
        const t = topics.find(item => (item.id === contentId || item.title === contentId));
        if (t) contentTitle = t.title || t.name || contentId;
      }

      const data = storage.getData();
      if (!Array.isArray(data.weekSchedule)) data.weekSchedule = [];

      let dayBlock = data.weekSchedule.find(d => d.dayKey === dayKey);
      if (!dayBlock) {
        dayBlock = { dayKey: dayKey, dayTitle: dayKey, dateLabel: '', items: [] };
        data.weekSchedule.push(dayBlock);
      }
      if (!Array.isArray(dayBlock.items)) dayBlock.items = [];

      const meta = this.getSubjectMeta(subject);
      dayBlock.items.push({
        subject: subject,
        content: contentTitle,
        materialId: materialId,
        status: 'planejado',
        icon: meta.icon
      });

      storage.saveWeekSchedule(data.weekSchedule);
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
    },

    printWeekSchedule: function() {
      const storage = window.ActaStorage;
      if (!storage) return;

      const schedule = storage.getWeekSchedule();
      const activePerson = storage.getActivePerson();
      const weekRange = (window.ActaCurriculum && typeof window.ActaCurriculum.getCurrentWeekRangeLabel === 'function') 
        ? window.ActaCurriculum.getCurrentWeekRangeLabel() 
        : 'Planejamento Semanal';

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Por favor, permita pop-ups no seu navegador para imprimir a folha da semana.');
        return;
      }

      const days = Array.isArray(schedule) ? schedule : [];

      const html = `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Grade Semanal - ${activePerson ? activePerson.name : 'Estudante'}</title>
          <style>
            @page { size: A4 landscape; margin: 10mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #28302A; margin: 0; padding: 12px; background: #fff; }
            .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #2F5233; padding-bottom: 8px; margin-bottom: 12px; }
            .title { font-size: 20px; font-weight: bold; color: #2F5233; margin: 0; }
            .meta { font-size: 13px; color: #555; margin-top: 3px; }
            .grid { display: flex; gap: 8px; }
            .day-col { flex: 1; border: 1.5px solid #CCD8CD; border-radius: 10px; overflow: hidden; background: #FAF7F0; min-height: 440px; display: flex; flex-direction: column; }
            .day-head { background: #2F5233; color: white; padding: 7px 8px; font-size: 13px; font-weight: bold; text-transform: uppercase; text-align: center; }
            .day-date { font-size: 11px; font-weight: normal; opacity: 0.9; }
            .day-body { padding: 8px; flex: 1; display: flex; flex-direction: column; gap: 8px; background: #fff; }
            .item-card { border: 1px solid #E8E2D5; border-radius: 8px; padding: 7px; background: #FAF7F0; font-size: 12px; }
            .item-head { display: flex; align-items: center; gap: 6px; font-weight: bold; color: #28302A; margin-bottom: 3px; }
            .checkbox { width: 14px; height: 14px; border: 1.5px solid #2F5233; border-radius: 3px; display: inline-block; shrink: 0; }
            .item-content { font-size: 11px; color: #667267; margin-left: 20px; }
            .notes-box { margin-top: 12px; border: 1.5px dashed #CCD8CD; border-radius: 8px; padding: 10px; min-height: 45px; font-size: 12px; color: #667267; background: #FAF7F0; }
            .footer { margin-top: 10px; font-size: 11px; color: #888; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">ACTA — Caderno da Família</h1>
              <div class="meta">
                Estudante: <strong>${activePerson ? activePerson.name : 'Estudante'}</strong> 
                ${activePerson && activePerson.schoolYearLabel ? ` • Série: <strong>${activePerson.schoolYearLabel}</strong>` : ''}
              </div>
            </div>
            <div style="text-align: right;">
              <div style="font-weight: bold; font-size: 14px; color: #2F5233;">${weekRange}</div>
              <div style="font-size: 11px; color: #777;">Planejamento Pedagógico Semanal</div>
            </div>
          </div>

          <div class="grid">
            ${days.filter(d => d.dayKey !== 'sabado').map(d => `
              <div class="day-col">
                <div class="day-head">
                  ${d.dayTitle}
                  ${d.dateLabel ? `<div class="day-date">${d.dateLabel}</div>` : ''}
                </div>
                <div class="day-body">
                  ${(d.items || []).map(i => `
                    <div class="item-card">
                      <div class="item-head">
                        <span class="checkbox"></span>
                        <span>${i.subject}</span>
                      </div>
                      <div class="item-content">${i.content}</div>
                    </div>
                  `).join('')}
                  ${(!d.items || d.items.length === 0) ? '<div style="color: #999; font-size: 11px; font-style: italic; text-align: center; margin-top: 20px;">Livre</div>' : ''}
                </div>
              </div>
            `).join('')}
          </div>

          <div class="notes-box">
            <strong>Anotações da Família / Metas da Semana:</strong>
          </div>

          <div class="footer">
            Planner ACTA • Organização serena e formativa para famílias educadoras.
          </div>

          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(html);
      printWindow.document.close();
    }
  };

  window.ActaPlanner = ActaPlanner;
})(window);
