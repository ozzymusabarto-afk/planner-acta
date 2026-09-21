/**
 * PLANNER ACTA — Camada de Armazenamento e Estado Local
 * Persistência em localStorage com inicialização de dados demonstrativos acolhedores
 * alinhados ao conceito "caderno inteligente da família".
 */

(function(window) {
  'use strict';

  const STORAGE_KEY = 'ACTA_PLANNER_STORAGE_V2';

  // Dados iniciais enriquecidos inspirados diretamente no mockup
  const DEFAULT_SEED_DATA = {
    contextMode: 'Minha família',
    activeTheme: 'natureza',
    activePersonId: 'p1',
    people: [
      {
        id: 'p1',
        name: 'João',
        info: 'Explorador • 9 anos',
        avatar: '👦',
        role: 'Explorador',
        age: '9 anos',
        notes: 'Curioso com números, raciocínio lógico e experimentos práticos.'
      },
      {
        id: 'p2',
        name: 'Sofia',
        info: 'Exploradora • 7 anos',
        avatar: '👧',
        role: 'Exploradora',
        age: '7 anos',
        notes: 'Explorando leitura autônoma, histórias ilustradas e natureza.'
      }
    ],
    materials: [
      {
        id: 'm1',
        subject: 'Português',
        title: 'Língua Portuguesa',
        subtitle: '4º ano',
        author: 'Ed. Letras',
        themeColor: '#A95337', // Terracotta
        icon: 'fa-book',
        rawIndex: `1. Leitura e interpretação de textos\n1.1 Contos e fábulas\n1.2 Compreensão e sentido\n\n2. Classes de Palavras\n2.1 Substantivos próprios e comuns\n2.2 Adjetivos e qualificadores\n2.3 Artigos e concordância`,
        topics: [
          { id: 'tp1', level: 1, title: '1. Leitura e interpretação de textos', status: 'concluido' },
          { id: 'tp2', level: 2, title: '1.1 Contos e fábulas', status: 'concluido' },
          { id: 'tp3', level: 2, title: '1.2 Compreensão e sentido', status: 'concluido' },
          { id: 'tp4', level: 1, title: '2. Classes de Palavras', status: 'em_pratica' },
          { id: 'tp5', level: 2, title: '2.1 Substantivos próprios e comuns', status: 'concluido' },
          { id: 'tp6', level: 2, title: '2.2 Adjetivos e qualificadores', status: 'em_pratica' },
          { id: 'tp7', level: 2, title: '2.3 Artigos e concordância', status: 'pendente' }
        ]
      },
      {
        id: 'm2',
        subject: 'Matemática',
        title: 'A Matemática no Dia a Dia',
        subtitle: '4º ano',
        author: 'Prof. Silva',
        themeColor: '#1E3A5F', // Azul profundo
        icon: 'fa-calculator',
        rawIndex: `1. Números naturais\n1.1 Leitura e escrita dos números\n1.2 Comparação de números\n1.3 Ordem crescente e decrescente\n\n2. Adição\n2.1 Adição sem reserva\n2.2 Adição com reserva\n2.3 Problemas de adição\n\n3. Subtração\n3.1 Subtração sem empréstimo\n3.2 Subtração com empréstimo`,
        topics: [
          { id: 'tm1', level: 1, title: '1. Números naturais', status: 'concluido' },
          { id: 'tm2', level: 2, title: '1.1 Leitura e escrita dos números', status: 'concluido' },
          { id: 'tm3', level: 2, title: '1.2 Comparação de números', status: 'concluido' },
          { id: 'tm4', level: 2, title: '1.3 Ordem crescente e decrescente', status: 'concluido' },
          { id: 'tm5', level: 1, title: '2. Adição', status: 'em_pratica' },
          { id: 'tm6', level: 2, title: '2.1 Adição sem reserva', status: 'concluido' },
          { id: 'tm7', level: 2, title: '2.2 Adição com reserva', status: 'concluido' },
          { id: 'tm8', level: 2, title: '2.3 Problemas de adição', status: 'em_pratica' },
          { id: 'tm9', level: 1, title: '3. Subtração', status: 'pendente' },
          { id: 'tm10', level: 2, title: '3.1 Subtração sem empréstimo', status: 'pendente' },
          { id: 'tm11', level: 2, title: '3.2 Subtração com empréstimo', status: 'pendente' }
        ]
      },
      {
        id: 'm3',
        subject: 'Ciências',
        title: 'Natureza e Descobertas',
        subtitle: '4º ano',
        author: 'Instituto Saber',
        themeColor: '#2F5233', // Verde floresta
        icon: 'fa-seedling',
        rawIndex: `1. As Plantas\n1.1 Partes de uma planta\n1.2 Fotossíntese e luz solar\n1.3 Capítulo 3 — As plantas e o solo\n\n2. Matéria e Energia\n2.1 Estados físicos da matéria\n2.2 Mudanças de estado físico`,
        topics: [
          { id: 'tc1', level: 1, title: '1. As Plantas', status: 'concluido' },
          { id: 'tc2', level: 2, title: '1.1 Partes de uma planta', status: 'concluido' },
          { id: 'tc3', level: 2, title: '1.2 Fotossíntese e luz solar', status: 'concluido' },
          { id: 'tc4', level: 2, title: '1.3 Capítulo 3 — As plantas e o solo', status: 'concluido' },
          { id: 'tc5', level: 1, title: '2. Matéria e Energia', status: 'pendente' },
          { id: 'tc6', level: 2, title: '2.1 Estados físicos da matéria', status: 'pendente' },
          { id: 'tc7', level: 2, title: '2.2 Mudanças de estado físico', status: 'pendente' }
        ]
      },
      {
        id: 'm4',
        subject: 'História',
        title: 'Vida na Idade Média',
        subtitle: 'Volume único',
        author: 'Ed. Tempos',
        themeColor: '#8C472E', // Marrom quente
        icon: 'fa-landmark',
        rawIndex: `1. A Vida nos Castelos\n1.1 Castelos e aldeias\n1.2 O trabalho dos artesãos\n\n2. Comércio e Cidades`,
        topics: [
          { id: 'th1', level: 1, title: '1. A Vida nos Castelos', status: 'concluido' },
          { id: 'th2', level: 2, title: '1.1 Castelos e aldeias', status: 'concluido' },
          { id: 'th3', level: 2, title: '1.2 O trabalho dos artesãos', status: 'pendente' }
        ]
      },
      {
        id: 'm5',
        subject: 'Geografia',
        title: 'Regiões do Brasil',
        subtitle: 'Atlas e Estudos',
        author: 'Ed. Terra',
        themeColor: '#325B6C', // Azul ardósia
        icon: 'fa-earth-americas',
        rawIndex: `1. O Território Brasileiro\n1.1 As cinco regiões\n1.2 Paisagens e vegetação`,
        topics: [
          { id: 'tg1', level: 1, title: '1. O Território Brasileiro', status: 'concluido' },
          { id: 'tg2', level: 2, title: '1.1 As cinco regiões', status: 'concluido' },
          { id: 'tg3', level: 2, title: '1.2 Paisagens e vegetação', status: 'pendente' }
        ]
      }
    ],
    weekSchedule: [
      {
        dayKey: 'segunda',
        dayTitle: 'Segunda-feira',
        dateLabel: '15/09',
        items: [
          { subject: 'Português', content: 'Leitura e interpretação', materialId: 'm1', icon: 'fa-book' },
          { subject: 'Matemática', content: 'Adição com reserva', materialId: 'm2', icon: 'fa-calculator' },
          { subject: 'Ciências', content: 'Capítulo 3 — As plantas', materialId: 'm3', icon: 'fa-seedling' }
        ]
      },
      {
        dayKey: 'terca',
        dayTitle: 'Terça-feira',
        dateLabel: '16/09',
        items: [
          { subject: 'Português', content: 'Substantivos', materialId: 'm1', icon: 'fa-book' },
          { subject: 'Matemática', content: 'Problemas de adição', materialId: 'm2', icon: 'fa-calculator' },
          { subject: 'História', content: 'Vida na Idade Média', materialId: 'm4', icon: 'fa-landmark' }
        ]
      },
      {
        dayKey: 'quarta',
        dayTitle: 'Quarta-feira',
        dateLabel: '17/09',
        items: [
          { subject: 'Geografia', content: 'Regiões do Brasil', materialId: 'm5', icon: 'fa-earth-americas' }
        ]
      }
    ],
    achievements: [
      {
        id: 'ach1',
        title: 'Completou o capítulo 3 de Ciências.',
        date: '17/09',
        icon: 'fa-trophy',
        color: '#2F5233'
      },
      {
        id: 'ach2',
        title: 'Demonstrou boa compreensão em Matemática.',
        date: '16/09',
        icon: 'fa-lightbulb',
        color: '#D97706'
      },
      {
        id: 'ach3',
        title: 'Leitura independente (15 minutos).',
        date: '14/09',
        icon: 'fa-book-open-reader',
        color: '#325B6C'
      }
    ],
    records: [
      {
        id: 'rec1',
        personId: 'p1',
        personName: 'João',
        materialId: 'm2',
        subject: 'Matemática',
        contentTitle: 'Adição com reserva',
        activityType: 'Exercícios',
        result: 'compreendeu',
        date: '2025-09-17',
        formattedDate: '17 de setembro',
        autoSummary: 'Realizou exercícios e demonstrou compreensão.',
        notes: 'Fez cálculos com atenção e autonomia no caderno.',
        evidenceImg: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'rec2',
        personId: 'p1',
        personName: 'João',
        materialId: 'm1',
        subject: 'Português',
        contentTitle: 'Substantivos',
        activityType: 'Explicação + Exercícios',
        result: 'compreendeu',
        date: '2025-09-16',
        formattedDate: '16 de setembro',
        autoSummary: 'Classificou palavras e identificou sua função.',
        notes: 'Diferenciou substantivos comuns e próprios com facilidade.',
        evidenceImg: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'rec3',
        personId: 'p1',
        personName: 'João',
        materialId: 'm3',
        subject: 'Ciências',
        contentTitle: 'Capítulo 3 — As plantas',
        activityType: 'Atividade prática',
        result: 'compreendeu',
        date: '2025-09-14',
        formattedDate: '14 de setembro',
        autoSummary: 'Fez anotações e participou da atividade prática.',
        notes: 'Observou as folhas de um vaso e desenhou as partes da raiz e caule.',
        evidenceImg: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=80'
      },
      {
        id: 'rec4',
        personId: 'p1',
        personName: 'João',
        materialId: 'm1',
        subject: 'Português',
        contentTitle: 'Leitura de "O Pequeno Príncipe"',
        activityType: 'Leitura',
        result: 'compreendeu',
        date: '2025-09-12',
        formattedDate: '12 de setembro',
        autoSummary: 'Leitura livre e compartilhamento de impressões.',
        notes: 'Leu dois capítulos com ótima fluência.',
        evidenceImg: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80'
      }
    ]
  };

  const ActaStorage = {
    getData: function() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          // Migração limpa ou primeira carga
          this.saveData(DEFAULT_SEED_DATA);
          return JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
        }
        const parsed = JSON.parse(raw);
        if (!parsed.people || parsed.people.length === 0) parsed.people = DEFAULT_SEED_DATA.people;
        if (!parsed.materials || parsed.materials.length === 0) parsed.materials = DEFAULT_SEED_DATA.materials;
        if (!parsed.records) parsed.records = [];
        if (!parsed.weekSchedule) parsed.weekSchedule = DEFAULT_SEED_DATA.weekSchedule;
        if (!parsed.achievements) parsed.achievements = DEFAULT_SEED_DATA.achievements;
        return parsed;
      } catch (e) {
        console.error('Erro ao ler localStorage:', e);
        return JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
      }
    },

    saveData: function(data) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (e) {
        console.error('Erro ao salvar no localStorage:', e);
      }
    },

    resetToDefaults: function() {
      this.saveData(DEFAULT_SEED_DATA);
      return JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
    },

    // Pessoas / Crianças
    getPeople: function() {
      return this.getData().people || [];
    },

    getActivePerson: function() {
      const data = this.getData();
      const person = data.people.find(p => p.id === data.activePersonId);
      return person || data.people[0] || null;
    },

    setActivePerson: function(id) {
      const data = this.getData();
      data.activePersonId = id;
      this.saveData(data);
    },

    addPerson: function(person) {
      const data = this.getData();
      if (!person.id) person.id = 'p_' + Date.now();
      data.people.push(person);
      if (!data.activePersonId) data.activePersonId = person.id;
      this.saveData(data);
      return person;
    },

    // Materiais / Biblioteca
    getMaterials: function() {
      return this.getData().materials || [];
    },

    getMaterialById: function(id) {
      return (this.getData().materials || []).find(m => m.id === id) || null;
    },

    saveMaterial: function(material) {
      const data = this.getData();
      const idx = data.materials.findIndex(m => m.id === material.id);
      if (idx >= 0) {
        data.materials[idx] = material;
      } else {
        if (!material.id) material.id = 'mat_' + Date.now();
        data.materials.push(material);
      }
      this.saveData(data);
      return material;
    },

    deleteMaterial: function(id) {
      const data = this.getData();
      data.materials = data.materials.filter(m => m.id !== id);
      this.saveData(data);
    },

    // Semana / Planejamento
    getWeekSchedule: function() {
      return this.getData().weekSchedule || DEFAULT_SEED_DATA.weekSchedule;
    },

    saveWeekSchedule: function(schedule) {
      const data = this.getData();
      data.weekSchedule = schedule;
      this.saveData(data);
    },

    // Registros
    getRecords: function(personId) {
      const records = this.getData().records || [];
      if (personId && personId !== 'all') {
        return records.filter(r => r.personId === personId);
      }
      return records;
    },

    addRecord: function(record) {
      const data = this.getData();
      if (!record.id) record.id = 'rec_' + Date.now();
      if (!record.date) {
        record.date = new Date().toISOString().split('T')[0];
      }

      // Adiciona no início (mais recente primeiro)
      data.records.unshift(record);

      // Atualiza o status do tópico no material
      if (record.materialId && record.contentTitle) {
        const mat = data.materials.find(m => m.id === record.materialId);
        if (mat && mat.topics) {
          const topic = mat.topics.find(t => t.title.toLowerCase().includes(record.contentTitle.toLowerCase()));
          if (topic) {
            topic.status = record.result === 'compreendeu' ? 'concluido' : (record.result === 'em_pratica' ? 'em_pratica' : 'revisar');
          }
        }
      }

      // Adiciona uma conquista se for de destaque
      if (record.result === 'compreendeu') {
        data.achievements.unshift({
          id: 'ach_' + Date.now(),
          title: `Demonstrou boa compreensão em ${record.subject}.`,
          date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          icon: 'fa-check',
          color: '#2F5233'
        });
      }

      this.saveData(data);
      return record;
    },

    deleteRecord: function(id) {
      const data = this.getData();
      data.records = data.records.filter(r => r.id !== id);
      this.saveData(data);
    },

    // Conquistas
    getAchievements: function() {
      return this.getData().achievements || [];
    },

    // Contexto e Tema
    getContextMode: function() {
      return this.getData().contextMode || 'Minha família';
    },

    setContextMode: function(mode) {
      const data = this.getData();
      data.contextMode = mode;
      this.saveData(data);
    },

    getActiveTheme: function() {
      return this.getData().activeTheme || 'natureza';
    },

    setActiveTheme: function(theme) {
      const data = this.getData();
      data.activeTheme = theme;
      this.saveData(data);
    }
  };

  window.ActaStorage = ActaStorage;
})(window);
