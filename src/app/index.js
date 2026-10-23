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
import PainelCoordenador from "../components/painel/painelCoordenador";
import ToastPopup from "../components/Popup";
import EventoDetalhe from "./EventoDetalhe";

// Estilos
import { appStyles as styles } from "../styles/mural/mainStyles";

export default function App() {
  const scriptApp = useScriptApp(styles);
  const [modalDevsVisivel, setModalDevsVisivel] = useState(false);
  const [cursoSelecionado, setCursoSelecionado] = useState(null);

  const [modalLoginVisivel, setModalLoginVisivel] = useState(false);
  const [modalGerenciaVisivel, setModalGerenciaVisivel] = useState(false);
  const [modalCoordenadorVisivel, setModalCoordenadorVisivel] = useState(false);
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

    const perfil = usuario.perfil ? usuario.perfil.trim().toLowerCase() : '';

    // Direcionamento dinâmico baseado no cargo do banco
    if (perfil.includes('gerência') || perfil.includes('gerencia')) {
      setModalGerenciaVisivel(true);
    } else if (perfil.includes('coordenador')) {
      setModalCoordenadorVisivel(true);
    } else {
      scriptApp.exibirPopup("Acesso Negado", "Perfil sem autorização para painel.", "erro");
    }
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

              {activeTab === "notificacoes" && (
                <NotificacoesTab 
                  notificacoes={scriptApp.notificacoesSalvas}
                  onRemover={(id) => scriptApp.removerNotificacao(id)}
                  onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)}
                />
              )}

              {activeTab === "configuracoes" && (
                <ConfiguracoesTab 
                  isDesktop={isDesktop}
                  onOpenDevs={() => setModalDevsVisivel(true)}
                  onOpenSobre={() =>
                    scriptApp.exibirPopup(
                      "ℹ️ Sobre o Mural Acadêmico",
                      "Mural Acadêmico - Estácio Nova América v1.0. Plataforma desenvolvida para centralizar avisos e eventos do campus.",
                      "sucesso"
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
                    scriptApp.exibirPopup(
                      "ℹ️ Sobre o Mural Acadêmico",
                      "Mural Acadêmico - Estácio Nova América v1.0. Plataforma desenvolvida para centralizar avisos e eventos do campus.",
                      "sucesso",6
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
      
      {/* MODAL EXCLUSIVO DA GERÊNCIA */}
      <Modal visible={modalGerenciaVisivel} animationType="slide" onRequestClose={() => setModalGerenciaVisivel(false)}>
        <GerenciarUsuarios 
          usuarioAtual={utilizadorLogado} 
          onClose={() => setModalGerenciaVisivel(false)} 
          onLogout={() => setModalGerenciaVisivel(false)} 
        />
      </Modal>

      {/* MODAL EXCLUSIVO DO COORDENADOR */}
      <Modal visible={modalCoordenadorVisivel} animationType="slide" onRequestClose={() => setModalCoordenadorVisivel(false)}>
        <PainelCoordenador 
          usuarioAtual={utilizadorLogado} 
          onClose={() => setModalCoordenadorVisivel(false)} 
          onLogout={() => setModalCoordenadorVisivel(false)} 
        />
      </Modal>
      
      <ModalDesenvolvedores
        visible={modalDevsVisivel}
        onClose={() => setModalDevsVisivel(false)}
      />

      {/* TOAST POPUP CONECTADO AO SCRIPTAPP */}
      <ToastPopup
        visible={scriptApp.popupInfo.visible}
        titulo={scriptApp.popupInfo.titulo}
        mensagem={scriptApp.popupInfo.mensagem}
        duracao={scriptApp.popupInfo.duracao} // 👈 Passa dinamicamente a duração gerada no ScriptApp
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