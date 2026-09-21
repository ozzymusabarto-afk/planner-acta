/**
 * PLANNER ACTA — Gerador do "Dossiê de Acompanhamento"
 * Formatação elegante e acolhedora do histórico pedagógico da criança para tela e PDF.
 */

(function(window) {
  'use strict';

  const ActaReports = {
    generateDossieHTML: function(filter = {}) {
      const storage = window.ActaStorage || (typeof ActaStorage !== 'undefined' ? ActaStorage : null);
      const data = storage ? storage.getData() : { records: [], people: [], materials: [] };
      let records = data.records || [];
      const people = data.people || [];
      const materials = data.materials || [];

      let targetPerson = null;
      if (filter.personId && filter.personId !== 'all') {
        records = records.filter(r => r.personId === filter.personId);
        targetPerson = people.find(p => p.id === filter.personId);
      } else {
        targetPerson = storage ? storage.getActivePerson() : people[0];
      }

      const personName = targetPerson ? targetPerson.name : 'João';
      const personInfo = targetPerson ? targetPerson.info : 'Explorador • 9 anos';

      // Agrupar conteúdos trabalhados por disciplina
      const subjectsMap = {};
      records.forEach(r => {
        const subj = r.subject || 'Geral';
        if (!subjectsMap[subj]) subjectsMap[subj] = new Set();
        if (r.contentTitle) subjectsMap[subj].add(r.contentTitle);
      });

      // Evidências fotográficas
      const evidenceRecords = records.filter(r => !!r.evidenceImg);

      return `
        <div id="printableDossieArea" class="dossie-paper max-w-3xl mx-auto p-8 sm:p-12 bg-white text-[#28302A] space-y-8 print:p-0 print:border-none print:shadow-none">
          
          <!-- Cabeçalho do Dossiê com Logo ACTA e Ramo Botânico -->
          <div class="flex items-start justify-between border-b border-[#E8E2D5] pb-6">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-[#EBF3ED] text-[#2F5233] flex items-center justify-center text-xl shrink-0">
                <i class="fa-solid fa-leaf"></i>
              </div>
              <div>
                <h1 class="font-editorial-serif text-2xl font-bold tracking-tight text-[#28302A]">ACTA</h1>
                <p class="text-xs text-[#667267] font-medium tracking-wide">Planeje. Registre. Acompanhe.</p>
              </div>
            </div>

            <div class="text-right">
              <span class="text-[11px] uppercase tracking-widest text-[#2F5233] font-bold bg-[#EBF3ED] px-3 py-1 rounded-full">
                Dossiê Pedagógico
              </span>
              <p class="text-xs text-[#8E9A8F] mt-1.5">Emissão: ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>

          <!-- Identificação da Criança e Período -->
          <div class="bg-[#FAF7F0] p-5 rounded-2xl border border-[#E8E2D5] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span class="text-[10px] uppercase font-bold tracking-wider text-[#667267] block">Histórico de Aprendizagem</span>
              <h2 class="font-editorial-title text-xl font-bold text-[#28302A] mt-0.5">${personName}</h2>
              <span class="text-xs text-[#667267]">${personInfo}</span>
            </div>

            <div class="sm:text-right">
              <span class="text-[10px] uppercase font-bold tracking-wider text-[#667267] block">Período de Acompanhamento</span>
              <span class="text-sm font-semibold text-[#28302A] block mt-0.5">${filter.periodLabel || 'Agosto — Setembro 2025'}</span>
              <span class="text-xs text-[#2F5233] font-medium">${records.length} atividades registradas</span>
            </div>
          </div>

          <!-- Seção: Conteúdos Trabalhados (Organizados por Disciplina) -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#28302A] flex items-center gap-2">
              <i class="fa-solid fa-book-bookmark text-[#2F5233]"></i> Conteúdos Trabalhados
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              ${Object.keys(subjectsMap).length > 0 ? Object.keys(subjectsMap).map(subj => {
                const items = Array.from(subjectsMap[subj]);
                return `
                  <div class="p-4 bg-[#FDFBF7] rounded-xl border border-[#E8E2D5] space-y-2">
                    <h4 class="text-xs font-bold text-[#28302A] border-b border-[#E8E2D5] pb-1.5">${subj}</h4>
                    <ul class="text-xs text-[#667267] space-y-1">
                      ${items.map(it => `<li class="flex items-start gap-1.5"><span class="text-[#2F5233]">•</span> <span>${it}</span></li>`).join('')}
                    </ul>
                  </div>
                `;
              }).join('') : `
                <div class="col-span-full p-4 text-center text-xs text-[#667267] italic">
                  Nenhum conteúdo específico registrado neste período.
                </div>
              `}
            </div>
          </div>

          <!-- Seção: Registros e Evidências Fotográficas -->
          ${evidenceRecords.length > 0 ? `
            <div class="space-y-3 print-avoid-break">
              <h3 class="text-xs font-bold uppercase tracking-wider text-[#28302A] flex items-center gap-2">
                <i class="fa-solid fa-camera text-[#2F5233]"></i> Registros e Evidências
              </h3>

              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                ${evidenceRecords.map(r => `
                  <div class="acta-card p-2 bg-white border border-[#E8E2D5] rounded-xl space-y-1.5">
                    <div class="h-28 rounded-lg overflow-hidden bg-[#FAF7F0] border border-[#E8E2D5]">
                      <img src="${r.evidenceImg}" alt="${r.contentTitle}" class="w-full h-full object-cover">
                    </div>
                    <p class="text-[11px] font-bold text-[#28302A] truncate">${r.contentTitle}</p>
                    <p class="text-[10px] text-[#667267]">${r.formattedDate || r.date} • ${r.subject}</p>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Frase Poética no Rodapé do Dossiê -->
          <div class="pt-6 border-t border-[#E8E2D5] text-center space-y-2 print-avoid-break">
            <p class="font-script text-xl sm:text-2xl text-[#667267]">
              “Cada registro é uma página da história de seu crescimento.”
            </p>
            <div class="text-[10px] text-[#8E9A8F] flex justify-between items-center pt-2">
              <span>PLANNER ACTA • Caderno Inteligente da Família</span>
              <span>Dossiê de Acompanhamento • Sem burocracia escolar</span>
            </div>
          </div>

        </div>
      `;
    }
  };

  window.ActaReports = ActaReports;
})(window);
