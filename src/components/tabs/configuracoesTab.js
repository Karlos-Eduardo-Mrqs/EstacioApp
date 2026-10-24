import { View, Text, TouchableOpacity } from "react-native";
import CustomIcon from "../CustomIcon";
import { configuracoesTabstyles as styles } from "../../styles/tabs/configuracoesTabStyles";

export default function ConfiguracoesTab({ isDesktop, onOpenDevs, onOpenSobre, onRedefinirCursos }) {
  return (
    <View style={styles.containerTab}>
      <CustomIcon name="settings-outline" size={36} color="#032551" />
      <Text style={styles.tituloTab}>Configurações</Text>
      <Text style={styles.textoTab}>Preferências do sistema e painel do utilizador.</Text>

      {/* SEÇÃO DE PREFERÊNCIAS E REFINAMENTO DE CURSOS */}
      <View style={{ width: '100%', maxWidth: 400, marginTop: 20 }}>
        <TouchableOpacity 
          style={{
            backgroundColor: '#032551',
            paddingVertical: 14,
            paddingHorizontal: 20,
            borderRadius: 12,
            alignItems: 'center',
            marginBottom: 12,
            shadowColor: '#032551',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 4,
          }} 
          onPress={onRedefinirCursos}
          activeOpacity={0.8}
        >
          <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 14 }}>
            📚 Redefinir Cursos de Interesse
          </Text>
        </TouchableOpacity>
      </View>

      {/* BOTÕES INSTITUCIONAIS INTEGRADOS NO MOBILE */}
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