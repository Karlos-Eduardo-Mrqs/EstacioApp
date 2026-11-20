import { useEffect, useMemo, useState } from 'react';
import {
  buscarUsuariosDoBanco,
  criarUsuarioNoBanco,
  removerUsuarioNoBanco,
  buscarCursosDoBanco,
  atualizarUsuarioNoBanco,
  buscarCursosDoCoordenadorNoBanco,
  buscarTodosVinculosCoordenadorCurso,
  sincronizarCursosDoCoordenador,
} from '../services/usuarioServices';

export function useGerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });

  const [modalCadastro, setModalCadastro] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const [confirmPopup, setConfirmPopup] = useState({
    visible: false,
    titulo: '',
    mensagem: '',
    onConfirm: null,
    tipo: 'danger',
  });

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [matricula, setMatricula] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cursos, setCursos] = useState([]);
  const [cursosSelecionados, setCursosSelecionados] = useState([]);
  const [perfil, setPerfil] = useState('Coordenador');

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const carregarCursos = async () => {
    try {
      const dados = await buscarCursosDoBanco();
      setCursos(dados || []);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      setFeedback({
        tipo: 'erro',
        mensagem: 'Não foi possível carregar os cursos do banco.',
      });
    }
  };

  const carregarUsuarios = async () => {
    let vinculosFalharam = false;

    try {
      const [dados, vinculos] = await Promise.all([
        buscarUsuariosDoBanco(),
        buscarTodosVinculosCoordenadorCurso().catch((err) => {
          console.error('Erro ao buscar vínculos de coordenador_curso:', err);
          vinculosFalharam = true;
          return [];
        }),
      ]);

      const mapaCursosPorCoord = (vinculos || []).reduce((acc, row) => {
        const coordKey = String(row.coordenador_id);
        if (!acc[coordKey]) acc[coordKey] = [];
        acc[coordKey].push(Number(row.curso_id));
        return acc;
      }, {});

      const formatados = (dados || []).map((u) => {
        const idsDaTabela = mapaCursosPorCoord[String(u.id)];
        const fallbackIds = u.curso_id ? [Number(u.curso_id)] : [];
        const cursosIds = idsDaTabela ?? fallbackIds;

        return {
          ...u,
          ativo: u.ativo !== undefined ? u.ativo : true,
          cursos_ids: cursosIds,
        };
      });

      setUsuarios(formatados);

      if (vinculosFalharam && formatados.length > 0) {
        setFeedback({
          tipo: 'aviso',
          mensagem:
            'Usuários carregados, mas não foi possível consultar os vínculos de cursos no momento.',
        });
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setFeedback({
        tipo: 'erro',
        mensagem: 'Não foi possível carregar os usuarios do banco.',
      });
    }
  };

  const carregarDadosIniciais = async () => {
    await Promise.all([carregarUsuarios(), carregarCursos()]);
  };

  const usuariosFiltrados = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();
    if (!termo) return usuarios;

    return usuarios.filter(
      (usuario) =>
        (usuario.nome && usuario.nome.toLowerCase().includes(termo)) ||
        (usuario.email && usuario.email.toLowerCase().includes(termo))
    );
  }, [usuarios, pesquisa]);

  const alternarSelecaoCurso = (idCurso) => {
    const numId = Number(idCurso);
    setCursosSelecionados((prev) =>
      prev.includes(numId)
        ? prev.filter((itemId) => itemId !== numId)
        : [...prev, numId]
    );
  };

  const limparFormulario = () => {
    setNome('');
    setEmail('');
    setSenha('');
    setMatricula('');
    setTelefone('');
    setCursosSelecionados([]);
    setPerfil('Coordenador');
    setUsuarioEditando(null);
  };

  const fecharCadastro = () => {
    setModalCadastro(false);
    limparFormulario();
  };

  const abrirEdicaoUsuario = async (usuario) => {
    setFeedback({ tipo: '', mensagem: '' });
    setUsuarioEditando(usuario);
    setNome(usuario.nome || '');
    setEmail(usuario.email || '');
    setSenha('');
    setMatricula(usuario.matricula || '');
    setTelefone(usuario.telefone || '');
    setPerfil(usuario.perfil || 'Coordenador');

    try {
      const idsBanco = await buscarCursosDoCoordenadorNoBanco(usuario.id);
      if (idsBanco.length > 0) {
        setCursosSelecionados(idsBanco);
      } else if (Array.isArray(usuario.cursos_ids) && usuario.cursos_ids.length > 0) {
        setCursosSelecionados(usuario.cursos_ids.map(Number));
      } else if (usuario.curso_id) {
        setCursosSelecionados([Number(usuario.curso_id)]);
      } else {
        setCursosSelecionados([]);
      }
    } catch (error) {
      console.error('Erro ao carregar cursos do coordenador na edição:', error);
      setCursosSelecionados(
        Array.isArray(usuario.cursos_ids)
          ? usuario.cursos_ids.map(Number)
          : usuario.curso_id
            ? [Number(usuario.curso_id)]
            : []
      );
      setFeedback({
        tipo: 'aviso',
        mensagem:
          'Dados carregados, mas houve falha ao buscar os cursos vinculados. Verifique a seleção antes de salvar.',
      });
    }

    setModalCadastro(true);
  };

  const salvarUsuario = async () => {
    setFeedback({ tipo: '', mensagem: '' });
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();

    if (!nomeLimpo || !emailLimpo) {
      setFeedback({ tipo: 'erro', mensagem: 'Preencha o nome e o e-mail.' });
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo);
    if (!emailValido) {
      setFeedback({ tipo: 'erro', mensagem: 'Informe um e-mail válido.' });
      return;
    }

    if (perfil === 'Coordenador' && cursosSelecionados.length === 0) {
      setFeedback({
        tipo: 'erro',
        mensagem: 'Selecione pelo menos um curso para o coordenador.',
      });
      return;
    }

    const idsParaSalvar = perfil === 'Coordenador' ? cursosSelecionados : [];

    try {
      if (usuarioEditando) {
        const dadosAtualizados = {
          nome: nomeLimpo,
          email: emailLimpo,
          perfil,
          matricula: matricula.trim() || usuarioEditando.matricula,
          telefone: telefone.trim() || null,
        };

        if (senha.trim()) {
          dadosAtualizados.senha = senha.trim();
        }

        const atualizado = await atualizarUsuarioNoBanco(usuarioEditando.id, dadosAtualizados);

        let cursosSincronizados = true;
        try {
          await sincronizarCursosDoCoordenador(usuarioEditando.id, idsParaSalvar);
        } catch (vinculoError) {
          console.error('Erro ao sincronizar cursos na edição:', vinculoError);
          cursosSincronizados = false;
        }

        setUsuarios((prev) =>
          prev.map((u) =>
            u.id === usuarioEditando.id
              ? {
                  ...u,
                  ...atualizado,
                  cursos_ids: cursosSincronizados ? idsParaSalvar : (u.cursos_ids || []),
                }
              : u
          )
        );

        fecharCadastro();

        if (!cursosSincronizados && perfil === 'Coordenador') {
          setFeedback({
            tipo: 'aviso',
            mensagem:
              'Usuário atualizado com sucesso, porém ocorreu um erro ao vincular os cursos. Abra a edição novamente para tentar vincular.',
          });
        } else {
          setFeedback({ tipo: 'sucesso', mensagem: 'Usuario atualizado com sucesso!' });
        }
      } else {
        if (!senha.trim()) {
          setFeedback({
            tipo: 'erro',
            mensagem: 'Informe uma senha temporária para o novo usuario.',
          });
          return;
        }

        const novoRegistro = {
          nome: nomeLimpo,
          email: emailLimpo,
          senha: senha.trim(),
          perfil,
          matricula: matricula.trim() || `MAT_${Math.floor(Math.random() * 90000 + 10000)}`,
          telefone: telefone.trim() || null,
          ativo: true,
        };

        const criado = await criarUsuarioNoBanco(novoRegistro);

        let cursosSincronizados = true;
        if (criado?.id && perfil === 'Coordenador') {
          try {
            await sincronizarCursosDoCoordenador(criado.id, idsParaSalvar);
          } catch (vinculoError) {
            console.error('Erro ao vincular cursos no cadastro:', vinculoError);
            cursosSincronizados = false;
          }
        }

        setUsuarios((prev) => [
          {
            ...criado,
            ativo: true,
            cursos_ids: cursosSincronizados ? idsParaSalvar : [],
          },
          ...prev,
        ]);

        fecharCadastro();

        if (!cursosSincronizados && perfil === 'Coordenador') {
          setFeedback({
            tipo: 'aviso',
            mensagem:
              'Coordenador criado com sucesso, mas houve erro ao vincular os cursos. Você pode editar o coordenador para vincular os cursos novamente.',
          });
        } else {
          setFeedback({
            tipo: 'sucesso',
            mensagem: 'Usuario criado e gravado no banco com sucesso!',
          });
        }
      }
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      setFeedback({
        tipo: 'erro',
        mensagem: 'Não foi possível salvar o usuario no banco.',
      });
    }
  };

  const solicitarAlternarStatus = (id) => {
    const usuarioAlvo = usuarios.find((u) => u.id === id);
    if (!usuarioAlvo) return;

    const novoStatus = !usuarioAlvo.ativo;
    const acaoTexto = novoStatus ? 'ativar' : 'desativar';

    setConfirmPopup({
      visible: true,
      titulo: `${novoStatus ? 'Ativar' : 'Desativar'} usuario`,
      mensagem: `Deseja realmente ${acaoTexto} o acesso de ${usuarioAlvo.nome}?`,
      tipo: novoStatus ? 'success' : 'danger',
      onConfirm: async () => {
        setConfirmPopup((prev) => ({ ...prev, visible: false }));
        try {
          await atualizarUsuarioNoBanco(id, { ativo: novoStatus });
          setUsuarios((prev) =>
            prev.map((usuario) =>
              usuario.id === id ? { ...usuario, ativo: novoStatus } : usuario
            )
          );
          setFeedback({
            tipo: 'sucesso',
            mensagem: `Usuario ${usuarioAlvo.nome} foi ${novoStatus ? 'ativado' : 'desativado'}.`,
          });
        } catch (error) {
          setFeedback({ tipo: 'erro', mensagem: 'Não foi possível alterar o status do usuario.' });
        }
      },
    });
  };

  const solicitarRemocao = (id) => {
    const usuario = usuarios.find((item) => item.id === id);
    if (!usuario) return;

    setConfirmPopup({
      visible: true,
      titulo: 'Remover usuario',
      mensagem: `Deseja realmente remover o usuario ${usuario.nome}? Esta ação não pode ser desfeita.`,
      tipo: 'danger',
      onConfirm: async () => {
        setConfirmPopup((prev) => ({ ...prev, visible: false }));
        try {
          await removerUsuarioNoBanco(id);
          setUsuarios((prev) => prev.filter((item) => item.id !== id));
          setFeedback({ tipo: 'sucesso', mensagem: `Usuario ${usuario.nome} removido com sucesso.` });
        } catch (error) {
          setFeedback({ tipo: 'erro', mensagem: 'Não foi possível remover o usuario.' });
        }
      },
    });
  };

  return {
    usuarios,
    usuariosFiltrados,
    pesquisa,
    setPesquisa,
    feedback,
    setFeedback,
    modalCadastro,
    setModalCadastro,
    usuarioEditando,
    abrirEdicaoUsuario,
    confirmPopup,
    setConfirmPopup,
    nome,
    setNome,
    email,
    setEmail,
    senha,
    setSenha,
    perfil,
    setPerfil,
    matricula,
    setMatricula,
    telefone,
    setTelefone,
    cursos,
    cursosSelecionados,
    setCursosSelecionados,
    alternarSelecaoCurso,
    limparFormulario,
    fecharCadastro,
    criarUsuario: salvarUsuario,
    solicitarAlternarStatus,
    solicitarRemocao,
  };
}