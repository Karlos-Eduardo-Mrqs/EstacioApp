export function formatarDataHora(valor) {
  if (!valor) return '';
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return '';
  const dois = (n) => String(n).padStart(2, '0');
  return `${dois(d.getDate())}/${dois(d.getMonth() + 1)}/${d.getFullYear()} ${dois(d.getHours())}:${dois(d.getMinutes())}:${dois(d.getSeconds())}`;
}

export function formatarDataApenas(valor) {
  if (!valor) return 'Data a definir';
  const d = new Date(valor);
  if (Number.isNaN(d.getTime())) return valor;
  const dois = (n) => String(n).padStart(2, '0');
  return `${dois(d.getDate())}/${dois(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function converterParaISO(texto) {
  const digitos = texto.replace(/\D/g, '');
  if (digitos.length !== 14) return null;

  const dia = Number(digitos.slice(0, 2));
  const mes = Number(digitos.slice(2, 4));
  const ano = Number(digitos.slice(4, 8));
  const hora = Number(digitos.slice(8, 10));
  const minuto = Number(digitos.slice(10, 12));
  const segundo = Number(digitos.slice(12, 14));

  if (ano < 1000 || mes < 1 || mes > 12 || hora > 23 || minuto > 59 || segundo > 59) {
    return null;
  }

  const d = new Date(ano, mes - 1, dia, hora, minuto, segundo);
  if (d.getFullYear() !== ano || d.getMonth() !== mes - 1 || d.getDate() !== dia) {
    return null;
  }

  const dois = (n) => String(n).padStart(2, '0');
  return `${ano}-${dois(mes)}-${dois(dia)}T${dois(hora)}:${dois(minuto)}:${dois(segundo)}`;
}

export function formatarEntradaData(valor) {
  const digitos = valor.replace(/\D/g, '').slice(0, 14);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  if (digitos.length <= 8) return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
  if (digitos.length <= 10) return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4, 8)} ${digitos.slice(8)}`;
  if (digitos.length <= 12) return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4, 8)} ${digitos.slice(8, 10)}:${digitos.slice(10)}`;
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4, 8)} ${digitos.slice(8, 10)}:${digitos.slice(10, 12)}:${digitos.slice(12)}`;
}

export function formatarDuracao(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const dias = Math.floor(total / 86400);
  const horas = Math.floor((total % 86400) / 3600);
  const minutos = Math.floor((total % 3600) / 60);
  const segundos = total % 60;
  const dois = (n) => String(n).padStart(2, '0');

  if (dias > 0) return `${dias}d ${dois(horas)}:${dois(minutos)}:${dois(segundos)}`;
  return `${dois(horas)}:${dois(minutos)}:${dois(segundos)}`;
}

export function obterTempoEvento(evento, agora) {
  const inicio = new Date(evento.inicio).getTime();
  const termino = new Date(evento.termino).getTime();

  if (agora < inicio) {
    return { texto: `Começa em ${formatarDuracao(inicio - agora)}`, tipo: 'futuro' };
  }
  if (agora < termino) {
    return { texto: `Termina em ${formatarDuracao(termino - agora)}`, tipo: 'andamento' };
  }
  return { texto: 'Evento finalizado', tipo: 'finalizado' };
}