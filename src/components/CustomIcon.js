import { Image, Text } from "react-native";
import { globalIcons } from '../constants/iconesConstantes'; // 👈 Importa a lista gerada automaticamente pelo script

export default function CustomIcon({ name, size = 20, color = "#FFFFFF" }) {
  const iconUri = globalIcons[name];

  if (!iconUri) {
    console.warn(`Ícone não mapeado: "${name}"`);
    return <Text style={{ fontSize: size, color }}>🔹</Text>;
  }

  return (
    <Image
      source={{ uri: iconUri }}
      style={{
        width: Number(size),
        height: Number(size),
      }}
      tintColor={color}
      resizeMode="contain"
    />
  );
}