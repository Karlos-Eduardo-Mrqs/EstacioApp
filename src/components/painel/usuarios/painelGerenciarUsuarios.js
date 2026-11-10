// src/components/painel/usuarios/painelGerenciarUsuarios.js
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useGerenciarUsuarios } from "../../../hooks/userGerenciaUsuarios";
import { painelStyles as styles } from "../../../styles/painel/painelStyles";
import ConfirmPopup from "../../ConfirmPopup";
import FeedbackBox from "../../FeedPopup";
import PainelCadastro from "./modalGerenciarUsuarios";
import CustomIcon from "../../CustomIcon";

export default function GerenciarUsuarios() {
  const {
    usuariosFiltrados,
    usuarios,
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
    cursos = [],
    cursoId,
    setCursoId,
    fecharCadastro,
    criarUsuario,
    solicitarAlternarStatus,
    solicitarRemocao,
    limparFormulario
  } = useGerenciarUsuarios();

  // Função auxiliar para encontrar o nome do curso pelo ID
  const obterNomeCurso = (cursoId) => {
    if (!cursoId) return null;
    const cursoEncontrado = cursos.find(c => Number(c.id) === Number(cursoId));
    return cursoEncontrado ? (cursoEncontrado.titulo || cursoEncontrado.nome) : null;
  };

  const renderUsuario = ({ item }) => {
    const nomeCurso = obterNomeCurso(item.curso_id);

    return (
      <View style={[styles.usuarioCard, { paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 }]}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <Text style={[styles.usuarioNome, { fontSize: 15, fontWeight: 'bold', color: '#032551', marginBottom: 4 }]} numberOfLines={1}>
            {item.nome}
          </Text>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <CustomIcon name="mail-outline" size={13} color="#64748B" />
              <Text style={{ fontSize: 12, color: '#64748B' }} numberOfLines={1}>
                {item.email}
              </Text>
            </View>

            {item.telefone ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <CustomIcon name="call-outline" size={13} color="#64748B" />
                <Text style={{ fontSize: 12, color: '#64748B' }} numberOfLines={1}>
                  {item.telefone}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, flex: 1, marginRight: 8 }}>
            {/* Badge de Perfil */}
            <View style={[styles.perfilBadge, { backgroundColor: '#E2E8F0', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }]}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: '#334155' }} numberOfLines={1}>
                {item.perfil}
              </Text>
            </View>

            {/* 📚 Badge do Curso do Coordenador */}
            {nomeCurso ? (
              <View style={{ backgroundColor: '#EEF2FF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <CustomIcon name="school-outline" size={12} color="#4338CA" />
                <Text style={{ fontSize: 11, fontWeight: '600', color: '#4338CA' }} numberOfLines={1}>
                  {nomeCurso}
                </Text>
              </View>
            ) : null}

            {/* Badge de Status */}
            <View
              style={[
                styles.statusBadge,
                { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
                item.ativo ? { backgroundColor: '#DCFCE7' } : { backgroundColor: '#FEE2E2' },
              ]}
            >
              <View
                style={[
                  { width: 6, height: 6, borderRadius: 3 },
                  item.ativo ? { backgroundColor: '#16A34A' } : { backgroundColor: '#DC2626' },
                ]}
              />
              <Text
                style={[
                  { fontSize: 11, fontWeight: '600' },
                  item.ativo ? { color: '#166534' } : { color: '#991B1B' },
                ]}
              >
                {item.ativo ? "Ativo" : "Inativo"}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {/* Botão Editar */}
            <TouchableOpacity
              style={{ backgroundColor: '#E0F2FE', padding: 7, borderRadius: 6, justifyContent: 'center', alignItems: 'center' }}
              onPress={() => abrirEdicaoUsuario(item)}
              activeOpacity={0.7}
            >
              <CustomIcon name="pencil-outline" size={15} color="#0284C7" /> 
            </TouchableOpacity>

            {/* Botão Status (Cadeado/Desbloqueio com ConfirmPopup) */}
            <TouchableOpacity
              style={[
                { padding: 7, borderRadius: 6, justifyContent: 'center', alignItems: 'center' },
                item.ativo ? { backgroundColor: '#FEF3C7' } : { backgroundColor: '#D1FAE5' }
              ]}
              onPress={() => solicitarAlternarStatus(item.id)}
              activeOpacity={0.7}
            >
              <CustomIcon 
                name={item.ativo ? "lock-open-outline" : "lock-closed-outline"} 
                size={15} 
                color={item.ativo ? "#D97706" : "#059669"} 
              />
            </TouchableOpacity>

            {/* Botão Remover */}
            <TouchableOpacity
              style={{ backgroundColor: '#FEE2E2', padding: 7, borderRadius: 6, justifyContent: 'center', alignItems: 'center' }}
              onPress={() => solicitarRemocao(item.id)}
              activeOpacity={0.7}
            >
              <CustomIcon name="trash-outline" size={15} color="#DC2626" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: "#F8FAFC",
        padding: 20,
        borderRadius: 12
      }}
    >
      <FlatList
        data={usuariosFiltrados}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderUsuario}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 24 }}
        ListHeaderComponent={
          <View style={{ marginBottom: 18 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <View>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: "#032551" }}>
                  Gerenciamento de utilizadores
                </Text>
                <Text style={{ fontSize: 13, color: "#64748B", marginTop: 2 }}>
                  Cadastre, edite, ative, desative ou remova utilizadores do sistema.
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: "#032551",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 8,
                }}
                onPress={() => {
                  limparFormulario();
                  setModalCadastro(true);
                }}
                activeOpacity={0.8}
              >
                <CustomIcon name="add" size={18} color="#FFFFFF" />
                <Text style={{ color: "#FFFFFF", fontWeight: "bold", fontSize: 13 }}>
                  Novo utilizador
                </Text>
              </TouchableOpacity>
            </View>

            <FeedbackBox 
              tipo={feedback.tipo} 
              mensagem={feedback.mensagem} 
              onClose={() => setFeedback({ tipo: '', mensagem: '' })} 
            />

            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12 }}>
                <CustomIcon name="search-outline" size={16} color="#94A3B8" />
                <TextInput
                  style={{ flex: 1, height: 42, paddingHorizontal: 8, fontSize: 13, color: '#1E293B', outline: 'none' }}
                  placeholder="Pesquisar por nome ou e-mail..."
                  placeholderTextColor="#94a3b8"
                  value={pesquisa}
                  onChangeText={setPesquisa}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {pesquisa.length > 0 && (
                  <TouchableOpacity onPress={() => setPesquisa("")}>
                    <CustomIcon name="close-circle" size={16} color="#94A3B8" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#334155' }}>Utilizadores cadastrados</Text>
              <Text style={{ fontSize: 12, color: '#64748B', fontWeight: '500' }}>
                {usuariosFiltrados.length} de {usuarios.length}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={{ backgroundColor: '#FFFFFF', padding: 40, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0', marginTop: 10 }}>
            <CustomIcon name="people-outline" size={36} color="#94A3B8" />
            <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#032551', marginTop: 10 }}>
              {pesquisa ? "Nenhum resultado encontrado" : "Nenhum utilizador cadastrado"}
            </Text>
            <Text style={{ fontSize: 12, color: '#64748B', marginTop: 4, textAlign: 'center' }}>
              {pesquisa ? "Tente pesquisar por outro termo." : "Clique no botão 'Novo utilizador' para começar."}
            </Text>
          </View>
        }
      />

      <PainelCadastro
        visible={modalCadastro}
        onClose={fecharCadastro}
        usuarioEditando={usuarioEditando}
        nome={nome}
        setNome={setNome}
        matricula={matricula}
        setMatricula={setMatricula}
        telefone={telefone}
        setTelefone={setTelefone}
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