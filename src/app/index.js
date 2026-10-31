import { Modal, Platform, ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScriptApp } from "../hooks/ScriptApp";
import { useAppController } from "../hooks/useAppController"; // 👈 Importa o novo Hook de Controle

// Importações dos componentes do mural
import BottomNavBar from "../components/BottomNavBar";
import LoginScreen from "../components/login/loginForm";
import Cabecalho from "../components/mural/CabecalhoMural";
import CalendarioAcademico from "../components/mural/CalendarioMural";
import ListaCarrosseis from "../components/mural/ListaCarrosseis";
import RodapeInstitucional from "../components/mural/RodapeMural";
import SidebarNavBar from "../components/SideNavBar";
import OnboardingCursos from "../components/OnboardingCursos";

// Importações dos Tabs e Modals
import BuscaTab from "../components/tabs/buscaTab";
import ConfiguracoesTab from "../components/tabs/configuracoesTab";
import NotificacoesTab from "../components/tabs/notificaTab";
import ModalCurso from "../components/mural/ModalCursos";
import ModalDesenvolvedores from "../components/mural/ModalDesenvolvedores";
import ToastPopup from "../components/Popup";
import EventoDetalhe from "../components/EventoDetalhe";
import PainelNavigator from "../components/painel/painelNavegacao";

// Importações dos Estilos
import { appStyles as styles } from "../styles/mural/mainStyles";
import { localStyles } from "../styles/mural/localStyles";

export default function App() {
  const scriptApp = useScriptApp(styles);
  const appCtrl = useAppController(scriptApp); // 👈 Instancia o controlador centralizado

  // Exibe o loader enquanto valida a sessão inicial
  if (appCtrl.carregandoSessao) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f5f7' }}>
        <ActivityIndicator size="large" color="#173EA5" />
      </View>
    );
  }
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f5f7" }} edges={["top", "bottom"]}>
      
      {/* ── MODAL DO STEPPER ── */}
      <Modal visible={appCtrl.mostrarOnboarding} transparent animationType="fade">
        <View style={localStyles.overlayEmbacado}>
          <View style={localStyles.containerStepper}>
            <OnboardingCursos 
              cursosDisponiveis={scriptApp.cursos} 
              onConcluirSetup={appCtrl.handleConcluirSetup} 
              onPular={appCtrl.handlePularOnboarding}
              stepInicial={appCtrl.stepInicialOnboarding}
            />
          </View>
        </View>
      </Modal>

      <View
        style={{
          flex: 1,
          flexDirection: appCtrl.isDesktop ? "row" : "column",
          ...(Platform.OS === "web" && {
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
          }),
        }}
      >
        {appCtrl.isDesktop && (
          <SidebarNavBar activeTab={appCtrl.activeTab} onTabPress={appCtrl.setActiveTab} />
        )}

        <View style={{ flex: 1, height: "100%" }}>
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between",
              paddingBottom: appCtrl.isDesktop ? 0 : 90,
            }}
          >
            <View style={{ flex: 1 }}>
              <Cabecalho onAdminPress={() => appCtrl.setModalLoginVisivel(true)} />

              {/* ── LEMBRETE/BANNEER DE CONFIGURAÇÃO SE NÃO HOUVER CURSOS ── */}
              {appCtrl.cursosSelecionados.length < 3 && (
                <View style={localStyles.bannerLembrete}>
                  <View style={{ flex: 1 }}>
                    <Text style={localStyles.tituloLembrete}>📌 Personalize seu Feed</Text>
                    <Text style={localStyles.subtituloLembrete}>
                      Selecione de 3 a 5 cursos para destacar os eventos do seu interesse no mural.
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={localStyles.btnLembrete}
                    onPress={appCtrl.handleRedefinirCursos}
                  >
                    <Text style={localStyles.btnLembreteTexto}>Filtrar Cursos</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* RENDERIZAÇÃO DAS ABAS */}
              {appCtrl.activeTab === "mural" && (
                <>
                  <CalendarioAcademico
                    {...scriptApp}
                    cursosFavoritos={appCtrl.cursosSelecionados}
                    onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)}
                  />
                  
                  <ListaCarrosseis
                    {...scriptApp}
                    onSelectCurso={(curso) => appCtrl.setCursoSelecionado(curso)}
                    onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)}
                    cursosFavoritosIds={appCtrl.cursosSelecionados}
                  />
                </>
              )}

              {appCtrl.activeTab === "busca" && (
                  <BuscaTab 
                    eventosLista={scriptApp.todosOsEventos} 
                    onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)} 
                    onNotificar={(ev) => scriptApp.salvarNotificacao(ev)} 
                  />
              )}

              {appCtrl.activeTab === "notificacoes" && (
                <NotificacoesTab
                  notificacoes={scriptApp.notificacoesSalvas}
                  onRemover={(id) => scriptApp.removerNotificacao(id)}
                  onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)}
                />
              )}

              {appCtrl.activeTab === "configuracoes" && (
                  <ConfiguracoesTab 
                    isDesktop={appCtrl.isDesktop}
                    onOpenDevs={() => appCtrl.setModalDevsVisivel(true)}
                    onRedefinirCursos={appCtrl.handleRedefinirCursos}
                    cursosSelecionados={appCtrl.cursosSelecionados}
                    cursosDisponiveis={scriptApp.cursos}
                    onOpenSobre={() =>
                      scriptApp.exibirPopup(
                        "ℹ️ Sobre o Mural Acadêmico",
                        "Mural Acadêmico - Estácio Nova América v1.0.",
                        "sucesso"
                      )
                    }
                  />
                )}
            </View>

            {appCtrl.isDesktop && (
              <View style={{ marginTop: "auto", width: "100%", paddingBottom: 0, marginBottom: 0 }}>
                <RodapeInstitucional
                  onOpenDevs={() => appCtrl.setModalDevsVisivel(true)}
                  onOpenSobre={() => scriptApp.exibirPopup("ℹ️ Sobre", "Mural Acadêmico v1.0", "sucesso", 6)}
                />
              </View>
            )}
          </ScrollView>

          {!appCtrl.isDesktop && (
            <BottomNavBar activeTab={appCtrl.activeTab} onTabPress={appCtrl.setActiveTab} />
          )}
        </View>
      </View>

      {/* MODAIS GLOBAIS */}
      <Modal visible={appCtrl.modalLoginVisivel} transparent animationType="slide" onRequestClose={() => appCtrl.setModalLoginVisivel(false)}>
        <LoginScreen onClose={() => appCtrl.setModalLoginVisivel(false)} onLoginSuccess={appCtrl.handleLoginSucesso} />
      </Modal>

      <Modal visible={appCtrl.modalGerenciaVisivel || appCtrl.modalCoordenadorVisivel} animationType="slide" onRequestClose={() => { appCtrl.setModalGerenciaVisivel(false); appCtrl.setModalCoordenadorVisivel(false); }}>
        <PainelNavigator 
          usuarioAtual={appCtrl.utilizadorLogado} 
          onClose={() => { appCtrl.setModalGerenciaVisivel(false); appCtrl.setModalCoordenadorVisivel(false); }} 
          onLogout={appCtrl.handleLogout} 
        />
      </Modal>

      <ModalDesenvolvedores visible={appCtrl.modalDevsVisivel} onClose={() => appCtrl.setModalDevsVisivel(false)} />

      <ToastPopup
        visible={scriptApp.popupInfo.visible}
        titulo={scriptApp.popupInfo.titulo}
        mensagem={scriptApp.popupInfo.mensagem}
        duracao={scriptApp.popupInfo.duracao}
        onClose={() => scriptApp.setPopupInfo((prev) => ({ ...prev, visible: false }))}
      />

      <ModalCurso
        curso={appCtrl.cursoSelecionado}
        onClose={() => appCtrl.setCursoSelecionado(null)}
        onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)}
      />

      {scriptApp.eventoSelecionado && (
        <EventoDetalhe
          evento={scriptApp.eventoSelecionado}
          onClose={() => scriptApp.setEventoSelecionado(null)}
          onNotificar={(ev) => scriptApp.salvarNotificacao(ev)}
        />
      )}

    </SafeAreaView>
  );
}