import { useState } from "react";
import { Modal, Platform, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { painelNavegacaostyles as styles } from "../../styles/painel/painelNavegacaostyles";
import ConfirmPopup from "../ConfirmPopup";
import AuthGuard from "../mural/guardaAutenticacao";
import PainelCoordenador from "../painel/painelCoordenador";
import GerenciarUsuarios from "../painel/painelGerencia";
import CustomIcon from "../CustomIcon";
import GerenciarEventos from "./eventos/painelEventos";
import NotificacaoGlobalTab from "../painel/notificacoes/notificacaoGlobalTab";
import ParceriaTab from "../painel/parcerias/parceriaTab";

export default function PainelNavigator({ usuarioAtual, onClose, onLogout }) {
  const perfilStr = usuarioAtual?.perfil
    ? usuarioAtual.perfil.trim().toLowerCase()
    : "";
  const ehCoordenador = perfilStr.includes("coordenador");

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
    setDrawerOpen(false); // Fecha o menu lateral automaticamente ao selecionar no telemóvel
  };

  const renderBotoesNav = () => (
    <>
      {!ehCoordenador && (
        <TouchableOpacity
          style={[
            styles.botaoNav,
            abaAtiva === "utilizadores" && styles.botaoNavAtivo,
          ]}
          onPress={() => selecionarAba("utilizadores")}
          activeOpacity={0.8}
        >
          <Text style={styles.iconeNav}> <CustomIcon name="person-circle-outline" size={18} color="#fff"/> </Text>
          {(isDesktop || drawerOpen) && (
            <Text
              style={[
                styles.textoBotaoNav,
                abaAtiva === "utilizadores" && styles.textoBotaoNavAtivo,
              ]}
            >
              Coordenadores
            </Text>
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[
          styles.botaoNav,
          (abaAtiva === "eventos" || abaAtiva === "coordenacao") &&
            styles.botaoNavAtivo,
        ]}
        onPress={() => selecionarAba(ehCoordenador ? "coordenacao" : "eventos")}
        activeOpacity={0.8}
      >
        <Text style={styles.iconeNav}>  <CustomIcon name="calendar" size={18} color="#fff"/> </Text>
        {(isDesktop || drawerOpen) && (
          <Text
            style={[
              styles.textoBotaoNav,
              (abaAtiva === "eventos" || abaAtiva === "coordenacao") &&
                styles.textoBotaoNavAtivo,
            ]}
          >
            Eventos
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.botaoNav,
          abaAtiva === "notificacao" && styles.botaoNavAtivo,
        ]}
        onPress={() => selecionarAba("notificacao")}
        activeOpacity={0.8}
      >
        <Text style={styles.iconeNav}> <CustomIcon name="bell" size={18} color="#fff" /> </Text>
        {(isDesktop || drawerOpen) && (
          <Text
            style={[
              styles.textoBotaoNav,
              abaAtiva === "notificacao" && styles.textoBotaoNavAtivo,
            ]}
          >
            Notificação Global
          </Text>
        )}
      </TouchableOpacity>

      {/* 👈 2. Novo Botão de Parcerias no Menu (Disponível para Gerência) */}
      {!ehCoordenador && (
        <TouchableOpacity
          style={[
            styles.botaoNav,
            abaAtiva === "parcerias" && styles.botaoNavAtivo,
          ]}
          onPress={() => selecionarAba("parcerias")}
          activeOpacity={0.8}
        >
          <Text style={styles.iconeNav}> <CustomIcon name="card-outline" size={18} color="#fff" /> </Text>
          {(isDesktop || drawerOpen) && (
            <Text
              style={[
                styles.textoBotaoNav,
                abaAtiva === "parcerias" && styles.textoBotaoNavAtivo,
              ]}
            >
              Parcerias
            </Text>
          )}
        </TouchableOpacity>
      )}
    </>
  );

  return (
    <AuthGuard
      usuarioAtual={usuarioAtual}
      perfilPermitido={["Gerência Acadêmica", "Coordenador", "Gerencia"]}
      onVoltar={onClose}
    >
      <View
        style={[
          styles.containerPrincipal,
          { flexDirection: isDesktop ? "row" : "column" },
        ]}
      >
        {/* ── HEADER MOBILE COM BOTÃO HAMBÚRGUER ── */}
        {!isDesktop && (
          <View
            style={{
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
            }}
          >
            <TouchableOpacity
              onPress={() => setDrawerOpen(true)}
              style={{ padding: 8 }}
            >
              <Text style={{ fontSize: 24, color: "#fff" }}>☰</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}>
              {ehCoordenador ? "Área do Coordenador" : "Gestão Acadêmica"}
            </Text>
            <View style={{ width: 32 }} />
          </View>
        )}

        {/* ── SIDEBAR DESKTOP (Fixa na lateral para telas grandes) ── */}
        {isDesktop && (
          <View style={[styles.navContainer, styles.sidebarDesktop]}>
            <View style={styles.headerDesktop}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoTextoBadge}>PAINEL</Text>
              </View>
              <Text style={styles.tituloMenu}>
                {ehCoordenador ? "Área do Coordenador" : "Gestão Acadêmica"}
              </Text>
              <Text style={styles.subtituloMenu} numberOfLines={1}>
                {usuarioAtual?.nome}
              </Text>
              <Text style={styles.perfilBadgeTexto} numberOfLines={1}>
                [{usuarioAtual?.perfil}]
              </Text>
            </View>

            <View style={styles.botoesWrapper}>{renderBotoesNav()}</View>

            <TouchableOpacity
              style={styles.botaoSair}
              onPress={solicitarLogout}
              activeOpacity={0.8}
            >
              <Text style={styles.iconeSair}>🚪</Text>
              <Text style={styles.textoBotaoSair}>Sair</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── DRAWER MOBILE (Menu Lateral Deslizante) ── */}
        {!isDesktop && (
          <Modal
            visible={drawerOpen}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setDrawerOpen(false)}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <View
                style={{
                  width: "75%",
                  maxWidth: 280,
                  backgroundColor: "#032551",
                  height: "100%",
                  padding: 20,
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <View
                    style={{
                      marginBottom: 24,
                      borderBottomWidth: 1,
                      borderBottomColor: "rgba(255,255,255,0.1)",
                      paddingBottom: 16,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <View style={styles.logoBadge}>
                        <Text style={styles.logoTextoBadge}>PAINEL</Text>
                      </View>
                      <TouchableOpacity onPress={() => setDrawerOpen(false)}>
                        <Text style={{ fontSize: 22, color: "#fff" }}>✕</Text>
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={[
                        styles.tituloMenu,
                        { color: "#fff", fontSize: 16 },
                      ]}
                    >
                      {ehCoordenador
                        ? "Área do Coordenador"
                        : "Gestão Acadêmica"}
                    </Text>
                    <Text
                      style={[styles.subtituloMenu, { color: "#cbd5e1" }]}
                      numberOfLines={1}
                    >
                      {usuarioAtual?.nome}
                    </Text>
                    <Text
                      style={[styles.perfilBadgeTexto, { color: "#fbbf24" }]}
                      numberOfLines={1}
                    >
                      [{usuarioAtual?.perfil}]
                    </Text>
                  </View>

                  <View style={{ gap: 8 }}>{renderBotoesNav()}</View>
                </View>

                <TouchableOpacity
                  style={[styles.botaoSair, { marginTop: "auto" }]}
                  onPress={solicitarLogout}
                  activeOpacity={0.8}
                >
                  <Text style={styles.iconeSair}>🚪</Text>
                  <Text style={styles.textoBotaoSair}>Sair</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={{ flex: 1 }}
                activeOpacity={1}
                onPress={() => setDrawerOpen(false)}
              />
            </View>
          </Modal>
        )}

        {/* ── CONTEÚDO DINÂMICO ── */}
        <View style={{ flex: 1 }}>
          {abaAtiva === "utilizadores" && !ehCoordenador && (
            <GerenciarUsuarios
              usuarioAtual={usuarioAtual}
              onClose={onClose}
              onLogout={onLogout}
            />
          )}
          {(abaAtiva === "eventos" ||
            (abaAtiva === "coordenacao" && ehCoordenador)) &&
            (ehCoordenador ? (
              <PainelCoordenador
                usuarioAtual={usuarioAtual}
                onClose={onClose}
                onLogout={onLogout}
              />
            ) : (
              <GerenciarEventos
                usuarioAtual={usuarioAtual}
                onClose={onClose}
                onLogout={onLogout}
              />
            ))}
          {abaAtiva === "notificacao" && <NotificacaoGlobalTab />}
          {/* 👈 3. Renderização da Aba de Parcerias */}
          {abaAtiva === "parcerias" && !ehCoordenador && <ParceriaTab />}
        </View>
      </View>

      <ConfirmPopup
        visible={confirmPopup.visible}
        titulo={confirmPopup.titulo}
        mensagem={confirmPopup.mensagem}
        tipo={confirmPopup.tipo}
        onConfirm={confirmPopup.onConfirm}
        onCancel={() =>
          setConfirmPopup((prev) => ({ ...prev, visible: false }))
        }
      />
    </AuthGuard>
  );
}
