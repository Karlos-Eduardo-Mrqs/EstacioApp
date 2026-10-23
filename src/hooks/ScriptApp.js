import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarCursosDoBanco, buscarEventosDoBanco } from '../services/apiServices';
import { gerarMesesCalendario, nomesMeses } from './Calendario';

export function useScriptApp(styles) {
  // Estado global para controlar o popup de mensagens (Sucesso, Erro ou Aviso)
  const [popupInfo, setPopupInfo] = useState({
    visible: false,
    titulo: '',
    mensagem: '',
    tipo: 'sucesso',
    duracao: 0,
  });

  const exibirPopup = (titulo, mensagem, tipo = 'sucesso', duracaoSegundos = 4) => {
    setPopupInfo({ 
      visible: true, 
      titulo, 
      mensagem, 
      tipo, 
      duracao: duracaoSegundos 
    });

    // O setTimeout agora usa a duração personalizada em segundos multiplicada por 1000ms
    setTimeout(() => {
      setPopupInfo((prev) => ({ ...prev, visible: false }));
    }, duracaoSegundos * 1000);
  };

  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [diaFocado, setDiaFocado] = useState(null);
  const [eventosDoDia, setEventosDoDia] = useState([]);
  const [todosOsEventos, setTodosOsEventos] = useState([]);
  const [carregandoEventos, setCarregandoEventos] = useState(true);
  const [erroEventos, setErroEventos] = useState(null);

  const [cursosDoBanco, setCursosDoBanco] = useState([]);
  const [carregandoCursos, setCarregandoCursos] = useState(true);
  const [erroCursos, setErroCursos] = useState(null);

  // Estado para gerir as notificações salvas
  const [notificacoesSalvas, setNotificacoesSalvas] = useState([]);

  const semestre = gerarMesesCalendario(4);
  const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  // Carregar notificações salvas no armazenamento local ao iniciar
  useEffect(() => {
    async function carregarNotificacoes() {
      try {
        const salvas = await AsyncStorage.getItem('@eventos_notificados');
        if (salvas) {
          setNotificacoesSalvas(JSON.parse(salvas));
        }
      } catch (e) {
        console.log("Erro ao carregar notificações", e);
      }
    }
    carregarNotificacoes();
  }, []);

  // Função para salvar uma notificação
  const salvarNotificacao = async (evento) => {
    try {
      const jaExiste = notificacoesSalvas.some((item) => item.id === evento.id);
      if (jaExiste) {
        exibirPopup(
          "⚠️ Notificação Existente", 
          "Este evento já está guardado nas suas notificações!", 
          "aviso",4
        );
        return;
      }

      const novaLista = [evento, ...notificacoesSalvas];
      setNotificacoesSalvas(novaLista);
      await AsyncStorage.setItem('@eventos_notificados', JSON.stringify(novaLista));

      exibirPopup(
        "🔔 Sucesso!", 
        "Evento adicionado às suas notificações com sucesso!", 
        "sucesso",4
      );
    } catch (e) {
      exibirPopup(
        "❌ Erro", 
        "Não foi possível salvar a notificação no dispositivo.", 
        "erro",4
      );
    }
  };

  const removerNotificacao = async (id) => {
    try {
      const novaLista = notificacoesSalvas.filter((item) => item.id !== id);
      setNotificacoesSalvas(novaLista);
      await AsyncStorage.setItem('@eventos_notificados', JSON.stringify(novaLista));

      exibirPopup(
        "🗑️ Removido", 
        "Notificação removida com sucesso!", 
        "sucesso",4
      );
    } catch (e) {
      exibirPopup(
        "❌ Erro", 
        "Ocorreu um erro ao tentar remover a notificação.", 
        "erro",4
      );
    }
  };

  // Carregar Cursos
  useEffect(() => {
    let ativo = true;

    async function carregarCursos() {
      setCarregandoCursos(true);
      setErroCursos(null);

      try {
        const cursos = await buscarCursosDoBanco();
        if (ativo) setCursosDoBanco(cursos);
      } catch (error) {
        if (ativo) {
          const msgErro = error instanceof Error ? error.message : 'Não foi possível carregar os cursos.';
          setErroCursos(msgErro);
          exibirPopup("❌ Erro nos Cursos", msgErro, "erro",4);
        }
      } finally {
        if (ativo) setCarregandoCursos(false);
      }
    }

    carregarCursos();
    return () => {
      ativo = false;
    };
  }, []);

  // Carregar Eventos
  useEffect(() => {
    let ativo = true;

    async function carregarEventos() {
      setCarregandoEventos(true);
      setErroEventos(null);

      try {
        const eventos = await buscarEventosDoBanco();
        if (ativo) setTodosOsEventos(eventos);
      } catch (error) {
        if (ativo) {
          setTodosOsEventos([]);
          const msgErro = error instanceof Error ? error.message : 'Ocorreu um erro inesperado ao carregar os eventos.';
          setErroEventos(msgErro);
          exibirPopup("❌ Erro nos Eventos", msgErro, "erro",4);
        }
      } finally {
        if (ativo) setCarregandoEventos(false);
      }
    }

    carregarEventos();
    return () => {
      ativo = false;
    };
  }, []);

  // Cálculos de datas e listas filtradas
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const eventosOrdenados = [...todosOsEventos].sort(
    (a, b) => a.dataEvento.getTime() - b.dataEvento.getTime()
  );

  const listaProximos = eventosOrdenados.filter((evento) => evento.dataEvento >= hoje).slice(0, 6);

  const limiteSemana = new Date(hoje);
  limiteSemana.setDate(limiteSemana.getDate() + 7);

  const listaSemana = eventosOrdenados.filter(
      (evento) => evento.dataEvento >= hoje && evento.dataEvento <= limiteSemana
    ).slice(0, 6);

  const primeiroDiaProximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
  const primeiroDiaMesSeguinte = new Date(primeiroDiaProximoMes.getFullYear(), primeiroDiaProximoMes.getMonth() + 1, 1);

  const eventosProximoMes = eventosOrdenados.filter(
      (evento) =>
        evento.dataEvento >= primeiroDiaProximoMes &&
        evento.dataEvento < primeiroDiaMesSeguinte
    )
    .slice(0, 6);

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
      const mesIndex = nomesMeses.indexOf(mesNome.split(' ')[0]);
      const isDestaque = todosOsEventos.some(
        (evento) =>
          evento.dataEvento.getFullYear() === anoMes &&
          evento.dataEvento.getMonth() === mesIndex &&
          evento.dataEvento.getDate() === dia
      );
      const isSelecionado = diaFocado === `${dia} de ${mesNome.split(' ')[0]}`;

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

  // Renderização do Cartão do Carrossel
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
    listaProximos, 
    listaSemana, 
    cursos: cursosDoBanco,
    cursosTecnicos: [],
    carregandoCursos,
    erroCursos,
    eventosProximoMes,
    notificacoesSalvas,
    salvarNotificacao,
    removerNotificacao,
    renderizarDias, 
    renderCartaoPequeno,
    popupInfo, 
    setPopupInfo,
    exibirPopup
  };
}