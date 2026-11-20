import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Dimensions, Linking, Platform } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
import {
  gerarMesesCalendario,
  normalizarEventosComData,
  obterListasEventosPorPeriodo,
  filtrarEventosDoDia,
  renderizarCelulasDiasCalendario,
} from "./Calendario";
import { useNotificacoes } from "./useNotificacoes";
import {
  buscarCursosDoBanco,
  buscarEventosDoBanco,
  buscarServicosDoBanco,
} from "../services/apiServices";
import { buscarAvisosAtivosDoBanco } from "../services/notificacaoService";
import {
  limparSessaoUsuario,
  recuperarSessaoUsuario,
  salvarSessaoUsuario,
} from "../services/sessaoServices";

export function useAppController(styles) {
  // Estado global do Popup
  const [popupInfo, setPopupInfo] = useState({
    visible: false,
    titulo: "",
    mensagem: "",
    tipo: "sucesso",
    duracao: 0,
  });

  const exibirPopup = (titulo, mensagem, tipo = "sucesso", duracaoSegundos = 4) => {
    setPopupInfo({ visible: true, titulo, mensagem, tipo, duracao: duracaoSegundos });
    setTimeout(() => {
      setPopupInfo((prev) => ({ ...prev, visible: false }));
    }, duracaoSegundos * 1000);
  };

  // Consumindo hook auxiliar de notificações locais
  const { notificacoesSalvas, salvarNotificacao, removerNotificacao } = useNotificacoes(exibirPopup);

  // Estados de dados acadêmicos gerenciados na inicialização do controller
  const [todosOsEventos, setTodosOsEventos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [carregandoEventos, setCarregandoEventos] = useState(true);
  const [erroEventos, setErroEventos] = useState(null);

  const [cursosDoBanco, setCursosDoBanco] = useState([]);
  const [carregandoCursos, setCarregandoCursos] = useState(true);
  const [erroCursos, setErroCursos] = useState(null);

  // Estados do calendário e seleção de evento
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [diaFocado, setDiaFocado] = useState(null);
  const [eventosDoDia, setEventosDoDia] = useState([]);

  const semestre = gerarMesesCalendario(4);
  const diasSemana = ["D", "S", "T", "Q", "Q", "S", "S"];

  const eventosValidos = normalizarEventosComData(todosOsEventos);
  const { listaProximos, listaSemana, eventosProximoMes } =
    obterListasEventosPorPeriodo(eventosValidos);

  const handleDiaClick = (mesNome, diaNumero, anoMes) => {
    setDiaFocado(`${diaNumero} de ${mesNome} de ${anoMes}`);
    setEventosDoDia(filtrarEventosDoDia(eventosValidos, mesNome, diaNumero, anoMes));
  };

  const renderizarDias = (mesNome, totalDias, espacosVazios, anoMes) =>
    renderizarCelulasDiasCalendario({
      styles,
      mesNome,
      totalDias,
      espacosVazios,
      anoMes,
      eventosValidos,
      diaFocado,
      onSelecionarDia: handleDiaClick,
    });

  const renderCartaoPequeno = (evento) => (
    <View key={evento.id} style={styles.cartaoPequeno}>
      <Text style={styles.tagCartaoPequeno}>{evento.tipo}</Text>
      <Text style={styles.tituloCartaoPequeno} numberOfLines={2}>{evento.titulo}</Text>
      <Text style={styles.dataCartaoPequeno}>{evento.dia} de {evento.mes}</Text>
      <TouchableOpacity style={styles.btnVerDescricaoMini} onPress={() => setEventoSelecionado(evento)}>
        <Text style={styles.btnTextoMini}>+ Detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  const cursosDestaque = (cursosDoBanco || []).filter(
    (curso) => curso.modalidade === "Graduação" && curso.tipo !== "Online/EAD"
  );

  const cursosTecnicos = (cursosDoBanco || []).filter(
    (curso) => curso.tipo === "Online/EAD" || curso.modalidade === "Técnico"
  );

  const handleSelecionarCurso = (curso) => {
    if (curso.link) {
      Linking.openURL(curso.link);
    } else {
      exibirPopup("Aviso", `Curso selecionado: ${curso.nome || curso.titulo}`, "sucesso", 3);
    }
  };

  // Estados de controle e navegação
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
  const [avisosAtivos, setAvisosAtivos] = useState([]);
  const [avisoLeituraAtual, setAvisoLeituraAtual] = useState(null);

  const abrirLeituraAviso = (aviso) => {
    setAvisoLeituraAtual(aviso || null);
  };

  const fecharLeituraAviso = () => {
    setAvisoLeituraAtual(null);
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  // Inicialização unificada: sessão, onboarding e dados acadêmicos
  useEffect(() => {
    let ativo = true;

    async function inicializarApp() {
      try {
        const usuarioSalvo = await recuperarSessaoUsuario();
        if (ativo && usuarioSalvo) {
          setUtilizadorLogado(usuarioSalvo);
          const perfil = usuarioSalvo.perfil ? usuarioSalvo.perfil.trim().toLowerCase() : "";
          if (perfil.includes("gerência") || perfil.includes("gerencia") || perfil.includes("coordenador")) {
            setModalGerenciaVisivel(true);
          }
        }

        const salvos = await AsyncStorage.getItem("@cursos_selecionados");
        if (ativo) {
          if (salvos && JSON.parse(salvos).length >= 3) {
            setCursosSelecionados(JSON.parse(salvos));
            setMostrarOnboarding(false);
          } else {
            setMostrarOnboarding(true);
          }
        }
      } catch (e) {
        if (ativo) setMostrarOnboarding(true);
      } finally {
        if (ativo) setCarregandoSessao(false);
      }

      if (!ativo) return;

      setCarregandoCursos(true);
      setCarregandoEventos(true);

      const [resCursos, resEventos, resServicos] = await Promise.allSettled([
        buscarCursosDoBanco(),
        buscarEventosDoBanco(),
        buscarServicosDoBanco(),
      ]);

      if (!ativo) return;

      if (resCursos.status === "fulfilled") {
        setCursosDoBanco(resCursos.value || []);
        setErroCursos(null);
      } else {
        const msg = resCursos.reason instanceof Error
          ? resCursos.reason.message
          : "Não foi possível carregar os cursos.";
        setErroCursos(msg);
        exibirPopup("❌ Erro nos Cursos", msg, "erro", 4);
      }
      setCarregandoCursos(false);

      if (resEventos.status === "fulfilled") {
        setTodosOsEventos(resEventos.value || []);
        setErroEventos(null);
      } else {
        setTodosOsEventos([]);
        const msg = resEventos.reason instanceof Error
          ? resEventos.reason.message
          : "Erro ao carregar eventos.";
        setErroEventos(msg);
        exibirPopup("❌ Erro nos Eventos", msg, "erro", 4);
      }
      setCarregandoEventos(false);

      if (resServicos.status === "fulfilled") {
        setServicos(resServicos.value || []);
      } else {
        console.log("Erro ao carregar serviços no mural:", resServicos.reason);
      }
    }

    inicializarApp();
    return () => {
      ativo = false;
    };
  }, []);

  const handleConcluirSetup = async (cursosEscolhidos) => {
    try {
      await AsyncStorage.setItem("@cursos_selecionados", JSON.stringify(cursosEscolhidos));
      setCursosSelecionados(cursosEscolhidos);
      setMostrarOnboarding(false);
      exibirPopup("✨ Cursos Atualizados!", "Seu feed de eventos foi personalizado.", "sucesso", 4);
    } catch (error) {
      console.log("Erro ao salvar cursos", error);
    }
  };

  const handlePularOnboarding = () => {
    setMostrarOnboarding(false);
    if (cursosSelecionados.length > 0) {
      exibirPopup("ℹ️ Edição Cancelada", "Você pode refazer sua lista de cursos a qualquer momento entrando na aba Configurações.", "aviso", 5);
    } else {
      exibirPopup("ℹ️ Lembrete", "Você pode personalizar seus cursos a qualquer momento no topo do mural.", "aviso", 5);
    }
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
      exibirPopup("Acesso Negado", "Perfil sem autorização para painel.", "erro");
    }
  };

  const handleLogout = async () => {
    await limparSessaoUsuario();
    setUtilizadorLogado(null);
    setModalGerenciaVisivel(false);
    setModalCoordenadorVisivel(false);
  };

  useEffect(() => {
    async function carregarAvisos() {
      try {
        const avisos = await buscarAvisosAtivosDoBanco(cursosSelecionados);
        setAvisosAtivos(avisos);

        if (activeTab === "mural" && avisos.length > 0) {
          const ultimoAviso = avisos[0];
          const ultimoAvisoVistoId = await AsyncStorage.getItem("@ultimo_aviso_visto_id");

          if (String(ultimoAvisoVistoId) !== String(ultimoAviso.id)) {
            setTimeout(() => {
              abrirLeituraAviso(ultimoAviso);
            }, 1800);

            await AsyncStorage.setItem("@ultimo_aviso_visto_id", String(ultimoAviso.id));
          }
        }
      } catch (error) {
        console.log("Erro ao carregar avisos:", error);
      }
    }

    if (!carregandoSessao) {
      carregarAvisos();
    }
  }, [cursosSelecionados, carregandoSessao, activeTab]);

  const reexibirAvisoPopup = (aviso) => {
    abrirLeituraAviso(aviso);
  };

  const isDesktop = Platform.OS === "web" && windowWidth >= 768;

  return {
    eventoSelecionado, setEventoSelecionado,
    diaFocado, eventosDoDia, carregandoEventos, erroEventos,
    diasSemana, semestre,
    listaProximos, listaSemana, eventosProximoMes,
    cursosDestaque,
    cursosTecnicos,
    handleSelecionarCurso,
    carregandoCursos, erroCursos,
    notificacoesSalvas,
    salvarNotificacao,
    removerNotificacao,
    renderizarDias,
    renderCartaoPequeno,
    popupInfo, setPopupInfo,
    exibirPopup,
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
    handleLogout,
    avisosAtivos,
    avisoLeituraAtual,
    abrirLeituraAviso,
    fecharLeituraAviso,
    reexibirAvisoPopup,
    todosOsEventos: eventosValidos,
    cursos: cursosDoBanco,
    servicos,
  };
}