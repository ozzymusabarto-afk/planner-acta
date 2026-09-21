/**
 * PLANNER ACTA — Motor de Planejamento e Visão "Semana"
 * Apresentação dos dias da semana em blocos organizados com botões diretos de [Ver conteúdo] e [Registrar].
 */

(function(window) {
  'use strict';

  const ActaPlanner = {
    selectedSubTab: 'planejamento', // 'planejamento' | 'calendario' | 'materiais'

    renderWeekScheduleHTML: function(scheduleData, activePerson) {
      if (!scheduleData || scheduleData.length === 0) {
        return `
          <div class="p-8 text-center bg-white rounded-2xl border border-[#E8E2D5] text-[#667267]">
            <p class="text-sm font-medium">Nenhum planejamento registrado para esta semana.</p>
          </div>
        `;
      }

      let html = '<div class="space-y-4">';

      scheduleData.forEach(day => {
        html += `
          <div class="acta-card overflow-hidden bg-white border border-[#E8E2D5]">
            <!-- Cabeçalho do Dia -->
            <div class="bg-[#FDFBF7] px-4 py-2.5 border-b border-[#E8E2D5] flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold uppercase tracking-wider text-[#28302A]">
                  ${day.dayTitle}
                </span>
                <span class="text-xs text-[#667267] font-medium font-mono">${day.dateLabel}</span>
              </div>
            </div>

            <!-- Lista de Atividades do Dia -->
            <div class="divide-y divide-[#F0ECE4]">
        `;

        day.items.forEach(item => {
          let iconClass = 'fa-book-open';
          let iconColor = 'text-[#2F5233]';

          if (item.subject.toLowerCase().includes('português')) {
            iconClass = 'fa-book';
            iconColor = 'text-[#A95337]';
          } else if (item.subject.toLowerCase().includes('matemática')) {
            iconClass = 'fa-calculator';
            iconColor = 'text-[#1E3A5F]';
          } else if (item.subject.toLowerCase().includes('ciências')) {
            iconClass = 'fa-seedling';
            iconColor = 'text-[#2F5233]';
          } else if (item.subject.toLowerCase().includes('história')) {
            iconClass = 'fa-landmark';
            iconColor = 'text-[#8C472E]';
          } else if (item.subject.toLowerCase().includes('geografia')) {
            iconClass = 'fa-earth-americas';
            iconColor = 'text-[#325B6C]';
          }

          html += `
            <div class="p-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FDFBF7] transition">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-[#FAF7F0] border border-[#E8E2D5] flex items-center justify-center shrink-0">
                  <i class="fa-solid ${iconClass} ${iconColor} text-sm"></i>
                </div>
                <div>
                  <span class="text-xs font-bold text-[#28302A] block">${item.subject}</span>
                  <span class="text-xs text-[#667267] font-medium">${item.content}</span>
                </div>
              </div>

              <div class="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button 
                  type="button" 
                  onclick="ActaApp.viewContentDetails('${item.materialId || ''}', '${encodeURIComponent(item.content)}', '${item.subject}')"
                  class="text-xs font-medium px-3.5 py-1.5 rounded-full border border-[#E8E2D5] text-[#28302A] hover:bg-[#F4EFE6] transition"
                >
                  Ver conteúdo
                </button>
                <button 
                  type="button" 
                  onclick="ActaApp.openQuickRegisterFromPlan('${item.materialId || ''}', '${encodeURIComponent(item.content)}', '${item.subject}')"
                  class="text-xs font-semibold px-4 py-1.5 rounded-full bg-[#2F5233] text-white hover:bg-[#223D26] shadow-sm transition"
                >
                  Registrar
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
    }
  };

  window.ActaPlanner = ActaPlanner;
})(window);
