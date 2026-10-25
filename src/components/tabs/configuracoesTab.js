import { View, Text, TouchableOpacity } from "react-native";
import CustomIcon from "../CustomIcon";
import { configuracoesTabstyles as styles } from "../../styles/tabs/configuracoesTabStyles";

export default function ConfiguracoesTab({ isDesktop, onOpenDevs, onOpenSobre, onRedefinirCursos,
  cursosSelecionados = [],cursosDisponiveis = [] }) {
  // Mapeia os IDs salvos para os títulos reais dos cursos
  const cursosEscolhidosNomes = cursosDisponiveis.filter(
    (curso) => cursosSelecionados.includes(curso.id || curso.titulo)
  );

  return (
    <View style={styles.containerTab}>
      <CustomIcon name="settings-outline" size={36} color="#032551" />
      <Text style={styles.tituloTab}>Configurações</Text>
      <Text style={styles.textoTab}>Preferências do sistema e painel do utilizador.</Text>

      {/* SECÇÃO DE CURSOS DE INTERESSE SELECIONADOS */}
      <View style={{ width: '100%', maxWidth: 420, marginTop: 18, marginBottom: 14 }}>
        <Text style={{ fontSize: 14.5, fontWeight: 'bold', color: '#032551', marginBottom: 8 }}>
          📚 Seus Cursos de Interesse ({cursosSelecionados.length}/5):
        </Text>
        
        <View style={{
          backgroundColor: '#f8fafc',
          borderRadius: 12,
          padding: 14,
          borderWidth: 1,
          borderColor: '#e2e8f0',
        }}>
          {cursosEscolhidosNomes.length > 0 ? (
            cursosEscolhidosNomes.map((curso, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
                <Text style={{ color: '#032551', fontWeight: 'bold', marginRight: 8, fontSize: 16 }}>•</Text>
                <Text style={{ fontSize: 14, color: '#1e293b', fontWeight: '600' }}>
                  {curso.titulo || curso.nome}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ fontSize: 13.5, color: '#94a3b8', fontStyle: 'italic' }}>
              Nenhum curso configurado ainda.
            </Text>
          )}
        </View>
      </View>

      {/* BOTÃO DE REDEFINIR CURSOS */}
      <View style={{ width: '100%', maxWidth: 420, marginBottom: 16 }}>
        <TouchableOpacity 
          style={{
            backgroundColor: '#032551',
            paddingVertical: 14,
            paddingHorizontal: 20,
            borderRadius: 12,
            alignItems: 'center',
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
            ⚙️ Redefinir / Alterar Cursos
          </Text>
        </TouchableOpacity>
      </View>

      {/* BOTÕES DO RODAPÉ NO MOBILE */}
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