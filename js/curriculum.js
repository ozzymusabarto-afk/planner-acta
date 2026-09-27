/**
 * PLANNER ACTA — Motor Pedagógico de Grade Curricular & Planejamento
 * 
 * Filosofia:
 * - Algoritmo determinístico baseado em regras (zero IA, ultra-rápido, custo zero)
 * - Matriz curricular equilibrada do 1º Ano Fundamental ao 3º Ano do Ensino Médio
 * - Flexibilidade total: os pais podem personalizar, incluir idiomas (inglês, latim, espanhol),
 *   música, artes e remanejar aulas não dadas com 1 clique.
 */

(function(window) {
  'use strict';

  const GRADES_CONFIG = {
    'infantil': {
      label: 'Educação Infantil (4 a 5 anos)',
      description: 'Estímulo à linguagem oral, imaginação, ritmo, coordenação motora e admiração da natureza.',
      days: {
        'segunda': [
          { subject: 'Linguagem & Contação de Histórias', content: 'Leitura em voz alta e reconto oral' },
          { subject: 'Jogos de Atenção & Lógica', content: 'Encaixes, seriação e noções espaciais' }
        ],
        'terca': [
          { subject: 'Artes Manuais & Desenho', content: 'Pintura, modelagem e traçado livre' },
          { subject: 'Música & Ritmo', content: 'Cantigas tradicionais e percussão corporal' }
        ],
        'quarta': [
          { subject: 'Natureza & Observação', content: 'Plantas, pequenos animais e estações do ano' },
          { subject: 'Poesia & Memória', content: 'Recitação de pequenos versos e trava-línguas' }
        ],
        'quinta': [
          { subject: 'Coordenação Motora Fina', content: 'Recorte, alinhavo e desenhos orientados' },
          { subject: 'Jogos Matemáticos Concretos', content: 'Contagem de objetos e correspondência um a um' }
        ],
        'sexta': [
          { subject: 'Literatura em Família', content: 'Leitura de fábulas e clássicos ilustrados' },
          { subject: 'Movimento & Brincadeiras', content: 'Circuitos motores, equilíbrio e cantigas de roda' }
        ]
      }
    },

    'fund1_1ano': {
      label: '1º Ano do Ensino Fundamental (6 a 7 anos)',
      description: 'Foco central na alfabetização segura, escrita inicial e domínio dos números naturais.',
      days: {
        'segunda': [
          { subject: 'Língua Portuguesa (Alfabetização)', content: 'Consciência fonológica e traçado das letras' },
          { subject: 'Matemática', content: 'Sistema de numeração decimal e contagem' }
        ],
        'terca': [
          { subject: 'Língua Portuguesa', content: 'Leitura orientada e formação de sílabas' },
          { subject: 'Ciências da Natureza', content: 'O corpo humano, os sentidos e os seres vivos' }
        ],
        'quarta': [
          { subject: 'Língua Portuguesa', content: 'Cópia caprichada e ditado de palavras' },
          { subject: 'História & Família', content: 'História pessoal, família e a passagem do tempo' }
        ],
        'quinta': [
          { subject: 'Matemática', content: 'Adição simples com material concreto e problemas orais' },
          { subject: 'Geografia & Espaço', content: 'A casa, o bairro, orientação e pontos de referência' }
        ],
        'sexta': [
          { subject: 'Língua Portuguesa (Leitura)', content: 'Contos clássicos, cantigas e parlendas' },
          { subject: 'Artes Visuais & Música', content: 'Desenho de observação, cores primárias e ritmo' }
        ]
      }
    },

    'fund1_2ano': {
      label: '2º Ano do Ensino Fundamental (7 a 8 anos)',
      description: 'Consolidação da fluência leitora, ortografia básica, adição e subtração com reserva.',
      days: {
        'segunda': [
          { subject: 'Língua Portuguesa', content: 'Ortografia, pontuação e leitura expressiva' },
          { subject: 'Matemática', content: 'Adição e subtração com agrupamento/reagrupamento' }
        ],
        'terca': [
          { subject: 'Língua Portuguesa', content: 'Pequenas produções de texto e compreensão' },
          { subject: 'Ciências da Natureza', content: 'As plantas, fases da vida e cuidados com o ambiente' }
        ],
        'quarta': [
          { subject: 'Língua Portuguesa', content: 'Classes gramaticais iniciais (substantivos e adjetivos)' },
          { subject: 'História', content: 'A comunidade, profissões e fontes históricas da família' }
        ],
        'quinta': [
          { subject: 'Matemática', content: 'Geometria espacial/plana e medidas de tempo (relógio)' },
          { subject: 'Geografia', content: 'Paisagens naturais e transformadas pelo homem' }
        ],
        'sexta': [
          { subject: 'Língua Portuguesa', content: 'Interpretação de textos e leitura em voz alta' },
          { subject: 'Artes & Expressão', content: 'Técnicas de desenho, pintura e estudo de grandes mestres' }
        ]
      }
    },

    'fund1_3ano': {
      label: '3º Ano do Ensino Fundamental (8 a 9 anos)',
      description: 'Estruturação gramatical, tabuada da multiplicação, divisão inicial e primeiros textos longos.',
      days: {
        'segunda': [
          { subject: 'Língua Portuguesa', content: 'Gramática: verbos, concordância e pontuação avançada' },
          { subject: 'Matemática', content: 'Tabuada, introdução à multiplicação e problemas' }
        ],
        'terca': [
          { subject: 'Língua Portuguesa', content: 'Redação: parágrafos, início, meio e fim' },
          { subject: 'Ciências da Natureza', content: 'O solo, a água, estados físicos e ecossistemas' }
        ],
        'quarta': [
          { subject: 'Língua Portuguesa', content: 'Vocabulário, sinônimos, antônimos e leitura profunda' },
          { subject: 'História', content: 'Origem dos municípios, patrimônio cultural e cidades antigas' }
        ],
        'quinta': [
          { subject: 'Matemática', content: 'Introdução à divisão exata e medidas de massa/comprimento' },
          { subject: 'Geografia', content: 'O campo e a cidade (rural e urbano), relevo e mapas' }
        ],
        'sexta': [
          { subject: 'Matemática', content: 'Resolução de desafios matemáticos e raciocínio lógico' },
          { subject: 'Artes & Música', content: 'História da arte, instrumentos e apreciação estética' }
        ]
      }
    },

    'fund1_4ano': {
      label: '4º Ano do Ensino Fundamental (9 a 10 anos)',
      description: 'História do Brasil, frações, divisão por dois algarismos e produção textual estruturada.',
      days: {
        'segunda': [
          { subject: 'Língua Portuguesa', content: 'Análise gramatical completa e ortografia aprofundada' },
          { subject: 'Matemática', content: 'Multiplicação e divisão avançadas, introdução a frações' }
        ],
        'terca': [
          { subject: 'Língua Portuguesa', content: 'Redação narrativa e dissertativa inicial' },
          { subject: 'Ciências da Natureza', content: 'Cadeias alimentares, energia e transformações químicas' }
        ],
        'quarta': [
          { subject: 'História do Brasil', content: 'Povos originários, Grandes Navegações e Brasil Colônia' },
          { subject: 'Geografia do Brasil', content: 'As cinco regiões brasileiras, clima e vegetação' }
        ],
        'quinta': [
          { subject: 'Matemática', content: 'Frações, números decimais e cálculos práticos' },
          { subject: 'Língua Portuguesa', content: 'Interpretação e análise literária de obras clássicas' }
        ],
        'sexta': [
          { subject: 'Ciências & Experimentos', content: 'O sistema solar, astros e método científico prático' },
          { subject: 'Artes & História da Arte', content: 'Barroco brasileiro, arquitetura e desenho técnico' }
        ]
      }
    },

    'fund1_5ano': {
      label: '5º Ano do Ensino Fundamental (10 a 11 anos)',
      description: 'Transição para o ciclo fundamental II: autonomia leitora, matemática decimal e história imperial.',
      days: {
        'segunda': [
          { subject: 'Língua Portuguesa', content: 'Sintaxe básica, concordância nominal e verbal' },
          { subject: 'Matemática', content: 'Operações com frações, decimais e porcentagem inicial' }
        ],
        'terca': [
          { subject: 'Ciências da Natureza', content: 'Sistemas do corpo humano: digestório, respiratório, circulatório' },
          { subject: 'História do Brasil', content: 'Ciclo do ouro, Independência e Brasil Império' }
        ],
        'quarta': [
          { subject: 'Língua Portuguesa', content: 'Redação opinativa, resenha e argumentação' },
          { subject: 'Geografia', content: 'Dinâmica populacional, hidrografia e cartografia' }
        ],
        'quinta': [
          { subject: 'Matemática', content: 'Áreas, perímetros, figuras geométricas e problemas compostos' },
          { subject: 'Língua Portuguesa', content: 'Figuras de linguagem e enriquecimento vocabular' }
        ],
        'sexta': [
          { subject: 'História & Atualidades', content: 'Proclamação da República e formação da cidadania' },
          { subject: 'Artes & Cultura', content: 'Grandes mestres da pintura, escultura e composição' }
        ]
      }
    },

    'fund2_6a9ano': {
      label: 'Anos Finais: 6º ao 9º Ano (11 a 15 anos)',
      description: 'Disciplinas especializadas: Álgebra, Geometria, História Geral, Ciências Físicas e Redação.',
      days: {
        'segunda': [
          { subject: 'Língua Portuguesa (Gramática & Sintaxe)', content: 'Análise morfológica e sintática do período' },
          { subject: 'Matemática (Álgebra)', content: 'Equações, expressões algébricas e potências' }
        ],
        'terca': [
          { subject: 'Ciências / Física & Química Inicial', content: 'Estrutura da matéria, tabela periódica e energia' },
          { subject: 'História Geral', content: 'Civilizações antigas, Idade Média e Mundo Moderno' }
        ],
        'quarta': [
          { subject: 'Língua Portuguesa (Literatura & Análise)', content: 'Obras canônicas, gêneros literários e retórica' },
          { subject: 'Geografia Geral & Geopolítica', content: 'Continentes, blocos econômicos e recursos naturais' }
        ],
        'quinta': [
          { subject: 'Matemática (Geometria)', content: 'Teorema de Pitágoras, trigonometria e cálculo de volumes' },
          { subject: 'Redação & Produção Textual', content: 'Texto dissertativo-argumentativo estruturado' }
        ],
        'sexta': [
          { subject: 'História do Brasil', content: 'Brasil República, Era Vargas e História Contemporânea' },
          { subject: 'Biologia Geral', content: 'Célula, genética básica, evolução e ecologia' }
        ]
      }
    },

    'ensino_medio': {
      label: 'Ensino Médio (1º ao 3º Ano)',
      description: 'Preparação aprofundada: Física, Química, Biologia, Filosofia, Redação e Matemática Superior.',
      days: {
        'segunda': [
          { subject: 'Língua Portuguesa & Literatura', content: 'Classicismo, Romantismo, Realismo e Modernismo' },
          { subject: 'Matemática', content: 'Funções, matrizes, probabilidade e combinatória' },
          { subject: 'Física', content: 'Mecânica clássica, cinemática e leis de Newton' }
        ],
        'terca': [
          { subject: 'Redação', content: 'Dissertação modelo ENEM/Vestibulares com proposta de intervenção' },
          { subject: 'Química', content: 'Química geral, estequiometria e soluções' },
          { subject: 'Biologia', content: 'Citologia, bioquímica celular e fisiologia animal' }
        ],
        'quarta': [
          { subject: 'História Geral & do Brasil', content: 'Guerras Mundiais, Guerra Fria e Brasil Democrático' },
          { subject: 'Geografia & Geopolítica', content: 'Globalização, urbanização e geopolítica global' },
          { subject: 'Matemática', content: 'Geometria analítica e espacial' }
        ],
        'quinta': [
          { subject: 'Física', content: 'Termodinâmica, ondas, óptica e eletricidade' },
          { subject: 'Química', content: 'Físico-química, termoquímica e química orgânica' },
          { subject: 'Língua Portuguesa', content: 'Estudo gramatical avançado e figuras de estilo' }
        ],
        'sexta': [
          { subject: 'Biologia', content: 'Genética mendeliana, biotecnologia e ecossistemas' },
          { subject: 'Filosofia & Sociologia', content: 'Ética, epistemologia, teoria política e sociedade' },
          { subject: 'Redação & Atualidades', content: 'Repertório sociocultural e debate de temas' }
        ]
      }
    }
  };

  const ELECTIVES_CONFIG = {
    'ingles': {
      id: 'ingles',
      name: 'Língua Inglesa',
      days: ['terca', 'quinta'],
      defaultContent: 'Vocabulário, gramática e conversação prática'
    },
    'latim': {
      id: 'latim',
      name: 'Língua Latina & Cultura Clássica',
      days: ['segunda', 'quarta'],
      defaultContent: 'Declinações, vocabulário latino e sentenças'
    },
    'espanhol': {
      id: 'espanhol',
      name: 'Língua Espanhola',
      days: ['quarta'],
      defaultContent: 'Compreensão leitora, fonética e gramática'
    },
    'musica': {
      id: 'musica',
      name: 'Música & Teoria Musical',
      days: ['sexta'],
      defaultContent: 'Teoria, solfejo e prática de instrumento'
    },
    'logica': {
      id: 'logica',
      name: 'Lógica & Raciocínio Formal',
      days: ['quinta'],
      defaultContent: 'Silogismos, falácias e pensamento crítico'
    }
  };

  const ActaCurriculum = {
    GRADES_CONFIG: GRADES_CONFIG,
    ELECTIVES_CONFIG: ELECTIVES_CONFIG,

    /**
     * Calcula as datas reais da semana atual (de segunda a sexta)
     */
    getWeekDates: function() {
      const now = new Date();
      const currentDay = now.getDay(); // 0 = Domingo, 1 = Segunda, ...
      const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
      const monday = new Date(now);
      monday.setDate(now.getDate() + distanceToMonday);

      const daysMeta = [
        { dayKey: 'segunda', dayTitle: 'Segunda-feira', offset: 0 },
        { dayKey: 'terca', dayTitle: 'Terça-feira', offset: 1 },
        { dayKey: 'quarta', dayTitle: 'Quarta-feira', offset: 2 },
        { dayKey: 'quinta', dayTitle: 'Quinta-feira', offset: 3 },
        { dayKey: 'sexta', dayTitle: 'Sexta-feira', offset: 4 }
      ];

      return daysMeta.map(d => {
        const dDate = new Date(monday);
        dDate.setDate(monday.getDate() + d.offset);
        const dayNum = String(dDate.getDate()).padStart(2, '0');
        const monthNum = String(dDate.getMonth() + 1).padStart(2, '0');
        return {
          dayKey: d.dayKey,
          dayTitle: d.dayTitle,
          dateLabel: `${dayNum}/${monthNum}`
        };
      });
    },

    /**
     * Retorna a string legível do período da semana (ex: "Semana de 28 de setembro a 02 de outubro")
     */
    getCurrentWeekRangeLabel: function() {
      const dates = this.getWeekDates();
      const monthNames = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
      const now = new Date();
      const currentDay = now.getDay();
      const distanceToMonday = currentDay === 0 ? -6 : 1 - currentDay;
      const monday = new Date(now);
      monday.setDate(now.getDate() + distanceToMonday);
      const friday = new Date(monday);
      friday.setDate(monday.getDate() + 4);

      const d1 = monday.getDate();
      const m1 = monthNames[monday.getMonth()];
      const d2 = String(friday.getDate()).padStart(2, '0');
      const m2 = monthNames[friday.getMonth()];

      if (m1 === m2) {
        return `Semana de ${d1} a ${d2} de ${m1}`;
      }
      return `Semana de ${d1} de ${m1} a ${d2} de ${m2}`;
    },

    /**
     * Aplica uma grade sugerida na semana da criança selecionada
     */
    applyGradeToSchedule: function(childId, gradeKey, selectedElectiveIds = [], replaceExisting = true, dailyCore = false) {
      const storage = window.ActaStorage;
      if (!storage) return false;

      const grade = GRADES_CONFIG[gradeKey] || GRADES_CONFIG['fund1_1ano'];
      if (!grade) {
        console.error('[Curriculum] Grade não encontrada:', gradeKey);
        return false;
      }

      // Base da semana com datas reais calculadas
      const weekDays = this.getWeekDates();

      // Busca dados atuais da semana
      let currentSchedule = storage.getData ? (storage.getData().weekSchedule || []) : storage.getWeekSchedule();
      if (!Array.isArray(currentSchedule) || currentSchedule.length === 0) {
        currentSchedule = weekDays.map(d => ({ ...d, items: [] }));
      }

      // Monta novo cronograma
      const updatedSchedule = weekDays.map(wDay => {
        let existingDay = currentSchedule.find(d => d.dayKey === wDay.dayKey);
        let items = (replaceExisting || !existingDay) ? [] : existingDay.items.slice();

        // 1. Adiciona as matérias da base do ano
        const baseItems = (grade.days[wDay.dayKey] || []).slice();

        // Se Núcleo Diário estiver ativado: garante Português e Matemática todos os dias
        if (dailyCore) {
          const hasPort = baseItems.some(b => b.subject.toLowerCase().includes('portugu'));
          const hasMat = baseItems.some(b => b.subject.toLowerCase().includes('matemát'));

          if (!hasPort) {
            baseItems.unshift({
              subject: 'Língua Portuguesa',
              content: 'Leitura, gramática e escrita guiada'
            });
          }
          if (!hasMat) {
            const portIdx = baseItems.findIndex(b => b.subject.toLowerCase().includes('portugu'));
            const insertIdx = portIdx >= 0 ? portIdx + 1 : 0;
            baseItems.splice(insertIdx, 0, {
              subject: 'Matemática',
              content: 'Cálculo, fixação e resolução de problemas'
            });
          }
        }

        baseItems.forEach(b => {
          items.push({
            id: 'plan_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
            childId: childId,
            subject: b.subject,
            content: b.content,
            status: 'pendente',
            createdAt: new Date().toISOString()
          });
        });

        // 2. Adiciona as eletivas selecionadas (se caírem neste dia)
        if (Array.isArray(selectedElectiveIds)) {
          selectedElectiveIds.forEach(elecId => {
            const elec = ELECTIVES_CONFIG[elecId];
            if (elec && elec.days.includes(wDay.dayKey)) {
              items.push({
                id: 'plan_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
                childId: childId,
                subject: elec.name,
                content: elec.defaultContent,
                status: 'pendente',
                createdAt: new Date().toISOString()
              });
            }
          });
        }

        return {
          dayKey: wDay.dayKey,
          dayTitle: wDay.dayTitle,
          dateLabel: wDay.dateLabel,
          items: items
        };
      });

      storage.saveWeekSchedule(updatedSchedule);

      // Atualiza também o ano escolar no cadastro da criança
      if (childId) {
        const person = storage.getPersonById(childId);
        if (person) {
          person.schoolYear = gradeKey;
          person.schoolYearLabel = grade.label;
          person.dailyCore = !!dailyCore;
          if (typeof storage.updatePerson === 'function') {
            storage.updatePerson(person);
          } else if (typeof storage.savePerson === 'function') {
            storage.savePerson(person);
          }
        }
      }

      return updatedSchedule;
    },

    /**
     * Remaneja / Adia uma aula não dada para outro dia da semana com 1 clique
     */
    reschedulePlanItem: function(fromDayKey, itemIndex, toDayKey) {
      const storage = window.ActaStorage;
      if (!storage) return false;

      let schedule = storage.getWeekSchedule();
      if (!Array.isArray(schedule)) return false;

      const fromDay = schedule.find(d => d.dayKey === fromDayKey);
      const toDay = schedule.find(d => d.dayKey === toDayKey);

      if (!fromDay || !toDay || !fromDay.items[itemIndex]) return false;

      // Retira do dia de origem
      const [movedItem] = fromDay.items.splice(itemIndex, 1);
      // Adiciona no dia de destino
      movedItem.updatedAt = new Date().toISOString();
      toDay.items.push(movedItem);

      storage.saveWeekSchedule(schedule);
      return true;
    },

    /**
     * Alterna o status da aula entre Pendente e Concluído
     */
    togglePlanItemStatus: function(dayKey, itemIndex) {
      const storage = window.ActaStorage;
      if (!storage) return false;

      let schedule = storage.getWeekSchedule();
      const day = schedule.find(d => d.dayKey === dayKey);
      if (!day || !day.items[itemIndex]) return false;

      const current = day.items[itemIndex].status || 'pendente';
      day.items[itemIndex].status = current === 'concluido' ? 'pendente' : 'concluido';
      day.items[itemIndex].completedAt = day.items[itemIndex].status === 'concluido' ? new Date().toISOString() : null;

      storage.saveWeekSchedule(schedule);
      return true;
    },

    /**
     * Abre modal interativo para aplicar grade sugerida
     */
    openCurriculumModal: function(targetChildId) {
      const storage = window.ActaStorage;
      const modal = document.getElementById('modalCurriculumGrade');
      const overlay = document.getElementById('modalOverlay');
      if (!modal) return;

      const people = storage ? storage.getPeople() : [];
      let activePerson = storage ? storage.getActivePerson() : null;
      if (targetChildId) {
        const found = (storage && typeof storage.getPersonById === 'function') ? storage.getPersonById(targetChildId) : null;
        if (found) activePerson = found;
      }

      // Popula select de crianças
      const childSelect = document.getElementById('curriculumChildSelect');
      if (childSelect) {
        childSelect.innerHTML = people.map(p => `
          <option value="${p.id}" ${activePerson && activePerson.id === p.id ? 'selected' : ''}>
            ${p.name} ${p.schoolYearLabel ? '(' + p.schoolYearLabel + ')' : ''}
          </option>
        `).join('');
      }

      // Popula select de séries
      const gradeSelect = document.getElementById('curriculumGradeSelect');
      if (gradeSelect) {
        gradeSelect.innerHTML = Object.entries(GRADES_CONFIG).map(([key, val]) => `
          <option value="${key}">${val.label}</option>
        `).join('');
        
        // Se a criança já tem série cadastrada, pré-seleciona
        if (activePerson && activePerson.schoolYear && GRADES_CONFIG[activePerson.schoolYear]) {
          gradeSelect.value = activePerson.schoolYear;
        }
      }

      // Sincroniza o toggle de núcleo diário se a criança já tiver preferência salva
      const dailyCoreCheck = document.getElementById('curriculumDailyCoreCheck');
      if (dailyCoreCheck) {
        dailyCoreCheck.checked = (activePerson && activePerson.dailyCore !== undefined) ? !!activePerson.dailyCore : false;
      }

      this.updateGradePreview();
      if (overlay) overlay.classList.remove('hidden');
      modal.classList.remove('hidden');
    },

    closeCurriculumModal: function() {
      const modal = document.getElementById('modalCurriculumGrade');
      const overlay = document.getElementById('modalOverlay');
      if (modal) modal.classList.add('hidden');
      if (overlay) overlay.classList.add('hidden');
    },

    /**
     * Atualiza o resumo visual da grade selecionada no modal
     */
    updateGradePreview: function() {
      const gradeSelect = document.getElementById('curriculumGradeSelect');
      const previewBox = document.getElementById('curriculumGradePreview');
      const dailyCoreCheck = document.getElementById('curriculumDailyCoreCheck');
      const isDailyCore = dailyCoreCheck ? dailyCoreCheck.checked : false;
      if (!gradeSelect || !previewBox) return;

      const grade = GRADES_CONFIG[gradeSelect.value];
      if (!grade) return;

      let html = `
        <div class="space-y-2">
          <p class="text-xs text-[#2F5233] font-semibold">${grade.description}</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
      `;

      const dayNames = {
        'segunda': 'Segunda',
        'terca': 'Terça',
        'quarta': 'Quarta',
        'quinta': 'Quinta',
        'sexta': 'Sexta'
      };

      for (const [dKey, dItemsRaw] of Object.entries(grade.days)) {
        let dItems = dItemsRaw.slice();
        if (isDailyCore) {
          const hasPort = dItems.some(i => i.subject.toLowerCase().includes('portugu'));
          const hasMat = dItems.some(i => i.subject.toLowerCase().includes('matemát'));
          if (!hasPort) dItems.unshift({ subject: 'Língua Portuguesa' });
          if (!hasMat) {
            const portIdx = dItems.findIndex(i => i.subject.toLowerCase().includes('portugu'));
            const insertIdx = portIdx >= 0 ? portIdx + 1 : 0;
            dItems.splice(insertIdx, 0, { subject: 'Matemática' });
          }
        }

        html += `
          <div class="p-2.5 rounded-xl bg-white border border-[#E8E2D5] shadow-2xs">
            <span class="font-bold text-[#28302A] block text-[10px] uppercase">${dayNames[dKey]}</span>
            <ul class="text-[#667267] list-disc list-inside mt-0.5 space-y-0.5">
              ${dItems.map(i => {
                const isCore = isDailyCore && (i.subject.includes('Portuguesa') || i.subject === 'Matemática');
                return `<li class="${isCore ? 'text-[#2F5233] font-semibold' : ''}">${i.subject}</li>`;
              }).join('')}
            </ul>
          </div>
        `;
      }

      html += `</div></div>`;
      previewBox.innerHTML = html;
    },

    /**
     * Submete a aplicação da grade
     */
    handleApplySubmit: function() {
      const childSelect = document.getElementById('curriculumChildSelect');
      const gradeSelect = document.getElementById('curriculumGradeSelect');
      const replaceCheck = document.getElementById('curriculumReplaceCheck');
      const dailyCoreCheck = document.getElementById('curriculumDailyCoreCheck');

      const childId = childSelect ? childSelect.value : null;
      const gradeKey = gradeSelect ? gradeSelect.value : null;
      const replaceExisting = replaceCheck ? replaceCheck.checked : true;
      const dailyCore = dailyCoreCheck ? dailyCoreCheck.checked : false;

      // Coleta eletivas marcadas
      const electiveChecks = document.querySelectorAll('input[name="curriculumElective"]:checked');
      const selectedElectives = Array.from(electiveChecks).map(c => c.value);

      if (!gradeKey) {
        alert('Selecione uma série para aplicar.');
        return;
      }

      const ok = this.applyGradeToSchedule(childId, gradeKey, selectedElectives, replaceExisting, dailyCore);
      if (ok) {
        this.closeCurriculumModal();
        if (childId && window.ActaStorage) {
          window.ActaStorage.setActivePersonId(childId);
        }
        if (window.ActaApp) {
          if (typeof window.ActaApp.renderSidebar === 'function') window.ActaApp.renderSidebar();
          if (typeof window.ActaApp.renderCriancasTab === 'function') window.ActaApp.renderCriancasTab();
          if (typeof window.ActaApp.switchTab === 'function') window.ActaApp.switchTab('semana');
          if (typeof window.ActaApp.renderSemanaTab === 'function') window.ActaApp.renderSemanaTab();
          if (typeof window.ActaApp.showToast === 'function') {
            window.ActaApp.showToast('Grade horária sugerida aplicada com sucesso!');
          }
        }
      }
    }
  };

  window.ActaCurriculum = ActaCurriculum;
})(window);
