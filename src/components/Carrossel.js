import React, { useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 280;

export default function Carrossel() {
  const scrollRef = useRef(null);

  const itens = [
    {
      id: 1,
      title: 'Setembro Acadêmico',
      description: 'Início das aulas, recepção de calouros e Hackathon de TI.',
      icon: 'calendar-outline'
    },
    {
      id: 2,
      title: 'Outubro Tecnológico',
      description: 'Semana da Ciência, Tecnologia e feiras de saúde.',
      icon: 'star-outline'
    },
    {
      id: 3,
      title: 'Novembro de Práticas',
      description: 'Simulações de júri, palestras de empregabilidade e exames.',
      icon: 'ribbon-outline'
    },
    {
      id: 4,
      title: 'Dezembro (Até dia 15)',
      description: 'Encerramento de semestre, provas finais e feira de projetos.',
      icon: 'time-outline'
    }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.tituloSecao}>DESTAQUES DO PERÍODO</Text>
      <ScrollView 
        ref={scrollRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH + 16}
        decelerationRate="fast"
        contentContainerStyle={styles.track}
      >
        {itens.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.iconContainer}>
              <Ionicons name={item.icon} size={20} color="#032551" />
            </View>
            <View>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  tituloSecao: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#032551',
    borderBottomWidth: 2,
    borderBottomColor: '#054ca9',
    paddingBottom: 5,
    marginBottom: 12,
    marginHorizontal: 15,
  },
  track: {
    paddingHorizontal: 15,
    gap: 16,
  },
  itemCard: {
    width: ITEM_WIDTH,
    backgroundColor: '#032551',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#ffbf1d', // Amarelo institucional Estácio
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ffbf1d',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 6,
  },
  itemDescription: {
    fontSize: 13,
    color: '#e0e0e0',
    lineHeight: 18,
  },
});