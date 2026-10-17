import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { listaCursos, listaCursosTecnico, semestre } from '../constants/Dados';
import { supabase } from '../../lib/supabase';

const TABELA_EVENTO = 'evento';
const CAMPOS_EVENTO = {
  id: 'id',
  titulo: 'titulo',
  data: 'data',
  curso: 'curso_id',
  palestrante: 'palestrante',
  descricao: 'descricao',
  horasAcc: 'horasAAC',
  status: 'status',
};

const nomesMeses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function converterData(data) {
  if (typeof data !== 'string') return null;

  const partes = /^(\d{4})-(\d{2})-(\d{2})/.exec(data);
  if (!partes) return null;

  const [, ano, mes, dia] = partes;
  const dataConvertida = new Date(Number(ano), Number(mes) - 1, Number(dia));
  if (
    dataConvertida.getFullYear() !== Number(ano) ||
    dataConvertida.getMonth() !== Number(mes) - 1 ||
    dataConvertida.getDate() !== Number(dia)
  ) {
    return null;
  }

  return dataConvertida;
}

function mapearEvento(registro, indice) {
  const dataEvento = converterData(registro[CAMPOS_EVENTO.data]);
  const titulo = registro[CAMPOS_EVENTO.titulo];

  if (!dataEvento || typeof titulo !== 'string' || !titulo.trim()) {
    throw new Error(
      `O evento na posição ${indice + 1} não possui um nome ou uma data válida. Confira os campos configurados.`,
    );
  }

  return {
    id: registro[CAMPOS_EVENTO.id] ?? `${dataEvento.toISOString()}-${indice}`,
    titulo,
    dataEvento,
    dia: dataEvento.getDate(),
    mes: nomesMeses[dataEvento.getMonth()].slice(0, 3),
    tipo: registro[CAMPOS_EVENTO.tipo] ?? 'Evento',
    local: registro[CAMPOS_EVENTO.local] ?? '',
    turma: registro[CAMPOS_EVENTO.turma] ?? '',
    autor: registro[CAMPOS_EVENTO.autor] ?? '',
    descricao: registro[CAMPOS_EVENTO.descricao] ?? '',
    horas_acc: registro[CAMPOS_EVENTO.horasAcc] ?? 0,
  };
}

export function useScriptApp(styles) {
  const [eventoSelecionado, setEventoSelecionado] = useState(null);
  const [diaFocado, setDiaFocado] = useState(null);
  const [eventosDoDia, setEventosDoDia] = useState([]);
  const [todosOsEventos, setTodosOsEventos] = useState([]);
  const [carregandoEventos, setCarregandoEventos] = useState(true);
  const [erroEventos, setErroEventos] = useState(null);

  const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  useEffect(() => {
    let ativo = true;

    async function carregarEventos() {
      setCarregandoEventos(true);
      setErroEventos(null);

      try {
        const colunas = Object.values(CAMPOS_EVENTO).join(', ');
        const { data, error } = await supabase
          .from(TABELA_EVENTO)
          .select(colunas)
          .order(CAMPOS_EVENTO.data, { ascending: true });

          console.log('Erro ao buscar eventos:', error);
          console.log('Eventos retornados:', data);

        if (error) throw error;

        const eventos = (data ?? []).map(mapearEvento);
        if (ativo) setTodosOsEventos(eventos);
      } catch (error) {
        if (ativo) {
          setTodosOsEventos([]);
          setErroEventos(
            error instanceof Error
              ? error.message
              : 'Ocorreu um erro inesperado ao carregar os eventos.',
          );
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

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const eventosOrdenados = [...todosOsEventos].sort(
    (a, b) => a.dataEvento.getTime() - b.dataEvento.getTime(),
  );
  const listaProximos = eventosOrdenados
    .filter((evento) => evento.dataEvento >= hoje)
    .slice(0, 6);

  const limiteSemana = new Date(hoje);
  limiteSemana.setDate(limiteSemana.getDate() + 7);
  const listaSemana = eventosOrdenados
    .filter(
      (evento) => evento.dataEvento >= hoje && evento.dataEvento <= limiteSemana,
    )
    .slice(0, 6);

  const primeiroDiaProximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
  const primeiroDiaMesSeguinte = new Date(
    primeiroDiaProximoMes.getFullYear(),
    primeiroDiaProximoMes.getMonth() + 1,
    1,
  );
  const eventosProximoMes = eventosOrdenados
    .filter(
      (evento) =>
        evento.dataEvento >= primeiroDiaProximoMes &&
        evento.dataEvento < primeiroDiaMesSeguinte,
    )
    .slice(0, 6);

  const handleDiaClick = (mesNome, diaNumero) => {
    const mesBase = mesNome.split(' ')[0];
    const mesIndex = nomesMeses.indexOf(mesBase);
    setDiaFocado(`${diaNumero} de ${mesBase}`);

    const eventosEncontrados = todosOsEventos.filter(
      (evento) =>
        evento.dataEvento.getFullYear() === hoje.getFullYear() &&
        evento.dataEvento.getMonth() === mesIndex &&
        evento.dataEvento.getDate() === diaNumero,
    );
    setEventosDoDia(eventosEncontrados);
  };

  const renderizarDias = (mesNome, totalDias, espacosVazios) => {
    let celulas = [];
    for (let i = 0; i < espacosVazios; i++) {
      celulas.push(<View key={`vazio-${i}`} style={styles.celulaDia}></View>);
    }
    for (let dia = 1; dia <= totalDias; dia++) {
      const mesIndex = nomesMeses.indexOf(mesNome.split(' ')[0]);
      const isDestaque = todosOsEventos.some(
        (evento) =>
          evento.dataEvento.getFullYear() === hoje.getFullYear() &&
          evento.dataEvento.getMonth() === mesIndex &&
          evento.dataEvento.getDate() === dia,
      );
      const isSelecionado = diaFocado === `${dia} de ${mesNome.split(' ')[0]}`;

      celulas.push(
        <TouchableOpacity 
          key={`dia-${dia}`} 
          style={[styles.celulaDia, isDestaque && styles.diaDestaque, isSelecionado && styles.diaSelecionado]}
          onPress={() => handleDiaClick(mesNome, dia)}
          activeOpacity={0.7}
        >
          <Text style={[styles.textoDia, isDestaque && styles.textoDiaDestaque, isSelecionado && styles.textoDiaSelecionado]}>{dia}</Text>
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
    listaProximos, 
    listaSemana, 
    cursos: listaCursos, 
    cursosTecnicos: listaCursosTecnico, 
    eventosProximoMes,
    renderizarDias, renderCartaoPequeno
  };
}