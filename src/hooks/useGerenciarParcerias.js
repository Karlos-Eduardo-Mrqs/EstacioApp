import { useState, useEffect } from 'react';
import { buscarParceriasDoBanco, criarParceriaNoBanco, atualizarParceriaNoBanco, excluirParceriaDoBanco } from '../services/parceriaServices';

export function useGerenciarParcerias() {
  const [parcerias, setParcerias] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);

  // Estados do Modal de Cadastro/Edição
  const [modalParceria, setModalParceria] = useState(false);
  const [parceriaEditando, setParceriaEditando] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [link, setLink] = useState('');
  const [duracao, setDuracao] = useState(''); // Formato YYYY-MM-DD
  const [desconto, setDesconto] = useState(''); // Ex: 20% OFF

  // Estados para Popups de Feedback e Confirm Popup
  const [feedback, setFeedback] = useState({ tipo: null, mensagem: '' });
  const [toast, setToast] = useState({ visible: false, titulo: '', mensagem: '' });
  const [confirmacao, setConfirmacao] = useState({
    visible: false,
    titulo: '',
    mensagem: '',
    onConfirm: null,
    tipo: 'danger'
  });

  useEffect(() => {
    carregarParcerias();
  }, []);

  async function carregarParcerias() {
    try {
      setCarregando(true);
      const dados = await buscarParceriasDoBanco();
      setParcerias(dados || []);
    } catch (error) {
      console.log('Erro ao carregar parcerias:', error);
    } finally {
      setCarregando(false);
    }
  }

  const parceriasFiltradas = parcerias.filter(p => {
    const termo = busca.toLowerCase();
    const tituloMatch = p.titulo?.toLowerCase().includes(termo);
    const descMatch = p.descricao?.toLowerCase().includes(termo);
    return tituloMatch || descMatch;
  });

  // Conta quantas parcerias estão válidas (não expiraram)
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const quantidadeAtivas = parcerias.filter(p => {
    if (!p.duracao) return true;
    const dataExp = new Date(p.duracao);
    return isNaN(dataExp.getTime()) || dataExp >= hoje;
  }).length;

  const abrirNovaParceria = () => {
    setParceriaEditando(null);
    setTitulo('');
    setDescricao('');
    setLink('');
    setDuracao('');
    setDesconto('');
    setFeedback({ tipo: null, mensagem: '' });
    setModalParceria(true);
  };

  const abrirEdicao = (parceria) => {
    setParceriaEditando(parceria);
    setTitulo(parceria.titulo || '');
    setDescricao(parceria.descricao || '');
    setLink(parceria.link || '');
    
    // Converte de AAAA-MM-DD para DD/MM/AAAA ao abrir para edição
    let dataFormatada = parceria.duracao || '';
    if (dataFormatada.includes('-')) {
      const [ano, mes, dia] = dataFormatada.split('-');
      dataFormatada = `${dia}/${mes}/${ano}`;
    }

    setDuracao(dataFormatada);
    setDesconto(parceria.desconto || '');
    setFeedback({ tipo: null, mensagem: '' });
    setModalParceria(true);
  };

  const salvarParceria = async () => {
    if (!titulo.trim() || !duracao.trim()) {
      setFeedback({ tipo: 'erro', mensagem: 'Título e data de duração são obrigatórios.' });
      return;
    }

    // Converte de DD/MM/AAAA para AAAA-MM-DD
    let dataIso = duracao.trim();
    if (duracao.includes('/')) {
      const partes = duracao.split('/');
      if (partes.length === 3) {
        const [dia, mes, ano] = partes;
        dataIso = `${ano}-${mes}-${dia}`;
      }
    }

    try {
      const payload = {
        titulo: titulo.trim(),
        descricao: descricao ? descricao.trim() : null,
        link: link ? link.trim() : null,
        duracao: dataIso,
        desconto: desconto ? desconto.trim() : null
      };

      if (parceriaEditando) {
        await atualizarParceriaNoBanco(parceriaEditando.id, payload);
        setToast({ visible: true, titulo: 'Sucesso!', mensagem: 'Parceria atualizada com sucesso.' });
      } else {
        await criarParceriaNoBanco(payload);
        setToast({ visible: true, titulo: 'Sucesso!', mensagem: 'Nova parceria cadastrada com sucesso.' });
      }

      setModalParceria(false);
      carregarParcerias();
    } catch (error) {
      console.error('Erro detalhado ao salvar parceria:', error);
      setFeedback({ tipo: 'erro', mensagem: 'Não foi possível salvar a parceria.' });
    }
  };

  const solicitarExclusao = (parceria) => {
    setConfirmacao({
      visible: true,
      titulo: 'Remover Parceria',
      mensagem: `Deseja realmente eliminar a parceria "${parceria.titulo}"? Essa ação é irreversível.`,
      tipo: 'danger',
      onConfirm: async () => {
        try {
          await excluirParceriaDoBanco(parceria.id);
          setConfirmacao(prev => ({ ...prev, visible: false }));
          setToast({ visible: true, titulo: 'Removido', mensagem: 'Parceria eliminada com sucesso.' });
          carregarParcerias();
        } catch (error) {
          console.error('Erro ao excluir parceria:', error);
          setToast({ visible: true, titulo: 'Erro', mensagem: 'Falha ao remover a parceria.' });
        }
      }
    });
  };

  return {
    parcerias,
    parceriasFiltradas,
    quantidadeAtivas,
    busca, setBusca,
    modalParceria, setModalParceria,
    parceriaEditando,
    titulo, setTitulo,
    descricao, setDescricao,
    link, setLink,
    duracao, setDuracao,
    desconto, setDesconto,
    feedback,
    toast, setToast,
    confirmacao, setConfirmacao,
    abrirNovaParceria,
    abrirEdicao,
    salvarParceria,
    solicitarExclusao,
    carregando
  };
}