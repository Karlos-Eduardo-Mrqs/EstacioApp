import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Dimensions, Platform } from "react-native";
import { buscarAvisosAtivosDoBanco } from "../services/notificacaoService";
import {
  limparSessaoUsuario,
  recuperarSessaoUsuario,
  salvarSessaoUsuario,
} from "../services/sessaoServices";

export function useAppController(scriptApp) {
  const [mostrarOnboarding, setMostrarOnboarding] = useState(false);
  const [cursosSelecionados, setCursosSelecionados] = useState([]);
  const [stepInicialOnboarding, setStepInicialOnboarding] = useState(1);
  const [carregandoSessao, setCarregandoSessao] = useState(true);

  const [modalDevsVisivel, setModalDevsVisivel] = useState(false);
  const [cursoSelecionado, setCursoSelecionado] = useState(null);
  const [modalLoginVisivel, setModalLoginVisivel] = useState(false);
  const [modalGerenciaVisivel, setModalGerenciaVisivel] = useState(false);
  const [modalCoordenadorVisivel, setModalCoordenadorVisivel] = useState(false);
  const [utilizadorLogado, setUtilizadorLogado] = useState(null);

  const [activeTab, setActiveTab] = useState("mural");
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width,
  );
  const [avisosAtivos, setAvisosAtivos] = useState([]);

  // Listener para redimensionamento de tela (Responsividade Web/Mobile)
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  // Inicialização de sessão e onboarding
  useEffect(() => {
    async function inicializarApp() {
      try {
        const usuarioSalvo = await recuperarSessaoUsuario();
        if (usuarioSalvo) {
          setUtilizadorLogado(usuarioSalvo);
          const perfil = usuarioSalvo.perfil
            ? usuarioSalvo.perfil.trim().toLowerCase()
            : "";
          if (
            perfil.includes("gerência") ||
            perfil.includes("gerencia") ||
            perfil.includes("coordenador")
          ) {
            setModalGerenciaVisivel(true);
          }
        }

        const salvos = await AsyncStorage.getItem("@cursos_selecionados");
        if (salvos && JSON.parse(salvos).length >= 3) {
          setCursosSelecionados(JSON.parse(salvos));
          setMostrarOnboarding(false);
        } else {
          setMostrarOnboarding(true);
        }
      } catch (e) {
        setMostrarOnboarding(true);
      } finally {
        setCarregandoSessao(false);
      }
    }
    inicializarApp();
  }, []);

  const handleConcluirSetup = async (cursosEscolhidos) => {
    try {
      await AsyncStorage.setItem(
        "@cursos_selecionados",
        JSON.stringify(cursosEscolhidos),
      );
      setCursosSelecionados(cursosEscolhidos);
      setMostrarOnboarding(false);
      scriptApp.exibirPopup(
        "✨ Cursos Atualizados!",
        "Seu feed de eventos foi personalizado.",
        "sucesso",
        4,
      );
    } catch (error) {
      console.log("Erro ao salvar cursos", error);
    }
  };

  const handlePularOnboarding = () => {
    setMostrarOnboarding(false);
    scriptApp.exibirPopup(
      "ℹ️ Lembrete",
      "Você pode personalizar seus cursos a qualquer momento no topo do mural.",
      "aviso",
      5,
    );
  };

  const handleRedefinirCursos = () => {
    setStepInicialOnboarding(2);
    setMostrarOnboarding(true);
  };

  const handleLoginSucesso = async (usuario) => {
    setUtilizadorLogado(usuario);
    await salvarSessaoUsuario(usuario);
    setModalLoginVisivel(false);
    const perfil = usuario.perfil ? usuario.perfil.trim().toLowerCase() : "";

    if (
      perfil.includes("gerência") ||
      perfil.includes("gerencia") ||
      perfil.includes("coordenador")
    ) {
      setModalGerenciaVisivel(true);
    } else {
      scriptApp.exibirPopup(
        "Acesso Negado",
        "Perfil sem autorização para painel.",
        "erro",
      );
    }
  };

  const handleLogout = async () => {
    await limparSessaoUsuario();
    setUtilizadorLogado(null);
    setModalGerenciaVisivel(false);
    setModalCoordenadorVisivel(false);
  };

  useEffect(() => {
    //  CONTROLO INTELIGENTE DE AVISOS E POPUPS ──
    async function carregarAvisos() {
      try {
        const avisos = await buscarAvisosAtivosDoBanco(cursosSelecionados);
        setAvisosAtivos(avisos);

        // REGRA 1: Só dispara o popup se o utilizador estiver estritamente na aba "mural"
        // (Evita disparar se estiver no painel de gerência ou noutra aba)
        if (activeTab === "mural" && avisos.length > 0) {
          const ultimoAviso = avisos[0];

          // REGRA 2: Verifica no armazenamento local se este aviso já foi visto
          const ultimoAvisoVistoId = await AsyncStorage.getItem(
            "@ultimo_aviso_visto_id",
          );

          if (String(ultimoAvisoVistoId) !== String(ultimoAviso.id)) {
            // É um aviso novo ou a primeira vez que o utilizador entra!
            setTimeout(() => {
              scriptApp.exibirPopup(
                `📢 ${ultimoAviso.titulo}`,
                ultimoAviso.mensagem,
                "sucesso",
                7,
              );
            }, 1800);

            // Grava o ID deste aviso como já visto para não repetir no F5/recarregamento
            await AsyncStorage.setItem(
              "@ultimo_aviso_visto_id",
              String(ultimoAviso.id),
            );
          }
        }
      } catch (error) {
        console.log("Erro ao carregar avisos:", error);
      }
    }

    if (!carregandoSessao && cursosSelecionados.length > 0) {
      carregarAvisos();
    }
  }, [cursosSelecionados, carregandoSessao, activeTab]); // Dispara também ao mudar de aba se for para o mural

  const reexibirAvisoPopup = (aviso) => {
    scriptApp.exibirPopup(`📢 ${aviso.titulo}`, aviso.mensagem, "sucesso", 7);
  };

  const isDesktop = Platform.OS === "web" && windowWidth >= 768;

  return {
    mostrarOnboarding,
    cursosSelecionados,
    stepInicialOnboarding,
    carregandoSessao,
    modalDevsVisivel,
    setModalDevsVisivel,
    cursoSelecionado,
    setCursoSelecionado,
    modalLoginVisivel,
    setModalLoginVisivel,
    modalGerenciaVisivel,
    setModalGerenciaVisivel,
    modalCoordenadorVisivel,
    setModalCoordenadorVisivel,
    utilizadorLogado,
    activeTab,
    setActiveTab,
    isDesktop,
    handleConcluirSetup,
    handlePularOnboarding,
    handleRedefinirCursos,
    handleLoginSucesso,
    handleLogout,
    avisosAtivos,
    setAvisosAtivos,
    reexibirAvisoPopup,
  };
}
