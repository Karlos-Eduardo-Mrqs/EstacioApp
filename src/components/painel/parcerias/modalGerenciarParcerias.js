import {
    Image,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { obterIconeDaWeb } from "../../../services/parceriaServices"; // 👈 Sobe duas pastas (painel -> components -> services)
import { painelEventosStyles as styles } from "../../../styles/painel/painelEventosStyles"; // 👈 Sobe duas pastas (painel -> components -> styles)
import CustomIcon from "../../CustomIcon";
import FeedbackBox from "../../FeedPopup"; // 👈 Sobe uma pasta (painel -> components)

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

export default function ModalGerenciarParceria({
  visible,
  onClose,
  parceriaEditando,
  titulo,
  setTitulo,
  descricao,
  setDescricao,
  link,
  setLink,
  duracao,
  setDuracao,
  desconto,
  setDesconto,
  feedback,
  salvarParceria,
}) {
  // 👈 Gerador do ícone otimizado da web com base no link digitado
  const iconeGerado = obterIconeDaWeb(link);

  // Máscara automática de data DD/MM/AAAA
  const handleDataChange = (texto) => {
    const limpo = texto.replace(/\D/g, "");
    let formatado = limpo;

    if (limpo.length > 2 && limpo.length <= 4) {
      formatado = `${limpo.slice(0, 2)}/${limpo.slice(2)}`;
    } else if (limpo.length > 4) {
      formatado = `${limpo.slice(0, 2)}/${limpo.slice(2, 4)}/${limpo.slice(4, 8)}`;
    }

    setDuracao(formatado);
  };

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
              {parceriaEditando ? "Editar parceria" : "Nova parceria"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <CustomIcon
                name={Platform.OS === "web" ? "close" : "arrow-back"}
                size={24}
                color="#64748B"
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <FeedbackBox tipo={feedback.tipo} mensagem={feedback.mensagem} />

            <Campo
              label="Nome da Empresa / Parceiro *"
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Ex.: Livraria Cultura"
              maxLength={100}
            />

            <Campo
              label="Porcentagem de Desconto / Benefício"
              value={desconto}
              onChangeText={setDesconto}
              placeholder="Ex.: 20% OFF ou Frete Grátis"
              maxLength={50}
            />

            {/* Campo formatado no padrão DD/MM/AAAA */}
            <Campo
              label="Data Limite de Duração (DD/MM/AAAA) *"
              value={duracao}
              onChangeText={handleDataChange}
              placeholder="Ex.: 31/12/2026"
              keyboardType="numeric"
              maxLength={10}
            />

            <Campo
              label="Link do Cupom / Site Parceiro"
              value={link}
              onChangeText={setLink}
              placeholder="https://parceiro.com.br"
              maxLength={200}
            />

            {/* ── PRÉ-VISUALIZAÇÃO COM ÍCONE PEQUENO (24x24) ── */}
            {link ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 13,
                  gap: 8,
                  backgroundColor: "#F8FAFC",
                  padding: 8,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                }}
              >
                <Image
                  source={{ uri: iconeGerado }}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 4,
                    backgroundColor: "#fff",
                  }}
                  resizeMode="contain"
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "bold",
                      color: "#172554",
                    }}
                  >
                    Favicon Otimizado da Web
                  </Text>
                  <Text
                    style={{ fontSize: 10, color: "#64748B" }}
                    numberOfLines={1}
                  >
                    Ícone reduzido capturado automaticamente.
                  </Text>
                </View>
              </View>
            ) : null}

            <Campo
              label="Descrição / Regras da Parceria"
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Detalhes sobre a parceria ou cupom..."
              multiline
              style={styles.inputDescricao}
              textAlignVertical="top"
              maxLength={500}
            />

            <TouchableOpacity
              style={styles.botaoEnviar}
              onPress={salvarParceria}
            >
              <CustomIcon name="save-outline" size={19} color="#FFFFFF" />
              <Text style={styles.textoBotaoEnviar}>Salvar parceria</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoCancelar} onPress={onClose}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
