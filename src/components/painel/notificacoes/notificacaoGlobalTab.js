import { ScrollView, Text, View, Modal, FlatList, TouchableOpacity } from "react-native";
import { useNotificacaoGlobal } from "../../../hooks/useNotificaçãoGlobal"; // 👈 Aponta para o hook correto do painel
import { modalLocalStyles, notificacaoGlobalstyles as styles } from "../../../styles/painel/notificacaoGlobalTabStyles";
import ToastPopup from "../../Popup";
import FormularioNotificacao from "../notificacoes/formNotificacao";

export default function NotificacaoGlobalTab({ usuarioAtual }) {
  const {
    cursos,
    eventos,
    carregando,
    modalVisualizarVisivel,
    setModalVisualizarVisivel,
    avisosEnviados,
    carregandoAvisos,
    toast,
    setToast,
    enviarNotificacao,
    abrirVisualizacaoAvisos,
  } = useNotificacaoGlobal(usuarioAtual);

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <FormularioNotificacao
        cursos={cursos}
        eventos={eventos}
        onEnviar={enviarNotificacao}
        onVisualizar={abrirVisualizacaoAvisos}
        carregando={carregando}
      />

      {/* Modal de Listagem dos Avisos Ativos */}
      <Modal
        visible={modalVisualizarVisivel}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisualizarVisivel(false)}
      >
        <View style={modalLocalStyles.overlay}>
          <View style={modalLocalStyles.modalContainer}>
            <View style={modalLocalStyles.headerModal}>
              <Text style={modalLocalStyles.tituloModal}>Avisos Ativos no Mural</Text>
            </View>

            {carregandoAvisos ? (
              <Text style={modalLocalStyles.textoMensagem}>A carregar avisos...</Text>
            ) : avisosEnviados.length === 0 ? (
              <Text style={modalLocalStyles.textoMensagem}>Nenhum aviso ativo no momento.</Text>
            ) : (
              <FlatList
                data={avisosEnviados}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => {
                  let destinoTexto = "🌍 Global (Todos)";
                  let corBadge = "#EAB308";

                  if (item.curso_id) {
                    destinoTexto = `📚 ${item.nomeDestinatarioCurso || `Curso #${item.curso_id}`}`;
                    corBadge = "#2563EB";
                  } else if (item.evento_id) {
                    destinoTexto = `📅 ${item.nomeDestinatarioEvento || `Evento #${item.evento_id}`}`;
                    corBadge = "#9333EA";
                  }

                  return (
                    <View style={modalLocalStyles.cardAviso}>
                      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <Text style={modalLocalStyles.cardTitulo}>{item.titulo}</Text>
                        <Text style={{ fontSize: 10, fontWeight: "bold", color: "#FFFFFF", backgroundColor: corBadge, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                          {destinoTexto}
                        </Text>
                      </View>
                      <Text style={modalLocalStyles.cardTexto}>{item.mensagem}</Text>
                      <Text style={modalLocalStyles.cardRodape}>Expira em: {new Date(item.expira_em).toLocaleString()}</Text>
                    </View>
                  );
                }}
                style={{ maxHeight: 400 }}
              />
            )}

            <TouchableOpacity style={modalLocalStyles.botaoFechar} onPress={() => setModalVisualizarVisivel(false)}>
              <Text style={modalLocalStyles.textoBotaoFechar}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ToastPopup
        visible={toast.visible}
        titulo={toast.titulo}
        mensagem={toast.mensagem}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </ScrollView>
  );
}