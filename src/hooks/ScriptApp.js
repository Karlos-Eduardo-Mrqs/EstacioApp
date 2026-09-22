import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { listaCursos, cursosTecnicos, bancoEventosCalendario, semestre } from '../app/Dados';

export function useScriptApp(styles) {
  const [eventoSelecionado, setEventoSelecionado] = useState(null);  
  const [diaFocado, setDiaFocado] = useState(null); 
  const [eventosDoDia, setEventosDoDia] = useState([]);

  const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const listaProximos = [
    { id: 18, dia: 18, mes: 'Set', titulo: 'Maratona de Programação - Hackathon', local: 'Lab de TI', tipo: 'Evento', turma: 'Análise de Sistemas', autor: 'Coordenação TI', descricao: 'Desenvolvimento de soluções mobile em 12 horas.', horas_acc: 20 }
  ];

  const listaSemana = [
    { id: 18, dia: 18, mes: 'Set', titulo: 'Maratona de Programação - Hackathon', local: 'Lab de TI', tipo: 'Evento', turma: 'Análise de Sistemas', autor: 'Coordenação TI', descricao: 'Desenvolvimento de soluções mobile em 12 horas.', horas_acc: 20 }
  ];

  const eventosProximoMes = [
    { id: 11, dia: 2, mes: 'Outubro', titulo: 'Abertura da Semana da Ciência e Tecnologia', local: 'Auditório Principal', tipo: 'Evento', turma: 'Geral', autor: 'Diretoria', descricao: 'Apresentação magna de inovações tecnológicas.', horas_acc: 15 }
  ];

  const handleDiaClick = (mesNome, diaNumero, temEvento) => {
    const chaveExata = `${mesNome}-${diaNumero}`;
    const chaveCurta = mesNome.includes('Dezembro') ? `Dezembro-${diaNumero}` : chaveExata;
    
    setDiaFocado(chaveExata);
    
    const eventosEncontrados = bancoEventosCalendario[chaveExata] || bancoEventosCalendario[chaveCurta] || [];
    
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
      const isSelecionado = diaFocado === chaveAtual;

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
    diasSemana, semestre, listaProximos, listaSemana, 
    cursos: listaCursos, 
    cursosTecnicos, 
    eventosProximoMes,
    renderizarDias, renderCartaoPequeno
  };
}