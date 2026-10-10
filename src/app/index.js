import React, { useState } from 'react';
import { View, ScrollView, Modal } from 'react-native';
import { useScriptApp } from '../hooks/ScriptApp';

// Importação dos novos componentes modulares
import Cabecalho from '../components/CabecalhoMural';
import CalendarioAcademico from '../components/CalendarioMural';
import ListaCarrosseis from '../components/ListaCarrosseis';
import RodapeInstitucional from '../components/RodapeMural';

// Importação de modais e pop-ups já existentes
import EventoDetalhe from './EventoDetalhe';
import ModalDesenvolvedores from '../components/ModalDesenvolvedores';
import ToastPopup from '../components/Popup';
import ModalCurso from '../components/ModalCursos';

// Estilos
import { appStyles as styles } from '../styles/mainStyles';

export default function App() {
  const scriptApp = useScriptApp(styles);
  const [modalDevsVisivel, setModalDevsVisivel] = useState(false);
  const [cursoSelecionado, setCursoSelecionado] = useState(null);

  // Estado e lógica do Pop-up Temporizado (Sobre)
  const [popupInfo, setPopupInfo] = useState({ visible: false, titulo: '', mensagem: '' });
  
  const exibirPopupTemporizado = (titulo, mensagem) => {
    setPopupInfo({ visible: true, titulo, mensagem });
    setTimeout(() => setPopupInfo(prev => ({ ...prev, visible: false })), 6000);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        
        {/* 1. COMPONENTE DO CABEÇALHO */}
        <Cabecalho onAdminPress={() => alert("Painel Administrativo")} />

        {/* 2. COMPONENTE DE CALENDÁRIO E AVISOS */}
        <CalendarioAcademico {...scriptApp} onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)} />

        {/* 3. COMPONENTE DE CARROSSÉIS (CURSOS E EVENTOS) */}
        <ListaCarrosseis 
          {...scriptApp} 
          onSelectCurso={(curso) => setCursoSelecionado(curso)}
          onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)}
        />

        {/* 4. COMPONENTE DO RODAPÉ */}
        <RodapeInstitucional 
          onOpenDevs={() => setModalDevsVisivel(true)}
          onOpenSobre={() => exibirPopupTemporizado(
            "ℹ️ Sobre o Mural Acadêmico",
            "Mural Acadêmico - Estácio Nova América v1.0. Plataforma desenvolvida para centralizar avisos e eventos do campus."
          )}
        />

      </ScrollView>

      {/* Modais Globais */}
      <ModalDesenvolvedores visible={modalDevsVisivel} onClose={() => setModalDevsVisivel(false)} />
      
      <ToastPopup 
        visible={popupInfo.visible} titulo={popupInfo.titulo}
        mensagem={popupInfo.mensagem} onClose={() => setPopupInfo(prev => ({ ...prev, visible: false }))}/>

      {scriptApp.eventoSelecionado && (
        <EventoDetalhe evento={scriptApp.eventoSelecionado} onClose={() => scriptApp.setEventoSelecionado(null)} />
      )}

      {/* MODAL DE DETALHES DO CURSO */}
      <ModalCurso curso={cursoSelecionado} onClose={() => setCursoSelecionado(null)} 
          onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)}
      />
    </View>
  );
}