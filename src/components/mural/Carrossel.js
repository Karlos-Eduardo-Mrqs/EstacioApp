import { Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";

// ⚠️ CORREÇÃO AQUI: Importa com o nome correto e renomeia como 'styles'
import { carrosselStyles as styles } from "../../styles/mural/carrosselStyles";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = 280;

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
      description:
        "Encerramento de semestre, provas finais e feira de projetos.",
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
