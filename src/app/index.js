import { useState } from "react";
import { Modal, ScrollView, View } from "react-native";
import { useScriptApp } from "../hooks/ScriptApp";

// Importação dos novos componentes modulares
import LoginScreen from "../components/login/loginForm"; // 👈 Ajuste o caminho correto do seu loginForm
import Cabecalho from "../components/mural/CabecalhoMural";
import CalendarioAcademico from "../components/mural/CalendarioMural";
import ListaCarrosseis from "../components/mural/ListaCarrosseis";
import RodapeInstitucional from "../components/mural/RodapeMural";

// Importação de modais e pop-ups já existentes
import ModalCurso from "../components/mural/ModalCursos";
import ModalDesenvolvedores from "../components/mural/ModalDesenvolvedores";
import GerenciarUsuarios from "../components/painel/painel"; // 👈 Adicione esta linha com o caminho correto do seu painel.js
import ToastPopup from "../components/Popup";
import EventoDetalhe from "./EventoDetalhe";

// Estilos
import { appStyles as styles } from "../styles/mural/mainStyles";
import PainelCadastro from "../components/painel/painelCadastro";

export default function App() {
  const scriptApp = useScriptApp(styles);
  const [modalDevsVisivel, setModalDevsVisivel] = useState(false);
  const [cursoSelecionado, setCursoSelecionado] = useState(null);

  const [modalLoginVisivel, setModalLoginVisivel] = useState(false);
  const [modalPainelVisivel, setModalPainelVisivel] = useState(false);
  const [utilizadorLogado, setUtilizadorLogado] = useState(null);

  // Quando o login for bem-sucedido:
  const handleLoginSucesso = (usuario) => {
    setUtilizadorLogado(usuario);      // Guarda quem entrou
    setModalLoginVisivel(false);       // Fecha o modal de login
    setModalPainelVisivel(true);       // Abre o painel de gestão (painel.js)
  };

  // Estado e lógica do Pop-up Temporizado (Sobre)
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
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* COMPONENTE DO CABEÇALHO */}
        <Cabecalho onAdminPress={() => setModalLoginVisivel(true)} />

        {/* COMPONENTE DE CALENDÁRIO E AVISOS */}
        <CalendarioAcademico
          {...scriptApp}
          onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)}
        />

        {/* MODAL DE LOGIN */}
        <Modal visible={modalLoginVisivel} transparent animationType="slide" onRequestClose={() => setModalLoginVisivel(false)}>
          <LoginScreen 
            onClose={() => setModalLoginVisivel(false)} 
            onLoginSuccess={handleLoginSucesso} 
          />
        </Modal>

        {/* MODAL DO PAINEL ADMINISTRATIVO */}
        <Modal visible={modalPainelVisivel} transparent animationType="slide" onRequestClose={() => setModalPainelVisivel(false)}>
          <GerenciarUsuarios usuarioAtual={utilizadorLogado} onClose={() => setModalPainelVisivel(false)} />
        </Modal>

        {/* COMPONENTE DE CARROSSÉIS (CURSOS E EVENTOS) */}
        <ListaCarrosseis
          {...scriptApp}
          onSelectCurso={(curso) => setCursoSelecionado(curso)}
          onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)}
        />

        {/* COMPONENTE DO RODAPÉ */}
        <RodapeInstitucional
          onOpenDevs={() => setModalDevsVisivel(true)}
          onOpenSobre={() =>
            exibirPopupTemporizado(
              "ℹ️ Sobre o Mural Acadêmico",
              "Mural Acadêmico - Estácio Nova América v1.0. Plataforma desenvolvida para centralizar avisos e eventos do campus.",
            )
          }
        />
      </ScrollView>

      {/* Modais Globais */}
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

      {/* MODAL DE DETALHES DO CURSO */}
      <ModalCurso
        curso={cursoSelecionado}
        onClose={() => setCursoSelecionado(null)}
        onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)}
      />
    </View>
  );
}
