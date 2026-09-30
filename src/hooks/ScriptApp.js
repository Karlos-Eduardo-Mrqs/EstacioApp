import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { listaCursos, listaCursosTecnico, bancoEventosCalendario, semestre } from '../app/Dados';

export function useScriptApp(styles) {
  const [eventoSelecionado, setEventoSelecionado] = useState(null);  
  const [diaFocado, setDiaFocado] = useState(null); 
  const [eventosDoDia, setEventosDoDia] = useState([]);

  const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  // Captura a data real do sistema
  const hoje = new Date();
  const diaAtual = hoje.getDate(); // Pega o dia de hoje (ex: 22)
  const mesAtualIndex = hoje.getMonth(); // 8 = Setembro (Janeiro é 0)

  // Mapeamento dos meses para corresponder ao formato do banco de dados
  const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const mesAtualNome = nomesMeses[mesAtualIndex];
  const proximoMesNome = nomesMeses[mesAtualIndex + 1] || 'Outubro';

  // Transforma o dicionário do banco de eventos em uma única lista plana para facilitar os filtros
  const todosOsEventos = Object.entries(bancoEventosCalendario).flatMap(([chave, lista]) => lista);

  // 1. Próximos Eventos (eventos futuros a partir do dia de hoje)
  const listaProximos = todosOsEventos.filter(ev => {
    if (ev.mes === mesAtualNome || ev.mes === mesAtualNome.substring(0, 3)) {
      return ev.dia >= diaAtual;
    }
    // Inclui meses seguintes
    return ev.mes !== mesAtualNome;
  }).slice(0, 6);;

  // 2. Eventos da Semana (janela de 7 dias a partir de hoje)
  const listaSemana = todosOsEventos.filter(ev => {
    const mesmoMes = (ev.mes === mesAtualNome || ev.mes === mesAtualNome.substring(0, 3));
    return mesmoMes && ev.dia >= diaAtual && ev.dia <= diaAtual + 7;
  }).slice(0, 6);;

  // 3. Eventos para o Próximo Mês gerados dinamicamente
  const eventosProximoMes = todosOsEventos.filter(ev => {
    const nomeProximoCurto = proximoMesNome.substring(0, 3);
    return ev.mes === proximoMesNome || ev.mes === nomeProximoCurto;
  }).slice(0, 6);;

  const handleDiaClick = (mesNome, diaNumero, temEvento) => {
    const chaveExata = `${mesNome}-${diaNumero}`;
    const mesBase = mesNome.split(' ')[0];
    const chaveAlternativa = `${mesBase}-${diaNumero}`;
    
    setDiaFocado(`${diaNumero} de ${mesBase}`);
    
    const eventosEncontrados = bancoEventosCalendario[chaveExata] || bancoEventosCalendario[chaveAlternativa] || [];
    
    if (temEvento && eventosEncontrados.length > 0) {
      setEventosDoDia(eventosEncontrados);
    } else {
      setEventosDoDia([]);
    }
  };

  const renderizarDias = (mesNome, totalDias, espacosVazios, destaques) => {
    let celulas = [];
    for (let i = 0; i < espacosVazios; i++) {
      celulas.push(<View key={`vazio-${i}`} style={styles.celulaDia}></View>);
    }
    for (let dia = 1; dia <= totalDias; dia++) {
      const isDestaque = destaques.includes(dia);
      const chaveAtual = `${mesNome}-${dia}`;
      const isSelecionado = diaFocado === `${dia} de ${mesNome.split(' ')[0]}`;

      celulas.push(
        <TouchableOpacity 
          key={`dia-${dia}`} 
          style={[styles.celulaDia, isDestaque && styles.diaDestaque, isSelecionado && styles.diaSelecionado]}
          onPress={() => handleDiaClick(mesNome, dia, isDestaque)}
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
    diaFocado, eventosDoDia,
    diasSemana, semestre, 
    listaProximos, 
    listaSemana, 
    cursos: listaCursos, 
    cursosTecnicos: listaCursosTecnico, 
    eventosProximoMes,
    renderizarDias, renderCartaoPequeno
  };
}