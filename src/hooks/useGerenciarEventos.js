import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { buscarEventosDoBanco, criarEventoNoBanco, atualizarEventoNoBanco, removerEventoDoBanco, 
alterarStatusEventoNoBanco, criarImagemNoBanco, atualizarImagemNoBanco, buscarCursosDoBanco,fazerUploadParaSupabaseStorage } from '../services/apiServices';
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
    setDataTexto('');
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
    setDataTexto(dataBr ? formatarDataHora(dataBr) : '');

    setPalestrante(evento.palestrante || '');
    setLocal(evento.local || '');
    setHorasAAC(evento.horasAAC ? String(evento.horasAAC) : '');
    setCursoId(evento.curso_id || evento.cursoId || '');
    setDescricao(evento.descricao || '');
    
    // Puxa a imagem atual do evento para exibição correta na edição
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
        aspect: [16, 9], // Mantém o formato padrão de banner 16:9
        quality: 1, // Pega o arquivo original completo do dispositivo
      });

      if (!resultado.canceled && resultado.assets?.length) {
        const uriOriginal = resultado.assets[0].uri;

        // 📉 COMPRESSÃO DE MB PARA KB:
        // Reduz a largura para 1280px e comprime para 75% de qualidade JPEG
        const imagemOtimizada = await ImageManipulator.manipulateAsync(
          uriOriginal,
          [{ resize: { width: 1280 } }], // Redimensiona o excesso de resolução
          { 
            compress: 0.75, // Reduz o peso de MB para KB mantendo alta fidelidade visual
            format: ImageManipulator.SaveFormat.JPEG 
          }
        );

        // A 'imagemOtimizada.uri' agora está leve (geralmente abaixo de 300KB) e pronta para upload
        setImagem(imagemOtimizada.uri);
      }
    } catch (error) {
      console.log("Erro ao comprimir imagem:", error);
      setFeedback({ tipo: 'erro', mensagem: 'Não foi possível otimizar a imagem.' });
    }
  }

  async function salvarEvento() {
    if (!titulo.trim() || !dataTexto.trim()) {
      setFeedback({ tipo: 'erro', mensagem: 'Preencha o título e a data do evento.' });
      return;
    }

    const dataIso = converterParaISO(dataTexto) || dataTexto;

    try {
      let imagemId = eventoEditando?.imagem_id || null;

      if (!imagem) {
        imagemId = null;
      } else {
        // Verifica se a imagem é um link temporário local que precisa de upload
        const ehLocalTemp = imagem.startsWith('file://') || imagem.startsWith('blob:') || imagem.startsWith('content://');

        if (ehLocalTemp) {
          // 🚀 1. Faz o upload real para o Supabase Storage e obtém a URL pública permanente
          const urlDefinitiva = await fazerUploadParaSupabaseStorage(imagem);

          const novaImagemPayload = {
            titulo: `Capa: ${titulo.trim()}`,
            descricao: descricaoImagem.trim() || 'Divulgação do evento',
            caminho_img: urlDefinitiva, // 👈 Guarda a URL oficial da nuvem
          };

          if (imagemId) {
            try {
              await atualizarImagemNoBanco(imagemId, novaImagemPayload);
            } catch {
              const imagemCriada = await criarImagemNoBanco(novaImagemPayload);
              imagemId = imagemCriada.id;
            }
          } else {
            const imagemCriada = await criarImagemNoBanco(novaImagemPayload);
            imagemId = imagemCriada.id;
          }
        } else if (imagemId && descricaoImagem) {
          try {
            await atualizarImagemNoBanco(imagemId, { descricao: descricaoImagem.trim() });
          } catch (e) {
            console.log("Erro ao atualizar descrição da imagem:", e);
          }
        }
      }

      const payloadEvento = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        data: dataIso,
        palestrante: palestrante.trim() || null,
        local: local.trim() || null,
        curso_id: cursoId ? Number(cursoId) : null,
        horasAAC: horasAAC ? Number(horasAAC) : 0,
        status: eventoEditando ? eventoEditando.status : true,
        imagem_id: imagemId,
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
    // 🛡️ Proteção extra caso venha um ID isolado ou evento vazio
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
          
          setToast({ 
            visible: true, 
            titulo: 'Excluído', 
            mensagem: 'O evento e sua imagem foram removidos com sucesso.' 
          });
        } catch (error) {
          console.error('Erro ao excluir evento:', error);
          setToast({ 
            visible: true, 
            titulo: 'Erro', 
            mensagem: 'Não foi possível excluir o evento do banco de dados.' 
          });
        }
      }
    });
  }

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
    feedback,
    toast, setToast,
    confirmacao, setConfirmacao,
    abrirNovoEvento,
    abrirEdicao,
    selecionarImagem,
    salvarEvento,
    alternarStatus,
    excluirEvento,
    carregando
  };
}