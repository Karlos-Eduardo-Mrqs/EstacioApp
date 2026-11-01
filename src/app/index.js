import { Modal, Platform, ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScriptApp } from "../hooks/ScriptApp";
import { useAppController } from "../hooks/useAppController";

// Importações dos componentes do mural
import { BottomNavBar, SidebarNavBar } from "../components/Navegacao";
import LoginScreen from "../components/login/loginForm";
import Cabecalho from "../components/mural/CabecalhoMural";
import RodapeInstitucional from "../components/mural/RodapeMural";
import OnboardingCursos from "../components/OnboardingCursos";
import ConteudoAbas from "../components/mural/conteudosAbas"; // 👈 Novo componente desmembrado

// Importações dos Modals
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
  const appCtrl = useAppController(scriptApp);

  if (appCtrl.carregandoSessao) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f5f7' }}>
        <ActivityIndicator size="large" color="#173EA5" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f5f7" }} edges={["top", "bottom"]}>
      
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

              {/* ABAS RENDERIZADAS NO NOVO COMPONENTE */}
              <ConteudoAbas 
                  activeTab={appCtrl.activeTab}
                  scriptApp={scriptApp}
                  appCtrl={appCtrl}
                  avisosAtivos={appCtrl.avisosAtivos}
                  onReexibirAviso={appCtrl.reexibirAvisoPopup}
              />
            </View>

            {appCtrl.isDesktop && (
              <View style={{ marginTop: "auto", width: "100%", paddingBottom: 0, marginBottom: 0 }}>
                <RodapeInstitucional
                  onOpenDevs={() => appCtrl.setModalDevsVisivel(true)}
                  onOpenSobre={() => scriptApp.exibirPopup("ℹ️ Sobre", 
                  "Este portal foi desenvolvido para centralizar a comunicação acadêmica, avisos da gerência, prazos de notas, eventos e atividades complementares (ACC) do campus com máxima eficiência e performance.", 
                  "sucesso", 6)}
                />
              </View>
            )}
          </ScrollView>

          {!appCtrl.isDesktop && (
            <BottomNavBar activeTab={appCtrl.activeTab} onTabPress={appCtrl.setActiveTab} />
          )}
        </View>
      </View>

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