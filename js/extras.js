/**
 * PLANNER ACTA — Módulo de Passeios & Atividades Extras
 * "Nem tudo que educa precisa ser colocado dentro de uma aula."
 * Registra visitas a museus, viagens, culinária, oficinas, artes, projetos manuais e experiências espontâneas.
 */

(function(window) {
  'use strict';

  const ActaExtras = {
    selectedCategoryFilter: 'todos', // 'todos' | 'passeio' | 'extra'

    TYPES_CONFIG: {
      passeio: { label: 'Passeio Cultural', icon: 'fa-building-columns', color: 'text-[#1E3A5F]', bg: 'bg-[#E9EFF6]' },
      museu: { label: 'Museu / Exposição', icon: 'fa-building-columns', color: 'text-[#1E3A5F]', bg: 'bg-[#E9EFF6]' },
      biblioteca: { label: 'Biblioteca / Livraria', icon: 'fa-book', color: 'text-[#2F5233]', bg: 'bg-[#EBF3ED]' },
      parque: { label: 'Parque / Natureza', icon: 'fa-tree', color: 'text-[#2F5233]', bg: 'bg-[#EBF3ED]' },
      viagem: { label: 'Viagem / Lugar Histórico', icon: 'fa-earth-americas', color: 'text-[#0284C7]', bg: 'bg-[#E0F2FE]' },
      culinaria: { label: 'Culinária Prática', icon: 'fa-utensils', color: 'text-[#A95337]', bg: 'bg-[#FBECE8]' },
      artes: { label: 'Artes / Pintura / Música', icon: 'fa-palette', color: 'text-[#7C3AED]', bg: 'bg-[#EDE9FE]' },
      artesanato: { label: 'Artesanato / Desenho', icon: 'fa-palette', color: 'text-[#7C3AED]', bg: 'bg-[#EDE9FE]' },
      experiencia: { label: 'Experiência Científica', icon: 'fa-flask', color: 'text-[#D97706]', bg: 'bg-[#FEF3C7]' },
      experimento: { label: 'Experimento Científico', icon: 'fa-flask', color: 'text-[#D97706]', bg: 'bg-[#FEF3C7]' },
      construcao: { label: 'Construção / Marcenaria', icon: 'fa-hammer', color: 'text-[#8C472E]', bg: 'bg-[#F5EBE6]' },
      marcenaria: { label: 'Marcenaria', icon: 'fa-hammer', color: 'text-[#8C472E]', bg: 'bg-[#F5EBE6]' },
      oficina: { label: 'Oficina / Projeto Prático', icon: 'fa-screwdriver-wrench', color: 'text-[#059669]', bg: 'bg-[#ECFDF5]' },
      esporte: { label: 'Esporte / Arte Marcial', icon: 'fa-medal', color: 'text-[#D97706]', bg: 'bg-[#FEF3C7]' },
      curso: { label: 'Curso Prático', icon: 'fa-laptop-code', color: 'text-[#4F46E5]', bg: 'bg-[#EEF2FF]' },
      espontaneo: { label: 'Aprendizado Espontâneo', icon: 'fa-seedling', color: 'text-[#2F5233]', bg: 'bg-[#EBF3ED]' },
      outro: { label: 'Atividade Espontânea', icon: 'fa-sparkles', color: 'text-[#28302A]', bg: 'bg-[#FAF7F0]' }
    },

    getTypeConfig: function(typeKey) {
      return this.TYPES_CONFIG[typeKey] || this.TYPES_CONFIG.outro;
    },

    renderExtrasListHTML: function(childId, filterType) {
      const storage = window.ActaStorage;
      if (!storage) return '';

      const person = childId ? storage.getPersonById(childId) : storage.getActivePerson();
      let extras = storage.getExtras(person ? person.id : 'all');

      const activeFilter = filterType || 'all';
      if (activeFilter !== 'all' && activeFilter !== 'todos') {
        if (activeFilter === 'passeio') {
          extras = extras.filter(x => x.type === 'passeio' || x.category === 'passeio' || ['museu', 'biblioteca', 'parque', 'viagem'].includes(x.type));
        } else if (activeFilter === 'experimento') {
          extras = extras.filter(x => x.type === 'experimento' || x.type === 'experiencia');
        } else if (activeFilter === 'marcenaria') {
          extras = extras.filter(x => x.type === 'marcenaria' || x.type === 'construcao' || x.type === 'oficina');
        } else if (activeFilter === 'artesanato') {
          extras = extras.filter(x => x.type === 'artesanato' || x.type === 'artes');
        } else if (activeFilter === 'esporte_curso') {
          extras = extras.filter(x => x.type === 'esporte' || x.type === 'curso');
        } else {
          extras = extras.filter(x => x.type === activeFilter || x.category === activeFilter);
        }
      }

      if (extras.length === 0) {
        return `
          <div class="planner-card p-10 text-center text-[#667267] bg-white border border-[#E8E2D5] shadow-xs">
            <i class="fa-solid fa-compass text-4xl text-[#8E9A8F] mb-3"></i>
            <h4 class="font-bold text-sm text-[#28302A]">Nenhum passeio ou atividade extra cadastrada ainda</h4>
            <p class="text-xs text-[#667267] mt-1 max-w-md mx-auto">
              Visitas a museus, bibliotecas, parques, receitas culinárias, pintura ou experimentos manuais enriquecem a memória educativa da criança e podem ser registrados aqui.
            </p>
            <button 
              type="button" 
              onclick="ActaApp.openModal('modalNewExtra')"
              class="hero-btn-terracotta text-xs font-semibold px-4 py-2 rounded-full shadow-xs inline-flex items-center gap-1.5 mt-3"
            >
              <i class="fa-solid fa-plus text-[10px]"></i>
              <span>Registrar primeiro passeio</span>
            </button>
          </div>
        `;
      }

      return `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          ${extras.map(item => {
            const conf = this.getTypeConfig(item.type);
            const imgUrl = item.photo || item.evidenceImg || '';
            const displayDate = item.formattedDate || (item.date ? item.date.split('-').reverse().join('/') : '');
            return `
              <div class="planner-card p-4 sm:p-5 bg-white border border-[#E8E2D5] flex flex-col justify-between space-y-3 shadow-xs hover:border-[#2F5233]/40 transition">
                <div class="space-y-2">
                  <div class="flex items-center justify-between gap-2 border-b border-[#E8E2D5]/70 pb-2">
                    <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${conf.bg} ${conf.color} inline-flex items-center gap-1.5">
                      <i class="fa-solid ${conf.icon}"></i>
                      <span>${conf.label}</span>
                    </span>
                    <span class="text-xs font-semibold text-[#667267]">${displayDate}</span>
                  </div>

                  <h4 class="font-editorial-title text-base font-bold text-[#28302A] leading-snug">
                    ${item.title}
                  </h4>

                  ${item.location ? `
                    <div class="text-[11px] text-[#667267] flex items-center gap-1.5">
                      <i class="fa-solid fa-location-dot text-[#A95337] text-[10px]"></i>
                      <span>${item.location}</span>
                    </div>
                  ` : ''}

                  <p class="text-xs text-[#28302A] leading-relaxed">
                    ${item.description || ''}
                  </p>

                  ${item.highlights ? `
                    <div class="p-2.5 rounded-lg bg-[#FAF7F0] border border-[#E8E2D5]/70 text-xs text-[#28302A] italic">
                      <strong>Momento especial:</strong> "${item.highlights}"
                    </div>
                  ` : ''}
                </div>

                <!-- Rodapé do Cartão com Foto e Ações -->
                <div class="pt-2 flex items-center justify-between gap-2 border-t border-[#E8E2D5]/60">
                  ${imgUrl ? `
                    <div 
                      onclick="ActaApp.previewImage('${imgUrl}')"
                      class="w-16 h-12 rounded-lg overflow-hidden border border-[#E8E2D5] bg-[#FAF7F0] cursor-pointer hover:opacity-90 transition shrink-0"
                      title="Clique para ampliar foto do passeio"
                    >
                      <img src="${imgUrl}" alt="Foto" class="w-full h-full object-cover">
                    </div>
                  ` : `
                    <span class="text-[11px] text-[#8E9A8F]">Sem foto anexada</span>
                  `}

                  <button 
                    type="button" 
                    onclick="ActaExtras.deleteExtraItem('${item.id}')"
                    class="text-[#8E9A8F] hover:text-[#A95337] text-xs p-1 transition"
                    title="Remover passeio"
                  >
                    <i class="fa-solid fa-trash-can"></i>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    },

    renderExtrasHTML: function(childId) {
      return this.renderExtrasListHTML(childId, this.selectedCategoryFilter);
    },

    filterCategory: function(cat, buttonEl) {
      this.selectedCategoryFilter = cat;
      const container = document.getElementById('extrasListContainer') || document.getElementById('extrasContentContainer');
      if (container) {
        container.innerHTML = this.renderExtrasListHTML(null, cat);
      }
    },

    openNewExtraModal: function(childId) {
      if (window.ActaApp && typeof window.ActaApp.openModal === 'function') {
        window.ActaApp.openModal('modalNewExtra');
        if (childId) {
          const childSelect = document.getElementById('extraChildSelect');
          if (childSelect) childSelect.value = childId;
        }
      }
    },

    saveExtraFromModal: function() {
      if (window.ActaApp && typeof window.ActaApp.saveNewExtra === 'function') {
        window.ActaApp.saveNewExtra();
      }
    },

    deleteExtraItem: function(id) {
      if (window.ActaApp && typeof window.ActaApp.deleteExtra === 'function') {
        window.ActaApp.deleteExtra(id);
      } else if (confirm('Deseja remover este registro de passeio/extra?')) {
        window.ActaStorage.deleteExtra(id);
        if (window.ActaApp && typeof window.ActaApp.renderPasseiosTab === 'function') {
          window.ActaApp.renderPasseiosTab();
        }
      }
    }
  };

  window.ActaExtras = ActaExtras;
})(window);
