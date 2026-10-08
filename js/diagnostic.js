/**
 * PLANNER ACTA — Módulo de Avaliação Diagnóstica Pedagógica Qualitativa
 * Reformulação Completa (8 Eixos • 4 Fases de Referência • Base Socrática e Clássica)
 * 
 * Filosofia:
 * - O que já está firme?
 * - O que precisa ser fortalecido agora?
 * - Qual pode ser o próximo passo, sem pressa?
 * Sem notas, sem percentuais, sem rótulos clínicos ou burocracia escolar.
 */

(function(window) {
  'use strict';

  // =========================================================================
  // 1. OS OITO EIXOS DO DESENVOLVIMENTO ACTA
  // =========================================================================
  const AXES = {
    linguagem: {
      id: 'linguagem',
      name: 'Linguagem e expressão',
      desc: 'Como escuta, conversa, explica o que pensa e aprende palavras novas.',
      icon: 'fa-comments',
      color: 'text-[#A95337]',
      bg: 'bg-[#FBECE8]'
    },
    leitura: {
      id: 'leitura',
      name: 'Leitura e compreensão',
      desc: 'Como entende histórias ouvidas e, conforme a idade, palavras e textos que lê.',
      icon: 'fa-book-open',
      color: 'text-[#2F5233]',
      bg: 'bg-[#EBF3ED]'
    },
    escrita: {
      id: 'escrita',
      name: 'Escrita e coordenação',
      desc: 'Como usa as mãos e materiais e registra palavras, frases e ideias por escrito.',
      icon: 'fa-pen-fancy',
      color: 'text-[#6D28D9]',
      bg: 'bg-[#EDE9FE]'
    },
    matematica: {
      id: 'matematica',
      name: 'Matemática e raciocínio',
      desc: 'Como lida com quantidades, números, formas, padrões, contas e problemas reais.',
      icon: 'fa-calculator',
      color: 'text-[#1E3A5F]',
      bg: 'bg-[#E9EFF6]'
    },
    atencao: {
      id: 'atencao',
      name: 'Atenção, memória e instruções',
      desc: 'Como acompanha uma tarefa, lembra o que ouviu e segue sequências curtas.',
      icon: 'fa-brain',
      color: 'text-[#D97706]',
      bg: 'bg-[#FEF3C7]'
    },
    autonomia: {
      id: 'autonomia',
      name: 'Autonomia e organização',
      desc: 'Como começa uma tarefa, cuida dos materiais e assume responsabilidades.',
      icon: 'fa-compass',
      color: 'text-[#059669]',
      bg: 'bg-[#D1FAE5]'
    },
    mundo: {
      id: 'mundo',
      name: 'Conhecer o mundo e fazer relações',
      desc: 'Como observa coisas reais, compara, agrupa, pergunta e percebe causas e efeitos.',
      icon: 'fa-earth-americas',
      color: 'text-[#325B6C]',
      bg: 'bg-[#E0F2FE]'
    },
    convivencia: {
      id: 'convivencia',
      name: 'Convivência, escolhas e responsabilidade',
      desc: 'Como participa de combinados, escuta o outro, espera a vez e pensa em consequências.',
      icon: 'fa-heart',
      color: 'text-[#BE123C]',
      bg: 'bg-[#FFE4E6]'
    }
  };

  // =========================================================================
  // 2. OS QUATRO ESTADOS DE OBSERVAÇÃO
  // =========================================================================
  const STATES = {
    sozinho: {
      id: 'sozinho',
      label: 'Já faz sozinho',
      desc: 'Demonstrou a habilidade sem ajuda nesta situação.',
      badgeClass: 'bg-[#EBF3ED] text-[#2F5233] border-[#2F5233]/40 font-bold',
      pillClass: 'border-[#2F5233]/40 bg-[#EBF3ED] text-[#2F5233]',
      activeClass: 'bg-[#2F5233] text-white border-[#2F5233]',
      icon: 'fa-solid fa-circle-check',
      legacyEquivalent: 'Consolidado'
    },
    com_ajuda: {
      id: 'com_ajuda',
      label: 'Faz com ajuda',
      desc: 'Demonstrou parte da habilidade ou conseguiu com uma pista, exemplo ou apoio.',
      badgeClass: 'bg-[#E9EFF6] text-[#1E3A5F] border-[#1E3A5F]/40 font-bold',
      pillClass: 'border-[#1E3A5F]/40 bg-[#E9EFF6] text-[#1E3A5F]',
      activeClass: 'bg-[#1E3A5F] text-white border-[#1E3A5F]',
      icon: 'fa-solid fa-hand-holding-heart',
      legacyEquivalent: 'Em desenvolvimento'
    },
    nao_apareceu: {
      id: 'nao_apareceu',
      label: 'Ainda não apareceu nesta observação',
      desc: 'Houve oportunidade de observar, mas não apareceu com clareza ou precisa de muito apoio.',
      badgeClass: 'bg-[#FEF3C7] text-[#92400E] border-[#D97706]/40 font-bold',
      pillClass: 'border-[#D97706]/40 bg-[#FFFBEB] text-[#92400E]',
      activeClass: 'bg-[#D97706] text-white border-[#D97706]',
      icon: 'fa-solid fa-seedling',
      legacyEquivalent: 'Iniciando / Retomar'
    },
    nao_observei: {
      id: 'nao_observei',
      label: 'Não observei ainda',
      desc: 'A situação não aconteceu, foi interrompida ou não há informação suficiente.',
      badgeClass: 'bg-[#FAF7F0] text-[#667267] border-[#CCD8CD]',
      pillClass: 'border-[#CCD8CD] bg-[#FAF7F0] text-[#667267]',
      activeClass: 'bg-[#667267] text-white border-[#667267]',
      icon: 'fa-regular fa-circle',
      legacyEquivalent: null
    }
  };

  // =========================================================================
  // 3. BANCO DE ATIVIDADES POR FASE (4 FASES • 7 CARTÕES POR FASE)
  // =========================================================================
  const PHASES = {
    fase_1: {
      id: 'fase_1',
      title: 'Fase 1 (3 a 5 anos)',
      shortTitle: 'Fase 1',
      ageRange: '3 a 5 anos',
      minAge: 3,
      maxAge: 5,
      focus: 'Conversa, histórias ouvidas, sons da fala, brincadeiras com quantidades, sequências simples, coordenação inicial, pequenas rotinas e convivência guiada.',
      activities: [
        {
          id: 'f1_a1',
          number: 1,
          title: 'Conversar sobre algo real',
          howTo: 'Mostrar um objeto conhecido, uma imagem simples ou algo observado durante o dia. Conversar naturalmente, sem transformar a conversa em interrogatório.',
          example: '“O que você vê aqui? O que esse objeto faz? Você já viu algo assim?” Para crianças mais novas, aceitar apontar, gestos ou palavras isoladas quando apropriado.',
          axes: ['linguagem', 'mundo'],
          signals: [
            { id: 'f1_a1_s1', text: 'Compreende uma pergunta simples sobre o objeto ou a cena.', axes: ['linguagem'] },
            { id: 'f1_a1_s2', text: 'Nomeia ou descreve algo que vê.', axes: ['linguagem'] },
            { id: 'f1_a1_s3', text: 'Usa palavras ou frases para dizer o que quer, viu ou pensa.', axes: ['linguagem'] },
            { id: 'f1_a1_s4', text: 'Relaciona a cena a algo que aconteceu na própria vida.', axes: ['mundo'] }
          ]
        },
        {
          id: 'f1_a2',
          number: 2,
          title: 'Ouvir uma história e contar um pedaço dela',
          howTo: 'Ler um trecho curto ou contar uma história familiar. Depois, pedir à criança que fale, aponte ou mostre o que lembra. Não corrigir durante a observação.',
          example: '“O que aconteceu na história?” ou “O que veio primeiro?” Se cansar, interromper e continuar em outro dia.',
          axes: ['linguagem', 'leitura', 'atencao'],
          signals: [
            { id: 'f1_a2_s1', text: 'Acompanha uma parte da história com atenção.', axes: ['leitura', 'atencao'] },
            { id: 'f1_a2_s2', text: 'Reconhece personagem, objeto ou acontecimento.', axes: ['leitura'] },
            { id: 'f1_a2_s3', text: 'Lembra algo logo depois de ouvir.', axes: ['atencao'] },
            { id: 'f1_a2_s4', text: 'Começa a colocar dois acontecimentos em alguma ordem, conforme a idade.', axes: ['linguagem', 'atencao'] }
          ]
        },
        {
          id: 'f1_a3',
          number: 3,
          title: 'Brincar com sons e palavras',
          howTo: 'Usar parlendas, cantigas, nomes conhecidos e palavras que rimam. Aos 3–4 anos, a brincadeira é ouvir e repetir; aos 4–5, convidar a notar rimas ou sons iniciais sem cobrar resposta escolarizada.',
          example: '“Vamos terminar a cantiga juntos?” ou “Que outra palavra parece rimar com pato?”',
          axes: ['linguagem', 'atencao', 'leitura'],
          signals: [
            { id: 'f1_a3_s1', text: 'Presta atenção aos sons de uma cantiga ou palavra.', axes: ['linguagem', 'atencao'] },
            { id: 'f1_a3_s2', text: 'Repete palavras, sons ou partes de uma frase.', axes: ['linguagem'] },
            { id: 'f1_a3_s3', text: 'Percebe quando duas palavras soam parecidas (se adequado à idade).', axes: ['leitura'] },
            { id: 'f1_a3_s4', text: 'Tenta completar uma frase ou cantiga conhecida.', axes: ['atencao', 'linguagem'] }
          ]
        },
        {
          id: 'f1_a4',
          number: 4,
          title: 'Organizar objetos e brincar com quantidades',
          howTo: 'Usar tampinhas, blocos, brinquedos, talheres ou outros objetos seguros do cotidiano.',
          example: '“Separe os que são iguais”, “Onde tem mais?” ou “O que vem depois nesta sequência?” Não exigir números escritos nesta fase inicial.',
          axes: ['matematica', 'atencao', 'mundo'],
          signals: [
            { id: 'f1_a4_s1', text: 'Agrupa objetos por uma característica visível (cor, tamanho ou forma).', axes: ['matematica', 'mundo'] },
            { id: 'f1_a4_s2', text: 'Percebe onde há mais, menos ou a mesma quantidade.', axes: ['matematica'] },
            { id: 'f1_a4_s3', text: 'Acompanha a contagem de objetos tocando um por vez, quando adequado.', axes: ['matematica', 'atencao'] },
            { id: 'f1_a4_s4', text: 'Continua ou inventa uma sequência simples.', axes: ['matematica', 'atencao'] }
          ]
        },
        {
          id: 'f1_a5',
          number: 5,
          title: 'Entender e seguir uma pequena orientação',
          howTo: 'Convidar a criança para uma pequena ação cotidiana conhecida. Começar com uma orientação simples e, se fizer sentido para a idade, combinar duas ações em sequência.',
          example: '“Pegue o livro e coloque na mesa.” Não usar o tempo de execução como nota; observar cansaço, familiaridade e ambiente.',
          axes: ['atencao', 'autonomia'],
          signals: [
            { id: 'f1_a5_s1', text: 'Compreende o pedido com clareza.', axes: ['atencao'] },
            { id: 'f1_a5_s2', text: 'Começa a ação logo após ouvir.', axes: ['atencao', 'autonomia'] },
            { id: 'f1_a5_s3', text: 'Lembra a próxima etapa com ou sem uma pista.', axes: ['atencao'] },
            { id: 'f1_a5_s4', text: 'Acompanha sequência curta sem precisar repetir muitas vezes.', axes: ['atencao', 'autonomia'] }
          ]
        },
        {
          id: 'f1_a6',
          number: 6,
          title: 'Desenhar, construir e cuidar de algo pequeno',
          howTo: 'Oferecer papel, lápis de cera, blocos ou materiais apropriados e propor uma ação simples. Em seguida, convidar a guardar os materiais ou concluir uma pequena tarefa combinada.',
          example: 'Desenhar uma casa, construir uma ponte com blocos ou ajudar a guardar os livros. Não julgar valor artístico nem comparar coordenação.',
          axes: ['escrita', 'autonomia'],
          signals: [
            { id: 'f1_a6_s1', text: 'Explora materiais e coordena movimentos de acordo com sua etapa.', axes: ['escrita'] },
            { id: 'f1_a6_s2', text: 'Tenta representar uma ideia por desenho, construção ou gesto.', axes: ['escrita', 'mundo'] },
            { id: 'f1_a6_s3', text: 'Participa de uma tarefa pequena com apoio adequado.', axes: ['autonomia'] },
            { id: 'f1_a6_s4', text: 'Começa a guardar ou cuidar do que usou.', axes: ['autonomia'] }
          ]
        },
        {
          id: 'f1_a7',
          number: 7,
          title: 'Conversar sobre um combinado ou uma escolha',
          howTo: 'Conversar sobre situação cotidiana simples (esperar a vez, dividir um brinquedo, ajudar a arrumar). Relatar situação real vale; não provocar conflito para “testar”.',
          example: '“Vocês dois querem usar o mesmo brinquedo. O que podemos fazer?” Não há resposta verbal única; observar a conversa e a atitude.',
          axes: ['convivencia', 'linguagem'],
          signals: [
            { id: 'f1_a7_s1', text: 'Percebe que outra pessoa também quer ou precisa de algo.', axes: ['convivencia'] },
            { id: 'f1_a7_s2', text: 'Compreende um combinado simples com o apoio esperado para a idade.', axes: ['convivencia'] },
            { id: 'f1_a7_s3', text: 'Tenta explicar o que gostaria de fazer.', axes: ['linguagem'] },
            { id: 'f1_a7_s4', text: 'Aceita orientação ou ajuda para reparar uma situação quando necessário.', axes: ['convivencia'] }
          ]
        }
      ]
    },

    fase_2: {
      id: 'fase_2',
      title: 'Fase 2 (6 a 7 anos)',
      shortTitle: 'Fase 2',
      ageRange: '6 a 7 anos',
      minAge: 6,
      maxAge: 7,
      focus: 'Relação entre sons e letras, leitura e escrita iniciais, números e problemas simples, instruções com mais etapas e organização com ajuda.',
      activities: [
        {
          id: 'f2_a1',
          number: 1,
          title: 'Ler ou ouvir um texto curto e contar o que entendeu',
          howTo: 'Se a criança já lê, oferecer palavras, frases ou um trecho curto adequado ao que pratica. Se ainda não lê com autonomia, ler em voz alta. Observar a compreensão separadamente da decodificação.',
          example: '“O que aconteceu? Como você sabe disso?” Não transformar leitura difícil em teste de paciência.',
          axes: ['leitura', 'linguagem', 'atencao'],
          signals: [
            { id: 'f2_a1_s1', text: 'Acompanha o sentido geral do que leu ou ouviu.', axes: ['leitura'] },
            { id: 'f2_a1_s2', text: 'Conta com as próprias palavras um acontecimento.', axes: ['linguagem'] },
            { id: 'f2_a1_s3', text: 'Identifica uma informação simples presente no texto.', axes: ['leitura', 'atencao'] },
            { id: 'f2_a1_s4', text: 'Tenta decodificar sons em vez de apenas adivinhar pelas figuras.', axes: ['leitura'] }
          ]
        },
        {
          id: 'f2_a2',
          number: 2,
          title: 'Brincar com partes das palavras e os sons das letras',
          howTo: 'Usar palavras conhecidas, nomes ou cartões simples para ouvir sílabas, perceber sons iniciais e relacionar sons às letras já ensinadas.',
          example: 'Separar oralmente o nome de um objeto em partes e procurar uma letra conhecida. Não cobrar letras ainda não ensinadas.',
          axes: ['linguagem', 'leitura'],
          signals: [
            { id: 'f2_a2_s1', text: 'Identifica partes sonoras (sílabas) de palavras conhecidas.', axes: ['linguagem'] },
            { id: 'f2_a2_s2', text: 'Percebe ou produz rimas e sons iniciais.', axes: ['linguagem'] },
            { id: 'f2_a2_s3', text: 'Relaciona sons às letras que já conhece.', axes: ['leitura'] },
            { id: 'f2_a2_s4', text: 'Tenta juntar sons para ler uma palavra sem depender só da figura.', axes: ['leitura'] }
          ]
        },
        {
          id: 'f2_a3',
          number: 3,
          title: 'Escrever uma palavra ou frase com sentido',
          howTo: 'Pedir que escreva uma palavra de uso conhecido ou frase curta sobre um acontecimento, desenho ou história. Permitir que a criança diga antes o que pretende escrever.',
          example: '“Escreva uma frase sobre a brincadeira de hoje.” Não exigir ortografia adulta nem caligrafia perfeita.',
          axes: ['escrita', 'linguagem'],
          signals: [
            { id: 'f2_a3_s1', text: 'Tenta registrar sons e palavras por escrito.', axes: ['escrita'] },
            { id: 'f2_a3_s2', text: 'Deixa algum espaço entre as palavras ao escrever.', axes: ['escrita'] },
            { id: 'f2_a3_s3', text: 'Comunica uma ideia compreensível por escrito, mesmo com erros normais da fase.', axes: ['escrita', 'linguagem'] },
            { id: 'f2_a3_s4', text: 'Usa lápis e espaço na folha com controle compatível com a experiência que teve.', axes: ['escrita'] }
          ]
        },
        {
          id: 'f2_a4',
          number: 4,
          title: 'Resolver uma situação com números',
          howTo: 'Usar objetos reais, moedas de brincadeira, peças, porções ou desenhos. Escolher números e operações próximos do que a criança já viu.',
          example: '“Temos oito peças e vamos repartir entre duas pessoas. Como podemos fazer?” Ajustar números sem penalizar conteúdo novo.',
          axes: ['matematica', 'mundo'],
          signals: [
            { id: 'f2_a4_s1', text: 'Conta ou compara quantidades com alguma estratégia pessoal.', axes: ['matematica'] },
            { id: 'f2_a4_s2', text: 'Relaciona números a quantidades reais.', axes: ['matematica'] },
            { id: 'f2_a4_s3', text: 'Escolhe uma maneira de juntar, tirar ou repartir em situação simples.', axes: ['matematica'] },
            { id: 'f2_a4_s4', text: 'Explica ou mostra como pensou (mesmo com material concreto).', axes: ['matematica', 'mundo'] }
          ]
        },
        {
          id: 'f2_a5',
          number: 5,
          title: 'Descobrir a ordem de uma sequência',
          howTo: 'Usar três ou quatro imagens de rotina, etapas de uma receita simples, padrão com objetos ou acontecimentos de uma história.',
          example: '“O que aconteceu primeiro? O que poderia vir depois?”',
          axes: ['matematica', 'atencao', 'mundo'],
          signals: [
            { id: 'f2_a5_s1', text: 'Coloca acontecimentos em uma ordem possível.', axes: ['atencao', 'mundo'] },
            { id: 'f2_a5_s2', text: 'Continua um padrão simples de repetição.', axes: ['matematica'] },
            { id: 'f2_a5_s3', text: 'Percebe o que falta ou o que vem depois.', axes: ['matematica', 'atencao'] },
            { id: 'f2_a5_s4', text: 'Explica, com palavras ou gestos, o motivo da sua escolha.', axes: ['mundo', 'matematica'] }
          ]
        },
        {
          id: 'f2_a6',
          number: 6,
          title: 'Cumprir uma tarefa com duas ou três etapas',
          howTo: 'Combinar uma tarefa familiar em pequenos passos e pedir que repita o que entendeu antes de começar, se isso ajudar.',
          example: 'Pegar o caderno, escolher o lápis e guardar os materiais ao terminar. Não confundir falta de treino com incapacidade.',
          axes: ['atencao', 'autonomia'],
          signals: [
            { id: 'f2_a6_s1', text: 'Compreende a sequência de duas ou três etapas.', axes: ['atencao'] },
            { id: 'f2_a6_s2', text: 'Lembra das etapas durante a execução.', axes: ['atencao'] },
            { id: 'f2_a6_s3', text: 'Procura os materiais necessários para a tarefa.', axes: ['autonomia'] },
            { id: 'f2_a6_s4', text: 'Termina com autonomia ou pede ajuda de maneira apropriada.', axes: ['autonomia'] }
          ]
        },
        {
          id: 'f2_a7',
          number: 7,
          title: 'Conversar sobre uma situação de convivência',
          howTo: 'Apresentar situação real ou inventada, simples e adequada à idade (dividir, dizer a verdade, corrigir um erro, cumprir combinado).',
          example: '“Se alguém derrubou algo sem querer, o que poderia fazer depois?”',
          axes: ['convivencia', 'linguagem'],
          signals: [
            { id: 'f2_a7_s1', text: 'Consegue contar o que aconteceu na situação.', axes: ['linguagem'] },
            { id: 'f2_a7_s2', text: 'Percebe como a situação pode afetar outra pessoa.', axes: ['convivencia'] },
            { id: 'f2_a7_s3', text: 'Sugere um caminho para resolver ou reparar o ocorrido.', axes: ['convivencia'] },
            { id: 'f2_a7_s4', text: 'Aceita conversar sobre mais de uma possibilidade de ação.', axes: ['convivencia', 'linguagem'] }
          ]
        }
      ]
    },

    fase_3: {
      id: 'fase_3',
      title: 'Fase 3 (8 a 10 anos)',
      shortTitle: 'Fase 3',
      ageRange: '8 a 10 anos',
      minAge: 8,
      maxAge: 10,
      focus: 'Compreender textos, organizar parágrafos, resolver problemas com mais de uma etapa, explicar relações e ampliar autonomia.',
      activities: [
        {
          id: 'f3_a1',
          number: 1,
          title: 'Ler um texto e explicar a ideia principal',
          howTo: 'Oferecer um texto curto de literatura, curiosidade ou assunto estudado que seja adequado à experiência da criança. Deixar ler e conversar.',
          example: '“Qual é a ideia mais importante? Que parte do texto ajudou você a perceber isso?”',
          axes: ['leitura', 'linguagem', 'mundo'],
          signals: [
            { id: 'f3_a1_s1', text: 'Conta a ideia principal sem apenas repetir frases soltas.', axes: ['leitura', 'linguagem'] },
            { id: 'f3_a1_s2', text: 'Localiza uma informação que apoia o que está dizendo.', axes: ['leitura'] },
            { id: 'f3_a1_s3', text: 'Explica uma palavra pelo contexto ou pergunta quando não entende.', axes: ['leitura', 'linguagem'] },
            { id: 'f3_a1_s4', text: 'Faz uma inferência simples ou conecta o texto a algo que conhece.', axes: ['mundo', 'leitura'] }
          ]
        },
        {
          id: 'f3_a2',
          number: 2,
          title: 'Escrever um parágrafo organizado',
          howTo: 'Convidar a escrever sobre uma experiência, contar história curta ou explicar algo que conhece. Extensão apropriada, sem meta rígida de linhas.',
          example: '“Conte uma descoberta que fez ou um acontecimento de que se lembra.” Não reduzir o resultado a ortografia.',
          axes: ['escrita', 'linguagem', 'autonomia'],
          signals: [
            { id: 'f3_a2_s1', text: 'Mantém uma ideia central clara no parágrafo.', axes: ['escrita'] },
            { id: 'f3_a2_s2', text: 'Organiza frases em uma ordem compreensível.', axes: ['escrita'] },
            { id: 'f3_a2_s3', text: 'Inclui detalhes que ajudam o leitor a entender.', axes: ['escrita', 'linguagem'] },
            { id: 'f3_a2_s4', text: 'Relê ou aceita uma sugestão para melhorar a clareza.', axes: ['autonomia', 'escrita'] }
          ]
        },
        {
          id: 'f3_a3',
          number: 3,
          title: 'Resolver um problema com números e explicar o caminho',
          howTo: 'Propor problema do cotidiano ou conteúdo já estudado (etapas combinadas, multiplicação/divisão, medidas, frações iniciais, tabela simples).',
          example: 'Comparar preços, repartir quantidades ou interpretar tabela simples. Não exigir conteúdo não ensinado.',
          axes: ['matematica', 'atencao', 'autonomia'],
          signals: [
            { id: 'f3_a3_s1', text: 'Identifica o que a pergunta do problema pede.', axes: ['matematica', 'atencao'] },
            { id: 'f3_a3_s2', text: 'Escolhe uma estratégia de cálculo que faça sentido.', axes: ['matematica'] },
            { id: 'f3_a3_s3', text: 'Organiza as etapas do cálculo sem se perder.', axes: ['matematica', 'atencao'] },
            { id: 'f3_a3_s4', text: 'Verifica se o resultado parece possível e consegue explicar como pensou.', axes: ['matematica', 'autonomia'] }
          ]
        },
        {
          id: 'f3_a4',
          number: 4,
          title: 'Explicar como uma coisa se relaciona com outra',
          howTo: 'Usar algo observável do dia a dia, experiência, sequência de imagens ou situação de história. Pedir que compare, agrupe ou explique causas.',
          example: '“Por que você acha que a planta ficou assim? O que poderíamos observar para entender melhor?” Hipótese não é erro.',
          axes: ['mundo', 'matematica', 'linguagem'],
          signals: [
            { id: 'f3_a4_s1', text: 'Encontra semelhanças e diferenças relevantes entre elementos.', axes: ['mundo'] },
            { id: 'f3_a4_s2', text: 'Organiza elementos por um critério que consegue explicar.', axes: ['mundo', 'matematica'] },
            { id: 'f3_a4_s3', text: 'Sugere uma causa ou consequência possível para o fato.', axes: ['mundo', 'linguagem'] },
            { id: 'f3_a4_s4', text: 'Reconhece quando não tem informação suficiente e aceita investigar.', axes: ['mundo'] }
          ]
        },
        {
          id: 'f3_a5',
          number: 5,
          title: 'Escutar, lembrar e concluir uma tarefa breve',
          howTo: 'Explicar pequena tarefa com etapas claras usando algo conhecido. Ajustar extensão à criança, sem cronômetro como nota.',
          example: 'Organizar materiais para uma atividade ou seguir sequência curta. Notar cansaço ou distrações do ambiente.',
          axes: ['atencao', 'autonomia'],
          signals: [
            { id: 'f3_a5_s1', text: 'Lembra o objetivo da tarefa do começo ao fim.', axes: ['atencao'] },
            { id: 'f3_a5_s2', text: 'Mantém o fio condutor do que está fazendo.', axes: ['atencao'] },
            { id: 'f3_a5_s3', text: 'Retoma o foco após distração com ou sem uma pista leve.', axes: ['atencao'] },
            { id: 'f3_a5_s4', text: 'Percebe que precisa conferir ou concluir cada etapa.', axes: ['autonomia'] }
          ]
        },
        {
          id: 'f3_a6',
          number: 6,
          title: 'Planejar uma pequena tarefa ou parte da semana',
          howTo: 'Pedir que organize etapas de um trabalho, atividade doméstica ou compromissos reais, com a ajuda habitual.',
          example: 'Organizar o que será necessário para uma leitura, passeio ou projeto. Não exigir agenda perfeita.',
          axes: ['autonomia', 'atencao'],
          signals: [
            { id: 'f3_a6_s1', text: 'Identifica o que precisa fazer para cumprir o objetivo.', axes: ['autonomia'] },
            { id: 'f3_a6_s2', text: 'Divide o trabalho em etapas lógicas.', axes: ['autonomia'] },
            { id: 'f3_a6_s3', text: 'Lembra dos materiais e do tempo de que precisará.', axes: ['atencao', 'autonomia'] },
            { id: 'f3_a6_s4', text: 'Reconhece onde precisa de ajuda e revê o plano quando necessário.', axes: ['autonomia'] }
          ]
        },
        {
          id: 'f3_a7',
          number: 7,
          title: 'Pensar sobre uma situação injusta ou difícil',
          howTo: 'Conversar sobre situação adequada à idade (vida real ou história). Escutar o raciocínio da criança sem forçar resposta decorada.',
          example: '“Duas pessoas entendem uma regra de formas diferentes. Como poderiam conversar para resolver?”',
          axes: ['convivencia', 'linguagem'],
          signals: [
            { id: 'f3_a7_s1', text: 'Descreve com clareza o que considera problemático na cena.', axes: ['convivencia', 'linguagem'] },
            { id: 'f3_a7_s2', text: 'Considera mais de um ponto de vista dos envolvidos.', axes: ['convivencia'] },
            { id: 'f3_a7_s3', text: 'Apresenta uma razão para a proposta que faz.', axes: ['convivencia', 'linguagem'] },
            { id: 'f3_a7_s4', text: 'Pensa em formas justas de reparar ou prevenir a situação.', axes: ['convivencia'] }
          ]
        }
      ]
    },

    fase_4: {
      id: 'fase_4',
      title: 'Fase 4 (11 a 14 anos)',
      shortTitle: 'Fase 4',
      ageRange: '11 a 14 anos',
      minAge: 11,
      maxAge: 14,
      focus: 'Compreender e defender ideias com razões, escrever textos organizados, aplicar matemática a situações reais, pesquisar, planejar e refletir sobre escolhas.',
      activities: [
        {
          id: 'f4_a1',
          number: 1,
          title: 'Ler e conversar sobre uma ideia defendida por alguém',
          howTo: 'Selecionar texto ou trecho adequado com opinião ou explicação identificável. Evitar assuntos que virem teste prévio enciclopédico.',
          example: '“O que o texto está defendendo? Que razões oferece? O que você gostaria de verificar?”',
          axes: ['leitura', 'linguagem', 'mundo'],
          signals: [
            { id: 'f4_a1_s1', text: 'Explica a ideia principal sustentada pelo autor.', axes: ['leitura'] },
            { id: 'f4_a1_s2', text: 'Distingue uma opinião das razões usadas para apoiá-la.', axes: ['leitura', 'linguagem'] },
            { id: 'f4_a1_s3', text: 'Identifica uma informação ou exemplo que sustenta a ideia.', axes: ['leitura'] },
            { id: 'f4_a1_s4', text: 'Apresenta uma pergunta ou posição própria com justificativa.', axes: ['linguagem', 'mundo'] }
          ]
        },
        {
          id: 'f4_a2',
          number: 2,
          title: 'Escrever para defender uma ideia',
          howTo: 'Propor tema conhecido e pedir texto de extensão razoável. Permitir planejamento breve e revisão.',
          example: '“Escolha uma ideia sobre um livro, regra ou problema cotidiano e explique por que pensa assim.”',
          axes: ['escrita', 'linguagem', 'autonomia'],
          signals: [
            { id: 'f4_a2_s1', text: 'Deixa clara a ideia que quer defender no texto.', axes: ['escrita'] },
            { id: 'f4_a2_s2', text: 'Apresenta razões e exemplos relacionados à tese.', axes: ['escrita', 'linguagem'] },
            { id: 'f4_a2_s3', text: 'Organiza começo, desenvolvimento e conclusão com clareza.', axes: ['escrita'] },
            { id: 'f4_a2_s4', text: 'Relê e identifica algo que poderia esclarecer ou corrigir.', axes: ['autonomia', 'escrita'] }
          ]
        },
        {
          id: 'f4_a3',
          number: 3,
          title: 'Usar matemática numa situação real',
          howTo: 'Escolher situação adequada ao conteúdo já estudado (frações, decimais, porcentagem, razão, escala, orçamento, equação simples).',
          example: 'Comparar preços e descontos, ajustar receita ou planejar gasto familiar.',
          axes: ['matematica', 'autonomia'],
          signals: [
            { id: 'f4_a3_s1', text: 'Compreende a pergunta real antes de escolher a operação.', axes: ['matematica'] },
            { id: 'f4_a3_s2', text: 'Escolhe uma estratégia e organiza etapas de resolução.', axes: ['matematica'] },
            { id: 'f4_a3_s3', text: 'Verifica se o resultado obtido é plausível na prática.', axes: ['matematica', 'autonomia'] },
            { id: 'f4_a3_s4', text: 'Explica a relação entre o cálculo feito e a situação real.', axes: ['matematica'] }
          ]
        },
        {
          id: 'f4_a4',
          number: 4,
          title: 'Comparar explicações e encontrar relações',
          howTo: 'Apresentar duas explicações simples para um mesmo acontecimento ou conversar sobre afirmação de livro/experimento. Perguntar o que sustenta cada uma.',
          example: '“As duas explicações podem estar certas? O que precisaríamos descobrir para decidir?”',
          axes: ['mundo', 'linguagem', 'matematica'],
          signals: [
            { id: 'f4_a4_s1', text: 'Compara razões ou evidências trazidas por diferentes visões.', axes: ['mundo', 'linguagem'] },
            { id: 'f4_a4_s2', text: 'Explica relações de causa e consequência com lógica.', axes: ['mundo', 'matematica'] },
            { id: 'f4_a4_s3', text: 'Percebe uma contradição ou informação faltante quando houver.', axes: ['mundo'] },
            { id: 'f4_a4_s4', text: 'Consegue rever a própria ideia diante de uma boa razão.', axes: ['mundo', 'convivencia'] }
          ]
        },
        {
          id: 'f4_a5',
          number: 5,
          title: 'Investigar e comparar informações',
          howTo: 'Utilizar duas fontes curtas e acessíveis (um livro e página informativa selecionada pela família) sobre tema familiar. Observar modo de investigar.',
          example: '“O que as duas fontes dizem? O que ainda falta conferir?” Sem exigir internet durante a avaliação.',
          axes: ['mundo', 'leitura', 'autonomia'],
          signals: [
            { id: 'f4_a5_s1', text: 'Identifica de onde veio cada informação apresentada.', axes: ['mundo', 'leitura'] },
            { id: 'f4_a5_s2', text: 'Percebe semelhanças e diferenças entre as duas fontes.', axes: ['leitura', 'mundo'] },
            { id: 'f4_a5_s3', text: 'Explica por que uma informação parece confiável ou precisa de confirmação.', axes: ['mundo'] },
            { id: 'f4_a5_s4', text: 'Resume o que aprendeu com suas próprias palavras.', axes: ['leitura', 'autonomia'] }
          ]
        },
        {
          id: 'f4_a6',
          number: 6,
          title: 'Planejar uma semana ou um trabalho',
          howTo: 'Propor plano realista para compromissos ou trabalho em andamento (papel, agenda ou método familiar).',
          example: 'Planejar leitura, projeto ou semana de estudos. Verificar se autonomia necessária foi ensinada.',
          axes: ['autonomia', 'atencao'],
          signals: [
            { id: 'f4_a6_s1', text: 'Lista as etapas principais necessárias para a realização.', axes: ['autonomia'] },
            { id: 'f4_a6_s2', text: 'Considera prazos, materiais e tempo disponível com realismo.', axes: ['autonomia', 'atencao'] },
            { id: 'f4_a6_s3', text: 'Diferencia o que consegue fazer sozinho do que exige ajuda.', axes: ['autonomia'] },
            { id: 'f4_a6_s4', text: 'Revê o plano com serenidade quando percebe conflito ou atraso.', axes: ['autonomia'] }
          ]
        },
        {
          id: 'f4_a7',
          number: 7,
          title: 'Conversar sobre um dilema e suas consequências',
          howTo: 'Apresentar dilema cotidiano ou literário com mais de um aspecto a considerar. Fazer perguntas abertas e escutar o raciocínio.',
          example: '“Se cumprir uma promessa causar um problema inesperado, o que precisaria ser considerado?” Sem nota moral.',
          axes: ['convivencia', 'linguagem'],
          signals: [
            { id: 'f4_a7_s1', text: 'Identifica quem pode ser afetado pelas decisões.', axes: ['convivencia'] },
            { id: 'f4_a7_s2', text: 'Apresenta razões ponderadas para sua escolha.', axes: ['convivencia', 'linguagem'] },
            { id: 'f4_a7_s3', text: 'Considera possíveis consequências e responsabilidades futuras.', axes: ['convivencia'] },
            { id: 'f4_a7_s4', text: 'Escuta outra perspectiva ou reconhece com humildade o que ainda não sabe.', axes: ['convivencia'] }
          ]
        }
      ]
    }
  };

  // =========================================================================
  // 4. OBJETO PRINCIPAL ActaDiagnostic
  // =========================================================================
  const ActaDiagnostic = {
    AXES: AXES,
    STATES: STATES,
    PHASES: PHASES,

    // Estado ativo do assistente de observação (Wizard)
    wizard: {
      childId: '',
      phaseId: 'fase_1',
      currentStep: 0, // 0 = Configuração/Fase, 1..7 = Atividades, 8 = Síntese & Conclusão
      date: '',
      evaluator: 'Família',
      evalId: '',
      isDraft: false,
      observations: {}, // { [signalId]: 'sozinho' | 'com_ajuda' | 'nao_apareceu' | 'nao_observei' }
      activityNotes: {}, // { [activityId]: string }
      familyNotes: '',
      customSummary: null
    },

    /**
     * Calcula idade em anos completos a partir de data ISO ou string YYYY-MM-DD
     */
    calculateAge: function(birthDateString) {
      if (!birthDateString) return null;
      const bDate = new Date(birthDateString);
      if (isNaN(bDate.getTime())) return null;
      const now = new Date();
      let age = now.getFullYear() - bDate.getFullYear();
      const m = now.getMonth() - bDate.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < bDate.getDate())) {
        age--;
      }
      return age >= 0 ? age : 0;
    },

    /**
     * Sugere a fase adequada a partir da idade de referência
     */
    suggestPhaseForAge: function(age) {
      if (age === null || age === undefined) return 'fase_1';
      if (age <= 5) return 'fase_1';
      if (age <= 7) return 'fase_2';
      if (age <= 10) return 'fase_3';
      return 'fase_4';
    },

    // =======================================================================
    // 5. RENDERIZAÇÃO DA ABA AVALIAÇÕES (Lista & Visão Geral)
    // =======================================================================
    renderEvaluationsListHTML: function(childId) {
      const storage = window.ActaStorage;
      if (!storage) return '';

      const person = childId ? storage.getPersonById(childId) : storage.getActivePerson();
      if (!person) {
        return `
          <div class="planner-card p-8 text-center bg-white border border-[#E8E2D5] rounded-3xl shadow-xs">
            <i class="fa-solid fa-child text-3xl text-[#8E9A8F] mb-2"></i>
            <p class="text-sm text-[#667267] font-medium">Nenhuma criança selecionada para observação diagnóstica.</p>
          </div>
        `;
      }

      const allEvaluations = storage.getEvaluations(person.id) || [];
      const drafts = allEvaluations.filter(e => e.status === 'draft');
      const completed = allEvaluations.filter(e => e.status !== 'draft');
      const latest = completed[0] || null;

      let html = '<div class="space-y-6">';

      // 1. Alerta amigável se houver Rascunho em aberto para a criança
      if (drafts.length > 0) {
        const draft = drafts[0];
        const draftPhase = PHASES[draft.phaseId] || PHASES.fase_1;
        html += `
          <div class="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-[#FFFBEB] via-white to-[#FEF3C7]/40 border-2 border-[#F59E0B]/30 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center text-xl shrink-0 shadow-2xs">
                <i class="fa-solid fa-pen-ruler"></i>
              </div>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-xs font-bold uppercase tracking-wider text-[#92400E]">Observação em Andamento</span>
                  <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F59E0B]/20 text-[#B45309]">${draftPhase.shortTitle}</span>
                  <span class="text-[10px] text-[#667267] font-medium">• iniciada em ${draft.formattedDate || draft.date}</span>
                </div>
                <p class="text-xs text-[#78350F] mt-0.5">
                  Você guardou um rascunho com o progresso de <strong>${person.name}</strong>. Continue a qualquer momento!
                </p>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button 
                type="button" 
                onclick="ActaDiagnostic.openNewEvaluationModal('${person.id}', '${draft.id}')"
                class="hero-btn-green text-xs font-bold px-4 py-2 rounded-full shadow-2xs flex items-center gap-1.5 transition"
              >
                <span>Continuar de onde parou</span>
                <i class="fa-solid fa-arrow-right text-[10px]"></i>
              </button>
              <button 
                type="button" 
                onclick="ActaDiagnostic.deleteDraft('${draft.id}')"
                class="text-xs text-[#8E9A8F] hover:text-[#A95337] px-2.5 py-1.5 rounded-full transition"
                title="Descartar este rascunho"
              >
                Descartar
              </button>
            </div>
          </div>
        `;
      }

      // 2. Banner de Apresentação e Boas-Vindas da Criança Ativa
      html += `
        <div class="planner-card p-6 bg-white border border-[#E8E2D5] rounded-3xl shadow-xs space-y-5">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E8E2D5] pb-5">
            <div class="flex items-center gap-3.5">
              <div class="w-14 h-14 rounded-full overflow-hidden border-2 border-[#2F5233]/20 shrink-0 bg-[#FAF7F0] shadow-2xs">
                ${storage && typeof storage.renderAvatarHTML === 'function' ? storage.renderAvatarHTML(person.avatar, 'w-full h-full object-cover', person.name) : '<div class="w-full h-full flex items-center justify-center text-lg text-[#2F5233]"><i class="fa-solid fa-child"></i></div>'}
              </div>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="font-editorial-title text-xl font-bold text-[#28302A]">${person.name}</h3>
                  <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#FAF7F0] border border-[#CCD8CD] text-[#2F5233]">
                    ${person.birthDate ? `${this.calculateAge(person.birthDate)} anos` : (person.schoolYearLabel || 'Estudante')}
                  </span>
                </div>
                <p class="text-xs text-[#667267] mt-1 max-w-xl">
                  Observação pedagógica viva em 8 eixos do desenvolvimento. Descubra o ponto de partida real sem pressão escolar.
                </p>
              </div>
            </div>

            <button 
              type="button" 
              onclick="ActaDiagnostic.openNewEvaluationModal('${person.id}')"
              class="hero-btn-green text-xs font-bold px-4 py-2.5 rounded-full shadow-xs flex items-center gap-2 shrink-0 transition"
            >
              <i class="fa-solid fa-plus text-[10px]"></i>
              <span>Nova Observação Diagnóstica</span>
            </button>
          </div>
      `;

      // 3. Exibição da Última Avaliação Concluída (ou convite se vazia)
      if (latest) {
        html += this.renderSingleEvaluationHTML(latest, true);
      } else {
        html += `
          <div class="p-8 text-center text-[#667267] space-y-3">
            <div class="w-14 h-14 rounded-2xl bg-[#FAF7F0] border border-[#E8E2D5] text-[#2F5233] flex items-center justify-center text-2xl mx-auto shadow-2xs">
              <i class="fa-solid fa-compass-drafting"></i>
            </div>
            <h4 class="font-bold text-sm text-[#28302A]">Nenhuma observação diagnóstica concluída ainda para ${person.name}</h4>
            <p class="text-xs max-w-lg mx-auto text-[#667267] leading-relaxed">
              A avaliação do ACTA não é uma prova com notas. Ela é um momento de conversa e brincadeira estruturada para ajudar a família a perceber <strong>o que já está firme</strong> e <strong>o que pode ser fortalecido sem pressa</strong>.
            </p>
            <button 
              type="button" 
              onclick="ActaDiagnostic.openNewEvaluationModal('${person.id}')"
              class="hero-btn-terracotta text-xs font-bold px-5 py-2.5 rounded-full shadow-xs inline-flex items-center gap-1.5 mt-2 transition"
            >
              <i class="fa-solid fa-feather text-[11px]"></i>
              <span>Iniciar primeira observação</span>
            </button>
          </div>
        `;
      }

      html += '</div>'; // Fecha planner-card

      // 4. Histórico de Avaliações Anteriores
      if (completed.length > 1) {
        html += `
          <div class="space-y-3 pt-2">
            <h4 class="text-xs font-bold uppercase tracking-wider text-[#28302A] flex items-center gap-2">
              <span class="planner-bullet"></span>
              <span>Histórico de Observações Anteriores (${completed.length - 1})</span>
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${completed.slice(1).map(ev => this.renderHistoryCardHTML(ev)).join('')}
            </div>
          </div>
        `;
      }

      html += '</div>';
      return html;
    },

    // Alias para manter compatibilidade com qualquer código legado
    renderDiagnosticHTML: function(childId) {
      return this.renderEvaluationsListHTML(childId);
    },

    /**
     * Renderiza o cartão de histórico de avaliações anteriores
     */
    renderHistoryCardHTML: function(ev) {
      const isV2 = ev.schemaVersion === 2;
      const phase = isV2 ? (PHASES[ev.phaseId] || PHASES.fase_1) : null;
      const dateLabel = ev.formattedDate || ev.date || 'Data anterior';
      const strengths = ev.summary?.strengthsText || ev.summaryStrengths || ev.pontosFortes || 'Observação registrada com sucesso.';

      return `
        <div class="planner-card p-4 sm:p-5 bg-white border border-[#E8E2D5] rounded-2xl shadow-2xs space-y-3">
          <div class="flex justify-between items-center text-xs border-b border-[#E8E2D5] pb-2.5">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#2F5233]"></span>
              <span class="font-bold text-[#28302A]">${isV2 ? phase.title : (ev.title || 'Avaliação Diagnóstica')}</span>
              ${ev.isPartial ? '<span class="text-[9px] bg-[#FAF7F0] text-[#667267] border border-[#CCD8CD] px-1.5 py-0.2 rounded-full">Parcial</span>' : ''}
            </div>
            <span class="text-[11px] text-[#667267] font-medium">${dateLabel}</span>
          </div>

          <p class="text-xs text-[#667267] line-clamp-2 leading-relaxed">
            ${strengths}
          </p>

          <div class="pt-1 flex items-center justify-between gap-2 border-t border-[#F0ECE4]">
            <button 
              type="button" 
              onclick="ActaDiagnostic.viewEvaluationDetails('${ev.id}')"
              class="text-xs font-bold text-[#2F5233] hover:underline flex items-center gap-1"
            >
              <span>Ver ficha completa</span>
              <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
            <button 
              type="button" 
              onclick="ActaDiagnostic.deleteEvaluationPrompt('${ev.id}')"
              class="text-xs text-[#8E9A8F] hover:text-[#A95337] transition p-1"
              title="Excluir este registro"
            >
              <i class="fa-solid fa-trash-can text-[11px]"></i>
            </button>
          </div>
        </div>
      `;
    },

    /**
     * Renderiza o corpo de uma avaliação (compatível com V1 legado e V2 novo)
     */
    renderSingleEvaluationHTML: function(ev, isFeatured) {
      if (ev.schemaVersion === 2) {
        return this.renderV2EvaluationHTML(ev, isFeatured);
      } else {
        return this.renderLegacyEvaluationHTML(ev, isFeatured);
      }
    },

    /**
     * Renderiza Avaliação Nova V2 (com os 8 Eixos e Síntese de 7 Seções)
     */
    renderV2EvaluationHTML: function(ev, isFeatured) {
      const phase = PHASES[ev.phaseId] || PHASES.fase_1;
      const summary = ev.summary || {};
      const obs = ev.observations || {};
      const totalSignals = Object.keys(obs).length;
      const firmSignals = Object.values(obs).filter(v => v === 'sozinho').length;
      const helpSignals = Object.values(obs).filter(v => v === 'com_ajuda').length;
      const notAppeared = Object.values(obs).filter(v => v === 'nao_apareceu').length;
      const unobserved = Object.values(obs).filter(v => v === 'nao_observei').length;

      return `
        <div class="pt-4 space-y-6">
          <!-- Cabeçalho do Registro -->
          <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="font-bold uppercase tracking-wider text-[#2F5233] bg-[#EBF3ED] px-3 py-1 rounded-full border border-[#2F5233]/20">
                ${phase.title}
              </span>
              ${ev.isPartial ? '<span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-[#F59E0B]/30">Observação Parcial</span>' : '<span class="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EBF3ED] text-[#2F5233]">Observação Completa</span>'}
            </div>
            <div class="flex items-center gap-3 text-[#667267]">
              <span>Realizada em: <strong>${ev.formattedDate || ev.date}</strong></span>
              <span>Por: <strong>${ev.evaluator || 'Família'}</strong></span>
            </div>
          </div>

          <!-- Resumo Quantitativo Discreto dos Sinais Observados -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
            <div class="p-2.5 rounded-2xl bg-[#EBF3ED] border border-[#2F5233]/20 flex items-center gap-2">
              <i class="fa-solid fa-circle-check text-[#2F5233] text-sm"></i>
              <div>
                <span class="text-[10px] uppercase font-bold text-[#2F5233] block">Já faz sozinho</span>
                <span class="font-bold text-[#28302A] text-xs">${firmSignals} sinais</span>
              </div>
            </div>
            <div class="p-2.5 rounded-2xl bg-[#E9EFF6] border border-[#1E3A5F]/20 flex items-center gap-2">
              <i class="fa-solid fa-hand-holding-heart text-[#1E3A5F] text-sm"></i>
              <div>
                <span class="text-[10px] uppercase font-bold text-[#1E3A5F] block">Faz com ajuda</span>
                <span class="font-bold text-[#28302A] text-xs">${helpSignals} sinais</span>
              </div>
            </div>
            <div class="p-2.5 rounded-2xl bg-[#FEF3C7] border border-[#D97706]/30 flex items-center gap-2">
              <i class="fa-solid fa-seedling text-[#D97706] text-sm"></i>
              <div>
                <span class="text-[10px] uppercase font-bold text-[#92400E] block">Ainda não apareceu</span>
                <span class="font-bold text-[#28302A] text-xs">${notAppeared} sinais</span>
              </div>
            </div>
            <div class="p-2.5 rounded-2xl bg-[#FAF7F0] border border-[#CCD8CD] flex items-center gap-2">
              <i class="fa-regular fa-circle text-[#8E9A8F] text-sm"></i>
              <div>
                <span class="text-[10px] uppercase font-bold text-[#667267] block">Não observados</span>
                <span class="font-bold text-[#28302A] text-xs">${unobserved} sinais</span>
              </div>
            </div>
          </div>

          <!-- As 4 Caixas Pedagógicas da Síntese Qualitativa -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 1. O que já aparece com firmeza -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-[#2F5233]/30 shadow-xs space-y-2">
              <div class="flex items-center gap-2 text-[#2F5233]">
                <i class="fa-solid fa-star text-sm"></i>
                <h4 class="text-xs font-bold uppercase tracking-wider">1. O que já aparece com firmeza</h4>
              </div>
              <p class="text-xs text-[#28302A] leading-relaxed whitespace-pre-line">
                ${summary.strengthsText || 'Observação consolidada com tranquilidade nas atividades propostas.'}
              </p>
            </div>

            <!-- 2. O que pode ser fortalecido agora -->
            <div class="p-4 sm:p-5 rounded-2xl bg-white border border-[#D97706]/40 shadow-xs space-y-2">
              <div class="flex items-center gap-2 text-[#92400E]">
                <i class="fa-solid fa-seedling text-sm text-[#D97706]"></i>
                <h4 class="text-xs font-bold uppercase tracking-wider">2. O que pode ser fortalecido agora</h4>
              </div>
              <p class="text-xs text-[#28302A] leading-relaxed whitespace-pre-line">
                ${summary.strengthenNowText || 'Pontos sugeridos para apoiar com paciência no ritmo diário do lar.'}
              </p>
            </div>

            <!-- 3. Base anterior que vale observar -->
            <div class="p-4 sm:p-5 rounded-2xl bg-[#FDFBF7] border border-[#CCD8CD] shadow-xs space-y-2">
              <div class="flex items-center gap-2 text-[#1E3A5F]">
                <i class="fa-solid fa-lightbulb text-sm"></i>
                <h4 class="text-xs font-bold uppercase tracking-wider">3. Base anterior a observar</h4>
              </div>
              <p class="text-xs text-[#445045] leading-relaxed whitespace-pre-line">
                ${summary.earlierFoundationText || 'Fundamento pedagógico recomendado para consolidar a segurança da criança.'}
              </p>
            </div>

            <!-- 4. Próximos passos para o planejamento -->
            <div class="p-4 sm:p-5 rounded-2xl bg-[#F0F7F2] border border-[#2F5233]/30 shadow-xs space-y-2">
              <div class="flex items-center gap-2 text-[#2F5233]">
                <i class="fa-solid fa-route text-sm"></i>
                <h4 class="text-xs font-bold uppercase tracking-wider">4. Próximos passos no planejamento</h4>
              </div>
              <p class="text-xs text-[#28302A] leading-relaxed whitespace-pre-line font-medium">
                ${summary.nextStepsText || 'Prioridades práticas sugeridas para organizar a grade semanal.'}
              </p>
            </div>
          </div>

          <!-- 5. Observações da Família (se houver) -->
          ${summary.familyNotes ? `
            <div class="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8E2D5] space-y-1.5">
              <span class="text-[10px] uppercase font-bold tracking-wider text-[#667267] block">Anotações e Reflexões da Família</span>
              <p class="text-xs text-[#28302A] leading-relaxed italic whitespace-pre-line">"${summary.familyNotes}"</p>
            </div>
          ` : ''}

          <!-- Botões de Ação do Registro -->
          <div class="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#E8E2D5]">
            <div class="flex items-center gap-2">
              <button 
                type="button" 
                onclick="ActaDiagnostic.viewEvaluationDetails('${ev.id}')"
                class="text-xs font-bold px-4 py-2 rounded-full bg-[#FAF7F0] border border-[#CCD8CD] text-[#28302A] hover:bg-[#EBF3ED] transition flex items-center gap-1.5 shadow-2xs"
              >
                <i class="fa-solid fa-list-check text-[11px] text-[#2F5233]"></i>
                <span>Ver Todos os Sinais Detalhados</span>
              </button>
              <button 
                type="button" 
                onclick="ActaDiagnostic.printEvaluation('${ev.id}')"
                class="text-xs font-medium px-3.5 py-2 rounded-full bg-white border border-[#E8E2D5] text-[#28302A] hover:bg-[#FAF7F0] transition flex items-center gap-1.5 shadow-2xs"
              >
                <i class="fa-solid fa-print text-[11px] text-[#667267]"></i>
                <span>Imprimir Ficha</span>
              </button>
            </div>

            <button 
              type="button" 
              onclick="ActaDiagnostic.deleteEvaluationPrompt('${ev.id}')"
              class="text-xs font-medium px-3 py-1.5 text-[#8E9A8F] hover:text-[#A95337] transition flex items-center gap-1"
            >
              <i class="fa-solid fa-trash-can text-[11px]"></i>
              <span>Excluir</span>
            </button>
          </div>
        </div>
      `;
    },

    /**
     * Renderiza Avaliação Histórica Legada (compatibilidade total com eval_1)
     */
    renderLegacyEvaluationHTML: function(ev, isFeatured) {
      const dateLabel = ev.formattedDate || ev.date || 'Registro anterior';
      const pItems = ev.portugues || {};
      const mItems = ev.matematica || {};

      return `
        <div class="pt-4 space-y-6">
          <div class="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span class="font-bold uppercase tracking-wider text-[#2F5233] bg-[#EBF3ED] px-3 py-1 rounded-full border border-[#2F5233]/20">
              ${ev.title || 'Avaliação Diagnóstica Inicial'}
            </span>
            <span class="text-[#667267]">Realizada em: <strong>${dateLabel}</strong> (Registro Histórico)</span>
          </div>

          <!-- Grade Legada Português & Matemática -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div class="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8E2D5] space-y-3">
              <div class="flex items-center gap-2 border-b border-[#E8E2D5] pb-2">
                <i class="fa-solid fa-book-open text-[#A95337]"></i>
                <h4 class="text-xs font-bold uppercase tracking-wider text-[#28302A]">Linguagem e Expressão</h4>
              </div>
              <div class="space-y-2 pt-1">
                ${Object.entries(pItems).map(([key, val]) => `
                  <div class="flex justify-between items-center text-xs">
                    <span class="text-[#28302A] capitalize font-medium">${key.replace(/([A-Z])/g, ' $1')}</span>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${val === 'consolidado' || val === 'Consolidado' ? 'bg-[#EBF3ED] text-[#2F5233]' : 'bg-[#FEF3C7] text-[#D97706]'}">
                      ${val}
                    </span>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-[#FAF7F0] border border-[#E8E2D5] space-y-3">
              <div class="flex items-center gap-2 border-b border-[#E8E2D5] pb-2">
                <i class="fa-solid fa-calculator text-[#1E3A5F]"></i>
                <h4 class="text-xs font-bold uppercase tracking-wider text-[#28302A]">Matemática e Raciocínio</h4>
              </div>
              <div class="space-y-2 pt-1">
                ${Object.entries(mItems).map(([key, val]) => `
                  <div class="flex justify-between items-center text-xs">
                    <span class="text-[#28302A] capitalize font-medium">${key.replace(/([A-Z])/g, ' $1')}</span>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${val === 'consolidado' || val === 'Consolidado' ? 'bg-[#EBF3ED] text-[#2F5233]' : 'bg-[#FEF3C7] text-[#D97706]'}">
                      ${val}
                    </span>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>

          <!-- Síntese Legada -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 rounded-xl bg-white border border-[#2F5233]/30 shadow-xs space-y-1.5">
              <span class="text-[10px] uppercase font-bold tracking-wider text-[#2F5233] flex items-center gap-1.5">
                <i class="fa-solid fa-circle-check"></i> Pontos Fortes
              </span>
              <p class="text-xs text-[#28302A] leading-relaxed">
                ${ev.pontosFortes || ev.summaryStrengths || 'Leitura atenta e entusiasmo.'}
              </p>
            </div>

            <div class="p-4 rounded-xl bg-white border border-[#D97706]/30 shadow-xs space-y-1.5">
              <span class="text-[10px] uppercase font-bold tracking-wider text-[#D97706] flex items-center gap-1.5">
                <i class="fa-solid fa-triangle-exclamation"></i> Pontos de Atenção
              </span>
              <p class="text-xs text-[#28302A] leading-relaxed">
                ${ev.pontosAtencao || 'Consolidação de etapas mais longas.'}
              </p>
            </div>

            <div class="p-4 rounded-xl bg-white border border-[#A95337]/30 shadow-xs space-y-1.5">
              <span class="text-[10px] uppercase font-bold tracking-wider text-[#A95337] flex items-center gap-1.5">
                <i class="fa-solid fa-rotate-right"></i> Conteúdos a Retomar
              </span>
              <p class="text-xs text-[#28302A] leading-relaxed">
                ${ev.conteudosRetomar || ev.summaryRetomar || 'Revisão periódica de conceitos.'}
              </p>
            </div>
          </div>

          ${ev.observacoes || ev.summaryNotes ? `
            <div class="p-4 rounded-xl bg-[#FDFBF7] border border-[#E8E2D5] space-y-1">
              <span class="text-[10px] uppercase font-bold tracking-wider text-[#667267]">Observações do Responsável</span>
              <p class="text-xs text-[#28302A] leading-relaxed italic">"${ev.observacoes || ev.summaryNotes}"</p>
            </div>
          ` : ''}

          <div class="pt-2 flex justify-end">
            <button 
              type="button" 
              onclick="ActaDiagnostic.deleteEvaluationPrompt('${ev.id}')"
              class="text-xs text-[#8E9A8F] hover:text-[#A95337] transition p-1"
            >
              <i class="fa-solid fa-trash-can mr-1"></i> Excluir registro histórico
            </button>
          </div>
        </div>
      `;
    },

    // =======================================================================
    // 6. FLUXO DO ASSISTENTE INTERATIVO (Wizard Modal)
    // =======================================================================
    /**
     * Abre o modal do assistente para uma nova observação ou para retomar rascunho
     */
    openNewEvaluationModal: function(targetChildId, draftId) {
      const storage = window.ActaStorage;
      if (!storage) return;

      const people = storage.getPeople() || [];
      const activePerson = storage.getActivePerson();
      const personId = targetChildId || (activePerson ? activePerson.id : (people[0] ? people[0].id : ''));
      const person = storage.getPersonById(personId);

      if (!person) {
        alert('Por favor, cadastre uma criança antes de iniciar a observação diagnóstica.');
        return;
      }

      // Se passou draftId, retoma rascunho existente
      if (draftId) {
        const draft = storage.getEvaluationById(draftId);
        if (draft) {
          this.wizard = {
            childId: draft.personId || person.id,
            phaseId: draft.phaseId || 'fase_1',
            currentStep: draft.currentStep || 1,
            date: draft.date || new Date().toISOString().split('T')[0],
            evaluator: draft.evaluator || 'Família',
            evalId: draft.id,
            isDraft: true,
            observations: Object.assign({}, draft.observations || {}),
            activityNotes: Object.assign({}, draft.activityNotes || {}),
            familyNotes: draft.summary?.familyNotes || draft.observacoes || '',
            customSummary: draft.summary ? Object.assign({}, draft.summary) : null
          };
          this.renderWizardModal();
          this.showModal();
          return;
        }
      }

      // Verifica se já existe um rascunho não finalizado para esta criança
      const existingDrafts = (storage.getEvaluations(person.id) || []).filter(e => e.status === 'draft');
      if (existingDrafts.length > 0) {
        const resume = confirm(`Você já possui um rascunho em andamento para ${person.name}. Deseja continuar o rascunho existente?\n\n(Clique em 'OK' para continuar o rascunho ou 'Cancelar' para iniciar uma nova)`);
        if (resume) {
          this.openNewEvaluationModal(person.id, existingDrafts[0].id);
          return;
        }
      }

      // Inicialização limpa
      const age = this.calculateAge(person.birthDate);
      const suggestedPhase = this.suggestPhaseForAge(age);

      this.wizard = {
        childId: person.id,
        phaseId: suggestedPhase,
        currentStep: 0, // Inicia na tela de confirmação de fase e parâmetros
        date: new Date().toISOString().split('T')[0],
        evaluator: 'Família',
        evalId: 'eval_' + Date.now(),
        isDraft: false,
        observations: {},
        activityNotes: {},
        familyNotes: '',
        customSummary: null
      };

      this.renderWizardModal();
      this.showModal();
    },

    showModal: function() {
      const modal = document.getElementById('modalDiagnosticEval');
      const overlay = document.getElementById('modalOverlay');
      if (overlay) {
        const siblings = overlay.querySelectorAll(':scope > div');
        siblings.forEach(s => s.classList.add('hidden'));
        overlay.classList.remove('hidden');
      }
      if (modal) modal.classList.remove('hidden');
    },

    closeModal: function() {
      const modal = document.getElementById('modalDiagnosticEval');
      const overlay = document.getElementById('modalOverlay');
      if (modal) modal.classList.add('hidden');
      if (overlay) overlay.classList.add('hidden');
    },

    confirmCloseModal: function() {
      const hasMarks = Object.keys(this.wizard.observations).length > 0;
      if (hasMarks) {
        const choice = confirm('Você tem observações preenchidas nesta sessão.\n\nDeseja salvar como Rascunho para continuar depois?\n\n• OK: Salvar Rascunho e fechar\n• Cancelar: Fechar sem salvar');
        if (choice) {
          this.saveDraft();
          return;
        }
      }
      this.closeModal();
    },

    /**
     * Renderiza o corpo do Wizard baseado em wizard.currentStep
     */
    renderWizardModal: function() {
      const container = document.getElementById('diagnosticWizardContainer');
      if (!container) return;

      const step = this.wizard.currentStep;
      if (step === 0) {
        container.innerHTML = this.renderWizardStepSetupHTML();
      } else if (step >= 1 && step <= 7) {
        container.innerHTML = this.renderWizardStepActivityHTML(step);
      } else if (step === 8) {
        container.innerHTML = this.renderWizardStepSummaryHTML();
      }
    },

    /**
     * ETAPA 0: Confirmação de Criança, Idade de Referência e Escolha de Fase
     */
    renderWizardStepSetupHTML: function() {
      const storage = window.ActaStorage;
      const people = storage ? storage.getPeople() : [];
      const person = storage ? storage.getPersonById(this.wizard.childId) : null;
      const age = person ? this.calculateAge(person.birthDate) : null;
      const suggestedPhase = this.suggestPhaseForAge(age);
      const isUnderAge = age !== null && age < 3;

      let html = `
        <div class="space-y-6">
          <div class="border-b border-[#E8E2D5] pb-3">
            <span class="text-[10px] font-bold uppercase tracking-widest text-[#2F5233] block">Passo 1 de 3 • Ponto de Partida</span>
            <h3 class="font-editorial-title text-xl font-bold text-[#28302A] mt-0.5">Preparar a Observação Pedagógica</h3>
            <p class="text-xs text-[#667267] mt-1">
              Esta observação ajuda a mapear o que seu filho já realiza com segurança e onde precisa de apoio sereno.
            </p>
          </div>

          <!-- Seleção da Criança e Data -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="wizChildSelect" class="block text-xs font-bold text-[#28302A] mb-1">Criança a Observar</label>
              <select 
                id="wizChildSelect" 
                onchange="ActaDiagnostic.onChildChangeInWizard(this.value)"
                class="w-full text-xs p-2.5 border border-[#E8E2D5] rounded-xl bg-[#FAF7F0] focus:bg-white focus:outline-none font-semibold text-[#28302A]"
              >
                ${people.map(p => `
                  <option value="${p.id}" ${p.id === this.wizard.childId ? 'selected' : ''}>
                    ${p.name} ${p.birthDate ? `(${this.calculateAge(p.birthDate)} anos)` : ''}
                  </option>
                `).join('')}
              </select>
            </div>
            <div>
              <label for="wizDateInput" class="block text-xs font-bold text-[#28302A] mb-1">Data da Observação</label>
              <input 
                type="date" 
                id="wizDateInput" 
                value="${this.wizard.date}" 
                onchange="ActaDiagnostic.wizard.date = this.value"
                class="w-full text-xs p-2.5 border border-[#E8E2D5] rounded-xl bg-[#FAF7F0] focus:bg-white focus:outline-none"
              >
            </div>
          </div>

          ${isUnderAge ? `
            <div class="p-4 rounded-2xl bg-[#EBF3ED] border border-[#2F5233]/30 flex items-start gap-3 text-xs text-[#28302A]">
              <i class="fa-solid fa-circle-info text-[#2F5233] text-base shrink-0 mt-0.5"></i>
              <div>
                <strong>Acolhimento da Primeira Infância:</strong>
                <p class="text-[#445045] mt-0.5">
                  Este roteiro estruturado começa formalmente a partir dos <strong>3 anos de idade</strong>. Para crianças menores, respeite o ritmo natural de brincadeiras livres e convivência do lar. Você pode usar as atividades da Fase 1 como referência sem nenhuma cobrança!
                </p>
              </div>
            </div>
          ` : ''}

          <!-- Escolha da Fase de Referência -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-[#28302A]">
                Fase de Referência Pedagógica
              </label>
              <span class="text-[11px] text-[#2F5233] font-semibold">
                Sugerida: <strong>${PHASES[suggestedPhase].shortTitle}</strong>
              </span>
            </div>

            <p class="text-xs text-[#667267]">
              A idade é apenas uma referência pedagógica, não uma régua rígida. Se desejar fortalecer a base antes de avançar, você pode escolher observar uma fase anterior com total liberdade.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              ${Object.values(PHASES).map(ph => {
                const isSelected = ph.id === this.wizard.phaseId;
                const isSug = ph.id === suggestedPhase;
                return `
                  <div 
                    onclick="ActaDiagnostic.selectPhase('${ph.id}')"
                    class="p-4 rounded-2xl border cursor-pointer transition-all ${isSelected ? 'border-[#2F5233] bg-[#EBF3ED]/50 ring-2 ring-[#2F5233]/20 shadow-xs' : 'border-[#E8E2D5] bg-white hover:border-[#2F5233]/40'}"
                  >
                    <div class="flex items-center justify-between mb-1.5">
                      <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-[#2F5233]' : 'bg-[#CCD8CD]'}"></span>
                        <h4 class="text-xs font-bold text-[#28302A]">${ph.title}</h4>
                      </div>
                      ${isSug ? '<span class="text-[9px] bg-[#2F5233] text-white font-bold px-2 py-0.5 rounded-full">Sugerida</span>' : ''}
                    </div>
                    <p class="text-[11px] text-[#667267] line-clamp-3 leading-relaxed">
                      ${ph.focus}
                    </p>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Rodapé de Navegação da Etapa 0 -->
          <div class="pt-4 flex items-center justify-between gap-3 border-t border-[#E8E2D5]">
            <button 
              type="button" 
              onclick="ActaDiagnostic.closeModal()"
              class="text-xs font-medium px-4 py-2 rounded-full text-[#667267] hover:bg-[#FAF7F0] transition"
            >
              Cancelar
            </button>
            <button 
              type="button" 
              onclick="ActaDiagnostic.goToStep(1)"
              class="hero-btn-green text-xs font-bold px-6 py-2.5 rounded-full shadow-sm flex items-center gap-2"
            >
              <span>Iniciar Observação (7 Atividades)</span>
              <i class="fa-solid fa-arrow-right text-[10px]"></i>
            </button>
          </div>
        </div>
      `;

      return html;
    },

    /**
     * ETAPA 1 a 7: Cartão Individual de Atividade com Sinais Observáveis
     */
    renderWizardStepActivityHTML: function(stepNumber) {
      const phase = PHASES[this.wizard.phaseId] || PHASES.fase_1;
      const activityIndex = stepNumber - 1;
      const activity = phase.activities[activityIndex];
      if (!activity) return '';

      const totalSteps = 7;
      const pct = Math.round((stepNumber / totalSteps) * 100);
      const activityNotes = this.wizard.activityNotes[activity.id] || '';

      let html = `
        <div class="space-y-5">
          <!-- Barra de Progresso Superior -->
          <div class="space-y-2">
            <div class="flex items-center justify-between text-xs">
              <span class="font-bold text-[#28302A] flex items-center gap-2">
                <span class="w-6 h-6 rounded-full bg-[#2F5233] text-white flex items-center justify-center text-[10px] font-mono">${stepNumber}</span>
                <span>Atividade ${stepNumber} de ${totalSteps} • ${phase.shortTitle}</span>
              </span>
              <span class="text-[11px] text-[#667267] font-medium">${pct}% concluído</span>
            </div>
            <div class="w-full bg-[#E8E2D5] h-2 rounded-full overflow-hidden shadow-inner">
              <div class="bg-gradient-to-r from-[#2F5233] to-[#437549] h-full rounded-full transition-all duration-300" style="width: ${pct}%"></div>
            </div>
          </div>

          <!-- Cartão da Atividade Atual -->
          <div class="p-5 rounded-3xl bg-white border border-[#E8E2D5] shadow-xs space-y-4">
            <!-- Título e Eixos da Atividade -->
            <div>
              <div class="flex items-center gap-2 flex-wrap mb-1">
                ${activity.axes.map(axId => {
                  const ax = AXES[axId] || { name: axId, bg: 'bg-[#FAF7F0]', color: 'text-[#28302A]' };
                  return `<span class="text-[10px] font-bold px-2 py-0.5 rounded-full ${ax.bg} ${ax.color}">${ax.name}</span>`;
                }).join('')}
              </div>
              <h3 class="font-editorial-title text-lg font-bold text-[#28302A]">${activity.title}</h3>
            </div>

            <!-- Como Fazer -->
            <div class="p-3.5 rounded-2xl bg-[#FDFBF7] border border-[#E8E2D5] text-xs space-y-1">
              <span class="font-bold uppercase tracking-wider text-[#2F5233] text-[10px] block">Como fazer:</span>
              <p class="text-[#28302A] leading-relaxed">${activity.howTo}</p>
            </div>

            <!-- Exemplo Acolhedor -->
            <div class="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#CCD8CD] text-xs space-y-1">
              <span class="font-bold uppercase tracking-wider text-[#8C472E] text-[10px] block">Exemplo para a família:</span>
              <p class="text-[#667267] italic leading-relaxed">“${activity.example}”</p>
            </div>

            <!-- Atalho de marcação rápida em lote -->
            <div class="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#F0ECE4]">
              <span class="text-xs font-bold text-[#28302A]">Observe se a criança:</span>
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="text-[10px] text-[#8E9A8F]">Marcar todos:</span>
                <button 
                  type="button" 
                  onclick="ActaDiagnostic.setAllSignalsInActivity('${activity.id}', 'sozinho')"
                  class="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF7F0] hover:bg-[#EBF3ED] text-[#2F5233] border border-[#CCD8CD] transition font-semibold"
                >
                  ✓ Sozinho
                </button>
                <button 
                  type="button" 
                  onclick="ActaDiagnostic.setAllSignalsInActivity('${activity.id}', 'com_ajuda')"
                  class="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF7F0] hover:bg-[#E9EFF6] text-[#1E3A5F] border border-[#CCD8CD] transition font-semibold"
                >
                  🤝 C/ ajuda
                </button>
                <button 
                  type="button" 
                  onclick="ActaDiagnostic.setAllSignalsInActivity('${activity.id}', 'nao_observei')"
                  class="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF7F0] hover:bg-[#F0ECE4] text-[#667267] border border-[#CCD8CD] transition font-semibold"
                >
                  ⚪ Pular
                </button>
              </div>
            </div>

            <!-- Lista de Sinais Observáveis com as 4 Pílulas Interativas -->
            <div class="space-y-4 pt-1">
              ${activity.signals.map((sig, sigIdx) => {
                const currentVal = this.wizard.observations[sig.id] || null;
                return `
                  <div class="p-3.5 rounded-2xl border transition-all ${currentVal ? 'bg-white border-[#CCD8CD] shadow-2xs' : 'bg-[#FAF7F0]/60 border-[#E8E2D5]'}">
                    <div class="flex items-start gap-2 mb-2">
                      <span class="w-5 h-5 rounded-full bg-[#FAF7F0] border border-[#CCD8CD] text-[#2F5233] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">${sigIdx + 1}</span>
                      <p class="text-xs font-medium text-[#28302A] leading-snug">${sig.text}</p>
                    </div>

                    <!-- 4 Botões de Estado -->
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1">
                      ${Object.values(STATES).map(st => {
                        const isSelected = currentVal === st.id;
                        return `
                          <button 
                            type="button" 
                            onclick="ActaDiagnostic.setSignalState('${sig.id}', '${st.id}')"
                            class="text-[11px] px-2.5 py-1.5 rounded-xl border text-center transition flex items-center justify-center gap-1.5 font-medium ${isSelected ? st.activeClass + ' font-bold shadow-xs' : 'bg-white border-[#E8E2D5] text-[#445045] hover:bg-[#FAF7F0]'}"
                            title="${st.desc}"
                          >
                            <i class="${st.icon} text-[10px]"></i>
                            <span class="truncate">${st.label}</span>
                          </button>
                        `;
                      }).join('')}
                    </div>
                  </div>
                `;
              }).join('')}
            </div>

            <!-- Campo Opcional: O que notei nesta atividade? -->
            <div class="pt-2">
              <label for="actNote_${activity.id}" class="block text-xs font-bold text-[#28302A] mb-1">
                O que notei nesta atividade? <span class="text-[#8E9A8F] font-normal">(Opcional)</span>
              </label>
              <textarea 
                id="actNote_${activity.id}"
                rows="2"
                onchange="ActaDiagnostic.saveActivityNote('${activity.id}', this.value)"
                placeholder="Ex: Teve muito entusiasmo com a história; precisou de apoio nas etapas finais; estava um pouco cansado hoje..."
                class="w-full text-xs p-2.5 border border-[#E8E2D5] rounded-xl bg-[#FAF7F0] focus:bg-white focus:outline-none"
              >${activityNotes}</textarea>
            </div>
          </div>

          <!-- Rodapé de Navegação com Salvar Rascunho -->
          <div class="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#E8E2D5]">
            <div class="flex items-center gap-2">
              <button 
                type="button" 
                onclick="ActaDiagnostic.goToStep(${stepNumber - 1})"
                class="text-xs font-semibold px-4 py-2 rounded-full border border-[#CCD8CD] bg-white text-[#28302A] hover:bg-[#FAF7F0] transition flex items-center gap-1"
              >
                <i class="fa-solid fa-arrow-left text-[10px]"></i>
                <span>Anterior</span>
              </button>
              <button 
                type="button" 
                onclick="ActaDiagnostic.saveDraft()"
                class="text-xs font-semibold px-3.5 py-2 rounded-full border border-[#D97706]/40 bg-[#FFFBEB] text-[#92400E] hover:bg-[#FEF3C7] transition flex items-center gap-1 shadow-2xs"
                title="Salvar rascunho para continuar em outro dia"
              >
                <i class="fa-regular fa-bookmark text-[10px]"></i>
                <span>Salvar Rascunho</span>
              </button>
            </div>

            <div class="flex items-center gap-2">
              <button 
                type="button" 
                onclick="ActaDiagnostic.goToStep(8)"
                class="text-xs font-medium px-3.5 py-2 rounded-full bg-white text-[#667267] hover:text-[#28302A] hover:bg-[#FAF7F0] transition"
                title="Pular direto para a conclusão mesmo que parcial"
              >
                Concluir agora...
              </button>
              <button 
                type="button" 
                onclick="ActaDiagnostic.goToStep(${stepNumber + 1})"
                class="hero-btn-green text-xs font-bold px-5 py-2 rounded-full shadow-sm flex items-center gap-1.5 transition"
              >
                <span>${stepNumber === 7 ? 'Revisar Síntese →' : 'Próxima Atividade →'}</span>
              </button>
            </div>
          </div>
        </div>
      `;

      return html;
    },

    /**
     * ETAPA 8: Síntese Qualitativa com 7 Seções e Opção de Edição
     */
    renderWizardStepSummaryHTML: function() {
      const storage = window.ActaStorage;
      const person = storage ? storage.getPersonById(this.wizard.childId) : null;
      const phase = PHASES[this.wizard.phaseId] || PHASES.fase_1;

      // Gera a síntese pedagógica inicial se ainda não gerada
      if (!this.wizard.customSummary) {
        this.wizard.customSummary = this.generateSynthesis();
      }

      const sum = this.wizard.customSummary;
      const obs = this.wizard.observations;
      const totalSignals = phase.activities.reduce((acc, a) => acc + a.signals.length, 0);
      const answeredSignals = Object.keys(obs).filter(k => obs[k] && obs[k] !== 'nao_observei').length;
      const isPartial = answeredSignals < totalSignals;

      let html = `
        <div class="space-y-6">
          <div class="border-b border-[#E8E2D5] pb-3">
            <span class="text-[10px] font-bold uppercase tracking-widest text-[#2F5233] block">Passo 3 de 3 • Síntese & Próximos Passos</span>
            <h3 class="font-editorial-title text-xl font-bold text-[#28302A] mt-0.5">Síntese Pedagógica Qualitativa</h3>
            <p class="text-xs text-[#667267] mt-1">
              Estudante: <strong>${person ? person.name : 'Estudante'}</strong> • ${phase.title} • 
              ${isPartial ? '<span class="text-[#D97706] font-semibold">Observação Parcial</span>' : '<span class="text-[#2F5233] font-semibold">Observação Completa</span>'}
            </p>
          </div>

          <p class="text-xs text-[#667267] leading-relaxed">
            As sugestões abaixo foram geradas automaticamente para orientar o planejamento do seu lar. Você tem total liberdade para editar os textos como preferir antes de arquivar!
          </p>

          <!-- 1. O que já aparece com firmeza -->
          <div class="p-4 rounded-2xl bg-[#EBF3ED]/40 border border-[#2F5233]/30 space-y-2">
            <label for="sumStrengths" class="block text-xs font-bold uppercase tracking-wider text-[#2F5233] flex items-center gap-2">
              <i class="fa-solid fa-star"></i>
              <span>1. O que já aparece com firmeza</span>
            </label>
            <textarea 
              id="sumStrengths"
              rows="3"
              onchange="ActaDiagnostic.wizard.customSummary.strengthsText = this.value"
              class="w-full text-xs p-3 border border-[#CCD8CD] rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#2F5233]"
            >${sum.strengthsText}</textarea>
          </div>

          <!-- 2. O que pode ser fortalecido agora -->
          <div class="p-4 rounded-2xl bg-[#FEF3C7]/40 border border-[#D97706]/40 space-y-2">
            <label for="sumStrengthen" class="block text-xs font-bold uppercase tracking-wider text-[#92400E] flex items-center gap-2">
              <i class="fa-solid fa-seedling text-[#D97706]"></i>
              <span>2. O que pode ser fortalecido agora (Sem pressa)</span>
            </label>
            <textarea 
              id="sumStrengthen"
              rows="3"
              onchange="ActaDiagnostic.wizard.customSummary.strengthenNowText = this.value"
              class="w-full text-xs p-3 border border-[#F59E0B]/40 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#D97706]"
            >${sum.strengthenNowText}</textarea>
          </div>

          <!-- 3. Base anterior a observar -->
          <div class="p-4 rounded-2xl bg-[#FDFBF7] border border-[#CCD8CD] space-y-2">
            <label for="sumFoundation" class="block text-xs font-bold uppercase tracking-wider text-[#1E3A5F] flex items-center gap-2">
              <i class="fa-solid fa-lightbulb text-[#1E3A5F]"></i>
              <span>3. Uma base anterior que vale observar</span>
            </label>
            <textarea 
              id="sumFoundation"
              rows="2"
              onchange="ActaDiagnostic.wizard.customSummary.earlierFoundationText = this.value"
              class="w-full text-xs p-3 border border-[#CCD8CD] rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
            >${sum.earlierFoundationText}</textarea>
          </div>

          <!-- 4. Próximos passos para o planejamento -->
          <div class="p-4 rounded-2xl bg-[#F0F7F2] border border-[#2F5233]/40 space-y-2">
            <label for="sumNextSteps" class="block text-xs font-bold uppercase tracking-wider text-[#2F5233] flex items-center gap-2">
              <i class="fa-solid fa-route text-[#2F5233]"></i>
              <span>4. Próximos passos para o planejamento da família</span>
            </label>
            <textarea 
              id="sumNextSteps"
              rows="3"
              onchange="ActaDiagnostic.wizard.customSummary.nextStepsText = this.value"
              class="w-full text-xs p-3 border border-[#2F5233]/40 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-[#2F5233] font-medium"
            >${sum.nextStepsText}</textarea>
          </div>

          <!-- 5. Algo para explorar depois -->
          <div class="p-4 rounded-2xl bg-[#FAF7F0] border border-[#CCD8CD] space-y-2">
            <label for="sumExploreLater" class="block text-xs font-bold uppercase tracking-wider text-[#667267] flex items-center gap-2">
              <i class="fa-solid fa-compass text-[#667267]"></i>
              <span>5. Algo que pode começar a explorar depois (Opcional)</span>
            </label>
            <input 
              type="text"
              id="sumExploreLater"
              value="${sum.exploreLaterText}"
              onchange="ActaDiagnostic.wizard.customSummary.exploreLaterText = this.value"
              class="w-full text-xs p-2.5 border border-[#CCD8CD] rounded-xl bg-white focus:outline-none"
            >
          </div>

          <!-- 6. Observações livres da Família -->
          <div class="space-y-1.5">
            <label for="wizFamilyNotes" class="block text-xs font-bold text-[#28302A]">
              6. Observações Livres da Família
            </label>
            <textarea 
              id="wizFamilyNotes"
              rows="2"
              onchange="ActaDiagnostic.wizard.familyNotes = this.value"
              placeholder="Ex: Foi uma observação muito gostosa; ele gostou especialmente de ouvir a história..."
              class="w-full text-xs p-2.5 border border-[#E8E2D5] rounded-xl bg-[#FAF7F0] focus:bg-white focus:outline-none"
            >${this.wizard.familyNotes || ''}</textarea>
          </div>

          <!-- Rodapé de Salvamento -->
          <div class="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#E8E2D5]">
            <button 
              type="button" 
              onclick="ActaDiagnostic.goToStep(7)"
              class="text-xs font-semibold px-4 py-2 rounded-full border border-[#CCD8CD] bg-white text-[#28302A] hover:bg-[#FAF7F0] transition flex items-center gap-1"
            >
              <i class="fa-solid fa-arrow-left text-[10px]"></i>
              <span>Rever Atividades</span>
            </button>

            <div class="flex items-center gap-2">
              <button 
                type="button" 
                onclick="ActaDiagnostic.saveDraft()"
                class="text-xs font-semibold px-4 py-2 rounded-full border border-[#D97706]/40 bg-[#FFFBEB] text-[#92400E] hover:bg-[#FEF3C7] transition"
              >
                Salvar Rascunho
              </button>
              <button 
                type="button" 
                onclick="ActaDiagnostic.concludeEvaluation()"
                class="hero-btn-green text-xs font-bold px-6 py-2.5 rounded-full shadow-md flex items-center gap-2 transition"
              >
                <i class="fa-solid fa-circle-check text-xs"></i>
                <span>Concluir e Arquivar no Dossiê</span>
              </button>
            </div>
          </div>
        </div>
      `;

      return html;
    },

    // =======================================================================
    // 7. MOTOR DE SÍNTESE QUALITATIVA (Base Pedagógica e Heurísticas)
    // =======================================================================
    generateSynthesis: function() {
      const phase = PHASES[this.wizard.phaseId] || PHASES.fase_1;
      const obs = this.wizard.observations;
      const firmItems = [];
      const helpItems = [];
      const notAppearedItems = [];

      phase.activities.forEach(act => {
        act.signals.forEach(sig => {
          const val = obs[sig.id];
          if (val === 'sozinho') firmItems.push({ text: sig.text, axes: sig.axes });
          else if (val === 'com_ajuda') helpItems.push({ text: sig.text, axes: sig.axes });
          else if (val === 'nao_apareceu') notAppearedItems.push({ text: sig.text, axes: sig.axes });
        });
      });

      // 1. Pontos Firmes
      let strengthsText = '';
      if (firmItems.length > 0) {
        const topFirm = firmItems.slice(0, 3).map(i => `• ${i.text}`).join('\n');
        strengthsText = `Demonstra firmeza e boa autonomia nos seguintes pontos observados:\n${topFirm}`;
      } else {
        strengthsText = 'A criança demonstrou receptividade e interesse durante a conversa e nas atividades propostas com apoio do educador.';
      }

      // 2. O que pode ser fortalecido agora
      let strengthenNowText = '';
      const needSupport = [...helpItems, ...notAppearedItems];
      if (needSupport.length > 0) {
        const topNeed = needSupport.slice(0, 3).map(i => `• ${i.text}`).join('\n');
        strengthenNowText = `Pontos para fortalecer com carinho, paciência e pequenos passos diários:\n${topNeed}`;
      } else {
        strengthenNowText = 'Manter a constância das leituras em voz alta, conversas ricas e pequenos desafios adequados ao ritmo da família.';
      }

      // 3. Uma base anterior que vale observar
      let earlierFoundationText = '';
      if (this.wizard.phaseId === 'fase_1') {
        earlierFoundationText = 'Garantir bastante conversa sobre objetos reais, histórias em voz alta e brincadeiras motoras ao ar livre antes de exigir respostas abstratas.';
      } else if (this.wizard.phaseId === 'fase_2') {
        earlierFoundationText = 'Vale verificar se os sons das letras e rimas orais já estão naturais e divertidos antes de exigir fluência na leitura de textos longos.';
      } else if (this.wizard.phaseId === 'fase_3') {
        earlierFoundationText = 'Vale certificar-se de que a leitura em voz alta e a contagem concreta com objetos estão firmes antes de cobrar cálculos abstratos ou parágrafos extensos.';
      } else {
        earlierFoundationText = 'Verificar se o hábito de leitura regular e a organização pessoal de pequenas etapas cotidianas estão estabelecidos antes de cobrar autonomia completa em projetos longos.';
      }

      // 4. Próximos passos para o planejamento
      let nextStepsText = '';
      if (this.wizard.phaseId === 'fase_1') {
        nextStepsText = '1. Dedicar 15 minutos diários de leitura de histórias vivas em voz alta e conversa acolhedora.\n2. Convidar a criança para participar de pequenas rotinas do lar (guardar brinquedos, organizar sapatos).';
      } else if (this.wizard.phaseId === 'fase_2') {
        nextStepsText = '1. Praticar diariamente a relação som-letra e pequenas frases com sentido em Língua Portuguesa.\n2. Resolver desafios numéricos práticos (repartir frutas, contar talheres) no cotidiano familiar.';
      } else if (this.wizard.phaseId === 'fase_3') {
        nextStepsText = '1. Trabalhar a compreensão de texto com paráfrase (pedir que reconte a ideia principal com suas palavras).\n2. Estimular a autonomia na rotina de estudos, conferindo o próprio material antes e depois das aulas.';
      } else {
        nextStepsText = '1. Fortalecer a defesa de ideias por escrito e a leitura atenta de textos expositivos e literários.\n2. Encorajar o planejamento semanal de estudos e a reflexão serena sobre escolhas e consequências.';
      }

      // 5. Algo que pode começar a explorar depois
      let exploreLaterText = 'Introduzir novos livros com vocabulário mais rico e pequenos experimentos práticos na natureza.';

      return {
        strengthsText,
        strengthenNowText,
        earlierFoundationText,
        nextStepsText,
        exploreLaterText,
        familyNotes: ''
      };
    },

    // =======================================================================
    // 8. INTERAÇÕES E ATUALIZAÇÕES DO WIZARD
    // =======================================================================
    onChildChangeInWizard: function(newChildId) {
      this.wizard.childId = newChildId;
      const storage = window.ActaStorage;
      const person = storage ? storage.getPersonById(newChildId) : null;
      if (person) {
        const age = this.calculateAge(person.birthDate);
        this.wizard.phaseId = this.suggestPhaseForAge(age);
      }
      this.renderWizardModal();
    },

    selectPhase: function(phaseId) {
      this.wizard.phaseId = phaseId;
      this.renderWizardModal();
    },

    goToStep: function(stepNumber) {
      if (stepNumber < 0) stepNumber = 0;
      if (stepNumber > 8) stepNumber = 8;
      this.wizard.currentStep = stepNumber;
      this.renderWizardModal();
      // Rola o modal até o topo suavemente
      const modal = document.getElementById('modalDiagnosticEval');
      if (modal) modal.scrollTo({ top: 0, behavior: 'smooth' });
    },

    setSignalState: function(signalId, stateKey) {
      this.wizard.observations[signalId] = stateKey;
      this.renderWizardModal();
    },

    setAllSignalsInActivity: function(activityId, stateKey) {
      const phase = PHASES[this.wizard.phaseId] || PHASES.fase_1;
      const act = phase.activities.find(a => a.id === activityId);
      if (act) {
        act.signals.forEach(sig => {
          this.wizard.observations[sig.id] = stateKey;
        });
        this.renderWizardModal();
      }
    },

    saveActivityNote: function(activityId, text) {
      this.wizard.activityNotes[activityId] = text.trim();
    },

    // =======================================================================
    // 9. SALVAMENTO (RASCUNHO vs CONCLUÍDO)
    // =======================================================================
    saveDraft: function() {
      const storage = window.ActaStorage;
      if (!storage) return;

      const person = storage.getPersonById(this.wizard.childId);
      const childName = person ? person.name : 'Estudante';
      const phase = PHASES[this.wizard.phaseId] || PHASES.fase_1;

      // Salva rascunho com todos os estados atuais preservados
      const evalData = {
        id: this.wizard.evalId || ('eval_' + Date.now()),
        schemaVersion: 2,
        personId: this.wizard.childId,
        personName: childName,
        date: this.wizard.date || new Date().toISOString().split('T')[0],
        evaluator: this.wizard.evaluator || 'Família',
        phaseId: this.wizard.phaseId,
        status: 'draft',
        isPartial: true,
        currentStep: this.wizard.currentStep || 1,
        observations: Object.assign({}, this.wizard.observations),
        activityNotes: Object.assign({}, this.wizard.activityNotes),
        summary: this.wizard.customSummary ? Object.assign({}, this.wizard.customSummary) : null,
        title: `Observação Diagnóstica (${phase.shortTitle})`,
        pontosFortes: 'Rascunho em andamento.',
        summaryStrengths: 'Rascunho em andamento.',
        observacoes: this.wizard.familyNotes || ''
      };

      storage.saveEvaluation(evalData);
      this.closeModal();

      if (window.ActaApp && typeof window.ActaApp.showToast === 'function') {
        window.ActaApp.showToast(`📝 Rascunho de ${childName} salvo com sucesso!`);
      }
      if (window.ActaApp && typeof window.ActaApp.renderAvaliacoesTab === 'function') {
        window.ActaApp.renderAvaliacoesTab();
      }
    },

    computeAxesSummary: function(phaseId, observations) {
      const phase = PHASES[phaseId] || PHASES.fase_1;
      const obs = observations || {};
      const summary = {};
      Object.keys(AXES).forEach(axisKey => {
        summary[axisKey] = { sozinho: 0, com_ajuda: 0, nao_apareceu: 0, nao_observei: 0, total: 0 };
      });
      phase.activities.forEach(act => {
        act.signals.forEach(sig => {
          const val = obs[sig.id] || 'nao_observei';
          (sig.axes || []).forEach(axisKey => {
            if (summary[axisKey]) {
              summary[axisKey].total++;
              if (summary[axisKey][val] !== undefined) summary[axisKey][val]++;
            }
          });
        });
      });
      return summary;
    },

    concludeEvaluation: function() {
      const storage = window.ActaStorage;
      if (!storage) return;

      const person = storage.getPersonById(this.wizard.childId);
      const childName = person ? person.name : 'Estudante';
      const phase = PHASES[this.wizard.phaseId] || PHASES.fase_1;

      // Garante que a síntese foi gerada
      if (!this.wizard.customSummary) {
        this.wizard.customSummary = this.generateSynthesis();
      }

      // Lê valores atualizados dos textareas se estiver no step 8
      const sumStrengths = document.getElementById('sumStrengths');
      if (sumStrengths && sumStrengths.value.trim()) this.wizard.customSummary.strengthsText = sumStrengths.value.trim();

      const sumStrengthen = document.getElementById('sumStrengthen');
      if (sumStrengthen && sumStrengthen.value.trim()) this.wizard.customSummary.strengthenNowText = sumStrengthen.value.trim();

      const sumFoundation = document.getElementById('sumFoundation');
      if (sumFoundation && sumFoundation.value.trim()) this.wizard.customSummary.earlierFoundationText = sumFoundation.value.trim();

      const sumNextSteps = document.getElementById('sumNextSteps');
      if (sumNextSteps && sumNextSteps.value.trim()) this.wizard.customSummary.nextStepsText = sumNextSteps.value.trim();

      const sumExploreLater = document.getElementById('sumExploreLater');
      if (sumExploreLater && sumExploreLater.value.trim()) this.wizard.customSummary.exploreLaterText = sumExploreLater.value.trim();

      const wizFamilyNotes = document.getElementById('wizFamilyNotes');
      if (wizFamilyNotes && wizFamilyNotes.value.trim()) this.wizard.familyNotes = wizFamilyNotes.value.trim();

      this.wizard.customSummary.familyNotes = this.wizard.familyNotes;

      const totalSignals = phase.activities.reduce((acc, a) => acc + a.signals.length, 0);
      const answeredSignals = Object.keys(this.wizard.observations).filter(k => this.wizard.observations[k] && this.wizard.observations[k] !== 'nao_observei').length;
      const isPartial = answeredSignals < totalSignals;

      // Monta objeto compatível com novos padrões e relatórios legados
      const completedEval = {
        id: this.wizard.evalId || ('eval_' + Date.now()),
        schemaVersion: 2,
        personId: this.wizard.childId,
        personName: childName,
        date: this.wizard.date || new Date().toISOString().split('T')[0],
        evaluator: this.wizard.evaluator || 'Família',
        phaseId: this.wizard.phaseId,
        phaseTitle: phase.title,
        status: 'completed',
        isPartial: isPartial,
        currentStep: 8,
        observations: Object.assign({}, this.wizard.observations),
        activityNotes: Object.assign({}, this.wizard.activityNotes),
        summary: Object.assign({}, this.wizard.customSummary),
        qualitativeSynthesis: {
          firm: this.wizard.customSummary.strengthsText,
          strengthen: this.wizard.customSummary.strengthenNowText,
          nextStep: this.wizard.customSummary.nextStepsText,
          foundation: this.wizard.customSummary.earlierFoundationText,
          priorities: this.wizard.customSummary.exploreLaterText
        },
        familyNotes: this.wizard.familyNotes || '',
        axesSummary: this.computeAxesSummary(this.wizard.phaseId, this.wizard.observations),
        // Campos legados para relatórios e leitores antigos
        title: `Observação Diagnóstica — ${phase.shortTitle}`,
        summaryStrengths: this.wizard.customSummary.strengthsText,
        summaryRetomar: this.wizard.customSummary.strengthenNowText,
        summaryNotes: this.wizard.familyNotes,
        pontosFortes: this.wizard.customSummary.strengthsText,
        pontosAtencao: this.wizard.customSummary.strengthenNowText,
        conteudosRetomar: this.wizard.customSummary.earlierFoundationText,
        observacoes: this.wizard.familyNotes,
        portugues: {
          leitura: 'Consolidado',
          compreensao: 'Consolidado',
          escrita: 'Em desenvolvimento',
          vocabulario: 'Consolidado'
        },
        matematica: {
          raciocinio: 'Consolidado',
          operacoes: 'Em desenvolvimento',
          problemas: 'Em desenvolvimento',
          calculo: 'Consolidado'
        }
      };

      storage.saveEvaluation(completedEval);
      this.closeModal();

      if (window.ActaApp && typeof window.ActaApp.showToast === 'function') {
        window.ActaApp.showToast(`✅ Observação diagnóstica de ${childName} arquivada no dossiê!`);
      }
      if (window.ActaApp && typeof window.ActaApp.renderAvaliacoesTab === 'function') {
        window.ActaApp.renderAvaliacoesTab();
      }
      if (window.ActaApp && typeof window.ActaApp.renderDossieTab === 'function') {
        window.ActaApp.renderDossieTab();
      }
    },

    deleteDraft: function(draftId) {
      if (confirm('Deseja descartar este rascunho de observação?')) {
        const storage = window.ActaStorage;
        if (storage) {
          storage.deleteEvaluation(draftId);
          if (window.ActaApp && typeof window.ActaApp.renderAvaliacoesTab === 'function') {
            window.ActaApp.renderAvaliacoesTab();
          }
          if (window.ActaApp && typeof window.ActaApp.showToast === 'function') {
            window.ActaApp.showToast('Rascunho descartado.');
          }
        }
      }
    },

    deleteEvaluationPrompt: function(evalId) {
      if (confirm('Deseja realmente excluir esta observação diagnóstica do histórico da família?')) {
        const storage = window.ActaStorage;
        if (storage) {
          storage.deleteEvaluation(evalId);
          if (window.ActaApp && typeof window.ActaApp.renderAvaliacoesTab === 'function') {
            window.ActaApp.renderAvaliacoesTab();
          }
          if (window.ActaApp && typeof window.ActaApp.renderDossieTab === 'function') {
            window.ActaApp.renderDossieTab();
          }
          if (window.ActaApp && typeof window.ActaApp.showToast === 'function') {
            window.ActaApp.showToast('Observação removida.');
          }
        }
      }
    },

    // =======================================================================
    // 10. VISUALIZAÇÃO COMPLETA & IMPRESSÃO
    // =======================================================================
    viewEvaluationDetails: function(evalId) {
      const storage = window.ActaStorage;
      if (!storage) return;

      const ev = storage.getEvaluationById(evalId);
      if (!ev) return;

      const modal = document.getElementById('modalViewDiagnosticEval');
      const container = document.getElementById('viewDiagnosticModalBody');
      const titleEl = document.getElementById('viewDiagnosticModalTitle');

      if (!modal || !container) return;

      if (titleEl) {
        titleEl.textContent = ev.title || 'Observação Diagnóstica';
      }

      container.innerHTML = this.renderSingleEvaluationHTML(ev, false);

      const overlay = document.getElementById('modalOverlay');
      if (overlay) {
        const siblings = overlay.querySelectorAll(':scope > div');
        siblings.forEach(s => s.classList.add('hidden'));
        overlay.classList.remove('hidden');
      }
      modal.classList.remove('hidden');
    },

    closeViewModal: function() {
      const modal = document.getElementById('modalViewDiagnosticEval');
      const overlay = document.getElementById('modalOverlay');
      if (modal) modal.classList.add('hidden');
      if (overlay) overlay.classList.add('hidden');
    },

    printEvaluation: function(evalId) {
      window.print();
    }
  };

  window.ActaDiagnostic = ActaDiagnostic;
})(window);
