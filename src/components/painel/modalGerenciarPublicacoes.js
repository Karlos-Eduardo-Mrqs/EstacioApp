import {
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform
} from "react-native";

import { painelEventosStyles as styles } from "../../styles/painel/painelEventosStyles";
import FeedbackBox from "../FeedPopup";
import CustomIcon from "../CustomIcon";
import EditorImagemPublicacao from './editorImagemPublicacao';

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
    confirmarRecorte,
    imagemOriginal,
    editorAberto,
    setEditorAberto,
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
              {publicacaoEditando
                ? "Editar publicação"
                : "Nova publicação"}
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
            {editorAberto ? (
                <EditorImagemPublicacao
                imagem={imagemOriginal}
                onCancelar={() => setEditorAberto(false)}
                onConfirmar={confirmarRecorte}
                />
            ) : (
                <>
                <FeedbackBox
                    tipo={feedback?.tipo}
                    mensagem={feedback?.mensagem}
                    onClose={() => setFeedback({ tipo: feedback.tipo, mensagem: feedback.mensagem })}
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

                <Text style={styles.label}>
                    Imagem da publicação *
                </Text>

                {imagem ? (
                    <View style={styles.previaContainer}>
                    <View
                        style={{
                        width: "100%",
                        aspectRatio: 4 / 5,
                        backgroundColor: "#F1F5F9",
                        borderRadius: 8,
                        overflow: "hidden"
                        }}
                    >
                        <Image
                        source={{ uri: imagem }}
                        style={{
                            width: "100%",
                            height: "100%"
                        }}
                        resizeMode="contain"
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.removerImagem}
                        onPress={removerImagem}
                    >
                        <CustomIcon
                        name="trash-outline"
                        size={18}
                        color="#FFFFFF"
                        />

                        <Text style={styles.textoRemoverImagem}>
                        Remover imagem
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.seletorImagem}
                        onPress={selecionarImagem}
                        disabled={carregandoImagem}
                    >
                        <Text style={styles.textoSeletorImagem}>
                        Trocar imagem
                        </Text>
                    </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity
                    style={styles.seletorImagem}
                    onPress={selecionarImagem}
                    disabled={carregandoImagem}
                    >
                    <CustomIcon
                        name="image-outline"
                        size={34}
                        color="#173EA5"
                    />

                    <Text style={styles.textoSeletorImagem}>
                        {carregandoImagem
                        ? "Preparando imagem..."
                        : "Selecionar imagem"}
                    </Text>

                    <Text style={styles.textoAuxiliar}>
                        Formato recomendado: 4:5 (1080 × 1350).
                        A imagem poderá ser ajustada antes da publicação.
                    </Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.botaoEnviar}
                    onPress={salvarPublicacao}
                    disabled={carregando || carregandoImagem}
                >
                    <CustomIcon
                    name="save-outline"
                    size={19}
                    color="#FFFFFF"
                    />

                    <Text style={styles.textoBotaoEnviar}>
                    {carregando
                        ? "Salvando..."
                        : "Salvar publicação"}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botaoCancelar}
                    onPress={onClose}
                >
                    <Text style={styles.textoCancelar}>
                    Cancelar
                    </Text>
                </TouchableOpacity>
                </>
            )}
            </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
