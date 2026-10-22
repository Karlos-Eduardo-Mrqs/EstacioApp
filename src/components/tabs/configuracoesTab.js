import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import CustomIcon from "../CustomIcon";

export default function ConfiguracoesTab({ isDesktop, onOpenDevs, onOpenSobre }) {
  return (
    <View style={styles.containerTab}>
      <CustomIcon name="settings-outline" size={36} color="#032551" />
      <Text style={styles.tituloTab}>Configurações</Text>
      <Text style={styles.textoTab}>Preferências do sistema e painel do utilizador.</Text>

      {/* Botões do rodapé integrados no mobile */}
      {!isDesktop && (
        <View style={styles.mobileButtonsContainer}>
          <TouchableOpacity 
            style={styles.botaoMobileConfig} 
            onPress={onOpenDevs}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotaoMobile}>⚙️ Desenvolvedores</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.botaoMobileConfig} 
            onPress={onOpenSobre}
            activeOpacity={0.8}
          >
            <Text style={styles.textoBotaoMobile}>ℹ️ Sobre</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  containerTab: {
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 350,
  },
  tituloTab: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#032551",
    marginTop: 10,
    marginBottom: 8,
  },
  textoTab: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  mobileButtonsContainer: {
    width: '100%',
    marginTop: 15,
    gap: 12,
    alignItems: 'center',
  },
  botaoMobileConfig: {
    width: '85%',
    backgroundColor: '#032551',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFD700',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  textoBotaoMobile: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});