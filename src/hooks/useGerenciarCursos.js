import { useState, useEffect } from 'react';
import { 
  buscarCursosDoBanco, 
  criarCursoNoBanco, 
  atualizarCursoNoBanco, 
  removerCursoDoBanco 
} from '../services/cursoServices';

export function useGerenciarCursos() {
  const [cursos, setCursos] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(false);

  const [modalCurso, setModalCurso] = useState(false);
  const [cursoEditando, setCursoEditando] = useState(null);

  // Campos do formulário
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [link, setLink] = useState('');
  const [icone, setIcone] = useState('book-outline');
  const [tipo, setTipo] = useState('Presencial'); 
  const [modalidade, setModalidade] = useState('Graduação'); // 👈 Novo estado para modalidade

  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });
  const [toast, setToast] = useState({ visible: false, nome: '', mensagem: '' });
  const [confirmacao, setConfirmacao] = useState({ visible: false, nome: '', mensagem: '', onConfirm: null, tipo: 'danger' });

  useEffect(() => {
    carregarCursos();
  }, []);

  async function carregarCursos() {
    try {
      setCarregando(true);
      const dados = await buscarCursosDoBanco();
      setCursos(dados || []);
    } catch (error) {
      console.log('Erro ao carregar cursos:', error);
      setToast({ visible: true, nome: 'Erro', mensagem: 'Não foi possível carregar os cursos.' });
    } finally {
      setCarregando(false);
    }
  }

  const cursosFiltrados = cursos.filter((curso) =>
    (curso.nome || curso.nome)?.toLowerCase().includes(busca.toLowerCase()) ||
    curso.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
    curso.tipo?.toLowerCase().includes(busca.toLowerCase()) ||
    curso.modalidade?.toLowerCase().includes(busca.toLowerCase())
  );

  const abrirNovoCurso = () => {
    setCursoEditando(null);
    setNome('');
    setDescricao('');
    setLink('');
    setIcone('book-outline');
    setTipo('Presencial');
    setModalidade('Graduação'); // 👈 Reseta para o padrão
    setFeedback({ tipo: '', mensagem: '' });
    setModalCurso(true);
  };

  const abrirEdicaoCurso = (curso) => {
    setCursoEditando(curso);
    setNome(curso.nome || curso.nome || '');
    setDescricao(curso.descricao || '');
    setLink(curso.link || '');
    setIcone(curso.icone || 'book-outline');
    setTipo(curso.tipo || 'Presencial');
    setModalidade(curso.modalidade || 'Graduação'); // 👈 Carrega a modalidade salva
    setFeedback({ tipo: '', mensagem: '' });
    setModalCurso(true);
  };

  async function salvarCurso() {
    if (!nome.trim()) {
      setFeedback({ tipo: 'erro', mensagem: 'O título/nome do curso é obrigatório.' });
      return;
    }

    try {
      const payload = {
        nome: nome.trim(),
        descricao: descricao.trim() || null,
        link: link.trim() || null,
        icone: icone || 'book-outline',
        tipo: tipo || 'Presencial',
        modalidade: modalidade || 'Graduação', // 👈 Inclui a modalidade no payload
      };

      if (cursoEditando) {
        await atualizarCursoNoBanco(cursoEditando.id, payload);
        setToast({ visible: true, nome: 'Sucesso', mensagem: 'Curso atualizado com sucesso!' });
      } else {
        await criarCursoNoBanco(payload);
        setToast({ visible: true, nome: 'Sucesso', mensagem: 'Novo curso cadastrado com sucesso!' });
      }

      setModalCurso(false);
      carregarCursos();
    } catch (error) {
      console.log('Erro ao salvar curso:', error);
      setFeedback({ tipo: 'erro', mensagem: 'Não foi possível salvar o curso no banco de dados.' });
    }
  }

  function excluirCurso(curso) {
    setConfirmacao({
      visible: true,
      nome: 'Excluir curso',
      mensagem: `Deseja realmente excluir o curso "${curso.nome}"?`,
      tipo: 'danger',
      onConfirm: async () => {
        setConfirmacao(prev => ({ ...prev, visible: false }));
        try {
          await removerCursoDoBanco(curso.id);
          setCursos(prev => prev.filter(c => c.id !== curso.id));
          setToast({ visible: true, nome: 'Excluído', mensagem: 'Curso removido com sucesso.' });
        } catch (error) {
          console.error('Erro ao excluir curso:', error);
          setToast({ visible: true, nome: 'Erro', mensagem: 'Não foi possível excluir o curso.' });
        }
      }
    });
  }

  return {
    cursos,
    cursosFiltrados,
    busca,
    setBusca,
    carregando,
    modalCurso,
    setModalCurso,
    cursoEditando,
    nome,
    setNome,
    descricao,
    setDescricao,
    link,
    setLink,
    icone,
    setIcone,
    tipo,
    setTipo,
    modalidade,       
    setModalidade,   
    feedback,
    toast,
    setToast,
    confirmacao,
    setConfirmacao,
    abrirNovoCurso,
    abrirEdicaoCurso,
    salvarCurso,
    excluirCurso
  };
}