import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { buscarEventosDoBanco, criarEventoNoBanco, atualizarEventoNoBanco, removerEventoDoBanco, 
alterarStatusEventoNoBanco, criarImagemNoBanco, atualizarImagemNoBanco, buscarCursosDoBanco,fazerUploadParaSupabaseStorage,removerOuSubstituirImagemEvento } from '../services/apiServices';
import { formatarDataHora, converterParaISO } from '../utils/dataUtils';

export function useGerenciarEventos() {
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
  const [dataApenas, setDataApenas] = useState('');
  const [horaApenas, setHoraApenas] = useState('');

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
  }, []);

  async function carregarDadosIniciais() {
    try {
      setCarregando(true);
      const [dadosEventos, dadosCursos] = await Promise.all([
        buscarEventosDoBanco(),
        buscarCursosDoBanco()
      ]);
      
      setEventos(dadosEventos || []);
      setCursos(dadosCursos || []);
      if (dadosCursos && dadosCursos.length > 0) {
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
    setCursoId('');
    setDescricao('');
    setImagem(null);
    setDescricaoImagem('');
    setModalEvento(true);
  };

  const abrirEdicao = (evento) => {
    setEventoEditando(evento);
    setTitulo(evento.titulo || '');
    
    const dataBr = evento.inicio || evento.data || evento.dataEvento;
    if (dataBr) {
      try {
        // Exemplo de formato do banco: "2026-10-17 19:54:34.521676+00" ou ISO "2026-10-17T19:54:34..."
        // Pegamos apenas os primeiros 10 caracteres que correspondem a "AAAA-MM-DD"
        const dataPura = dataBr.substring(0, 10); // "2026-10-17"
        const [ano, mes, dia] = dataPura.split('-');

        if (ano && mes && dia) {
          setDataApenas(`${dia}/${mes}/${ano}`); // Transforma em "17/10/2026"
        } else {
          setDataApenas('');
        }

        // Extrai a hora (procura pelo espaço ou pelo 'T')
        const partesEspaco = dataBr.split(' ');
        const partesT = dataBr.split('T');
        const stringHora = partesEspaco.length > 1 ? partesEspaco[1] : (partesT.length > 1 ? partesT[1] : '');

        if (stringHora) {
          // Remove os milissegundos, o 'Z' ou o fuso horário (+00)
          const horaLimpa = stringHora.split('.')[0].replace('Z', '').split('+')[0];
          setHoraApenas(horaLimpa); // Ex: "19:54:34"
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
    
    const urlImagem = evento.imagem?.caminho_img || evento.imagem || null;
    setImagem(urlImagem);
    setDescricaoImagem(evento.imagem?.descricao || evento.descricaoImagem || '');
    
    setModalEvento(true);
  };

  async function selecionarImagem() {
    try {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        quality: 1, 
      });

      if (!resultado.canceled && resultado.assets?.length) {
        const asset = resultado.assets[0];
        const uriOriginal = asset.uri;

        // Determina se a imagem é mais alta (vertical) ou mais larga (horizontal)
        const ehVertical = asset.height > asset.width;

        // Redimensiona inteligentemente: se for vertical ajusta pela altura, se for horizontal pela largura
        const acaoRedimensionar = ehVertical 
          ? { resize: { height: 1280 } } 
          : { resize: { width: 1280 } };

        const imagemOtimizada = await ImageManipulator.manipulateAsync(
          uriOriginal,
          [acaoRedimensionar], 
          { 
            compress: 0.75, // Comprime para 75% para garantir que o ficheiro fique menor que o original (abaixo de 100kb)
            format: ImageManipulator.SaveFormat.JPEG 
          }
        );

        setImagem(imagemOtimizada.uri);
      }
    } catch (error) {
      console.log("Erro ao comprimir imagem:", error);
      setFeedback({ tipo: 'erro', mensagem: 'Não foi possível otimizar a imagem.' });
    }
  }

  async function salvarEvento() {
    // 1. 🛡️ Validação dos campos obrigatórios
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

      // 2. 🖼️ Gestão da Imagem (Se não houver imagem, atribui uma padrão)
      if (!imagem) {
        imagemId = 21; // 👈 Substitua pelo ID real da imagem padrão no seu banco
      } else {
        const ehLocalTemp = imagem.startsWith('file://') || imagem.startsWith('blob:') || imagem.startsWith('content://');

        if (ehLocalTemp) {
          const urlDefinitiva = await fazerUploadParaSupabaseStorage(imagem, titulo);
          
          const novaImagemPayload = {
            titulo: `Capa: ${titulo.trim()}`,
            descricao: descricaoImagem.trim() || 'Divulgação do evento',
            caminho_img: urlDefinitiva,
          };

          if (eventoEditando && eventoEditando.imagem_id && eventoEditando.imagem_id !== 1) {
            // Atualiza a imagem existente (se não for a padrão)
            imagemId = eventoEditando.imagem_id;
            await atualizarImagemNoBanco(imagemId, novaImagemPayload);
          } else {
            // Cria um novo registo de imagem se for novo ou se usava a padrão antes
            const imagemCriada = await criarImagemNoBanco(novaImagemPayload);
            imagemId = imagemCriada.id;
          }
        } else if (imagemId && imagemId !== 1 && descricaoImagem) {
          try {
            await atualizarImagemNoBanco(imagemId, { descricao: descricaoImagem.trim() });
          } catch (e) {
            console.log("Erro ao atualizar descrição da imagem:", e);
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
        imagem_id: imagemId, // 👈 Será o ID da imagem enviada ou o ID 1 (padrão)
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
          
          // 1. Limpa o estado local para habilitar o botão de "Selecionar imagem"
          setImagem(null);
          setDescricaoImagem('');
          
          // 2. Remove temporariamente o vínculo da imagem no objeto de edição para sabermos que foi desassociada
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
    descricaoImagem, setDescricaoImagem,
    dataApenas, setDataApenas,
    horaApenas, setHoraApenas,
    feedback,
    toast, setToast,
    confirmacao, setConfirmacao,
    abrirNovoEvento,
    abrirEdicao,
    selecionarImagem,
    salvarEvento,
    alternarStatus,
    excluirEvento,
    carregando, solicitarRemocaoImagem
  };
}