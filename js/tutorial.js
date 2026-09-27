/**
 * PLANNER ACTA — Guia Interativo & Tour de Boas-Vindas
 * 
 * Funcionalidades:
 * - Tour guiado passo a passo para novos usuários
 * - Troca automática de abas para visualização em tempo real do recurso
 * - Dicas práticas de uso pedagógico e organização familiar
 * - Botão permanente "Guia & Como Usar" para consulta a qualquer momento
 */

(function(window) {
  'use strict';

  const TOUR_STORAGE_KEY = 'ACTA_TOUR_DISMISSED_';
  let currentStep = 0;

  const STEPS = [
    {
      tab: 'casa',
      badge: 'Boas-Vindas',
      icon: 'fa-solid fa-leaf',
      title: 'Bem-vindo(a) ao Planner ACTA',
      subtitle: 'O Caderno Inteligente da Família & Escola',
      description: 'O ACTA foi criado para trazer **serenidade ao planejamento** dos estudos e **profundidade ao registro** da vida cultural dos seus filhos. Tudo o que você precisa está organizado em um só lugar.',
      tip: '💡 Você pode usar o ACTA no computador, tablet ou celular. Seus dados são salvos na nuvem com segurança.'
    },
    {
      tab: 'criancas',
      badge: 'Passo 1 de 6',
      icon: 'fa-solid fa-children',
      title: '1. Crianças: O Coração do Planner',
      subtitle: 'Cada filho tem seu próprio espaço individual',
      description: 'O primeiro passo é cadastrar os seus filhos. Cada criança possui seu próprio perfil, avatar personalizado, idade e anotações. Todo o planejamento de estudos e registros será feito individualmente para cada uma delas.',
      tip: '💡 Você pode trocar de criança ativa a qualquer momento clicando no nome dela na barra lateral ou no topo.'
    },
    {
      tab: 'materiais',
      badge: 'Passo 2 de 6',
      icon: 'fa-solid fa-book-bookmark',
      title: '2. Biblioteca de Materiais & Livros Didáticos',
      subtitle: 'Apostilas, coleções, PDFs e conteúdos escolares',
      description: 'Aqui você cadastra os materiais de estudo: apostilas, livros escolares e cursos. Para cada livro, você pode cadastrar o **sumário de tópicos**, facilitando a distribuição do conteúdo ao longo das semanas.',
      tip: '💡 Esta área é para materiais de estudo. A literatura e romances lidos pela criança ficam em Leituras & Literatura.'
    },
    {
      tab: 'semana',
      badge: 'Passo 3 de 6',
      icon: 'fa-solid fa-calendar-week',
      title: '3. Planejamento Semanal Inteligente',
      subtitle: 'O fluxo perfeito: Criança ➔ Material ➔ Conteúdo ➔ Dia',
      description: 'Distribua o que cada criança estudará de segunda a sexta-feira. Ao clicar em **"Planejar Estudo"**, você escolhe o filho, o livro didático e o próximo tópico do sumário. O planner organiza a semana sem sobrecarregar a rotina.',
      tip: '💡 Ao lado de cada item planejado na semana, há um botãozinho direto para registrar a lição assim que ela for cumprida!'
    },
    {
      tab: 'registros',
      badge: 'Passo 4 de 6',
      icon: 'fa-solid fa-pen-nib',
      title: '4. Registros: O Diário Pedagógico Vivo',
      subtitle: 'Documente o que foi aprendido, percepções e fotos',
      description: 'Mais do que uma lista de tarefas, o ACTA é a memória viva do aprendizado. Registre o que a criança compreendeu, suas dificuldades superadas e adicione fotos dos cadernos, redações e projetos manuais.',
      tip: '💡 Todos os registros alimentam automaticamente a Linha do Tempo e os Dossiês de fim de ano da família.'
    },
    {
      tab: 'leituras',
      badge: 'Passo 5 de 6',
      icon: 'fa-solid fa-book-open-reader',
      title: '5. Formação Cultural: Leituras & Filmes',
      subtitle: 'A vida do espírito e o cultivo do belo em família',
      description: 'Separamos o estudo formal da formação cultural. Em **Leituras & Literatura** você registra os romances, clássicos, biografias e fábulas lidos. Em **Filmes & Cultura**, documente os grandes filmes e reflexões em família.',
      tip: '💡 Registre virtudes trabalhadas, frases marcantes e o impacto da história no coração da criança.'
    },
    {
      tab: 'casa',
      badge: 'Passo 6 de 6',
      icon: 'fa-solid fa-star',
      title: 'Tudo Pronto para Começar!',
      subtitle: 'Planeje com serenidade. Registre com profundidade.',
      description: 'Explore também o **Calendário** (para férias e datas da família), os **Passeios & Museus** e as **Avaliações Diagnósticas**. Se tiver qualquer dúvida, este guia estará sempre disponível no menu.',
      tip: '💡 Você pode reabrir este tour a qualquer momento clicando em "Guia & Como Usar" no menu lateral.'
    }
  ];

  const ActaTutorial = {
    /**
     * Inicializa o modal do tutorial no DOM
     */
    init: function() {
      if (document.getElementById('actaTutorialModal')) return;

      const modalHtml = `
        <div id="actaTutorialModal" class="fixed inset-0 z-50 bg-[#28302A]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto hidden transition-all duration-300">
          <div class="relative max-w-lg w-full bg-white border border-[#E8E2D5] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-fade-in">
            <!-- Botão Fechar -->
            <button 
              type="button" 
              onclick="ActaTutorial.closeTour()" 
              class="absolute top-5 right-5 text-[#8E9A8F] hover:text-[#28302A] p-2 rounded-full hover:bg-[#FAF7F0] transition" 
              title="Fechar guia"
            >
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>

            <!-- Cabeçalho do Card -->
            <div class="flex items-center space-x-3">
              <div id="tutorialIconBox" class="w-12 h-12 rounded-2xl bg-[#2F5233]/10 text-[#2F5233] flex items-center justify-center text-xl shrink-0">
                <i id="tutorialIcon" class="fa-solid fa-leaf"></i>
              </div>
              <div>
                <span id="tutorialBadge" class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF7F0] text-[#2F5233] border border-[#E8E2D5]">
                  Boas-Vindas
                </span>
                <h3 id="tutorialTitle" class="font-editorial-serif text-xl font-bold text-[#28302A] leading-tight mt-1">
                  Bem-vindo(a) ao ACTA
                </h3>
              </div>
            </div>

            <!-- Subtítulo e Descrição Principal -->
            <div class="space-y-3 text-xs sm:text-sm text-[#4A554D] leading-relaxed">
              <p id="tutorialSubtitle" class="font-semibold text-[#2F5233] text-xs sm:text-sm"></p>
              <div id="tutorialDescription" class="space-y-2"></div>
            </div>

            <!-- Caixinha de Dica Pedagógica -->
            <div class="p-3.5 bg-[#FAF7F0] border border-[#E8E2D5] rounded-2xl text-xs text-[#28302A] flex items-start space-x-2.5">
              <p id="tutorialTip" class="leading-relaxed"></p>
            </div>

            <!-- Rodapé: Indicadores de Progresso + Botões -->
            <div class="pt-2 border-t border-[#E8E2D5] flex items-center justify-between gap-3">
              <!-- Bolinhas Indicadoras (Dots) -->
              <div id="tutorialDots" class="flex items-center space-x-1.5">
                <!-- Populado dinamicamente -->
              </div>

              <!-- Botões de Ação -->
              <div class="flex items-center space-x-2">
                <button 
                  id="btnTutorialPrev" 
                  type="button" 
                  onclick="ActaTutorial.prevStep()" 
                  class="px-3.5 py-2 text-xs font-semibold text-[#667267] hover:text-[#28302A] hover:bg-[#FAF7F0] rounded-xl transition"
                >
                  Anterior
                </button>
                <button 
                  id="btnTutorialNext" 
                  type="button" 
                  onclick="ActaTutorial.nextStep()" 
                  class="px-5 py-2 text-xs font-bold text-white bg-[#2F5233] hover:bg-[#233d26] rounded-xl shadow-xs transition flex items-center space-x-1.5"
                >
                  <span>Próximo</span>
                  <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    /**
     * Inicia o tour a partir do primeiro passo
     */
    startTour: function() {
      this.init();
      currentStep = 0;
      this.renderStep();
      const modal = document.getElementById('actaTutorialModal');
      if (modal) modal.classList.remove('hidden');
    },

    /**
     * Fecha o tour e salva preferência
     */
    closeTour: function() {
      const modal = document.getElementById('actaTutorialModal');
      if (modal) modal.classList.add('hidden');

      const uid = window.ActaAuth ? window.ActaAuth.getUserUid() : null;
      if (uid) {
        localStorage.setItem(TOUR_STORAGE_KEY + uid, 'true');
      }
    },

    /**
     * Avança para o próximo passo
     */
    nextStep: function() {
      if (currentStep < STEPS.length - 1) {
        currentStep++;
        this.renderStep();
      } else {
        this.closeTour();
        if (window.ActaApp && typeof window.ActaApp.showToast === 'function') {
          window.ActaApp.showToast('Tour concluído! Você pode rever as dicas quando quiser pelo menu.');
        }
      }
    },

    /**
     * Volta para o passo anterior
     */
    prevStep: function() {
      if (currentStep > 0) {
        currentStep--;
        this.renderStep();
      }
    },

    /**
     * Renderiza o conteúdo do passo atual
     */
    renderStep: function() {
      const step = STEPS[currentStep];
      if (!step) return;

      // Troca a aba no ACTA em segundo plano para o usuário ver o módulo real
      if (step.tab && window.ActaApp && typeof window.ActaApp.switchTab === 'function') {
        window.ActaApp.switchTab(step.tab);
      }

      // Atualiza textos
      const badgeEl = document.getElementById('tutorialBadge');
      const iconEl = document.getElementById('tutorialIcon');
      const titleEl = document.getElementById('tutorialTitle');
      const subtitleEl = document.getElementById('tutorialSubtitle');
      const descEl = document.getElementById('tutorialDescription');
      const tipEl = document.getElementById('tutorialTip');
      const btnPrev = document.getElementById('btnTutorialPrev');
      const btnNext = document.getElementById('btnTutorialNext');
      const dotsContainer = document.getElementById('tutorialDots');

      if (badgeEl) badgeEl.textContent = step.badge;
      if (iconEl) iconEl.className = step.icon;
      if (titleEl) titleEl.textContent = step.title;
      if (subtitleEl) subtitleEl.textContent = step.subtitle;
      if (tipEl) tipEl.textContent = step.tip;

      // Formata descrição com negrito
      if (descEl) {
        const formattedDesc = step.description.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        descEl.innerHTML = `<p>${formattedDesc}</p>`;
      }

      // Estado do botão anterior
      if (btnPrev) {
        btnPrev.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
      }

      // Estado do botão próximo / concluir
      if (btnNext) {
        if (currentStep === STEPS.length - 1) {
          btnNext.innerHTML = '<span>Começar a Usar</span> <i class="fa-solid fa-check text-[10px]"></i>';
          btnNext.classList.remove('bg-[#2F5233]');
          btnNext.classList.add('bg-[#1E3A5F]'); // Destaque final elegante
        } else {
          btnNext.innerHTML = '<span>Próximo</span> <i class="fa-solid fa-arrow-right text-[10px]"></i>';
          btnNext.classList.remove('bg-[#1E3A5F]');
          btnNext.classList.add('bg-[#2F5233]');
        }
      }

      // Renderiza as bolinhas de progresso
      if (dotsContainer) {
        dotsContainer.innerHTML = STEPS.map((_, idx) => `
          <button 
            type="button" 
            onclick="ActaTutorial.goToStep(${idx})" 
            class="w-2 h-2 rounded-full transition-all ${idx === currentStep ? 'w-5 bg-[#2F5233]' : 'bg-[#E8E2D5] hover:bg-[#8E9A8F]'}"
            title="Ir para passo ${idx + 1}"
          ></button>
        `).join('');
      }
    },

    /**
     * Salta diretamente para um passo
     */
    goToStep: function(index) {
      if (index >= 0 && index < STEPS.length) {
        currentStep = index;
        this.renderStep();
      }
    },

    /**
     * Verifica se deve sugerir o tour automaticamente para usuário novo
     */
    checkAutoStart: function(uid) {
      if (!uid) return;
      const dismissed = localStorage.getItem(TOUR_STORAGE_KEY + uid);
      if (!dismissed) {
        // Aguarda 1 segundo após login/carregamento inicial para abrir suavemente
        setTimeout(() => {
          this.startTour();
        }, 1200);
      }
    }
  };

  // Inicializa quando a página estiver carregada
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      ActaTutorial.init();
    });
  } else {
    ActaTutorial.init();
  }

  window.ActaTutorial = ActaTutorial;
})(window);
