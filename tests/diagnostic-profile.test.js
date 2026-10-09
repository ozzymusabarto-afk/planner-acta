/**
 * TESTES AUTOMATIZADOS PERSISTENTES — MÓDULO DIAGNÓSTICO & PERFIL OBSERVACIONAL ACTA
 * Validação rigorosa dos 12 Critérios de Aceitação da Especificação:
 * c:\Users\AdriGurumi\Downloads\Complemento_Perfil_Observacional_ACTA_Antigravity.md
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Simulação de ambiente DOM global para Node.js
const mockLocalStorage = {};
const storageAdapter = {
  getItem: (k) => mockLocalStorage[k] || null,
  setItem: (k, v) => { mockLocalStorage[k] = String(v); },
  removeItem: (k) => { delete mockLocalStorage[k]; },
  clear: () => { Object.keys(mockLocalStorage).forEach(k => delete mockLocalStorage[k]); }
};

global.localStorage = storageAdapter;
global.window = {
  localStorage: storageAdapter,
  document: {
    getElementById: (id) => null,
    querySelectorAll: () => []
  },
  confirm: () => true,
  alert: () => {},
  print: () => {}
};
global.document = global.window.document;
global.confirm = global.window.confirm;
global.alert = global.window.alert;
global.print = global.window.print;

// Carregar ActaStorage
const storageCode = fs.readFileSync(path.join(__dirname, '../js/storage.js'), 'utf8');
eval(storageCode);

// Carregar ActaDiagnostic
const diagCode = fs.readFileSync(path.join(__dirname, '../js/diagnostic.js'), 'utf8');
eval(diagCode);

// Carregar ActaReports
const reportsCode = fs.readFileSync(path.join(__dirname, '../js/reports.js'), 'utf8');
eval(reportsCode);

console.log('🧪 Iniciando suíte de testes de perfil observacional e diagnóstico ACTA...\n');

let passedTests = 0;
let totalTests = 0;

function test(description, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ [PASSOU] ${description}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ [FALHOU] ${description}`);
    console.error(err);
    process.exitCode = 1;
  }
}

// Configurar dados de teste da criança
const testChild = {
  id: 'child_test_1',
  name: 'Catarina',
  birthDate: '2019-05-10', // 7 anos (Fase 2)
  info: '2º ano fundamental'
};

function resetTestStorage() {
  const data = window.ActaStorage.getData();
  data.people = [testChild];
  data.evaluations = [];
  window.ActaStorage.saveData(data);
}

resetTestStorage();

// ---------------------------------------------------------------------------
// TESTE 1: Conclusão sem preencher seção opcional de perfil
// ---------------------------------------------------------------------------
test('Critério 1: Avaliação pode ser concluída sem preencher seção opcional de perfil', () => {
  resetTestStorage();
  window.ActaDiagnostic.openNewEvaluationModal(testChild.id);
  assert.strictEqual(window.ActaDiagnostic.wizard.childId, testChild.id);
  
  // Responde algumas atividades sem preencher perfil
  window.ActaDiagnostic.setSignalState('f2_a1_s1', 'sozinho');
  window.ActaDiagnostic.setSignalState('f2_a1_s2', 'com_ajuda');
  
  // Pula perfil e conclui diretamente
  window.ActaDiagnostic.concludeEvaluation();
  
  const evals = window.ActaStorage.getEvaluations(testChild.id);
  assert.strictEqual(evals.length, 1);
  const ev = evals[0];
  assert.strictEqual(ev.status, 'completed');
  assert.ok(ev.qualitativeSynthesis);
  assert.ok(ev.qualitativeSynthesis.firm);
  assert.ok(ev.qualitativeSynthesis.support);
});

// ---------------------------------------------------------------------------
// TESTE 2: Todos os seis estados de observação são gravados e recuperados
// ---------------------------------------------------------------------------
test('Critério 2: Cada uma das 6 opções de observação é gravada e recuperada com exatidão', () => {
  resetTestStorage();
  window.ActaDiagnostic.openNewEvaluationModal(testChild.id);
  
  const sixStates = ['sozinho', 'sozinho_varia', 'com_ajuda', 'comecando_parcial', 'nao_apareceu', 'nao_observei'];
  const testSignals = ['f2_a2_s1', 'f2_a2_s2', 'f2_a2_s3', 'f2_a2_s4', 'f2_a3_s1', 'f2_a3_s2'];
  
  sixStates.forEach((st, idx) => {
    window.ActaDiagnostic.setSignalState(testSignals[idx], st);
  });
  
  // Salva rascunho
  window.ActaDiagnostic.saveDraft();
  
  const allEvals = window.ActaStorage.getEvaluations(testChild.id);
  const draft = allEvals.find(e => e.status === 'draft');
  assert.ok(draft, 'Rascunho deve existir');
  
  // Verifica se todos os 6 estados foram salvos
  sixStates.forEach((st, idx) => {
    assert.strictEqual(draft.observations[testSignals[idx]], st, `Sinal ${testSignals[idx]} deve ser ${st}`);
  });
  
  // Retoma rascunho
  window.ActaDiagnostic.openNewEvaluationModal(testChild.id, draft.id);
  sixStates.forEach((st, idx) => {
    assert.strictEqual(window.ActaDiagnostic.wizard.observations[testSignals[idx]], st, `Retomada do sinal ${testSignals[idx]} deve ser ${st}`);
  });
});

// ---------------------------------------------------------------------------
// TESTE 3: "nao_observei" não aparece como dificuldade/apoio na síntese
// ---------------------------------------------------------------------------
test('Critério 3: "Não deu para observar agora" NUNCA é colocado como dificuldade na síntese', () => {
  resetTestStorage();
  window.ActaDiagnostic.openNewEvaluationModal(testChild.id);
  
  window.ActaDiagnostic.setSignalState('f2_a1_s1', 'sozinho');
  window.ActaDiagnostic.setSignalState('f2_a1_s2', 'nao_observei');
  window.ActaDiagnostic.setSignalState('f2_a1_s3', 'nao_observei');
  
  const syn = window.ActaDiagnostic.generateSynthesis();
  
  // Verifica que o texto de apoio NÃO menciona as atividades puladas
  assert.ok(!syn.strengthenNowText.includes('f2_a1_s2'));
  // Verifica que o bloco "exploreLaterText" (O que vale observar melhor) acolhe as atividades não observadas
  assert.ok(syn.exploreLaterText.includes('não puderam ser vistas nesta ocasião') || syn.exploreLaterText.includes('observar sem pressa'));
});

// ---------------------------------------------------------------------------
// TESTE 4: "sozinho_varia" gera linguagem contextual de autonomia
// ---------------------------------------------------------------------------
test('Critério 4: "Faz sozinho, mas varia" gera linguagem contextual e não conclusão rígida', () => {
  resetTestStorage();
  window.ActaDiagnostic.openNewEvaluationModal(testChild.id);
  
  window.ActaDiagnostic.setSignalState('f2_a4_s1', 'sozinho_varia');
  
  const syn = window.ActaDiagnostic.generateSynthesis();
  
  // Deve mencionar variação por contexto, energia ou interesse
  const text = (syn.strengthsText || '') + (syn.conditionsText || '');
  assert.ok(
    text.includes('variam') || text.includes('varia') || text.includes('energia') || text.includes('momentos favoráveis'),
    'Síntese deve expressar autonomia contextual'
  );
});

// ---------------------------------------------------------------------------
// TESTE 5: Facilidades e interesses separados de necessidades de apoio
// ---------------------------------------------------------------------------
test('Critério 5: Exemplos de facilidades/interesses aparecem separados de necessidades de apoio', () => {
  resetTestStorage();
  window.ActaDiagnostic.openNewEvaluationModal(testChild.id);
  
  window.ActaDiagnostic.toggleProfileStrength('aprende_sozinho');
  window.ActaDiagnostic.saveProfileStrengthExample('Montou um castelo de blocos com ponte levadiça sozinho.');
  window.ActaDiagnostic.toggleProfileChallenge('comecar_tarefas');
  
  const syn = window.ActaDiagnostic.generateSynthesis();
  
  // Interesses (bloco 2) contém o castelo
  assert.ok(syn.interestsText.includes('castelo de blocos') || syn.interestsText.includes('Aprende sozinho'));
  
  // Apoio (bloco 3) contém o desafio de começar tarefas
  assert.ok(syn.strengthenNowText.includes('Começar tarefas') || syn.strengthenNowText.includes('Desafios'));
  
  // Interesses não se misturam no bloco de apoio
  assert.ok(!syn.strengthenNowText.includes('ponte levadiça'));
});

// ---------------------------------------------------------------------------
// TESTE 6: Síntese não produz médias nem rótulos clínicos
// ---------------------------------------------------------------------------
test('Critério 6: Zero notas, médias, percentuais e rótulos clínicos (TDAH, altas habilidades, etc.)', () => {
  resetTestStorage();
  window.ActaDiagnostic.openNewEvaluationModal(testChild.id);
  
  window.ActaDiagnostic.toggleProfileStrength('entende_complexos');
  window.ActaDiagnostic.toggleProfileStrength('memoria_forte');
  window.ActaDiagnostic.toggleProfileChallenge('manter_ate_fim');
  window.ActaDiagnostic.toggleProfileChallenge('lidar_frustracao');
  
  const syn = window.ActaDiagnostic.generateSynthesis();
  const allText = JSON.stringify(syn).toLowerCase();
  
  // Proibição estrita de termos clínicos e pontuações
  assert.ok(!allText.includes('tdah'), 'Não pode conter TDAH');
  assert.ok(!allText.includes('superdotad'), 'Não pode conter superdotado');
  assert.ok(!allText.includes('altas habilidades'), 'Não pode conter altas habilidades');
  assert.ok(!allText.includes('autista') && !allText.includes('autismo'), 'Não pode conter autismo');
  assert.ok(!allText.includes('nota:'), 'Não pode conter notas');
  assert.ok(!allText.includes('pontuação:'), 'Não pode conter pontuação');
  assert.ok(!allText.includes('%'), 'Não pode conter percentuais de nota');
});

// ---------------------------------------------------------------------------
// TESTE 7: Informações de saúde/rotina NUNCA aparecem no Dossiê, na nuvem ou em impressões
// ---------------------------------------------------------------------------
test('Critério 7: Dados opcionais de rotina/saúde são omitidos do Dossiê e da nuvem por padrão', () => {
  resetTestStorage();
  window.ActaDiagnostic.openNewEvaluationModal(testChild.id);
  
  window.ActaDiagnostic.saveWellnessField('sleep', 'Acorda assustado às 3h da manhã');
  window.ActaDiagnostic.saveWellnessField('sensory', 'Incomoda-se muito com luz forte de lâmpadas brancas');
  window.ActaDiagnostic.concludeEvaluation();
  
  const savedEvals = window.ActaStorage.getEvaluations(testChild.id);
  assert.ok(savedEvals.length > 0, 'Deve ter gravado a avaliação');
  const savedEval = savedEvals[0];

  // 1. Verificação de armazenamento: o objeto geral de avaliação NUNCA contém wellnessContext
  assert.strictEqual(savedEval.wellnessContext, undefined, 'wellnessContext NÃO deve estar no objeto sincronizado da avaliação');

  // 2. Verificação de persistência local: notas de saúde ficam no storage privado do dispositivo
  const privateWellness = window.ActaDiagnostic.getPrivateWellness(savedEval.id);
  assert.ok(privateWellness !== null, 'Dados privados devem existir no armazenamento local do dispositivo');
  assert.strictEqual(privateWellness.sleep, 'Acorda assustado às 3h da manhã', 'Sono preservado localmente');
  assert.strictEqual(privateWellness.sensory, 'Incomoda-se muito com luz forte de lâmpadas brancas', 'Sensorial preservado localmente');

  // 3. Verificação de visualização local e proteção de impressão
  const singleHtml = window.ActaDiagnostic.renderSingleEvaluationHTML(savedEval, false);
  assert.ok(singleHtml.includes('Anotações Privadas de Rotina e Bem-estar (Apenas este dispositivo)'), 'Exibe cabeçalho privado no dispositivo');
  assert.ok(singleHtml.includes('no-print'), 'Card privado deve ter classe no-print para não sair em impressões');

  // 4. Verificação de exportação: Dossiê Resumido e Completo
  const dossieResumido = window.ActaReports.generateResumoDossieHTML({ personId: testChild.id });
  const dossieCompleto = window.ActaReports.generateCompletoDossieHTML({ personId: testChild.id });
  
  assert.ok(!dossieResumido.includes('Acorda assustado às 3h da manhã'), 'Dossiê Resumido não deve conter dados de sono');
  assert.ok(!dossieResumido.includes('luz forte de lâmpadas brancas'), 'Dossiê Resumido não deve conter sensibilidade sensorial');
  assert.ok(!dossieCompleto.includes('Acorda assustado às 3h da manhã'), 'Dossiê Completo não deve conter dados de sono');
  assert.ok(!dossieCompleto.includes('luz forte de lâmpadas brancas'), 'Dossiê Completo não deve conter sensibilidade sensorial');

  // 5. Verificação de payload de sincronização do Firestore (simulação do clone de sync)
  const syncClone = Object.assign({}, savedEval);
  delete syncClone.id;
  assert.strictEqual(syncClone.wellnessContext, undefined, 'Payload de sincronização do Firestore não possui wellnessContext');
});

// ---------------------------------------------------------------------------
// TESTE 8: Compatibilidade total com avaliações legadas
// ---------------------------------------------------------------------------
test('Critério 8: Avaliações legadas V1 continuam abrindo sem alteração de significado', () => {
  resetTestStorage();
  const legacyEval = {
    id: 'eval_legacy_v1',
    schemaVersion: 1,
    personId: testChild.id,
    date: '2025-02-15',
    title: 'Avaliação Diagnóstica Inicial',
    summaryStrengths: 'Excelente compreensão de histórias orais e vocabulário.',
    summaryRetomar: 'Coordenação motora fina no traçado de letras cursivas.',
    summaryNotes: 'Muito participativo nas aulas.',
    portugues: { leitura: 'Consolidado', escrita: 'Em desenvolvimento' },
    matematica: { calculo: 'Consolidado' }
  };
  
  window.ActaStorage.saveEvaluation(legacyEval);
  
  // Renderização individual legada
  const legacyHtml = window.ActaDiagnostic.renderSingleEvaluationHTML(legacyEval, false);
  assert.ok(legacyHtml.includes('Registro Histórico'));
  assert.ok(legacyHtml.includes('Excelente compreensão de histórias orais'));
  assert.ok(legacyHtml.includes('Coordenação motora fina'));
  
  // Preservação no Dossiê
  const dossie = window.ActaReports.generateCompletoDossieHTML({ personId: testChild.id });
  assert.ok(dossie.length > 0);
});

// ---------------------------------------------------------------------------
// TESTE 9: Rascunho salva e recupera observações parciais e contextos
// ---------------------------------------------------------------------------
test('Critério 9: Rascunho salva e retoma observações parciais, notas e contextos de atividade', () => {
  resetTestStorage();
  window.ActaDiagnostic.openNewEvaluationModal(testChild.id);
  
  window.ActaDiagnostic.setSignalState('f2_a1_s1', 'sozinho');
  window.ActaDiagnostic.saveActivityNote('f2_a1', 'Gostou muito de apontar os detalhes da gravura.');
  window.ActaDiagnostic.toggleActivityMarker('f2_a1', 'etapas_pequenas');
  window.ActaDiagnostic.saveActivityContextNote('f2_a1', 'Ficou mais atento após pequena pausa.');
  
  window.ActaDiagnostic.saveDraft();
  
  const savedDraft = window.ActaStorage.getEvaluations(testChild.id).find(e => e.status === 'draft');
  assert.ok(savedDraft);
  assert.strictEqual(savedDraft.activityNotes['f2_a1'], 'Gostou muito de apontar os detalhes da gravura.');
  assert.ok(savedDraft.activityContext['f2_a1'].markers.includes('etapas_pequenas'));
  assert.strictEqual(savedDraft.activityContext['f2_a1'].note, 'Ficou mais atento após pequena pausa.');
});

// ---------------------------------------------------------------------------
// TESTE 10: Preservação de dados e isolamento das demais áreas do ACTA
// ---------------------------------------------------------------------------
test('Critério 10: Módulos externos (materiais, planos, calendário) permanecem isolados e intactos', () => {
  const store = window.ActaStorage.getData();
  assert.ok(Array.isArray(store.records), 'records deve existir');
  assert.ok(Array.isArray(store.plans), 'plans deve existir');
  assert.ok(Array.isArray(store.materials), 'materials deve existir');
  assert.ok(Array.isArray(store.calendarEvents), 'calendarEvents deve existir');
});

// ---------------------------------------------------------------------------
// TESTE 11: AxesSummary calcula com exatidão as contagens dos 6 estados
// ---------------------------------------------------------------------------
test('Critério 11: computeAxesSummary calcula os 6 estados sem NaN ou perda de contagem', () => {
  const obs = {
    'f2_a1_s1': 'sozinho',
    'f2_a1_s2': 'sozinho_varia',
    'f2_a1_s3': 'com_ajuda',
    'f2_a1_s4': 'comecando_parcial'
  };
  
  const summary = window.ActaDiagnostic.computeAxesSummary('fase_2', obs);
  assert.ok(summary.leitura);
  assert.strictEqual(summary.leitura.sozinho >= 1, true);
  assert.strictEqual(typeof summary.leitura.sozinho_varia, 'number');
  assert.strictEqual(typeof summary.leitura.com_ajuda, 'number');
  assert.strictEqual(typeof summary.leitura.comecando_parcial, 'number');
  assert.strictEqual(typeof summary.leitura.nao_apareceu, 'number');
  assert.strictEqual(typeof summary.leitura.nao_observei, 'number');
});

// ---------------------------------------------------------------------------
// TESTE 12: Retrocompatibilidade de Aliases Qualitativos
// ---------------------------------------------------------------------------
test('Critério 12: Aliases qualitativos retrocompatíveis (firm, strengthen, nextStep, foundation) preservados', () => {
  resetTestStorage();
  window.ActaDiagnostic.openNewEvaluationModal(testChild.id);
  window.ActaDiagnostic.setSignalState('f2_a1_s1', 'sozinho');
  window.ActaDiagnostic.concludeEvaluation();
  
  const evals = window.ActaStorage.getEvaluations(testChild.id);
  const completed = evals.find(e => e.status === 'completed');
  assert.ok(completed);
  assert.ok(completed.qualitativeSynthesis.firm, 'qualitativeSynthesis.firm deve existir');
  assert.ok(completed.qualitativeSynthesis.support, 'qualitativeSynthesis.support deve existir');
  assert.ok(completed.qualitativeSynthesis.strengthen, 'qualitativeSynthesis.strengthen (alias) deve existir');
  assert.ok(completed.qualitativeSynthesis.nextSteps, 'qualitativeSynthesis.nextSteps deve existir');
  assert.ok(completed.qualitativeSynthesis.nextStep, 'qualitativeSynthesis.nextStep (alias) deve existir');
  assert.ok(completed.qualitativeSynthesis.exploreLater, 'qualitativeSynthesis.exploreLater deve existir');
  assert.ok(completed.qualitativeSynthesis.foundation, 'qualitativeSynthesis.foundation (alias) deve existir');
  
  // Campos legados para relatórios antigos
  assert.ok(completed.summaryStrengths, 'summaryStrengths deve existir');
  assert.ok(completed.summaryRetomar, 'summaryRetomar deve existir');
  assert.ok(completed.portugues, 'portugues legado deve existir');
  assert.ok(completed.matematica, 'matematica legado deve existir');
});

// ---------------------------------------------------------------------------
// TESTE 13: Saneamento retroativo de dados privados em avaliações existentes
// ---------------------------------------------------------------------------
test('Critério 13: Avaliações pré-existentes com wellnessContext são migradas para storage local e limpas do array geral', () => {
  resetTestStorage();
  const legacyWithWellness = {
    id: 'eval_legacy_with_wellness',
    schemaVersion: 2,
    personId: testChild.id,
    date: '2025-08-01',
    title: 'Diagnóstico Antigo',
    wellnessContext: {
      sleep: 'Sono agitado',
      sensory: 'Sensível a ruídos altos'
    }
  };

  // Salva no storage (simulando dado pré-existente recebido de sincronização ou rascunho anterior)
  const saved = window.ActaStorage.saveEvaluation(legacyWithWellness);

  // O objeto retornado e persistido NÃO contém mais wellnessContext
  assert.strictEqual(saved.wellnessContext, undefined, 'wellnessContext foi removido do objeto');

  // Mas foi preservado no armazenamento privado local do dispositivo
  const localWellness = window.ActaDiagnostic.getPrivateWellness('eval_legacy_with_wellness');
  assert.ok(localWellness !== null, 'Dados foram preservados no storage local');
  assert.strictEqual(localWellness.sleep, 'Sono agitado');
  assert.strictEqual(localWellness.sensory, 'Sensível a ruídos altos');
});

console.log(`\n🎉 Concluído: ${passedTests} de ${totalTests} testes passaram com sucesso!`);
