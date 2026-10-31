import { useState, useEffect } from "react";
import { Dimensions, Platform} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { salvarSessaoUsuario, recuperarSessaoUsuario, limparSessaoUsuario } from "../services/sessaoServices";

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
  const [windowWidth, setWindowWidth] = useState(Dimensions.get("window").width);

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
          const perfil = usuarioSalvo.perfil ? usuarioSalvo.perfil.trim().toLowerCase() : "";
          if (perfil.includes("gerência") || perfil.includes("gerencia") || perfil.includes("coordenador")) {
            setModalGerenciaVisivel(true);
          }
        }

        const salvos = await AsyncStorage.getItem('@cursos_selecionados');
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
      await AsyncStorage.setItem('@cursos_selecionados', JSON.stringify(cursosEscolhidos));
      setCursosSelecionados(cursosEscolhidos);
      setMostrarOnboarding(false);
      scriptApp.exibirPopup("✨ Cursos Atualizados!", "Seu feed de eventos foi personalizado.", "sucesso", 4);
    } catch (error) {
      console.log("Erro ao salvar cursos", error);
    }
  };

  const handlePularOnboarding = () => {
    setMostrarOnboarding(false);
    scriptApp.exibirPopup("ℹ️ Lembrete", "Você pode personalizar seus cursos a qualquer momento no topo do mural.", "aviso", 5);
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

    if (perfil.includes("gerência") || perfil.includes("gerencia") || perfil.includes("coordenador")) {
      setModalGerenciaVisivel(true);
    } else {
      scriptApp.exibirPopup("Acesso Negado", "Perfil sem autorização para painel.", "erro");
    }
  };

  const handleLogout = async () => {
    await limparSessaoUsuario();
    setUtilizadorLogado(null);
    setModalGerenciaVisivel(false);
    setModalCoordenadorVisivel(false);
  };

  const isDesktop = Platform.OS === "web" && windowWidth >= 768;

  return {
    mostrarOnboarding,
    cursosSelecionados,
    stepInicialOnboarding,
    carregandoSessao,
    modalDevsVisivel, setModalDevsVisivel,
    cursoSelecionado, setCursoSelecionado,
    modalLoginVisivel, setModalLoginVisivel,
    modalGerenciaVisivel, setModalGerenciaVisivel,
    modalCoordenadorVisivel, setModalCoordenadorVisivel,
    utilizadorLogado,
    activeTab, setActiveTab,
    isDesktop,
    handleConcluirSetup,
    handlePularOnboarding,
    handleRedefinirCursos,
    handleLoginSucesso,
    handleLogout
  };
}