import { useState } from "react";
import {
    Linking,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { painelEventosStyles as styles } from "../../../styles/painel/painelEventosStyles";
import BotaoFechar from "../../BotaoFechar";
import CustomIcon from "../../CustomIcon";
import FeedbackBox from "../../FeedPopup";
import ModalSelecionarIcone from "./modalSelecionarIcone";

function Campo({ label, style, ...props }) {
  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        style={[styles.input, style]}
        placeholderTextColor="#94A3B8"
      />
    </View>
  );
}

export default function ModalGerenciarCurso({
  visible,
  onClose,
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
  feedback,
  salvarCurso,
}) {
  const [modalIconesVisivel, setModalIconesVisivel] = useState(false);
  const [dropdownAberto, setDropdownAberto] = useState(false);

  const buscarLinkCorretoNaWeb = () => {
    if (!nome.trim()) {
      alert("Digite o nome do curso primeiro para pesquisar.");
      return;
    }
    const query = encodeURIComponent(`Estacio ${nome} curso`);
    Linking.openURL(`https://www.google.com/search?q=${query}`);
  };

  const TIPOS_CURSO = ["Presencial", "Online/EAD", "SemiPresencial"];
  const MODALIDADES_CURSO = [
    "Graduação",
    "Mestrado",
    "Doutorado",
    "Técnico",
    "Licenciatura",
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.modalCabecalho}>
            <Text style={styles.tituloModal}>
              {cursoEditando ? "Editar curso" : "Novo curso"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <BotaoFechar onPress={onClose} />
            </TouchableOpacity>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <FeedbackBox tipo={feedback.tipo} mensagem={feedback.mensagem} onClose={() => setFeedback({ tipo: tipo, mensagem: mensagem })} />

            <Campo
              label="Nome / Título do Curso *"
              value={nome}
              onChangeText={setNome}
              placeholder="Ex.: Nutrição ou Ciência da Computação"
              maxLength={100}
            />

            {/* Seletor de Tipo de Curso */}
            <View style={styles.campo}>
              <Text style={styles.label}>Tipo de Ensino *</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {TIPOS_CURSO.map((item) => {
                  const selecionado = tipo === item;
                  return (
                    <TouchableOpacity
                      key={item}
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        paddingHorizontal: 4,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: selecionado ? "#173EA5" : "#CBD5E1",
                        backgroundColor: selecionado ? "#EFF6FF" : "#F8FAFC",
                        alignItems: "center",
                      }}
                      onPress={() => setTipo(item)}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "bold",
                          color: selecionado ? "#173EA5" : "#64748B",
                          textAlign: "center",
                        }}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Seletor de Modalidade */}
            <View style={styles.campo}>
              <Text style={styles.label}>Modalidade Acadêmica *</Text>
              <ScrollView
                horizontal
                showsHorizontalIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {MODALIDADES_CURSO.map((item) => {
                  const selecionado = modalidade === item;
                  return (
                    <TouchableOpacity
                      key={item}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: selecionado ? "#173EA5" : "#CBD5E1",
                        backgroundColor: selecionado ? "#EFF6FF" : "#F8FAFC",
                        alignItems: "center",
                      }}
                      onPress={() => setModalidade(item)}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "bold",
                          color: selecionado ? "#173EA5" : "#64748B",
                          textAlign: "center",
                        }}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Campo de Link Livre com Botões de Ação */}
            <View style={styles.campo}>
              <Text style={styles.label}>Link do Curso (URL)</Text>
              <TextInput
                style={[styles.input, { marginBottom: 8 }]}
                value={link}
                onChangeText={setLink}
                placeholder="Cole o link aqui (https://...)"
                placeholderTextColor="#94A3B8"
                maxLength={300}
                autoCapitalize="none"
              />

              <View style={{ flexDirection: "row", gap: 8 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#F8FAFC", // Fundo clarinho e neutro
                    borderWidth: 1,
                    borderColor: "#CBD5E1", // Borda cinza elegante
                    borderRadius: 6,
                    paddingVertical: 10,
                    gap: 6,
                  }}
                  onPress={buscarLinkCorretoNaWeb}
                  activeOpacity={0.8}
                >
                  <CustomIcon name="search-outline" size={16} color="#1E3A8A" />
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "bold",
                      color: "#1E3A8A",
                    }}
                  >
                    Pesquisar no Google
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 📌 DROPDOWN CUSTOMIZADO DE COORDENADOR CORRIGIDO */}
            <View style={[styles.campo, { zIndex: 9999, elevation: 9999 }]}>
              <Text style={styles.label}>Coordenador Responsável</Text>

              {(() => {
                const coordSelecionado = coordenadoresDisponiveis?.find(
                  (c) => String(c.id) === String(coordenadorId),
                );
                const nomeExibido = coordSelecionado
                  ? `👤 ${coordSelecionado.nome} (${coordSelecionado.email})`
                  : "📌 Nenhum (Geral)";

                return (
                  <View style={{ position: "relative" }}>
                    {/* Botão Principal do Dropdown */}
                    <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        borderColor: "#CBD5E1",
                        borderRadius: 8,
                        backgroundColor: "#FFFFFF",
                        padding: 12,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                      onPress={() => setDropdownAberto(!dropdownAberto)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={{ fontSize: 14, color: "#0F172A", flex: 1 }}
                        numberOfLines={1}
                      >
                        {nomeExibido}
                      </Text>
                      <CustomIcon
                        name={dropdownAberto ? "chevron-up" : "chevron-down"}
                        size={18}
                        color="#64748B"
                      />
                    </TouchableOpacity>

                    {/* Lista Flutuante de Opções com Fundo Sólido */}
                    {dropdownAberto && (
                      <View
                        style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          marginTop: 4,
                          borderWidth: 1,
                          borderColor: "#CBD5E1",
                          borderRadius: 8,
                          backgroundColor: "#FFFFFF",
                          maxHeight: 180,
                          elevation: 10,
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.2,
                          shadowRadius: 6,
                          zIndex: 10000,
                        }}
                      >
                        <ScrollView
                          nestedScrollEnabled
                          showsVerticalScrollIndicator={false}
                        >
                          <TouchableOpacity
                            style={{
                              padding: 12,
                              backgroundColor: !coordenadorId
                                ? "#EFF6FF"
                                : "#FFFFFF",
                              borderBottomWidth: 1,
                              borderBottomColor: "#F1F5F9",
                            }}
                            onPress={() => {
                              setCoordenadorId("");
                              setDropdownAberto(false);
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 14,
                                color: !coordenadorId ? "#173EA5" : "#334155",
                                fontWeight: !coordenadorId ? "bold" : "normal",
                              }}
                            >
                              📌 Nenhum (Geral)
                            </Text>
                          </TouchableOpacity>

                          {coordenadoresDisponiveis?.map((coord) => {
                            const selecionado =
                              String(coordenadorId) === String(coord.id);
                            return (
                              <TouchableOpacity
                                key={coord.id}
                                style={{
                                  padding: 12,
                                  backgroundColor: selecionado
                                    ? "#EFF6FF"
                                    : "#FFFFFF",
                                  borderBottomWidth: 1,
                                  borderBottomColor: "#F1F5F9",
                                }}
                                onPress={() => {
                                  setCoordenadorId(String(coord.id));
                                  setDropdownAberto(false);
                                }}
                              >
                                <Text
                                  style={{
                                    fontSize: 14,
                                    color: selecionado ? "#173EA5" : "#334155",
                                    fontWeight: selecionado ? "bold" : "normal",
                                  }}
                                >
                                  👤 {coord.nome} ({coord.email})
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                      </View>
                    )}
                  </View>
                );
              })()}
            </View>

            {/* Seletor de Ícones */}
            <View style={styles.campo}>
              <Text style={styles.label}>Ícone do Curso</Text>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  padding: 12,
                  borderWidth: 1,
                  borderColor: "#CBD5E1",
                  borderRadius: 8,
                  backgroundColor: "#F8FAFC",
                }}
                onPress={() => setModalIconesVisivel(true)}
              >
                <CustomIcon
                  name={icone || "book-outline"}
                  size={24}
                  color="#173EA5"
                />
                <Text
                  style={{ fontSize: 14, color: "#0F172A", flex: 1 }}
                  numberOfLines={1}
                >
                  {icone || "Selecionar ícone..."}
                </Text>
                <CustomIcon name="chevron-forward" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Campo
              label="Descrição / Detalhes"
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Detalhes ou ementa resumida..."
              multiline
              style={styles.inputDescricao}
              textAlignVertical="top"
              maxLength={500}
            />

            <TouchableOpacity style={styles.botaoEnviar} onPress={salvarCurso}>
              <CustomIcon name="save-outline" size={19} color="#FFFFFF" />
              <Text style={styles.textoBotaoEnviar}>Salvar curso</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoCancelar} onPress={onClose}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      <ModalSelecionarIcone
        visible={modalIconesVisivel}
        onClose={() => setModalIconesVisivel(false)}
        onSelect={(novoIcone) => setIcone(novoIcone)}
      />
    </Modal>
  );
}
