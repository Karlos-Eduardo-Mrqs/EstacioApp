import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import CustomIcon from '../CustomIcon';
import DetalhesBusca from './detalhesBusca';
import { buscaTabstyles as styles } from "../../styles/tabs/buscaTabStyles";

const { width } = Dimensions.get('window');
const columnWidth = (width > 768 ? 768 : width) / 2 - 24; 

const imagemExemploPadrao = require('../../../assets/image.png');

export default function BuscaTab({ todosOsEventos = [], onNotificar }) {
  const [termoBusca, setTermoBusca] = useState('');
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  // Filtra os eventos com base no termo digitado
  const eventosFiltrados = todosOsEventos.filter((evento) => {
    if (!termoBusca.trim()) return true;
    const texto = termoBusca.toLowerCase();
    return (
      evento.titulo?.toLowerCase().includes(texto) ||
      evento.descricao?.toLowerCase().includes(texto) ||
      evento.local?.toLowerCase().includes(texto) ||
      evento.turma?.toLowerCase().includes(texto)
    );
  });

  return (
    <View style={styles.container}>
      {/* ── BARRA DE PESQUISA ── */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <CustomIcon name="search-outline" size={18} color="#8e8e8e" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.input}
            placeholder="Pesquisar eventos, cursos..."
            placeholderTextColor="#8e8e8e"
            value={termoBusca}
            onChangeText={setTermoBusca}
          />
          {termoBusca.length > 0 && (
            <TouchableOpacity onPress={() => setTermoBusca('')}>
              <Text style={styles.clearButton}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── GRADE DE RESULTADOS ── */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.gridContainer}>
        {eventosFiltrados.length > 0 ? (
          <View style={styles.gridRow}>
            {eventosFiltrados.map((evento, index) => {
              const imagemFonte = evento.imagem ? { uri: evento.imagem } : imagemExemploPadrao;

              return (
                <TouchableOpacity
                  key={evento.id || index}
                  style={[styles.gridCard, { width: columnWidth }]}
                  activeOpacity={0.85}
                  onPress={() => setEventoSelecionado(evento)}
                >
                  <Image source={imagemFonte} style={styles.cardImageBackground} resizeMode="cover" />
                  <View style={styles.cardOverlay}>
                    <Text style={styles.cardTag} numberOfLines={1}>{evento.tipo || evento.turma || "Evento"}</Text>
                    <Text style={styles.cardTitle} numberOfLines={2}>{evento.titulo}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.vazioContainer}>
            <Text style={styles.vazioTexto}>Nenhum resultado encontrado para "{termoBusca}".</Text>
          </View>
        )}
      </ScrollView>

      {/* ── COMPONENTE ISOLADO DE DETALHES COM A IMAGEM DE VOLTA ── */}
      {eventoSelecionado && (
        <DetalhesBusca 
          evento={eventoSelecionado} 
          onClose={() => setEventoSelecionado(null)} 
          onNotificar={onNotificar} 
        />
      )}

    </View>
  );
}