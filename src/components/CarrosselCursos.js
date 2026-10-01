import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { styles } from '../styles/carrosselCursosStyles';

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
