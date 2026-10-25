// src/hooks/Calendario.js (ou onde o seu Calendario.js estiver guardado)

export const nomesMeses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril','Maio', 'Junho', 'Julho', 'Agosto','Setembro', 'Outubro', 'Novembro', 'Dezembro'
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