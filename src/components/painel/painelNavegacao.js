// src/components/painel/painelNavegacao.js
import { useState } from "react";
import { Platform, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { painelNavegacaostyles as styles } from "../../styles/painel/painelNavegacaostyles";
import ConfirmPopup from "../ConfirmPopup";
import AuthGuard from "../mural/guardaAutenticacao";
import PainelGerenciaAcademica from "./painelGerencia"; 
import GerenciarEventos from "./eventos/painelEventos";
import NotificacaoGlobalTab from "../painel/notificacoes/notificacaoGlobalTab";
import PainelCursos from "./cursos/painelCursos";
import PainelServicos from "./servicos/painelServicos";
import ParceriaTab from "./parcerias/parceriaTab";
import PainelPublicacoes from "./publicacoes/painelPublicacoes";
import GerenciarUsuarios from "./usuarios/painelGerenciarUsuarios";
import PainelMenu from "./menu";

export default function PainelNavigator({ usuarioAtual, onClose, onLogout }) {
  const perfilStr = usuarioAtual?.perfil ? usuarioAtual.perfil.trim().toLowerCase() : "";
  const ehCoordenador = perfilStr.includes("coordenador");
  
  // Se for coordenador começa em eventos, senão começa em utilizadores/gerencia
  const [abaAtiva, setAbaAtiva] = useState(ehCoordenador ? "eventos" : "utilizadores");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === "web" && width >= 768;

  const [confirmPopup, setConfirmPopup] = useState({
    visible: false,
    titulo: "",
    mensagem: "",
    onConfirm: null,
    tipo: "danger",
  });

  const solicitarLogout = () => {
    setConfirmPopup({
      visible: true,
      titulo: "Sair do sistema",
      mensagem: "Deseja realmente encerrar a sua sessão atual?",
      tipo: "danger",
      onConfirm: () => {
        setConfirmPopup((prev) => ({ ...prev, visible: false }));
        if (onLogout) onLogout();
        else if (onClose) onClose();
      },
    });
  };

  const selecionarAba = (aba) => {
    setAbaAtiva(aba);
    setDrawerOpen(false);
  };

  return (
    <AuthGuard
      usuarioAtual={usuarioAtual}
      perfilPermitido={["Gerência Acadêmica", "Coordenador", "Gerencia"]}
      onVoltar={onClose}
    >
      <View style={[styles.containerPrincipal, { flexDirection: isDesktop ? "row" : "column" }]}>
        
        {!isDesktop && (
          <View style={{
            height: 60,
            backgroundColor: "#032551",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            elevation: 4,
          }}>
            <TouchableOpacity onPress={() => setDrawerOpen(true)} style={{ padding: 8 }}>
              <Text style={{ fontSize: 24, color: "#fff" }}>☰</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}>
              {ehCoordenador ? "Área do Coordenador" : "Gestão Acadêmica"}
            </Text>
            <View style={{ width: 32 }} />
          </View>
        )}

        <PainelMenu
          ehCoordenador={ehCoordenador}
          abaAtiva={abaAtiva}
          selecionarAba={selecionarAba}
          isDesktop={isDesktop}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
          usuarioAtual={usuarioAtual}
          solicitarLogout={solicitarLogout}
        />

        {/* Conteúdo Dinâmico Central corrigido para mapear todas as abas */}
        <View style={{ flex: 1 }}>
          {abaAtiva === "utilizadores" && !ehCoordenador && (
            <GerenciarUsuarios usuarioAtual={usuarioAtual} onClose={onClose} onLogout={onLogout} />
          )}

          {abaAtiva === "publicacoes" && (
            <PainelPublicacoes usuarioAtual={usuarioAtual} />
          )}

          {abaAtiva === "eventos" && (
            <GerenciarEventos usuarioAtual={usuarioAtual} onClose={onClose} onLogout={onLogout} />
          )}
          
          {abaAtiva === "notificacao" && <NotificacaoGlobalTab usuarioAtual={usuarioAtual} />}
          
          {abaAtiva === "parcerias" && !ehCoordenador && <ParceriaTab />}

          {abaAtiva === "servicos" && (
            <PainelServicos usuarioAtual={usuarioAtual} />
          )}

          {abaAtiva === "cursos" && (
            <PainelCursos usuarioAtual={usuarioAtual} />
          )}
        </View>
      
      </View>

      <ConfirmPopup
        visible={confirmPopup.visible}
        titulo={confirmPopup.titulo}
        mensagem={confirmPopup.mensagem}
        tipo={confirmPopup.tipo}
        onConfirm={confirmPopup.onConfirm}
        onCancel={() => setConfirmPopup((prev) => ({ ...prev, visible: false }))}
      />
    </AuthGuard>
  );
}