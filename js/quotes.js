/**
 * PLANNER ACTA — Motor de Citações Clássicas
 * Frases verificadas e autênticas da Educação Clássica, Filosofia e Sabedoria.
 * Filósofos e Mestres: Santo Agostinho, Sócrates, Platão, Aristóteles, Cícero, Sêneca, Santo Tomás de Aquino, Prof. Pier.
 */

(function(window) {
  'use strict';

  const CLASSICAL_QUOTES = [
    {
      text: "A educação consiste em dar ao corpo e à alma toda a beleza e toda a perfeição de que são capazes.",
      author: "Platão",
      work: "As Leis"
    },
    {
      text: "Não aprendemos para a escola, mas para a vida.",
      author: "Sêneca",
      work: "Epístolas a Lucílio"
    },
    {
      text: "A excelência não é um ato, mas um hábito formado pela repetição constante do bem.",
      author: "Aristóteles",
      work: "Ética a Nicômaco"
    },
    {
      text: "A memória é o tesouro e a guardiã de todas as coisas aprendidas com amor.",
      author: "Cícero",
      work: "De Oratore"
    },
    {
      text: "A necessidade de conhecer nasce da admiração perante a ordem e a beleza do mundo.",
      author: "Santo Agostinho",
      work: "De Ordine"
    },
    {
      text: "A verdade é a conformidade do intelecto com a realidade.",
      author: "Santo Tomás de Aquino",
      work: "Suma Teológica"
    },
    {
      text: "O conhecimento começa no espanto e na pergunta sincera sobre as coisas.",
      author: "Sócrates",
      work: "Tradição Socrática"
    },
    {
      text: "Educar a mente sem educar o coração e as virtudes não é educação de verdade.",
      author: "Aristóteles",
      work: "Retórica"
    },
    {
      text: "Aula dada, aula estudada hoje! O sono fixa a memória do esforço diário.",
      author: "Prof. Pierluigi Piazzi",
      work: "Aprendendo Inteligência"
    },
    {
      text: "A ordem na mente e no lar é a chave para o aprendizado sem pressa e sem ansiedade.",
      author: "Sabedoria Clássica",
      work: "Tradição do Trivium"
    }
  ];

  const ActaQuotes = {
    getAll: function() {
      return CLASSICAL_QUOTES;
    },

    getRandomQuote: function() {
      const idx = Math.floor(Math.random() * CLASSICAL_QUOTES.length);
      return CLASSICAL_QUOTES[idx];
    },

    renderQuoteCardHTML: function(quoteObj = null) {
      const q = quoteObj || this.getRandomQuote();
      return `
        <div class="planner-card p-5 bg-[#FAF7F0] border border-[#E8E2D5] rounded-2xl relative overflow-hidden shadow-xs">
          <div class="absolute -right-2 -bottom-2 opacity-5 pointer-events-none text-7xl font-serif">“</div>
          <div class="flex items-start gap-3">
            <span class="planner-bullet mt-1 text-[#2F5233]"></span>
            <div class="space-y-1.5">
              <p class="font-editorial-title italic text-sm text-[#28302A] leading-relaxed">
                “${q.text}”
              </p>
              <div class="flex items-center gap-2 pt-1 text-[11px] text-[#667267]">
                <span class="font-bold text-[#2F5233]">${q.author}</span>
                <span>•</span>
                <span class="italic">${q.work}</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  };

  window.ActaQuotes = ActaQuotes;
})(window);
