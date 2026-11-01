import { useEffect, useMemo, useState } from 'react';
import { buscarUsuariosDoBanco, criarUsuarioNoBanco, removerUsuarioDoBanco } from '../services/apiServices';

export function useGerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });

  // Estados dos Modais e Formulário
  const [modalCadastro, setModalCadastro] = useState(false);
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
  const [curso, setCurso] = useState('');
  const [perfil, setPerfil] = useState('Coordenador');

  useEffect(() => {
    carregarUsuarios();
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
    setPerfil('Coordenador');
  };

  const fecharCadastro = () => {
    setModalCadastro(false);
    limparFormulario();
  };

  const criarUsuario = async () => {
    setFeedback({ tipo: '', mensagem: '' });
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();

    if (!nomeLimpo || !emailLimpo || !senha.trim()) {
      setFeedback({ tipo: 'erro', mensagem: 'Preencha o nome, o e-mail e a senha temporária.' });
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo);
    if (!emailValido) {
      setFeedback({ tipo: 'erro', mensagem: 'Informe um e-mail válido.' });
      return;
    }

    try {
      const novoRegistro = {
        nome: nomeLimpo,
        email: emailLimpo,
        senha: senha.trim(),
        perfil,
        matricula: `MAT_${Math.floor(Math.random() * 90000 + 10000)}`,
      };

      const criado = await criarUsuarioNoBanco(novoRegistro);
      setUsuarios(prev => [{ ...criado, ativo: true }, ...prev]);
      fecharCadastro();
      setFeedback({ tipo: 'sucesso', mensagem: 'Utilizador criado e gravado no banco com sucesso!' });
    } catch (error) {
      setFeedback({ tipo: 'erro', mensagem: 'Não foi possível criar o utilizador no Supabase.' });
    }
  };

  const alternarStatus = id => {
    setUsuarios(prev =>
      prev.map(usuario =>
        usuario.id === id ? { ...usuario, ativo: !usuario.ativo } : usuario
      )
    );
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
          await removerUsuarioDoBanco(id);
          setUsuarios(prev => prev.filter(item => item.id !== id));
          setFeedback({ tipo: 'sucesso', mensagem: `Utilizador ${usuario.nome} removido com sucesso.` });
        } catch (error) {
          setFeedback({ tipo: 'erro', mensagem: 'Não foi possível remover o utilizador.' });
        }
      }
    });
  };

  return {
    usuarios,
    usuariosFiltrados,
    pesquisa,
    setPesquisa,
    feedback,
    modalCadastro,
    setModalCadastro,
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
    curso,
    setCurso,

    fecharCadastro,
    criarUsuario,
    alternarStatus,
    solicitarRemocao,
    limparFormulario
  };
}