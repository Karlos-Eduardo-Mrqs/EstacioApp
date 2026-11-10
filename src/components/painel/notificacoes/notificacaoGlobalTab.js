import { useEffect, useState } from "react";
import { ScrollView, Modal, View, Text, TouchableOpacity, FlatList, Platform } from "react-native";
import { buscarCursosDoBanco } from "../../../services/cursoServices"; 
import { criarAvisoGlobalNoBanco, buscarTodosAvisosAtivosDoBanco } from "../../../services/notificacaoService";
import { buscarEventosDoBanco } from "../../../services/eventoServices"; 
import { notificacaoGlobalstyles as styles } from "../../../styles/painel/notificacaoGlobalTabStyles"; 
import { modalLocalStyles } from "../../../styles/painel/notificacaoGlobalTabStyles";
import FormularioNotificacao from "../notificacoes/formNotificacao";
import ToastPopup from "../../Popup";
import BotaoFechar from "../../botaoFechar";

export default function NotificacaoGlobalTab() {
  const [cursos, setCursos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  
  // 👁️ Estados para gerir o Modal de Visualização de Avisos
  const [modalVisualizarVisivel, setModalVisualizarVisivel] = useState(false);
  const [avisosEnviados, setAvisosEnviados] = useState([]);
  const [carregandoAvisos, setCarregandoAvisos] = useState(false);

  const [toast, setToast] = useState({
    visible: false,
    titulo: "",
    mensagem: "",
  });

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const dadosCursos = await buscarCursosDoBanco();
      setCursos(dadosCursos || []);

      const dadosEventos = await buscarEventosDoBanco();
      setEventos(dadosEventos || []);
    } catch (error) {
      console.log("Erro ao carregar dados:", error);
    }
  }

  const handleEnviarNotificacao = async ({
    titulo,
    mensagem,
    tipoDestino,
    cursoId,
    eventoId,
    limparCampos,
  }) => {
    if (!titulo.trim() || !mensagem.trim()) {
      setToast({
        visible: true,
        titulo: "Atenção",
        mensagem: "Preencha o título e a mensagem.",
      });
      return;
    }

    try {
      setCarregando(true);
      await criarAvisoGlobalNoBanco({
        titulo: titulo,
        mensagem: mensagem,
        curso_id: tipoDestino === 'curso' ? cursoId : null,
        evento_id: tipoDestino === 'evento' ? eventoId : null,
        duracaoHoras: 24,
      });

      setToast({
        visible: true,
        titulo: "Sucesso!",
        mensagem: "O comunicado foi disparado com sucesso.",
      });
      limparCampos();
    } catch (error) {
      console.error("Erro ao enviar aviso:", error);
      setToast({
        visible: true,
        titulo: "Erro",
        mensagem: "Não foi possível enviar o comunicado.",
      });
    } finally {
      setCarregando(false);
    }
  };

  // 👁️ Função acionada ao clicar em "Ver Avisos Enviados"
  const handleAbrirVisualizacao = async () => {
    try {
      setCarregandoAvisos(true);
      setModalVisualizarVisivel(true);
      
      // Chama a função correta do service que já criamos
      const lista = await buscarTodosAvisosAtivosDoBanco(); 
      
      // Cruza com os cursos e eventos já carregados na tela para garantir o nome exato
      const listaMapeada = (lista || []).map(aviso => {
        let cursoEncontrado = null;
        let eventoEncontrado = null;

        if (aviso.curso_id) {
          cursoEncontrado = cursos.find(c => Number(c.id) === Number(aviso.curso_id));
        }
        if (aviso.evento_id) {
          eventoEncontrado = eventos.find(e => Number(e.id) === Number(aviso.evento_id));
        }

        return {
          ...aviso,
          nomeDestinatarioCurso: cursoEncontrado ? cursoEncontrado.titulo : null,
          nomeDestinatarioEvento: eventoEncontrado ? eventoEncontrado.titulo : null,
        };
      });

      setAvisosEnviados(listaMapeada);
    } catch (error) {
      console.error("Erro ao buscar avisos:", error);
      setToast({
        visible: true,
        titulo: "Erro",
        mensagem: "Não foi possível carregar os avisos ativos.",
      });
    } finally {
      setCarregandoAvisos(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <FormularioNotificacao
        cursos={cursos}
        eventos={eventos}
        onEnviar={handleEnviarNotificacao}
        onVisualizar={handleAbrirVisualizacao} // 👈 Passa a função para o botão
        carregando={carregando}
      />

      {/* 👁️ Modal de Listagem dos Avisos Ativos */}
      <Modal visible={modalVisualizarVisivel} transparent animationType="fade" onRequestClose={() => setModalVisualizarVisivel(false)}>
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
                  let destinoTexto = '🌍 Global (Todos)';
                  let corBadge = '#EAB308'; // Amarelo

                  if (item.curso_id) {
                    const nomeCursoExibicao = item.nomeDestinatarioCurso || `Curso #${item.curso_id}`;
                    destinoTexto = `📚 ${nomeCursoExibicao}`;
                    corBadge = '#2563EB'; // Azul
                  } else if (item.evento_id) {
                    const nomeEventoExibicao = item.nomeDestinatarioEvento || `Evento #${item.evento_id}`;
                    destinoTexto = `📅 ${nomeEventoExibicao}`;
                    corBadge = '#9333EA'; // Roxo
                  }

                  return (
                    <View style={modalLocalStyles.cardAviso}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <Text style={modalLocalStyles.cardTitulo}>{item.titulo}</Text>
                        <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#FFFFFF', backgroundColor: corBadge, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                          {destinoTexto}
                        </Text>
                      </View>
                      <Text style={modalLocalStyles.cardTexto}>{item.mensagem}</Text>
                      <Text style={modalLocalStyles.cardRodape}>
                        Expira em: {new Date(item.expira_em).toLocaleString()}
                      </Text>
                    </View>
                  );
                }}
                style={{ maxHeight: 400 }}
              />
            )}

            <TouchableOpacity 
              style={modalLocalStyles.botaoFechar} 
              onPress={() => setModalVisualizarVisivel(false)}
            >
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