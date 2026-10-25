import { useEffect, useState } from "react";
import { Dimensions, Modal, Platform, ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useScriptApp } from "../hooks/ScriptApp";

// Importações dos componentes...
import BottomNavBar from "../components/BottomNavBar";
import LoginScreen from "../components/login/loginForm";
import Cabecalho from "../components/mural/CabecalhoMural";
import CalendarioAcademico from "../components/mural/CalendarioMural";
import ListaCarrosseis from "../components/mural/ListaCarrosseis";
import RodapeInstitucional from "../components/mural/RodapeMural";
import SidebarNavBar from "../components/SideNavBar";
import OnboardingCursos from "../components/OnboardingCursos";

import BuscaTab from "../components/tabs/buscaTab";
import ConfiguracoesTab from "../components/tabs/configuracoesTab";
import NotificacoesTab from "../components/tabs/notificaTab";
import ModalCurso from "../components/mural/ModalCursos";
import ModalDesenvolvedores from "../components/mural/ModalDesenvolvedores";
import GerenciarUsuarios from "../components/painel/painel";
import PainelCoordenador from "../components/painel/painelCoordenador";
import ToastPopup from "../components/Popup";
import EventoDetalhe from "./EventoDetalhe";

import { appStyles as styles } from "../styles/mural/mainStyles";
import { localStyles } from "../styles/mural/mainStyles";

export default function App() {
  const scriptApp = useScriptApp(styles);
  
  const [mostrarOnboarding, setMostrarOnboarding] = useState(false);
  const [cursosSelecionados, setCursosSelecionados] = useState([]);
  const [stepInicialOnboarding, setStepInicialOnboarding] = useState(1);

  // Verifica se o usuário já configurou os cursos
  useEffect(() => {
    async function verificarOnboarding() {
      try {
        const salvos = await AsyncStorage.getItem('@cursos_selecionados');
        if (salvos && JSON.parse(salvos).length >= 3) {
          setCursosSelecionados(JSON.parse(salvos));
          setMostrarOnboarding(false);
        } else {
          setMostrarOnboarding(true);
        }
      } catch (e) {
        setMostrarOnboarding(true);
      }
    }
    verificarOnboarding();
  }, []);

  const handleConcluirSetup = async (cursosEscolhidos) => {
    try {
      await AsyncStorage.setItem('@cursos_selecionados', JSON.stringify(cursosEscolhidos));
      setCursosSelecionados(cursosEscolhidos);
      setMostrarOnboarding(false);
      scriptApp.exibirPopup("✨ Cursos Atualizados!", "Seu feed de eventos foi personalizado.", "sucesso", 4);
    } catch (error) {
      console.log("Erro ao salvar cursos", error);
    }
  };

  const handlePularOnboarding = () => {
    setMostrarOnboarding(false);
    scriptApp.exibirPopup("ℹ️ Lembrete", "Você pode personalizar seus cursos a qualquer momento no topo do mural.", "aviso", 5);
  };

  // Função para redefinir cursos abrindo direto no Passo 2
  const handleRedefinirCursos = () => {
    setStepInicialOnboarding(2);
    setMostrarOnboarding(true);
  };

  const [modalDevsVisivel, setModalDevsVisivel] = useState(false);
  const [cursoSelecionado, setCursoSelecionado] = useState(null);
  const [modalLoginVisivel, setModalLoginVisivel] = useState(false);
  const [modalGerenciaVisivel, setModalGerenciaVisivel] = useState(false);
  const [modalCoordenadorVisivel, setModalCoordenadorVisivel] = useState(false);
  const [utilizadorLogado, setUtilizadorLogado] = useState(null);

  const [activeTab, setActiveTab] = useState("mural");
  const [windowWidth, setWindowWidth] = useState(Dimensions.get("window").width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  const isDesktop = Platform.OS === "web" && windowWidth >= 768;

  const handleLoginSucesso = (usuario) => {
    setUtilizadorLogado(usuario);
    setModalLoginVisivel(false);
    const perfil = usuario.perfil ? usuario.perfil.trim().toLowerCase() : "";

    if (perfil.includes("gerência") || perfil.includes("gerencia")) {
      setModalGerenciaVisivel(true);
    } else if (perfil.includes("coordenador")) {
      setModalCoordenadorVisivel(true);
    } else {
      scriptApp.exibirPopup("Acesso Negado", "Perfil sem autorização para painel.", "erro");
    }
  };

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const eventosCursosFavoritos =
    scriptApp.todosOsEventos?.filter((evento) => {
      return cursosSelecionados.includes(evento.turma) && evento.dataEvento >= hoje;
    }) || [];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f4f5f7" }} edges={["top", "bottom"]}>
      
      {/* ── MODAL DO STEPPER ── */}
      <Modal visible={mostrarOnboarding} transparent animationType="fade">
        <View style={localStyles.overlayEmbacado}>
          <View style={localStyles.containerStepper}>
            <OnboardingCursos 
              cursosDisponiveis={scriptApp.cursos} 
              onConcluirSetup={handleConcluirSetup} 
              onPular={handlePularOnboarding}
              stepInicial={stepInicialOnboarding}
            />
          </View>
        </View>
      </Modal>

      <View
        style={{
          flex: 1,
          flexDirection: isDesktop ? "row" : "column",
          ...(Platform.OS === "web" && {
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
          }),
        }}
      >
        {isDesktop && (
          <SidebarNavBar activeTab={activeTab} onTabPress={setActiveTab} />
        )}

        <View style={{ flex: 1, height: "100%" }}>
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between",
              paddingBottom: isDesktop ? 0 : 90,
            }}
          >
            <View style={{ flex: 1 }}>
              <Cabecalho onAdminPress={() => setModalLoginVisivel(true)} />

              {/* ── LEMBRETE/BANNEER DE CONFIGURAÇÃO SE NÃO HOUVER CURSOS SELECIONADOS ── */}
              {cursosSelecionados.length < 3 && (
                <View style={localStyles.bannerLembrete}>
                  <View style={{ flex: 1 }}>
                    <Text style={localStyles.tituloLembrete}>📌 Personalize seu Feed</Text>
                    <Text style={localStyles.subtituloLembrete}>
                      Selecione de 3 a 5 cursos para destacar os eventos do seu interesse no mural.
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={localStyles.btnLembrete}
                    onPress={handleRedefinirCursos}
                  >
                    <Text style={localStyles.btnLembreteTexto}>Filtrar Cursos</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* RENDERIZAÇÃO DAS ABAS */}
              {activeTab === "mural" && (
                <>
                  <CalendarioAcademico
                    {...scriptApp}
                    cursosFavoritos={cursosSelecionados}
                    onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)}
                  />
                  
                  <ListaCarrosseis
                    {...scriptApp}
                    onSelectCurso={(curso) => setCursoSelecionado(curso)}
                    onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)}
                    cursosFavoritosIds={cursosSelecionados} // 👈 NOME CORRETO DA PROPRIEDADE
                  />
                </>
              )}

              {activeTab === "busca" && (
                  <BuscaTab 
                    todosOsEventos={scriptApp.todosOsEventos} 
                    onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)} 
                    onNotificar={(ev) => scriptApp.salvarNotificacao(ev)} 
                  />
              )}

              {activeTab === "notificacoes" && (
                <NotificacoesTab
                  notificacoes={scriptApp.notificacoesSalvas}
                  onRemover={(id) => scriptApp.removerNotificacao(id)}
                  onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)}
                />
              )}

              {/* Configuracoes do TAB*/}
              {activeTab === "configuracoes" && (
                  <ConfiguracoesTab 
                    isDesktop={isDesktop}
                    onOpenDevs={() => setModalDevsVisivel(true)}
                    onRedefinirCursos={handleRedefinirCursos}
                    cursosSelecionados={cursosSelecionados}
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

            {isDesktop && (
              <View style={{ marginTop: "auto", width: "100%", paddingBottom: 0, marginBottom: 0 }}>
                <RodapeInstitucional
                  onOpenDevs={() => setModalDevsVisivel(true)}
                  onOpenSobre={() => scriptApp.exibirPopup("ℹ️ Sobre", "Mural Acadêmico v1.0", "sucesso", 6)}
                />
              </View>
            )}
          </ScrollView>

          {!isDesktop && (
            <BottomNavBar activeTab={activeTab} onTabPress={setActiveTab} />
          )}
        </View>
      </View>

      {/* MODAIS GLOBAIS */}
      <Modal visible={modalLoginVisivel} transparent animationType="slide" onRequestClose={() => setModalLoginVisivel(false)}>
        <LoginScreen onClose={() => setModalLoginVisivel(false)} onLoginSuccess={handleLoginSucesso} />
      </Modal>

      <Modal visible={modalGerenciaVisivel} animationType="slide" onRequestClose={() => setModalGerenciaVisivel(false)}>
        <GerenciarUsuarios usuarioAtual={utilizadorLogado} onClose={() => setModalGerenciaVisivel(false)} onLogout={() => setModalGerenciaVisivel(false)} />
      </Modal>

      <Modal visible={modalCoordenadorVisivel} animationType="slide" onRequestClose={() => setModalCoordenadorVisivel(false)}>
        <PainelCoordenador usuarioAtual={utilizadorLogado} onClose={() => setModalCoordenadorVisivel(false)} onLogout={() => setModalCoordenadorVisivel(false)} />
      </Modal>

      <ModalDesenvolvedores visible={modalDevsVisivel} onClose={() => setModalDevsVisivel(false)} />

      <ToastPopup
        visible={scriptApp.popupInfo.visible}
        titulo={scriptApp.popupInfo.titulo}
        mensagem={scriptApp.popupInfo.mensagem}
        duracao={scriptApp.popupInfo.duracao}
        onClose={() => scriptApp.setPopupInfo((prev) => ({ ...prev, visible: false }))}
      />

      {scriptApp.eventoSelecionado && (
        <EventoDetalhe
          evento={scriptApp.eventoSelecionado}
          onClose={() => scriptApp.setEventoSelecionado(null)}
          onNotificar={(ev) => scriptApp.salvarNotificacao(ev)}
        />
      )}

      <ModalCurso
        curso={cursoSelecionado}
        onClose={() => setCursoSelecionado(null)}
        onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)}
      />
    </SafeAreaView>
  );
}
