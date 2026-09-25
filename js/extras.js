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
      museu: { label: 'Museu / Exposição', icon: 'fa-building-columns', color: 'text-[#1E3A5F]', bg: 'bg-[#E9EFF6]' },
      biblioteca: { label: 'Biblioteca / Livraria', icon: 'fa-book', color: 'text-[#2F5233]', bg: 'bg-[#EBF3ED]' },
      parque: { label: 'Parque / Natureza', icon: 'fa-tree', color: 'text-[#2F5233]', bg: 'bg-[#EBF3ED]' },
      viagem: { label: 'Viagem / Lugar Histórico', icon: 'fa-earth-americas', color: 'text-[#0284C7]', bg: 'bg-[#E0F2FE]' },
      culinaria: { label: 'Culinária em Família', icon: 'fa-utensils', color: 'text-[#A95337]', bg: 'bg-[#FBECE8]' },
      artes: { label: 'Artes / Pintura / Música', icon: 'fa-palette', color: 'text-[#7C3AED]', bg: 'bg-[#EDE9FE]' },
      experiencia: { label: 'Experiência Científica', icon: 'fa-flask', color: 'text-[#D97706]', bg: 'bg-[#FEF3C7]' },
      construcao: { label: 'Construção / Marcenaria', icon: 'fa-hammer', color: 'text-[#8C472E]', bg: 'bg-[#F5EBE6]' },
      oficina: { label: 'Oficina / Projeto Prático', icon: 'fa-screwdriver-wrench', color: 'text-[#059669]', bg: 'bg-[#ECFDF5]' },
      outro: { label: 'Atividade Espontânea', icon: 'fa-sparkles', color: 'text-[#28302A]', bg: 'bg-[#FAF7F0]' }
    },

    getTypeConfig: function(typeKey) {
      return this.TYPES_CONFIG[typeKey] || this.TYPES_CONFIG.outro;
    },

    renderExtrasHTML: function(childId) {
      const storage = window.ActaStorage;
      if (!storage) return '';

      const person = childId ? storage.getPersonById(childId) : storage.getActivePerson();
      let extras = storage.getExtras(person ? person.id : 'all');

      if (this.selectedCategoryFilter !== 'todos') {
        extras = extras.filter(x => x.category === this.selectedCategoryFilter);
      }

      let html = `
        <div class="space-y-6">
          
          <!-- Topo: Filtros de Categoria e Botão de Ação -->
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div class="flex items-center gap-2">
              <button 
                type="button" 
                onclick="ActaExtras.filterCategory('todos', this)" 
                class="extra-filter-pill text-xs font-semibold px-4 py-1.5 rounded-full ${this.selectedCategoryFilter === 'todos' ? 'bg-[#2F5233] text-white' : 'bg-white border border-[#E8E2D5] text-[#28302A] hover:bg-[#FAF7F0]'} transition shadow-2xs"
              >
                Todos
              </button>
              <button 
                type="button" 
                onclick="ActaExtras.filterCategory('passeio', this)" 
                class="extra-filter-pill text-xs font-semibold px-4 py-1.5 rounded-full ${this.selectedCategoryFilter === 'passeio' ? 'bg-[#2F5233] text-white' : 'bg-white border border-[#E8E2D5] text-[#28302A] hover:bg-[#FAF7F0]'} transition shadow-2xs"
              >
                🏛️ Passeios Culturais
              </button>
              <button 
                type="button" 
                onclick="ActaExtras.filterCategory('extra', this)" 
                class="extra-filter-pill text-xs font-semibold px-4 py-1.5 rounded-full ${this.selectedCategoryFilter === 'extra' ? 'bg-[#2F5233] text-white' : 'bg-white border border-[#E8E2D5] text-[#28302A] hover:bg-[#FAF7F0]'} transition shadow-2xs"
              >
                🎨 Projetos & Práticas
              </button>
            </div>

            <button 
              type="button" 
              onclick="ActaExtras.openNewExtraModal('${person ? person.id : ''}')"
              class="hero-btn-green text-xs font-semibold px-4 py-2 rounded-full shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <i class="fa-solid fa-plus text-[10px]"></i>
              <span>Novo Passeio ou Extra</span>
            </button>
          </div>

          <!-- Grade de Cartões de Passeios & Extras -->
          ${extras.length === 0 ? `
            <div class="planner-card p-10 text-center text-[#667267] bg-white border border-[#E8E2D5] shadow-xs">
              <i class="fa-solid fa-compass text-4xl text-[#8E9A8F] mb-3"></i>
              <h4 class="font-bold text-sm text-[#28302A]">Nenhum passeio ou atividade extra cadastrada ainda</h4>
              <p class="text-xs text-[#667267] mt-1 max-w-md mx-auto">
                Visitas a museus, bibliotecas, parques, receitas culinárias, pintura ou experimentos manuais enriquecem a memória educativa da criança e podem ser registrados aqui.
              </p>
              <button 
                type="button" 
                onclick="ActaExtras.openNewExtraModal('${person ? person.id : ''}')"
                class="hero-btn-terracotta text-xs font-semibold px-4 py-2 rounded-full shadow-xs inline-flex items-center gap-1.5 mt-3"
              >
                <i class="fa-solid fa-plus text-[10px]"></i>
                <span>Registrar primeiro passeio</span>
              </button>
            </div>
          ` : `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              ${extras.map(item => {
                const conf = this.getTypeConfig(item.type);
                return `
                  <div class="planner-card p-4 sm:p-5 bg-white border border-[#E8E2D5] flex flex-col justify-between space-y-3 shadow-xs hover:border-[#2F5233]/40 transition">
                    <div class="space-y-2">
                      <div class="flex items-center justify-between gap-2 border-b border-[#E8E2D5]/70 pb-2">
                        <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${conf.bg} ${conf.color} inline-flex items-center gap-1.5">
                          <i class="fa-solid ${conf.icon}"></i>
                          <span>${conf.label}</span>
                        </span>
                        <span class="text-xs font-semibold text-[#667267]">${item.formattedDate || item.date}</span>
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
                      ${item.evidenceImg ? `
                        <div 
                          onclick="ActaApp.previewImage('${item.evidenceImg}')"
                          class="w-16 h-12 rounded-lg overflow-hidden border border-[#E8E2D5] bg-[#FAF7F0] cursor-pointer hover:opacity-90 transition shrink-0"
                          title="Clique para ampliar foto do passeio"
                        >
                          <img src="${item.evidenceImg}" alt="Foto" class="w-full h-full object-cover">
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
          `}

        </div>
      `;

      return html;
    },

    filterCategory: function(cat, buttonEl) {
      this.selectedCategoryFilter = cat;
      const container = document.getElementById('extrasContentContainer');
      if (container) {
        container.innerHTML = this.renderExtrasHTML();
      }
    },

    openNewExtraModal: function(childId) {
      const storage = window.ActaStorage;
      const modal = document.getElementById('modalNewExtra');
      if (!modal) return;

      const people = storage.getPeople();
      const activePerson = childId ? storage.getPersonById(childId) : storage.getActivePerson();

      const childSelect = document.getElementById('extraChildSelect');
      childSelect.innerHTML = people.map(p => `
        <option value="${p.id}" ${activePerson && activePerson.id === p.id ? 'selected' : ''}>${p.name}</option>
      `).join('');

      document.getElementById('extraTitle').value = '';
      document.getElementById('extraDate').value = new Date().toISOString().split('T')[0];
      document.getElementById('extraLocation').value = '';
      document.getElementById('extraDescription').value = '';
      document.getElementById('extraHighlights').value = '';
      document.getElementById('extraImage').value = '';

      modal.classList.remove('hidden');
    },

    saveExtraFromModal: function() {
      const storage = window.ActaStorage;
      const childId = document.getElementById('extraChildSelect').value;
      const category = document.getElementById('extraCategorySelect').value;
      const type = document.getElementById('extraTypeSelect').value;
      const title = document.getElementById('extraTitle').value.trim();
      const date = document.getElementById('extraDate').value || new Date().toISOString().split('T')[0];
      const location = document.getElementById('extraLocation').value.trim();
      const description = document.getElementById('extraDescription').value.trim();
      const highlights = document.getElementById('extraHighlights').value.trim();
      const evidenceImg = document.getElementById('extraImage').value.trim();

      if (!title) {
        alert('Por favor, informe o título do passeio ou atividade.');
        return;
      }

      storage.saveExtra({
        personId: childId,
        category: category,
        type: type,
        title: title,
        date: date,
        location: location,
        description: description,
        highlights: highlights,
        evidenceImg: evidenceImg
      });

      document.getElementById('modalNewExtra').classList.add('hidden');
      if (window.ActaApp && typeof window.ActaApp.renderPasseiosTab === 'function') {
        window.ActaApp.renderPasseiosTab();
      }
    },

    deleteExtraItem: function(id) {
      if (confirm('Deseja remover este registro de passeio/extra?')) {
        window.ActaStorage.deleteExtra(id);
        if (window.ActaApp && typeof window.ActaApp.renderPasseiosTab === 'function') {
          window.ActaApp.renderPasseiosTab();
        }
      }
    }
  };

  window.ActaExtras = ActaExtras;
})(window);
