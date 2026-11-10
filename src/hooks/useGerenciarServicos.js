import { useState, useEffect } from 'react';
import { 
  buscarServicosDoBanco, 
  criarServicoNoBanco, 
  atualizarServicoNoBanco, 
  removerServicoDoBanco 
} from '../services/servicoService';
import { buscarCoordenadoresDoBanco } from '../services/cursoServices';
import { supabase } from '../../lib/supabase';

export function useGerenciarServicos() {
  const [servicos, setServicos] = useState([]);
  const [coordenadoresDisponiveis, setCoordenadoresDisponiveis] = useState([]);
  const [cursosDisponiveis, setCursosDisponiveis] = useState([]);
  
  const [pesquisa, setPesquisa] = useState('');
  const [carregando, setCarregando] = useState(false);

  const [modalFormulario, setModalFormulario] = useState(false);
  const [servicoEditando, setServicoEditando] = useState(null);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);

  // Campos do formulário
  const [nome, setNome] = useState('');
  const [coordenadorId, setCoordenadorId] = useState('');
  const [cursoId, setCursoId] = useState('');
  const [descricao, setDescricao] = useState(''); // 👈 Corrigido de setDescdescricao para setDescricao
  const [dias, setDias] = useState('');
  const [linksUteis, setLinksUteis] = useState('');
  const [aviso, setAviso] = useState('');

  const [toast, setToast] = useState({ visible: false, nome: '', mensagem: '' });
  const [confirmacao, setConfirmacao] = useState({ visible: false, nome: '', mensagem: '', onConfirm: null, tipo: 'danger' });

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      setCarregando(true);
      const [dadosServicos, dadosCoords, { data: dadosCursos }] = await Promise.all([
        buscarServicosDoBanco(),
        buscarCoordenadoresDoBanco(),
        supabase.from('curso').select('id, nome').order('nome')
      ]);

      setServicos(dadosServicos || []);
      setCoordenadoresDisponiveis(dadosCoords || []);
      setCursosDisponiveis(dadosCursos || []);
    } catch (error) {
      console.log('Erro ao carregar dados de serviços:', error);
      setToast({ visible: true, nome: 'Erro', mensagem: 'Não foi possível carregar os dados.' });
    } finally {
      setCarregando(false);
    }
  }

  const limparFormulario = () => {
    setNome('');
    setCoordenadorId('');
    setCursoId('');
    setDescricao(''); // 👈 Atualizado aqui também
    setDias('');
    setLinksUteis('');
    setAviso('');
    setServicoEditando(null);
  };

  const abrirCadastro = async () => {
    limparFormulario();
    const coords = await buscarCoordenadoresDoBanco();
    setCoordenadoresDisponiveis(coords || []);
    setModalFormulario(true);
  };

  const abrirEdicao = async (item) => {
    const coords = await buscarCoordenadoresDoBanco();
    setCoordenadoresDisponiveis(coords || []);

    setServicoEditando(item);
    setNome(item.nome || '');
    setCoordenadorId(item.coordenador_id || '');
    setCursoId(item.curso_id || '');
    setDescricao(item.descricao || ''); // 👈 Atualizado aqui também
    setDias(item.dias || '');
    setLinksUteis(item.linksUteis || '');
    setAviso(item.aviso || '');

    setServicoSelecionado(null);
    setModalFormulario(true);
  };

  const salvarServico = async () => {
    if (!nome.trim() || !coordenadorId) {
      setToast({ visible: true, nome: 'Atenção', mensagem: 'Informe o nome do serviço e selecione o coordenador responsável.' });
      return;
    }

    try {
      const payload = {
        nome: nome.trim(),
        descricao: descricao.trim() || null,
        dias: dias.trim() || null,
        links_uteis: linksUteis.trim() || null,
        aviso: aviso.trim() || null,
        coordenador_id: coordenadorId ? Number(coordenadorId) : null,
        curso_id: cursoId ? Number(cursoId) : null,
        status: 'Ativo',
      };

      if (servicoEditando) {
        await atualizarServicoNoBanco(servicoEditando.id, payload);
        setToast({ visible: true, nome: 'Sucesso', mensagem: 'Serviço atualizado com sucesso!' });
      } else {
        await criarServicoNoBanco(payload);
        setToast({ visible: true, nome: 'Sucesso', mensagem: 'Novo serviço cadastrado com sucesso!' });
      }

      setModalFormulario(false);
      limparFormulario();
      carregarDados();
    } catch (error) {
      console.log('Erro ao salvar serviço:', error);
      setToast({ visible: true, nome: 'Erro', mensagem: 'Não foi possível salvar o serviço no banco.' });
    }
  };

  const confirmarExclusao = (id) => {
    setConfirmacao({
      visible: true,
      nome: 'Excluir serviço',
      mensagem: 'Tem certeza de que deseja excluir este serviço?',
      tipo: 'danger',
      onConfirm: async () => {
        try {
          await removerServicoDoBanco(id);
          setServicos(lista => lista.filter(item => item.id !== id));
          setServicoSelecionado(null);
          setToast({ visible: true, nome: 'Sucesso', mensagem: 'Serviço removido com sucesso.' });
        } catch (error) {
          console.log('Erro ao excluir:', error);
          setToast({ visible: true, nome: 'Erro', mensagem: 'Não foi possível excluir o serviço.' });
        } finally {
          setConfirmacao(prev => ({ ...prev, visible: false }));
        }
      }
    });
  };

  const servicosFiltrados = servicos.filter(item => {
    const termo = pesquisa.toLowerCase();
    return (
      item.nome.toLowerCase().includes(termo) ||
      item.responsavel.toLowerCase().includes(termo) ||
      item.curso.toLowerCase().includes(termo)
    );
  });

  const quantidadeCoordenadores = new Set(
    servicos.map(item => item.responsavel.trim().toLowerCase()).filter(Boolean)
  ).size;

  return {
    servicos,
    servicosFiltrados,
    pesquisa, setPesquisa,
    carregando,
    quantidadeServicos: servicos.length,
    quantidadeCoordenadores,
    modalFormulario, setModalFormulario,
    servicoEditando,
    servicoSelecionado, setServicoSelecionado,
    nome, setNome,
    coordenadorId, setCoordenadorId,
    cursoId, setCursoId,
    descricao, setDescricao, // 👈 Retorna o setDescricao correto para o componente
    dias, setDias,
    linksUteis, setLinksUteis,
    aviso, setAviso,
    coordenadoresDisponiveis,
    cursosDisponiveis,
    toast, setToast,
    confirmacao, setConfirmacao,
    abrirCadastro,
    abrirEdicao,
    salvarServico,
    confirmarExclusao,
    limparFormulario,
  };
}