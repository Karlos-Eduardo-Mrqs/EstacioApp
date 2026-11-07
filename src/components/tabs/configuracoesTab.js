import { View, Text, TouchableOpacity } from "react-native";
import CustomIcon from "../CustomIcon"; // 👈 Importa apenas o CustomIcon
import { configuracoesTabstyles as styles } from "../../styles/tabs/configuracoesTabStyles";

export default function ConfiguracoesTab({ 
  isDesktop, 
  onOpenDevs, 
  onOpenSobre, 
  onRedefinirCursos,
  cursosSelecionados = [],
  cursosDisponiveis = [] 
}) {
  const cursosEscolhidosNomes = cursosDisponiveis.filter(
    (curso) => cursosSelecionados.includes(curso.id || curso.titulo)
  );

  return (
    <View style={styles.containerTab}>
      <CustomIcon name="settings-outline" size={36} color="#032551" />
      <Text style={styles.tituloTab}>Configurações</Text>
      <Text style={styles.textoTab}>Preferências do sistema e painel do utilizador.</Text>

      {/* SECÇÃO DE CURSOS DE INTERESSE EM CARDS LADO A LADO COM ÍCONES */}
      <View style={{ width: '100%', maxWidth: 520, marginTop: 18, marginBottom: 14 }}>
        <Text style={{ fontSize: 14.5, fontWeight: 'bold', color: '#032551', marginBottom: 12 }}>
          Seus Cursos de Interesse ({cursosSelecionados.length}/5):
        </Text>
        
        <View style={styles.cardsRow}>
          {cursosEscolhidosNomes.length > 0 ? (
              cursosEscolhidosNomes.map((curso, idx) => {
                const nomeCurso = curso.titulo || curso.nome;
                
                // 🛠️ Usa o ícone que veio do banco de dados (curso.icone), ou usa 'book-outline' como padrão
                const iconeDinamico = curso.icone || "book-outline";
                
                return (
                  <View key={idx} style={styles.cursoCard}>
                    {/* Ícone dinâmico específico de cada curso carregado do BD */}
                    <CustomIcon name={iconeDinamico} size={22} color="#032551" style={{ marginBottom: 6 }} />
                    <Text style={styles.cursoCardTexto} numberOfLines={2}>
                      {nomeCurso}
                    </Text>
                  </View>
                );
              })
            ) : (
              <View style={styles.emptyCardContainer}>
                <Text style={styles.emptyCardTexto}>
                  Nenhum curso configurado ainda.
                </Text>
              </View>
            )}
        </View>
      </View>

      {/* BOTÃO DE REDEFINIR CURSOS */}
      <View style={{ width: '100%', maxWidth: 520, marginBottom: 16 }}>
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