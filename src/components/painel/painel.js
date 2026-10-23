import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { painelStyles as styles } from '../../styles/painel/painelStyles';
import PainelCadastro from '../painel/painelCadastro'; 
import ConfirmPopup from '../ConfirmPopup'; // 👈 Importa o novo modal de confirmação
import FeedbackBox from '../FeedPopup'; // 👈 Importa o feedback visual
import { buscarUsuariosDoBanco, criarUsuarioNoBanco, removerUsuarioDoBanco } from '../../services/apiServices';

export default function GerenciarUsuarios({ onClose, onLogout }) {
  const [usuarios, setUsuarios] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });

  // Estados dos Modais
  const [modalCadastro, setModalCadastro] = useState(false);
  const [confirmPopup, setConfirmPopup] = useState({
    visible: false,
    titulo: '',
    mensagem: '',
    onConfirm: null,
    tipo: 'danger',
  });

  // Campos do Formulário de Cadastro
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
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

  const solicitarLogout = () => {
    setConfirmPopup({
      visible: true,
      titulo: 'Sair do sistema',
      mensagem: 'Deseja realmente encerrar a sua sessão atual?',
      tipo: 'danger',
      onConfirm: () => {
        setConfirmPopup(prev => ({ ...prev, visible: false }));
        if (onLogout) onLogout();
        else if (onClose) onClose();
      }
    });
  };

  const renderUsuario = ({ item }) => (
    <View style={styles.usuarioCard}>
      <View style={styles.usuarioInfo}>
        <Text style={styles.usuarioNome} numberOfLines={1}>{item.nome}</Text>
        <Text style={styles.usuarioEmail} numberOfLines={1}>{item.email}</Text>
      </View>

      <View style={styles.detalhesUsuario}>
        <View style={styles.perfilBadge}>
          <Text style={styles.perfilTexto} numberOfLines={1}>{item.perfil}</Text>
        </View>

        <View style={[styles.statusBadge, item.ativo ? styles.statusAtivo : styles.statusInativo]}>
          <View style={[styles.statusBolinha, item.ativo ? styles.bolinhaAtiva : styles.bolinhaInativa]} />
          <Text style={[styles.statusTexto, item.ativo ? styles.textoAtivo : styles.textoInativo]}>
            {item.ativo ? 'Ativo' : 'Inativo'}
          </Text>
        </View>
      </View>

      <View style={styles.acoes}>
        <TouchableOpacity
          style={[styles.botaoCadeado, item.ativo ? styles.cadeadoAberto : styles.cadeadoFechado]}
          onPress={() => alternarStatus(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.iconeCadeado}>{item.ativo ? '🔓' : '🔒'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoRemover}
          onPress={() => solicitarRemocao(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.iconeLixeira}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, width: '100%', height: '100%', backgroundColor: '#f4f5f7' }}>
      <FlatList
        data={usuariosFiltrados}
        keyExtractor={item => String(item.id)}
        renderItem={renderUsuario}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <TouchableOpacity 
                onPress={solicitarLogout}
                style={{ backgroundColor: '#fee2e2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
              >
                <Text style={{ color: '#ef4444', fontWeight: 'bold', fontSize: 14 }}>🚪 Sair</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.tituloPagina}>Gerenciamento de utilizadores</Text>
            <Text style={styles.subtituloPagina}>Cadastre, ative, desative ou remova utilizadores do sistema.</Text>

            <FeedbackBox tipo={feedback.tipo} mensagem={feedback.mensagem} />

            <View style={styles.barraPesquisa}>
              <View style={styles.pesquisaContainer}>
                <Text style={styles.iconePesquisa}>⌕</Text>
                <TextInput
                  style={styles.inputPesquisa}
                  placeholder="Pesquisar por nome ou e-mail..."
                  placeholderTextColor="#94a3b8"
                  value={pesquisa}
                  onChangeText={setPesquisa}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {pesquisa.length > 0 && (
                  <TouchableOpacity onPress={() => setPesquisa('')} style={styles.limparPesquisa}>
                    <Text style={styles.iconeLimpar}>×</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity style={styles.botaoAdicionar} onPress={() => setModalCadastro(true)} activeOpacity={0.8}>
                <Text style={styles.iconeAdicionar}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cabecalhoLista}>
              <Text style={styles.tituloLista}>Utilizadores cadastrados</Text>
              <Text style={styles.contador}>{usuariosFiltrados.length} de {usuarios.length}</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.listaVazia}>
            <Text style={styles.listaVaziaTitulo}>
              {pesquisa ? 'Nenhum resultado encontrado' : 'Nenhum utilizador cadastrado'}
            </Text>
            <Text style={styles.listaVaziaTexto}>
              {pesquisa ? 'Tente pesquisar por outro nome ou e-mail.' : 'Toque no botão + para cadastrar o primeiro utilizador.'}
            </Text>
          </View>
        }
      />

      <PainelCadastro 
        visible={modalCadastro} 
        onClose={fecharCadastro} 
        nome={nome} 
        setNome={setNome} 
        email={email} 
        setEmail={setEmail} 
        senha={senha} 
        setSenha={setSenha} 
        perfil={perfil} 
        setPerfil={setPerfil} 
        onCriar={criarUsuario} 
        styles={styles}
      />

      <ConfirmPopup
        visible={confirmPopup.visible}
        titulo={confirmPopup.titulo}
        mensagem={confirmPopup.mensagem}
        tipo={confirmPopup.tipo}
        onConfirm={confirmPopup.onConfirm}
        onCancel={() => setConfirmPopup(prev => ({ ...prev, visible: false }))}
      />
    </View>
  );
}