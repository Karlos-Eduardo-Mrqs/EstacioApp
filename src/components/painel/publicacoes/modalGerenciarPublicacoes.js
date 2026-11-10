import {Image,Modal,ScrollView,Text,TextInput,TouchableOpacity,View} from "react-native";
import {LISTA_PROPORCOES,obterAspectRatioNumerico} from "../../../constants/proporcoesConstantes";
import { painelEventosStyles as styles } from "../../../styles/painel/painelEventosStyles";
import BotaoFechar from "../../BotaoFechar";
import CustomIcon from "../../CustomIcon";
import FeedbackBox from "../../FeedPopup";

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

export default function ModalGerenciarPublicacao({
  visible,
  onClose,
  publicacaoEditando,
  titulo,
  setTitulo,
  descricao,
  setDescricao,
  imagem,
  proporcao,
  setProporcao,
  selecionarImagem,
  removerImagem,
  salvarPublicacao,
  feedback,
  carregando,
  carregandoImagem,
}) {
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
              {publicacaoEditando ? "Editar publicação" : "Nova publicação"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <BotaoFechar onPress={onClose} />
            </TouchableOpacity>
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <FeedbackBox
              tipo={feedback?.tipo}
              mensagem={feedback?.mensagem}
              onClose={() => {}}
            />

            <Campo
              label="Título da publicação *"
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Ex.: Semana da Tecnologia"
              maxLength={100}
            />

            <Campo
              label="Descrição *"
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Escreva sobre essa publicação..."
              multiline
              style={styles.inputDescricao}
              textAlignVertical="top"
              maxLength={500}
            />

            <Text style={styles.label}>Imagem da publicação *</Text>

            {imagem ? (
              <View style={styles.previaContainer}>
                <Text style={[styles.label, { marginTop: 4, marginBottom: 6 }]}>
                  Formatação da Imagem *
                </Text>

                {/* LISTA DINÂMICA DE PROPORÇÕES */}
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 8,
                    marginBottom: 12,
                  }}
                >
                  {LISTA_PROPORCOES.map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      style={{
                        flexGrow: 1,
                        minWidth: "30%",
                        paddingVertical: 8,
                        paddingHorizontal: 8,
                        borderRadius: 8,
                        backgroundColor:
                          proporcao === item.value ? "#173EA5" : "#F1F5F9",
                        borderWidth: 1,
                        borderColor:
                          proporcao === item.value ? "#173EA5" : "#CBD5E1",
                        alignItems: "center",
                      }}
                      onPress={() => setProporcao(item.value)}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "bold",
                          color:
                            proporcao === item.value ? "#FFFFFF" : "#475569",
                        }}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* PRÉVIA COM PROPORÇÃO DINÂMICA */}
                <View
                  style={{
                    width: "100%",
                    aspectRatio: obterAspectRatioNumerico(proporcao),
                    borderRadius: 8,
                    overflow: "hidden",
                    backgroundColor: "#F8FAFC",
                    marginBottom: 12,
                  }}
                >
                  <Image
                    source={{ uri: imagem }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                </View>

                <TouchableOpacity
                  style={styles.removerImagem}
                  onPress={removerImagem}
                >
                  <CustomIcon name="trash-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.textoRemoverImagem}>Remover imagem</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.seletorImagem}
                  onPress={selecionarImagem}
                  disabled={carregandoImagem}
                >
                  <Text style={styles.textoSeletorImagem}>Trocar imagem</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.seletorImagem}
                onPress={selecionarImagem}
                disabled={carregandoImagem}
              >
                <CustomIcon name="image-outline" size={34} color="#173EA5" />
                <Text style={styles.textoSeletorImagem}>
                  {carregandoImagem ? "Carregando imagem..." : "Selecionar imagem"}
                </Text>
                <Text style={styles.textoAuxiliar}>
                  Escolha uma imagem para salvar no storage.
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.botaoEnviar}
              onPress={salvarPublicacao}
              disabled={carregando || carregandoImagem}
            >
              <CustomIcon name="save-outline" size={19} color="#FFFFFF" />
              <Text style={styles.textoBotaoEnviar}>
                {carregando ? "Salvando..." : "Salvar publicação"}
              </Text>
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