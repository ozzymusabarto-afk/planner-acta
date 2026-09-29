/**
 * PLANNER ACTA — Módulos de Formação Cultural
 * 1. Leituras & Literatura (Estante de Biblioteca Digital)
 * 2. Filmes & Cultura (Cinemateca da Família)
 * 
 * Filosofia: "A pessoa registra o que aconteceu e o sistema organiza o resto."
 * Registra a experiência estética, virtudes morais e impacto formativo da criança.
 */

(function(window) {
  'use strict';

  const ActaCulture = {
    // Categorias de Literatura
    READING_CATEGORIES: [
      { id: 'Ficção', label: 'Ficção', icon: 'fa-book-open', color: '#3D5A80' },
      { id: 'Aventura', label: 'Aventura', icon: 'fa-compass', color: '#1E3A5F' },
      { id: 'Fantasia', label: 'Fantasia', icon: 'fa-wand-magic-sparkles', color: '#4A2E65' },
      { id: 'Fábulas', label: 'Fábulas', icon: 'fa-feather', color: '#A95337' },
      { id: 'Contos', label: 'Contos', icon: 'fa-scroll', color: '#8C472E' },
      { id: 'Romance', label: 'Romance', icon: 'fa-heart', color: '#9E3D52' },
      { id: 'Clássicos', label: 'Clássicos', icon: 'fa-landmark', color: '#2F5233' },
      { id: 'Poesia', label: 'Poesia', icon: 'fa-pen-fancy', color: '#6A4C93' },
      { id: 'Biografia', label: 'Biografia', icon: 'fa-user-pen', color: '#5C4033' },
      { id: 'História', label: 'História', icon: 'fa-shield-halved', color: '#7A3E26' },
      { id: 'Mistério', label: 'Mistério', icon: 'fa-magnifying-glass', color: '#2B3A42' },
      { id: 'Viagem/Exploração', label: 'Viagem / Exploração', icon: 'fa-map-location-dot', color: '#2C5E43' },
      { id: 'Natureza', label: 'Natureza', icon: 'fa-leaf', color: '#3F6838' },
      { id: 'Outros', label: 'Outros', icon: 'fa-bookmark', color: '#667267' }
    ],

    // Categorias de Filmes
    MOVIE_CATEGORIES: [
      { id: 'Animação', label: 'Animação', icon: 'fa-palette' },
      { id: 'Aventura', label: 'Aventura', icon: 'fa-compass' },
      { id: 'Fantasia', label: 'Fantasia', icon: 'fa-wand-magic-sparkles' },
      { id: 'História', label: 'História', icon: 'fa-landmark' },
      { id: 'Biografia', label: 'Biografia', icon: 'fa-user-tie' },
      { id: 'Natureza', label: 'Natureza / Documentário', icon: 'fa-mountain-sun' },
      { id: 'Ficção', label: 'Ficção', icon: 'fa-rocket' },
      { id: 'Comédia', label: 'Comédia', icon: 'fa-face-laugh-beam' },
      { id: 'Drama', label: 'Drama', icon: 'fa-masks-theater' },
      { id: 'Clássico', label: 'Clássico', icon: 'fa-film' },
      { id: 'Outro', label: 'Outro', icon: 'fa-clapperboard' }
    ],

    // Virtudes e Bons Exemplos
    VIRTUES_LIST: [
      'Coragem',
      'Honestidade',
      'Amizade',
      'Generosidade',
      'Perseverança',
      'Justiça',
      'Prudência',
      'Responsabilidade',
      'Lealdade',
      'Humildade',
      'Paciência',
      'Respeito',
      'Amor ao próximo',
      'Gratidão',
      'Trabalho com carinho',
      'Autodomínio'
    ],

    // Opções de Experiência de Leitura
    READING_EXPERIENCES: [
      'Leu com autonomia',
      'Leu com alguma ajuda',
      'Leitura compartilhada',
      'Foi muito envolvente',
      'Despertou curiosidade',
      'Teve dificuldade',
      'Gostaria de ler outro livro parecido'
    ],

    // Opções de Experiência do Filme
    MOVIE_EXPERIENCES: [
      'Gostei muito',
      'Foi interessante',
      'Despertou curiosidade',
      'Quero conhecer mais sobre o assunto',
      'Gostaria de assistir novamente',
      'Momento especial em família'
    ],

    // Estado local de filtros
    readingFilters: {
      childId: 'all',
      category: 'all',
      status: 'all'
    },

    movieFilters: {
      childId: 'all',
      category: 'all'
    },

    // =========================================================================
    // 1. ESTANTE DE BIBLIOTECA DIGITAL (LEITURAS & LITERATURA)
    // =========================================================================
    renderBookshelfHTML: function() {
      const storage = window.ActaStorage;
      if (!storage) return '';

      const readings = storage.getReadings();
      const people = storage.getPeople();

      // Aplicar filtros
      let filtered = readings;
      if (this.readingFilters.childId !== 'all') {
        filtered = filtered.filter(r => r.personId === this.readingFilters.childId);
      }
      if (this.readingFilters.category !== 'all') {
        filtered = filtered.filter(r => r.category === this.readingFilters.category);
      }
      if (this.readingFilters.status !== 'all') {
        filtered = filtered.filter(r => (r.status || 'concluido') === this.readingFilters.status);
      }

      // Contadores
      const totalLidos = readings.filter(r => (r.status || 'concluido') === 'concluido').length;
      const totalAndamento = readings.filter(r => r.status === 'em_andamento').length;

      // Agrupamento por categorias para organizar as prateleiras
      const categoriesInUse = [];
      this.READING_CATEGORIES.forEach(cat => {
        const books = filtered.filter(r => r.category === cat.id);
        if (books.length > 0) {
          categoriesInUse.push({ cat, books });
        }
      });

      // Livros sem categoria definida ou em categorias personalizadas
      const otherBooks = filtered.filter(r => !this.READING_CATEGORIES.some(c => c.id === r.category));
      if (otherBooks.length > 0) {
        categoriesInUse.push({
          cat: { id: 'Outros', label: 'Outras Leituras', icon: 'fa-bookmark', color: '#667267' },
          books: otherBooks
        });
      }

      let shelvesHTML = '';
      if (categoriesInUse.length === 0) {
        shelvesHTML = `
          <div class="planner-card p-10 text-center text-[#667267] bg-white border border-[#E8E2D5] shadow-xs rounded-3xl">
            <i class="fa-solid fa-book-open-reader text-4xl text-[#8E9A8F] mb-3"></i>
            <h4 class="font-editorial-serif text-base font-bold text-[#28302A]">Sua biblioteca literária está aguardando</h4>
            <p class="text-xs text-[#667267] mt-1 max-w-md mx-auto">
              Registre os contos, aventuras, romances e clássicos lidos pelas crianças. Os livros aparecerão em pé nas prateleiras com lombadas exclusivas.
            </p>
            <button 
              type="button" 
              onclick="ActaCulture.openNewReadingModal()"
              class="hero-btn-green text-xs font-semibold px-5 py-2.5 rounded-full shadow-xs inline-flex items-center gap-2 mt-4"
            >
              <i class="fa-solid fa-plus text-[10px]"></i>
              <span>+ Registrar nova leitura</span>
            </button>
          </div>
        `;
      } else {
        shelvesHTML = categoriesInUse.map(({ cat, books }) => `
          <div class="space-y-2 pt-2">
            <!-- Cabeçalho da Prateleira com Nicho -->
            <div class="flex items-center justify-between px-2">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg flex items-center justify-center text-xs text-white shadow-xs" style="background-color: ${cat.color};">
                  <i class="fa-solid ${cat.icon} text-[11px]"></i>
                </span>
                <h3 class="font-editorial-serif text-sm sm:text-base font-bold text-[#28302A] tracking-wide">
                  ${cat.label.toUpperCase()}
                </h3>
                <span class="text-[10px] font-semibold text-[#8E9A8F] bg-[#FAF7F0] px-2 py-0.5 rounded-full border border-[#E8E2D5]">
                  ${books.length} ${books.length === 1 ? 'obra' : 'obras'}
                </span>
              </div>
            </div>

            <!-- Prateleira de Madeira Visual com Livros em Pé -->
            <div class="relative bg-gradient-to-b from-[#F9F5EC] to-[#EFE7D8] p-4 sm:p-5 pt-8 rounded-2xl border border-[#D8CEBC] shadow-inner">
              
              <!-- Fundo de Madeira Sutil da Estante -->
              <div class="flex flex-wrap items-end gap-3 sm:gap-4 min-h-[160px] pb-1 z-10 relative">
                ${books.map((b, idx) => this.renderSpineHTML(b, idx)).join('')}
              </div>

              <!-- Base da Prateleira (Viga de Madeira Maciça Nobre) -->
              <div class="w-full h-4 sm:h-5 bg-gradient-to-r from-[#8C5E35] via-[#A87444] to-[#7A502B] rounded-b-md shadow-md border-t border-[#BA8B5A] relative">
                <div class="absolute inset-x-0 bottom-0 h-1 bg-black/20"></div>
                <div class="absolute -left-1 -bottom-1.5 w-3 h-3 bg-[#5C3B1F] rounded-sm shadow-xs"></div>
                <div class="absolute -right-1 -bottom-1.5 w-3 h-3 bg-[#5C3B1F] rounded-sm shadow-xs"></div>
              </div>

            </div>
          </div>
        `).join('');
      }

      return `
        <!-- Cabeçalho da Área: Leituras & Literatura -->
        <div class="planner-card p-5 sm:p-6 bg-white border border-[#E8E2D5] rounded-3xl shadow-xs space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2.5">
                <span class="theme-title-badge w-8 h-8 rounded-xl flex items-center justify-center text-base bg-[#FAF7F0] border border-[#E8E2D5] shadow-xs">
                  📚
                </span>
                <div>
                  <h2 class="font-editorial-serif text-xl sm:text-2xl font-bold text-[#28302A] tracking-tight">
                    Leituras & Literatura
                  </h2>
                  <p class="text-xs text-[#667267]">A biblioteca viva e pessoal da formação literária dos seus filhos.</p>
                </div>
              </div>
            </div>

            <!-- Botão de Ação Principal -->
            <button 
              type="button" 
              onclick="ActaCulture.openNewReadingModal()"
              class="hero-btn-green text-xs font-semibold px-5 py-2.5 rounded-full shadow-sm flex items-center justify-center gap-2 transition transform active:scale-95"
            >
              <i class="fa-solid fa-plus text-[11px]"></i>
              <span>+ Registrar nova leitura</span>
            </button>
          </div>

          <!-- Barra de Informações & Filtros -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E8E2D5]">
            <!-- Indicadores Quantitativos & Modo de Exibição -->
            <div class="flex flex-wrap items-center gap-2 text-xs">
              <span class="px-3 py-1 bg-[#EBF3ED] text-[#2F5233] font-bold rounded-full border border-[#D5E5D8]">
                📚 ${totalLidos} ${totalLidos === 1 ? 'livro lido' : 'livros lidos'}
              </span>
              ${totalAndamento > 0 ? `
                <span class="px-3 py-1 bg-[#FDF5E6] text-[#A95337] font-bold rounded-full border border-[#F5E6CC]">
                  ⏳ ${totalAndamento} em andamento
                </span>
              ` : ''}

              <!-- Alternador de Visão: Lombadas vs Lista Completa -->
              <div class="flex items-center bg-[#FAF7F0] border border-[#E8E2D5] rounded-full p-0.5 shadow-2xs ml-1">
                <button 
                  type="button" 
                  onclick="ActaCulture.setReadingViewMode('spines')" 
                  class="px-2.5 py-1 rounded-full text-xs font-semibold transition ${this.readingViewMode !== 'cards' ? 'bg-[#2F5233] text-white shadow-2xs' : 'text-[#667267] hover:text-[#28302A]'}"
                  title="Ver livros em pé na estante de madeira"
                >
                  <i class="fa-solid fa-book-bookmark text-[10px] mr-1"></i> Lombadas
                </button>
                <button 
                  type="button" 
                  onclick="ActaCulture.setReadingViewMode('cards')" 
                  class="px-2.5 py-1 rounded-full text-xs font-semibold transition ${this.readingViewMode === 'cards' ? 'bg-[#2F5233] text-white shadow-2xs' : 'text-[#667267] hover:text-[#28302A]'}"
                  title="Ver lista de livros com títulos completos e capas"
                >
                  <i class="fa-solid fa-table-cells-large text-[10px] mr-1"></i> Lista Completa
                </button>
              </div>
            </div>

            <!-- Filtros Interativos -->
            <div class="flex flex-wrap items-center gap-2">
              <!-- Filtro de Criança -->
              <select 
                onchange="ActaCulture.setReadingFilter('childId', this.value)"
                class="text-xs font-medium px-3 py-1.5 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl text-[#28302A] focus:outline-none"
              >
                <option value="all">Todas as crianças</option>
                ${people.map(p => `
                  <option value="${p.id}" ${this.readingFilters.childId === p.id ? 'selected' : ''}>${p.name}</option>
                `).join('')}
              </select>

              <!-- Filtro de Gênero -->
              <select 
                onchange="ActaCulture.setReadingFilter('category', this.value)"
                class="text-xs font-medium px-3 py-1.5 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl text-[#28302A] focus:outline-none"
              >
                <option value="all">Todos os gêneros</option>
                ${this.READING_CATEGORIES.map(c => `
                  <option value="${c.id}" ${this.readingFilters.category === c.id ? 'selected' : ''}>${c.label}</option>
                `).join('')}
              </select>

              <!-- Filtro de Status -->
              <select 
                onchange="ActaCulture.setReadingFilter('status', this.value)"
                class="text-xs font-medium px-3 py-1.5 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl text-[#28302A] focus:outline-none"
              >
                <option value="all">Todos os status</option>
                <option value="concluido" ${this.readingFilters.status === 'concluido' ? 'selected' : ''}>Concluídos</option>
                <option value="em_andamento" ${this.readingFilters.status === 'em_andamento' ? 'selected' : ''}>Em andamento</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Seção das Leituras (Lombadas ou Cartões Completos) -->
        <div class="space-y-6">
          ${this.readingViewMode === 'cards' ? this.renderReadingCardsHTML(filtered) : shelvesHTML}
        </div>
      `;
    },

    // Renderiza uma lombada de livro individual em pé na estante
    renderSpineHTML: function(book, idx) {
      const palette = ['#2F5233', '#1E3A5F', '#A95337', '#8C472E', '#4A2E65', '#3D6B78', '#5C4033', '#2B3A42'];
      const spineColor = book.coverColor || palette[idx % palette.length];
      const isConcluido = (book.status || 'concluido') === 'concluido';

      // Alturas e espessuras ligeiramente variáveis para aspecto natural e imersivo
      const heights = ['h-44 sm:h-52', 'h-48 sm:h-56', 'h-46 sm:h-54', 'h-42 sm:h-50'];
      const widths = ['w-11 sm:w-14', 'w-12 sm:w-15', 'w-13 sm:w-16'];
      const hClass = heights[idx % heights.length];
      const wClass = widths[idx % widths.length];

      return `
        <div 
          onclick="ActaCulture.openReadingDetails('${book.id}')"
          class="group relative ${wClass} ${hClass} rounded-t-sm shadow-md hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2 group-hover:scale-105 cursor-pointer flex flex-col justify-between items-center py-2 px-1 text-white select-none border-l border-t border-white/20 border-r border-black/30"
          style="background: linear-gradient(90deg, rgba(255,255,255,0.18) 0%, ${spineColor} 18%, ${spineColor} 82%, rgba(0,0,0,0.35) 100%);"
          title="${book.title} — ${book.author || 'Autor desconhecido'} (${book.personName})"
        >
          <!-- Nervuras Douradas Decorativas da Lombada -->
          <div class="w-full h-0.5 bg-yellow-200/50 shadow-xs mb-1"></div>

          <!-- Título Vertical da Lombada Autêntica -->
          <div class="flex-1 flex items-center justify-center overflow-hidden my-1 w-full" style="writing-mode: vertical-rl; transform: rotate(180deg);">
            <span 
              class="text-[10px] sm:text-[11px] font-editorial-serif font-bold tracking-wider uppercase text-yellow-100/95 whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-xs max-h-[145px]" 
              title="${book.title}"
            >
              ${book.title}
            </span>
          </div>

          <!-- Detalhes da Base da Lombada -->
          <div class="w-full space-y-1 text-center">
            <div class="w-full h-0.5 bg-yellow-200/50 shadow-xs"></div>
            <!-- Marcador de Leitor ou Status -->
            <div class="flex items-center justify-center">
              ${isConcluido ? `
                <span class="text-[9px] text-yellow-300 drop-shadow-xs" title="Obra concluída">
                  <i class="fa-solid fa-bookmark"></i>
                </span>
              ` : `
                <span class="text-[9px] text-orange-200 animate-pulse" title="Lendo agora">
                  <i class="fa-regular fa-clock"></i>
                </span>
              `}
            </div>
          </div>

          <!-- Balão com Miniatura ao Passar o Mouse (Tooltip Acolhedor) -->
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
            <div class="bg-[#28302A] text-white text-[11px] py-1.5 px-3 rounded-xl shadow-xl whitespace-nowrap space-y-0.5 border border-white/20">
              <div class="font-bold text-yellow-200">${book.title}</div>
              <div class="text-[10px] text-[#C2C9C3]">${book.author ? `Por ${book.author}` : 'Autor não informado'} • Leitor(a): <strong class="text-white">${book.personName}</strong></div>
              ${book.rating ? `<div class="text-rose-400 text-[9px]">${'❤️'.repeat(book.rating)}</div>` : ''}
              <div class="text-[9px] text-yellow-300/80 pt-0.5">Clique para ver ficha completa e editar</div>
            </div>
            <div class="w-2 h-2 bg-[#28302A] rotate-45 -mt-1"></div>
          </div>
        </div>
      `;
    },

    // =========================================================================
    // 2. CINEMATECA DA FAMÍLIA (FILMES & CULTURA)
    // =========================================================================
    renderCinematecaHTML: function() {
      const storage = window.ActaStorage;
      if (!storage) return '';

      const movies = storage.getMovies();
      const people = storage.getPeople();

      // Aplicar filtros
      let filtered = movies;
      if (this.movieFilters.childId !== 'all') {
        filtered = filtered.filter(m => m.personId === this.movieFilters.childId);
      }
      if (this.movieFilters.category !== 'all') {
        filtered = filtered.filter(m => m.category === this.movieFilters.category);
      }

      let moviesListHTML = '';
      if (filtered.length === 0) {
        moviesListHTML = `
          <div class="planner-card p-10 text-center text-[#667267] bg-white border border-[#E8E2D5] shadow-xs rounded-3xl col-span-full">
            <i class="fa-solid fa-film text-4xl text-[#8E9A8F] mb-3"></i>
            <h4 class="font-editorial-serif text-base font-bold text-[#28302A]">Sua cinemateca está vazia</h4>
            <p class="text-xs text-[#667267] mt-1 max-w-md mx-auto">
              Registre os filmes, animações, clássicos e documentários assistidos com carinho em família, documentando reflexões e bons exemplos.
            </p>
            <button 
              type="button" 
              onclick="ActaCulture.openNewMovieModal()"
              class="hero-btn-terracotta text-xs font-semibold px-5 py-2.5 rounded-full shadow-xs inline-flex items-center gap-2 mt-4"
            >
              <i class="fa-solid fa-plus text-[10px]"></i>
              <span>+ Registrar filme</span>
            </button>
          </div>
        `;
      } else {
        moviesListHTML = filtered.map(m => this.renderMovieCardHTML(m)).join('');
      }

      return `
        <!-- Cabeçalho da Área: Filmes & Cultura -->
        <div class="planner-card p-5 sm:p-6 bg-white border border-[#E8E2D5] rounded-3xl shadow-xs space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="flex items-center gap-2.5">
                <span class="theme-title-badge w-8 h-8 rounded-xl flex items-center justify-center text-base bg-[#FAF7F0] border border-[#E8E2D5] shadow-xs">
                  🎬
                </span>
                <div>
                  <h2 class="font-editorial-serif text-xl sm:text-2xl font-bold text-[#28302A] tracking-tight">
                    Cinemateca da Família
                  </h2>
                  <p class="text-xs text-[#667267]">Registros de filmes, animações clássicas e documentários como experiência cultural viva.</p>
                </div>
              </div>
            </div>

            <!-- Botão de Ação Principal -->
            <button 
              type="button" 
              onclick="ActaCulture.openNewMovieModal()"
              class="hero-btn-terracotta text-xs font-semibold px-5 py-2.5 rounded-full shadow-sm flex items-center justify-center gap-2 transition transform active:scale-95"
            >
              <i class="fa-solid fa-plus text-[11px]"></i>
              <span>+ Registrar filme</span>
            </button>
          </div>

          <!-- Barra de Informações & Filtros -->
          <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E8E2D5]">
            <div class="flex items-center gap-2 text-xs">
              <span class="px-3 py-1 bg-[#F9F1E6] text-[#A95337] font-bold rounded-full border border-[#ECD9C5]">
                🎬 ${movies.length} ${movies.length === 1 ? 'filme registrado' : 'filmes registrados'}
              </span>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <!-- Filtro de Criança -->
              <select 
                onchange="ActaCulture.setMovieFilter('childId', this.value)"
                class="text-xs font-medium px-3 py-1.5 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl text-[#28302A] focus:outline-none"
              >
                <option value="all">Todas as crianças</option>
                ${people.map(p => `
                  <option value="${p.id}" ${this.movieFilters.childId === p.id ? 'selected' : ''}>${p.name}</option>
                `).join('')}
              </select>

              <!-- Filtro de Categoria -->
              <select 
                onchange="ActaCulture.setMovieFilter('category', this.value)"
                class="text-xs font-medium px-3 py-1.5 bg-[#FAF7F0] border border-[#E8E2D5] rounded-xl text-[#28302A] focus:outline-none"
              >
                <option value="all">Todos os gêneros</option>
                ${this.MOVIE_CATEGORIES.map(c => `
                  <option value="${c.id}" ${this.movieFilters.category === c.id ? 'selected' : ''}>${c.label}</option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- Grade de Cartazes de Filmes (Estilo Cartaz Cinematográfico) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          ${moviesListHTML}
        </div>
      `;
    },

    // Renderiza o card individual de um filme
    renderMovieCardHTML: function(movie) {
      const dateDisplay = movie.date ? movie.date.split('-').reverse().join('/') : 'Data não informada';
      const virtues = movie.virtues || [];

      return `
        <div 
          onclick="ActaCulture.openMovieDetails('${movie.id}')"
          class="acta-card bg-white border border-[#E8E2D5] hover:border-[#A95337] rounded-3xl p-4 flex flex-col justify-between gap-3 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer group"
        >
          <!-- Cartaz / Cabeçalho do Filme -->
          <div class="relative w-full h-44 rounded-2xl overflow-hidden bg-gradient-to-tr from-[#28302A] via-[#3F4841] to-[#1E2520] flex items-center justify-center text-white border border-black/10">
            ${movie.posterImg ? `
              <img src="${movie.posterImg}" alt="${movie.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
            ` : `
              <div class="text-center p-4 space-y-1">
                <i class="fa-solid fa-clapperboard text-3xl text-yellow-300/80 mb-1"></i>
                <h4 class="font-editorial-serif font-bold text-sm tracking-wide text-white/95 line-clamp-2">${movie.title}</h4>
                <p class="text-[10px] text-white/70">${movie.director ? `Dir: ${movie.director}` : ''} ${movie.year ? `(${movie.year})` : ''}</p>
              </div>
            `}

            <!-- Badges Sobrepostos -->
            <div class="absolute top-2.5 left-2.5">
              <span class="text-[9.5px] font-bold bg-black/60 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-full border border-white/20">
                ${movie.category || 'Cultura'}
              </span>
            </div>

            <div class="absolute top-2.5 right-2.5">
              <span class="text-[9.5px] font-semibold bg-white/90 text-[#28302A] px-2 py-0.5 rounded-full shadow-xs">
                ${movie.personName || 'Família'}
              </span>
            </div>
          </div>

          <!-- Informações e Reflexão Rápida -->
          <div class="space-y-1.5 flex-1 flex flex-col justify-between">
            <div>
              <h3 class="font-editorial-serif text-base font-bold text-[#28302A] group-hover:text-[#A95337] transition leading-tight">
                ${movie.title}
              </h3>
              <p class="text-[11px] text-[#667267] line-clamp-2 mt-1">
                ${movie.summary || movie.reflection || 'Sem resumo registrado.'}
              </p>
            </div>

            <!-- Virtudes em Pílulas -->
            ${virtues.length > 0 ? `
              <div class="flex flex-wrap gap-1 pt-1">
                ${virtues.slice(0, 3).map(v => `
                  <span class="text-[9px] font-medium bg-[#FAF7F0] text-[#7A3E26] px-2 py-0.5 rounded-md border border-[#E8E2D5]">
                    ★ ${v}
                  </span>
                `).join('')}
                ${virtues.length > 3 ? `<span class="text-[9px] text-[#8E9A8F]">+${virtues.length - 3}</span>` : ''}
              </div>
            ` : ''}

            <!-- Rodapé do Card -->
            <div class="pt-2 border-t border-[#F0EBE1] flex items-center justify-between text-[10px] text-[#8E9A8F]">
              <span><i class="fa-regular fa-calendar text-[9px]"></i> ${dateDisplay}</span>
              ${movie.rating ? `<span class="text-rose-500 font-bold">${'❤️'.repeat(movie.rating)}</span>` : ''}
            </div>
          </div>
        </div>
      `;
    },

    readingViewMode: 'spines',

    setReadingViewMode: function(mode) {
      this.readingViewMode = mode;
      const container = document.getElementById('tab-leituras');
      if (container) container.innerHTML = this.renderBookshelfHTML();
    },

    renderReadingCardsHTML: function(filtered) {
      if (!filtered || filtered.length === 0) {
        return `
          <div class="planner-card p-10 text-center text-[#667267] bg-white border border-[#E8E2D5] shadow-xs rounded-3xl">
            <i class="fa-solid fa-book-open-reader text-4xl text-[#8E9A8F] mb-3"></i>
            <h4 class="font-editorial-serif text-base font-bold text-[#28302A]">Nenhuma obra encontrada</h4>
            <p class="text-xs text-[#667267] mt-1">Ajuste os filtros acima ou cadastre uma nova leitura.</p>
          </div>
        `;
      }

      return `
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${filtered.map(book => {
            const isConcluido = (book.status || 'concluido') === 'concluido';
            return `
              <div class="acta-card p-4 sm:p-5 bg-white border border-[#E8E2D5] hover:border-[#2F5233]/40 rounded-2xl shadow-xs transition flex flex-col justify-between gap-3">
                <div class="flex items-start gap-3">
                  <div class="w-14 h-20 rounded-lg shadow-sm flex flex-col justify-between p-2 text-white shrink-0 border border-white/20" style="background: linear-gradient(135deg, ${book.coverColor || '#2F5233'}, #1B2E1D);">
                    <span class="text-[7px] font-bold text-yellow-200 tracking-wider">ACTA</span>
                    <span class="text-[8px] font-bold font-editorial-serif line-clamp-2 leading-tight">${book.title}</span>
                    <span class="text-[6px] text-white/70 truncate">${book.category || ''}</span>
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="text-[10px] font-bold bg-[#EBF3ED] text-[#2F5233] px-2 py-0.5 rounded-full">${book.category || 'Geral'}</span>
                      <span class="text-[10px] text-[#667267] font-medium">• ${book.personName}</span>
                    </div>
                    <h4 class="font-editorial-serif text-sm font-bold text-[#28302A] mt-1 leading-snug break-words" title="${book.title}">${book.title}</h4>
                    <p class="text-xs text-[#667267] mt-0.5">${book.author ? 'Por ' + book.author : 'Autor não informado'}</p>
                    ${book.rating ? `<div class="text-rose-500 text-[10px] mt-1">${'❤️'.repeat(book.rating)}</div>` : ''}
                  </div>
                </div>
                <div class="pt-2.5 border-t border-[#F0ECE4] flex items-center justify-between">
                  <span class="text-[11px] font-semibold ${isConcluido ? 'text-[#2F5233]' : 'text-amber-700'}">
                    ${isConcluido ? '✅ Concluído' : '📖 Lendo'}
                  </span>
                  <div class="flex items-center gap-1.5">
                    <button 
                      type="button" 
                      onclick="ActaCulture.openEditReadingModal('${book.id}')" 
                      class="text-[11px] font-bold px-3 py-1 rounded-full bg-[#FAF7F0] border border-[#2F5233]/30 text-[#2F5233] hover:bg-[#EBF3ED] transition flex items-center gap-1"
                      title="Editar dados desta leitura"
                    >
                      <i class="fa-solid fa-pen-to-square text-[10px]"></i>
                      <span>Editar</span>
                    </button>
                    <button 
                      type="button" 
                      onclick="ActaCulture.openReadingDetails('${book.id}')" 
                      class="text-[11px] font-medium px-3 py-1 rounded-full bg-white border border-[#E8E2D5] text-[#28302A] hover:bg-[#FAF7F0] transition"
                      title="Ver ficha completa"
                    >
                      Ver Ficha
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    },

    togglePill: function(btn) {
      if (!btn) return;
      const isActive = btn.classList.contains('acta-pill-active');
      const isVirtue = btn.dataset.group && btn.dataset.group.toLowerCase().includes('virtue');
      
      if (isActive) {
        btn.classList.remove('acta-pill-active');
        btn.classList.remove('bg-[#2F5233]', 'bg-[#1E3A5F]', 'bg-[#A95337]', 'text-white', 'border-[#2F5233]', 'border-[#1E3A5F]', 'border-[#A95337]', 'shadow-xs', 'font-bold');
        btn.classList.add('bg-[#FAF7F0]', 'text-[#667267]', 'border-[#E8E2D5]', 'font-medium');
        const check = btn.querySelector('.pill-check');
        if (check) check.remove();
      } else {
        btn.classList.add('acta-pill-active');
        btn.classList.remove('bg-[#FAF7F0]', 'text-[#667267]', 'border-[#E8E2D5]', 'font-medium');
        const activeBg = isVirtue ? 'bg-[#2F5233]' : 'bg-[#1E3A5F]';
        const activeBorder = isVirtue ? 'border-[#2F5233]' : 'border-[#1E3A5F]';
        btn.classList.add(activeBg, 'text-white', activeBorder, 'shadow-xs', 'font-bold');
        if (!btn.querySelector('.pill-check')) {
          const check = document.createElement('span');
          check.className = 'pill-check text-[10px] font-bold mr-0.5';
          check.textContent = '✓';
          btn.prepend(check);
        }
      }
    },

    // =========================================================================
    // 3. MODAIS E FORMULÁRIOS
    // =========================================================================
    setReadingFilter: function(key, val) {
      this.readingFilters[key] = val;
      const container = document.getElementById('tab-leituras');
      if (container) container.innerHTML = this.renderBookshelfHTML();
    },

    setMovieFilter: function(key, val) {
      this.movieFilters[key] = val;
      const container = document.getElementById('tab-filmes');
      if (container) container.innerHTML = this.renderCinematecaHTML();
    },

    // ABRIR FORMULÁRIO DE NOVA LEITURA
    openNewReadingModal: function() {
      const storage = window.ActaStorage;
      if (!storage) return;

      const people = storage.getPeople();
      const activePerson = storage.getActivePerson();

      // Reset ID de edição
      const idEl = document.getElementById('editReadingId');
      if (idEl) idEl.value = '';

      const modalTitleEl = document.getElementById('modalNewReadingTitle');
      if (modalTitleEl) modalTitleEl.textContent = 'Registrar Leitura & Literatura';

      const modalBtnEl = document.getElementById('modalNewReadingBtn');
      if (modalBtnEl) modalBtnEl.textContent = 'Guardar na Estante';

      // Criança
      const childSelect = document.getElementById('readingChildSelect');
      if (childSelect) {
        childSelect.innerHTML = people.map(p => `
          <option value="${p.id}" ${activePerson && activePerson.id === p.id ? 'selected' : ''}>${p.name}</option>
        `).join('');
      }

      // Categorias
      const catSelect = document.getElementById('readingCategorySelect');
      if (catSelect) {
        catSelect.innerHTML = this.READING_CATEGORIES.map(c => `
          <option value="${c.id}">${c.label}</option>
        `).join('');
      }

      // Virtudes com botões clicáveis com toggle
      const virtuesContainer = document.getElementById('readingVirtuesPills');
      if (virtuesContainer) {
        virtuesContainer.innerHTML = this.VIRTUES_LIST.map(v => `
          <button 
            type="button" 
            onclick="ActaCulture.togglePill(this)" 
            data-value="${v}" 
            data-group="readingVirtue"
            class="reading-virtue-pill text-[11px] px-2.5 py-1 rounded-full border border-[#E8E2D5] bg-[#FAF7F0] text-[#667267] hover:border-[#2F5233]/40 transition-all select-none flex items-center gap-1 font-medium"
          >
            <span>★</span>
            <span>${v}</span>
          </button>
        `).join('');
      }

      // Experiências de Leitura com toggle
      const expContainer = document.getElementById('readingExpPills');
      if (expContainer) {
        expContainer.innerHTML = this.READING_EXPERIENCES.map(e => `
          <button 
            type="button" 
            onclick="ActaCulture.togglePill(this)" 
            data-value="${e}" 
            data-group="readingExp"
            class="reading-exp-pill text-[11px] px-2.5 py-1 rounded-full border border-[#E8E2D5] bg-[#FAF7F0] text-[#667267] hover:border-[#1E3A5F]/40 transition-all select-none flex items-center gap-1 font-medium"
          >
            <span>${e}</span>
          </button>
        `).join('');
      }

      // Reset dos campos de texto
      const form = document.getElementById('formNewReading');
      if (form) form.reset();

      // Data de término padrão hoje
      const endDateInput = document.getElementById('readingEndDate');
      if (endDateInput) endDateInput.value = new Date().toISOString().split('T')[0];

      window.ActaApp.openModal('modalNewReading');
    },

    // ABRIR FORMULÁRIO PARA EDITAR LEITURA EXISTENTE
    openEditReadingModal: function(id) {
      const storage = window.ActaStorage;
      if (!storage) return;

      const reading = storage.getReadingById(id);
      if (!reading) return;

      const people = storage.getPeople();

      // Criança
      const childSelect = document.getElementById('readingChildSelect');
      if (childSelect) {
        childSelect.innerHTML = people.map(p => `
          <option value="${p.id}" ${reading.personId === p.id ? 'selected' : ''}>${p.name}</option>
        `).join('');
      }

      // Categorias
      const catSelect = document.getElementById('readingCategorySelect');
      if (catSelect) {
        catSelect.innerHTML = this.READING_CATEGORIES.map(c => `
          <option value="${c.id}" ${reading.category === c.id ? 'selected' : ''}>${c.label}</option>
        `).join('');
      }

      // Campos
      const idEl = document.getElementById('editReadingId');
      if (idEl) idEl.value = reading.id;

      const titleEl = document.getElementById('readingTitle');
      if (titleEl) titleEl.value = reading.title || '';

      const authorEl = document.getElementById('readingAuthor');
      if (authorEl) authorEl.value = reading.author || '';

      const statusEl = document.getElementById('readingStatusSelect');
      if (statusEl) statusEl.value = reading.status || 'concluido';

      const startEl = document.getElementById('readingStartDate');
      if (startEl) startEl.value = reading.startDate || '';

      const endEl = document.getElementById('readingEndDate');
      if (endEl) endEl.value = reading.endDate || '';

      const sumEl = document.getElementById('readingSummary');
      if (sumEl) sumEl.value = reading.summary || '';

      const favEl = document.getElementById('readingFavoritePart');
      if (favEl) favEl.value = reading.favoritePart || '';

      const refEl = document.getElementById('readingReflection');
      if (refEl) refEl.value = reading.reflection || '';

      const ratingEl = document.getElementById('readingRatingSelect');
      if (ratingEl) ratingEl.value = String(reading.rating || 3);

      const customVirtueEl = document.getElementById('readingCustomVirtue');
      if (customVirtueEl) customVirtueEl.value = '';

      // Título e Botão do Modal
      const modalTitleEl = document.getElementById('modalNewReadingTitle');
      if (modalTitleEl) modalTitleEl.textContent = 'Editar Leitura & Literatura';

      const modalBtnEl = document.getElementById('modalNewReadingBtn');
      if (modalBtnEl) modalBtnEl.textContent = 'Salvar Alterações';

      // Virtudes pré-selecionadas
      const virtuesContainer = document.getElementById('readingVirtuesPills');
      if (virtuesContainer) {
        virtuesContainer.innerHTML = this.VIRTUES_LIST.map(v => {
          const isSel = Array.isArray(reading.virtues) && reading.virtues.includes(v);
          return `
            <button 
              type="button" 
              onclick="ActaCulture.togglePill(this)" 
              data-value="${v}" 
              data-group="readingVirtue"
              class="${isSel ? 'acta-pill-active bg-[#2F5233] text-white border-[#2F5233] shadow-xs font-bold' : 'bg-[#FAF7F0] text-[#667267] border-[#E8E2D5] font-medium'} text-[11px] px-2.5 py-1 rounded-full border transition-all select-none flex items-center gap-1 hover:border-[#2F5233]/40"
            >
              ${isSel ? '<span class="pill-check text-[10px] font-bold mr-0.5">✓</span>' : '<span>★</span>'}
              <span>${v}</span>
            </button>
          `;
        }).join('');
      }

      // Experiências de Leitura pré-selecionadas
      const expContainer = document.getElementById('readingExpPills');
      if (expContainer) {
        expContainer.innerHTML = this.READING_EXPERIENCES.map(e => {
          const isSel = Array.isArray(reading.readingExperience) && reading.readingExperience.includes(e);
          return `
            <button 
              type="button" 
              onclick="ActaCulture.togglePill(this)" 
              data-value="${e}" 
              data-group="readingExp"
              class="${isSel ? 'acta-pill-active bg-[#1E3A5F] text-white border-[#1E3A5F] shadow-xs font-bold' : 'bg-[#FAF7F0] text-[#667267] border-[#E8E2D5] font-medium'} text-[11px] px-2.5 py-1 rounded-full border transition-all select-none flex items-center gap-1 hover:border-[#1E3A5F]/40"
            >
              ${isSel ? '<span class="pill-check text-[10px] font-bold mr-0.5">✓</span>' : ''}
              <span>${e}</span>
            </button>
          `;
        }).join('');
      }

      window.ActaApp.closeModal('modalViewReading');
      window.ActaApp.openModal('modalNewReading');
    },

    // SALVAR NOVA LEITURA OU ATUALIZAR EXISTENTE
    saveNewReading: function() {
      const storage = window.ActaStorage;
      if (!storage) return;

      const editId = (document.getElementById('editReadingId') || {}).value || '';
      const title = document.getElementById('readingTitle').value.trim();
      const author = document.getElementById('readingAuthor').value.trim();
      const category = document.getElementById('readingCategorySelect').value;
      const childSelect = document.getElementById('readingChildSelect');
      const personId = childSelect.value;
      const personName = childSelect.options[childSelect.selectedIndex].text;
      const startDate = document.getElementById('readingStartDate').value;
      const endDate = document.getElementById('readingEndDate').value;
      const status = document.getElementById('readingStatusSelect').value;
      const summary = document.getElementById('readingSummary').value.trim();
      const favoritePart = document.getElementById('readingFavoritePart').value.trim();
      const reflection = document.getElementById('readingReflection').value.trim();
      const customVirtue = document.getElementById('readingCustomVirtue').value.trim();
      const rating = parseInt(document.getElementById('readingRatingSelect').value, 10) || 3;

      if (!title) {
        alert('Por favor, informe o título do livro.');
        return;
      }

      // Virtudes marcadas (dos botões toggleáveis e inputs)
      const virtues = [];
      document.querySelectorAll('#readingVirtuesPills .acta-pill-active').forEach(b => {
        if (b.dataset.value && !virtues.includes(b.dataset.value)) virtues.push(b.dataset.value);
      });
      document.querySelectorAll('input[name="readingVirtue"]:checked').forEach(cb => {
        if (!virtues.includes(cb.value)) virtues.push(cb.value);
      });
      if (customVirtue) {
        customVirtue.split(',').map(s => s.trim()).filter(Boolean).forEach(v => {
          if (!virtues.includes(v)) virtues.push(v);
        });
      }

      // Experiências marcadas
      const readingExperience = [];
      document.querySelectorAll('#readingExpPills .acta-pill-active').forEach(b => {
        if (b.dataset.value && !readingExperience.includes(b.dataset.value)) readingExperience.push(b.dataset.value);
      });
      document.querySelectorAll('input[name="readingExp"]:checked').forEach(cb => {
        if (!readingExperience.includes(cb.value)) readingExperience.push(cb.value);
      });

      if (editId) {
        const existing = storage.getReadingById(editId);
        if (existing) {
          Object.assign(existing, {
            personId,
            personName,
            title,
            author,
            category,
            status,
            startDate,
            endDate,
            summary,
            favoritePart,
            virtues,
            reflection,
            readingExperience,
            rating
          });
          storage.updateReading(existing);
          window.ActaApp.closeModal('modalNewReading');
          const container = document.getElementById('tab-leituras');
          if (container) container.innerHTML = this.renderBookshelfHTML();
          window.ActaApp.renderTimelineTab();
          window.ActaApp.renderCasaTab();
          window.ActaApp.renderCriancasTab();
          window.ActaApp.showToast(`✅ Leitura "${title}" atualizada com sucesso!`);
          return;
        }
      }

      const newReading = {
        personId,
        personName,
        title,
        author,
        category,
        status,
        startDate,
        endDate,
        summary,
        favoritePart,
        virtues,
        reflection,
        readingExperience,
        rating
      };

      storage.addReading(newReading);
      window.ActaApp.closeModal('modalNewReading');

      // Atualizar telas
      const container = document.getElementById('tab-leituras');
      if (container) container.innerHTML = this.renderBookshelfHTML();
      window.ActaApp.renderTimelineTab();
      window.ActaApp.renderCasaTab();
      window.ActaApp.renderCriancasTab();
      window.ActaApp.showToast(`✅ Leitura de "${title}" guardada na estante com carinho!`);
    },

    // ABRIR FICHA DETALHADA DO LIVRO
    openReadingDetails: function(id) {
      const storage = window.ActaStorage;
      if (!storage) return;

      const reading = storage.getReadingById(id);
      if (!reading) return;

      const modal = document.getElementById('modalViewReading');
      if (!modal) return;

      const content = document.getElementById('readingDetailsContent');
      if (!content) return;

      const dateRange = reading.startDate && reading.endDate 
        ? `${reading.startDate.split('-').reverse().join('/')} até ${reading.endDate.split('-').reverse().join('/')}`
        : (reading.endDate ? `Concluído em ${reading.endDate.split('-').reverse().join('/')}` : 'Em andamento');

      content.innerHTML = `
        <div class="space-y-5">
          <!-- Cabeçalho da Obra -->
          <div class="flex items-start gap-4 pb-4 border-b border-[#E8E2D5]">
            <!-- Lombada / Mini Capa Estilizada -->
            <div class="w-16 h-24 rounded-lg shadow-md flex flex-col justify-between p-2 text-white shrink-0 border border-white/20" style="background: linear-gradient(135deg, ${reading.coverColor || '#2F5233'}, #1B2E1D);">
              <span class="text-[8px] tracking-widest uppercase text-yellow-200">ACTA</span>
              <span class="text-[10px] font-bold font-editorial-serif line-clamp-3 leading-tight">${reading.title}</span>
              <span class="text-[7px] text-white/70">${reading.category}</span>
            </div>

            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold bg-[#EBF3ED] text-[#2F5233] px-2.5 py-0.5 rounded-full">
                  ${reading.category}
                </span>
                <span class="text-xs text-[#8E9A8F]">•</span>
                <span class="text-xs font-semibold text-[#667267]">${reading.personName}</span>
              </div>
              <h2 class="font-editorial-serif text-lg sm:text-xl font-bold text-[#28302A] leading-tight">
                ${reading.title}
              </h2>
              ${reading.author ? `<p class="text-xs text-[#667267]">De <strong class="text-[#28302A]">${reading.author}</strong></p>` : ''}
              <p class="text-[11px] text-[#8E9A8F] pt-0.5">
                <i class="fa-regular fa-calendar text-[10px]"></i> ${dateRange}
              </p>
            </div>
          </div>

          <!-- Resumo da Obra -->
          ${reading.summary ? `
            <div class="space-y-1">
              <h4 class="text-xs font-bold uppercase tracking-wider text-[#667267]">Breve Resumo</h4>
              <p class="text-xs text-[#28302A] bg-[#FAF7F0] p-3 rounded-xl border border-[#E8E2D5] leading-relaxed">
                ${reading.summary}
              </p>
            </div>
          ` : ''}

          <!-- O que a Criança Mais Gostou -->
          ${reading.favoritePart ? `
            <div class="space-y-1">
              <h4 class="text-xs font-bold uppercase tracking-wider text-[#2F5233] flex items-center gap-1.5">
                <i class="fa-solid fa-heart text-rose-500 text-[11px]"></i> O que a criança mais gostou
              </h4>
              <p class="text-xs text-[#28302A] bg-[#F4EFE6] p-3 rounded-xl border border-[#E8E2D5] italic">
                "${reading.favoritePart}"
              </p>
            </div>
          ` : ''}

          <!-- Reflexão e Aprendizado Formativo -->
          ${reading.reflection ? `
            <div class="space-y-1">
              <h4 class="text-xs font-bold uppercase tracking-wider text-[#1E3A5F] flex items-center gap-1.5">
                <i class="fa-solid fa-lightbulb text-amber-500 text-[11px]"></i> Reflexão & O que a história ensinou
              </h4>
              <p class="text-xs text-[#28302A] bg-[#FAF7F0] p-3 rounded-xl border border-[#E8E2D5] leading-relaxed">
                ${reading.reflection}
              </p>
            </div>
          ` : ''}

          <!-- Virtudes e Valores Encontrados -->
          ${reading.virtues && reading.virtues.length > 0 ? `
            <div class="space-y-1.5">
              <h4 class="text-xs font-bold uppercase tracking-wider text-[#667267]">Virtudes & Bons Exemplos Observados</h4>
              <div class="flex flex-wrap gap-1.5">
                ${reading.virtues.map(v => `
                  <span class="text-xs font-semibold bg-[#FAF7F0] text-[#2F5233] border border-[#CCD8CD] px-3 py-1 rounded-full inline-flex items-center gap-1">
                    ★ ${v}
                  </span>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Experiência de Leitura -->
          ${reading.readingExperience && reading.readingExperience.length > 0 ? `
            <div class="space-y-1.5">
              <h4 class="text-xs font-bold uppercase tracking-wider text-[#667267]">Como foi a experiência</h4>
              <div class="flex flex-wrap gap-1.5">
                ${reading.readingExperience.map(e => `
                  <span class="text-[11px] font-medium bg-[#EBF3ED] text-[#28302A] border border-[#D5E5D8] px-2.5 py-0.5 rounded-full">
                    ${e}
                  </span>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Avaliação Carinhosa da Criança -->
          ${reading.rating ? `
            <div class="pt-2 border-t border-[#E8E2D5] flex items-center justify-between text-xs">
              <span class="text-[#667267] font-medium">Apreço da criança:</span>
              <span class="text-rose-500 font-bold text-sm">
                ${'❤️'.repeat(reading.rating)}
              </span>
            </div>
          ` : ''}
        </div>
      `;

      // Botão de edição da leitura
      const btnEdit = document.getElementById('btnEditReading');
      if (btnEdit) {
        btnEdit.onclick = () => {
          ActaCulture.openEditReadingModal(reading.id);
        };
      }

      // Botão de exclusão da leitura
      const btnDelete = document.getElementById('btnDeleteReading');
      if (btnDelete) {
        btnDelete.onclick = () => {
          if (confirm(`Deseja remover o registro de leitura "${reading.title}"?`)) {
            storage.deleteReading(reading.id);
            window.ActaApp.closeModal('modalViewReading');
            const container = document.getElementById('tab-leituras');
            if (container) container.innerHTML = ActaCulture.renderBookshelfHTML();
            window.ActaApp.renderTimelineTab();
            window.ActaApp.renderCasaTab();
            window.ActaApp.showToast('Registro de leitura removido.');
          }
        };
      }

      window.ActaApp.openModal('modalViewReading');
    },

    // ABRIR FORMULÁRIO DE NOVO FILME
    openNewMovieModal: function() {
      const storage = window.ActaStorage;
      if (!storage) return;

      const people = storage.getPeople();
      const activePerson = storage.getActivePerson();

      // Criança
      const childSelect = document.getElementById('movieChildSelect');
      if (childSelect) {
        childSelect.innerHTML = people.map(p => `
          <option value="${p.id}" ${activePerson && activePerson.id === p.id ? 'selected' : ''}>${p.name}</option>
        `).join('');
      }

      // Categorias
      const catSelect = document.getElementById('movieCategorySelect');
      if (catSelect) {
        catSelect.innerHTML = this.MOVIE_CATEGORIES.map(c => `
          <option value="${c.id}">${c.label}</option>
        `).join('');
      }

      // Virtudes
      const virtuesContainer = document.getElementById('movieVirtuesPills');
      if (virtuesContainer) {
        virtuesContainer.innerHTML = this.VIRTUES_LIST.map(v => `
          <button 
            type="button" 
            onclick="ActaCulture.togglePill(this)" 
            data-value="${v}" 
            data-group="movieVirtue"
            class="movie-virtue-pill text-[11px] px-2.5 py-1 rounded-full border border-[#E8E2D5] bg-[#FAF7F0] text-[#667267] hover:border-[#A95337]/40 transition-all select-none flex items-center gap-1 font-medium"
          >
            <span>★</span>
            <span>${v}</span>
          </button>
        `).join('');
      }

      // Experiências do Filme
      const expContainer = document.getElementById('movieExpPills');
      if (expContainer) {
        expContainer.innerHTML = this.MOVIE_EXPERIENCES.map(e => `
          <button 
            type="button" 
            onclick="ActaCulture.togglePill(this)" 
            data-value="${e}" 
            data-group="movieExp"
            class="movie-exp-pill text-[11px] px-2.5 py-1 rounded-full border border-[#E8E2D5] bg-[#FAF7F0] text-[#667267] hover:border-[#1E3A5F]/40 transition-all select-none flex items-center gap-1 font-medium"
          >
            <span>${e}</span>
          </button>
        `).join('');
      }

      const form = document.getElementById('formNewMovie');
      if (form) form.reset();

      const dateInput = document.getElementById('movieDate');
      if (dateInput) dateInput.value = new Date().toISOString().split('T')[0];

      window.ActaApp.openModal('modalNewMovie');
    },

    // SALVAR NOVO FILME
    saveNewMovie: function() {
      const storage = window.ActaStorage;
      if (!storage) return;

      const title = document.getElementById('movieTitle').value.trim();
      const director = document.getElementById('movieDirector').value.trim();
      const year = document.getElementById('movieYear').value.trim();
      const category = document.getElementById('movieCategorySelect').value;
      const childSelect = document.getElementById('movieChildSelect');
      const personId = childSelect.value;
      const personName = childSelect.options[childSelect.selectedIndex].text;
      const date = document.getElementById('movieDate').value;
      const summary = document.getElementById('movieSummary').value.trim();
      const favoritePart = document.getElementById('movieFavoritePart').value.trim();
      const attentionPart = document.getElementById('movieAttentionPart').value.trim();
      const reflection = document.getElementById('movieReflection').value.trim();
      const customVirtue = document.getElementById('movieCustomVirtue').value.trim();
      const rating = parseInt(document.getElementById('movieRatingSelect').value, 10) || 3;

      if (!title) {
        alert('Por favor, informe o título do filme.');
        return;
      }

      const virtues = [];
      document.querySelectorAll('#movieVirtuesPills .acta-pill-active').forEach(b => {
        if (b.dataset.value && !virtues.includes(b.dataset.value)) virtues.push(b.dataset.value);
      });
      document.querySelectorAll('input[name="movieVirtue"]:checked').forEach(cb => {
        if (!virtues.includes(cb.value)) virtues.push(cb.value);
      });
      if (customVirtue) {
        customVirtue.split(',').map(s => s.trim()).filter(Boolean).forEach(v => {
          if (!virtues.includes(v)) virtues.push(v);
        });
      }

      const childExperience = [];
      document.querySelectorAll('#movieExpPills .acta-pill-active').forEach(b => {
        if (b.dataset.value && !childExperience.includes(b.dataset.value)) childExperience.push(b.dataset.value);
      });
      document.querySelectorAll('input[name="movieExp"]:checked').forEach(cb => {
        if (!childExperience.includes(cb.value)) childExperience.push(cb.value);
      });

      const newMovie = {
        personId,
        personName,
        title,
        director,
        year,
        category,
        date,
        summary,
        favoritePart,
        attentionPart,
        reflection,
        virtues,
        childExperience,
        rating
      };

      storage.addMovie(newMovie);
      window.ActaApp.closeModal('modalNewMovie');

      const container = document.getElementById('tab-filmes');
      if (container) container.innerHTML = this.renderCinematecaHTML();
      window.ActaApp.renderTimelineTab();
      window.ActaApp.renderCasaTab();
      window.ActaApp.renderCriancasTab();
      window.ActaApp.showToast(`Filme "${title}" registrado com carinho!`);
    },

    // ABRIR FICHA DETALHADA DO FILME
    openMovieDetails: function(id) {
      const storage = window.ActaStorage;
      if (!storage) return;

      const movie = storage.getMovieById(id);
      if (!movie) return;

      const modal = document.getElementById('modalViewMovie');
      if (!modal) return;

      const content = document.getElementById('movieDetailsContent');
      if (!content) return;

      const dateDisplay = movie.date ? movie.date.split('-').reverse().join('/') : 'Data não informada';

      content.innerHTML = `
        <div class="space-y-5">
          <!-- Cabeçalho do Filme -->
          <div class="flex items-start gap-4 pb-4 border-b border-[#E8E2D5]">
            <div class="w-16 h-20 rounded-xl bg-gradient-to-tr from-[#28302A] to-[#455247] shadow-md flex items-center justify-center text-white shrink-0 border border-white/20">
              <i class="fa-solid fa-clapperboard text-2xl text-yellow-300"></i>
            </div>

            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-bold bg-[#FAF0E6] text-[#A95337] px-2.5 py-0.5 rounded-full border border-[#E8D5C4]">
                  ${movie.category || 'Cinema'}
                </span>
                <span class="text-xs text-[#8E9A8F]">•</span>
                <span class="text-xs font-semibold text-[#667267]">${movie.personName}</span>
              </div>
              <h2 class="font-editorial-serif text-lg sm:text-xl font-bold text-[#28302A] leading-tight">
                ${movie.title}
              </h2>
              <p class="text-xs text-[#667267]">
                ${movie.director ? `Direção: <strong class="text-[#28302A]">${movie.director}</strong>` : ''} 
                ${movie.year ? `• Lançamento: ${movie.year}` : ''}
              </p>
              <p class="text-[11px] text-[#8E9A8F] pt-0.5">
                <i class="fa-regular fa-calendar text-[10px]"></i> Assistido em ${dateDisplay}
              </p>
            </div>
          </div>

          <!-- Sinopse / Resumo -->
          ${movie.summary ? `
            <div class="space-y-1">
              <h4 class="text-xs font-bold uppercase tracking-wider text-[#667267]">Sinopse & Contexto</h4>
              <p class="text-xs text-[#28302A] bg-[#FAF7F0] p-3 rounded-xl border border-[#E8E2D5] leading-relaxed">
                ${movie.summary}
              </p>
            </div>
          ` : ''}

          <!-- O que Mais Gostou -->
          ${movie.favoritePart ? `
            <div class="space-y-1">
              <h4 class="text-xs font-bold uppercase tracking-wider text-[#A95337] flex items-center gap-1.5">
                <i class="fa-solid fa-star text-amber-500 text-[11px]"></i> O que a criança mais gostou
              </h4>
              <p class="text-xs text-[#28302A] bg-[#FAF7F0] p-3 rounded-xl border border-[#E8E2D5] italic">
                "${movie.favoritePart}"
              </p>
            </div>
          ` : ''}

          <!-- O que Mais Chamou Atenção -->
          ${movie.attentionPart ? `
            <div class="space-y-1">
              <h4 class="text-xs font-bold uppercase tracking-wider text-[#667267]">O que mais chamou atenção</h4>
              <p class="text-xs text-[#28302A] bg-[#FAF7F0] p-3 rounded-xl border border-[#E8E2D5]">
                ${movie.attentionPart}
              </p>
            </div>
          ` : ''}

          <!-- Reflexão e Aprendizado Formativo -->
          ${movie.reflection ? `
            <div class="space-y-1">
              <h4 class="text-xs font-bold uppercase tracking-wider text-[#1E3A5F] flex items-center gap-1.5">
                <i class="fa-solid fa-lightbulb text-amber-500 text-[11px]"></i> O que este filme ensinou ou fez pensar
              </h4>
              <p class="text-xs text-[#28302A] bg-[#FAF7F0] p-3 rounded-xl border border-[#E8E2D5] leading-relaxed">
                ${movie.reflection}
              </p>
            </div>
          ` : ''}

          <!-- Virtudes e Valores -->
          ${movie.virtues && movie.virtues.length > 0 ? `
            <div class="space-y-1.5">
              <h4 class="text-xs font-bold uppercase tracking-wider text-[#667267]">Virtudes & Valores Presentes</h4>
              <div class="flex flex-wrap gap-1.5">
                ${movie.virtues.map(v => `
                  <span class="text-xs font-semibold bg-[#FAF7F0] text-[#A95337] border border-[#E8D5C4] px-3 py-1 rounded-full inline-flex items-center gap-1">
                    ★ ${v}
                  </span>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Experiência da Criança -->
          ${movie.childExperience && movie.childExperience.length > 0 ? `
            <div class="space-y-1.5">
              <h4 class="text-xs font-bold uppercase tracking-wider text-[#667267]">Como foi a experiência</h4>
              <div class="flex flex-wrap gap-1.5">
                ${movie.childExperience.map(e => `
                  <span class="text-[11px] font-medium bg-[#EBF3ED] text-[#28302A] border border-[#D5E5D8] px-2.5 py-0.5 rounded-full">
                    ${e}
                  </span>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Avaliação -->
          ${movie.rating ? `
            <div class="pt-2 border-t border-[#E8E2D5] flex items-center justify-between text-xs">
              <span class="text-[#667267] font-medium">Apreço da criança:</span>
              <span class="text-rose-500 font-bold text-sm">
                ${'❤️'.repeat(movie.rating)}
              </span>
            </div>
          ` : ''}
        </div>
      `;

      const btnDelete = document.getElementById('btnDeleteMovie');
      if (btnDelete) {
        btnDelete.onclick = () => {
          if (confirm(`Deseja remover o registro do filme "${movie.title}"?`)) {
            storage.deleteMovie(movie.id);
            window.ActaApp.closeModal('modalViewMovie');
            const container = document.getElementById('tab-filmes');
            if (container) container.innerHTML = ActaCulture.renderCinematecaHTML();
            window.ActaApp.renderTimelineTab();
            window.ActaApp.renderCasaTab();
            window.ActaApp.showToast('Registro de filme removido.');
          }
        };
      }

      window.ActaApp.openModal('modalViewMovie');
    }
  };

  window.ActaCulture = ActaCulture;
})(window);
