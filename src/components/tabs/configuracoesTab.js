import { View, Text, TouchableOpacity} from "react-native";
import CustomIcon from "../CustomIcon";
import {configuracoesTabstyles as styles} from "../../styles/tabs/configuracoesTabStyles";

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
