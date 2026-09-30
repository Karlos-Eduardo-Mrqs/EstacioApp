import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet, Linking } from 'react-native';
import EventoDetalhe from './EventoDetalhe';
import Carrossel from '../components/Carrossel';
import DepthCarousel from '../components/CarrosselCursos'; 
import { useScriptApp } from '../hooks/ScriptApp';
import { appStyles as styles } from '../styles/muralStyles';

export default function App() {
  const {
    eventoSelecionado, setEventoSelecionado,
    diaFocado, eventosDoDia,
    diasSemana, semestre, listaProximos, listaSemana, cursos, cursosTecnicos, eventosProximoMes,
    renderizarDias
  } = useScriptApp(styles);

  const [cursoSelecionado, setCursoSelecionado] = useState(null);

  // Função auxiliar para renderizar cartões em formato de carrossel horizontal
  const renderCartaoCarrossel = (evento) => (
    <View key={evento.id} style={estilosCarrosselEvento.cartao}>
      <Text style={estilosCarrosselEvento.tag}>{evento.tipo}</Text>
      <Text style={estilosCarrosselEvento.titulo} numberOfLines={2}>{evento.titulo}</Text>
      <Text style={estilosCarrosselEvento.data}>📅 {evento.dia} de {evento.mes}</Text>
      <Text style={estilosCarrosselEvento.local} numberOfLines={1}>📍 {evento.local}</Text>
      
      <TouchableOpacity 
        style={estilosCarrosselEvento.botaoDetalhes} 
        onPress={() => setEventoSelecionado(evento)}
      >
        <Text style={estilosCarrosselEvento.textoBotao}>+ Detalhes</Text>
      </TouchableOpacity>
    </View>
  );

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

        {/* CALENDÁRIO COMPLETO DO SEMESTRE */}
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
        
        {/* CAIXA DE EVENTOS DO DIA CLICADO */}
        {diaFocado && (
          <View style={styles.areaEventosDoDia}>
            <Text style={styles.tituloDiaFocado}>Eventos de {diaFocado}</Text>
            {eventosDoDia.length > 0 ? (
              eventosDoDia.map(evento => (
                <View key={evento.id} style={styles.cartaoDiaFocado}>
                  <View style={{flex: 1, marginRight: 10}}>
                    <Text style={styles.tituloCartaoPequeno}>{evento.titulo}</Text>
                    <Text style={{fontSize: 10, color: '#666'}}>📍 {evento.local} | 🕛 {evento.horas_acc || 0}h Acc</Text>
                  </View>
                  <TouchableOpacity onPress={() => setEventoSelecionado(evento)}>
                    <Text style={styles.btnTextoMiniAzul}>Ver Descrição</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.textoMutavel}>Nenhum evento agendado para este dia.</Text>
            )}
          </View>
        )}

        {/* CARROSSEL DE CURSOS (LOGO ABAIXO DO CALENDÁRIO) */}
        {cursos && (
          <DepthCarousel 
            cursos={cursos} 
            cursosTecnicos={cursosTecnicos || []} 
            onSelectCurso={(curso) => setCursoSelecionado(curso)} 
          />
        )}

        {/* ========================================================= */}
        {/* CARROSSEL: PRÓXIMOS EVENTOS */}
        {/* ========================================================= */}
        <View style={styles.blocoSection}>
          <Text style={styles.tituloSecaoBloco}>PRÓXIMOS EVENTOS</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilosCarrosselEvento.containerScroll}>
            {listaProximos.length > 0 ? (
              listaProximos.map(renderCartaoCarrossel)
            ) : (
              <Text style={styles.textoMutavel}>Nenhum próximo evento encontrado.</Text>
            )}
          </ScrollView>
        </View>

        {/* ========================================================= */}
        {/* CARROSSEL: EVENTOS DA SEMANA */}
        {/* ========================================================= */}
        <View style={styles.blocoSection}>
          <Text style={styles.tituloSecaoBloco}>EVENTOS DA SEMANA</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilosCarrosselEvento.containerScroll}>
            {listaSemana.length > 0 ? (
              listaSemana.map(renderCartaoCarrossel)
            ) : (
              <Text style={styles.textoMutavel}>Nenhum evento agendado para esta semana.</Text>
            )}
          </ScrollView>
        </View>

        {/* ========================================================= */}
        {/* CARROSSEL: EVENTOS PARA O PRÓXIMO MÊS (OUTUBRO) */}
        {/* ========================================================= */}
        <View style={styles.blocoSection}>
          <Text style={styles.tituloSecaoBloco}>EVENTOS PARA O PRÓXIMO MÊS (OUTUBRO)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={estilosCarrosselEvento.containerScroll}>
            {eventosProximoMes.length > 0 ? (
              eventosProximoMes.map(renderCartaoCarrossel)
            ) : (
              <Text style={styles.textoMutavel}>Nenhum evento para o próximo mês.</Text>
            )}
          </ScrollView>
        </View>

        {/* CARROSSEL GERAL NO FINAL DA PÁGINA */}
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

                <TouchableOpacity 
                  style={modalStyles.btnSiteOficial} 
                  onPress={() => Linking.openURL(cursoSelecionado.link)}
                >
                  <Text style={modalStyles.textoBtnSite}>+ Informações</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

// Estilos específicos para os novos cartões em formato de carrossel de eventos
const estilosCarrosselEvento = StyleSheet.create({
  containerScroll: {
    paddingHorizontal: 15,
    gap: 12,
  },
  cartao: {
    width: 230,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderTopWidth: 4,
    borderTopColor: '#054ca9',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: '#e3f2fd',
    color: '#054ca9',
    fontSize: 9,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  titulo: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#032551',
    marginBottom: 6,
    height: 34,
  },
  data: {
    fontSize: 11,
    color: '#555',
    marginBottom: 2,
  },
  local: {
    fontSize: 11,
    color: '#777',
    marginBottom: 10,
  },
  botaoDetalhes: {
    backgroundColor: '#054ca9',
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
});

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
  eventoItem: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f4f6f8', padding: 8, borderRadius: 4, marginBottom: 5 },
  btnSiteOficial: { marginTop: 15, backgroundColor: '#ffbf1d', paddingVertical: 10, borderRadius: 6, alignItems: 'center' },
  textoBtnSite: { fontWeight: 'bold', color: '#032551', fontSize: 12 }
});