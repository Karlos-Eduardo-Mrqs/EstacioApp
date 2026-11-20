import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {gerarMesesCalendario,normalizarEventosComData,obterListasEventosPorPeriodo,renderizarCelulasDiasCalendario,} from "./Calendario";
import { useNotificacoes } from "./useNotificacoes";
import { useMuralUI } from "./useMuralUI";
import { buscarServicosDoBanco } from "../services/servicoService";
import {buscarCursosDoBanco} from "../services/cursoServices";
import {buscarEventosDoBanco,} from "../services/eventoServices";
import { buscarAvisosAtivosDoBanco } from "../services/notificacaoService";
import {limparSessaoUsuario,recuperarSessaoUsuario,salvarSessaoUsuario,} from "../services/sessaoServices";

export function useAppController(styles) {
  const [todosOsEventos, setTodosOsEventos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [carregandoEventos, setCarregandoEventos] = useState(true);
  const [erroEventos, setErroEventos] = useState(null);

  const [cursosDoBanco, setCursosDoBanco] = useState([]);
  const [carregandoCursos, setCarregandoCursos] = useState(true);
  const [erroCursos, setErroCursos] = useState(null);

  const [mostrarOnboarding, setMostrarOnboarding] = useState(false);
  const [cursosSelecionados, setCursosSelecionados] = useState([]);
  const [stepInicialOnboarding, setStepInicialOnboarding] = useState(1);
  const [carregandoSessao, setCarregandoSessao] = useState(true);
  const [utilizadorLogado, setUtilizadorLogado] = useState(null);
  const [avisosAtivos, setAvisosAtivos] = useState([]);

  const eventosValidos = normalizarEventosComData(todosOsEventos);

  const ui = useMuralUI(eventosValidos);
  const { notificacoesSalvas, salvarNotificacao, removerNotificacao } = useNotificacoes(
    ui.exibirPopup
  );

  const semestre = gerarMesesCalendario(4);
  const diasSemana = ["D", "S", "T", "Q", "Q", "S", "S"];
  const { listaProximos, listaSemana, eventosProximoMes } =
    obterListasEventosPorPeriodo(eventosValidos);

  const renderizarDias = (mesNome, totalDias, espacosVazios, anoMes) =>
    renderizarCelulasDiasCalendario({
      styles,
      mesNome,
      totalDias,
      espacosVazios,
      anoMes,
      eventosValidos,
      diaFocado: ui.diaFocado,
      onSelecionarDia: ui.handleDiaClick,
    });

  const renderCartaoPequeno = (evento) => (
    <View key={evento.id} style={styles.cartaoPequeno}>
      <Text style={styles.tagCartaoPequeno}>{evento.tipo}</Text>
      <Text style={styles.tituloCartaoPequeno} numberOfLines={2}>
        {evento.titulo}
      </Text>
      <Text style={styles.dataCartaoPequeno}>
        {evento.dia} de {evento.mes}
      </Text>
      <TouchableOpacity
        style={styles.btnVerDescricaoMini}
        onPress={() => ui.setEventoSelecionado(evento)}
      >
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

  useEffect(() => {
    let ativo = true;

    async function inicializarApp() {
      try {
        const usuarioSalvo = await recuperarSessaoUsuario();
        if (ativo && usuarioSalvo) {
          setUtilizadorLogado(usuarioSalvo);
          const perfil = usuarioSalvo.perfil
            ? usuarioSalvo.perfil.trim().toLowerCase()
            : "";
          if (
            perfil.includes("gerência") ||
            perfil.includes("gerencia") ||
            perfil.includes("coordenador")
          ) {
            ui.setModalGerenciaVisivel(true);
          }
        }

        const salvos = await AsyncStorage.getItem("@cursos_selecionados");
        if (ativo) {
          const parsedCursos = salvos ? JSON.parse(salvos) : [];
          if (Array.isArray(parsedCursos) && parsedCursos.length >= 3) {
            setCursosSelecionados(parsedCursos);
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
        const msg =
          resCursos.reason instanceof Error
            ? resCursos.reason.message
            : "Não foi possível carregar os cursos.";
        setErroCursos(msg);
        ui.exibirPopup("❌ Erro nos Cursos", msg, "erro", 4);
      }
      setCarregandoCursos(false);

      if (resEventos.status === "fulfilled") {
        setTodosOsEventos(resEventos.value || []);
        setErroEventos(null);
      } else {
        setTodosOsEventos([]);
        const msg =
          resEventos.reason instanceof Error
            ? resEventos.reason.message
            : "Erro ao carregar eventos.";
        setErroEventos(msg);
        ui.exibirPopup("❌ Erro nos Eventos", msg, "erro", 4);
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
      await AsyncStorage.setItem(
        "@cursos_selecionados",
        JSON.stringify(cursosEscolhidos)
      );
      setCursosSelecionados(cursosEscolhidos);
      setMostrarOnboarding(false);
      ui.exibirPopup(
        "✨ Cursos Atualizados!",
        "Seu feed de eventos foi personalizado.",
        "sucesso",
        4
      );
    } catch (error) {
      console.log("Erro ao salvar cursos", error);
    }
  };

  const handlePularOnboarding = () => {
    setMostrarOnboarding(false);
    if (cursosSelecionados.length > 0) {
      ui.exibirPopup(
        "ℹ️ Edição Cancelada",
        "Você pode refazer sua lista de cursos a qualquer momento entrando na aba Configurações.",
        "aviso",
        5
      );
    } else {
      ui.exibirPopup(
        "ℹ️ Lembrete",
        "Você pode personalizar seus cursos a qualquer momento no topo do mural.",
        "aviso",
        5
      );
    }
  };

  const handleRedefinirCursos = () => {
    setStepInicialOnboarding(2);
    setMostrarOnboarding(true);
  };

  const handleLoginSucesso = async (usuario) => {
    setUtilizadorLogado(usuario);
    await salvarSessaoUsuario(usuario);
    ui.setModalLoginVisivel(false);
    const perfil = usuario.perfil ? usuario.perfil.trim().toLowerCase() : "";

    if (
      perfil.includes("gerência") ||
      perfil.includes("gerencia") ||
      perfil.includes("coordenador")
    ) {
      ui.setModalGerenciaVisivel(true);
    } else {
      ui.exibirPopup("Acesso Negado", "Perfil sem autorização para painel.", "erro");
    }
  };

  const handleLogout = async () => {
    await limparSessaoUsuario();
    setUtilizadorLogado(null);
    ui.setModalGerenciaVisivel(false);
    ui.setModalCoordenadorVisivel(false);
  };

  useEffect(() => {
    let timerAviso = null;

    async function carregarAvisos() {
      try {
        const avisos = await buscarAvisosAtivosDoBanco(cursosSelecionados);
        setAvisosAtivos(avisos);

        if (ui.activeTab === "mural" && avisos.length > 0) {
          const ultimoAviso = avisos[0];
          const ultimoAvisoVistoId = await AsyncStorage.getItem(
            "@ultimo_aviso_visto_id"
          );

          if (String(ultimoAvisoVistoId) !== String(ultimoAviso.id)) {
            timerAviso = setTimeout(() => {
              ui.abrirLeituraAviso(ultimoAviso);
            }, 1800);

            await AsyncStorage.setItem(
              "@ultimo_aviso_visto_id",
              String(ultimoAviso.id)
            );
          }
        }
      } catch (error) {
        console.log("Erro ao carregar avisos:", error);
      }
    }

    if (!carregandoSessao) {
      carregarAvisos();
    }

    return () => {
      if (timerAviso) clearTimeout(timerAviso);
    };
  }, [cursosSelecionados, carregandoSessao, ui.activeTab]);

  return {
    eventoSelecionado: ui.eventoSelecionado,
    setEventoSelecionado: ui.setEventoSelecionado,
    diaFocado: ui.diaFocado,
    eventosDoDia: ui.eventosDoDia,
    carregandoEventos,
    erroEventos,
    diasSemana,
    semestre,
    listaProximos,
    listaSemana,
    eventosProximoMes,
    cursosDestaque,
    cursosTecnicos,
    handleSelecionarCurso: ui.handleSelecionarCurso,
    carregandoCursos,
    erroCursos,
    notificacoesSalvas,
    salvarNotificacao,
    removerNotificacao,
    renderizarDias,
    renderCartaoPequeno,
    popupInfo: ui.popupInfo,
    setPopupInfo: ui.setPopupInfo,
    exibirPopup: ui.exibirPopup,
    mostrarOnboarding,
    cursosSelecionados,
    stepInicialOnboarding,
    carregandoSessao,
    modalDevsVisivel: ui.modalDevsVisivel,
    setModalDevsVisivel: ui.setModalDevsVisivel,
    cursoSelecionado: ui.cursoSelecionado,
    setCursoSelecionado: ui.setCursoSelecionado,
    modalLoginVisivel: ui.modalLoginVisivel,
    setModalLoginVisivel: ui.setModalLoginVisivel,
    modalGerenciaVisivel: ui.modalGerenciaVisivel,
    setModalGerenciaVisivel: ui.setModalGerenciaVisivel,
    modalCoordenadorVisivel: ui.modalCoordenadorVisivel,
    setModalCoordenadorVisivel: ui.setModalCoordenadorVisivel,
    utilizadorLogado,
    activeTab: ui.activeTab,
    setActiveTab: ui.setActiveTab,
    isDesktop: ui.isDesktop,
    handleConcluirSetup,
    handlePularOnboarding,
    handleRedefinirCursos,
    handleLoginSucesso,
    handleLogout,
    avisosAtivos,
    avisoLeituraAtual: ui.avisoLeituraAtual,
    abrirLeituraAviso: ui.abrirLeituraAviso,
    fecharLeituraAviso: ui.fecharLeituraAviso,
    reexibirAvisoPopup: ui.reexibirAvisoPopup,
    todosOsEventos: eventosValidos,
    cursos: cursosDoBanco,
    servicos,
  };
}