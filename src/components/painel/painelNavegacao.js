// src/components/painel/painelNavegacao.js
import { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { painelNavegacaostyles as styles } from "../../styles/painel/painelNavegacaostyles";
import ConfirmPopup from "../ConfirmPopup";
import CustomIcon from "../CustomIcon";
import AuthGuard from "../mural/guardaAutenticacao";
import {
  obterAbaInicial,
  obterComponenteAba,
  obterItensPermitidos,
  obterTituloPainel,
  PERFIS_PERMITIDOS_PAINEL,
  verificarCoordenador,
} from "./painelAcessos";

export default function PainelNavigator({ usuarioAtual, onClose, onLogout }) {
  const ehCoordenador = verificarCoordenador(usuarioAtual);
  const tituloPainel = obterTituloPainel(ehCoordenador);
  const itensMenu = obterItensPermitidos(ehCoordenador);

  const [abaAtiva, setAbaAtiva] = useState(() => obterAbaInicial(ehCoordenador));
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

  useEffect(() => {
    const abaInicial = obterAbaInicial(ehCoordenador);
    const aindaPermitida = itensMenu.some((item) => item.id === abaAtiva);
    if (!aindaPermitida) {
      setAbaAtiva(abaInicial);
    }
  }, [ehCoordenador, itensMenu, abaAtiva]);

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

  const ComponenteAtivo = obterComponenteAba(abaAtiva, ehCoordenador);

  const renderBotoesNav = () =>
    itensMenu.map((item) => {
      const ativa = abaAtiva === item.id;
      return (
        <TouchableOpacity
          key={item.id}
          style={[styles.botaoNav, ativa && styles.botaoNavAtivo]}
          onPress={() => selecionarAba(item.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.iconeNav}>
            <CustomIcon name={item.icon} size={18} color="#fff" />
          </Text>
          {(isDesktop || drawerOpen) && (
            <Text
              style={[
                styles.textoBotaoNav,
                ativa && styles.textoBotaoNavAtivo,
              ]}
            >
              {item.label}
            </Text>
          )}
        </TouchableOpacity>
      );
    });

  return (
    <AuthGuard
      usuarioAtual={usuarioAtual}
      perfilPermitido={PERFIS_PERMITIDOS_PAINEL}
      onVoltar={onClose}
    >
      <View
        style={[
          styles.containerPrincipal,
          { flexDirection: isDesktop ? "row" : "column" },
        ]}
      >
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
            }}
          >
            <TouchableOpacity
              onPress={() => setDrawerOpen(true)}
              style={{ padding: 8 }}
            >
              <Text style={{ fontSize: 24, color: "#fff" }}>☰</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}>
              {tituloPainel}
            </Text>
            <View style={{ width: 32 }} />
          </View>
        )}

        {isDesktop ? (
          <View style={[styles.navContainer, styles.sidebarDesktop]}>
            <View style={styles.headerDesktop}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoTextoBadge}>PAINEL</Text>
              </View>
              <Text style={styles.tituloMenu}>{tituloPainel}</Text>
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
        ) : (
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
                      style={[styles.tituloMenu, { color: "#fff", fontSize: 16 }]}
                    >
                      {tituloPainel}
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

        <View style={{ flex: 1 }}>
          {ComponenteAtivo ? (
            <ComponenteAtivo
              usuarioAtual={usuarioAtual}
              onClose={onClose}
              onLogout={onLogout}
            />
          ) : null}
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