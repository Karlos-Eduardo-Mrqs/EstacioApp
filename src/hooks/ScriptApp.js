import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { gerarMesesCalendario, nomesMeses } from "./Calendario";
import { useNotificacoes } from "./useNotificacoes";
import { useDadosAcademicos } from "./useDadosAcademicos";

export function useScriptApp(styles) {
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

  // Consumindo os hooks desmembrados
  const { notificacoesSalvas, salvarNotificacao, removerNotificacao } = useNotificacoes(exibirPopup);
  const { todosOsEventos, carregandoEventos, erroEventos, cursosDoBanco, carregandoCursos, erroCursos } = useDadosAcademicos(exibirPopup);

  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [diaFocado, setDiaFocado] = useState(null);
  const [eventosDoDia, setEventosDoDia] = useState([]);

  const semestre = gerarMesesCalendario(4);
  const diasSemana = ["D", "S", "T", "Q", "Q", "S", "S"];

  // Filtros de datas
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const eventosOrdenados = [...todosOsEventos].sort((a, b) => a.dataEvento.getTime() - b.dataEvento.getTime());
  const listaProximos = eventosOrdenados.filter((evento) => evento.dataEvento >= hoje).slice(0, 6);

  const limiteSemana = new Date(hoje);
  limiteSemana.setDate(limiteSemana.getDate() + 7);
  const listaSemana = eventosOrdenados.filter((evento) => evento.dataEvento >= hoje && evento.dataEvento <= limiteSemana).slice(0, 6);

  const primeiroDiaProximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
  const primeiroDiaMesSeguinte = new Date(primeiroDiaProximoMes.getFullYear(), primeiroDiaProximoMes.getMonth() + 1, 1);
  const eventosProximoMes = eventosOrdenados.filter((evento) => evento.dataEvento >= primeiroDiaProximoMes && evento.dataEvento < primeiroDiaMesSeguinte).slice(0, 6);

  // Manipulação de cliques no Calendário
  const handleDiaClick = (mesNome, diaNumero, anoMes) => {
    const mesIndex = nomesMeses.indexOf(mesNome);
    setDiaFocado(`${diaNumero} de ${mesNome} de ${anoMes}`);
    const eventosEncontrados = todosOsEventos.filter(
      (evento) =>
        evento.dataEvento.getFullYear() === anoMes &&
        evento.dataEvento.getMonth() === mesIndex &&
        evento.dataEvento.getDate() === diaNumero
    );
    setEventosDoDia(eventosEncontrados);
  };

  // Renderização de Dias do Calendário
  const renderizarDias = (mesNome, totalDias, espacosVazios, anoMes) => {
    let celulas = [];
    for (let i = 0; i < espacosVazios; i++) {
      celulas.push(<View key={`vazio-${i}`} style={styles.celulaDia}></View>);
    }

    for (let dia = 1; dia <= totalDias; dia++) {
      const mesIndex = nomesMeses.indexOf(mesNome.split(" ")[0]);
      const isDestaque = todosOsEventos.some(
        (evento) => evento.dataEvento.getFullYear() === anoMes && evento.dataEvento.getMonth() === mesIndex && evento.dataEvento.getDate() === dia
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

  return {
    eventoSelecionado, setEventoSelecionado,
    diaFocado, eventosDoDia, carregandoEventos, erroEventos,
    diasSemana, semestre,
    listaProximos, listaSemana,
    cursos: cursosDoBanco,
    cursosTecnicos: [],
    carregandoCursos, erroCursos,
    eventosProximoMes,
    notificacoesSalvas,
    salvarNotificacao,
    removerNotificacao,
    renderizarDias,
    renderCartaoPequeno,
    popupInfo, setPopupInfo,
    exibirPopup,
    todosOsEventos, // 👈 Exposto corretamente para a tela principal
  };
}