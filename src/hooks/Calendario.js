import { View, Text, TouchableOpacity } from "react-native";

export const nomesMeses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const CAMPOS_EVENTO = {
  id: 'id',
  titulo: 'titulo',
  data: 'data',
  curso: 'curso_id',
  palestrante: 'palestrante',
  descricao: 'descricao',
  horasAcc: 'horasAAC',
  status: 'status',
};

export function converterData(data) {
  if (typeof data !== 'string') return null;
  const partes = /^(\d{4})-(\d{2})-(\d{2})/.exec(data);
  if (!partes) return null;
  const [, ano, mes, dia] = partes;
  const dataConvertida = new Date(Number(ano), Number(mes) - 1, Number(dia));
  return dataConvertida;
}

export function mapearEvento(registro, indice) {
  const dataEvento = converterData(registro.data);
  const titulo = registro.titulo;

  if (!dataEvento || typeof titulo !== 'string' || !titulo.trim()) {
    throw new Error(
      `O evento na posição ${indice + 1} não possui um nome ou uma data válida.`
    );
  }

  return {
    id: registro.id ?? `${dataEvento.toISOString()}-${indice}`,
    titulo,
    dataEvento,
    dia: dataEvento.getDate(),
    mes: nomesMeses[dataEvento.getMonth()].slice(0, 3),
    tipo: 'Evento',
    local: '',
    turma: registro.curso?.nome ?? 'Geral',
    autor: registro.palestrante ?? 'Não informado',
    descricao: registro.descricao ?? 'Sem descrição informada para este evento.',
    horas_acc: registro.horasAAC ?? 0,
  };
}

export function gerarMesesCalendario(quantidade = 4) {
  const hoje = new Date();
  return Array.from({ length: quantidade }, (_, indice) => {
    const dataMes = new Date(hoje.getFullYear(), hoje.getMonth() + indice, 1);
    const ano = dataMes.getFullYear();
    const numeroMes = dataMes.getMonth();

    return {
      id: `${ano}-${numeroMes + 1}`,
      nome: nomesMeses[numeroMes],
      ano,
      numeroMes,
      totalDias: new Date(ano, numeroMes + 1, 0).getDate(),
      espacosVazios: dataMes.getDay(),
    };
  });
}

export function normalizarEventosComData(eventos = []) {
  return (eventos || []).map((evento) => ({
    ...evento,
    dataEvento:
      evento.dataEvento instanceof Date && !isNaN(evento.dataEvento)
        ? evento.dataEvento
        : evento.data
          ? new Date(evento.data)
          : new Date(),
  }));
}

export function obterListasEventosPorPeriodo(eventosValidos = []) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const eventosOrdenados = [...eventosValidos].sort(
    (a, b) => a.dataEvento.getTime() - b.dataEvento.getTime()
  );

  const listaProximos = eventosOrdenados
    .filter((evento) => evento.dataEvento >= hoje)
    .slice(0, 6);

  const limiteSemana = new Date(hoje);
  limiteSemana.setDate(limiteSemana.getDate() + 7);
  const listaSemana = eventosOrdenados
    .filter((evento) => evento.dataEvento >= hoje && evento.dataEvento <= limiteSemana)
    .slice(0, 6);

  const primeiroDiaProximoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
  const primeiroDiaMesSeguinte = new Date(
    primeiroDiaProximoMes.getFullYear(),
    primeiroDiaProximoMes.getMonth() + 1,
    1
  );
  const eventosProximoMes = eventosOrdenados
    .filter(
      (evento) =>
        evento.dataEvento >= primeiroDiaProximoMes &&
        evento.dataEvento < primeiroDiaMesSeguinte
    )
    .slice(0, 6);

  return {
    listaProximos,
    listaSemana,
    eventosProximoMes,
  };
}

export function filtrarEventosDoDia(eventosValidos, mesNome, diaNumero, anoMes) {
  const mesIndex = nomesMeses.indexOf(mesNome);
  return (eventosValidos || []).filter(
    (evento) =>
      evento.dataEvento.getFullYear() === anoMes &&
      evento.dataEvento.getMonth() === mesIndex &&
      evento.dataEvento.getDate() === diaNumero
  );
}

export function renderizarCelulasDiasCalendario({
  styles,
  mesNome,
  totalDias,
  espacosVazios,
  anoMes,
  eventosValidos,
  diaFocado,
  onSelecionarDia,
}) {
  const celulas = [];
  for (let i = 0; i < espacosVazios; i++) {
    celulas.push(<View key={`vazio-${i}`} style={styles.celulaDia} />);
  }

  const nomeMesLimpo = mesNome.split(" ")[0];
  const mesIndex = nomesMeses.indexOf(nomeMesLimpo);

  for (let dia = 1; dia <= totalDias; dia++) {
    const isDestaque = (eventosValidos || []).some(
      (evento) =>
        evento.dataEvento &&
        evento.dataEvento.getFullYear() === anoMes &&
        evento.dataEvento.getMonth() === mesIndex &&
        evento.dataEvento.getDate() === dia
    );

    const isSelecionado = diaFocado === `${dia} de ${nomeMesLimpo}`;

    celulas.push(
      <TouchableOpacity
        key={`dia-${dia}`}
        style={[
          styles.celulaDia,
          isDestaque && styles.diaDestaque,
          isSelecionado && styles.diaSelecionado,
        ]}
        onPress={() => onSelecionarDia(mesNome, dia, anoMes)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.textoDia,
            isDestaque && styles.textoDiaDestaque,
            isSelecionado && styles.textoDiaSelecionado,
          ]}
        >
          {dia}
        </Text>
      </TouchableOpacity>
    );
  }

  return celulas;
}