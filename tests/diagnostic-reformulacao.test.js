/**
 * Testes Automatizados da Reformulação do Módulo de Diagnóstico Pedagógico do ACTA
 * tests/diagnostic-reformulacao.test.js
 */
const fs = require('fs');
const path = require('path');

// 1. Mock do ambiente browser (window, document, localStorage)
const mockStorageData = {
  people: [
    { id: 'p1', name: 'João', birthDate: '2018-05-10', grade: '2º Ano Fundamental' },
    { id: 'p2', name: 'Sofia', birthDate: '2022-02-15', grade: 'Educação Infantil' }
  ],
  evaluations: [
    {
      id: 'eval_1',
      personId: 'p1',
      personName: 'João',
      date: '2025-08-10',
      evaluator: 'Família',
      title: 'Diagnóstico Inicial de Entrada',
      portugues: {
        leitura: 'Consolidado',
        compreensao: 'Em desenvolvimento',
        escrita: 'Em desenvolvimento',
        vocabulario: 'Consolidado'
      },
      matematica: {
        raciocinio: 'Consolidado',
        operacoes: 'Iniciando / Retomar',
        problemas: 'Em desenvolvimento',
        calculo: 'Iniciando / Retomar'
      },
      summaryStrengths: 'Excelente curiosidade, prontidão e gosto por narrativas orais.',
      summaryRetomar: 'Fatos básicos de adição e pontuação de frases.',
      summaryNotes: 'Aprende muito bem através do diálogo socrático e manuseio de materiais concretos.'
    }
  ]
};

let store = JSON.parse(JSON.stringify(mockStorageData));

global.window = global;
global.document = {
  getElementById: (id) => ({
    value: '',
    innerHTML: '',
    textContent: '',
    classList: { add: () => {}, remove: () => {}, contains: () => false },
    querySelectorAll: () => []
  }),
  querySelectorAll: () => []
};
global.localStorage = {
  getItem: (key) => JSON.stringify(store),
  setItem: (key, val) => { store = JSON.parse(val); },
  removeItem: () => {}
};

// Carrega os módulos
const diagnosticPath = path.resolve('c:/Users/AdriGurumi/Desktop/planner.html/js/diagnostic.js');
const reportsPath = path.resolve('c:/Users/AdriGurumi/Desktop/planner.html/js/reports.js');

// Mock ActaStorage
global.ActaStorage = {
  getData: () => store,
  getPeople: () => store.people,
  getPersonById: (id) => store.people.find(p => p.id === id),
  getActivePerson: () => store.people[0],
  getEvaluations: (personId) => personId ? store.evaluations.filter(e => e.personId === personId) : store.evaluations,
  getEvaluationById: (id) => store.evaluations.find(e => e.id === id),
  saveEvaluation: (data) => {
    if (!data.id) data.id = 'eval_' + Date.now();
    const idx = store.evaluations.findIndex(e => e.id === data.id);
    if (idx >= 0) store.evaluations[idx] = data;
    else store.evaluations.unshift(data);
    return data;
  },
  deleteEvaluation: (id) => {
    store.evaluations = store.evaluations.filter(e => e.id !== id);
  }
};

eval(fs.readFileSync(diagnosticPath, 'utf8'));
eval(fs.readFileSync(reportsPath, 'utf8'));

console.log('--- INICIANDO SUÍTE DE TESTES DA REFORMULAÇÃO DO DIAGNÓSTICO ACTA ---');

let passed = 0;
let total = 0;

function assert(condition, testName) {
  total++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passed++;
  } else {
    console.error(`[FAIL] ${testName}`);
  }
}

// Teste 1: 8 Eixos de Desenvolvimento presentes
assert(Object.keys(ActaDiagnostic.AXES).length === 8, 'Existem exatamente 8 Eixos de Desenvolvimento');
assert(ActaDiagnostic.AXES['linguagem'] !== undefined, 'Eixo Linguagem e Expressão existe');
assert(ActaDiagnostic.AXES['convivencia'] !== undefined, 'Eixo Convivência/Escolhas existe');

// Teste 2: 6 Estados de Observação presentes
assert(Object.keys(ActaDiagnostic.STATES).length === 6, 'Existem exatamente 6 Estados de Observação');
assert(ActaDiagnostic.STATES.sozinho && ActaDiagnostic.STATES.sozinho_varia && ActaDiagnostic.STATES.com_ajuda && ActaDiagnostic.STATES.comecando_parcial && ActaDiagnostic.STATES.nao_apareceu && ActaDiagnostic.STATES.nao_observei, 'Todos os 6 estados são nomeados conforme a especificação');

// Teste 3: 4 Fases de Referência, cada uma com 7 atividades (28 atividades no total)
assert(Object.keys(ActaDiagnostic.PHASES).length === 4, 'Existem exatamente 4 Fases de Referência');
for (const [phaseKey, phase] of Object.entries(ActaDiagnostic.PHASES)) {
  assert(phase.activities.length === 7, `Fase ${phaseKey} possui exatamente 7 propostas lúdicas/atividades`);
  for (const act of phase.activities) {
    assert(act.signals && act.signals.length >= 2, `Atividade ${act.id} tem pelo menos 2 sinais observáveis`);
  }
}

// Teste 4: Cálculo de Idade e Sugestão de Fase
const ageP1 = ActaDiagnostic.calculateAge('2018-05-10');
assert(ageP1 >= 7 && ageP1 <= 9, `Cálculo de idade correto (João tem ~${ageP1} anos)`);
assert(ActaDiagnostic.suggestPhaseForAge(ageP1) === 'fase_3', 'Idade de 8 anos sugere Fase 3 (fase_3)');
assert(ActaDiagnostic.suggestPhaseForAge(4) === 'fase_1', 'Idade de 4 anos sugere Fase 1 (fase_1)');
assert(ActaDiagnostic.suggestPhaseForAge(6) === 'fase_2', 'Idade de 6 anos sugere Fase 2 (fase_2)');
assert(ActaDiagnostic.suggestPhaseForAge(12) === 'fase_4', 'Idade de 12 anos sugere Fase 4 (fase_4)');

// Teste 5: Motor de Síntese Qualitativa Pedagógica
const sampleObservations = {
  'f3_s1_narrar': 'sozinho',
  'f3_s2_escuta': 'sozinho',
  'f3_s3_compreensao': 'com_ajuda',
  'f3_s4_leitura_silenciosa': 'com_ajuda',
  'f3_s5_copia_caligrafia': 'nao_apareceu',
  'f3_s6_escrever_ideias': 'nao_observei',
  'f3_s7_fatos_basicos': 'com_ajuda',
  'f3_s8_problema_rotina': 'sozinho'
};

ActaDiagnostic.wizard = {
  childId: 'p1',
  phaseId: 'fase_3',
  currentStep: 9,
  date: '2026-10-08',
  evaluator: 'Família',
  evalId: 'eval_teste_2026',
  isDraft: false,
  observations: sampleObservations,
  activityNotes: { 1: 'Gostou muito da história narrada.' },
  activityContext: {},
  learningProfile: { strengths: [], strengthsExample: '', supports: [], supportsNote: '', challenges: [], challengeContexts: [], challengesNote: '' },
  wellnessContext: { sleep: '', appetite: '', sensory: '', energy: '', notes: '' },
  familyNotes: 'Observação feita num sábado à tarde de forma tranquila.',
  customSummary: null
};

const synthesis = ActaDiagnostic.generateSynthesis();
assert(synthesis.strengthsText && synthesis.strengthsText.length > 10, 'Síntese gerou seção "O que já está firme"');
assert(synthesis.strengthenNowText && synthesis.strengthenNowText.length > 10, 'Síntese gerou seção "O que precisa ser fortalecido"');
assert(synthesis.nextStepsText && synthesis.nextStepsText.length > 10, 'Síntese gerou seção "Qual pode ser o próximo passo"');
assert(synthesis.exploreLaterText && synthesis.exploreLaterText.length > 10, 'Síntese gerou base posterior/anterior a observar');

// Teste 6: Salvar e Concluir Avaliação (Schema v2)
ActaDiagnostic.wizard.customSummary = synthesis;
ActaDiagnostic.concludeEvaluation();

const savedEval = store.evaluations.find(e => e.id === 'eval_teste_2026');
assert(savedEval !== undefined, 'Avaliação salva com sucesso no repositório');
assert(savedEval.schemaVersion === 2, 'Avaliação gravada com schemaVersion: 2');
assert(savedEval.axesSummary !== undefined, 'Avaliação possui contadores agregados por eixo');
assert(savedEval.summaryStrengths && savedEval.summaryRetomar && savedEval.portugues, 'Compatibilidade retroativa com campos legados populada');

// Teste 7: Renderização Dual-Mode da Lista
const listHtml = ActaDiagnostic.renderEvaluationsListHTML('p1');
assert(listHtml.includes('eval_teste_2026'), 'Lista exibe a nova avaliação v2');
assert(listHtml.includes('eval_1'), 'Lista continua exibindo a avaliação histórica eval_1');
assert(listHtml.includes('Fase 3') || listHtml.includes('Eixos'), 'Exibe as tags e títulos pedagógicos');

// Teste 8: Renderização do Dossiê com Schema 2 e Legado
const dossieResumido = ActaReports.generateDossieHTML({ personId: 'p1', type: 'resumido' });
assert(dossieResumido.includes('O que já está firme'), 'Dossiê Resumido exibe os blocos da síntese para avaliação Schema 2');

const dossieCompleto = ActaReports.generateDossieHTML({ personId: 'p1', type: 'completo' });
assert(dossieCompleto.includes('Diagnóstico Pedagógico Formativo'), 'Dossiê Completo renderiza a seção rica v2');
assert(dossieCompleto.includes('Próximo passo sem pressa'), 'Dossiê Completo exibe "Próximo passo sem pressa"');

// Teste 9: Dossiê com apenas avaliação Legada
store.evaluations = store.evaluations.filter(e => e.id !== 'eval_teste_2026');
const dossieLegado = ActaReports.generateDossieHTML({ personId: 'p1', type: 'completo' });
assert(dossieLegado.includes('Linguagem & Expressão (Português)'), 'Dossiê de avaliação legada preserva as caixas originais');
assert(dossieLegado.includes('Pontos Fortes:'), 'Dossiê legado exibe Pontos Fortes original');

console.log(`\n--- RESULTADO: ${passed}/${total} TESTES PASSARAM COM SUCESSO! ---`);
process.exit(passed === total ? 0 : 1);
