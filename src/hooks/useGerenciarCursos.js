import { useState, useEffect, useCallback } from 'react';
import {
  buscarCursosDoBanco,
  criarCursoNoBanco,
  atualizarCursoNoBanco,
  removerCursoDoBanco,
  buscarCoordenadoresDoBanco,
  buscarCursosIdsPorCoordenador,
  sincronizarCoordenadoresDoCurso,
} from '../services/cursoServices';

export function useGerenciarCursos(usuarioAtual) {
  const [cursos, setCursos] = useState([]);
  const [cursosDoCoordenadorIds, setCursosDoCoordenadorIds] = useState([]);
  const [busca, setBusca] = useState('');
  const [coordenadoresDisponiveis, setCoordenadoresDisponiveis] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const [modalCurso, setModalCurso] = useState(false);
  const [cursoEditando, setCursoEditando] = useState(null);

  // Campos do formulário
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [link, setLink] = useState('');
  const [icone, setIcone] = useState('book-outline');
  const [tipo, setTipo] = useState('Presencial');
  const [coordenadorId, setCoordenadorId] = useState('');
  const [modalidade, setModalidade] = useState('Graduação');
  const [coordenadoresSelecionados, setCoordenadoresSelecionados] = useState([]);

  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });
  const [toast, setToast] = useState({ visible: false, nome: '', mensagem: '' });
  const [confirmacao, setConfirmacao] = useState({
    visible: false,
    nome: '',
    mensagem: '',
    onConfirm: null,
    tipo: 'danger',
  });

  const perfilNorm = usuarioAtual?.perfil
    ? usuarioAtual.perfil.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    : '';
  const ehCoord = perfilNorm.includes('coordenador');

  const carregarVinculosDoCoordAtual = useCallback(async () => {
    if (!ehCoord || !usuarioAtual?.id) {
      setCursosDoCoordenadorIds([]);
      return [];
    }

    const ids = await buscarCursosIdsPorCoordenador(usuarioAtual.id);
    setCursosDoCoordenadorIds(ids);
    return ids;
  }, [ehCoord, usuarioAtual?.id]);

  const carregarCursos = useCallback(async () => {
    try {
      setCarregando(true);
      const [dados] = await Promise.all([
        buscarCursosDoBanco(),
        carregarVinculosDoCoordAtual(),
      ]);
      setCursos(dados || []);
    } catch (error) {
      setToast({
        visible: true,
        nome: 'Erro',
        mensagem: 'Não foi possível carregar os cursos.',
      });
    } finally {
      setCarregando(false);
    }
  }, [carregarVinculosDoCoordAtual]);

  useEffect(() => {
    carregarCursos();
  }, [carregarCursos]);

  const cursosFiltrados = cursos.filter((curso) => {
    const termo = busca.toLowerCase().trim();

    if (ehCoord) {
      const cursoIdNum = Number(curso.id);
      const userIdNum = Number(usuarioAtual?.id);
      const legacyCursoIdNum = Number(usuarioAtual?.curso_id);

      const pertenceAoCoordenador =
        cursosDoCoordenadorIds.includes(cursoIdNum) ||
        (Array.isArray(curso.coordenadoresIds) && curso.coordenadoresIds.includes(userIdNum)) ||
        (userIdNum && Number(curso.coordenador_id) === userIdNum) ||
        (legacyCursoIdNum && cursoIdNum === legacyCursoIdNum);

      if (!pertenceAoCoordenador) return false;
      if (!termo) return true;

      return (
        curso.nome?.toLowerCase().includes(termo) ||
        curso.descricao?.toLowerCase().includes(termo) ||
        curso.tipo?.toLowerCase().includes(termo) ||
        curso.modalidade?.toLowerCase().includes(termo)
      );
    }

    if (!termo) return true;
    return (
      curso.nome?.toLowerCase().includes(termo) ||
      curso.descricao?.toLowerCase().includes(termo) ||
      curso.tipo?.toLowerCase().includes(termo) ||
      curso.modalidade?.toLowerCase().includes(termo)
    );
  });

  const alternarSelecaoCoordenador = (idCoord) => {
    const numId = Number(idCoord);
    if (Number.isNaN(numId)) return;

    setCoordenadoresSelecionados((prev) =>
      prev.includes(numId)
        ? prev.filter((itemId) => itemId !== numId)
        : [...prev, numId]
    );
  };

  const abrirNovoCurso = async () => {
    setCursoEditando(null);
    setNome('');
    setDescricao('');
    setLink('');
    setIcone('book-outline');
    setTipo('Presencial');
    setModalidade('Graduação');
    setCoordenadorId('');
    setCoordenadoresSelecionados([]);
    setFeedback({ tipo: '', mensagem: '' });

    const coords = await buscarCoordenadoresDoBanco();
    setCoordenadoresDisponiveis(coords || []);

    setModalCurso(true);
  };

  const abrirEdicaoCurso = async (curso) => {
    setCursoEditando(curso);
    setNome(curso.nome || curso.titulo || '');
    setDescricao(curso.descricao || '');
    setLink(curso.link || '');
    setIcone(curso.icone || 'book-outline');
    setTipo(curso.tipo || 'Presencial');
    setModalidade(curso.modalidade || 'Graduação');

    const idsIniciais =
      Array.isArray(curso.coordenadoresIds) && curso.coordenadoresIds.length > 0
        ? curso.coordenadoresIds.map(Number)
        : curso.coordenador_id
          ? [Number(curso.coordenador_id)]
          : [];

    setCoordenadoresSelecionados(idsIniciais);
    setCoordenadorId(idsIniciais[0] ? String(idsIniciais[0]) : '');
    setFeedback({ tipo: '', mensagem: '' });

    const coords = await buscarCoordenadoresDoBanco();
    setCoordenadoresDisponiveis(coords || []);

    setModalCurso(true);
  };

  async function salvarCurso() {
    if (!nome.trim()) {
      setFeedback({ tipo: 'erro', mensagem: 'O título/nome do curso é obrigatório.' });
      return;
    }

    try {
      const coordsParaSalvar = ehCoord
        ? (cursoEditando?.coordenadoresIds?.length
            ? cursoEditando.coordenadoresIds.map(Number)
            : usuarioAtual?.id
              ? [Number(usuarioAtual.id)]
              : [])
        : coordenadoresSelecionados.map(Number);

      const coordPrincipal = coordsParaSalvar.length > 0 ? coordsParaSalvar[0] : null;

      const payload = {
        nome: nome.trim(),
        descricao: descricao.trim() || null,
        link: link.trim() || null,
        icone: icone || 'book-outline',
        tipo: tipo || 'Presencial',
        modalidade: modalidade || 'Graduação',
        coordenador_id: coordPrincipal,
      };

      let cursoSalvo;
      if (cursoEditando) {
        cursoSalvo = await atualizarCursoNoBanco(cursoEditando.id, payload);
      } else {
        cursoSalvo = await criarCursoNoBanco(payload);
      }

      const idCursoAlvo = cursoSalvo?.id ?? cursoEditando?.id;
      let vinculosSalvos = true;

      if (idCursoAlvo && !ehCoord) {
        try {
          await sincronizarCoordenadoresDoCurso(idCursoAlvo, coordsParaSalvar);
        } catch (vinculoError) {
          console.error('Erro ao sincronizar coordenadores do curso:', vinculoError);
          vinculosSalvos = false;
        }
      }

      setModalCurso(false);
      await carregarCursos();

      if (!vinculosSalvos) {
        setToast({
          visible: true,
          nome: 'Atenção',
          mensagem: 'Curso salvo, mas houve erro ao vincular os coordenadores.',
        });
      } else {
        setToast({
          visible: true,
          nome: 'Sucesso',
          mensagem: cursoEditando
            ? 'Curso atualizado com sucesso!'
            : 'Novo curso cadastrado com sucesso!',
        });
      }
    } catch (error) {
      setFeedback({
        tipo: 'erro',
        mensagem: 'Não foi possível salvar o curso no banco de dados.',
      });
    }
  }

  function excluirCurso(curso) {
    setConfirmacao({
      visible: true,
      nome: 'Excluir curso',
      mensagem: `Deseja realmente excluir o curso "${curso.nome}"?`,
      tipo: 'danger',
      onConfirm: async () => {
        setConfirmacao((prev) => ({ ...prev, visible: false }));
        try {
          await removerCursoDoBanco(curso.id);
          setCursos((prev) => prev.filter((c) => c.id !== curso.id));
          setToast({
            visible: true,
            nome: 'Excluído',
            mensagem: 'Curso removido com sucesso.',
          });
        } catch (error) {
          setToast({
            visible: true,
            nome: 'Erro',
            mensagem: 'Não foi possível excluir o curso.',
          });
        }
      },
    });
  }

  return {
    cursos: cursosFiltrados,
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
    coordenadorId,
    setCoordenadorId,
    coordenadoresDisponiveis,
    coordenadoresSelecionados,
    setCoordenadoresSelecionados,
    alternarSelecaoCoordenador,
    feedback,
    toast,
    setToast,
    confirmacao,
    setConfirmacao,
    abrirNovoCurso,
    abrirEdicaoCurso,
    salvarCurso,
    excluirCurso,
    buscarCoordenadoresDoBanco,
  };
}