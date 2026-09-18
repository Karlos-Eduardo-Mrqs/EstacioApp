import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// Mude de UseScriptApp para useScriptApp (u minúsculo)
export function useScriptApp(styles) {
  const [eventoSelecionado, setEventoSelecionado] = useState(null);  
  const [diaFocado, setDiaFocado] = useState(null); 
  const [eventosDoDia, setEventosDoDia] = useState([]);

  const diasSemana = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const bancoEventosCalendario = {
    'Setembro-2': [
      { id: 1, titulo: 'Recepção de Calouros', local: 'Auditório', tipo: 'Evento', dia: 2, mes: 'Set', turma: 'Geral', autor: 'Diretoria', descricao: 'Boas-vindas.',horas_acc:15 },
    ],
    'Setembro-15': [
      { id: 3, titulo: 'Prazo: Horas', local: 'SIA', tipo: 'Aviso', dia: 15, mes: 'Set', turma: 'Geral', autor: 'Coordenação', descricao: 'Último dia.',horas_acc:10}
    ],
    'Outubro-12': [
      { id: 4, titulo: 'Feira de TI', local: 'Pátio', tipo: 'Evento', dia: 12, mes: 'Out', turma: 'Tecnologia', autor: 'Prof. Carlos', descricao: 'Empresas de tecnologia.',horas_acc:12 }
    ],
    'Novembro-20': [
      { id: 5, titulo: 'Feriado', local: 'Campus', tipo: 'Aviso', dia: 20, mes: 'Nov', turma: 'Geral', autor: 'Diretoria', descricao: 'Não haverá aula.',horas_acc:10 }
    ]
  };

  const semestre = [
    { id: 1, nome: 'Setembro', totalDias: 30, espacosVazios: 2, destaques: [2, 15] },
    { id: 2, nome: 'Outubro', totalDias: 31, espacosVazios: 4, destaques: [12] },
    { id: 3, nome: 'Novembro', totalDias: 30, espacosVazios: 0, destaques: [20] },
  ];

  const listaProximos = [
    { id: 10, dia: 25, mes: 'Set', titulo: 'Seminário Direito', local: 'Sala 104', tipo: 'Evento', turma: 'Direito', autor: 'Coordenação', descricao: 'Seminário aberto.', horas_acc:10}
  ];

  const listaSemana = [
    { id: 12, dia: 18, mes: 'Set', titulo: 'Plantão Dúvidas', local: 'Biblioteca', tipo: 'Serviço', turma: 'Todas', autor: 'Monitoria', descricao: 'Plantão de matemática.',horas_acc:18 },
  ];

  const handleDiaClick = (mesNome, diaNumero, temEvento) => {
    const chave = `${mesNome}-${diaNumero}`;
    setDiaFocado(chave);
    if (temEvento) {
      setEventosDoDia(bancoEventosCalendario[chave]);
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

  // Retorna tudo o que o App.js vai precisar para desenhar a tela
  return {
    eventoSelecionado, setEventoSelecionado,
    diaFocado, eventosDoDia,
    diasSemana, semestre, listaProximos, listaSemana,
    renderizarDias, renderCartaoPequeno
  };
}