import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { bottomNavBarstyles } from "../styles/bottomNavBarStyles";
import { sideNavBarStyles } from "../styles/sideNavBarStyles";
import { CoresInstitucionais } from "../styles/theme";
import CustomIcon from "./CustomIcon";
import CalendarioAcademico from "../components/mural/CalendarioMural";
import ListaCarrosseis from "../components/mural/ListaCarrosseis";
import BuscaTab from "../components/tabs/buscaTab";
import NotificacoesTab from "../components/tabs/notificaTab";
import ConfiguracoesTab from "../components/tabs/configuracoesTab";
import ParceriasAlunoTab from "../components/tabs/parceriasTab";
import InscricaoTab from "../components/tabs/inscricaoTab";

// 🌐 Lista centralizada de abas para evitar duplicação
const tabs = [
  { id: "mural", name: "calendar-outline", label: "Mural", labelSidebar: "Mural Acadêmico" },
  { id: "busca", name: "search-outline", label: "Busca", labelSidebar: "Pesquisar Eventos" },
  { id: "notificacoes", name: "notifications-outline", label: "Avisos", labelSidebar: "Notificações" },
  { id: "parcerias", name: "card-outline", label: "Parcerias", labelSidebar: "Parcerias" },
  { id: "inscricoes", name: "send-outline", label: "Inscrições", labelSidebar: "Inscrições" },
  { id: "configuracoes", name: "settings-outline", label: "Ajustes", labelSidebar: "Configurações" },
];

// 📱 Barra Inferior (Mobile)
export const BottomNavBar = React.memo(function BottomNavBar({ activeTab, onTabPress }) {
  return (
    <View style={bottomNavBarstyles.navContainer}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[bottomNavBarstyles.navItem, isActive && bottomNavBarstyles.navItemActive]}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <CustomIcon
              name={tab.name}
              size={20}
              color={isActive ? CoresInstitucionais.amarelo : CoresInstitucionais.brancoPuro}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
});

// 💻 Barra Lateral (Desktop / Telas Maiores)
export const SidebarNavBar = React.memo(function SidebarNavBar({ activeTab, onTabPress }) {
  return (
    <View style={sideNavBarStyles.sidebar}>
      <View style={sideNavBarStyles.brandContainer}>
        <Text style={sideNavBarStyles.brandTitle}>Painel dos Alunos</Text>
        <Text style={sideNavBarStyles.brandSubtitle}>Estácio Nova América</Text>
      </View>

      <View style={sideNavBarStyles.menuList}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[sideNavBarStyles.menuItem, isActive && sideNavBarStyles.menuItemActive]}
              onPress={() => onTabPress(tab.id)}
              activeOpacity={0.7}
            >
              <CustomIcon
                name={tab.name}
                size={20}
                color={isActive ? CoresInstitucionais.amarelo : CoresInstitucionais.brancoPuro}
              />
              <Text style={[sideNavBarStyles.menuText, isActive && sideNavBarStyles.menuTextActive]}>
                {tab.labelSidebar}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

// 🧩 Renderização centralizada do conteúdo da aba ativa
export function renderConteudoAbaAtiva({
  activeTab,
  scriptApp,
  appCtrl,
  avisosAtivos,
  onReexibirAviso,
}) {
  switch (activeTab) {
    case "mural":
      return (
        <>
          <CalendarioAcademico
            {...scriptApp}
            cursosFavoritos={appCtrl.cursosSelecionados}
            onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)}
            avisosAtivos={avisosAtivos}
            onReexibirAviso={onReexibirAviso}
          />

          <ListaCarrosseis
            cursos={appCtrl.cursos}
            cursosTecnicos={appCtrl.cursosTecnicos}
            cursosFavoritosIds={appCtrl.cursosSelecionados}
            listaProximos={appCtrl.listaProximos}
            listaSemana={appCtrl.listaSemana}
            eventosProximoMes={appCtrl.eventosProximoMes}
            servicos={appCtrl.servicos || []}
            onSelectCurso={(curso) => appCtrl.setCursoSelecionado(curso)}
            onSelectEvento={(ev) => appCtrl.setEventoSelecionado(ev)}
            carregandoCursos={appCtrl.carregandoCursos}
            erroCursos={appCtrl.erroCursos}
            todosOsEventos={appCtrl.todosOsEventos}
          />
        </>
      );

    case "busca":
      return (
        <BuscaTab
          eventosLista={scriptApp.todosOsEventos}
          onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)}
          onNotificar={(ev) => scriptApp.salvarNotificacao(ev)}
        />
      );

    case "notificacoes":
      return (
        <NotificacoesTab
          notificacoes={scriptApp.notificacoesSalvas}
          onRemover={(id) => scriptApp.removerNotificacao(id)}
          onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)}
        />
      );

    case "parcerias":
      return <ParceriasAlunoTab />;

    case "inscricoes":
      return (
        <InscricaoTab
          aoAtualizarBadge={appCtrl?.aoAtualizarBadgeInscricoes}
        />
      );

    case "configuracoes":
      return (
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
      );

    default:
      return null;
  }
}