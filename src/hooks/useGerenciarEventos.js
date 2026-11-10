import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { buscarEventosDoBanco, criarEventoNoBanco, atualizarEventoNoBanco, removerEventoDoBanco, 
alterarStatusEventoNoBanco, criarImagemNoBanco, atualizarImagemNoBanco, buscarCursosDoBanco, fazerUploadParaSupabaseStorage } from '../services/apiServices';
import { converterParaISO } from '../utils/dataUtils';

export function useGerenciarEventos(usuarioAtual = null) {
  const [eventos, setEventos] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [busca, setBusca] = useState('');
  const [agora, setAgora] = useState(Date.now());

  const [modalEvento, setModalEvento] = useState(false);
  const [eventoEditando, setEventoEditando] = useState(null);

  // Campos do formulário
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataTexto, setDataTexto] = useState('');
  const [palestrante, setPalestrante] = useState('');
  const [cursoId, setCursoId] = useState('');
  const [horasAAC, setHorasAAC] = useState('');
  const [imagem, setImagem] = useState(null);
  const [descricaoImagem, setDescricaoImagem] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [local, setLocal] = useState('');
  const [linkTransmissao, setLinkTransmissao] = useState('');
  const [dataApenas, setDataApenas] = useState('');
  const [horaApenas, setHoraApenas] = useState('');
  const [proporcao, setProporcao] = useState('16:9');

  // ── ESTADOS PARA OS POPUPS ──
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });
  const [toast, setToast] = useState({ visible: false, titulo: '', mensagem: '' });
  const [confirmacao, setConfirmacao] = useState({ visible: false, titulo: '', mensagem: '', onConfirm: null, tipo: 'danger' });

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
        buscarCursosDoBanco()
      ]);
      
      setEventos(dadosEventos || []);
      setCursos(dadosCursos || []);
      if (dadosCursos && dadosCursos.length > 0 && !cursoId) {
        setCursoId(dadosCursos[0].id);
      }
    } catch (error) {
      console.log('Erro ao carregar dados:', error);
      setToast({ visible: true, titulo: 'Erro', mensagem: 'Não foi possível carregar os dados do servidor.' });
    } finally {
      setCarregando(false);
    }
  }

  const eventosFiltrados = eventos.filter((evento) =>
    evento.titulo?.toLowerCase().includes(busca.toLowerCase())
  );

  const quantidadeAtivos = eventos.filter((evento) => evento.status).length;

  const abrirNovoEvento = () => {
    setEventoEditando(null);
    setTitulo('');
    setDataApenas('');
    setHoraApenas('');
    setPalestrante('');
    setLocal('');
    setHorasAAC('');
    setCursoId(cursos.length > 0 ? cursos[0].id : '');
    setDescricao('');
    setImagem(null);
    setProporcao('16:9');
    setDescricaoImagem('');
    setModalEvento(true);
    setLinkTransmissao('');
  };

  const abrirEdicao = (evento) => {
    setEventoEditando(evento);
    setTitulo(evento.titulo || '');
    
    const dataBr = evento.inicio || evento.data || evento.dataEvento;
    if (dataBr) {
      try {
        const dataPura = dataBr.substring(0, 10);
        const [ano, mes, dia] = dataPura.split('-');

        if (ano && mes && dia) {
          setDataApenas(`${dia}/${mes}/${ano}`);
        } else {
          setDataApenas('');
        }

        const partesEspaco = dataBr.split(' ');
        const partesT = dataBr.split('T');
        const stringHora = partesEspaco.length > 1 ? partesEspaco[1] : (partesT.length > 1 ? partesT[1] : '');

        if (stringHora) {
          const horaLimpa = stringHora.split('.')[0].replace('Z', '').split('+')[0];
          setHoraApenas(horaLimpa);
        } else {
          setHoraApenas('00:00:00');
        }
      } catch (e) {
        console.log("Erro ao processar data do evento:", e);
        setDataApenas('');
        setHoraApenas('00:00:00');
      }
    } else {
      setDataApenas('');
      setHoraApenas('00:00:00');
    }

    setPalestrante(evento.palestrante || '');
    setLocal(evento.local || '');
    setHorasAAC(evento.horasAAC ? String(evento.horasAAC) : '');
    setCursoId(evento.curso_id || evento.cursoId || '');
    setDescricao(evento.descricao || '');
    setProporcao(evento.imagem?.proporcao || '16:9');
    setLinkTransmissao(evento.link_transmissao || evento.linkTransmissao || '');
    const urlImagem = evento.imagem?.caminho_img || evento.imagem || null;
    setImagem(urlImagem);
    setDescricaoImagem(evento.imagem?.descricao || evento.descricaoImagem || '');
    
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
        const acaoRedimensionar = ehVertical ? { resize: { height: 1280 } } : { resize: { width: 1280 } };

        const imagemOtimizada = await ImageManipulator.manipulateAsync(
          uri,
          [acaoRedimensionar], 
          { compress: 0.80, format: ImageManipulator.SaveFormat.JPEG }
        );

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
        mensagem: 'Por favor, preencha todos os campos obrigatórios (Título, Data, Local e Curso).' 
      });
      return;
    }

    const horaFinal = horaApenas && horaApenas.length >= 5 ? horaApenas : '00:00:00';
    const dataHoraCompleta = `${dataApenas} ${horaFinal}`;
    const dataIso = converterParaISO(dataHoraCompleta);

    if (!dataIso) {
      setFeedback({ tipo: 'erro', mensagem: 'Formato de data ou hora inválido.' });
      return;
    }

    try {
      let imagemId = eventoEditando?.imagem_id || null;
      let urlDefinitiva = null;

      if (!imagem) {
        imagemId = 21; 
      } else {
        const ehLocalTemp = imagem.startsWith('file://') || imagem.startsWith('blob:') || imagem.startsWith('content://');

        if (ehLocalTemp) {
          urlDefinitiva = await fazerUploadParaSupabaseStorage(imagem);
          
          const novaImagemPayload = {
            titulo: `Capa: ${titulo.trim()}`,
            descricao: descricaoImagem.trim() || 'Divulgação do evento',
            caminho_img: urlDefinitiva,
            proporcao: proporcao 
          };

          if (eventoEditando && eventoEditando.imagem_id && eventoEditando.imagem_id !== 21) {
            imagemId = eventoEditando.imagem_id;
            await atualizarImagemNoBanco(imagemId, novaImagemPayload);
          } else {
            const imagemCriada = await criarImagemNoBanco(novaImagemPayload);
            imagemId = imagemCriada.id;
          }
        } else {
          if (imagemId && imagemId !== 21) {
            try {
              await atualizarImagemNoBanco(imagemId, { 
                descricao: descricaoImagem.trim(),
                proporcao: proporcao 
              });
            } catch (e) {
              console.log("Erro ao atualizar dados da imagem:", e);
            }
          }
        }
      }

      const cursoTratado = cursoId && cursoId !== "NULL" ? Number(cursoId) : null;

      const payloadEvento = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        data: dataIso,
        palestrante: palestrante.trim() || null,
        local: local.trim() || null,
        curso_id: cursoTratado,
        horasAAC: horasAAC ? Number(horasAAC) : 0,
        imagem_id: imagemId, 
        usuario_id: usuarioAtual?.id || null,
        link_transmissao: linkTransmissao.trim() || null, 
      };

      if (eventoEditando) {
        await atualizarEventoNoBanco(eventoEditando.id, payloadEvento);
        setToast({ visible: true, titulo: 'Sucesso', mensagem: 'O evento foi atualizado com sucesso!' });
      } else {
        await criarEventoNoBanco(payloadEvento);
        setToast({ visible: true, titulo: 'Sucesso', mensagem: 'O novo evento foi cadastrado com sucesso!' });
      }

      setModalEvento(false);
      carregarDadosIniciais();
    } catch (error) {
      console.log('Erro ao salvar evento:', error);
      setFeedback({ tipo: 'erro', mensagem: 'Não foi possível salvar o evento no banco de dados.' });
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
        setConfirmacao(prev => ({ ...prev, visible: false }));
        try {
          await alterarStatusEventoNoBanco(evento.id, novoStatus);
          setEventos(eventos.map(item => item.id === evento.id ? { ...item, status: novoStatus } : item));
          setToast({ visible: true, titulo: 'Status Alterado', mensagem: `Evento ${novoStatus ? 'ativado' : 'encerrado'} com sucesso.` });
        } catch (error) {
          setToast({ visible: true, titulo: 'Erro', mensagem: 'Não foi possível alterar o status.' });
        }
      }
    });
  }

  function excluirEvento(evento) {
    const eventoObj = typeof evento === 'object' ? evento : eventos.find(e => e.id === evento);
    const tituloEvento = eventoObj?.titulo || 'este evento';
    const eventoId = eventoObj?.id || evento;

    setConfirmacao({
      visible: true,
      titulo: 'Excluir evento',
      mensagem: `Deseja realmente excluir "${tituloEvento}"? Esta ação removerá a imagem e os dados do evento permanentemente.`,
      tipo: 'danger',
      onConfirm: async () => {
        setConfirmacao(prev => ({ ...prev, visible: false }));
        try {
          await removerEventoDoBanco(eventoObj || eventoId);
          setEventos(prev => prev.filter(item => item.id !== eventoId));
          setToast({ visible: true, titulo: 'Excluído', mensagem: 'O evento e sua imagem foram removidos com sucesso.' });
        } catch (error) {
          console.error('Erro ao excluir evento:', error);
          setToast({ visible: true, titulo: 'Erro', mensagem: 'Não foi possível excluir o evento do banco de dados.' });
        }
      }
    });
  }

  const solicitarRemocaoImagem = () => {
    if (eventoEditando) {
      setConfirmacao({
        visible: true,
        titulo: 'Remover Imagem',
        mensagem: 'Deseja remover a imagem atual? Se não escolher outra antes de salvar, a imagem padrão será aplicada.',
        tipo: 'danger',
        onConfirm: () => {
          setConfirmacao(prev => ({ ...prev, visible: false }));
          setImagem(null);
          setDescricaoImagem('');
          setEventoEditando(prev => ({ ...prev, imagem_id: null, imagem: null }));
          setToast({ visible: true, titulo: 'Imagem Removida', mensagem: 'Pode selecionar uma nova imagem ou salvar para usar a padrão.' });
        }
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
    titulo, setTitulo,
    descricao, setDescricao,
    dataTexto, setDataTexto,
    palestrante, setPalestrante,
    cursoId, setCursoId,
    local, setLocal,
    horasAAC, setHorasAAC,
    imagem, setImagem,
    proporcao, setProporcao,
    descricaoImagem, setDescricaoImagem,
    dataApenas, setDataApenas,
    horaApenas, setHoraApenas,
    linkTransmissao, setLinkTransmissao,
    feedback,
    toast, setToast,
    confirmacao, setConfirmacao,
    abrirNovoEvento,
    abrirEdicao,
    selecionarImagem,
    salvarEvento,
    alternarStatus,
    excluirEvento,
    carregando, 
    solicitarRemocaoImagem
  };
}