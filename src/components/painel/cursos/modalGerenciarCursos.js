import { useState } from "react";
import {Linking,Modal,ScrollView,Text,TextInput,TouchableOpacity,View} from "react-native";
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
  coordenadoresDisponiveis,coordenadoresSelecionados, setCoordenadoresSelecionados,alternarSelecaoCoordenador,
  feedback,
  salvarCurso,usuarioAtual,
}) {
  const [modalIconesVisivel, setModalIconesVisivel] = useState(false);
  const [dropdownAberto, setDropdownAberto] = useState(false);

  const perfilNorm = usuarioAtual?.perfil ? usuarioAtual.perfil.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
  const ehCoordenador = perfilNorm.includes("coordenador");
  
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

            {/* 📌 SELEÇÃO DE MÚLTIPLOS COORDENADORES (Apenas para Gerência) */}
            {!ehCoordenador && (
              <View style={styles.campo}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <Text style={[styles.label, { marginBottom: 0 }]}>
                    Coordenadores Responsáveis ({coordenadoresSelecionados.length} selecionado(s))
                  </Text>

                  {coordenadoresSelecionados.length > 0 && setCoordenadoresSelecionados && (
                    <TouchableOpacity onPress={() => setCoordenadoresSelecionados([])}>
                      <Text style={{ fontSize: 12, color: "#DC2626", fontWeight: "600" }}>
                        Limpar
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#CBD5E1",
                    borderRadius: 8,
                    backgroundColor: "#FFFFFF",
                    maxHeight: 175,
                    padding: 6,
                  }}
                >
                  {!coordenadoresDisponiveis || coordenadoresDisponiveis.length === 0 ? (
                    <Text style={{ fontSize: 12.5, color: "#64748B", padding: 10 }}>
                      Nenhum coordenador disponível.
                    </Text>
                  ) : (
                    <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                      {coordenadoresDisponiveis.map((coord) => {
                        const idNum = Number(coord.id);
                        const selecionado = coordenadoresSelecionados.includes(idNum);

                        const handleToggle = () => {
                          if (alternarSelecaoCoordenador) {
                            alternarSelecaoCoordenador(idNum);
                          } else if (setCoordenadoresSelecionados) {
                            setCoordenadoresSelecionados((prev = []) =>
                              prev.includes(idNum)
                                ? prev.filter((item) => item !== idNum)
                                : [...prev, idNum]
                            );
                          }
                        };

                        return (
                          <TouchableOpacity
                            key={coord.id}
                            onPress={handleToggle}
                            activeOpacity={0.75}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              paddingVertical: 9,
                              paddingHorizontal: 10,
                              borderRadius: 6,
                              marginBottom: 4,
                              backgroundColor: selecionado ? "#EFF6FF" : "#F8FAFC",
                              borderWidth: 1,
                              borderColor: selecionado ? "#93C5FD" : "#E2E8F0",
                            }}
                          >
                            <View style={{ flex: 1, marginRight: 8 }}>
                              <Text
                                style={{
                                  fontSize: 13,
                                  fontWeight: selecionado ? "700" : "500",
                                  color: selecionado ? "#173EA5" : "#1E293B",
                                }}
                                numberOfLines={1}
                              >
                                {coord.nome}
                              </Text>
                              {coord.email ? (
                                <Text
                                  style={{ fontSize: 11.5, color: "#64748B" }}
                                  numberOfLines={1}
                                >
                                  {coord.email}
                                </Text>
                              ) : null}
                            </View>

                            <CustomIcon
                              name={selecionado ? "checkbox" : "square-outline"}
                              size={18}
                              color={selecionado ? "#173EA5" : "#94A3B8"}
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  )}
                </View>
              </View>
            )}

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
