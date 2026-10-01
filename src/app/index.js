import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet, Linking } from 'react-native';
import EventoDetalhe from './EventoDetalhe';
import Carrossel from '../components/Carrossel';
import DepthCarousel from '../components/CarrosselCursos'; 
import { useScriptApp } from '../hooks/ScriptApp';
import { appStyles as styles, estilosCarrosselEvento, modalStyles } from '../styles/muralStyles';

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
      {/* MODAL DE DETALHES DO CURSO (PADRÃO INSTITUCIONAL ESTÁCIO) */}
      {cursoSelecionado && (
        <Modal animationType="slide" transparent={true} visible={true} onRequestClose={() => setCursoSelecionado(null)}>
          <View style={modalStyles.overlay}>
            <View style={modalStyles.modalConteudo}>
              
              {/* CABEÇALHO DO MODAL */}
              <View style={modalStyles.cabecalhoModal}>
                <View style={{flex: 1}}>
                  <Text style={modalStyles.subtituloModalHeader}>Graduação / Curso</Text>
                  <Text style={modalStyles.tituloModal}>{cursoSelecionado.titulo}</Text>
                </View>
                <TouchableOpacity onPress={() => setCursoSelecionado(null)} style={modalStyles.btnFechar}>
                  <Text style={modalStyles.textoFechar}>X</Text>
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} style={modalStyles.corpoModalScroll}>
                
                {/* BLOCO 1: APRESENTAÇÃO */}
                <View style={modalStyles.blocoSecao}>
                  <Text style={modalStyles.tituloBlocoSecao}>APRESENTAÇÃO</Text>
                  <View style={modalStyles.linhaAmarela} />
                  <Text style={modalStyles.textoApresentacao}>{cursoSelecionado.descricao}</Text>
                  <Text style={modalStyles.textoModalidade}>📌 <Text style={{fontWeight: 'bold'}}>Modalidades:</Text> {cursoSelecionado.modalidade}</Text>
                  
                  {/* Botão de + Informações (Link Oficial) */}
                  <TouchableOpacity 
                    style={modalStyles.btnSiteOficial} 
                    onPress={() => Linking.openURL(cursoSelecionado.link)}
                  >
                    <Text style={modalStyles.textoBtnSite}>+ Informações (Site Oficial)</Text>
                  </TouchableOpacity>
                </View>

                {/* BLOCO 2: EVENTOS E AVISOS DO CURSO */}
                <View style={modalStyles.blocoSecao}>
                  <Text style={modalStyles.tituloBlocoSecao}>EVENTOS E AVISOS DO CURSO</Text>
                  <View style={modalStyles.linhaAmarela} />
                  
                  {cursoSelecionado.eventosPrincipais && cursoSelecionado.eventosPrincipais.length > 0 ? (
                    cursoSelecionado.eventosPrincipais.map((ev, index) => (
                      <View key={index} style={modalStyles.eventoCardModal}>
                        <Text style={modalStyles.tagEventoModal}>{ev.tipo || 'Evento'}</Text>
                        <Text style={modalStyles.tituloEventoModal} numberOfLines={2}>{ev.titulo}</Text>
                        <Text style={modalStyles.dataEventoModal}>📅 {ev.data} {ev.local ? `| 📍 ${ev.local}` : ''}</Text>
                        
                        <TouchableOpacity 
                          style={modalStyles.btnDetalhesModal} 
                          onPress={() => {
                            setCursoSelecionado(null);
                            setEventoSelecionado({
                              id: `curso-ev-${index}`,
                              titulo: ev.titulo,
                              tipo: ev.tipo || 'Evento',
                              dia: ev.data,
                              local: ev.local || cursoSelecionado.titulo,
                              turma: cursoSelecionado.titulo,
                              autor: `Coordenação de ${cursoSelecionado.titulo}`,
                              descricao: ev.descricao || `Evento oficial vinculado ao curso de ${cursoSelecionado.titulo}.`,
                              horas_acc: 10
                            });
                          }}
                        >
                          <Text style={modalStyles.textoBtnDetalhesModal}>+ Detalhes</Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <Text style={modalStyles.textoVazio}>Nenhum evento ou aviso publicado ainda.</Text>
                  )}
                </View>

                {/* BLOCO 3: FALE COM A COORDENAÇÃO */}
                <View style={modalStyles.blocoSecao}>
                  <Text style={modalStyles.tituloBlocoSecao}>FALE COM A COORDENAÇÃO</Text>
                  <View style={modalStyles.linhaAmarela} />
                  
                  {cursoSelecionado.coordenadores && cursoSelecionado.coordenadores.length > 0 ? (
                    /* 2º CASO: Se possui coordenadores, exibe o card detalhado (de baixo) */
                    cursoSelecionado.coordenadores.map((coord, index) => (
                      <View key={index} style={[modalStyles.cardCoordenacao, index > 0 && { marginTop: 15, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#eee' }]}>
                        <View style={modalStyles.topoCoordenacao}>
                          <View style={modalStyles.avatarCoordenacao}>
                            <Text style={{fontSize: 16, color: '#ffffff'}}>👤</Text>
                          </View>
                          <View style={{flex: 1}}>
                            <Text style={modalStyles.nomeCoordenacao}>{coord.nome}</Text>
                            <Text style={modalStyles.descricaoCoordenacao}>Coordenação de {cursoSelecionado.titulo}</Text>
                          </View>
                        </View>
                        
                        <View style={{marginTop: 8, gap: 4}}>
                          <TouchableOpacity onPress={() => Linking.openURL(`mailto:${coord.email}`)}>
                            <Text style={{fontSize: 11, color: '#054ca9', fontWeight: 'bold'}}>✉️ {coord.email}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => Linking.openURL(`tel:${coord.telefone}`)}>
                            <Text style={{fontSize: 11, color: '#054ca9', fontWeight: 'bold'}}>📞 {coord.telefone}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  ) : (
                    /* 1º CASO: Senão, exibe o card genérico (de cima) */
                    <View style={modalStyles.cardCoordenacao}>
                      <View style={modalStyles.topoCoordenacao}>
                        <View style={modalStyles.avatarCoordenacao}>
                          <Text style={{fontSize: 16, color: '#ffffff'}}>👤</Text>
                        </View>
                        <View style={{flex: 1}}>
                          <Text style={modalStyles.nomeCoordenacao}>Coordenação de {cursoSelecionado.titulo}</Text>
                          <Text style={modalStyles.descricaoCoordenacao}>Quer saber mais sobre o curso? Entre em contato com a coordenação acadêmica.</Text>
                        </View>
                      </View>
                      
                      <TouchableOpacity 
                        style={[modalStyles.btnContato, {marginTop: 10}]}
                        onPress={() => Linking.openURL('mailto:coordenacao@estacio.br?subject=Dúvida sobre o curso ' + cursoSelecionado.titulo)}
                      >
                        <Text style={modalStyles.textoBtnContato}>Enviar E-mail</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

              </ScrollView>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}