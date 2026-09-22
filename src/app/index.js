import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import EventoDetalhe from './EventoDetalhe';
import { useScriptApp } from './ScriptApp';
import { appStyles as styles } from '../styles/muralStyles';

export default function App() {
  const {
    eventoSelecionado, setEventoSelecionado,
    diaFocado, eventosDoDia,
    diasSemana, semestre, listaProximos, listaSemana,
    renderizarDias, renderCartaoPequeno
  } = useScriptApp(styles);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        <View style={styles.cabecalho}>
          <Text style={styles.tituloCabecalho}>Mural Nova América</Text>
          <Text style={styles.subtituloCabecalho}>Campus Nova América</Text>
        </View>

        <View style={styles.blocoSection}>
          <Text style={styles.tituloSecaoBloco}>AVISOS DA GERÊNCIA</Text>
          <View style={styles.caixaAviso}><Text style={styles.textoMutavel}>Sem avisos globais no momento.</Text></View>
        </View>

        {/* CALENDÁRIO */}
        <View style={styles.blocoSection}>
          <Text style={styles.tituloSecaoBloco}>AGENDA DE EVENTOS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollCalendario}>
            {semestre.map(mes => (
              <View key={mes.id} style={styles.calendarioBoxMini}>
                <View style={styles.mesHeaderAzul}><Text style={styles.mesTituloBranco}>{mes.nome}</Text></View>
                <View style={styles.calendarioGrid}>
                  {diasSemana.map((dia, idx) => (
                    <View key={`semana-${idx}`} style={styles.celulaDia}><Text style={styles.textoDiaSemana}>{dia}</Text></View>
                  ))}
                  {renderizarDias(mes.nome, mes.totalDias, mes.espacosVazios, mes.destaques)}
                </View>
              </View>
            ))}
          </ScrollView>
          <Text style={styles.legendaCalendario}>Dias em amarelo possuem eventos</Text>

          {diaFocado && (
            <View style={styles.areaEventosDoDia}>
              <Text style={styles.tituloDiaFocado}>Eventos de {diaFocado.replace('-', ' ')}</Text>
              {eventosDoDia.length > 0 ? (
                eventosDoDia.map(evento => (
                  <View key={evento.id} style={styles.cartaoDiaFocado}>
                    <Text style={styles.tituloCartaoPequeno}>{evento.titulo}</Text>
                    <TouchableOpacity onPress={() => setEventoSelecionado(evento)}>
                      <Text style={styles.btnTextoMiniAzul}>Ver Descrição</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.textoMutavel}>Nenhum evento neste dia.</Text>
              )}
            </View>
          )}
        </View>

        {/* DUAS COLUNAS LADO A LADO */}
        <View style={styles.duasColunasContainer}>
          
          <View style={styles.coluna}>
            <Text style={styles.tituloSecaoBloco}>PRÓXIMOS EVENTOS</Text>
            {listaProximos.map(renderCartaoPequeno)}
          </View>

          <View style={styles.coluna}>
            <Text style={styles.tituloSecaoBloco}>EVENTOS DA SEMANA</Text>
            {listaSemana.map(renderCartaoPequeno)}
          </View>

        </View>

      </ScrollView>

      {eventoSelecionado && (
        <EventoDetalhe evento={eventoSelecionado} onClose={() => setEventoSelecionado(null)} />
      )}
    </View>
  );
}