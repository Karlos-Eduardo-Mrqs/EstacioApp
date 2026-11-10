import { useState } from "react";
import { Platform, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { painelNavegacaostyles as styles } from "../../styles/painel/painelNavegacaostyles";
import ConfirmPopup from "../ConfirmPopup";
import AuthGuard from "../mural/guardaAutenticacao";
import PainelCoordenador from "./painelCoordenador";
import GerenciarUsuarios from "./painelGerencia";
import GerenciarEventos from "./eventos/painelEventos";
import NotificacaoGlobalTab from "../painel/notificacoes/notificacaoGlobalTab";
import PainelServicos from "./servicos/painelServicos";
import ParceriaTab from "./parcerias/parceriaTab";
import PainelCursos from "./cursos/painelCursos";
import PainelMenu from "./menu";

export default function PainelNavigator({ usuarioAtual, onClose, onLogout }) {
  const perfilStr = usuarioAtual?.perfil ? usuarioAtual.perfil.trim().toLowerCase() : "";
  const ehCoordenador = perfilStr.includes("coordenador");

  //Teste cursoid
  console.log('USUÁRIO LOGADO:', usuarioAtual);
  console.log('CURSO ID DO USUÁRIO:', usuarioAtual?.curso_id);
  
  // Define a aba inicial com base no perfil do utilizador
  const [abaAtiva, setAbaAtiva] = useState(
    ehCoordenador ? "coordenacao" : "utilizadores",
  );
  const [drawerOpen, setDrawerOpen] = useState(false); // Estado para controlar o Drawer mobile
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
        
        {/* Header Mobile com Botão Hambúrguer */}
        {!isDesktop && (
          <View style={{
            height: 60,
            backgroundColor: "#032551",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 16,
            elevation: 4,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 2,
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

        {/* Menu Lateral / Drawer isolado */}
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

        {/* Conteúdo Dinâmico Central */}
        <View style={{ flex: 1 }}>
          {abaAtiva === "utilizadores" && !ehCoordenador && (
            <GerenciarUsuarios usuarioAtual={usuarioAtual} onClose={onClose} onLogout={onLogout} />
          )}
          {(abaAtiva === "eventos" || (abaAtiva === "coordenacao" && ehCoordenador)) && (
            ehCoordenador ? (
              <PainelCoordenador usuarioAtual={usuarioAtual} onClose={onClose} onLogout={onLogout} />
            ) : (
              <GerenciarEventos usuarioAtual={usuarioAtual} onClose={onClose} onLogout={onLogout} />
            )
          )}
          
          {abaAtiva === "notificacao" && <NotificacaoGlobalTab />}
          {abaAtiva === "parcerias" && !ehCoordenador && <ParceriaTab />}
          {abaAtiva === "cursos" && !ehCoordenador && <PainelCursos />}
          {abaAtiva === "servicos" && !ehCoordenador && <PainelServicos />}
        
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