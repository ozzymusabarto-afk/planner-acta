/**
 * PLANNER ACTA — Biblioteca Digital e Parser de Índices
 * Renderização em estilo estante de livros, capas visuais e árvore de tópicos com status suaves.
 */

(function(window) {
  'use strict';

  const ActaMaterials = {
    selectedSubjectFilter: 'Todos',
    activeInspectedMaterialId: 'm2', // Padrão: Matemática

    /**
     * Parser inteligente de sumários e índices textuais (JavaScript puro, sem IA)
     */
    parseIndexText: function(rawText) {
      if (!rawText || typeof rawText !== 'string') return [];

      const lines = rawText.split(/\r?\n/);
      const parsedTopics = [];
      let autoId = 1;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        if (!trimmed) continue;

        let level = 2;
        let cleanTitle = trimmed;

        const dotPatternMatch = trimmed.match(/^(\d+(\.\d+)*)\.?\s*(.*)$/);
        if (dotPatternMatch) {
          const numberPart = dotPatternMatch[1];
          const textPart = dotPatternMatch[3];
          const dotCount = (numberPart.match(/\./g) || []).length;
          level = dotCount + 1;
          cleanTitle = `${numberPart} ${textPart}`.trim();
        } else if (/^(unidade|m[óo]dulo|parte|bloco)\s+[0-9ivxlcdm]+/i.test(trimmed)) {
          level = 1;
        } else if (/^(cap[íi]tulo|se[çc][ãa]o)\s+[0-9ivxlcdm]+/i.test(trimmed)) {
          level = 2;
        } else if (/^[ivxlcdm]+\.\s+/i.test(trimmed)) {
          level = 1;
        } else if (/^[a-z]\.?\s+/i.test(trimmed) || /^[a-z]\)\s+/i.test(trimmed)) {
          level = 3;
        } else if (/^[•\-\*]\s+/.test(trimmed)) {
          level = 2;
          cleanTitle = trimmed.replace(/^[•\-\*]\s+/, '').trim();
        } else {
          const leadingSpaces = line.match(/^(\s+)/);
          if (leadingSpaces) {
            const count = leadingSpaces[1].length;
            if (count >= 6) level = 4;
            else if (count >= 4) level = 3;
            else if (count >= 2) level = 2;
          } else {
            level = 1;
          }
        }

        parsedTopics.push({
          id: 'top_' + (autoId++),
          level: Math.min(Math.max(level, 1), 4),
          title: cleanTitle,
          status: 'pendente'
        });
      }

      return parsedTopics;
    },

    /**
     * Renderiza a estante de livros (Capas ilustradas como no mockup)
     */
    renderBookshelfHTML: function(materials, activeFilter = 'Todos') {
      let filtered = materials;
      if (activeFilter && activeFilter !== 'Todos') {
        filtered = materials.filter(m => m.subject.toLowerCase() === activeFilter.toLowerCase());
      }

      if (filtered.length === 0) {
        return `
          <div class="col-span-full p-8 text-center bg-white rounded-2xl border border-[#E8E2D5] text-[#667267]">
            <p class="text-sm font-medium">Nenhum livro encontrado nesta disciplina.</p>
          </div>
        `;
      }

      return filtered.map(mat => {
        // Cores temáticas para cada capa de livro
        let coverBg = '#2F5233'; // Verde padrão
        let coverBorder = '#244127';
        let accentPattern = '🍃';

        if (mat.subject.toLowerCase().includes('português')) {
          coverBg = '#A95337'; // Terracotta
          coverBorder = '#8D4129';
          accentPattern = '🖋️';
        } else if (mat.subject.toLowerCase().includes('matemática')) {
          coverBg = '#1E3A5F'; // Azul nobre
          coverBorder = '#142740';
          accentPattern = '📐';
        } else if (mat.subject.toLowerCase().includes('ciências')) {
          coverBg = '#3D5A30'; // Verde oliva
          coverBorder = '#2E4424';
          accentPattern = '🌱';
        } else if (mat.subject.toLowerCase().includes('história')) {
          coverBg = '#7C4A32'; // Terracota escuro
          coverBorder = '#613622';
          accentPattern = '🏰';
        } else if (mat.subject.toLowerCase().includes('geografia')) {
          coverBg = '#325B6C'; // Ardósia
          coverBorder = '#254452';
          accentPattern = '🧭';
        }

        const isInspected = this.activeInspectedMaterialId === mat.id;

        return `
          <div class="flex flex-col items-center group">
            <!-- Capa do Livro 3D com Lombada -->
            <div 
              onclick="ActaMaterials.inspectMaterial('${mat.id}')"
              class="book-cover w-36 sm:w-40 p-3 text-white flex flex-col justify-between cursor-pointer transition relative ${isInspected ? 'ring-4 ring-[#2F5233]/40 scale-[1.02]' : ''}"
              style="background-color: ${coverBg};"
            >
              <div class="border border-white/20 p-2.5 rounded-md h-full flex flex-col justify-between bg-black/5">
                <div class="flex justify-between items-start text-xs opacity-75">
                  <span class="text-[9px] uppercase tracking-wider font-semibold">${mat.subject}</span>
                  <span>${accentPattern}</span>
                </div>

                <div class="my-auto py-2 text-center">
                  <h4 class="font-editorial-serif text-sm font-bold leading-tight drop-shadow-sm line-clamp-3">
                    ${mat.title}
                  </h4>
                  ${mat.subtitle ? `<span class="text-[10px] opacity-80 block mt-1">${mat.subtitle}</span>` : ''}
                </div>

                <div class="text-[9px] text-center opacity-70 border-t border-white/15 pt-1.5 truncate">
                  ${mat.author || 'Edição ACTA'}
                </div>
              </div>
            </div>

            <!-- Identificação e Botão Abaixo do Livro -->
            <div class="text-center mt-2.5 w-full">
              <span class="text-xs font-bold text-[#28302A] block truncate">${mat.subject}</span>
              <span class="text-[11px] text-[#667267] block truncate">${mat.title}</span>
              
              <button 
                type="button" 
                onclick="ActaMaterials.inspectMaterial('${mat.id}')"
                class="mt-2 text-xs font-semibold px-3 py-1 rounded-full border transition ${isInspected ? 'bg-[#2F5233] text-white border-[#2F5233]' : 'bg-[#FAF7F0] text-[#2F5233] border-[#E8E2D5] hover:bg-[#EBF3ED]'}"
              >
                Ver índice
              </button>
            </div>
          </div>
        `;
      }).join('');
    },

    /**
     * Alterna o livro inspecionado na seção de índice
     */
    inspectMaterial: function(matId) {
      this.activeInspectedMaterialId = matId;
      ActaApp.renderMaterialsTab();
      
      const inspectSection = document.getElementById('inspectedMaterialSection');
      if (inspectSection) {
        inspectSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    },

    /**
     * Renderiza o Índice Hierárquico do Material Inspecionado
     */
    renderInspectedIndexHTML: function(material) {
      if (!material) return '<p class="text-xs text-[#667267] italic p-4">Selecione um livro acima para visualizar o índice.</p>';

      const topics = material.topics || [];
      if (topics.length === 0) {
        return `
          <div class="p-6 text-center text-[#667267] text-xs">
            <p>Nenhum tópico cadastrado neste sumário ainda.</p>
            <button onclick="ActaApp.openModal('modalNewMaterial')" class="mt-2 text-[#2F5233] font-bold hover:underline">
              Editar ou adicionar índice
            </button>
          </div>
        `;
      }

      let html = '<div class="space-y-1.5 p-4">';
      topics.forEach(t => {
        let indentClass = 'pl-2 font-bold text-sm text-[#28302A] mt-3 pt-1 border-l-2 border-[#2F5233]';
        let bullet = '';
        if (t.level === 2) {
          indentClass = 'pl-6 font-medium text-xs text-[#3E483F]';
          bullet = '•';
        } else if (t.level === 3) {
          indentClass = 'pl-10 text-xs text-[#667267]';
          bullet = '◦';
        } else if (t.level >= 4) {
          indentClass = 'pl-14 text-xs text-[#8E9A8F]';
          bullet = '·';
        }

        let statusBadge = '';
        if (t.status === 'concluido') {
          statusBadge = '<span class="inline-flex items-center gap-1 text-[11px] font-medium text-[#1E5631]"><i class="fa-solid fa-circle text-[8px] text-[#2F5233]"></i> Concluído</span>';
        } else if (t.status === 'em_pratica') {
          statusBadge = '<span class="inline-flex items-center gap-1 text-[11px] font-medium text-[#92400E]"><i class="fa-solid fa-circle text-[8px] text-[#D97706]"></i> Em andamento</span>';
        } else {
          statusBadge = '<span class="inline-flex items-center gap-1 text-[11px] text-[#8E9A8F]"><i class="fa-regular fa-circle text-[8px]"></i> Não iniciado</span>';
        }

        html += `
          <div class="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-[#F4EFE6]/50 transition group ${indentClass}">
            <div class="flex items-center gap-2 truncate pr-2">
              ${bullet ? `<span class="text-[10px] text-[#667267]">${bullet}</span>` : ''}
              <span class="truncate">${t.title}</span>
            </div>
            <div class="flex items-center gap-3 shrink-0">
              ${statusBadge}
              <button 
                type="button" 
                onclick="ActaApp.openQuickRegisterFromTopic('${encodeURIComponent(t.title)}', '${material.id}', '${material.subject}')"
                class="opacity-0 group-hover:opacity-100 text-[11px] font-semibold text-[#2F5233] bg-[#EBF3ED] hover:bg-[#D9EADB] px-2 py-0.5 rounded transition"
                title="Registrar atividade para este conteúdo"
              >
                + Registrar
              </button>
            </div>
          </div>
        `;
      });
      html += '</div>';

      return html;
    }
  };

  window.ActaMaterials = ActaMaterials;
})(window);
