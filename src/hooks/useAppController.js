import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Dimensions, Platform } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
import { gerarMesesCalendario, nomesMeses } from "./Calendario";
import { useNotificacoes } from "./useNotificacoes";
import { useDadosAcademicos } from "./useDadosAcademicos";
import { buscarAvisosAtivosDoBanco } from "../services/notificacaoService";
import {limparSessaoUsuario,recuperarSessaoUsuario,salvarSessaoUsuario,} from "../services/sessaoServices";

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

  // Consumindo os hooks auxiliares
  const { notificacoesSalvas, salvarNotificacao, removerNotificacao } = useNotificacoes(exibirPopup);
  const { todosOsEventos, carregandoEventos, erroEventos, cursosDoBanco, carregandoCursos, erroCursos,servicos} = useDadosAcademicos(exibirPopup);

  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [diaFocado, setDiaFocado] = useState(null);
  const [eventosDoDia, setEventosDoDia] = useState([]);

  const semestre = gerarMesesCalendario(4);
  const diasSemana = ["D", "S", "T", "Q", "Q", "S", "S"];

  // Filtros de datas e blindagem de objetos Date
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const eventosValidos = (todosOsEventos || []).map(evento => ({
    ...evento,
    dataEvento: evento.dataEvento instanceof Date && !isNaN(evento.dataEvento) 
      ? evento.dataEvento 
      : (evento.data ? new Date(evento.data) : new Date())
  }));

  const eventosOrdenados = [...eventosValidos].sort((a, b) => {
    return a.dataEvento.getTime() - b.dataEvento.getTime();
  });

  const listaProximos = eventosOrdenados.filter((evento) => evento.dataEvento >= hoje).slice(0, 6);

  const limiteSemana = new Date(hoje);
  limiteSemana.setDate(limiteSemana.getDate() + 7);
  const listaSemana = eventosOrdenados.filter((evento) => evento.dataEvento >= hoje && evento.dataEvento <= limiteSemana).slice(0, 6);

  const primeiroDiaProximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
  const primeiroDiaMesSeguinte = new Date(primeiroDiaProximoMes.getFullYear(), primeiroDiaProximoMes.getMonth() + 1, 1);
  const eventosProximoMes = eventosOrdenados.filter((evento) => evento.dataEvento >= primeiroDiaProximoMes && evento.dataEvento < primeiroDiaMesSeguinte).slice(0, 6);

  // Manipulação do Calendário
  const handleDiaClick = (mesNome, diaNumero, anoMes) => {
    const mesIndex = nomesMeses.indexOf(mesNome);
    setDiaFocado(`${diaNumero} de ${mesNome} de ${anoMes}`);
    const eventosEncontrados = eventosValidos.filter(
      (evento) =>
        evento.dataEvento.getFullYear() === anoMes &&
        evento.dataEvento.getMonth() === mesIndex &&
        evento.dataEvento.getDate() === diaNumero
    );
    setEventosDoDia(eventosEncontrados);
  };

  const renderizarDias = (mesNome, totalDias, espacosVazios, anoMes) => {
    let celulas = [];
    for (let i = 0; i < espacosVazios; i++) {
      celulas.push(<View key={`vazio-${i}`} style={styles.celulaDia}></View>);
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      const mesIndex = nomesMeses.indexOf(mesNome.split(" ")[0]);
      
      const isDestaque = eventosValidos.some(
        (evento) => 
          evento.dataEvento && 
          evento.dataEvento.getFullYear() === anoMes && 
          evento.dataEvento.getMonth() === mesIndex && 
          evento.dataEvento.getDate() === dia
      );
      
      const isSelecionado = diaFocado === `${dia} de ${mesNome.split(" ")[0]}`;

      celulas.push(
        <TouchableOpacity
          key={`dia-${dia}`}
          style={[styles.celulaDia, isDestaque && styles.diaDestaque, isSelecionado && styles.diaSelecionado]}
          onPress={() => handleDiaClick(mesNome, dia, anoMes)}
          activeOpacity={0.7}
        >
          <Text style={[styles.textoDia, isDestaque && styles.textoDiaDestaque, isSelecionado && styles.textoDiaSelecionado]}>
            {dia}
          </Text>
        </TouchableOpacity>
      );
    }
    return celulas;
  };

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
    (curso) => curso.modalidade === 'Graduação' && curso.tipo !== 'Online/EAD'
  );

  const cursosTecnicos = (cursosDoBanco || []).filter(
    (curso) => curso.tipo === 'Online/EAD' || curso.modalidade === 'Técnico'
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
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

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
              exibirPopup(`📢 ${ultimoAviso.titulo}`, ultimoAviso.mensagem, "sucesso", 7);
            }, 1800);

            await AsyncStorage.setItem("@ultimo_aviso_visto_id", String(ultimoAviso.id));
          }
        }
      } catch (error) {
        console.log("Erro ao carregar avisos:", error);
      }
    }

    if (!carregandoSessao && cursosSelecionados.length > 0) {
      carregarAvisos();
    }
  }, [cursosSelecionados, carregandoSessao, activeTab]);

  const reexibirAvisoPopup = (aviso) => {
    exibirPopup(`📢 ${aviso.titulo}`, aviso.mensagem, "sucesso", 7);
  };

  const isDesktop = Platform.OS === "web" && windowWidth >= 768;

  return {
    // Retornos combinados de dados acadêmicos, calendário e controle
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
    // Retornos de controle de sessão e telas
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
    reexibirAvisoPopup,
    todosOsEventos: eventosValidos,
    cursos: cursosDoBanco,
    servicos,
  };
}