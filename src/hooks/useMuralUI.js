import { useEffect, useMemo, useState } from "react";
import { Dimensions, Linking, Platform } from "react-native";
import { filtrarEventosDoDia } from "./Calendario";

export function useMuralUI(eventosValidos = []) {
  const [popupInfo, setPopupInfo] = useState({
    visible: false,
    titulo: "",
    mensagem: "",
    tipo: "sucesso",
    duracao: 0,
  });

  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [diaFocado, setDiaFocado] = useState(null);

  const [modalDevsVisivel, setModalDevsVisivel] = useState(false);
  const [cursoSelecionado, setCursoSelecionado] = useState(null);
  const [modalLoginVisivel, setModalLoginVisivel] = useState(false);
  const [modalGerenciaVisivel, setModalGerenciaVisivel] = useState(false);
  const [modalCoordenadorVisivel, setModalCoordenadorVisivel] = useState(false);

  const [activeTab, setActiveTab] = useState("mural");
  const [windowWidth, setWindowWidth] = useState(Dimensions.get("window").width);
  const [avisoLeituraAtual, setAvisoLeituraAtual] = useState(null);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  const eventosDoDia = useMemo(() => {
    if (!diaFocado) return [];
    const partes = diaFocado.split(" de ");
    if (partes.length < 3) return [];

    const diaNum = Number(partes[0]);
    const mesStr = partes[1];
    const anoNum = Number(partes[2]);

    if (isNaN(diaNum) || !mesStr || isNaN(anoNum)) return [];
    return filtrarEventosDoDia(eventosValidos, mesStr, diaNum, anoNum);
  }, [eventosValidos, diaFocado]);

  const exibirPopup = (titulo, mensagem, tipo = "sucesso", duracaoSegundos = 4) => {
    setPopupInfo({
      visible: true,
      titulo,
      mensagem,
      tipo,
      duracao: duracaoSegundos,
    });

    setTimeout(() => {
      setPopupInfo((prev) => ({ ...prev, visible: false }));
    }, duracaoSegundos * 1000);
  };

  const handleDiaClick = (mesNome, diaNumero, anoMes) => {
    setDiaFocado(`${diaNumero} de ${mesNome} de ${anoMes}`);
  };

  const handleSelecionarCurso = (curso) => {
    if (curso?.link) {
      Linking.openURL(curso.link);
    } else {
      exibirPopup(
        "Aviso",
        `Curso selecionado: ${curso?.nome || curso?.titulo}`,
        "sucesso",
        3
      );
    }
  };

  const abrirLeituraAviso = (aviso) => {
    setAvisoLeituraAtual(aviso || null);
  };

  const fecharLeituraAviso = () => {
    setAvisoLeituraAtual(null);
  };

  const reexibirAvisoPopup = (aviso) => {
    abrirLeituraAviso(aviso);
  };

  const isDesktop = Platform.OS === "web" && windowWidth >= 768;

  return {
    popupInfo,
    setPopupInfo,
    exibirPopup,
    eventoSelecionado,
    setEventoSelecionado,
    diaFocado,
    eventosDoDia,
    handleDiaClick,
    handleSelecionarCurso,
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
    activeTab,
    setActiveTab,
    isDesktop,
    avisoLeituraAtual,
    abrirLeituraAviso,
    fecharLeituraAviso,
    reexibirAvisoPopup,
  };
}