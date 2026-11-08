import {FlatList,Text,TextInput,TouchableOpacity,View} from "react-native";
import { useGerenciarUsuarios } from "../../hooks/userGerenciaUsuarios";
import { painelStyles as styles } from "../../styles/painel/painelStyles";
import ConfirmPopup from "../ConfirmPopup";
import FeedbackBox from "../FeedPopup";
import PainelCadastro from "./painelCadastro";

export default function GerenciarUsuarios() {
  const {
    usuariosFiltrados,
    usuarios,
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
    cursos = [],
    cursoId,
    setCursoId,
    fecharCadastro,
    criarUsuario,
    alternarStatus,
    solicitarRemocao,
  } = useGerenciarUsuarios();

  const renderUsuario = ({ item }) => (
    <View style={styles.usuarioCard}>
      <View style={styles.usuarioInfo}>
        <Text style={styles.usuarioNome} numberOfLines={1}>
          {item.nome}
        </Text>
        <Text style={styles.usuarioEmail} numberOfLines={1}>
          {item.email}
        </Text>
      </View>

      <View style={styles.detalhesUsuario}>
        <View style={styles.perfilBadge}>
          <Text style={styles.perfilTexto} numberOfLines={1}>
            {item.perfil}
          </Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            item.ativo ? styles.statusAtivo : styles.statusInativo,
          ]}
        >
          <View
            style={[
              styles.statusBolinha,
              item.ativo ? styles.bolinhaAtiva : styles.bolinhaInativa,
            ]}
          />
          <Text
            style={[
              styles.statusTexto,
              item.ativo ? styles.textoAtivo : styles.textoInativo,
            ]}
          >
            {item.ativo ? "Ativo" : "Inativo"}
          </Text>
        </View>
      </View>

      <View style={styles.acoes}>
        <TouchableOpacity
          style={[
            styles.botaoCadeado,
            item.ativo ? styles.cadeadoAberto : styles.cadeadoFechado,
          ]}
          onPress={() => alternarStatus(item.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.iconeCadeado}>{item.ativo ? "🔓" : "🔒"}</Text>
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
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "#f4f5f7",
      }}
    >
      <FlatList
        data={usuariosFiltrados}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderUsuario}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.container}
        ListHeaderComponent={
          <View>
            <Text style={styles.tituloPagina}>
              Gerenciamento de utilizadores
            </Text>
            <Text style={styles.subtituloPagina}>
              Cadastre, ative, desative ou remova utilizadores do sistema.
            </Text>

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
                  autoComplete="off"
                  textContentType="none"
                  importantForAutofill="no"
                />
                {pesquisa.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setPesquisa("")}
                    style={styles.limparPesquisa}
                  >
                    <Text style={styles.iconeLimpar}>×</Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                style={styles.botaoAdicionar}
                onPress={() => {
                  setPesquisa('');
                  setModalCadastro(true);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.iconeAdicionar}>+</Text>
              </TouchableOpacity>
            </View>

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
              {pesquisa
                ? "Nenhum resultado encontrado"
                : "Nenhum utilizador cadastrado"}
            </Text>
            <Text style={styles.listaVaziaTexto}>
              {pesquisa
                ? "Tente pesquisar por outro nome ou e-mail."
                : "Toque no botão + para cadastrar o primeiro utilizador."}
            </Text>
          </View>
        }
      />

      <PainelCadastro
        visible={modalCadastro}
        onClose={fecharCadastro}
        nome={nome}
        setNome={setNome}
        matricula={matricula}
        setMatricula={setMatricula}
        email={email}
        setEmail={setEmail}
        senha={senha}
        setSenha={setSenha}
        perfil={perfil}
        setPerfil={setPerfil}
        cursos={cursos}
        cursoId={cursoId}
        setCursoId={setCursoId}
        onCriar={criarUsuario}
        styles={styles}
      />

      <ConfirmPopup
        visible={confirmPopup.visible}
        titulo={confirmPopup.titulo}
        mensagem={confirmPopup.mensagem}
        tipo={confirmPopup.tipo}
        onConfirm={confirmPopup.onConfirm}
        onCancel={() =>
          setConfirmPopup((prev) => ({ ...prev, visible: false }))
        }
      />
    </View>
  );
}
