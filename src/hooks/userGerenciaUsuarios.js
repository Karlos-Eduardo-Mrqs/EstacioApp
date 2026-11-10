// src/hooks/useGerenciaUsuarios.js
import { useEffect, useMemo, useState } from 'react';
import { 
  buscarUsuariosDoBanco, 
  criarUsuarioNoBanco, 
  removerUsuarioNoBanco, 
  buscarCursosDoBanco, 
  atualizarUsuarioNoBanco 
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
  const [cursoId, setCursoId] = useState(null);
  const [perfil, setPerfil] = useState('Coordenador');

  useEffect(() => {
    carregarUsuarios();
    carregarCursos();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const dados = await buscarUsuariosDoBanco();
      const formatados = dados.map(u => ({
        ...u,
        ativo: u.ativo !== undefined ? u.ativo : true,
      }));
      setUsuarios(formatados);
    } catch (error) {
      setFeedback({ tipo: 'erro', mensagem: 'Não foi possível carregar os utilizadores do banco.' });
    }
  };

  const usuariosFiltrados = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();
    if (!termo) return usuarios;

    return usuarios.filter(
      usuario =>
        (usuario.nome && usuario.nome.toLowerCase().includes(termo)) ||
        (usuario.email && usuario.email.toLowerCase().includes(termo))
    );
  }, [usuarios, pesquisa]);

  const limparFormulario = () => {
    setNome('');
    setEmail('');
    setSenha('');
    setMatricula('');
    setTelefone('');
    setCursoId(null);
    setPerfil('Coordenador');
    setUsuarioEditando(null);
  };

  const fecharCadastro = () => {
    setModalCadastro(false);
    limparFormulario();
  };

  const abrirEdicaoUsuario = (usuario) => {
    setUsuarioEditando(usuario);
    setNome(usuario.nome || '');
    setEmail(usuario.email || '');
    setSenha('');
    setMatricula(usuario.matricula || '');
    setTelefone(usuario.telefone || '');
    setPerfil(usuario.perfil || 'Coordenador');
    setCursoId(usuario.curso_id || null);
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

    if (perfil === 'Coordenador' && cursoId == null) {
      setFeedback({
        tipo: 'erro',
        mensagem: 'Selecione um curso para o coordenador.',
      });
      return;
    }

    try {
      if (usuarioEditando) {
        const dadosAtualizados = {
          nome: nomeLimpo,
          email: emailLimpo,
          perfil,
          matricula: matricula.trim() || usuarioEditando.matricula,
          telefone: telefone.trim() || null,
          curso_id: perfil === 'Coordenador' ? cursoId : null,
        };

        if (senha.trim()) {
          dadosAtualizados.senha = senha.trim();
        }

        const atualizado = await atualizarUsuarioNoBanco(usuarioEditando.id, dadosAtualizados);
        
        setUsuarios(prev =>
          prev.map(u => (u.id === usuarioEditando.id ? { ...u, ...atualizado } : u))
        );
        fecharCadastro();
        setFeedback({ tipo: 'sucesso', mensagem: 'Utilizador atualizado com sucesso!' });
      } else {
        if (!senha.trim()) {
          setFeedback({ tipo: 'erro', mensagem: 'Informe uma senha temporária para o novo utilizador.' });
          return;
        }

        const novoRegistro = {
          nome: nomeLimpo,
          email: emailLimpo,
          senha: senha.trim(),
          perfil,
          matricula: matricula.trim() || `MAT_${Math.floor(Math.random() * 90000 + 10000)}`,
          telefone: telefone.trim() || null,
          curso_id: perfil === 'Coordenador' ? cursoId : null,
          ativo: true,
        };

        const criado = await criarUsuarioNoBanco(novoRegistro);
        setUsuarios(prev => [{ ...criado, ativo: true }, ...prev]);
        fecharCadastro();
        setFeedback({ tipo: 'sucesso', mensagem: 'Utilizador criado e gravado no banco com sucesso!' });
      }
    } catch (error) {
      setFeedback({ tipo: 'erro', mensagem: 'Não foi possível salvar o utilizador no banco.' });
    }
  };

  // 🔒 Solicita confirmação antes de alterar o status
  const solicitarAlternarStatus = (id) => {
    const usuarioAlvo = usuarios.find(u => u.id === id);
    if (!usuarioAlvo) return;

    const novoStatus = !usuarioAlvo.ativo;
    const acaoTexto = novoStatus ? "ativar" : "desativar";

    setConfirmPopup({
      visible: true,
      titulo: `${novoStatus ? "Ativar" : "Desativar"} utilizador`,
      mensagem: `Deseja realmente ${acaoTexto} o acesso de ${usuarioAlvo.nome}?`,
      tipo: novoStatus ? "success" : "danger",
      onConfirm: async () => {
        setConfirmPopup(prev => ({ ...prev, visible: false }));
        try {
          await atualizarUsuarioNoBanco(id, { ativo: novoStatus });
          setUsuarios(prev =>
            prev.map(usuario =>
              usuario.id === id ? { ...usuario, ativo: novoStatus } : usuario
            )
          );
          setFeedback({ tipo: 'sucesso', mensagem: `Utilizador ${usuarioAlvo.nome} foi ${novoStatus ? 'ativado' : 'desativado'}.` });
        } catch (error) {
          setFeedback({ tipo: 'erro', mensagem: 'Não foi possível alterar o status do utilizador.' });
        }
      }
    });
  };

  const solicitarRemocao = id => {
    const usuario = usuarios.find(item => item.id === id);
    if (!usuario) return;

    setConfirmPopup({
      visible: true,
      titulo: 'Remover utilizador',
      mensagem: `Deseja realmente remover o utilizador ${usuario.nome}? Esta ação não pode ser desfeita.`,
      tipo: 'danger',
      onConfirm: async () => {
        setConfirmPopup(prev => ({ ...prev, visible: false }));
        try {
          await removerUsuarioNoBanco(id);
          setUsuarios(prev => prev.filter(item => item.id !== id));
          setFeedback({ tipo: 'sucesso', mensagem: `Utilizador ${usuario.nome} removido com sucesso.` });
        } catch (error) {
          setFeedback({ tipo: 'erro', mensagem: 'Não foi possível remover o utilizador.' });
        }
      }
    });
  };

  const carregarCursos = async () => {
    try {
      const dados = await buscarCursosDoBanco();
      setCursos(dados);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      setFeedback({
        tipo: 'erro',
        mensagem: 'Não foi possível carregar os cursos do banco.',
      });
    }
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
    cursoId,
    setCursoId,
    fecharCadastro,
    criarUsuario: salvarUsuario,
    solicitarAlternarStatus,
    solicitarRemocao,
    limparFormulario
  };
}