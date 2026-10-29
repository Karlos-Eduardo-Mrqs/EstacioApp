import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, Modal, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { painelEventosStyles as styles } from "../../styles/painel/painelEventosStyles";
import { formatarDataHora, formatarEntradaData, obterTempoEvento } from '../../utils/dataUtils';
import { useGerenciarEventos } from '../../hooks/useGerenciarEventos';

function Campo({ label, style, ...props }) {
  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{label}</Text>
      <TextInput {...props} style={[styles.input, style]} placeholderTextColor="#94A3B8" />
    </View>
  );
}

function BotaoIcone({ nome, cor, onPress, acessibilidade }) {
  return (
    <TouchableOpacity style={styles.botaoIcone} onPress={onPress} accessibilityLabel={acessibilidade}>
      <Ionicons name={nome} size={21} color={cor} />
    </TouchableOpacity>
  );
}

export default function GerenciarEventos() {
  const {
    eventos, eventosFiltrados, quantidadeAtivos, busca, setBusca, agora,
    modalEvento, setModalEvento, eventoEditando, titulo, setTitulo,
    inicioTexto, setInicioTexto, terminoTexto, setTerminoTexto,
    descricao, setDescricao, imagem, setImagem,
    abrirNovoEvento, abrirEdicao, selecionarImagem, salvarEvento,
    alternarStatus, excluirEvento, carregando
  } = useGerenciarEventos();

  return (
    <View style={styles.safeArea}>
      <StatusBar backgroundColor="#F4F5F7" barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.tituloPagina}>Painel de Eventos</Text>
        <Text style={styles.subtitulo}>Gerencie os eventos e o calendário acadêmico.</Text>

        <View style={styles.resumoContainer}>
          <View style={styles.resumoCard}>
            <Ionicons name="calendar-outline" size={23} color="#173EA5" />
            <Text style={styles.resumoNumero}>{quantidadeAtivos}</Text>
            <Text style={styles.resumoTexto}>Eventos ativos</Text>
          </View>

          <View style={styles.resumoCard}>
            <Ionicons name="albums-outline" size={23} color="#173EA5" />
            <Text style={styles.resumoNumero}>{eventos.length}</Text>
            <Text style={styles.resumoTexto}>Total de eventos</Text>
          </View>
        </View>

        {/* Lista de eventos */}
        <View style={styles.painel}>
          <View style={styles.painelCabecalho}>
            <View style={{ flex: 1 }}>
              <Text style={styles.tituloSecao}>Eventos cadastrados</Text>
              <Text style={styles.textoAuxiliar}>Gerencie datas, imagens e status.</Text>
            </View>

            <TouchableOpacity style={styles.botaoAdicionar} onPress={abrirNovoEvento}>
              <Ionicons name="add" size={29} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.buscaContainer}>
            <Ionicons name="search-outline" size={20} color="#64748B" />
            <TextInput
              style={styles.inputBusca}
              placeholder="Pesquisar evento..."
              placeholderTextColor="#94A3B8"
              value={busca}
              onChangeText={setBusca}
            />
          </View>

          {carregando ? (
            <ActivityIndicator size="large" color="#173EA5" style={{ marginVertical: 20 }} />
          ) : eventosFiltrados.length === 0 ? (
            <Text style={styles.vazio}>Nenhum evento encontrado.</Text>
          ) : (
            eventosFiltrados.map((evento) => {
              const tempo = obterTempoEvento(evento, agora);

              return (
                <View key={evento.id} style={styles.eventoCard}>
                  {evento.imagem ? (
                    <Image source={{ uri: evento.imagem }} style={styles.imagemEvento} resizeMode="cover" />
                  ) : null}

                  <View style={styles.eventoConteudo}>
                    <View style={styles.eventoLinha}>
                      <View style={styles.eventoInformacoes}>
                        <Text style={styles.eventoTitulo}>{evento.titulo}</Text>

                        <View style={styles.linhaData}>
                          <Ionicons name="play-circle-outline" size={15} color="#64748B" />
                          <Text style={styles.eventoData}>{formatarDataHora(evento.inicio)}</Text>
                        </View>

                        <View style={styles.linhaData}>
                          <Ionicons name="stop-circle-outline" size={15} color="#64748B" />
                          <Text style={styles.eventoData}>{formatarDataHora(evento.termino)}</Text>
                        </View>
                      </View>

                      <View style={[styles.badge, evento.ativo ? styles.badgeAtivo : styles.badgeInativo]}>
                        <View style={[styles.ponto, { backgroundColor: evento.ativo ? '#16A34A' : '#DC2626' }]} />
                        <Text style={[styles.badgeTexto, { color: evento.ativo ? '#15803D' : '#B91C1C' }]}>
                          {evento.ativo ? 'Ativo' : 'Encerrado'}
                        </Text>
                      </View>
                    </View>

                    {!!evento.descricao && (
                      <Text style={styles.eventoDescricao}>{evento.descricao}</Text>
                    )}

                    <View style={[styles.contadorContainer, tempo.tipo === 'finalizado' && styles.contadorFinalizado]}>
                      <Ionicons name="timer-outline" size={18} color={tempo.tipo === 'finalizado' ? '#64748B' : '#173EA5'} />
                      <Text style={[styles.contadorTexto, tempo.tipo === 'finalizado' && styles.contadorTextoFinalizado]}>
                        {tempo.texto}
                      </Text>
                    </View>

                    <View style={styles.acoesEvento}>
                      <BotaoIcone nome="pencil-outline" cor="#173EA5" onPress={() => abrirEdicao(evento)} />
                      <BotaoIcone nome="trash-outline" cor="#DC2626" onPress={() => excluirEvento(evento)} />
                      <BotaoIcone 
                        nome={evento.ativo ? 'power-outline' : 'play-circle-outline'} 
                        cor={evento.ativo ? '#B45309' : '#15803D'} 
                        onPress={() => alternarStatus(evento)} 
                      />
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Modal de cadastro / edição */}
      <Modal visible={modalEvento} transparent animationType="slide" onRequestClose={() => setModalEvento(false)}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalCabecalho}>
              <Text style={styles.tituloModal}>{eventoEditando ? 'Editar evento' : 'Novo evento'}</Text>
              <TouchableOpacity onPress={() => setModalEvento(false)}>
                <Ionicons name="close" size={26} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Campo label="Nome do evento *" value={titulo} onChangeText={setTitulo} placeholder="Digite o nome" maxLength={100} />
              
              <Campo 
                label="Início (DD/MM/AAAA HH:MM:SS) *" 
                value={inicioTexto} 
                onChangeText={(t) => setInicioTexto(formatarEntradaData(t))} 
                placeholder="22/10/2026 08:00:00" 
                keyboardType="numeric" 
                maxLength={21} 
              />

              <Campo 
                label="Término (DD/MM/AAAA HH:MM:SS) *" 
                value={terminoTexto} 
                onChangeText={(t) => setTerminoTexto(formatarEntradaData(t))} 
                placeholder="24/10/2026 18:00:00" 
                keyboardType="numeric" 
                maxLength={21} 
              />

              <Campo 
                label="Descrição" 
                value={descricao} 
                onChangeText={setDescricao} 
                placeholder="Detalhes" 
                multiline 
                style={styles.inputDescricao} 
                textAlignVertical="top" 
                maxLength={500} 
              />

              <Text style={styles.label}>Imagem de capa (opcional)</Text>

              {imagem ? (
                <View style={styles.previaContainer}>
                  <Image source={{ uri: imagem }} style={styles.previaImagem} resizeMode="cover" />
                  <TouchableOpacity style={styles.removerImagem} onPress={() => setImagem(null)}>
                    <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
                    <Text style={styles.textoRemoverImagem}>Remover imagem</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.seletorImagem} onPress={selecionarImagem}>
                  <Ionicons name="image-outline" size={34} color="#173EA5" />
                  <Text style={styles.textoSeletorImagem}>Selecionar imagem</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.botaoEnviar} onPress={salvarEvento}>
                <Ionicons name="save-outline" size={19} color="#FFFFFF" />
                <Text style={styles.textoBotaoEnviar}>Salvar evento</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.botaoCancelar} onPress={() => setModalEvento(false)}>
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}