import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import { supabase } from '../../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_INSCRICOES = '@mural_estacio:minhas_inscricoes';

function normalizarTexto(valor) {
  return String(valor || '').trim().toLowerCase();
}

function limparDigitos(valor) {
  return String(valor || '').replace(/\D/g, '');
}

function gerarCodigoAcesso() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let codigo = '';
  for (let i = 0; i < 8; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return codigo;
}

export async function verificarInscricaoExistente({
  eventoId,
  email,
  ehAluno,
  matricula,
  cpf,
  ignorarId = null,
}) {
  const { data, error } = await supabase
    .from('inscricao')
    .select('id, nome_completo, email, matricula, cpf, status')
    .eq('evento_id', eventoId);

  if (error) throw error;

  const emailLimpo = normalizarTexto(email);
  const matriculaLimpa = normalizarTexto(matricula);
  const cpfLimpo = limparDigitos(cpf);

  const duplicada = (data || []).find((item) => {
    if (ignorarId && String(item.id) === String(ignorarId)) {
      return false;
    }

    const mesmoEmail = emailLimpo && normalizarTexto(item.email) === emailLimpo;
    const mesmaMatricula =
      ehAluno &&
      matriculaLimpa &&
      normalizarTexto(item.matricula) === matriculaLimpa;
    const mesmoCpf =
      !ehAluno &&
      cpfLimpo &&
      limparDigitos(item.cpf) === cpfLimpo;

    return mesmoEmail || mesmaMatricula || mesmoCpf;
  });

  return duplicada || null;
}

export async function buscarInscricoesComEventos(usuarioAtual = null) {
  const { data, error } = await supabase
    .from('inscricao')
    .select(`
      *,
      evento:evento_id (
        id,
        titulo,
        descricao,
        data_inicio,
        data_fim,
        local,
        possui_inscricao,
        palestrante,
        limite_vagas,
        usuario_id,
        status
      )
    `)
    .order('criado_em', { ascending: false });

  if (error) throw error;

  const lista = data || [];

  if (!usuarioAtual) return lista;

  const perfilStr = usuarioAtual.perfil
    ? usuarioAtual.perfil.trim().toLowerCase()
    : '';
  const ehCoordenador = perfilStr.includes('coordenador');

  if (ehCoordenador && usuarioAtual.id) {
    return lista.filter(
      (item) => item.evento && String(item.evento.usuario_id) === String(usuarioAtual.id)
    );
  }

  return lista;
}

export function agruparEventosComEstatisticas(inscricoes = []) {
  const mapaEventos = new Map();

  for (const insc of inscricoes) {
    const ev = insc.evento;
    if (!ev || !ev.id) continue;

    if (!mapaEventos.has(ev.id)) {
      mapaEventos.set(ev.id, {
        evento: ev,
        inscricoes: [],
        totalInscricoes: 0,
        totalAtivas: 0,
        totalCanceladas: 0,
        totalAlunos: 0,
        totalExternos: 0,
        vagasRestantes: null,
      });
    }

    const grupo = mapaEventos.get(ev.id);
    grupo.inscricoes.push(insc);
    grupo.totalInscricoes += 1;

    const ativa = insc.status !== false;
    if (ativa) {
      grupo.totalAtivas += 1;
      if (insc.eh_aluno) {
        grupo.totalAlunos += 1;
      } else {
        grupo.totalExternos += 1;
      }
    } else {
      grupo.totalCanceladas += 1;
    }
  }

  return Array.from(mapaEventos.values()).map((item) => {
    const limiteNum = Number(item.evento?.limite_vagas);
    const temLimite = Number.isFinite(limiteNum) && limiteNum > 0;
    const vagasRestantes = temLimite
      ? Math.max(limiteNum - item.totalAtivas, 0)
      : null;

    return {
      ...item,
      vagasRestantes,
    };
  });
}

export async function criarInscricaoNoBanco({
  eventoId,
  usuarioId = null,
  nomeCompleto,
  ehAluno,
  matricula,
  cpf,
  telefone,
  email,
}) {
  const jaInscrito = await verificarInscricaoExistente({
    eventoId,
    email,
    ehAluno,
    matricula,
    cpf,
  });

  if (jaInscrito) {
    throw new Error(
      'Este usuário já possui inscrição cadastrada para este evento.'
    );
  }

  const payload = {
    evento_id: Number(eventoId),
    usuario_id: usuarioId || null,
    nome_completo: nomeCompleto.trim(),
    eh_aluno: Boolean(ehAluno),
    matricula: ehAluno ? String(matricula || '').trim() : null,
    cpf: !ehAluno ? String(cpf || '').trim() : null,
    telefone: String(telefone || '').trim(),
    email: String(email || '').trim().toLowerCase(),
    codigo_acesso: gerarCodigoAcesso(),
    status: true,
  };

  const { data, error } = await supabase
    .from('inscricao')
    .insert([payload])
    .select(`
      *,
      evento:evento_id (
        id,
        titulo,
        descricao,
        data_inicio,
        data_fim,
        local,
        palestrante,
        limite_vagas,
        status
      )
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function atualizarInscricaoNoBanco(id, dadosAtualizados) {
  const { data, error } = await supabase
    .from('inscricao')
    .update(dadosAtualizados)
    .eq('id', id)
    .select(`
      *,
      evento:evento_id (
        id,
        titulo,
        descricao,
        data_inicio,
        data_fim,
        local,
        palestrante,
        limite_vagas,
        status
      )
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function alterarStatusInscricaoNoBanco(id, novoStatus) {
  return atualizarInscricaoNoBanco(id, { status: Boolean(novoStatus) });
}

export async function excluirInscricaoNoBanco(id) {
  const { error } = await supabase
    .from('inscricao')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function exportarInscricoesParaExcel(evento, inscricoes = []) {
  const colunas = [
    '#',
    'Nome Completo',
    'Tipo',
    'Matrícula',
    'CPF',
    'Telefone',
    'E-mail',
    'Código de Acesso',
    'Status',
  ];

  const listaOrdenada = [...(inscricoes || [])].sort((a, b) =>
    String(a?.nome_completo || '').localeCompare(
      String(b?.nome_completo || ''),
      'pt-BR'
    )
  );

  const linhas = listaOrdenada.map((item, index) => {
    const ativa = item?.status !== false;
    return {
      '#': index + 1,
      'Nome Completo': String(item?.nome_completo || '').trim(),
      Tipo: item?.eh_aluno ? 'Aluno' : 'Pessoa Externa',
      Matrícula: item?.eh_aluno ? item?.matricula || '-' : '-',
      CPF: !item?.eh_aluno ? item?.cpf || '-' : '-',
      Telefone: item?.telefone || '-',
      'E-mail': String(item?.email || '').trim().toLowerCase() || '-',
      'Código de Acesso': String(item?.codigo_acesso || '-').trim().toUpperCase(),
      Status: ativa ? 'Ativa' : 'Cancelada',
    };
  });

  const planilha = XLSX.utils.json_to_sheet(linhas, {
    header: colunas,
    skipHeader: false,
  });

  planilha['!cols'] = [
    { wch: 6 },   // #
    { wch: 30 },  // Nome Completo
    { wch: 16 },  // Tipo
    { wch: 18 },  // Matrícula
    { wch: 18 },  // CPF
    { wch: 22 },  // Telefone
    { wch: 42 },  // E-mail
    { wch: 18 },  // Código de Acesso
    { wch: 14 },  // Status
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, planilha, 'Inscrições');

  const base64 = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
  const nomeSanitizado = String(evento?.titulo || 'evento')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');
  const nomeArquivo = `inscricoes_${nomeSanitizado || 'evento'}.xlsx`;

  if (Platform.OS === 'web') {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', nomeArquivo);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return nomeArquivo;
  }

  const uriDestino = `${FileSystem.cacheDirectory}${nomeArquivo}`;
  await FileSystem.writeAsStringAsync(uriDestino, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uriDestino, {
      mimeType:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: `Exportar inscrições — ${evento?.titulo || 'Evento'}`,
    });
  }

  return nomeArquivo;
}

export async function obterInscricoesLocais() {
  try {
    const json = await AsyncStorage.getItem(CHAVE_INSCRICOES);
    return json ? JSON.parse(json) : [];
  } catch (error) {
    console.warn('Erro ao ler inscrições locais:', error);
    return [];
  }
}

export async function salvarInscricaoLocal(inscricao) {
  if (!inscricao?.id) return;
  try {
    const atuais = await obterInscricoesLocais();
    const filtradas = atuais.filter((item) => item.id !== inscricao.id);
    const atualizadas = [inscricao, ...filtradas];
    await AsyncStorage.setItem(CHAVE_INSCRICOES, JSON.stringify(atualizadas));
  } catch (error) {
    console.warn('Erro ao salvar inscrição local:', error);
  }
}

export async function atualizarStatusInscricaoLocal(id, novoStatus) {
  try {
    const atuais = await obterInscricoesLocais();
    const atualizadas = atuais.map((item) =>
      item.id === id ? { ...item, status: novoStatus } : item
    );
    await AsyncStorage.setItem(CHAVE_INSCRICOES, JSON.stringify(atualizadas));
  } catch (error) {
    console.warn('Erro ao atualizar status local:', error);
  }
}

// 🔄 Sincroniza as inscrições já salvas no dispositivo com o status real no Supabase
export async function sincronizarInscricoesLocaisComBanco() {
  const locais = await obterInscricoesLocais();
  const idsLocais = locais.map((item) => item?.id).filter(Boolean);
  if (idsLocais.length === 0) return [];

  const { data, error } = await supabase
    .from('inscricao')
    .select(`
      *,
      evento:evento_id (
        id,
        titulo,
        descricao,
        data_inicio,
        data_fim,
        local,
        palestrante,
        limite_vagas,
        status
      )
    `)
    .in('id', idsLocais)
    .order('criado_em', { ascending: false });

  if (error) {
    console.warn('Erro ao sincronizar inscrições com o banco:', error);
    return locais;
  }

  const encontrados = data || [];
  const mapaAtualizados = new Map(encontrados.map((reg) => [reg.id, reg]));

  // Mantém registros locais apenas se não houver falha; se foi excluído no banco, não reaparece como ativa
  const listaConsolidada = locais
    .filter((item) => mapaAtualizados.has(item.id))
    .map((item) => ({
      ...item,
      ...mapaAtualizados.get(item.id),
      evento: mapaAtualizados.get(item.id)?.evento || item.evento,
    }));

  // Inclui eventuais novos registros que tenham sido salvos no banco com o mesmo ID
  for (const reg of encontrados) {
    if (!listaConsolidada.some((i) => i.id === reg.id)) {
      listaConsolidada.push(reg);
    }
  }

  await AsyncStorage.setItem(CHAVE_INSCRICOES, JSON.stringify(listaConsolidada));
  return listaConsolidada;
}

// 🔑 Recupera inscrição em outro aparelho exigindo Matrícula/CPF + Código de Acesso
export async function recuperarInscricaoPorCodigo({ documento, codigoAcesso }) {
  const docLimpo = String(documento || '').trim();
  const docDigitos = limparDigitos(docLimpo);
  const codigoLimpo = String(codigoAcesso || '').trim().toUpperCase();

  if (!docLimpo || !codigoLimpo) {
    throw new Error('Preencha a matrícula ou CPF e o código da inscrição.');
  }

  const { data, error } = await supabase
    .from('inscricao')
    .select(`
      *,
      evento:evento_id (
        id,
        titulo,
        descricao,
        data_inicio,
        data_fim,
        local,
        palestrante,
        limite_vagas,
        status
      )
    `)
    .eq('codigo_acesso', codigoLimpo);

  if (error) throw error;

  const encontrada = (data || []).find((item) => {
    const bateMatricula =
      item.matricula &&
      normalizarTexto(item.matricula) === normalizarTexto(docLimpo);
    const bateCpf =
      item.cpf &&
      docDigitos.length >= 11 &&
      limparDigitos(item.cpf) === docDigitos;

    return bateMatricula || bateCpf;
  });

  if (!encontrada) {
    throw new Error(
      'Nenhuma inscrição encontrada para essa matrícula/CPF e código.'
    );
  }

  await salvarInscricaoLocal(encontrada);
  return encontrada;
}