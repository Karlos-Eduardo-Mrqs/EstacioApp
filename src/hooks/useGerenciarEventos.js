import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { buscarCursosDoBanco } from "../services/cursoServices";
import {
  buscarEventosDoBanco,
  criarEventoNoBanco,
  atualizarEventoNoBanco,
  removerEventoDoBanco,
  alterarStatusEventoNoBanco,
} from "../services/eventoServices";
import {
  criarImagemNoBanco,
  atualizarImagemNoBanco,
  fazerUploadParaSupabaseStorage,
} from '../services/imagemServices';
import { converterParaISO } from '../utils/dataUtils';

function extrairDataEHora(valorData) {
  if (!valorData) {
    return { dataFormatada: '', horaFormatada: '00:00:00' };
  }

  try {
    const str = String(valorData);
    const dataPura = str.substring(0, 10);
    const [ano, mes, dia] = dataPura.split('-');
    const dataFormatada = ano && mes && dia ? `${dia}/${mes}/${ano}` : '';

    const partesEspaco = str.split(' ');
    const partesT = str.split('T');
    const stringHora =
      partesEspaco.length > 1
        ? partesEspaco[1]
        : partesT.length > 1
          ? partesT[1]
          : '';

    const horaLimpa = stringHora
      ? stringHora.split('.')[0].replace('Z', '').split('+')[0]
      : '00:00:00';

    return {
      dataFormatada,
      horaFormatada: horaLimpa || '00:00:00',
    };
  } catch (e) {
    console.log("Erro ao processar data do evento:", e);
    return { dataFormatada: '', horaFormatada: '00:00:00' };
  }
}

export function useGerenciarEventos(usuarioAtual = null) {
  const [eventos, setEventos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [busca, setBusca] = useState('');
  const [agora, setAgora] = useState(Date.now());

  const [modalEvento, setModalEvento] = useState(false);
  const [eventoEditando, setEventoEditando] = useState(null);
  const [imagemAntigaEdicao, setImagemAntigaEdicao] = useState(null);
  const [imagemRemovidaNaEdicao, setImagemRemovidaNaEdicao] = useState(false);

  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataTexto, setDataTexto] = useState('');
  const [palestrante, setPalestrante] = useState('');
  const [cursoId, setCursoId] = useState('');
  const [horasAAC, setHorasAAC] = useState('');
  const [imagem, setImagem] = useState(null);
  const [descricaoImagem, setDescricaoImagem] = useState('');
  const [status, setStatus] = useState(true);
  const [carregando, setCarregando] = useState(false);
  const [local, setLocal] = useState('');
  const [linkTransmissao, setLinkTransmissao] = useState('');

  // Inscrições no evento
  const [possuiEventos, setPossuiEventos] = useState(false);
  const [limiteVagas, setLimiteVagas] = useState('');

  // Data de início e hora
  const [dataApenas, setDataApenas] = useState('');
  const [horaApenas, setHoraApenas] = useState('');

  // Data de fim (opcional) e hora de fim (opcional)
  const [dataFimApenas, setDataFimApenas] = useState('');
  const [horaFimApenas, setHoraFimApenas] = useState('');

  const [proporcao, setProporcao] = useState('16:9');

  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });
  const [toast, setToast] = useState({ visible: false, titulo: '', mensagem: '' });
  const [confirmacao, setConfirmacao] = useState({
    visible: false,
    titulo: '',
    mensagem: '',
    onConfirm: null,
    tipo: 'danger',
  });

  useEffect(() => {
    const intervalo = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    carregarDadosIniciais();
  }, [usuarioAtual]);

  async function carregarDadosIniciais() {
    try {
      setCarregando(true);
      const [dadosEventos, dadosCursos] = await Promise.all([
        buscarEventosDoBanco(usuarioAtual),
        buscarCursosDoBanco(),
      ]);

      setEventos(dadosEventos || []);
      setCursos(dadosCursos || []);
    } catch (error) {
      console.log('Erro ao carregar dados:', error);
      setToast({
        visible: true,
        titulo: 'Erro',
        mensagem: 'Não foi possível carregar os dados do servidor.',
      });
    } finally {
      setCarregando(false);
    }
  }

  const eventosFiltrados = eventos.filter((evento) =>
    evento.titulo?.toLowerCase().includes(busca.toLowerCase()),
  );

  const quantidadeAtivos = eventos.filter((evento) => evento.status).length;

  const abrirNovoEvento = () => {
    setEventoEditando(null);
    setImagemAntigaEdicao(null);
    setImagemRemovidaNaEdicao(false);
    setTitulo('');
    setDataApenas('');
    setHoraApenas('');
    setDataFimApenas('');
    setHoraFimApenas('');
    setPalestrante('');
    setLocal('');
    setHorasAAC('');
    setCursoId('');
    setDescricao('');
    setImagem(null);
    setProporcao('16:9');
    setDescricaoImagem('');
    setStatus(true);
    setPossuiEventos(false);
    setLimiteVagas('');
    setFeedback({ tipo: '', mensagem: '' });
    setModalEvento(true);
    setLinkTransmissao('');
  };

  const abrirEdicao = (evento) => {
    setEventoEditando(evento);
    setImagemAntigaEdicao(
      typeof evento.imagem === 'object' && evento.imagem ? evento.imagem : null
    );
    setImagemRemovidaNaEdicao(false);
    setTitulo(evento.titulo || '');

    const inicioBr = evento.data_inicio || evento.inicio || evento.data || evento.dataEvento;
    const { dataFormatada, horaFormatada } = extrairDataEHora(inicioBr);
    setDataApenas(dataFormatada);
    setHoraApenas(horaFormatada);

    const fimBr = evento.data_fim || evento.fim || null;
    if (fimBr) {
      const fimParsed = extrairDataEHora(fimBr);
      setDataFimApenas(fimParsed.dataFormatada);
      setHoraFimApenas(fimParsed.horaFormatada);
    } else {
      setDataFimApenas('');
      setHoraFimApenas('');
    }

    const idCursoBanco = evento.curso_id;
    if (
      idCursoBanco === null ||
      idCursoBanco === undefined ||
      idCursoBanco === "" ||
      idCursoBanco === "NULL"
    ) {
      setCursoId("NULL");
    } else {
      setCursoId(idCursoBanco);
    }

    setStatus(evento.status !== false);

    const inscricaoHabilitada = Boolean(
      evento.possui_inscricao ?? evento.permite_inscricao
    );
    setPossuiEventos(inscricaoHabilitada);
    setLimiteVagas(
      inscricaoHabilitada && evento.limite_vagas != null
        ? String(evento.limite_vagas)
        : ''
    );

    const horasValor = evento.horasAAC ?? evento.horas_aac ?? evento.horasacc;
    setPalestrante(evento.palestrante || '');
    setLocal(evento.local || '');
    setHorasAAC(horasValor !== undefined && horasValor !== null ? String(horasValor) : '');
    setDescricao(evento.descricao || '');
    setProporcao(evento.imagem?.proporcao || '16:9');
    setLinkTransmissao(evento.link_transmissao || evento.linkTransmissao || '');
    const urlImagem = evento.imagem?.caminho_img || evento.imagem || null;
    setImagem(urlImagem);
    setDescricaoImagem(evento.imagem?.descricao || evento.descricaoImagem || '');
    setFeedback({ tipo: '', mensagem: '' });
    setModalEvento(true);
  };

  async function selecionarImagem() {
    try {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        quality: 1,
      });

      if (!resultado.canceled && resultado.assets?.length) {
        const asset = resultado.assets[0];
        const { width, height, uri } = asset;

        const ratio = width / height;
        let proporcaoIdentificada = '16:9';

        if (ratio >= 1.5) {
          proporcaoIdentificada = '16:9';
        } else if (ratio >= 1.2) {
          proporcaoIdentificada = '4:3';
        } else if (ratio <= 0.75) {
          proporcaoIdentificada = '4:5';
        } else if (ratio <= 0.85) {
          proporcaoIdentificada = '3:4';
        } else {
          proporcaoIdentificada = '1:1';
        }

        setProporcao(proporcaoIdentificada);

        const ehVertical = height > width;
        const acaoRedimensionar = ehVertical
          ? { resize: { height: 1280 } }
          : { resize: { width: 1280 } };

        const imagemOtimizada = await ImageManipulator.manipulateAsync(
          uri,
          [acaoRedimensionar],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG },
        );

        setImagemRemovidaNaEdicao(false);
        setImagem(imagemOtimizada.uri);
      }
    } catch (error) {
      console.log("Erro ao selecionar imagem:", error);
      setFeedback({ tipo: 'erro', mensagem: 'Não foi possível carregar a imagem.' });
    }
  }

  async function salvarEvento() {
    if (!titulo.trim() || !dataApenas.trim() || !local.trim() || !cursoId) {
      setFeedback({
        tipo: 'erro',
        mensagem:
          'Por favor, preencha todos os campos obrigatórios (Título, Data de início, Local e Curso).',
      });
      return;
    }

    let limiteNumerico = null;
    if (possuiEventos && limiteVagas.trim() !== '') {
      const parsed = Number(limiteVagas.trim());
      if (isNaN(parsed) || !Number.isInteger(parsed) || parsed <= 0) {
        setFeedback({
          tipo: 'erro',
          mensagem: 'A quantidade máxima de inscritos deve ser um número inteiro maior que zero.',
        });
        return;
      }
      limiteNumerico = parsed;
    }

    const horaFinal = horaApenas && horaApenas.length >= 5 ? horaApenas : '00:00:00';
    const dataHoraCompleta = `${dataApenas} ${horaFinal}`;
    const dataInicioIso = converterParaISO(dataHoraCompleta);

    if (!dataInicioIso) {
      setFeedback({
        tipo: 'erro',
        mensagem:
          'Data de início inválida. Não é permitido agendar eventos com anos no passado (ex: 2024).',
      });
      return;
    }

    let dataFimIso = null;
    if (dataFimApenas.trim()) {
      const horaFimFinal =
        horaFimApenas && horaFimApenas.length >= 5 ? horaFimApenas : '23:59:59';
      const dataFimCompleta = `${dataFimApenas.trim()} ${horaFimFinal}`;
      dataFimIso = converterParaISO(dataFimCompleta);

      if (!dataFimIso) {
        setFeedback({
          tipo: 'erro',
          mensagem: 'Data de fim inválida. Verifique o formato DD/MM/AAAA.',
        });
        return;
      }

      if (new Date(dataFimIso).getTime() < new Date(dataInicioIso).getTime()) {
        setFeedback({
          tipo: 'erro',
          mensagem: 'A data de fim não pode ser anterior à data de início.',
        });
        return;
      }
    }

    try {
      let imagemId = eventoEditando
        ? (imagemRemovidaNaEdicao ? null : (eventoEditando.imagem_id ?? null))
        : 21;

      if (imagem) {
        const ehLocalTemp =
          imagem.startsWith('file://') ||
          imagem.startsWith('blob:') ||
          imagem.startsWith('content://');

        if (ehLocalTemp) {
          const urlDefinitiva = await fazerUploadParaSupabaseStorage(imagem);

          const novaImagemPayload = {
            titulo: `Capa: ${titulo.trim()}`,
            descricao: descricaoImagem.trim() || 'Divulgação do evento',
            caminho_img: urlDefinitiva,
            proporcao: proporcao,
          };

          if (eventoEditando && eventoEditando.imagem_id && eventoEditando.imagem_id !== 21) {
            imagemId = eventoEditando.imagem_id;
            await atualizarImagemNoBanco(imagemId, novaImagemPayload);
          } else {
            const imagemCriada = await criarImagemNoBanco(novaImagemPayload);
            imagemId = imagemCriada.id;
          }
        } else if (eventoEditando && eventoEditando.imagem_id && eventoEditando.imagem_id !== 21) {
          await atualizarImagemNoBanco(eventoEditando.imagem_id, {
            titulo: `Capa: ${titulo.trim()}`,
            descricao: descricaoImagem.trim() || 'Divulgação do evento',
            caminho_img: imagem,
            proporcao: proporcao,
          });
        }
      }

      const referenciaMs = dataFimIso
        ? new Date(dataFimIso).getTime()
        : new Date(dataInicioIso).getTime();
      const statusPorData = referenciaMs >= Date.now();
      const statusFinal = eventoEditando ? Boolean(status) : statusPorData;

      const cursoTratado =
        cursoId && cursoId !== "NULL" && cursoId !== "" ? Number(cursoId) : null;

      const payloadEvento = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        data_inicio: dataInicioIso,
        data_fim: dataFimIso,
        palestrante: palestrante.trim() || null,
        local: local.trim() || null,
        curso_id: cursoTratado,
        horasAAC: horasAAC ? Number(horasAAC) : 0,
        imagem_id: imagemId,
        usuario_id: eventoEditando?.usuario_id ?? usuarioAtual?.id ?? null,
        link_transmissao: linkTransmissao.trim() || null,
        possui_inscricao: Boolean(possuiEventos),
        limite_vagas: possuiEventos ? limiteNumerico : null,
        status: statusFinal,
      };

      if (eventoEditando) {
        const eventoAtualizadoBanco = await atualizarEventoNoBanco(
          eventoEditando.id,
          payloadEvento,
          imagemAntigaEdicao,
        );

        setEventos((prev) =>
          prev.map((ev) =>
            ev.id === eventoEditando.id
              ? { ...ev, ...payloadEvento, ...(eventoAtualizadoBanco || {}) }
              : ev,
          ),
        );

        setToast({
          visible: true,
          titulo: 'Sucesso',
          mensagem: 'O evento foi atualizado com sucesso!',
        });
      } else {
        const novoEventoCriado = await criarEventoNoBanco(payloadEvento);

        if (novoEventoCriado) {
          setEventos((prev) => [novoEventoCriado, ...prev]);
        } else {
          carregarDadosIniciais();
        }

        setToast({
          visible: true,
          titulo: 'Sucesso',
          mensagem: 'O novo evento foi cadastrado com sucesso!',
        });
      }

      setModalEvento(false);
      setEventoEditando(null);
      setImagemAntigaEdicao(null);
      setImagemRemovidaNaEdicao(false);
      setFeedback({ tipo: '', mensagem: '' });
    } catch (error) {
      console.log('Erro ao salvar evento:', error);
      setFeedback({
        tipo: 'erro',
        mensagem: 'Não foi possível salvar o evento no banco de dados.',
      });
    }
  }

  function alternarStatus(evento) {
    const novoStatus = !evento.status;
    setConfirmacao({
      visible: true,
      titulo: novoStatus ? 'Ativar evento' : 'Encerrar evento',
      mensagem: `Deseja ${novoStatus ? 'ativar' : 'encerrar'} "${evento.titulo}"?`,
      tipo: 'info',
      onConfirm: async () => {
        setConfirmacao((prev) => ({ ...prev, visible: false }));
        try {
          await alterarStatusEventoNoBanco(evento.id, novoStatus);
          setEventos(
            eventos.map((item) =>
              item.id === evento.id ? { ...item, status: novoStatus } : item,
            ),
          );
          setToast({
            visible: true,
            titulo: 'Status Alterado',
            mensagem: `Evento ${novoStatus ? 'ativado' : 'encerrado'} com sucesso.`,
          });
        } catch (error) {
          setToast({
            visible: true,
            titulo: 'Erro',
            mensagem: 'Não foi possível alterar o status.',
          });
        }
      },
      
    });
  }

  function excluirEvento(evento) {
    const eventoObj =
      typeof evento === 'object' ? evento : eventos.find((e) => e.id === evento);
    const tituloEvento = eventoObj?.titulo || 'este evento';
    const eventoId = eventoObj?.id || evento;

    setConfirmacao({
      visible: true,
      titulo: 'Excluir evento',
      mensagem: `Deseja realmente excluir "${tituloEvento}"? Esta ação removerá a imagem e os dados do evento permanentemente.`,
      tipo: 'danger',
      onConfirm: async () => {
        setConfirmacao((prev) => ({ ...prev, visible: false }));
        try {
          await removerEventoDoBanco(eventoObj || eventoId);
          setEventos((prev) => prev.filter((item) => item.id !== eventoId));
          setToast({
            visible: true,
            titulo: 'Excluído',
            mensagem: 'O evento e sua imagem foram removidos com sucesso.',
          });
        } catch (error) {
          console.error('Erro ao excluir evento:', error);
          setToast({
            visible: true,
            titulo: 'Erro',
            mensagem: 'Não foi possível excluir o evento do banco de dados.',
          });
        }
      },
    });
  }

  const solicitarRemocaoImagem = () => {
    if (eventoEditando) {
      setConfirmacao({
        visible: true,
        titulo: 'Remover Imagem',
        mensagem:
          'Deseja remover a imagem atual? Se não escolher outra antes de salvar, o evento ficará sem imagem personalizada.',
        tipo: 'danger',
        onConfirm: () => {
          setConfirmacao((prev) => ({ ...prev, visible: false }));
          setImagem(null);
          setDescricaoImagem('');
          setImagemRemovidaNaEdicao(true);
          setEventoEditando((prev) => ({ ...prev, imagem_id: null, imagem: null }));
          setToast({
            visible: true,
            titulo: 'Imagem Removida',
            mensagem:
              'Pode selecionar uma nova imagem ou salvar para aplicar a remoção.',
          });
        },
      });
    } else {
      setImagem(null);
      setDescricaoImagem('');
    }
  };

  return {
    eventos,
    eventosFiltrados,
    quantidadeAtivos,
    cursos,
    busca,
    setBusca,
    agora,
    modalEvento,
    setModalEvento,
    eventoEditando,
    titulo,
    setTitulo,
    descricao,
    setDescricao,
    dataTexto,
    setDataTexto,
    palestrante,
    setPalestrante,
    cursoId,
    setCursoId,
    local,
    setLocal,
    horasAAC,
    setHorasAAC,
    imagem,
    setImagem,
    status,
    setStatus,
    proporcao,
    setProporcao,
    descricaoImagem,
    setDescricaoImagem,
    dataApenas,
    setDataApenas,
    horaApenas,
    setHoraApenas,
    dataFimApenas,
    setDataFimApenas,
    horaFimApenas,
    setHoraFimApenas,
    linkTransmissao,
    setLinkTransmissao,
    possuiEventos,
    setPossuiEventos,
    limiteVagas,
    setLimiteVagas,
    feedback,
    toast,
    setToast,
    confirmacao,
    setConfirmacao,
    abrirNovoEvento,
    abrirEdicao,
    selecionarImagem,
    salvarEvento,
    alternarStatus,
    excluirEvento,
    carregando,
    solicitarRemocaoImagem,
  };
}