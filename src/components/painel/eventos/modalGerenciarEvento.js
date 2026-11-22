import { Picker } from "@react-native-picker/picker";
import {Image,Modal,ScrollView,Text,TextInput,TouchableOpacity,View} from "react-native";
import {LISTA_PROPORCOES,obterAspectRatioNumerico} from "../../../constants/proporcoesConstantes";
import { painelEventosStyles as styles } from "../../../styles/painel/painelEventosStyles";
import {formatarEntradaData,formatarEntradaHora} from "../../../utils/dataUtils";
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

export default function ModalGerenciarEvento({
  visible,
  onClose,
  eventoEditando,
  titulo,
  setTitulo,
  dataTexto,
  setDataTexto,
  palestrante,
  setPalestrante,
  local,
  setLocal,
  horasAAC,
  setHorasAAC,
  cursos,
  cursoId,
  setCursoId,
  descricao,
  setDescricao,
  imagem,
  setImagem,
  status,
  setStatus,
  proporcao,
  setProporcao,
  linkTransmissao,
  setLinkTransmissao,
  possuiEventos,
  setPossuiEventos,
  limiteVagas,
  setLimiteVagas,
  dataApenas,
  setDataApenas,
  horaApenas,
  setHoraApenas,
  dataFimApenas,
  setDataFimApenas,
  horaFimApenas,
  setHoraFimApenas,
  solicitarRemocaoImagem,
  descricaoImagem,
  setDescricaoImagem,
  feedback,
  setFeedback,
  selecionarImagem,
  salvarEvento,
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
              {eventoEditando ? "Editar evento" : "Novo evento"}
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
              onClose={() => setFeedback?.({ tipo: '', mensagem: '' })}
            />

            <Campo
              label="Título do evento *"
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Ex.: Workshop de Tecnologia"
              maxLength={100}
            />

            {/* Data e Hora de Início */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 2 }}>
                <Campo
                  label="Data de início *"
                  value={dataApenas}
                  onChangeText={(t) => setDataApenas(formatarEntradaData(t))}
                  placeholder="28/11/2026"
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>

              <View style={{ flex: 1.2 }}>
                <Campo
                  label="Hora de início *"
                  value={horaApenas}
                  onChangeText={(t) => setHoraApenas(formatarEntradaHora(t))}
                  placeholder="19:00:00"
                  keyboardType="numeric"
                  maxLength={8}
                />
              </View>
            </View>

            {/* Data e Hora de Fim (Opcional) */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 2 }}>
                <Campo
                  label="Data de fim (Opcional)"
                  value={dataFimApenas}
                  onChangeText={(t) => setDataFimApenas(formatarEntradaData(t))}
                  placeholder="03/12/2026"
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>

              <View style={{ flex: 1.2 }}>
                <Campo
                  label="Hora de fim (Opcional)"
                  value={horaFimApenas}
                  onChangeText={(t) => setHoraFimApenas(formatarEntradaHora(t))}
                  placeholder="21:00:00"
                  keyboardType="numeric"
                  maxLength={8}
                />
              </View>
            </View>

            <Campo
              label="Palestrante / Responsável"
              value={palestrante}
              onChangeText={setPalestrante}
              placeholder="Ex.: Prof. Carlos"
              maxLength={100}
            />

            <Campo
              label="Local do Evento *"
              value={local}
              onChangeText={setLocal}
              placeholder="Ex.: Auditório"
              maxLength={100}
            />

            <Campo
              label="Horas AAC"
              value={horasAAC}
              onChangeText={setHorasAAC}
              placeholder="Ex.: 10"
              keyboardType="numeric"
              maxLength={3}
            />

            {/* Habilitar inscrições (bool true / false) */}
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                paddingVertical: 12,
                paddingHorizontal: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: possuiEventos ? "#173EA5" : "#CBD5E1",
                backgroundColor: possuiEventos ? "#EFF6FF" : "#F8FAFC",
                marginBottom: possuiEventos ? 12 : 16,
              }}
              onPress={() => {
                const proximo = !possuiEventos;
                setPossuiEventos(proximo);
                if (!proximo) {
                  setLimiteVagas("");
                }
              }}
              activeOpacity={0.75}
            >
              <CustomIcon
                name={possuiEventos ? "checkbox" : "square-outline"}
                size={22}
                color="#173EA5"
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13.5, fontWeight: "700", color: "#0F172A" }}>
                  Habilitar inscrições para este evento
                </Text>
                <Text style={{ fontSize: 11.5, color: "#64748B", marginTop: 2 }}>
                  {possuiEventos
                    ? "Ativado"
                    : "Desativado"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Quantidade máxima de inscritos (opcional, só aparece se habilitado) */}
            {possuiEventos && (
              <Campo
                label="Quantidade máxima de inscritos *"
                value={limiteVagas}
                onChangeText={setLimiteVagas}
                placeholder="Ex.: 50 (vazio = sem limite)"
                keyboardType="numeric"
                maxLength={5}
              />
            )}

            {eventoEditando && (
              <View style={styles.campo}>
                <Text style={styles.label}>Status do Evento</Text>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#CBD5E1",
                    borderRadius: 8,
                    backgroundColor: "#F8FAFC",
                    overflow: "hidden",
                  }}
                >
                  <Picker
                    selectedValue={status}
                    onValueChange={(itemValue) => setStatus(itemValue)}
                    style={{
                      height: 48,
                      width: "100%",
                      color: "#0F172A",
                      backgroundColor: "transparent",
                    }}
                  >
                    <Picker.Item
                      label="🟢 Ativo (Aberto / Em andamento)"
                      value={true}
                    />
                    <Picker.Item label="🔴 Encerrado" value={false} />
                  </Picker>
                </View>
              </View>
            )}

            <View style={styles.campo}>
              <Text style={styles.label}>Curso Destinatário *</Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#CBD5E1",
                  borderRadius: 8,
                  backgroundColor: "#F8FAFC",
                  overflow: "hidden",
                }}
              >
                <Picker
                  selectedValue={
                    cursoId === null || cursoId === undefined
                      ? ""
                      : String(cursoId)
                  }
                  onValueChange={(itemValue) => {
                    if (itemValue === "") {
                      setCursoId("");
                    } else if (itemValue === "NULL") {
                      setCursoId("NULL");
                    } else {
                      setCursoId(Number(itemValue));
                    }
                  }}
                  style={{
                    height: 48,
                    width: "100%",
                    color: "#0F172A",
                    backgroundColor: "transparent",
                  }}
                >
                  <Picker.Item label="Selecione um curso..." value="" />
                  <Picker.Item label="Todos" value="NULL" />
                  {cursos.map((c) => (
                    <Picker.Item key={c.id} label={c.titulo} value={String(c.id)} />
                  ))}
                </Picker>
              </View>
            </View>

            <Campo
              label="Descrição do evento"
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Detalhes sobre o evento..."
              multiline
              style={styles.inputDescricao}
              textAlignVertical="top"
              maxLength={500}
            />

            <Campo
              label="Link de Transmissão / Vídeo Chamada (Opcional)"
              value={linkTransmissao}
              onChangeText={setLinkTransmissao}
              placeholder="Ex.: https://meet.google.com/abc-defg-hij"
              autoCapitalize="none"
              keyboardType="url"
              maxLength={300}
            />

            <Text style={styles.label}>Imagem de capa</Text>

            {imagem ? (
              <View style={styles.previaContainer}>
                <Text style={[styles.label, { marginTop: 4, marginBottom: 6 }]}>
                  Formatação da Imagem *
                </Text>

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

                <View
                  style={{
                    width: "100%",
                    aspectRatio: obterAspectRatioNumerico(proporcao),
                    borderRadius: 8,
                    overflow: "hidden",
                    backgroundColor: "#F8FAFC",
                  }}
                >
                  <Image
                    source={{ uri: imagem }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                </View>

                <Campo
                  label="Descrição da imagem (Alt text / Legenda)"
                  value={descricaoImagem}
                  onChangeText={setDescricaoImagem}
                  placeholder="Descreva o conteúdo da imagem"
                  maxLength={200}
                />

                <TouchableOpacity
                  style={styles.removerImagem}
                  onPress={solicitarRemocaoImagem}
                >
                  <CustomIcon name="trash-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.textoRemoverImagem}>Remover imagem</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.seletorImagem}
                onPress={selecionarImagem}
              >
                <CustomIcon name="image-outline" size={34} color="#173EA5" />
                <Text style={styles.textoSeletorImagem}>Selecionar imagem</Text>
                <Text style={styles.textoAuxiliar}>
                  Escolha uma imagem para salvar na base de dados.
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.botaoEnviar} onPress={salvarEvento}>
              <CustomIcon name="save-outline" size={19} color="#FFFFFF" />
              <Text style={styles.textoBotaoEnviar}>Salvar evento</Text>
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