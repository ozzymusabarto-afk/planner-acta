/**
 * PLANNER ACTA — Gerador de Relatórios e Dossiês Pedagógicos da Família
 * 
 * Filosofia: "A pessoa registra o que aconteceu e o sistema organiza o resto."
 * Dossiê Resumido, Dossiê Completo e Relatório Rápido do Mês.
 * Sem burocracia escolar, sem BNCC compulsória, focado no desenvolvimento real da criança.
 */

(function(window) {
  'use strict';

  const ActaReports = {
    /**
     * Dossiê Resumido (Visão Sintética Executiva)
     */
    generateResumoDossieHTML: function(filter = {}) {
      const storage = window.ActaStorage || (typeof ActaStorage !== 'undefined' ? ActaStorage : null);
      if (!storage) return '<div class="p-8 text-center text-red-600">Erro: Armazenamento não disponível.</div>';

      const data = storage.getData();
      const people = data.people || [];
      const allRecords = data.records || [];
      const allExtras = storage.getExtras ? storage.getExtras() : (data.extras || []);
      const allEvaluations = storage.getEvaluations ? storage.getEvaluations() : (data.evaluations || []);
      const allMaterials = data.materials || [];

      let targetPerson = null;
      if (filter.personId && filter.personId !== 'all') {
        targetPerson = people.find(p => p.id === filter.personId);
      }
      if (!targetPerson) {
        targetPerson = storage.getActivePerson() || people[0];
      }

      const personId = targetPerson ? targetPerson.id : null;
      const personName = targetPerson ? targetPerson.name : 'Criança';
      const personInfo = targetPerson && targetPerson.info ? targetPerson.info.replace(/explorad(a|or)?\s*(•|-)?\s*/gi, '').trim() : '';

      // Filtrar registros, extras, leituras e filmes da criança
      let records = allRecords.filter(r => r.personId === personId);
      let extras = allExtras.filter(e => e.personId === personId);
      const allReadings = storage.getReadings ? storage.getReadings() : (data.readings || []);
      const allMovies = storage.getMovies ? storage.getMovies() : (data.movies || []);
      let readings = allReadings.filter(r => r.personId === personId && (r.status || 'concluido') === 'concluido');
      let movies = allMovies.filter(m => m.personId === personId);

      // Filtro de período opcional
      if (filter.startDate) {
        records = records.filter(r => r.date >= filter.startDate);
        extras = extras.filter(e => e.date >= filter.startDate);
        readings = readings.filter(r => (r.endDate || r.startDate) >= filter.startDate);
        movies = movies.filter(m => m.date >= filter.startDate);
      }
      if (filter.endDate) {
        records = records.filter(r => r.date <= filter.endDate);
        extras = extras.filter(e => e.date <= filter.endDate);
        readings = readings.filter(r => (r.endDate || r.startDate) <= filter.endDate);
        movies = movies.filter(m => m.date <= filter.endDate);
      }

      // Conteúdos por disciplina
      const subjectsMap = {};
      let totalTimeMinutes = 0;
      let autonoCount = 0;
      let interestCount = 0;
      let assistCount = 0;

      records.forEach(r => {
        const subj = r.subject || 'Formação Geral';
        if (!subjectsMap[subj]) subjectsMap[subj] = new Set();
        if (r.contentTitle) subjectsMap[subj].add(r.contentTitle);

        if (r.duration) totalTimeMinutes += parseInt(r.duration, 10) || 0;
        const tags = Array.isArray(r.tags) ? r.tags : [];
        if (tags.includes('sozinho') || tags.includes('avancou')) autonoCount++;
        if (tags.includes('interesse')) interestCount++;
        if (tags.includes('ajuda') || tags.includes('dificuldade')) assistCount++;
      });

      // Avaliação diagnóstica mais recente
      const childEvals = allEvaluations.filter(ev => ev.personId === personId).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      const latestEval = childEvals.length > 0 ? childEvals[0] : null;

      // Evidências
      const evidenceRecords = records.filter(r => !!r.evidenceImg);

      // Citação clássica
      const quote = window.ActaQuotes ? window.ActaQuotes.getRandomQuote() : {
        text: "A educação consiste em dar ao corpo e à alma toda a beleza e toda a perfeição de que são capazes.",
        author: "Platão",
        work: "As Leis"
      };

      const periodLabel = filter.periodLabel || 'Período Completo de Registro';

      return `
        <div id="printableDossieArea" class="dossie-paper planner-dossie-sheet max-w-4xl mx-auto p-8 sm:p-12 bg-white text-[#28302A] space-y-8 print:p-0 print:border-none print:shadow-none font-sans">
          
          <!-- Cabeçalho Oficial do Dossiê -->
          <div class="flex items-start justify-between border-b border-[#E8E2D5] pb-6">
            <div class="flex items-center gap-4">
              <span class="theme-title-badge w-14 h-14 shrink-0 shadow-xs rounded-xl flex items-center justify-center text-xl bg-[#FAF7F0] border border-[#E8E2D5]">
                🌿
              </span>
              <div>
                <h1 class="font-editorial-serif text-3xl font-bold tracking-tight text-[#28302A]">PLANNER ACTA</h1>
                <p class="text-xs text-[#667267] font-medium tracking-wide">Planeje. Registre. Acompanhe. • Documento Pedagógico da Família</p>
                <div class="planner-title-vignette mt-1.5" style="max-width: 220px; height: 18px;"></div>
              </div>
            </div>

            <div class="text-right">
              <span class="text-xs uppercase tracking-widest text-[#2F5233] font-bold bg-[#FAF7F0] border border-[#E8E2D5] px-4 py-1.5 rounded-full inline-block shadow-xs">
                Dossiê Resumido
              </span>
              <p class="text-[11px] text-[#8E9A8F] mt-1.5 font-medium">Emissão: ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>

          <!-- Identificação da Criança -->
          <div class="planner-card bg-[#FAF7F0] p-6 rounded-2xl border border-[#E8E2D5] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span class="text-[10px] uppercase font-bold tracking-wider text-[#667267] block">Estudante Acompanhado</span>
              <h2 class="font-editorial-title text-2xl font-bold text-[#28302A] mt-0.5">${personName}</h2>
              <span class="text-xs text-[#667267] font-medium">${personInfo || 'Educação Domiciliar / Acompanhamento Familiar'}</span>
            </div>

            <div class="sm:text-right border-t sm:border-t-0 sm:border-l border-[#E8E2D5] pt-3 sm:pt-0 sm:pl-6">
              <span class="text-[10px] uppercase font-bold tracking-wider text-[#667267] block">Período de Acompanhamento</span>
              <span class="text-sm font-bold text-[#28302A] block mt-0.5">${periodLabel}</span>
              <span class="text-xs text-[#2F5233] font-medium">${records.length} estudos registrados • ${extras.length} experiências práticas</span>
            </div>
          </div>

          <!-- Seção 1: Ponto de Partida (Diagnóstico Inicial) -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#28302A] flex items-center gap-2 border-b border-[#E8E2D5] pb-2">
              <span class="planner-bullet"></span>
              <span>1. Ponto de Partida & Diagnóstico Pedagógico</span>
            </h3>

            ${latestEval ? `
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="p-4 bg-[#FDFBF7] rounded-xl border border-[#E8E2D5] space-y-2">
                  <h4 class="text-xs font-bold text-[#2F5233] flex items-center justify-between">
                    <span>Pontos Fortes & Consolidados</span>
                    <span class="text-[10px] font-normal text-[#667267]">Ref: ${latestEval.date ? new Date(latestEval.date + 'T12:00:00').toLocaleDateString('pt-BR') : 'Recente'}</span>
                  </h4>
                  <p class="text-xs text-[#28302A] leading-relaxed">
                    ${latestEval.summaryStrengths || 'Demonstra excelente prontidão, interesse vivo e boa capacidade de atenção.'}
                  </p>
                </div>
                <div class="p-4 bg-[#FDFBF7] rounded-xl border border-[#E8E2D5] space-y-2">
                  <h4 class="text-xs font-bold text-[#A44A3F] flex items-center justify-between">
                    <span>Atenção & Conteúdos a Retomar</span>
                    <span class="text-[10px] font-normal text-[#667267]">Foco do período</span>
                  </h4>
                  <p class="text-xs text-[#28302A] leading-relaxed">
                    ${latestEval.summaryRetomar || latestEval.summaryFocus || 'Consolidação de rotina e fixação diária dos conceitos apresentados.'}
                  </p>
                </div>
              </div>
            ` : `
              <div class="p-4 bg-[#FDFBF7] rounded-xl border border-[#E8E2D5] text-xs text-[#667267] italic">
                Nenhuma avaliação formal arquivada no período. O acompanhamento se fundamenta nos registros diários de ritmo e assimilação.
              </div>
            `}
          </div>

          <!-- Seção 2: Caminho Percorrido (Conteúdos por Disciplina) -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#28302A] flex items-center gap-2 border-b border-[#E8E2D5] pb-2">
              <span class="planner-bullet"></span>
              <span>2. Caminho Percorrido (Conteúdos Trabalhados)</span>
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              ${Object.keys(subjectsMap).length > 0 ? Object.keys(subjectsMap).map(subj => {
                const items = Array.from(subjectsMap[subj]);
                return `
                  <div class="planner-card p-4 bg-[#FDFBF7] rounded-xl border border-[#E8E2D5] space-y-2">
                    <h4 class="text-xs font-bold text-[#28302A] border-b border-[#E8E2D5] pb-1.5 flex items-center justify-between">
                      <span>${subj}</span>
                      <span class="text-[10px] text-[#2F5233] font-semibold">${items.length} tópicos</span>
                    </h4>
                    <ul class="text-xs text-[#667267] space-y-1.5 pt-1">
                      ${items.map(it => `
                        <li class="flex items-start gap-2">
                          <span class="planner-bullet mt-1 text-[#2F5233] shrink-0"></span>
                          <span class="text-[#28302A]">${it}</span>
                        </li>
                      `).join('')}
                    </ul>
                  </div>
                `;
              }).join('') : `
                <div class="col-span-full p-4 text-center text-xs text-[#667267] italic">
                  Nenhum conteúdo formal categorizado neste período.
                </div>
              `}
            </div>
          </div>

          <!-- Seção 3: Experiências Práticas e Passeios -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#28302A] flex items-center gap-2 border-b border-[#E8E2D5] pb-2">
              <span class="planner-bullet"></span>
              <span>3. Vivências, Práticas e Passeios Culturais</span>
            </h3>

            ${extras.length > 0 ? `
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${extras.map(e => `
                  <div class="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8E2D5] flex items-start gap-3">
                    <span class="text-xl p-2 bg-white rounded-lg border border-[#E8E2D5]">
                      ${e.type === 'passeio' ? '🏛️' : e.type === 'experimento' ? '🔬' : e.type === 'culinaria' ? '🍳' : '🪵'}
                    </span>
                    <div class="space-y-0.5">
                      <h4 class="text-xs font-bold text-[#28302A]">${e.title}</h4>
                      <p class="text-[10px] text-[#667267]">${e.date ? new Date(e.date + 'T12:00:00').toLocaleDateString('pt-BR') : ''} • ${e.location || 'Em Família'}</p>
                      ${e.description ? `<p class="text-xs text-[#445045] pt-1">${e.description}</p>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="p-4 bg-[#FDFBF7] rounded-xl border border-[#E8E2D5] text-xs text-[#667267] italic">
                Nenhum passeio ou atividade prática externa arquivada no período.
              </div>
            `}
          </div>

          <!-- Seção: Formação Cultural (Leituras & Cinema) -->
          ${(filter.includeReadings !== false || filter.includeMovies !== false) ? `
            <div class="space-y-3">
              <h3 class="text-xs font-bold uppercase tracking-wider text-[#28302A] flex items-center gap-2 border-b border-[#E8E2D5] pb-2">
                <span class="planner-bullet"></span>
                <span>Formação Cultural, Leituras & Cinema</span>
              </h3>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <!-- Leituras -->
                ${filter.includeReadings !== false ? `
                  <div class="p-4 bg-[#FAF7F0] rounded-xl border border-[#E8E2D5] space-y-2">
                    <div class="flex items-center justify-between border-b border-[#E8E2D5] pb-1.5">
                      <h4 class="text-xs font-bold text-[#28302A] flex items-center gap-2">
                        <span>📚</span> <span>Leituras & Literatura</span>
                      </h4>
                      <span class="text-[10px] text-[#2F5233] font-bold">${readings.length} obras</span>
                    </div>
                    ${readings.length > 0 ? `
                      <ul class="text-xs text-[#445045] space-y-1.5">
                        ${readings.map(r => `
                          <li class="flex items-start justify-between gap-2 border-b border-[#E8E2D5]/40 pb-1">
                            <div>
                              <strong class="text-[#28302A]">${r.title}</strong>
                              <span class="text-[10px] text-[#667267] block">${r.author || ''} ${r.category ? `• ${r.category}` : ''}</span>
                            </div>
                            ${r.virtues && r.virtues.length > 0 ? `
                              <span class="text-[9px] bg-white border border-[#E8E2D5] px-1.5 py-0.5 rounded text-[#2F5233] font-medium shrink-0">
                                ${r.virtues[0]}
                              </span>
                            ` : ''}
                          </li>
                        `).join('')}
                      </ul>
                    ` : `
                      <p class="text-xs text-[#667267] italic">Nenhuma leitura concluída no período.</p>
                    `}
                  </div>
                ` : ''}

                <!-- Cinema e Cultura -->
                ${filter.includeMovies !== false ? `
                  <div class="p-4 bg-[#FAF7F0] rounded-xl border border-[#E8E2D5] space-y-2">
                    <div class="flex items-center justify-between border-b border-[#E8E2D5] pb-1.5">
                      <h4 class="text-xs font-bold text-[#28302A] flex items-center gap-2">
                        <span>🎬</span> <span>Filmes & Cultura</span>
                      </h4>
                      <span class="text-[10px] text-[#3D6B78] font-bold">${movies.length} sessões</span>
                    </div>
                    ${movies.length > 0 ? `
                      <ul class="text-xs text-[#445045] space-y-1.5">
                        ${movies.map(m => `
                          <li class="flex items-start justify-between gap-2 border-b border-[#E8E2D5]/40 pb-1">
                            <div>
                              <strong class="text-[#28302A]">${m.title}</strong>
                              <span class="text-[10px] text-[#667267] block">${m.year ? `(${m.year})` : ''} ${m.category ? `• ${m.category}` : ''}</span>
                            </div>
                            ${m.virtues && m.virtues.length > 0 ? `
                              <span class="text-[9px] bg-white border border-[#E8E2D5] px-1.5 py-0.5 rounded text-[#3D6B78] font-medium shrink-0">
                                ${m.virtues[0]}
                              </span>
                            ` : ''}
                          </li>
                        `).join('')}
                      </ul>
                    ` : `
                      <p class="text-xs text-[#667267] italic">Nenhum filme registrado no período.</p>
                    `}
                  </div>
                ` : ''}
              </div>
            </div>
          ` : ''}

          <!-- Seção 4: Acompanhamento de Ritmo e Autonomia -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#28302A] flex items-center gap-2 border-b border-[#E8E2D5] pb-2">
              <span class="planner-bullet"></span>
              <span>4. Postura, Autonomia e Hábito de Estudo</span>
            </h3>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div class="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8E2D5]">
                <span class="block text-2xl font-bold font-editorial-serif text-[#28302A]">${records.length}</span>
                <span class="text-[10px] uppercase font-bold text-[#667267]">Sessões de Estudo</span>
              </div>
              <div class="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8E2D5]">
                <span class="block text-2xl font-bold font-editorial-serif text-[#2F5233]">${autonoCount}</span>
                <span class="text-[10px] uppercase font-bold text-[#667267]">Com Autonomia</span>
              </div>
              <div class="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8E2D5]">
                <span class="block text-2xl font-bold font-editorial-serif text-[#3D6B78]">${interestCount}</span>
                <span class="text-[10px] uppercase font-bold text-[#667267]">Alto Engajamento</span>
              </div>
              <div class="p-3 bg-[#FAF7F0] rounded-xl border border-[#E8E2D5]">
                <span class="block text-2xl font-bold font-editorial-serif text-[#8E9A8F]">
                  ${totalTimeMinutes > 0 ? `${Math.round(totalTimeMinutes / 60)}h` : `${records.length * 30}m`}
                </span>
                <span class="text-[10px] uppercase font-bold text-[#667267]">Dedicação Total</span>
              </div>
            </div>
          </div>

          <!-- Seção 5: Galeria de Evidências Fotográficas -->
          ${evidenceRecords.length > 0 ? `
            <div class="space-y-3 print-avoid-break">
              <h3 class="text-xs font-bold uppercase tracking-wider text-[#28302A] flex items-center gap-2 border-b border-[#E8E2D5] pb-2">
                <span class="planner-bullet"></span>
                <span>5. Registros Visuais & Caderno do Estudante</span>
              </h3>

              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                ${evidenceRecords.slice(0, 6).map(r => `
                  <div class="planner-card p-2 bg-white border border-[#E8E2D5] rounded-xl space-y-1.5 shadow-xs">
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

          <!-- Citação Clássica e Fechamento -->
          <div class="pt-6 border-t border-[#E8E2D5] text-center space-y-3 print-avoid-break">
            <p class="font-editorial-title italic text-base sm:text-lg text-[#28302A] max-w-xl mx-auto">
              “${quote.text}”
            </p>
            <p class="text-xs text-[#2F5233] font-bold">
              — ${quote.author}, <span class="italic font-normal">${quote.work}</span>
            </p>

            <div class="pt-8 flex justify-between items-end text-left text-xs text-[#667267]">
              <div>
                <p class="font-bold text-[#28302A]">PLANNER ACTA • Caderno da Família</p>
                <p class="text-[10px] text-[#8E9A8F]">Documentação viva da educação no lar.</p>
              </div>
              <div class="text-right border-t border-[#28302A] pt-1.5 px-6">
                <p class="text-[10px] uppercase tracking-wider font-bold text-[#28302A]">Responsável Educador</p>
              </div>
            </div>
          </div>

        </div>
      `;
    },

    /**
     * Dossiê Completo (Histórico Detalhado, Avaliação Completa e Narrativas)
     */
    generateCompletoDossieHTML: function(filter = {}) {
      const storage = window.ActaStorage || (typeof ActaStorage !== 'undefined' ? ActaStorage : null);
      if (!storage) return '<div class="p-8 text-center text-red-600">Erro: Armazenamento não disponível.</div>';

      const data = storage.getData();
      const people = data.people || [];
      const allRecords = data.records || [];
      const allExtras = storage.getExtras ? storage.getExtras() : (data.extras || []);
      const allEvaluations = storage.getEvaluations ? storage.getEvaluations() : (data.evaluations || []);

      let targetPerson = null;
      if (filter.personId && filter.personId !== 'all') {
        targetPerson = people.find(p => p.id === filter.personId);
      }
      if (!targetPerson) {
        targetPerson = storage.getActivePerson() || people[0];
      }

      const personId = targetPerson ? targetPerson.id : null;
      const personName = targetPerson ? targetPerson.name : 'Criança';
      const personInfo = targetPerson && targetPerson.info ? targetPerson.info.replace(/explorad(a|or)?\s*(•|-)?\s*/gi, '').trim() : '';

      let records = allRecords.filter(r => r.personId === personId);
      let extras = allExtras.filter(e => e.personId === personId);
      const allReadings = storage.getReadings ? storage.getReadings() : (data.readings || []);
      const allMovies = storage.getMovies ? storage.getMovies() : (data.movies || []);
      let readings = allReadings.filter(r => r.personId === personId && (r.status || 'concluido') === 'concluido');
      let movies = allMovies.filter(m => m.personId === personId);

      // Filtro de período opcional
      if (filter.startDate) {
        records = records.filter(r => r.date >= filter.startDate);
        extras = extras.filter(e => e.date >= filter.startDate);
        readings = readings.filter(r => (r.endDate || r.startDate) >= filter.startDate);
        movies = movies.filter(m => m.date >= filter.startDate);
      }
      if (filter.endDate) {
        records = records.filter(r => r.date <= filter.endDate);
        extras = extras.filter(e => e.date <= filter.endDate);
        readings = readings.filter(r => (r.endDate || r.startDate) <= filter.endDate);
        movies = movies.filter(m => m.date <= filter.endDate);
      }

      // Ordenar cronologicamente
      records.sort((a, b) => (a.date || '').localeCompare(b.date || ''));

      // Avaliação diagnóstica
      const childEvals = allEvaluations.filter(ev => ev.personId === personId).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      const latestEval = childEvals.length > 0 ? childEvals[0] : null;

      // Citação
      const quote = window.ActaQuotes ? window.ActaQuotes.getRandomQuote() : {
        text: "Não aprendemos para a escola, mas para a vida.",
        author: "Sêneca",
        work: "Epístolas a Lucílio"
      };

      return `
        <div id="printableDossieArea" class="dossie-paper planner-dossie-sheet max-w-4xl mx-auto p-8 sm:p-12 bg-white text-[#28302A] space-y-10 print:p-0 print:border-none print:shadow-none font-sans">
          
          <!-- Capa do Dossiê Completo -->
          <div class="border-b-2 border-[#28302A] pb-8 flex items-start justify-between">
            <div class="space-y-2">
              <span class="text-xs uppercase tracking-widest text-[#2F5233] font-bold bg-[#FAF7F0] border border-[#E8E2D5] px-3.5 py-1 rounded-full inline-block">
                Dossiê Pedagógico Completo
              </span>
              <h1 class="font-editorial-serif text-4xl font-bold tracking-tight text-[#28302A] pt-1">PLANNER ACTA</h1>
              <p class="text-sm text-[#667267] font-medium">Relatório Integral de Aprendizagem, Leituras e Vivências</p>
            </div>
            <div class="text-right">
              <h2 class="font-editorial-title text-2xl font-bold text-[#28302A]">${personName}</h2>
              <p class="text-xs text-[#667267]">${personInfo || 'Educação Familiar'}</p>
              <p class="text-[11px] text-[#8E9A8F] mt-2">Emissão: ${new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>

          <!-- Diagnóstico Qualitativo Completo -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-[#28302A] border-b border-[#E8E2D5] pb-2 flex items-center justify-between">
              <span>1. Diagnóstico Qualitativo das Competências</span>
              <span class="text-xs text-[#2F5233] font-normal">Base Clássica: Domínio Real sem Provas Burocráticas</span>
            </h3>

            ${latestEval ? `
              <div class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="p-4 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl space-y-2">
                    <h4 class="text-xs font-bold text-[#28302A] uppercase tracking-wider">Linguagem & Expressão (Português)</h4>
                    <div class="space-y-1.5 text-xs">
                      ${latestEval.portugues ? Object.entries(latestEval.portugues).map(([key, val]) => `
                        <div class="flex justify-between items-center py-0.5 border-b border-[#E8E2D5]/50">
                          <span class="capitalize text-[#445045]">${key}</span>
                          <span class="font-semibold ${val === 'Consolidado' ? 'text-[#2F5233]' : val === 'Em desenvolvimento' ? 'text-[#3D6B78]' : 'text-[#A44A3F]'}">${val}</span>
                        </div>
                      `).join('') : '<p class="text-[#667267] italic">Sem notas detalhadas.</p>'}
                    </div>
                  </div>

                  <div class="p-4 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl space-y-2">
                    <h4 class="text-xs font-bold text-[#28302A] uppercase tracking-wider">Raciocínio & Cálculo (Matemática)</h4>
                    <div class="space-y-1.5 text-xs">
                      ${latestEval.matematica ? Object.entries(latestEval.matematica).map(([key, val]) => `
                        <div class="flex justify-between items-center py-0.5 border-b border-[#E8E2D5]/50">
                          <span class="capitalize text-[#445045]">${key}</span>
                          <span class="font-semibold ${val === 'Consolidado' ? 'text-[#2F5233]' : val === 'Em desenvolvimento' ? 'text-[#3D6B78]' : 'text-[#A44A3F]'}">${val}</span>
                        </div>
                      `).join('') : '<p class="text-[#667267] italic">Sem notas detalhadas.</p>'}
                    </div>
                  </div>
                </div>

                <div class="p-4 bg-[#FDFBF7] border border-[#E8E2D5] rounded-xl space-y-2 text-xs">
                  <p><strong class="text-[#2F5233]">Pontos Fortes:</strong> ${latestEval.summaryStrengths || 'Capacidade atenta de retenção e entusiasmo.'}</p>
                  <p><strong class="text-[#A44A3F]">Conteúdos a Retomar:</strong> ${latestEval.summaryRetomar || 'Fixação contínua de exercícios práticos.'}</p>
                  ${latestEval.summaryNotes ? `<p><strong class="text-[#28302A]">Observações do Educador:</strong> ${latestEval.summaryNotes}</p>` : ''}
                </div>
              </div>
            ` : `
              <div class="p-4 bg-[#FDFBF7] border border-[#E8E2D5] rounded-xl text-xs text-[#667267] italic">
                Nenhum formulário de avaliação diagnóstica arquivado ainda.
              </div>
            `}
          </div>

          <!-- Histórico Detalhado dos Registros com Narrativas -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-[#28302A] border-b border-[#E8E2D5] pb-2 flex items-center justify-between">
              <span>2. Diário Narrativo das Aulas & Estudos</span>
              <span class="text-xs text-[#2F5233] font-normal">${records.length} sessões registradas</span>
            </h3>

            ${records.length > 0 ? `
              <div class="space-y-3">
                ${records.map(r => `
                  <div class="p-4 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl space-y-2 text-xs">
                    <div class="flex justify-between items-start">
                      <div>
                        <span class="text-[10px] uppercase font-bold text-[#2F5233] bg-white px-2 py-0.5 rounded border border-[#E8E2D5]">${r.subject || 'Estudo'}</span>
                        <h4 class="text-sm font-bold text-[#28302A] mt-1">${r.contentTitle || 'Conteúdo do Dia'}</h4>
                        <p class="text-[11px] text-[#667267]">${r.formattedDate || r.date} ${r.duration ? `• Duração: ${r.duration} min` : ''}</p>
                      </div>
                      ${r.evidenceImg ? `
                        <div class="w-16 h-16 rounded-lg overflow-hidden border border-[#E8E2D5] shrink-0">
                          <img src="${r.evidenceImg}" class="w-full h-full object-cover" alt="Evidência">
                        </div>
                      ` : ''}
                    </div>

                    ${r.narrativeText ? `
                      <p class="text-[#28302A] italic bg-white p-2.5 rounded-lg border border-[#E8E2D5]/70 leading-relaxed">
                        “${r.narrativeText}”
                      </p>
                    ` : (r.notes ? `
                      <p class="text-[#28302A] leading-relaxed">${r.notes}</p>
                    ` : '')}

                    ${Array.isArray(r.tags) && r.tags.length > 0 ? `
                      <div class="flex flex-wrap gap-1.5 pt-1">
                        ${r.tags.map(t => `<span class="px-2 py-0.5 rounded-full text-[10px] bg-white border border-[#E8E2D5] text-[#445045]">#${t}</span>`).join('')}
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="p-4 bg-[#FDFBF7] border border-[#E8E2D5] rounded-xl text-xs text-[#667267] italic">
                Nenhuma aula registrada ainda.
              </div>
            `}
          </div>

          <!-- Passeios e Práticas -->
          <div class="space-y-4">
            <h3 class="text-sm font-bold uppercase tracking-wider text-[#28302A] border-b border-[#E8E2D5] pb-2 flex items-center justify-between">
              <span>3. Passeios Culturais & Atividades Práticas</span>
              <span class="text-xs text-[#2F5233] font-normal">${extras.length} vivências</span>
            </h3>

            ${extras.length > 0 ? `
              <div class="space-y-3">
                ${extras.map(e => `
                  <div class="p-3 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl flex items-start gap-3 text-xs">
                    <span class="text-2xl p-2 bg-white rounded-lg border border-[#E8E2D5]">
                      ${e.type === 'passeio' ? '🏛️' : e.type === 'experimento' ? '🔬' : e.type === 'culinaria' ? '🍳' : '🪵'}
                    </span>
                    <div class="space-y-1">
                      <div class="flex items-center gap-2">
                        <span class="font-bold text-[#28302A] text-sm">${e.title}</span>
                        <span class="text-[10px] text-[#667267]">${e.date ? new Date(e.date + 'T12:00:00').toLocaleDateString('pt-BR') : ''}</span>
                      </div>
                      <p class="text-[#445045]">${e.description || 'Vivência em família com registro de observação e aprendizado vivo.'}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div class="p-4 bg-[#FDFBF7] border border-[#E8E2D5] rounded-xl text-xs text-[#667267] italic">
                Nenhum passeio arquivado no período.
              </div>
            `}
          </div>

          <!-- Leituras e Literatura (Dossiê Completo) -->
          ${filter.includeReadings !== false ? `
            <div class="space-y-4">
              <h3 class="text-sm font-bold uppercase tracking-wider text-[#28302A] border-b border-[#E8E2D5] pb-2 flex items-center justify-between">
                <span>4. Formação Literária (Leituras & Clássicos)</span>
                <span class="text-xs text-[#2F5233] font-normal">${readings.length} obras concluídas</span>
              </h3>

              ${readings.length > 0 ? `
                <div class="space-y-3">
                  ${readings.map(r => `
                    <div class="p-4 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl space-y-2 text-xs">
                      <div class="flex justify-between items-start">
                        <div>
                          <span class="text-[10px] uppercase font-bold text-[#2F5233] bg-white px-2 py-0.5 rounded border border-[#E8E2D5]">${r.category || 'Literatura'}</span>
                          <h4 class="text-sm font-bold text-[#28302A] mt-1">${r.title}</h4>
                          <p class="text-[11px] text-[#667267]">${r.author ? `Autor(a): ${r.author}` : ''} ${r.pages ? `• ${r.pages} páginas` : ''} ${r.endDate ? `• Concluído em: ${new Date(r.endDate + 'T12:00:00').toLocaleDateString('pt-BR')}` : ''}</p>
                        </div>
                        <div class="text-right">
                          <span class="text-xs text-amber-500 font-bold">${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}</span>
                        </div>
                      </div>

                      ${r.virtues && r.virtues.length > 0 ? `
                        <div class="flex items-center gap-1.5 flex-wrap pt-0.5">
                          <span class="text-[10px] text-[#667267] font-semibold">Virtudes observadas:</span>
                          ${r.virtues.map(v => `<span class="px-2 py-0.5 rounded-full text-[10px] bg-white border border-[#E8E2D5] text-[#2F5233] font-medium">✨ ${v}</span>`).join('')}
                        </div>
                      ` : ''}

                      ${r.reflection ? `
                        <div class="bg-white p-3 rounded-lg border border-[#E8E2D5]/70 space-y-1">
                          <span class="text-[10px] uppercase font-bold text-[#667267]">Reflexões & Conversas:</span>
                          <p class="text-[#28302A] italic leading-relaxed">“${r.reflection}”</p>
                        </div>
                      ` : ''}

                      ${r.childImpressions ? `
                        <p class="text-[#445045] pt-0.5"><strong class="text-[#28302A]">Impressões da Criança:</strong> ${r.childImpressions}</p>
                      ` : ''}
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div class="p-4 bg-[#FDFBF7] border border-[#E8E2D5] rounded-xl text-xs text-[#667267] italic">
                  Nenhuma obra literária arquivada no período.
                </div>
              `}
            </div>
          ` : ''}

          <!-- Filmes e Cinema (Dossiê Completo) -->
          ${filter.includeMovies !== false ? `
            <div class="space-y-4">
              <h3 class="text-sm font-bold uppercase tracking-wider text-[#28302A] border-b border-[#E8E2D5] pb-2 flex items-center justify-between">
                <span>5. Formação Cinematográfica & Vivência Cultural</span>
                <span class="text-xs text-[#3D6B78] font-normal">${movies.length} sessões</span>
              </h3>

              ${movies.length > 0 ? `
                <div class="space-y-3">
                  ${movies.map(m => `
                    <div class="p-4 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl space-y-2 text-xs">
                      <div class="flex justify-between items-start">
                        <div>
                          <span class="text-[10px] uppercase font-bold text-[#3D6B78] bg-white px-2 py-0.5 rounded border border-[#E8E2D5]">${m.category || 'Cinema'}</span>
                          <h4 class="text-sm font-bold text-[#28302A] mt-1">${m.title}</h4>
                          <p class="text-[11px] text-[#667267]">${m.director ? `Direção: ${m.director}` : ''} ${m.year ? `(${m.year})` : ''} ${m.date ? `• Assistido em: ${new Date(m.date + 'T12:00:00').toLocaleDateString('pt-BR')}` : ''}</p>
                        </div>
                        <div class="text-right">
                          <span class="text-xs text-amber-500 font-bold">${'★'.repeat(m.rating || 5)}${'☆'.repeat(5 - (m.rating || 5))}</span>
                        </div>
                      </div>

                      ${m.virtues && m.virtues.length > 0 ? `
                        <div class="flex items-center gap-1.5 flex-wrap pt-0.5">
                          <span class="text-[10px] text-[#667267] font-semibold">Valores & Virtudes:</span>
                          ${m.virtues.map(v => `<span class="px-2 py-0.5 rounded-full text-[10px] bg-white border border-[#E8E2D5] text-[#3D6B78] font-medium">✨ ${v}</span>`).join('')}
                        </div>
                      ` : ''}

                      ${m.reflection ? `
                        <div class="bg-white p-3 rounded-lg border border-[#E8E2D5]/70 space-y-1">
                          <span class="text-[10px] uppercase font-bold text-[#667267]">Reflexão em Família:</span>
                          <p class="text-[#28302A] italic leading-relaxed">“${m.reflection}”</p>
                        </div>
                      ` : ''}

                      ${m.childImpressions ? `
                        <p class="text-[#445045] pt-0.5"><strong class="text-[#28302A]">Impressões da Criança:</strong> ${m.childImpressions}</p>
                      ` : ''}
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div class="p-4 bg-[#FDFBF7] border border-[#E8E2D5] rounded-xl text-xs text-[#667267] italic">
                  Nenhum filme arquivado no período.
                </div>
              `}
            </div>
          ` : ''}

          <!-- Rodapé com Citação e Assinatura -->
          <div class="pt-8 border-t border-[#E8E2D5] text-center space-y-3 print-avoid-break">
            <p class="font-editorial-title italic text-lg text-[#28302A] max-w-xl mx-auto">
              “${quote.text}”
            </p>
            <p class="text-xs text-[#2F5233] font-bold">
              — ${quote.author}, <span class="italic font-normal">${quote.work}</span>
            </p>

            <div class="pt-10 flex justify-between items-end text-left text-xs text-[#667267]">
              <div>
                <p class="font-bold text-[#28302A]">PLANNER ACTA • Caderno da Família</p>
                <p class="text-[10px] text-[#8E9A8F]">Registro documental seguro e sem intermediários.</p>
              </div>
              <div class="text-right border-t border-[#28302A] pt-2 px-8">
                <p class="text-[10px] uppercase tracking-wider font-bold text-[#28302A]">Assinatura dos Pais / Educadores</p>
              </div>
            </div>
          </div>

        </div>
      `;
    },

    /**
     * Relatório Rápido do Mês (1 página / síntese mensal)
     */
    generateQuickMonthReportHTML: function(childId, monthStr) {
      const storage = window.ActaStorage || (typeof ActaStorage !== 'undefined' ? ActaStorage : null);
      if (!storage) return '<div class="p-8 text-center text-red-600">Erro: Armazenamento não disponível.</div>';

      const data = storage.getData();
      const people = data.people || [];
      const allRecords = data.records || [];
      const allExtras = storage.getExtras ? storage.getExtras() : (data.extras || []);

      const targetPerson = people.find(p => p.id === childId) || storage.getActivePerson() || people[0];
      const personId = targetPerson ? targetPerson.id : null;
      const personName = targetPerson ? targetPerson.name : 'Criança';

      const currentMonth = monthStr || new Date().toISOString().substring(0, 7); // 'YYYY-MM'
      const [year, month] = currentMonth.split('-');
      const monthDate = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
      const monthName = monthDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

      // Filtrar registros e extras do mês
      const monthRecords = allRecords.filter(r => r.personId === personId && r.date && r.date.startsWith(currentMonth));
      const monthExtras = allExtras.filter(e => e.personId === personId && e.date && e.date.startsWith(currentMonth));

      // Disciplinas
      const subjMap = {};
      let autonoCount = 0;
      monthRecords.forEach(r => {
        const s = r.subject || 'Geral';
        if (!subjMap[s]) subjMap[s] = [];
        if (r.contentTitle) subjMap[s].push(r.contentTitle);
        const tags = Array.isArray(r.tags) ? r.tags : [];
        if (tags.includes('sozinho') || tags.includes('avancou')) autonoCount++;
      });

      const quote = window.ActaQuotes ? window.ActaQuotes.getRandomQuote() : {
        text: "Aula dada, aula estudada hoje!",
        author: "Prof. Pierluigi Piazzi",
        work: "Aprendendo Inteligência"
      };

      return `
        <div id="printableDossieArea" class="dossie-paper planner-dossie-sheet max-w-3xl mx-auto p-8 bg-white text-[#28302A] space-y-6 font-sans print:p-0 print:border-none print:shadow-none">
          <!-- Cabeçalho -->
          <div class="flex items-center justify-between border-b border-[#E8E2D5] pb-4">
            <div>
              <span class="text-[10px] uppercase font-bold tracking-widest text-[#2F5233] bg-[#FAF7F0] px-2.5 py-1 rounded border border-[#E8E2D5]">
                Síntese Mensal
              </span>
              <h2 class="font-editorial-title text-2xl font-bold text-[#28302A] mt-1">${personName}</h2>
              <p class="text-xs text-[#667267] capitalize">${monthName}</p>
            </div>
            <div class="text-right">
              <span class="font-editorial-serif text-xl font-bold text-[#28302A]">PLANNER ACTA</span>
              <p class="text-[10px] text-[#8E9A8F]">Caderno da Família</p>
            </div>
          </div>

          <!-- Métricas Chave do Mês -->
          <div class="grid grid-cols-3 gap-3 text-center">
            <div class="p-3 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl">
              <span class="text-2xl font-bold font-editorial-serif text-[#28302A] block">${monthRecords.length}</span>
              <span class="text-[10px] uppercase font-bold text-[#667267]">Aulas Realizadas</span>
            </div>
            <div class="p-3 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl">
              <span class="text-2xl font-bold font-editorial-serif text-[#2F5233] block">${autonoCount}</span>
              <span class="text-[10px] uppercase font-bold text-[#667267]">Com Autonomia</span>
            </div>
            <div class="p-3 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl">
              <span class="text-2xl font-bold font-editorial-serif text-[#3D6B78] block">${monthExtras.length}</span>
              <span class="text-[10px] uppercase font-bold text-[#667267]">Passeios & Práticas</span>
            </div>
          </div>

          <!-- Conteúdos do Mês -->
          <div class="space-y-3">
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#28302A] border-b border-[#E8E2D5] pb-1 flex items-center justify-between">
              <span>Conteúdos Abordados no Mês</span>
              <span class="text-[10px] text-[#667267]">${Object.keys(subjMap).length} áreas de estudo</span>
            </h3>

            ${Object.keys(subjMap).length > 0 ? `
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                ${Object.keys(subjMap).map(subj => `
                  <div class="p-3 bg-[#FDFBF7] border border-[#E8E2D5] rounded-xl space-y-1 text-xs">
                    <span class="font-bold text-[#2F5233] block">${subj}</span>
                    <p class="text-[#445045] leading-relaxed">${subjMap[subj].slice(0, 4).join(', ')}${subjMap[subj].length > 4 ? ` e mais ${subjMap[subj].length - 4}...` : ''}</p>
                  </div>
                `).join('')}
              </div>
            ` : `
              <p class="text-xs text-[#667267] italic p-3 bg-[#FDFBF7] rounded-xl border border-[#E8E2D5]">Nenhum conteúdo formal registrado em ${monthName}.</p>
            `}
          </div>

          <!-- Passeios e Vivências -->
          ${monthExtras.length > 0 ? `
            <div class="space-y-2">
              <h3 class="text-xs font-bold uppercase tracking-wider text-[#28302A] border-b border-[#E8E2D5] pb-1">
                Vivências Práticas & Passeios
              </h3>
              <div class="space-y-1.5 text-xs">
                ${monthExtras.map(e => `
                  <div class="flex items-center gap-2 p-2 bg-[#FAF7F0] border border-[#E8E2D5] rounded-lg">
                    <span>${e.type === 'passeio' ? '🏛️' : '🔬'}</span>
                    <strong class="text-[#28302A]">${e.title}</strong>
                    <span class="text-[#8E9A8F]">(${e.date ? new Date(e.date + 'T12:00:00').toLocaleDateString('pt-BR') : ''})</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Citação Clássica -->
          <div class="pt-4 border-t border-[#E8E2D5] text-center space-y-1">
            <p class="font-editorial-title italic text-sm text-[#28302A]">“${quote.text}”</p>
            <p class="text-[10px] text-[#2F5233] font-bold">— ${quote.author}</p>
          </div>
        </div>
      `;
    },

    // Mantém compatibilidade com chamadas anteriores
    generateDossieHTML: function(filter = {}) {
      if (filter.type === 'completo') {
        return this.generateCompletoDossieHTML(filter);
      } else if (filter.type === 'mes') {
        return this.generateQuickMonthReportHTML(filter.personId, filter.month);
      }
      return this.generateResumoDossieHTML(filter);
    }
  };

  window.ActaReports = ActaReports;
})(window);
