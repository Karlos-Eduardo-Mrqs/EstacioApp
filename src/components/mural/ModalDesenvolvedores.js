import { Ionicons } from "@expo/vector-icons";
import {Linking,Modal,ScrollView,Text,TouchableOpacity,View} from "react-native";
import { modalDesenvolvedoresStyles } from "../../styles/mural/modalDesenvolvedoresStyles";
import { CoresInstitucionais } from "../../styles/theme";

export default function ModalDesenvolvedores({ visible, onClose }) {
  const desenvolvedores = [
    {
      nome: "Carlos Eduardo",
      papel: "Interface · Componentes · Gestão de Estado",
      instagram: "karlmbarreto",
      linkedin: "in/carlos-eduardom-barreto/",
      github: "Karlos-Eduardo-Mrqs",
    },
    {
      nome: "Lucas Andrade",
      papel: "Desenvolvimento Mobile · Ecrãs · Navegação",
      instagram: "Luucas_andrade21",
      linkedin: "in/lucas-andrade-313b09236",
      github: "Lucas-deAndrade21",
    },
    {
      nome: "Victor Leon",
      papel: "Lógica de Dados · Estruturação · Componentes",
      instagram: "victorleon",
      linkedin: "in/victorlmmartello",
      github: "VictorLMMartello",
    },
    {
      nome: "Vinícius Amador",
      papel: "Integração · Testes · Suporte Técnico",
      instagram: "viniciussvelasco_",
      linkedin: "in/vinicius-amador-velasco-9400b6376",
      github: "vVelasco30",
    },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalDesenvolvedoresStyles.overlay}>
        <View style={modalDesenvolvedoresStyles.modalConteudo}>
          {/* Cabeçalho do Modal */}
          <View style={modalDesenvolvedoresStyles.cabecalhoModal}>
            <Text style={modalDesenvolvedoresStyles.tituloModal}>
              ⚙️ Equipe de Desenvolvimento
            </Text>
            <TouchableOpacity
              onPress={onClose}
              style={modalDesenvolvedoresStyles.btnFechar}
            >
              <Text style={modalDesenvolvedoresStyles.textoFechar}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Corpo com Scroll para os Cartões */}
          <ScrollView contentContainerStyle={modalDesenvolvedoresStyles.corpoModalScroll} showsVerticalScrollIndicator={false}>
            {desenvolvedores.map((dev, index) => (
              <View key={index} style={modalDesenvolvedoresStyles.cardDev}>
                {/* Foto e Nome Centralizados */}
                <View style={modalDesenvolvedoresStyles.headerCardDev}>
                  <View style={modalDesenvolvedoresStyles.avatarPlaceholder}>
                    <Text style={modalDesenvolvedoresStyles.avatarText}>
                      {dev.nome.charAt(0)}
                    </Text>
                  </View>
                  <View>
                    <Text style={modalDesenvolvedoresStyles.devNome}>
                      {dev.nome}
                    </Text>
                    <Text style={modalDesenvolvedoresStyles.devPapel}>
                      {dev.papel}
                    </Text>
                  </View>
                </View>

                {/* Links de Redes Sociais em Linha Única */}
                <View style={modalDesenvolvedoresStyles.linksContainer}>
                  <TouchableOpacity
                    style={modalDesenvolvedoresStyles.linkRow}
                    onPress={() =>
                      Linking.openURL(`https://instagram.com/${dev.instagram}`)
                    }
                  >
                    <Ionicons
                      name="logo-instagram"
                      size={13}
                      color={CoresInstitucionais.azulPrincipal}
                    />
                    <Text style={modalDesenvolvedoresStyles.linkText}>
                      Instagram
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={modalDesenvolvedoresStyles.linkRow}
                    onPress={() =>
                      Linking.openURL(`https://linkedin.com/${dev.linkedin}`)
                    }
                  >
                    <Ionicons
                      name="logo-linkedin"
                      size={13}
                      color={CoresInstitucionais.azulPrincipal}
                    />
                    <Text style={modalDesenvolvedoresStyles.linkText}>
                      LinkedIn
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={modalDesenvolvedoresStyles.linkRow}
                    onPress={() =>
                      Linking.openURL(`https://github.com/${dev.github}`)
                    }
                  >
                    <Ionicons name="logo-github" size={13} color={CoresInstitucionais.azulPrincipal}/>
                    <Text style={modalDesenvolvedoresStyles.linkText}>
                      GitHub
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
