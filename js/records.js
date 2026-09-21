/**
 * PLANNER ACTA — Gestão de Registros e Linha do Tempo Visual
 * Formulário simples, humano e acolhedor: "O que aconteceu hoje?" + Linha do Tempo editorial.
 */

(function(window) {
  'use strict';

  const ActaRecords = {
    ACTIVITY_OPTIONS: [
      { id: 'explicacao', label: 'Explicação' },
      { id: 'exercicios', label: 'Exercícios' },
      { id: 'problemas', label: 'Problemas' },
      { id: 'leitura', label: 'Leitura' },
      { id: 'pratica', label: 'Atividade prática' },
      { id: 'outro', label: 'Outro' }
    ],

    RESULT_OPTIONS: [
      {
        id: 'compreendeu',
        label: 'Compreendeu',
        icon: 'fa-check',
        pillClass: 'status-pill-compreendeu'
      },
      {
        id: 'em_pratica',
        label: 'Está desenvolvendo',
        icon: 'fa-seedling',
        pillClass: 'status-pill-desenvolvendo'
      },
      {
        id: 'revisar',
        label: 'Precisa retomar',
        icon: 'fa-rotate-right',
        pillClass: 'status-pill-retomar'
      }
    ],

    /**
     * Gera uma narrativa suave e natural
     */
    generateNarrative: function(subject, contentTitle, activityList, resultId) {
      const cleanTitle = (contentTitle || 'o tema proposto').trim();
      const cleanSubject = subject ? `em ${subject}` : '';

      let actText = 'estudou';
      if (Array.isArray(activityList) && activityList.length > 0) {
        actText = `realizou ${activityList.join(', ').toLowerCase()}`;
      } else if (typeof activityList === 'string' && activityList) {
        actText = `realizou ${activityList.toLowerCase()}`;
      }

      let resText = 'e demonstrou boa compreensão.';
      if (resultId === 'em_pratica') {
        resText = 'e está desenvolvendo o conteúdo com prática.';
      } else if (resultId === 'revisar') {
        resText = 'com anotação para retomar o conteúdo.';
      }

      return `${actText.charAt(0).toUpperCase() + actText.slice(1)} de "${cleanTitle}" ${cleanSubject} ${resText}`.replace(/\s+/g, ' ').trim();
    },

    /**
     * Renderiza a Linha do Tempo em nós cronológicos elegantes (como no mockup)
     */
    renderTimelineHTML: function(records) {
      if (!records || records.length === 0) {
        return `
          <div class="acta-card p-10 text-center text-[#667267] bg-white border border-[#E8E2D5]">
            <i class="fa-regular fa-calendar-check text-3xl text-[#8E9A8F] mb-3"></i>
            <h4 class="font-bold text-sm text-[#28302A]">Nenhum registro ainda</h4>
            <p class="text-xs text-[#667267] mt-1 max-w-sm mx-auto">
              Quando você registrar as atividades do dia a dia, a história da aprendizagem aparecerá aqui organizada.
            </p>
          </div>
        `;
      }

      let html = '<div class="space-y-4">';

      records.forEach(rec => {
        let badgeClass = 'status-pill-compreendeu';
        let badgeLabel = 'Compreendeu';

        if (rec.result === 'em_pratica') {
          badgeClass = 'status-pill-desenvolvendo';
          badgeLabel = 'Está desenvolvendo';
        } else if (rec.result === 'revisar') {
          badgeClass = 'status-pill-retomar';
          badgeLabel = 'Precisa retomar';
        }

        const dateDisplay = rec.formattedDate || (rec.date ? rec.date.split('-').reverse().slice(0, 2).join('/') : 'Recente');

        html += `
          <div class="acta-card p-4 sm:p-5 bg-white border border-[#E8E2D5] flex flex-col sm:flex-row gap-4 items-start justify-between hover:border-[#2F5233]/40 transition">
            <div class="flex items-start gap-3.5 flex-1 min-w-0">
              <!-- Ícone de Data Estilo Carimbo -->
              <div class="w-12 h-12 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] flex flex-col items-center justify-center shrink-0 text-[#28302A]">
                <span class="text-[10px] font-bold uppercase tracking-wider text-[#667267]">${dateDisplay.split(' ')[0]}</span>
                <span class="text-xs font-bold leading-none">${dateDisplay.split(' ')[1] || 'SET'}</span>
              </div>

              <div class="space-y-1 flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="text-xs font-bold text-[#28302A]">${rec.subject || 'Atividade'}</span>
                  <span class="text-xs text-[#8E9A8F]">•</span>
                  <span class="text-xs font-semibold text-[#28302A] truncate">${rec.contentTitle}</span>
                  <span class="text-[10px] font-medium px-2 py-0.5 rounded-full ${badgeClass}">
                    ${badgeLabel}
                  </span>
                </div>

                <p class="text-xs text-[#667267] leading-relaxed">
                  ${rec.autoSummary || rec.notes || 'Atividade concluída com sucesso.'}
                </p>

                ${rec.notes && rec.notes !== rec.autoSummary ? `
                  <p class="text-[11px] text-[#8E9A8F] italic pl-2 border-l-2 border-[#2F5233]/30 mt-1">
                    "${rec.notes}"
                  </p>
                ` : ''}
              </div>
            </div>

            <!-- Miniatura de Foto de Evidência (se houver) -->
            ${rec.evidenceImg ? `
              <div 
                onclick="ActaApp.previewImage('${rec.evidenceImg}')"
                class="w-20 h-20 rounded-xl overflow-hidden border border-[#E8E2D5] bg-[#FAF7F0] shrink-0 cursor-pointer hover:opacity-90 transition shadow-sm"
                title="Toque para ampliar foto de evidência"
              >
                <img src="${rec.evidenceImg}" alt="Evidência" class="w-full h-full object-cover">
              </div>
            ` : ''}
          </div>
        `;
      });

      html += '</div>';
      return html;
    }
  };

  window.ActaRecords = ActaRecords;
})(window);
