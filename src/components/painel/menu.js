import { View, Text, TouchableOpacity, Modal } from "react-native";
import { painelNavegacaostyles as styles } from "../../styles/painel/painelNavegacaostyles";
import CustomIcon from "../CustomIcon";

export default function PainelMenu({
  ehCoordenador,
  abaAtiva,
  selecionarAba,
  isDesktop,
  drawerOpen,
  setDrawerOpen,
  usuarioAtual,
  solicitarLogout,
}) {
  const renderBotoesNav = () => (
    <>
      {/* 👤 Apenas Gerência: Gestão de Coordenadores / Utilizadores */}
      {!ehCoordenador && (
        <TouchableOpacity
          style={[styles.botaoNav, abaAtiva === "utilizadores" && styles.botaoNavAtivo]}
          onPress={() => selecionarAba("utilizadores")}
          activeOpacity={0.8}
        >
          <Text style={styles.iconeNav}><CustomIcon name="person-circle-outline" size={18} color="#fff"/></Text>
          {(isDesktop || drawerOpen) && (
            <Text style={[styles.textoBotaoNav, abaAtiva === "utilizadores" && styles.textoBotaoNavAtivo]}>
              Coordenadores
            </Text>
          )}
        </TouchableOpacity>
      )}

      {/* 📰 Publicações (Disponível para Gerência e Coordenador) */}
      <TouchableOpacity
        style={[styles.botaoNav, abaAtiva === "publicacoes" && styles.botaoNavAtivo]}
        onPress={() => selecionarAba("publicacoes")}
        activeOpacity={0.8}
      >
        <Text style={styles.iconeNav}><CustomIcon name="document-text-outline" size={18} color="#fff"/></Text>
        {(isDesktop || drawerOpen) && (
          <Text style={[styles.textoBotaoNav, abaAtiva === "publicacoes" && styles.textoBotaoNavAtivo]}>
            Publicações
          </Text>
        )}
      </TouchableOpacity>

      {/* 📅 Eventos (Ambos acessam) */}
      <TouchableOpacity
        style={[styles.botaoNav, abaAtiva === "eventos" && styles.botaoNavAtivo]}
        onPress={() => selecionarAba("eventos")}
        activeOpacity={0.8}
      >
        <Text style={styles.iconeNav}><CustomIcon name="calendar" size={18} color="#fff"/></Text>
        {(isDesktop || drawerOpen) && (
          <Text style={[styles.textoBotaoNav, abaAtiva === "eventos" && styles.textoBotaoNavAtivo]}>
            Eventos
          </Text>
        )}
      </TouchableOpacity>

      {/* 📢 Notificação Global (Ambos acessam) */}
      <TouchableOpacity
        style={[styles.botaoNav, abaAtiva === "notificacao" && styles.botaoNavAtivo]}
        onPress={() => selecionarAba("notificacao")}
        activeOpacity={0.8}
      >
        <Text style={styles.iconeNav}><CustomIcon name="bell" size={18} color="#fff" /></Text>
        {(isDesktop || drawerOpen) && (
          <Text style={[styles.textoBotaoNav, abaAtiva === "notificacao" && styles.textoBotaoNavAtivo]}>
            Notificação Global
          </Text>
        )}
      </TouchableOpacity>

      {/* 🤝 Parcerias (Apenas Gerência) */}
      {!ehCoordenador && (
        <TouchableOpacity
          style={[styles.botaoNav, abaAtiva === "parcerias" && styles.botaoNavAtivo]}
          onPress={() => selecionarAba("parcerias")}
          activeOpacity={0.8}
        >
          <Text style={styles.iconeNav}><CustomIcon name="card-outline" size={18} color="#fff" /></Text>
          {(isDesktop || drawerOpen) && (
            <Text style={[styles.textoBotaoNav, abaAtiva === "parcerias" && styles.textoBotaoNavAtivo]}>
              Parcerias
            </Text>
          )}
        </TouchableOpacity>
      )}

      {/* 🏢 Serviços (Ambos acessam) */}
      <TouchableOpacity
        style={[styles.botaoNav, abaAtiva === "servicos" && styles.botaoNavAtivo]}
        onPress={() => selecionarAba("servicos")}
        activeOpacity={0.8}
      >
        <Text style={styles.iconeNav}><CustomIcon name="business-outline" size={18} color="#fff" /></Text>
        {(isDesktop || drawerOpen) && (
          <Text style={[styles.textoBotaoNav, abaAtiva === "servicos" && styles.textoBotaoNavAtivo]}>
            Serviços
          </Text>
        )}
      </TouchableOpacity>

      {/* 📚 Cursos (Ambos acessam) */}
      <TouchableOpacity
        style={[styles.botaoNav, abaAtiva === "cursos" && styles.botaoNavAtivo]}
        onPress={() => selecionarAba("cursos")}
        activeOpacity={0.8}
      >
        <Text style={styles.iconeNav}><CustomIcon name="book-outline" size={18} color="#fff" /></Text>
        {(isDesktop || drawerOpen) && (
          <Text style={[styles.textoBotaoNav, abaAtiva === "cursos" && styles.textoBotaoNavAtivo]}>
            Cursos
          </Text>
        )}
      </TouchableOpacity>
    </>
  );

  if (isDesktop) {
    return (
      <View style={[styles.navContainer, styles.sidebarDesktop]}>
        <View style={styles.headerDesktop}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoTextoBadge}>PAINEL</Text>
          </View>
          <Text style={styles.tituloMenu}>
            {ehCoordenador ? "Área do Coordenador" : "Gestão Acadêmica"}
          </Text>
          <Text style={styles.subtituloMenu} numberOfLines={1}>{usuarioAtual?.nome}</Text>
          <Text style={styles.perfilBadgeTexto} numberOfLines={1}>[{usuarioAtual?.perfil}]</Text>
        </View>

        <View style={styles.botoesWrapper}>{renderBotoesNav()}</View>

        <TouchableOpacity style={styles.botaoSair} onPress={solicitarLogout} activeOpacity={0.8}>
          <Text style={styles.iconeSair}>🚪</Text>
          <Text style={styles.textoBotaoSair}>Sair</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Modal visible={drawerOpen} transparent={true} animationType="fade" onRequestClose={() => setDrawerOpen(false)}>
      <View style={{ flex: 1, flexDirection: "row", backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View style={{ width: "75%", maxWidth: 280, backgroundColor: "#032551", height: "100%", padding: 20, justifyContent: "space-between" }}>
          <View>
            <View style={{ marginBottom: 24, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.1)", paddingBottom: 16 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <View style={styles.logoBadge}>
                  <Text style={styles.logoTextoBadge}>PAINEL</Text>
                </View>
                <TouchableOpacity onPress={() => setDrawerOpen(false)}>
                  <Text style={{ fontSize: 22, color: "#fff" }}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.tituloMenu, { color: "#fff", fontSize: 16 }]}>
                {ehCoordenador ? "Área do Coordenador" : "Gestão Acadêmica"}
              </Text>
              <Text style={[styles.subtituloMenu, { color: "#cbd5e1" }]} numberOfLines={1}>
                {usuarioAtual?.nome}
              </Text>
              <Text style={[styles.perfilBadgeTexto, { color: "#fbbf24" }]} numberOfLines={1}>
                [{usuarioAtual?.perfil}]
              </Text>
            </View>

            <View style={{ gap: 8 }}>{renderBotoesNav()}</View>
          </View>

          <TouchableOpacity style={[styles.botaoSair, { marginTop: "auto" }]} onPress={solicitarLogout} activeOpacity={0.8}>
            <Text style={styles.iconeSair}>🚪</Text>
            <Text style={styles.textoBotaoSair}>Sair</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={{ flex: 1 }} activeOpacity={1} onPress={() => setDrawerOpen(false)} />
      </View>
    </Modal>
  );
}