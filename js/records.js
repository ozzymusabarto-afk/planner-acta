/**
 * PLANNER ACTA — Gestão de Registros e Narrativa Automática sem IA
 * Filosofia: "A pessoa registra o que aconteceu e o sistema organiza o resto."
 * Registros rápidos com opções simples de desempenho, fotos e narrativa natural 100% local.
 */

(function(window) {
  'use strict';

  const ActaRecords = {
    // Tipos de Atividades Educacionais
    ACTIVITY_OPTIONS: [
      { id: 'leitura', label: 'Leitura', icon: 'fa-book-open' },
      { id: 'matematica', label: 'Matemática', icon: 'fa-calculator' },
      { id: 'escrita', label: 'Escrita', icon: 'fa-pen' },
      { id: 'exercicios', label: 'Exercícios', icon: 'fa-pencil' },
      { id: 'experiencia', label: 'Experiência', icon: 'fa-flask' },
      { id: 'conversa', label: 'Conversa / Diálogo', icon: 'fa-comments' },
      { id: 'estudo', label: 'Estudo individual', icon: 'fa-graduation-cap' },
      { id: 'projeto', label: 'Projeto', icon: 'fa-diagram-project' },
      { id: 'pratica', label: 'Atividade prática', icon: 'fa-hand' }
    ],

    // Opções Rápidas de Desempenho e Atitude (Como foi?)
    PERFORMANCE_OPTIONS: [
      { id: 'sozinho', label: 'Realizou sozinho', tagClass: 'bg-[#EBF3ED] text-[#2F5233] border-[#2F5233]/25', icon: 'fa-user-check' },
      { id: 'interesse', label: 'Demonstrou interesse', tagClass: 'bg-[#FEF3C7] text-[#D97706] border-[#D97706]/25', icon: 'fa-heart' },
      { id: 'avancou', label: 'Avançou', tagClass: 'bg-[#E0F2FE] text-[#0284C7] border-[#0284C7]/25', icon: 'fa-arrow-trend-up' },
      { id: 'ajuda', label: 'Precisou de ajuda', tagClass: 'bg-[#FAF5FF] text-[#7C3AED] border-[#7C3AED]/25', icon: 'fa-handshake-angle' },
      { id: 'dificuldade', label: 'Teve dificuldade', tagClass: 'bg-[#FBECE8] text-[#A95337] border-[#A95337]/25', icon: 'fa-circle-exclamation' },
      { id: 'retomar', label: 'Precisa retomar', tagClass: 'bg-[#FFF1F2] text-[#BE123C] border-[#BE123C]/25', icon: 'fa-rotate-right' }
    ],

    // Status Geral de Compreensão
    RESULT_OPTIONS: [
      { id: 'compreendeu', label: 'Compreendeu', icon: 'fa-check', pillClass: 'status-pill-compreendeu' },
      { id: 'em_pratica', label: 'Está desenvolvendo', icon: 'fa-seedling', pillClass: 'status-pill-desenvolvendo' },
      { id: 'revisar', label: 'Precisa retomar', icon: 'fa-rotate-right', pillClass: 'status-pill-retomar' }
    ],

    /**
     * NARRATIVA AUTOMÁTICA SEM IA (100% LOCAL E DETERMINÍSTICA)
     * Constrói parágrafos fluidos, objetivos e naturais a partir das escolhas simples do usuário.
     */
    generateNarrative: function(childName, subject, contentTitle, activityType, performanceArray, notes) {
      const name = childName || 'A criança';
      const cleanContent = (contentTitle || 'o conteúdo proposto').trim();
      const cleanSubject = subject || 'estudo';

      // 1. Abertura baseada no tipo de atividade
      let opening = '';
      const act = (activityType || '').toLowerCase();
      if (act.includes('leitura')) {
        opening = `Em atividade de leitura de ${cleanSubject}, ${name} trabalhou "${cleanContent}"`;
      } else if (act.includes('exercício') || act.includes('exercicios')) {
        opening = `Durante os exercícios de ${cleanSubject}, ${name} praticou "${cleanContent}"`;
      } else if (act.includes('prática') || act.includes('pratica') || act.includes('experiência')) {
        opening = `Em atividade prática de ${cleanSubject}, ${name} explorou "${cleanContent}"`;
      } else if (act.includes('conversa')) {
        opening = `Em diálogo pedagógico sobre ${cleanSubject}, ${name} conversou sobre "${cleanContent}"`;
      } else if (act.includes('escrita')) {
        opening = `Em produção escrita de ${cleanSubject}, ${name} desenvolveu "${cleanContent}"`;
      } else {
        opening = `Durante o estudo de ${cleanSubject}, ${name} trabalhou "${cleanContent}"`;
      }

      // 2. Desempenho e atitude combinados com naturalidade
      const perfs = Array.isArray(performanceArray) ? performanceArray : [];
      let middle = '';

      if (perfs.includes('sozinho') && perfs.includes('interesse')) {
        middle = ', demonstrando vivo interesse e realizando a atividade com autonomia';
      } else if (perfs.includes('sozinho') && perfs.includes('avancou')) {
        middle = ', realizando o estudo sozinho e demonstrando avanço consistente';
      } else if (perfs.includes('sozinho')) {
        middle = ', realizando a maior parte da atividade com autonomia';
      } else if (perfs.includes('ajuda') && perfs.includes('dificuldade')) {
        middle = ', recebendo auxílio pontual diante de dúvidas no conteúdo';
      } else if (perfs.includes('ajuda')) {
        middle = ', contando com orientação atenta para a compreensão dos passos';
      } else if (perfs.includes('interesse')) {
        middle = ', demonstrando entusiasmo e atenção ao tema';
      } else if (perfs.includes('avancou')) {
        middle = ', alcançando bom progresso na compreensão';
      }

      // 3. Fechamento pedagógico
      let closing = '.';
      if (perfs.includes('retomar')) {
        closing = ', com anotação para retomar e consolidar o conteúdo nos próximos dias.';
      } else if (perfs.includes('avancou') || perfs.includes('sozinho')) {
        closing = ', demonstrando boa fixação dos conceitos.';
      }

      let narrative = `${opening}${middle}${closing}`;

      // 4. Integração fluida das notas adicionais do responsável (se houver)
      if (notes && notes.trim().length > 0 && !narrative.includes(notes.trim())) {
        const cleanNotes = notes.trim();
        narrative += ` Observação: ${cleanNotes.charAt(0).toUpperCase() + cleanNotes.slice(1)}`;
        if (!narrative.endsWith('.')) narrative += '.';
      }

      return narrative.replace(/\s+/g, ' ').trim();
    },

    /**
     * Renderiza a Linha do Tempo e os nós cronológicos da criança
     */
    renderTimelineHTML: function(records) {
      if (!records || records.length === 0) {
        return `
          <div class="planner-card p-10 text-center text-[#667267] bg-white border border-[#E8E2D5] shadow-xs">
            <i class="fa-regular fa-calendar-check text-3xl text-[#8E9A8F] mb-3"></i>
            <h4 class="font-bold text-sm text-[#28302A]">Nenhum registro ainda</h4>
            <p class="text-xs text-[#667267] mt-1 max-w-sm mx-auto">
              Quando você registrar as atividades do dia a dia, a história da aprendizagem aparecerá aqui organizada.
            </p>
            <button 
              type="button" 
              onclick="ActaApp.switchTab('registros')"
              class="hero-btn-terracotta text-xs font-semibold px-4 py-2 rounded-full shadow-xs inline-flex items-center gap-1.5 mt-3"
            >
              <i class="fa-solid fa-feather text-[10px]"></i>
              <span>Fazer primeiro registro</span>
            </button>
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
          <div class="planner-card p-4 sm:p-5 bg-white border border-[#E8E2D5] flex flex-col sm:flex-row gap-4 items-start justify-between hover:border-[#2F5233]/40 transition shadow-xs">
            <div class="flex items-start gap-3.5 flex-1 min-w-0">
              <!-- Ícone de Data Estilo Carimbo -->
              <div class="w-12 h-12 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] flex flex-col items-center justify-center shrink-0 text-[#28302A]">
                <span class="text-[10px] font-bold uppercase tracking-wider text-[#667267]">${dateDisplay.split(' ')[0]}</span>
                <span class="text-xs font-bold leading-none">${dateDisplay.split(' ')[1] || 'SET'}</span>
              </div>

              <div class="space-y-1.5 flex-1 min-w-0">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="planner-bullet"></span>
                  <span class="text-xs font-bold text-[#28302A]">${rec.subject || 'Atividade'}</span>
                  <span class="text-xs text-[#8E9A8F]">•</span>
                  <span class="text-xs font-semibold text-[#28302A] truncate">${rec.contentTitle}</span>
                  <span class="text-[10px] font-medium px-2 py-0.5 rounded-full ${badgeClass}">
                    ${badgeLabel}
                  </span>
                </div>

                <!-- Tags Rápidas de Desempenho -->
                ${rec.performance && rec.performance.length > 0 ? `
                  <div class="flex flex-wrap items-center gap-1.5 py-0.5">
                    ${rec.performance.map(pId => {
                      const opt = this.PERFORMANCE_OPTIONS.find(o => o.id === pId);
                      if (!opt) return '';
                      return `
                        <span class="text-[10px] px-2 py-0.5 rounded-full border ${opt.tagClass} font-medium inline-flex items-center gap-1">
                          <i class="fa-solid ${opt.icon} text-[8px]"></i>
                          <span>${opt.label}</span>
                        </span>
                      `;
                    }).join('')}
                  </div>
                ` : ''}

                <!-- Narrativa Automática Gerada -->
                <p class="text-xs text-[#28302A] leading-relaxed">
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
    },

    /**
     * LINHA DO TEMPO COMPLETA DA CRIANÇA (Agrupada por mês com ícones temáticos)
     * Reúne estudos, leituras, passeios, projetos e experiências.
     */
    renderFullTimelineByMonthHTML: function(personId) {
      const storage = window.ActaStorage;
      if (!storage) return '';

      const person = personId ? storage.getPersonById(personId) : storage.getActivePerson();
      if (!person) {
        return `
          <div class="planner-card p-8 text-center bg-white border border-[#E8E2D5] shadow-xs">
            <p class="text-sm text-[#667267]">Selecione uma criança para visualizar sua linha do tempo.</p>
          </div>
        `;
      }

      const records = storage.getRecords(person.id);
      const extras = storage.getExtras(person.id);
      const readings = storage.getReadings ? storage.getReadings().filter(r => r.personId === person.id) : [];
      const movies = storage.getMovies ? storage.getMovies().filter(m => m.personId === person.id) : [];

      // Combinar registros normais, passeios/extras, leituras e filmes em uma lista cronológica
      const stream = [];

      records.forEach(r => {
        stream.push({
          id: r.id,
          date: r.date || '2025-09-01',
          formattedDate: r.formattedDate,
          title: r.contentTitle,
          subtitle: r.subject,
          type: r.activityType || 'Estudo',
          narrative: r.autoSummary || r.notes,
          evidenceImg: r.evidenceImg,
          isExtra: false,
          result: r.result
        });
      });

      extras.forEach(x => {
        stream.push({
          id: x.id,
          date: x.date || '2025-09-01',
          formattedDate: x.formattedDate,
          title: x.title,
          subtitle: x.category === 'passeio' ? 'Passeio Cultural' : 'Atividade Prática',
          type: x.type || 'Passeio',
          narrative: x.description || x.highlights,
          evidenceImg: x.evidenceImg,
          isExtra: true,
          location: x.location
        });
      });

      // Leituras literárias concluídas
      readings.filter(r => (r.status || 'concluido') === 'concluido').forEach(rd => {
        const narrativeText = rd.favoritePart 
          ? `Leitura concluída. A criança destacou: "${rd.favoritePart}". ${rd.reflection ? `Reflexão: ${rd.reflection}` : ''}`
          : (rd.reflection || rd.summary || 'Leitura de formação literária concluída.');
        stream.push({
          id: rd.id,
          date: rd.endDate || rd.startDate || '2025-09-01',
          formattedDate: rd.endDate ? rd.endDate.split('-').reverse().join('/') : '',
          title: rd.title,
          subtitle: `Leitura Literária • ${rd.author ? `Por ${rd.author}` : (rd.category || 'Clássico')}`,
          type: 'Leitura Literária',
          narrative: narrativeText,
          evidenceImg: rd.coverImg,
          isCulture: true,
          cultureType: 'reading',
          virtues: rd.virtues
        });
      });

      // Filmes culturais assistidos
      movies.forEach(mv => {
        const narrativeText = mv.favoritePart 
          ? `Filme assistido em família. A criança destacou: "${mv.favoritePart}". ${mv.reflection ? `Reflexão: ${mv.reflection}` : ''}`
          : (mv.reflection || mv.summary || 'Experiência cultural assistida em família.');
        stream.push({
          id: mv.id,
          date: mv.date || '2025-09-01',
          formattedDate: mv.date ? mv.date.split('-').reverse().join('/') : '',
          title: mv.title,
          subtitle: `Filme & Cultura • ${mv.director ? `Dir. ${mv.director}` : (mv.category || 'Cinema')}`,
          type: 'Filme',
          narrative: narrativeText,
          evidenceImg: mv.posterImg,
          isCulture: true,
          cultureType: 'movie',
          virtues: mv.virtues
        });
      });

      // Ordenar por data decrescente (mais recente primeiro)
      stream.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

      if (stream.length === 0) {
        return `
          <div class="planner-card p-10 text-center text-[#667267] bg-white border border-[#E8E2D5] shadow-xs">
            <i class="fa-solid fa-timeline text-4xl text-[#8E9A8F] mb-3"></i>
            <h4 class="font-bold text-sm text-[#28302A]">Linha do Tempo ainda sem registros</h4>
            <p class="text-xs text-[#667267] mt-1 max-w-sm mx-auto">
              À medida que você realizar registros diários ou adicionar passeios e projetos, a história do aprendizado de ${person.name} se formará aqui automaticamente.
            </p>
          </div>
        `;
      }

      // Agrupar por Mês/Ano
      const monthGroups = {};
      const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

      stream.forEach(item => {
        let groupKey = 'Recentes';
        if (item.date && item.date.includes('-')) {
          const parts = item.date.split('-');
          const mIdx = parseInt(parts[1]) - 1;
          groupKey = `${monthNames[mIdx] || 'Mês'} ${parts[0]}`.toUpperCase();
        }
        if (!monthGroups[groupKey]) monthGroups[groupKey] = [];
        monthGroups[groupKey].push(item);
      });

      let html = '<div class="space-y-8">';

      for (const [monthLabel, items] of Object.entries(monthGroups)) {
        html += `
          <div class="space-y-3">
            <!-- Cabeçalho do Mês na Linha do Tempo -->
            <div class="flex items-center gap-3">
              <span class="w-3 h-3 rounded-full bg-[#2F5233] ring-4 ring-[#EBF3ED] shrink-0"></span>
              <h3 class="font-editorial-serif text-base font-bold text-[#28302A] tracking-wider uppercase">
                ${monthLabel}
              </h3>
              <div class="flex-1 h-px bg-[#E8E2D5]"></div>
              <span class="text-xs text-[#667267] font-medium font-mono">${items.length} ${items.length === 1 ? 'marco' : 'marcos'}</span>
            </div>

            <!-- Lista de Itens do Mês -->
            <div class="space-y-3 pl-5 border-l-2 border-[#E8E2D5]/70 ml-1.5">
        `;

        items.forEach(it => {
          let typeIcon = 'fa-book-open';
          let typeColor = 'text-[#2F5233] bg-[#EBF3ED]';

          const tLower = (it.type || '').toLowerCase();
          const sLower = (it.subtitle || '').toLowerCase();

          if (tLower.includes('filme')) {
            typeIcon = 'fa-film';
            typeColor = 'text-[#A95337] bg-[#FBECE8]';
          } else if (tLower.includes('leitura') || sLower.includes('literatura')) {
            typeIcon = 'fa-book-bookmark';
            typeColor = 'text-[#2F5233] bg-[#EBF3ED]';
          } else if (sLower.includes('matemática') || tLower.includes('matemática')) {
            typeIcon = 'fa-calculator';
            typeColor = 'text-[#1E3A5F] bg-[#E9EFF6]';
          } else if (sLower.includes('ciências') || tLower.includes('experiência')) {
            typeIcon = 'fa-flask';
            typeColor = 'text-[#D97706] bg-[#FEF3C7]';
          } else if (it.isExtra && (tLower.includes('museu') || sLower.includes('passeio'))) {
            typeIcon = 'fa-building-columns';
            typeColor = 'text-[#0284C7] bg-[#E0F2FE]';
          } else if (it.isExtra && tLower.includes('culinária')) {
            typeIcon = 'fa-utensils';
            typeColor = 'text-[#A95337] bg-[#FBECE8]';
          } else if (it.isExtra && (tLower.includes('arte') || tLower.includes('pintura'))) {
            typeIcon = 'fa-palette';
            typeColor = 'text-[#7C3AED] bg-[#EDE9FE]';
          }

          html += `
            <div class="planner-card p-4 bg-white border border-[#E8E2D5] flex flex-col sm:flex-row justify-between items-start gap-4 shadow-2xs hover:border-[#2F5233]/40 transition">
              <div class="flex items-start gap-3 flex-1 min-w-0">
                <div class="w-9 h-9 rounded-xl ${typeColor} flex items-center justify-center shrink-0 text-sm shadow-2xs">
                  <i class="fa-solid ${typeIcon}"></i>
                </div>
                <div class="space-y-1 min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <span class="text-xs font-bold text-[#28302A]">${it.title}</span>
                    <span class="text-xs text-[#8E9A8F]">•</span>
                    <span class="text-[11px] text-[#667267] font-medium">${it.subtitle}</span>
                    <span class="text-[10px] text-[#8E9A8F] font-mono">${it.formattedDate || it.date}</span>
                  </div>
                  <p class="text-xs text-[#28302A] leading-relaxed">
                    ${it.narrative || ''}
                  </p>
                  ${it.virtues && it.virtues.length > 0 ? `
                    <div class="flex flex-wrap gap-1 pt-1">
                      ${it.virtues.map(v => `<span class="text-[9.5px] font-semibold bg-[#FAF7F0] text-[#7A3E26] px-2 py-0.5 rounded-md border border-[#E8E2D5]">★ ${v}</span>`).join('')}
                    </div>
                  ` : ''}
                  ${it.location ? `
                    <span class="text-[10px] text-[#667267] flex items-center gap-1">
                      <i class="fa-solid fa-location-dot text-[#A95337]"></i> ${it.location}
                    </span>
                  ` : ''}
                </div>
              </div>

              ${it.evidenceImg ? `
                <div 
                  onclick="ActaApp.previewImage('${it.evidenceImg}')"
                  class="w-16 h-16 rounded-xl overflow-hidden border border-[#E8E2D5] bg-[#FAF7F0] shrink-0 cursor-pointer hover:opacity-90 transition shadow-2xs"
                  title="Clique para ampliar foto de evidência"
                >
                  <img src="${it.evidenceImg}" alt="Evidência" class="w-full h-full object-cover">
                </div>
              ` : ''}
            </div>
          `;
        });

        html += `
            </div>
          </div>
        `;
      }

      html += '</div>';
      return html;
    }
  };

  window.ActaRecords = ActaRecords;
})(window);
