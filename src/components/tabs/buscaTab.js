import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import CustomIcon from '../CustomIcon';
import { buscaTabstyles as styles } from '../../styles/tabs/buscaTabStyles';

export default function BuscaTab({ todosOsEventos = [], onSelectEvento }) {
  const [termoBusca, setTermoBusca] = useState('');

  // Filtra os eventos com base no termo digitado (título, descrição, local ou turma)
  const eventosFiltrados = todosOsEventos.filter((evento) => {
    if (!termoBusca.trim()) return true;
    
    const texto = termoBusca.toLowerCase();
    const tituloMatch = evento.titulo?.toLowerCase().includes(texto);
    const descMatch = evento.descricao?.toLowerCase().includes(texto);
    const localMatch = evento.local?.toLowerCase().includes(texto);
    const turmaMatch = evento.turma?.toLowerCase().includes(texto);

    return tituloMatch || descMatch || localMatch || turmaMatch;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>🔍 Buscar Eventos e Avisos</Text>
      <Text style={styles.subtitulo}>Pesquise por palavra-chave, curso, local ou título do evento.</Text>

      {/* Barra de Pesquisa */}
      <View style={styles.searchBar}>
        <CustomIcon name="search-outline" size={20} color="#64748b" style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          placeholder="O que procura no campus?"
          placeholderTextColor="#94a3b8"
          value={termoBusca}
          onChangeText={setTermoBusca}
        />
        {termoBusca.length > 0 && (
          <TouchableOpacity onPress={() => setTermoBusca('')}>
            <Text style={styles.clearButton}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Lista de Resultados */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listaContainer}>
        {eventosFiltrados.length > 0 ? (
          eventosFiltrados.map((evento) => (
            <TouchableOpacity
              key={evento.id}
              style={styles.cardEvento}
              activeOpacity={0.8}
              onPress={() => onSelectEvento?.(evento)}
            >
              <View style={styles.headerCard}>
                <Text style={styles.tagEvento}>{evento.tipo || "Evento"}</Text>
                <Text style={styles.dataEvento}>📅 {evento.dia} de {evento.mes}</Text>
              </View>
              
              <Text style={styles.tituloEvento} numberOfLines={2}>{evento.titulo}</Text>
              <Text style={styles.localEvento} numberOfLines={1}>📍 {evento.local || evento.turma || "Campus"}</Text>
              
              <Text style={styles.verDetalhes}>Ver detalhes completos →</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.vazioContainer}>
            <Text style={styles.vazioTexto}>Nenhum evento encontrado para "{termoBusca}".</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

