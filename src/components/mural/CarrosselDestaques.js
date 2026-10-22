import { useRef } from "react";
import { ScrollView, Text, View } from "react-native";
import CustomIcon from "../CustomIcon";
import { carrosselStyles as styles } from "../../styles/mural/carrosselDestaquesStyles";

export default function Carrossel() {
  const scrollRef = useRef(null);

  const itens = [
    {
      id: 1,
      title: "Setembro Acadêmico",
      description: "Início das aulas, recepção de calouros e Hackathon de TI.",
      icon: "calendar-outline",
    },
    {
      id: 2,
      title: "Outubro Tecnológico",
      description: "Semana da Ciência, Tecnologia e feiras de saúde.",
      icon: "star-outline",
    },
    {
      id: 3,
      title: "Novembro de Práticas",
      description: "Simulações de júri, palestras de empregabilidade e exames.",
      icon: "ribbon-outline",
    },
    {
      id: 4,
      title: "Dezembro (Até dia 15)",
      description: "Encerramento de semestre, provas finais e feira de projetos.",
      icon: "time-outline",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.tituloSecao}>DESTAQUES DO PERÍODO</Text>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        contentContainerStyle={styles.track}
      >
        {itens.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.iconContainer}>
              <CustomIcon name={item.icon} size={20} color="#032551" />
            </View>
            
            {/* Bloco de texto padronizado com width 100% */}
            <View style={styles.textContainer}>
              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text style={styles.itemDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}