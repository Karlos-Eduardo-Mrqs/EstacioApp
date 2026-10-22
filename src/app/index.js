import { useState, useEffect } from "react";
import { Modal, ScrollView, View, Platform, Dimensions } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useScriptApp } from "../hooks/ScriptApp";

// Importação dos componentes modulares
import LoginScreen from "../components/login/loginForm";
import Cabecalho from "../components/mural/CabecalhoMural";
import CalendarioAcademico from "../components/mural/CalendarioMural";
import ListaCarrosseis from "../components/mural/ListaCarrosseis";
import RodapeInstitucional from "../components/mural/RodapeMural";
import BottomNavBar from "../components/BottomNavBar";
import SidebarNavBar from "../components/SideNavBar";

// Importação das Abas Separadas
import BuscaTab from "../components/tabs/buscaTab";
import NotificacoesTab from "../components/tabs/notificaTab";
import ConfiguracoesTab from "../components/tabs/configuracoesTab";

// Importação de modais e pop-ups
import ModalCurso from "../components/mural/ModalCursos";
import ModalDesenvolvedores from "../components/mural/ModalDesenvolvedores";
import GerenciarUsuarios from "../components/painel/painel";
import ToastPopup from "../components/Popup";
import EventoDetalhe from "./EventoDetalhe";

// Estilos
import { appStyles as styles } from "../styles/mural/mainStyles";

export default function App() {
  const scriptApp = useScriptApp(styles);
  const [modalDevsVisivel, setModalDevsVisivel] = useState(false);
  const [cursoSelecionado, setCursoSelecionado] = useState(null);

  const [modalLoginVisivel, setModalLoginVisivel] = useState(false);
  const [modalPainelVisivel, setModalPainelVisivel] = useState(false);
  const [utilizadorLogado, setUtilizadorLogado] = useState(null);

  const [activeTab, setActiveTab] = useState("mural");

  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  const isDesktop = Platform.OS === 'web' && windowWidth >= 768;

  const handleLoginSucesso = (usuario) => {
    setUtilizadorLogado(usuario);
    setModalLoginVisivel(false);
    setModalPainelVisivel(true);
  };

  const [popupInfo, setPopupInfo] = useState({
    visible: false,
    titulo: "",
    mensagem: "",
  });

  const exibirPopupTemporizado = (titulo, mensagem) => {
    setPopupInfo({ visible: true, titulo, mensagem });
    setTimeout(
      () => setPopupInfo((prev) => ({ ...prev, visible: false })),
      6000,
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f5f7' }} edges={['top', 'bottom']}>
      <View style={{ 
        flex: 1, 
        flexDirection: isDesktop ? 'row' : 'column',
        ...(Platform.OS === 'web' && { height: '100vh', width: '100vw', overflow: 'hidden' }) 
      }}>
        
        {/* MENU LATERAL APENAS NO PC */}
        {isDesktop && (
          <SidebarNavBar activeTab={activeTab} onTabPress={setActiveTab} />
        )}

        {/* ÁREA PRINCIPAL DE CONTEÚDO */}
        <View style={{ flex: 1, height: '100%' }}>
          <ScrollView 
            style={styles.container} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ 
              flexGrow: 1, 
              justifyContent: 'space-between',
              paddingBottom: isDesktop ? 0 : 90 
            }}
          >
            <View style={{ flex: 1 }}>
              {/* CABEÇALHO */}
              <Cabecalho onAdminPress={() => setModalLoginVisivel(true)} />

              {/* RENDERIZAÇÃO DAS ABAS MODULARIZADAS */}
              {activeTab === "mural" && (
                <>
                  <CalendarioAcademico
                    {...scriptApp}
                    onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)}
                  />
                  <ListaCarrosseis
                    {...scriptApp}
                    onSelectCurso={(curso) => setCursoSelecionado(curso)}
                    onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)}
                  />
                </>
              )}

              {activeTab === "busca" && <BuscaTab />}

              {activeTab === "notificacoes" && <NotificacoesTab />}

              {activeTab === "configuracoes" && (
                <ConfiguracoesTab 
                  isDesktop={isDesktop}
                  onOpenDevs={() => setModalDevsVisivel(true)}
                  onOpenSobre={() =>
                    exibirPopupTemporizado(
                      "ℹ️ Sobre o Mural Acadêmico",
                      "Mural Acadêmico - Estácio Nova América v1.0. Plataforma desenvolvida para centralizar avisos e eventos do campus.",
                    )
                  }
                />
              )}
            </View>

            {/* RODAPÉ INSTITUCIONAL FIXO NO FUNDO (PC) */}
            {isDesktop && (
              <View style={{ marginTop: 'auto', width: '100%', paddingBottom: 0, marginBottom: 0 }}>
                <RodapeInstitucional
                  onOpenDevs={() => setModalDevsVisivel(true)}
                  onOpenSobre={() =>
                    exibirPopupTemporizado(
                      "ℹ️ Sobre o Mural Acadêmico",
                      "Mural Acadêmico - Estácio Nova América v1.0. Plataforma desenvolvida para centralizar avisos e eventos do campus.",
                    )
                  }
                />
              </View>
            )}
          </ScrollView>

          {/* BARRA INFERIOR APENAS NO MOBILE */}
          {!isDesktop && (
            <BottomNavBar activeTab={activeTab} onTabPress={setActiveTab} />
          )}
        </View>
      </View>

      {/* MODAIS GLOBAIS */}
      <Modal visible={modalLoginVisivel} transparent animationType="slide" onRequestClose={() => setModalLoginVisivel(false)}>
        <LoginScreen 
          onClose={() => setModalLoginVisivel(false)} 
          onLoginSuccess={handleLoginSucesso} 
        />
      </Modal>

      <Modal visible={modalPainelVisivel} transparent animationType="slide" onRequestClose={() => setModalPainelVisivel(false)}>
        <GerenciarUsuarios usuarioAtual={utilizadorLogado} onClose={() => setModalPainelVisivel(false)} />
      </Modal>

      <ModalDesenvolvedores
        visible={modalDevsVisivel}
        onClose={() => setModalDevsVisivel(false)}
      />

      <ToastPopup
        visible={popupInfo.visible}
        titulo={popupInfo.titulo}
        mensagem={popupInfo.mensagem}
        onClose={() => setPopupInfo((prev) => ({ ...prev, visible: false }))}
      />

      {scriptApp.eventoSelecionado && (
        <EventoDetalhe
          evento={scriptApp.eventoSelecionado}
          onClose={() => scriptApp.setEventoSelecionado(null)}
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