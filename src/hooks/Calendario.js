import { View, Text, TouchableOpacity } from "react-native";

export const nomesMeses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const CAMPOS_EVENTO = {
  id: 'id',
  titulo: 'titulo',
  data: 'data_inicio',
  dataInicio: 'data_inicio',
  dataFim: 'data_fim',
  curso: 'curso_id',
  palestrante: 'palestrante',
  descricao: 'descricao',
  horasAcc: 'horasAAC',
  status: 'status',
};

function normalizarParaDataLocal(valor) {
  if (!valor) return null;

  if (typeof valor === 'string') {
    const matchIso = /^(\d{4})-(\d{2})-(\d{2})/.exec(valor.trim());
    if (matchIso) {
      const [, ano, mes, dia] = matchIso;
      return new Date(Number(ano), Number(mes) - 1, Number(dia));
    }

    const matchBr = /^(\d{2})\/(\d{2})\/(\d{4})/.exec(valor.trim());
    if (matchBr) {
      const [, dia, mes, ano] = matchBr;
      return new Date(Number(ano), Number(mes) - 1, Number(dia));
    }
  }

  const dataObj = valor instanceof Date ? new Date(valor.getTime()) : new Date(valor);
  if (isNaN(dataObj.getTime())) return null;

  return new Date(dataObj.getFullYear(), dataObj.getMonth(), dataObj.getDate());
}

function mesmaDataCalendario(dataA, dataB) {
  if (!dataA || !dataB) return false;
  return (
    dataA.getFullYear() === dataB.getFullYear() &&
    dataA.getMonth() === dataB.getMonth() &&
    dataA.getDate() === dataB.getDate()
  );
}

export function eventoOcorreNoDia(evento, anoMes, mesIndex, diaNumero) {
  if (!evento || evento.status === false) return false;

  const dataAlvo = new Date(anoMes, mesIndex, diaNumero);
  const inicioBruto =
    evento.data_inicio || evento.inicio || evento.data || evento.dataEvento;
  const fimBruto = evento.data_fim || evento.fim || null;

  const dataInicio = normalizarParaDataLocal(inicioBruto) || normalizarParaDataLocal(evento.dataEvento);
  if (!dataInicio) return false;

  const dataFim = normalizarParaDataLocal(fimBruto);

  // Aparece no dia de início e, se houver data_fim, também no dia de fim
  if (mesmaDataCalendario(dataInicio, dataAlvo)) {
    return true;
  }

  if (dataFim && mesmaDataCalendario(dataFim, dataAlvo)) {
    return true;
  }

  return false;
}

export function converterData(data) {
  return normalizarParaDataLocal(data);
}

export function mapearEvento(registro, indice) {
  const inicioRaw = registro.data_inicio || registro.data;
  const dataEvento = converterData(inicioRaw);
  const dataFim = converterData(registro.data_fim);
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
    dataFim,
    data_inicio: registro.data_inicio ?? inicioRaw,
    data_fim: registro.data_fim ?? null,
    status: registro.status,
    dia: dataEvento.getDate(),
    mes: nomesMeses[dataEvento.getMonth()].slice(0, 3),
    tipo: 'Evento',
    local: registro.local ?? '',
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
  return (eventos || []).map((evento) => {
    const inicioRaw =
      evento.data_inicio || evento.inicio || evento.data || evento.dataEvento;
    const dataEvento =
      evento.dataEvento instanceof Date && !isNaN(evento.dataEvento)
        ? evento.dataEvento
        : inicioRaw
          ? new Date(inicioRaw)
          : new Date();

    const dataFim =
      evento.dataFim instanceof Date && !isNaN(evento.dataFim)
        ? evento.dataFim
        : evento.data_fim
          ? new Date(evento.data_fim)
          : null;

    return {
      ...evento,
      dataEvento,
      dataFim,
    };
  });
}

export function obterListasEventosPorPeriodo(eventosValidos = []) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const eventosAtivos = (eventosValidos || []).filter(
    (evento) => evento.status !== false
  );

  const eventosOrdenados = [...eventosAtivos].sort(
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
  const nomeMesLimpo = (mesNome || "").split(" ")[0];
  const mesIndex = nomesMeses.indexOf(nomeMesLimpo);
  if (mesIndex === -1) return [];

  return (eventosValidos || []).filter((evento) =>
    eventoOcorreNoDia(evento, anoMes, mesIndex, diaNumero)
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
    const isDestaque = (eventosValidos || []).some((evento) =>
      eventoOcorreNoDia(evento, anoMes, mesIndex, dia)
    );

    const isSelecionado =
      diaFocado === `${dia} de ${nomeMesLimpo}` ||
      diaFocado === `${dia} de ${nomeMesLimpo} de ${anoMes}`;

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