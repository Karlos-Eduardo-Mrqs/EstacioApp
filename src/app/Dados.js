export const listaCursos = [
  { 
    id: '1', 
    titulo: 'Administração', 
    descricao: 'Bacharelado focado em gestão corporativa, finanças e empreendedorismo.', 
    modalidade: 'EAD, Presencial, Semipresencial',
    link: 'https://estacio.br/cursos/graduacao/administracao',
    eventosPrincipais: [
      { titulo: 'Palestra: Gestão 4.0', data: '12 de Set' },
      { titulo: 'Simulação de Mercado', data: '28 de Set' }
    ]
  },
  { 
    id: '2', 
    titulo: 'Nutrição', 
    descricao: 'Bacharelado voltado para a saúde, reeducação alimentar e gestão de UAN.', 
    modalidade: 'Presencial, Semipresencial',
    link: 'https://estacio.br/cursos/graduacao/nutricao',
    eventosPrincipais: [
      { titulo: 'Oficina de Dietoterapia', data: '15 de Set' },
      { titulo: 'Feira de Saúde Comunitária', data: '05 de Out' }
    ]
  },
  { 
    id: '3', 
    titulo: 'Direito', 
    descricao: 'Bacharelado focado em ciências jurídicas, petições e práticas forenses.', 
    modalidade: 'Presencial',
    link: 'https://estacio.br/cursos/graduacao/direito',
    eventosPrincipais: [
      { titulo: 'Simulação de Júri Popular', data: '20 de Set' },
      { titulo: 'Seminário de Direitos Humanos', data: '14 de Out' }
    ]
  },
  { 
    id: '4', 
    titulo: 'Enfermagem', 
    descricao: 'Bacharelado voltado para assistência clínica, urgência e emergência.', 
    modalidade: 'Presencial, Semipresencial',
    link: 'https://estacio.br/cursos/graduacao/enfermagem',
    eventosPrincipais: [
      { titulo: 'Campanha de Vacinação Campus', data: '22 de Set' },
      { titulo: 'Simpósio de Primeiros Socorros', data: '02 de Nov' }
    ]
  }
];

export const listaCursosTecnico = [
  { 
    id: '1', 
    titulo: 'Análise e Des. de Sistemas', 
    descricao: 'Tecnólogo focado em arquitetura mobile, web, cloud e APIs modernas.', 
    modalidade: 'EAD, Presencial, Ao vivo',
    link: 'https://estacio.br/cursos/graduacao/analise-e-desenvolvimento-de-sistemas',
    eventosPrincipais: [
      { titulo: 'Maratona de Programação (Hackathon)', data: '18 de Set' },
      { titulo: 'Workshop de Cloud AWS', data: '10 de Out' }
    ]
  },
  { 
    id: '2', 
    titulo: 'Técnico em Informática', 
    descricao: 'Curso técnico focado em suporte, redes de computadores e manutenção.', 
    modalidade: 'Presencial',
    link: 'https://estacio.br/cursos/tecnico/informatica',
    eventosPrincipais: [
      { titulo: 'Montagem e Manutenção ao Vivo', data: '25 de Set' },
      { titulo: 'Oficina de Redes e Roteadores', data: '20 de Out' }
    ]
  }
];

export const bancoEventosCalendario = {
  // SETEMBRO
  'Setembro-2': [{ id: 1, titulo: 'Recepção de Calouros e Aula Magna', local: 'Auditório Principal', tipo: 'Evento', dia: 2, mes: 'Set', turma: 'Geral', autor: 'Diretoria', descricao: 'Boas-vindas oficial ao semestre letivo com a presença da reitoria.', horas_acc: 15 }],
  'Setembro-5': [{ id: 2, titulo: 'Início das Inscrições para AAT', local: 'SIA online', tipo: 'Aviso', dia: 5, mes: 'Set', turma: 'Geral', autor: 'Secretaria', descricao: 'Prazo inicial para envio de atividades complementares.', horas_acc: 5 }],
  'Setembro-8': [{ id: 3, titulo: 'Palestra: Inteligência Artificial no Mercado', local: 'Auditório 2', tipo: 'Evento', dia: 8, mes: 'Set', turma: 'Tecnologia', autor: 'Prof. Carlos', descricao: 'Discussão sobre o impacto das IAs generativas na empregabilidade.', horas_acc: 10 }],
  'Setembro-12': [{ id: 4, titulo: 'Workshop de Finanças Pessoais', local: 'Sala 204', tipo: 'Evento', dia: 12, mes: 'Set', turma: 'Administração', autor: 'Profª. Ana', descricao: 'Estratégias de investimento para jovens profissionais.', horas_acc: 10 }],
  'Setembro-15': [{ id: 5, titulo: 'Prazo Limite: Requerimento de Prova 2ª Chamada', local: 'SIA', tipo: 'Aviso', dia: 15, mes: 'Set', turma: 'Geral', autor: 'Coordenação', descricao: 'Fique atento ao prazo final para solicitação no sistema.', horas_acc: 0 }],
  'Setembro-18': [{ id: 6, titulo: 'Maratona de Programação - Hackathon Estácio', local: 'Laboratório de TI', tipo: 'Evento', dia: 18, mes: 'Set', turma: 'Análise de Sistemas', autor: 'Coordenação TI', descricao: 'Desenvolvimento de soluções mobile em 12 horas.', horas_acc: 20 }],
  'Setembro-20': [{ id: 7, titulo: 'Simulação de Júri Popular', local: 'Tribunal Simulado', tipo: 'Evento', dia: 20, mes: 'Set', turma: 'Direito', autor: 'Núcleo Jurídico', descricao: 'Prática processual aberta para acadêmicos de direito.', horas_acc: 15 }],
  'Setembro-22': [{ id: 8, titulo: 'Campanha de Saúde e Bem-Estar', local: 'Pátio Central', tipo: 'Serviço', dia: 22, mes: 'Set', turma: 'Enfermagem / Nutrição', autor: 'Enfermagem', descricao: 'Aferição de pressão e orientação nutricional gratuita.', horas_acc: 10 }],
  'Setembro-25': [{ id: 9, titulo: 'Seminário de Empregabilidade e Currículos', local: 'Auditório Principal', tipo: 'Evento', dia: 25, mes: 'Set', turma: 'Geral', autor: 'Carreiras Estácio', descricao: 'Dicas de recrutadores para o primeiro emprego e LinkedIn.', horas_acc: 10 }],
  'Setembro-28': [{ id: 10, titulo: 'Feira de Negócios e Startups', local: 'Hall de Entrada', tipo: 'Evento', dia: 28, mes: 'Set', turma: 'Administração', autor: 'Empresa Júnior', descricao: 'Apresentação de projetos inovadores criados pelos alunos.', horas_acc: 15 }],

  // OUTUBRO
  'Outubro-2': [{ id: 11, titulo: 'Abertura da Semana da Ciência e Tecnologia', local: 'Auditório Principal', tipo: 'Evento', dia: 2, mes: 'Out', turma: 'Geral', autor: 'Diretoria', descricao: 'Apresentação magna de inovações tecnológicas.', horas_acc: 15 }],
  'Outubro-5': [{ id: 12, titulo: 'Feira de Saúde Comunitária', local: 'Clinica Escola', tipo: 'Serviço', dia: 5, mes: 'Out', turma: 'Nutrição', autor: 'Saúde', descricao: 'Atendimento e orientação à comunidade local.', horas_acc: 12 }],
  'Outubro-8': [{ id: 13, titulo: 'Palestra: Direito Digital e LGPD', local: 'Auditório 2', tipo: 'Evento', dia: 8, mes: 'Out', turma: 'Direito / TI', autor: 'Prof. Roberto', descricao: 'Segurança da informação sob a ótica jurídica.', horas_acc: 10 }],
  'Outubro-10': [{ id: 14, titulo: 'Workshop de Cloud Computing & AWS', local: 'Lab 03', tipo: 'Evento', dia: 10, mes: 'Out', turma: 'Tecnologia', autor: 'Parceiro AWS', descricao: 'Arquitetura de servidores em nuvem na prática.', horas_acc: 15 }],
  'Outubro-14': [{ id: 15, titulo: 'Seminário de Direitos Humanos', local: 'Auditório Principal', tipo: 'Evento', dia: 14, mes: 'Out', turma: 'Direito', autor: 'Direitos Humanos', descricao: 'Debate sobre políticas públicas e cidadania.', horas_acc: 10 }],
  'Outubro-18': [{ id: 16, titulo: 'Plantão de Dúvidas: Cálculo e Estatística', local: 'Biblioteca', tipo: 'Serviço', dia: 18, mes: 'Out', turma: 'Todas', autor: 'Monitoria', descricao: 'Apoio acadêmico para provas parciais.', horas_acc: 8 }],
  'Outubro-20': [{ id: 17, titulo: 'Oficina de Redes e Roteadores', local: 'Lab de Redes', tipo: 'Evento', dia: 20, mes: 'Out', turma: 'Técnico em Informática', autor: 'Coordenação', descricao: 'Configuração avançada de roteadores corporativos.', horas_acc: 10 }],
  'Outubro-24': [{ id: 18, titulo: 'Encontro de Líderes de Turma', local: 'Sala da Direção', tipo: 'Aviso', dia: 24, mes: 'Out', turma: 'Representantes', autor: 'Coordenação', descricao: 'Alinhamento de demandas acadêmicas do semestre.', horas_acc: 5 }],
  'Outubro-27': [{ id: 19, titulo: 'Exposição de Trabalhos Acadêmicos', local: 'Corredor Bloco A', tipo: 'Evento', dia: 27, mes: 'Out', turma: 'Geral', autor: 'Corpo Docente', descricao: 'Mostra de maquetes e projetos interdisciplinares.', horas_acc: 10 }],
  'Outubro-30': [{ id: 20, titulo: 'Simulado Geral Enade / Provas', local: 'Plataforma Online', tipo: 'Evento', dia: 30, mes: 'Out', turma: 'Formandos', autor: 'Qualidade Acadêmica', descricao: 'Preparatório oficial para avaliação institucional.', horas_acc: 10 }],
  
  // NOVEMBRO (6 Eventos com os dias devidamente destacados)
  'Novembro-5': [{ id: 30, titulo: 'Simpósio de Ética Profissional', local: 'Auditório 2', tipo: 'Evento', dia: 5, mes: 'Nov', turma: 'Direito', autor: 'Coordenação', descricao: 'Debate sobre ética nas profissões modernas.', horas_acc: 10 }],
  'Novembro-10': [{ id: 31, titulo: 'Mostra de Inovação Tecnológica', local: 'Lab de Informática', tipo: 'Evento', dia: 10, mes: 'Nov', turma: 'Tecnologia', autor: 'Prof. Carlos', descricao: 'Apresentação de protótipos e sistemas criados pelos alunos.', horas_acc: 15 }],
  'Novembro-14': [{ id: 32, titulo: 'Palestra de Empregabilidade e LinkedIn', local: 'Auditório Principal', tipo: 'Evento', dia: 14, mes: 'Nov', turma: 'Geral', autor: 'Carreiras', descricao: 'Como otimizar seu perfil profissional.', horas_acc: 8 }],
  'Novembro-20': [{ id: 33, titulo: 'Consciência Negra: Mesa Redonda', local: 'Salão Social', tipo: 'Evento', dia: 20, mes: 'Nov', turma: 'Geral', autor: 'Diretoria', descricao: 'Discussão sobre diversidade e inclusão social.', horas_acc: 10 }],
  'Novembro-24': [{ id: 34, titulo: 'Plantão de Revisão para Provas Finais', local: 'Biblioteca', tipo: 'Serviço', dia: 24, mes: 'Nov', turma: 'Todas', autor: 'Monitoria', descricao: 'Apoio aos estudos para o encerramento do semestre.', horas_acc: 5 }],
  'Novembro-28': [{ id: 35, titulo: 'Prazo Final de Envio de Atividades AAT', local: 'SIA online', tipo: 'Aviso', dia: 28, mes: 'Nov', turma: 'Geral', autor: 'Secretaria', descricao: 'Último dia para submissão de horas complementares.', horas_acc: 0 }],

  // DEZEMBRO
  'Dezembro (Até 15)-2': [{ id: 21, titulo: 'Início das Provas Finais', local: 'Salas de Aula', tipo: 'Evento', dia: 2, mes: 'Dez', turma: 'Geral', autor: 'Coordenação', descricao: 'Início das avaliações do encerramento de semestre.', horas_acc: 10 }],
  'Dezembro (Até 15)-5': [{ id: 22, titulo: 'Feira de Projetos Finais', local: 'Pátio Central', tipo: 'Evento', dia: 5, mes: 'Dez', turma: 'Tecnologia / Eng', autor: 'Corpo Docente', descricao: 'Apresentação dos trabalhos de conclusão de semestre.', horas_acc: 15 }],
  'Dezembro (Até 15)-10': [{ id: 23, titulo: 'Prazo Limite: Lançamento de Notas', local: 'SIA', tipo: 'Aviso', dia: 10, mes: 'Dez', turma: 'Geral', autor: 'Secretaria', descricao: 'Último dia para os professores lançarem as menções.', horas_acc: 10 }],
  'Dezembro (Até 15)-15': [{ id: 24, titulo: 'Encerramento Oficial do Semestre Letivo', local: 'Campus', tipo: 'Aviso', dia: 15, mes: 'Dez', turma: 'Geral', autor: 'Diretoria', descricao: 'Boas férias a todos os alunos e corpo docente!', horas_acc: 0 }]
};

export const semestre = [
  { id: 1, nome: 'Setembro', totalDias: 30, espacosVazios: 2, destaques: [2, 5, 8, 12, 15, 18, 20, 22, 25, 28] },
  { id: 2, nome: 'Outubro', totalDias: 31, espacosVazios: 4, destaques: [2, 5, 8, 10, 14, 18, 20, 24, 27, 30] },
  { id: 3, nome: 'Novembro', totalDias: 30, espacosVazios: 0, destaques: [5, 10, 14, 20, 24, 28] }, // <-- Destaques adicionados aqui!
  { id: 4, nome: 'Dezembro (Até 15)', totalDias: 15, espacosVazios: 2, destaques: [2, 5, 10, 15] },
];

export const semestreMock = [
  { id: 1, nome: 'Setembro', totalDias: 30, espacosVazios: 2, destaques: [2, 5, 8, 12, 15, 18, 20, 22, 25, 28] },
  { id: 2, nome: 'Outubro', totalDias: 31, espacosVazios: 4, destaques: [2, 5, 8, 10, 14, 18, 20, 24, 27, 30] },
];

export const listaProximosMock = [
  { id: 18, dia: 18, mes: 'Set', titulo: 'Maratona de Programação - Hackathon', local: 'Lab de TI', tipo: 'Evento', dia: 18, mes: 'Set', turma: 'Análise de Sistemas', autor: 'Coordenação TI', descricao: 'Desenvolvimento de soluções mobile em 12 horas.', horas_acc: 20 },
  { id: 20, dia: 20, mes: 'Set', titulo: 'Simulação de Júri Popular', local: 'Tribunal Simulado', tipo: 'Evento', dia: 20, mes: 'Set', turma: 'Direito', autor: 'Núcleo Jurídico', descricao: 'Prática processual aberta para acadêmicos de direito.', horas_acc: 15 },
  { id: 22, dia: 22, mes: 'Set', titulo: 'Campanha de Saúde e Bem-Estar', local: 'Pátio Central', tipo: 'Serviço', dia: 22, mes: 'Set', turma: 'Enfermagem', autor: 'Enfermagem', descricao: 'Aferição de pressão e orientação nutricional gratuita.', horas_acc: 10 }
];

export const listaSemanaMock = [
  { id: 18, dia: 18, mes: 'Set', titulo: 'Maratona de Programação - Hackathon', local: 'Lab de TI', tipo: 'Evento', dia: 18, mes: 'Set', turma: 'Análise de Sistemas', autor: 'Coordenação TI', descricao: 'Desenvolvimento de soluções mobile em 12 horas.', horas_acc: 20 },
  { id: 20, dia: 20, mes: 'Set', titulo: 'Simulação de Júri Popular', local: 'Tribunal Simulado', tipo: 'Evento', dia: 20, mes: 'Set', turma: 'Direito', autor: 'Núcleo Jurídico', descricao: 'Prática processual aberta para acadêmicos de direito.', horas_acc: 15 }
];