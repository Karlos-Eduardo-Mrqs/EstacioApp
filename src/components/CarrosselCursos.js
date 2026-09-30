import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

export default function DepthCarousel({ cursos, cursosTecnicos, onSelectCurso }) {
  const [tipoAtivo, setTipoAtivo] = useState('destaque'); // 'destaque' ou 'tecnico'
  const listaAtual = tipoAtivo === 'destaque' ? cursos : cursosTecnicos;

  return (
    <View style={styles.container}>
      {/* Botões de Alternância */}
      <View style={styles.headerBotoes}>
        <TouchableOpacity 
          style={[styles.botaoTab, tipoAtivo === 'destaque' && styles.botaoTabAtivo]} 
          onPress={() => setTipoAtivo('destaque')}
        >
          <Text style={[styles.textoTab, tipoAtivo === 'destaque' && styles.textoTabAtivo]}>Cursos em Destaque</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.botaoTab, tipoAtivo === 'tecnico' && styles.botaoTabAtivo]} 
          onPress={() => setTipoAtivo('tecnico')}
        >
          <Text style={[styles.textoTab, tipoAtivo === 'tecnico' && styles.textoTabAtivo]}>Cursos Técnicos</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {listaAtual.map((curso, index) => (
          <TouchableOpacity key={curso.id} style={styles.depthCard} activeOpacity={0.9} onPress={() => onSelectCurso(curso)}>
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>#{index + 1}</Text>
            </View>
            <Text style={styles.cardTitle} numberOfLines={2}>{curso.titulo}</Text>
            <Text style={styles.cardDescription} numberOfLines={3}>{curso.descricao}</Text>
            <View style={styles.footerCard}>
              <Text style={styles.cardModalidade} numberOfLines={1}>📌 {curso.modalidade}</Text>
              <Text style={styles.verMais}>+ Detalhes</Text>
              
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    backgroundColor: '#032551',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  headerBotoes: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 10,
    paddingHorizontal: 15,
  },
  botaoTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#054ca9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffbf1d',
  },
  botaoTabAtivo: {
    backgroundColor: '#ffbf1d',
  },
  textoTab: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  textoTabAtivo: {
    color: '#032551',
  },
  scrollContainer: {
    paddingHorizontal: 10,
    gap: 12,
  },
  depthCard: {
    width: 240,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-between',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderTopWidth: 4,
    borderTopColor: '#ffbf1d',
  },
  badgeContainer: {
    backgroundColor: '#e3f2fd',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#054ca9',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#032551',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 11,
    color: '#555',
    lineHeight: 16,
    marginBottom: 10,
  },
  footerCard: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardModalidade: {
    fontSize: 10,
    color: '#666',
    flex: 1,
  },
  verMais: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#054ca9',
  },
});