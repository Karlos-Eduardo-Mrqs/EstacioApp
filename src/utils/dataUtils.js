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

export function formatarEntradaHora(texto) {
  // Remove tudo o que não for número
  const apenasNumeros = texto.replace(/\D/g, "").substring(0, 6); // Limita a 6 dígitos (HHMMSS)

  let horaFormatada = "";

  if (apenasNumeros.length > 0) {
    horaFormatada = apenasNumeros.substring(0, 2);
  }
  if (apenasNumeros.length > 2) {
    horaFormatada += ":" + apenasNumeros.substring(2, 4);
  }
  if (apenasNumeros.length > 4) {
    horaFormatada += ":" + apenasNumeros.substring(4, 6);
  }

  return horaFormatada;
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

  const anoAtual = new Date().getFullYear();

  if (ano < anoAtual || mes < 1 || mes > 12 || hora > 23 || minuto > 59 || segundo > 59) {
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
  const digitos = valor.replace(/\D/g, '').slice(0, 8); // Limitamos a 8 dígitos DDMMAAAA para evitar confusão
  let formatada = '';

  if (digitos.length <= 2) {
    formatada = digitos;
  } else if (digitos.length <= 4) {
    formatada = `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  } else {
    const dia = digitos.slice(0, 2);
    const mes = digitos.slice(2, 4);
    const ano = digitos.slice(4, 8);
    
    formatada = `${dia}/${mes}/${ano}`;

    // 🛑 Validação opcional: Se o ano digitado já tiver 4 dígitos, impede anos inferiores ao atual (ex: 2026)
    if (ano.length === 4) {
      const anoAtual = new Date().getFullYear();
      if (Number(ano) < anoAtual) {
        // Se o ano for menor que o atual, corta o ano para o usuário corrigir
        return `${dia}/${mes}/`; 
      }
    }
  }
  return formatada;
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

export function formatarEntradaTelefone(texto) {
  // Remove tudo o que não for número
  const digitos = texto.replace(/\D/g, "").substring(0, 13); // Limita a 13 dígitos (+ DDI + DDD + 9 dígitos)

  let formatado = "";

  if (digitos.length > 0) {
    formatado = "+" + digitos.substring(0, 2); // Ex: +55
  }
  if (digitos.length > 2) {
    formatado += " (" + digitos.substring(2, 4); // Ex: +55 (21
  }
  if (digitos.length > 4) {
    formatado += ") " + digitos.substring(4, 9); // Ex: +55 (21) 99999
  }
  if (digitos.length > 9) {
    formatado += "-" + digitos.substring(9, 13); // Ex: +55 (21) 99999-9999
  }

  return formatado;
}