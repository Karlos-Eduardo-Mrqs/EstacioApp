import { useEffect, useState } from "react";
import {
  Modal,
  Platform,
  ScrollView,
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
  const { width, height } = useWindowDimensions();

  const isDesktop = Platform.OS === "web" && width >= 768;
  const isCompactHeight = height < 680;
  const drawerWidth = Math.min(Math.max(width * 0.74, 240), 320);

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
          style={[
            styles.botaoNav,
            isCompactHeight && { paddingVertical: 9 },
            ativa && styles.botaoNavAtivo,
          ]}
          onPress={() => selecionarAba(item.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.iconeNav}>
            <CustomIcon name={item.icon} size={18} color="#fff" />
          </Text>
          {(isDesktop || drawerOpen) && (
            <Text
              numberOfLines={1}
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
              height: 56,
              backgroundColor: "#032551",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 14,
              elevation: 4,
            }}
          >
            <TouchableOpacity
              onPress={() => setDrawerOpen(true)}
              style={{ padding: 6 }}
            >
              <Text style={{ fontSize: 22, color: "#fff" }}>☰</Text>
            </TouchableOpacity>
            <Text
              numberOfLines={1}
              style={{
                flex: 1,
                textAlign: "center",
                fontSize: width < 360 ? 14 : 16,
                fontWeight: "bold",
                color: "#fff",
                marginHorizontal: 8,
              }}
            >
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

            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={styles.botoesWrapper}
              showsVerticalScrollIndicator={false}
            >
              {renderBotoesNav()}
            </ScrollView>

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
                  width: drawerWidth,
                  backgroundColor: "#032551",
                  height: "100%",
                  paddingHorizontal: 16,
                  paddingTop: isCompactHeight ? 14 : 20,
                  paddingBottom: 16,
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    marginBottom: isCompactHeight ? 12 : 16,
                    borderBottomWidth: 1,
                    borderBottomColor: "rgba(255,255,255,0.1)",
                    paddingBottom: isCompactHeight ? 10 : 14,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <View style={styles.logoBadge}>
                      <Text style={styles.logoTextoBadge}>PAINEL</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => setDrawerOpen(false)}
                      style={{ padding: 4 }}
                    >
                      <Text style={{ fontSize: 20, color: "#fff" }}>✕</Text>
                    </TouchableOpacity>
                  </View>
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.tituloMenu,
                      { color: "#fff", fontSize: width < 360 ? 14 : 16 },
                    ]}
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

                <ScrollView
                  style={{ flex: 1 }}
                  contentContainerStyle={{ gap: isCompactHeight ? 5 : 8, paddingBottom: 8 }}
                  showsVerticalScrollIndicator={false}
                >
                  {renderBotoesNav()}
                </ScrollView>

                <TouchableOpacity
                  style={[
                    styles.botaoSair,
                    {
                      marginTop: 10,
                      paddingVertical: isCompactHeight ? 10 : 12,
                    },
                  ]}
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