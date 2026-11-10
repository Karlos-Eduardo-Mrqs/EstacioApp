import { Picker } from "@react-native-picker/picker";
import { Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View, Platform } from "react-native";
import { painelEventosStyles as styles } from "../../../styles/painel/painelEventosStyles";
import { formatarEntradaData, formatarEntradaHora } from "../../../utils/dataUtils";
import FeedbackBox from "../../FeedPopup";
import CustomIcon from "../../CustomIcon";
import BotaoFechar from "../../botaoFechar";

function Campo({ label, style, ...props }) {
  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{label}</Text>
      <TextInput {...props} style={[styles.input, style]} placeholderTextColor="#94A3B8" />
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
  dataApenas, setDataApenas, horaApenas, setHoraApenas,
  solicitarRemocaoImagem,
  descricaoImagem,
  setDescricaoImagem,
  feedback,
  selecionarImagem,
  salvarEvento,
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.modalCabecalho}>
            <Text style={styles.tituloModal}>{eventoEditando ? "Editar evento" : "Novo evento"}</Text>
            <TouchableOpacity onPress={onClose}>
                <BotaoFechar onPress={onClose} />
            </TouchableOpacity>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <FeedbackBox tipo={feedback.tipo} mensagem={feedback.mensagem} />

            <Campo label="Título do evento *" value={titulo} onChangeText={setTitulo} placeholder="Ex.: Workshop de Tecnologia" maxLength={100} />
            
            {/* Bloco de Data e Hora Único e Otimizado */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 2 }}>
                <Campo
                  label="Data *"
                  value={dataApenas}
                  onChangeText={(t) => setDataApenas(formatarEntradaData(t))}
                  placeholder="15/12/2026"
                  keyboardType="numeric"
                  maxLength={10}
                />
              </View>

              <View style={{ flex: 1.2 }}>
                <Campo
                  label="Hora *"
                  value={horaApenas}
                  onChangeText={(t) => setHoraApenas(formatarEntradaHora(t))}
                  placeholder="19:00:00"
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

            {/* 🛑 O status só aparece se estivermos editando um evento existente */}
            {eventoEditando && (
              <View style={styles.campo}>
                <Text style={styles.label}>Status do Evento</Text>
                <View style={{ borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 8, backgroundColor: "#F8FAFC", overflow: "hidden" }}>
                  <Picker 
                    selectedValue={status} 
                    onValueChange={(itemValue) => setStatus(itemValue)} 
                    style={{ height: 48, width: "100%", color: "#0F172A", backgroundColor: "transparent" }}
                  >
                    <Picker.Item label="🟢 Ativo (Aberto / Em andamento)" value={true} />
                    <Picker.Item label="🔴 Encerrado" value={false} />
                  </Picker>
                </View>
              </View>
            )}

            <View style={styles.campo}>
              <Text style={styles.label}>Curso Destinatário *</Text>
              <View style={{ borderWidth: 1, borderColor: "#CBD5E1", borderRadius: 8, backgroundColor: "#F8FAFC", overflow: "hidden" }}>
                <Picker selectedValue={cursoId} onValueChange={(itemValue) => setCursoId(itemValue)} style={{ height: 48, width: "100%", color: "#0F172A", backgroundColor: "transparent" }}>
                  <Picker.Item label="Selecione um curso..." value="" />
                  <Picker.Item label="Todos" value="NULL" />
                  {cursos.map((c) => (
                    <Picker.Item key={c.id} label={c.titulo} value={c.id} />
                  ))}
                </Picker>
              </View>
            </View>

            <Campo label="Descrição do evento" value={descricao} onChangeText={setDescricao} placeholder="Detalhes sobre o evento..." multiline style={styles.inputDescricao} textAlignVertical="top" maxLength={500} />

            <Text style={styles.label}>Imagem de capa</Text>

            {imagem ? (
              <View style={styles.previaContainer}>
                <Image
                  source={{ uri: imagem }}
                  style={{
                    width: '100%',
                    aspectRatio: 16 / 9, // Mantém a proporção exata 16:9
                    borderRadius: 8,
                    backgroundColor: '#F8FAFC',
                  }} 
                  resizeMode="cover" // Corta o excesso sem distorcer
                />
                
                <Campo
                  label="Descrição da imagem (Alt text / Legenda)"
                  value={descricaoImagem}
                  onChangeText={setDescricaoImagem}
                  placeholder="Descreva o conteúdo da imagem"
                  maxLength={200} 
                />
                
                <TouchableOpacity style={styles.removerImagem} onPress={solicitarRemocaoImagem}>
                  <CustomIcon name="trash-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.textoRemoverImagem}>Remover imagem</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.seletorImagem} onPress={selecionarImagem}>
                <CustomIcon name="image-outline" size={34} color="#173EA5" />
                <Text style={styles.textoSeletorImagem}>Selecionar imagem</Text>
                <Text style={styles.textoAuxiliar}>Redimensionamento e compressão automáticos.</Text>
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