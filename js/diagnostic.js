/**
 * PLANNER ACTA — Módulo de Avaliação Diagnóstica (Ponto de Partida)
 * Descobre o ponto de partida da criança em Português e Matemática antes do planejamento.
 * Sem notas numéricas ou burocracia escolar; foco no desenvolvimento real e autonomia.
 */

(function(window) {
  'use strict';

  const ActaDiagnostic = {
    // Escala de desenvolvimento pedagógico socrático
    STATUS_LABELS: {
      consolidado: { label: 'Consolidado', color: 'bg-[#EBF3ED] text-[#2F5233] border-[#2F5233]/30', dot: 'bg-[#2F5233]' },
      desenvolvimento: { label: 'Em desenvolvimento', color: 'bg-[#FEF3C7] text-[#D97706] border-[#D97706]/30', dot: 'bg-[#D97706]' },
      iniciando: { label: 'Iniciando / Retomar', color: 'bg-[#FBECE8] text-[#A95337] border-[#A95337]/30', dot: 'bg-[#A95337]' }
    },

    PORTUGUES_ITEMS: [
      { key: 'leitura', label: 'Leitura e Fluência' },
      { key: 'compreensao', label: 'Compreensão de Texto' },
      { key: 'interpretacao', label: 'Interpretação e Sentido' },
      { key: 'escrita', label: 'Escrita e Ortografia' },
      { key: 'vocabulario', label: 'Vocabulário e Expressão' },
      { key: 'organizacaoPensamento', label: 'Organização do Pensamento' }
    ],

    MATEMATICA_ITEMS: [
      { key: 'raciocinio', label: 'Raciocínio Lógico' },
      { key: 'operacoes', label: 'Operações Fundamentais' },
      { key: 'problemas', label: 'Resolução de Problemas' },
      { key: 'compreensao', label: 'Compreensão Matemática' },
      { key: 'calculo', label: 'Cálculo Mental e Estimativa' }
    ],

    renderDiagnosticHTML: function(childId) {
      const storage = window.ActaStorage;
      if (!storage) return '';

      const person = childId ? storage.getPersonById(childId) : storage.getActivePerson();
      if (!person) {
        return `
          <div class="planner-card p-8 text-center bg-white border border-[#E8E2D5]">
            <p class="text-sm text-[#667267]">Nenhuma criança cadastrada para avaliação.</p>
          </div>
        `;
      }

      const evaluations = storage.getEvaluations(person.id);
      const latest = evaluations[0] || null;

      let html = `
        <div class="space-y-6">
          <!-- Banner de Ponto de Partida -->
          <div class="planner-card p-6 bg-white border border-[#E8E2D5] shadow-xs">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E8E2D5] pb-5">
              <div class="flex items-center gap-3.5">
                <div class="w-14 h-14 rounded-full overflow-hidden border border-[#E8E2D5] shrink-0 bg-[#FAF7F0]">
                  ${storage.renderAvatarHTML(person.avatar, 'w-full h-full object-cover', person.name)}
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h3 class="font-editorial-title text-xl font-bold text-[#28302A]">${person.name}</h3>
                    <span class="text-xs text-[#667267] font-medium">• ${person.birthDate ? this.calculateAge(person.birthDate) : (person.info || 'Ponto de partida')}</span>
                  </div>
                  <p class="text-xs text-[#667267] mt-0.5">Diagnóstico pedagógico inicial e acompanhamento de prontidão.</p>
                </div>
              </div>

              <button 
                type="button" 
                onclick="ActaDiagnostic.openNewEvaluationModal('${person.id}')"
                class="hero-btn-green text-xs font-semibold px-4 py-2.5 rounded-full shadow-xs flex items-center gap-2 shrink-0"
              >
                <i class="fa-solid fa-plus text-[10px]"></i>
                <span>Nova Avaliação Diagnóstica</span>
              </button>
            </div>

            ${latest ? this.renderEvaluationDetails(latest) : `
              <div class="p-8 text-center text-[#667267] space-y-3">
                <i class="fa-solid fa-compass-drafting text-4xl text-[#8E9A8F] mb-1"></i>
                <h4 class="font-bold text-sm text-[#28302A]">Nenhuma avaliação diagnóstica registrada ainda para ${person.name}</h4>
                <p class="text-xs max-w-md mx-auto">
                  A avaliação diagnóstica não utiliza notas escolares. Ela identifica o ponto de partida real da criança em Português e Matemática para orientar os materiais ideais.
                </p>
                <button 
                  type="button" 
                  onclick="ActaDiagnostic.openNewEvaluationModal('${person.id}')"
                  class="hero-btn-terracotta text-xs font-semibold px-4 py-2 rounded-full shadow-xs inline-flex items-center gap-1.5 mt-2"
                >
                  <i class="fa-solid fa-feather text-[11px]"></i>
                  <span>Registrar primeiro diagnóstico</span>
                </button>
              </div>
            `}
          </div>

          <!-- Histórico de Avaliações Anteriores -->
          ${evaluations.length > 1 ? `
            <div class="space-y-3 pt-2">
              <h4 class="text-xs font-bold uppercase tracking-wider text-[#28302A] flex items-center gap-2">
                <span class="planner-bullet"></span>
                <span>Histórico de Avaliações Anteriores</span>
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ${evaluations.slice(1).map(ev => `
                  <div class="planner-card p-4 bg-white border border-[#E8E2D5] space-y-2">
                    <div class="flex justify-between items-center text-xs border-b border-[#E8E2D5] pb-2">
                      <span class="font-bold text-[#28302A]">${ev.title || 'Avaliação'}</span>
                      <span class="text-[#667267]">${ev.formattedDate || ev.date}</span>
                    </div>
                    <p class="text-xs text-[#667267] line-clamp-2">${ev.observacoes || ev.pontosFortes || 'Avaliação registrada.'}</p>
                    <button 
                      type="button" 
                      onclick="ActaDiagnostic.viewEvaluationModal('${ev.id}')"
                      class="text-[11px] font-semibold text-[#2F5233] hover:underline pt-1 block"
                    >
                      Ver detalhes completos →
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      `;

      return html;
    },

    renderEvaluationDetails: function(ev) {
      return `
        <div class="pt-5 space-y-6">
          <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span class="font-bold uppercase tracking-wider text-[#2F5233] bg-[#EBF3ED] px-3 py-1 rounded-full border border-[#2F5233]/20">
              ${ev.title || 'Avaliação Diagnóstica'}
            </span>
            <span class="text-[#667267] font-medium">Realizada em: <strong>${ev.formattedDate || ev.date}</strong></span>
          </div>

          <!-- Grade Português & Matemática -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <!-- Português -->
            <div class="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8E2D5] space-y-3">
              <div class="flex items-center gap-2 border-b border-[#E8E2D5] pb-2">
                <i class="fa-solid fa-book-open text-[#A95337]"></i>
                <h4 class="text-xs font-bold uppercase tracking-wider text-[#28302A]">Português — Ponto de Partida</h4>
              </div>
              <div class="space-y-2 pt-1">
                ${this.PORTUGUES_ITEMS.map(item => {
                  const val = (ev.portugues && ev.portugues[item.key]) || 'desenvolvimento';
                  const st = this.STATUS_LABELS[val] || this.STATUS_LABELS.desenvolvimento;
                  return `
                    <div class="flex justify-between items-center text-xs">
                      <span class="text-[#28302A] font-medium">${item.label}</span>
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${st.color}">
                        ${st.label}
                      </span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Matemática -->
            <div class="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8E2D5] space-y-3">
              <div class="flex items-center gap-2 border-b border-[#E8E2D5] pb-2">
                <i class="fa-solid fa-calculator text-[#1E3A5F]"></i>
                <h4 class="text-xs font-bold uppercase tracking-wider text-[#28302A]">Matemática — Ponto de Partida</h4>
              </div>
              <div class="space-y-2 pt-1">
                ${this.MATEMATICA_ITEMS.map(item => {
                  const val = (ev.matematica && ev.matematica[item.key]) || 'desenvolvimento';
                  const st = this.STATUS_LABELS[val] || this.STATUS_LABELS.desenvolvimento;
                  return `
                    <div class="flex justify-between items-center text-xs">
                      <span class="text-[#28302A] font-medium">${item.label}</span>
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${st.color}">
                        ${st.label}
                      </span>
                    </div>
                  `;
                }).join('')}
              </div>
            </div>

          </div>

          <div class="planner-divider"></div>

          <!-- Resumo Pedagógico: Pontos Fortes, Atenção e Retomada -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Pontos Fortes -->
            <div class="p-4 rounded-xl bg-white border border-[#2F5233]/30 shadow-xs space-y-1.5">
              <span class="text-[10px] uppercase font-bold tracking-wider text-[#2F5233] flex items-center gap-1.5">
                <i class="fa-solid fa-circle-check"></i> Pontos Fortes
              </span>
              <p class="text-xs text-[#28302A] leading-relaxed">
                ${ev.pontosFortes || 'Leitura atenta e curiosidade pelo aprendizado.'}
              </p>
            </div>

            <!-- Pontos de Atenção -->
            <div class="p-4 rounded-xl bg-white border border-[#D97706]/30 shadow-xs space-y-1.5">
              <span class="text-[10px] uppercase font-bold tracking-wider text-[#D97706] flex items-center gap-1.5">
                <i class="fa-solid fa-triangle-exclamation"></i> Pontos de Atenção
              </span>
              <p class="text-xs text-[#28302A] leading-relaxed">
                ${ev.pontosAtencao || 'Consolidação de etapas mais longas de raciocínio.'}
              </p>
            </div>

            <!-- Conteúdos a Retomar -->
            <div class="p-4 rounded-xl bg-white border border-[#A95337]/30 shadow-xs space-y-1.5">
              <span class="text-[10px] uppercase font-bold tracking-wider text-[#A95337] flex items-center gap-1.5">
                <i class="fa-solid fa-rotate-right"></i> Conteúdos a Retomar
              </span>
              <p class="text-xs text-[#28302A] leading-relaxed">
                ${ev.conteudosRetomar || 'Revisão periódica de conceitos essenciais.'}
              </p>
            </div>
          </div>

          ${ev.observacoes ? `
            <div class="p-4 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] space-y-1">
              <span class="text-[10px] uppercase font-bold tracking-wider text-[#667267]">Observações do Responsável</span>
              <p class="text-xs text-[#28302A] leading-relaxed italic">"${ev.observacoes}"</p>
            </div>
          ` : ''}
        </div>
      `;
    },

    calculateAge: function(birthDateString) {
      if (!birthDateString) return '';
      const bDate = new Date(birthDateString);
      const now = new Date();
      let age = now.getFullYear() - bDate.getFullYear();
      const m = now.getMonth() - bDate.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < bDate.getDate())) {
        age--;
      }
      return `${age} anos`;
    },

    openNewEvaluationModal: function(childId) {
      const storage = window.ActaStorage;
      const person = childId ? storage.getPersonById(childId) : storage.getActivePerson();
      if (!person) return;

      const modal = document.getElementById('modalDiagnosticEval');
      if (!modal) return;

      document.getElementById('diagEvalChildId').value = person.id;
      document.getElementById('diagEvalChildName').textContent = person.name;
      document.getElementById('diagEvalDate').value = new Date().toISOString().split('T')[0];
      document.getElementById('diagEvalTitle').value = 'Avaliação Diagnóstica — Ponto de Partida';

      // Reset dos campos de texto
      document.getElementById('diagPontosFortes').value = '';
      document.getElementById('diagPontosAtencao').value = '';
      document.getElementById('diagConteudosRetomar').value = '';
      document.getElementById('diagObservacoes').value = '';

      modal.classList.remove('hidden');
    },

    saveEvaluationFromModal: function() {
      const storage = window.ActaStorage;
      const childId = document.getElementById('diagEvalChildId').value;
      const title = document.getElementById('diagEvalTitle').value || 'Avaliação Diagnóstica';
      const date = document.getElementById('diagEvalDate').value || new Date().toISOString().split('T')[0];

      const portugues = {};
      this.PORTUGUES_ITEMS.forEach(it => {
        const el = document.querySelector(`input[name="diag_port_${it.key}"]:checked`);
        portugues[it.key] = el ? el.value : 'desenvolvimento';
      });

      const matematica = {};
      this.MATEMATICA_ITEMS.forEach(it => {
        const el = document.querySelector(`input[name="diag_mat_${it.key}"]:checked`);
        matematica[it.key] = el ? el.value : 'desenvolvimento';
      });

      const pontosFortes = document.getElementById('diagPontosFortes').value.trim();
      const pontosAtencao = document.getElementById('diagPontosAtencao').value.trim();
      const conteudosRetomar = document.getElementById('diagConteudosRetomar').value.trim();
      const observacoes = document.getElementById('diagObservacoes').value.trim();

      const newEval = {
        personId: childId,
        title: title,
        date: date,
        portugues: portugues,
        matematica: matematica,
        pontosFortes: pontosFortes || 'Demonstrou prontidão e entusiasmo pelo aprendizado.',
        pontosAtencao: pontosAtencao,
        conteudosRetomar: conteudosRetomar,
        observacoes: observacoes
      };

      storage.saveEvaluation(newEval);

      // Fecha modal e atualiza a view
      document.getElementById('modalDiagnosticEval').classList.add('hidden');
      if (window.ActaApp && typeof window.ActaApp.renderAvaliacoesTab === 'function') {
        window.ActaApp.renderAvaliacoesTab();
      }
    }
  };

  window.ActaDiagnostic = ActaDiagnostic;
})(window);
