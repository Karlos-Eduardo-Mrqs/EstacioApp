import React, { useState } from 'react';
import { Linking } from 'net' // ou direto do 'react-native'
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import EventoDetalhe from './EventoDetalhe';
import Carrossel from '../components/Carrossel';
import DepthCarousel from '../components/CarrosselCursos'; // Componente de cursos com os botões de Destaque e Técnicos
import { useScriptApp } from '../hooks/ScriptApp';
import { appStyles as styles } from '../styles/muralStyles';

export default function App() {
  const {
    eventoSelecionado, setEventoSelecionado,
    diaFocado, eventosDoDia,
    diasSemana, semestre, listaProximos, listaSemana, cursos, cursosTecnicos, eventosProximoMes,
    renderizarDias, renderCartaoPequeno
  } = useScriptApp(styles);

  const [cursoSelecionado, setCursoSelecionado] = useState(null);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* CABEÇALHO */}
        <View style={styles.cabecalho}>
          <Text style={styles.tituloCabecalho}>Mural Nova América</Text>
          <Text style={styles.subtituloCabecalho}>Campus Nova América - Estácio</Text>
        </View>

        {/* AVISOS DA GERÊNCIA */}
        <View style={styles.blocoSection}>
          <Text style={styles.tituloSecaoBloco}>AVISOS DA GERÊNCIA</Text>
          <View style={styles.caixaAviso}><Text style={styles.textoMutavel}>Sem avisos globais no momento.</Text></View>
        </View>

        {/* CARROSSEL DE CURSOS (COM ABAS DE DESTAQUE E TÉCNICOS) */}
        {cursos && (
          <DepthCarousel cursos={cursos} cursosTecnicos={cursosTecnicos || []} onSelectCurso={(curso) => setCursoSelecionado(curso)} 
          />
        )}

        

        {/* CALENDÁRIO COMPLETO DO SEMESTRE (SETEMBRO A DEZEMBRO) */}
        <View style={styles.blocoSection}>
          <Text style={styles.tituloSecaoBloco}>AGENDA DO SEMESTRE (SETEMBRO A DEZEMBRO)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={styles.scrollCalendario}>
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
          <Text style={styles.legendaCalendario}>Dias em amarelo possuem eventos acadêmicos</Text>
        </View>

        {/* COLUNAS DE EVENTOS (PRÓXIMOS E DA SEMANA) */}
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

        {/* EVENTOS PARA O PRÓXIMO MÊS (OUTUBRO) */}
        <View style={styles.blocoSection}>
          <Text style={styles.tituloSecaoBloco}>EVENTOS PARA O PRÓXIMO MÊS (OUTUBRO)</Text>
          {eventosProximoMes.map(renderCartaoPequeno)}
        </View>

        {/* CARROSSEL NO FINAL DA PÁGINA */}
        <Carrossel />

      </ScrollView>

      {/* MODAL DE DETALHES DO EVENTO */}
      {eventoSelecionado && (
        <EventoDetalhe evento={eventoSelecionado} onClose={() => setEventoSelecionado(null)} />
      )}

      {/* MODAL DE DETALHES DO CURSO */}
      {cursoSelecionado && (
        <Modal animationType="fade" transparent={true} visible={true} onRequestClose={() => setCursoSelecionado(null)}>
          <View style={modalStyles.overlay}>
            <View style={modalStyles.modalConteudo}>
              <View style={modalStyles.cabecalhoModal}>
                <Text style={modalStyles.tituloModal}>{cursoSelecionado.titulo}</Text>
                <TouchableOpacity onPress={() => setCursoSelecionado(null)} style={modalStyles.btnFechar}>
                  <Text style={modalStyles.textoFechar}>X</Text>
                </TouchableOpacity>
              </View>

              <View style={modalStyles.corpoModal}>
                <Text style={modalStyles.textoDetalhe}>📖 <Text style={modalStyles.textoBold}>Sobre:</Text> {cursoSelecionado.descricao}</Text>
                <Text style={modalStyles.textoDetalhe}>📌 <Text style={modalStyles.textoBold}>Modalidades:</Text> {cursoSelecionado.modalidade}</Text>
                
                <Text style={[modalStyles.textoBold, {marginTop: 15, marginBottom: 5, color: '#054ca9'}]}>Principais Eventos do Curso:</Text>
                {cursoSelecionado.eventosPrincipais && cursoSelecionado.eventosPrincipais.map((ev, index) => (
                  <View key={index} style={modalStyles.eventoItem}>
                    <Text style={{fontSize: 12, color: '#333'}}>• {ev.titulo}</Text>
                    <Text style={{fontSize: 11, fontWeight: 'bold', color: '#666'}}>{ev.data}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalConteudo: { width: '100%', maxWidth: 340, backgroundColor: '#ffffff', borderRadius: 8, overflow: 'hidden' },
  cabecalhoModal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#054ca9', padding: 15 },
  tituloModal: { fontSize: 15, fontWeight: 'bold', color: '#ffffff', flex: 1 },
  btnFechar: { paddingHorizontal: 8 },
  textoFechar: { fontSize: 16, fontWeight: 'bold', color: '#ffffff' },
  corpoModal: { padding: 15 },
  textoDetalhe: { fontSize: 13, color: '#444', marginBottom: 8, lineHeight: 18 },
  textoBold: { fontWeight: 'bold', color: '#000' },
  eventoItem: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f4f6f8', padding: 8, borderRadius: 4, marginBottom: 5 }
});