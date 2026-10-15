import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StatusBar, Platform } from 'react-native';
import { painelStyles as styles } from '../../styles/painel/painelStyles';
import PainelCadastro from '../painel/painelCadastro'; 

export default function GerenciarUsuarios() {
  // ============================================================
  // ESTADOS PRINCIPAIS
  // ============================================================
  const [usuarios, setUsuarios] = useState([
    {
      id: '1',
      nome: 'Engenharia de Software',
      email: 'ana.coordenacao@estacio.br',
      perfil: 'Coordenador',
      ativo: false,
    },
    {
      id: '2',
      nome: 'Administração',
      email: 'junior.coordenacao@estacio.br',
      perfil: 'Coordenador',
      ativo: false,
    },
    {
      id: '3',
      nome: 'Gerência Acadêmica',
      email: 'mariana.gerencia@estacio.br',
      perfil: 'Gerência Acadêmica',
      ativo: true,
    },
  ]);

  const [pesquisa, setPesquisa] = useState('');

  // ============================================================
  // FORMULÁRIO DE CADASTRO (ESTADOS)
  // ============================================================
  const [modalCadastro, setModalCadastro] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [perfil, setPerfil] = useState('Coordenador');

  // ============================================================
  // FILTRAGEM DE UTILIZADORES
  // ============================================================
  const usuariosFiltrados = useMemo(() => {
    const termo = pesquisa.trim().toLowerCase();
    if (!termo) return usuarios;

    return usuarios.filter(
      usuario =>
        usuario.nome.toLowerCase().includes(termo) ||
        usuario.email.toLowerCase().includes(termo)
    );
  }, [usuarios, pesquisa]);

  // ============================================================
  // FUNÇÕES DE GERENCIAMENTO
  // ============================================================
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

  const criarUsuario = () => {
    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();

    if (!nomeLimpo || !emailLimpo || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha o nome, o e-mail e a senha temporária.');
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpo);
    if (!emailValido) {
      Alert.alert('Atenção', 'Informe um e-mail válido.');
      return;
    }

    const emailExiste = usuarios.some(
      usuario => usuario.email.toLowerCase() === emailLimpo
    );
    if (emailExiste) {
      Alert.alert('E-mail já cadastrado', 'Já existe um utilizador cadastrado com este e-mail.');
      return;
    }

    const novoUsuario = {
      id: `${Date.now()}-${Math.random()}`,
      nome: nomeLimpo,
      email: emailLimpo,
      perfil,
      ativo: true,
    };

    setUsuarios(prev => [novoUsuario, ...prev]);
    fecharCadastro();

    Alert.alert('Utilizador criado', 'O utilizador foi cadastrado e ativado com sucesso.');
  };

  const alternarStatus = id => {
    setUsuarios(prev =>
      prev.map(usuario =>
        usuario.id === id ? { ...usuario, ativo: !usuario.ativo } : usuario
      )
    );
  };

  const removerUsuario = id => {
    const usuario = usuarios.find(item => item.id === id);
    if (!usuario) return;

    const excluir = () => {
      setUsuarios(prev => prev.filter(item => item.id !== id));
    };

    if (Platform.OS === 'web') {
      const confirmou = window.confirm(`Deseja realmente remover ${usuario.nome}?`);
      if (confirmou) excluir();
      return;
    }

    Alert.alert(
      'Remover utilizador',
      `Deseja realmente remover ${usuario.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: excluir },
      ]
    );
  };

  // ============================================================
  // RENDERIZAÇÃO DO ITEM DA LISTA
  // ============================================================
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
          accessibilityRole="button"
          accessibilityLabel={item.ativo ? `Desativar ${item.nome}` : `Ativar ${item.nome}`}
          activeOpacity={0.7}
        >
          <Text style={styles.iconeCadeado}>{item.ativo ? '🔓' : '🔒'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botaoRemover}
          onPress={() => removerUsuario(item.id)}
          accessibilityRole="button"
          accessibilityLabel={`Remover ${item.nome}`}
          activeOpacity={0.7}
        >
          <Text style={styles.iconeLixeira}>🗑</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f4f5f7' }}>
      <FlatList
        data={usuariosFiltrados}
        keyExtractor={item => item.id}
        renderItem={renderUsuario}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View>
            <Text style={styles.tituloPagina}>Gerenciamento de utilizadores</Text>
            <Text style={styles.subtituloPagina}>
              Cadastre, ative, desative ou remova utilizadores do sistema.
            </Text>

            {/* PESQUISA E BOTÃO DE CADASTRO */}
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
                  returnKeyType="search"
                  accessibilityLabel="Pesquisar utilizadores"
                />
                {pesquisa.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setPesquisa('')}
                    style={styles.limparPesquisa}
                    accessibilityLabel="Limpar pesquisa"
                  >
                    <Text style={styles.iconeLimpar}>×</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity style={styles.botaoAdicionar} onPress={() => setModalCadastro(true)} activeOpacity={0.8}
                accessibilityRole="button" accessibilityLabel="Adicionar utilizador"
              >
                <Text style={styles.iconeAdicionar}>+</Text>
              </TouchableOpacity>
            </View>

            {/* CABEÇALHO DA LISTA */}
            <View style={styles.cabecalhoLista}>
              <Text style={styles.tituloLista}>Utilizadores cadastrados</Text>
              <Text style={styles.contador}>
                {usuariosFiltrados.length} de {usuarios.length}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.listaVazia}>
            <Text style={styles.listaVaziaTitulo}>
              {pesquisa ? 'Nenhum resultado encontrado' : 'Nenhum utilizador cadastrado'}
            </Text>
            <Text style={styles.listaVaziaTexto}>
              {pesquisa
                ? 'Tente pesquisar por outro nome ou e-mail.'
                : 'Toque no botão + para cadastrar o primeiro utilizador.'}
            </Text>
          </View>
        }
      />

      {/* COMPONENTE DO MODAL DE CADASTRO */}
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
    </View>
  );
  
}