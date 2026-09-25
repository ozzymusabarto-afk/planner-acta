/**
 * PLANNER ACTA — Calendário Visual Familiar
 * Visão panorâmica e acolhedora da rotina familiar (sem conceitos de "dias letivos" ou grade escolar).
 * Destaca visualmente fins de semana, feriados nacionais, períodos de férias, recessos e viagens.
 */

(function(window) {
  'use strict';

  const ActaCalendar = {
    currentDate: new Date(),
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear(),

    // Feriados nacionais e datas celebrativas com tratamento estético acolhedor
    HOLIDAYS: {
      '01-01': 'Ano Novo',
      '04-21': 'Tiradentes',
      '05-01': 'Dia do Trabalho',
      '09-07': 'Independência do Brasil',
      '10-12': 'N. Sra. Aparecida / Dia das Crianças',
      '11-02': 'Finados',
      '11-15': 'Proclamação da República',
      '12-25': 'Natal'
    },

    EVENT_TYPES: {
      ferias: { label: 'Férias', color: 'bg-[#EBF3ED] text-[#2F5233] border-[#2F5233]/30', dot: '#2F5233', icon: 'fa-umbrella-beach' },
      recesso: { label: 'Recesso', color: 'bg-[#FEF3C7] text-[#D97706] border-[#D97706]/30', dot: '#D97706', icon: 'fa-mug-hot' },
      viagem: { label: 'Viagem em Família', color: 'bg-[#E0F2FE] text-[#0284C7] border-[#0284C7]/30', dot: '#0284C7', icon: 'fa-plane' },
      especial: { label: 'Data Especial', color: 'bg-[#FAF5FF] text-[#7C3AED] border-[#7C3AED]/30', dot: '#7C3AED', icon: 'fa-star' }
    },

    MONTH_NAMES: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],

    WEEKDAY_NAMES: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],

    renderCalendarHTML: function() {
      const storage = window.ActaStorage;
      if (!storage) return '';

      const events = storage.getCalendarEvents();
      const year = this.selectedYear;
      const month = this.selectedMonth;

      // Primeiro dia do mês e total de dias
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const prevMonthDays = new Date(year, month, 0).getDate();

      const today = new Date();
      const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

      let html = `
        <div class="space-y-6">
          
          <!-- Barra de Navegação do Mês e Ações -->
          <div class="planner-card p-4 sm:p-5 bg-white border border-[#E8E2D5] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] flex items-center justify-center text-[#2F5233] text-lg font-bold">
                <i class="fa-regular fa-calendar-days"></i>
              </div>
              <div>
                <h3 class="font-editorial-title text-xl font-bold text-[#28302A]">
                  ${this.MONTH_NAMES[month]} <span class="font-sans text-base font-normal text-[#667267]">${year}</span>
                </h3>
                <span class="text-xs text-[#667267]">Calendário visual da família • Sem burocracia escolar</span>
              </div>
            </div>

            <div class="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-start">
              <div class="flex items-center bg-[#FAF7F0] border border-[#E8E2D5] rounded-full p-1 shadow-2xs">
                <button 
                  type="button" 
                  onclick="ActaCalendar.prevMonth()" 
                  class="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white text-[#28302A] transition"
                  title="Mês anterior"
                >
                  <i class="fa-solid fa-chevron-left text-[11px]"></i>
                </button>
                <button 
                  type="button" 
                  onclick="ActaCalendar.goToToday()" 
                  class="px-3 text-xs font-semibold text-[#28302A] hover:text-[#2F5233] transition"
                >
                  Hoje
                </button>
                <button 
                  type="button" 
                  onclick="ActaCalendar.nextMonth()" 
                  class="w-7 h-7 rounded-full flex items-center justify-center hover:bg-white text-[#28302A] transition"
                  title="Próximo mês"
                >
                  <i class="fa-solid fa-chevron-right text-[11px]"></i>
                </button>
              </div>

              <button 
                type="button" 
                onclick="ActaCalendar.openPeriodModal()"
                class="hero-btn-green text-xs font-semibold px-4 py-2 rounded-full shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <i class="fa-solid fa-plus text-[10px]"></i>
                <span>Marcar período</span>
              </button>
            </div>
          </div>

          <!-- Grade Visual do Calendário Familiar -->
          <div class="planner-card p-4 sm:p-6 bg-white border border-[#E8E2D5] shadow-xs">
            
            <!-- Dias da Semana (Destaque nos Fins de Semana) -->
            <div class="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
              ${this.WEEKDAY_NAMES.map((w, idx) => {
                const isWeekend = idx === 0 || idx === 6;
                return `
                  <div class="py-2 text-[11px] uppercase tracking-wider font-bold ${isWeekend ? 'text-[#A95337] bg-[#FAF7F0]/60 rounded-lg' : 'text-[#667267]'}">
                    ${w}
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Células dos Dias -->
            <div class="grid grid-cols-7 gap-1 sm:gap-2">
      `;

      // Dias do mês anterior
      for (let i = firstDay - 1; i >= 0; i--) {
        const d = prevMonthDays - i;
        html += `
          <div class="min-h-[75px] sm:min-h-[90px] p-1.5 rounded-xl bg-[#FAF7F0]/30 border border-transparent text-[#CBD5E1] text-xs">
            <span class="font-medium">${d}</span>
          </div>
        `;
      }

      // Dias do mês atual
      for (let day = 1; day <= daysInMonth; day++) {
        const dayDate = new Date(year, month, day);
        const dayOfWeek = dayDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isToday = isCurrentMonth && today.getDate() === day;

        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const holidayKey = `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const holiday = this.HOLIDAYS[holidayKey] || null;

        // Verificar períodos que abrangem este dia
        const matchingEvents = events.filter(ev => {
          if (!ev.startDate || !ev.endDate) return false;
          return dateStr >= ev.startDate && dateStr <= ev.endDate;
        });

        // Estilos da Célula
        let cellBg = isWeekend ? 'bg-[#FAF7F0]/70' : 'bg-white';
        let cellBorder = isToday ? 'border-2 border-[#2F5233]' : 'border border-[#E8E2D5]/80';
        let numberClass = isToday 
          ? 'w-6 h-6 rounded-full bg-[#2F5233] text-white flex items-center justify-center font-bold text-xs' 
          : (isWeekend ? 'text-[#A95337] font-bold text-xs' : 'text-[#28302A] font-semibold text-xs');

        html += `
          <div class="min-h-[75px] sm:min-h-[90px] p-1.5 rounded-xl ${cellBg} ${cellBorder} flex flex-col justify-between hover:border-[#2F5233]/40 transition group">
            <div class="flex justify-between items-start">
              <span class="${numberClass}">${day}</span>
              ${holiday ? `
                <span class="text-[9px] bg-[#FBECE8] text-[#A95337] px-1 rounded truncate max-w-[65px]" title="${holiday}">
                  ${holiday}
                </span>
              ` : ''}
            </div>

            <!-- Marcadores de Períodos da Família -->
            <div class="space-y-1 mt-1">
              ${matchingEvents.map(ev => {
                const conf = this.EVENT_TYPES[ev.type] || this.EVENT_TYPES.especial;
                return `
                  <div class="text-[10px] px-1.5 py-0.5 rounded truncate font-medium border ${conf.color}" title="${ev.title}: ${ev.notes || ''}">
                    <i class="fa-solid ${conf.icon} text-[8px] mr-0.5"></i>
                    <span>${ev.title}</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }

      html += `
            </div>
          </div>

          <!-- Legenda Visual e Lista de Períodos Marcados -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            <!-- Legenda -->
            <div class="planner-card p-4 bg-white border border-[#E8E2D5] space-y-3 shadow-xs">
              <h4 class="text-xs font-bold uppercase tracking-wider text-[#28302A] flex items-center gap-2">
                <span class="planner-bullet"></span>
                <span>Legenda do Calendário</span>
              </h4>
              <div class="space-y-2 text-xs">
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-[#A95337]/20 border border-[#A95337] shrink-0"></span>
                  <span class="text-[#28302A]">Fins de Semana & Feriados</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-[#2F5233] shrink-0"></span>
                  <span class="text-[#28302A]">Dia de Hoje</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-[#EBF3ED] border border-[#2F5233] shrink-0"></span>
                  <span class="text-[#28302A]">Férias / Descanso</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 rounded-full bg-[#E0F2FE] border border-[#0284C7] shrink-0"></span>
                  <span class="text-[#28302A]">Viagens em Família</span>
                </div>
              </div>
            </div>

            <!-- Lista de Períodos Especiais -->
            <div class="md:col-span-2 planner-card p-4 bg-white border border-[#E8E2D5] space-y-3 shadow-xs">
              <div class="flex justify-between items-center">
                <h4 class="text-xs font-bold uppercase tracking-wider text-[#28302A] flex items-center gap-2">
                  <span class="planner-bullet"></span>
                  <span>Períodos Especiais da Família</span>
                </h4>
                <button type="button" onclick="ActaCalendar.openPeriodModal()" class="text-xs font-semibold text-[#2F5233] hover:underline">
                  + Adicionar período
                </button>
              </div>

              ${events.length === 0 ? `
                <p class="text-xs text-[#667267] italic py-2">Nenhum período de férias ou viagem cadastrado.</p>
              ` : `
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  ${events.map(ev => {
                    const conf = this.EVENT_TYPES[ev.type] || this.EVENT_TYPES.especial;
                    return `
                      <div class="p-3 rounded-xl bg-[#FAF7F0] border border-[#E8E2D5] flex items-start justify-between gap-2">
                        <div class="space-y-1">
                          <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${conf.color}">
                            ${conf.label}
                          </span>
                          <h5 class="text-xs font-bold text-[#28302A] pt-1">${ev.title}</h5>
                          <span class="text-[11px] text-[#667267] block">${this.formatDateRange(ev.startDate, ev.endDate)}</span>
                          ${ev.notes ? `<p class="text-[10px] text-[#8E9A8F] italic">${ev.notes}</p>` : ''}
                        </div>
                        <button 
                          type="button" 
                          onclick="ActaCalendar.deletePeriod('${ev.id}')"
                          class="text-[#8E9A8F] hover:text-[#A95337] text-xs p-1"
                          title="Remover período"
                        >
                          <i class="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    `;
                  }).join('')}
                </div>
              `}
            </div>

          </div>

        </div>
      `;

      return html;
    },

    formatDateRange: function(startStr, endStr) {
      if (!startStr) return '';
      const p1 = startStr.split('-');
      const d1 = `${p1[2]}/${p1[1]}`;
      if (!endStr || startStr === endStr) return d1;
      const p2 = endStr.split('-');
      const d2 = `${p2[2]}/${p2[1]}`;
      return `${d1} → ${d2}`;
    },

    prevMonth: function() {
      if (this.selectedMonth === 0) {
        this.selectedMonth = 11;
        this.selectedYear--;
      } else {
        this.selectedMonth--;
      }
      this.refresh();
    },

    nextMonth: function() {
      if (this.selectedMonth === 11) {
        this.selectedMonth = 0;
        this.selectedYear++;
      } else {
        this.selectedMonth++;
      }
      this.refresh();
    },

    goToToday: function() {
      const now = new Date();
      this.selectedMonth = now.getMonth();
      this.selectedYear = now.getFullYear();
      this.refresh();
    },

    refresh: function() {
      const container = document.getElementById('calendarContentContainer');
      if (container) {
        container.innerHTML = this.renderCalendarHTML();
      }
    },

    openPeriodModal: function() {
      const modal = document.getElementById('modalCalendarPeriod');
      if (!modal) return;
      document.getElementById('calPeriodTitle').value = '';
      document.getElementById('calPeriodStartDate').value = new Date().toISOString().split('T')[0];
      document.getElementById('calPeriodEndDate').value = '';
      document.getElementById('calPeriodNotes').value = '';
      modal.classList.remove('hidden');
    },

    savePeriodFromModal: function() {
      const storage = window.ActaStorage;
      const title = document.getElementById('calPeriodTitle').value.trim();
      const type = document.getElementById('calPeriodType').value || 'ferias';
      const startDate = document.getElementById('calPeriodStartDate').value;
      const endDate = document.getElementById('calPeriodEndDate').value || startDate;
      const notes = document.getElementById('calPeriodNotes').value.trim();

      if (!title || !startDate) {
        alert('Por favor, informe o título e a data de início do período.');
        return;
      }

      storage.saveCalendarEvent({
        title: title,
        type: type,
        startDate: startDate,
        endDate: endDate,
        notes: notes
      });

      document.getElementById('modalCalendarPeriod').classList.add('hidden');
      this.refresh();
    },

    deletePeriod: function(id) {
      if (confirm('Deseja remover este período do calendário?')) {
        window.ActaStorage.deleteCalendarEvent(id);
        this.refresh();
      }
    }
  };

  window.ActaCalendar = ActaCalendar;
})(window);
