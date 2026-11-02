import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { appStyles as styles } from "../../styles/mural/mainStyles";
import { modalLocalStyles } from "../../styles/painel/notificacaoGlobalTabStyles";
import { buscarCursosDoBanco } from "../../services/cursoServices"; // 👈 Importa o serviço de cursos
import CustomIcon from "../CustomIcon";

export default function AvisosGerencia({ avisosAtivos = [], onReexibirAviso }) {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [nomesEventosLocais, setNomesEventosLocais] = useState({});
  const [cursosDisponiveis, setCursosDisponiveis] = useState([]);

  // Carrega os cursos e eventos locais para garantir os nomes reais na tag
  useEffect(() => {
    async function carregarDadosRelacionados() {
      try {
        // 1. Busca os cursos do banco para mapear ID -> Nome
        const listaCursos = await buscarCursosDoBanco();
        setCursosDisponiveis(listaCursos || []);

        // 2. Busca os eventos salvos no AsyncStorage
        const salvosJson = await AsyncStorage.getItem('@notificacoes_salvas');
        if (salvosJson) {
          const eventosSalvos = JSON.parse(salvosJson);
          const mapaEventos = {};
          eventosSalvos.forEach(ev => {
            mapaEventos[ev.id] = ev.titulo;
          });
          setNomesEventosLocais(mapaEventos);
        }
      } catch (e) {
        console.log("Erro ao carregar dados relacionados aos avisos:", e);
      }
    }
    carregarDadosRelacionados();
  }, [avisosAtivos]);

  // Função auxiliar para renderizar a tag de destino com o nome real
  const renderizarBadgeDestino = (item) => {
    let texto = "🌍 Todos";
    let corFundo = "#FEF08A";
    let corTexto = "#854D0E";

    if (item.curso_id) {
      // Procura o nome do curso pelo ID na lista carregada do banco
      const cursoEncontrado = cursosDisponiveis.find(c => Number(c.id) === Number(item.curso_id));
      const nomeCurso = cursoEncontrado ? (cursoEncontrado.titulo || cursoEncontrado.nome) : (item.nomeDestinatarioCurso || `Curso #${item.curso_id}`);
      
      texto = `📚 Curso: ${nomeCurso}`;
      corFundo = "#DBEAFE";
      corTexto = "#1D4ED8";
    } else if (item.evento_id) {
      const nomeEvento = item.nomeDestinatarioEvento || nomesEventosLocais[item.evento_id] || `Evento #${item.evento_id}`;
      texto = `📅 Evento: ${nomeEvento}`;
      corFundo = "#F3E8FF";
      corTexto = "#7E22CE";
    }

    return (
      <View style={{ backgroundColor: corFundo, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 4 }}>
        <Text style={{ fontSize: 10, fontWeight: 'bold', color: corTexto }}>
          {texto}
        </Text>
      </View>
    );
  };

  const temMuitosAvisos = avisosAtivos.length >= 3;

  return (
    <View style={styles.blocoSection}>
      <Text style={styles.tituloSecaoBloco}>AVISOS DA GERÊNCIA</Text>
      
      {avisosAtivos && avisosAtivos.length > 0 ? (
        temMuitosAvisos ? (
          <TouchableOpacity
            style={{
              backgroundColor: '#FEF9C3',
              borderWidth: 1,
              borderColor: '#FACC15',
              padding: 14,
              borderRadius: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
            onPress={() => setModalVisivel(true)}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 }}>
              <Text style={{ fontSize: 16, marginRight: 8 }}>📢</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#713F12' }}>
                  Avisos Importantes Disponíveis
                </Text>
                <Text style={{ fontSize: 11, color: '#854D0E', marginTop: 2 }}>
                  Existem {avisosAtivos.length} avisos ativos para você. Clique para visualizar[cite: 10].
                </Text>
              </View>
            </View>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#CA8A04' }}>Ver Todos 👆</Text>
          </TouchableOpacity>
        ) : (
          avisosAtivos.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={{
                backgroundColor: '#FEF9C3',
                borderLeftWidth: 4,
                borderLeftColor: '#FACC15',
                padding: 12,
                borderRadius: 8,
                marginBottom: 8,
              }}
              onPress={() => onReexibirAviso && onReexibirAviso(item)}
            >
              {renderizarBadgeDestino(item)}

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#713F12' }} numberOfLines={1}>
                    {item.titulo}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#854D0E', marginTop: 2 }} numberOfLines={2}>
                    {item.mensagem}
                  </Text>
                </View>
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#CA8A04' }}>Ver 👆</Text>
              </View>
            </TouchableOpacity>
          ))
        )
      ) : (
        <View style={styles.caixaAviso}>
          <Text style={styles.textoMutavel}>
            Sem avisos globais no momento.
          </Text>
        </View>
      )}

      {/* Modal para mais de 3 avisos[cite: 10] */}
      <Modal 
        visible={modalVisivel} 
        transparent 
        animationType="fade" 
        onRequestClose={() => setModalVisivel(false)}
      >
        <View style={modalLocalStyles.overlay}>
          <View style={modalLocalStyles.modalContainer}>
            <View style={modalLocalStyles.headerModal}>
              <Text style={modalLocalStyles.tituloModal}>Avisos Ativos</Text>
              
              <TouchableOpacity onPress={() => setModalVisivel(false)}>
                <CustomIcon 
                  name={Platform.OS === 'web' ? 'close' : 'arrow-back'} 
                  size={24} 
                  color="#64748B" 
                />
              </TouchableOpacity>
            </View>

            <FlatList
              data={avisosAtivos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={modalLocalStyles.cardAviso}
                  onPress={() => {
                    setModalVisivel(false);
                    if (onReexibirAviso) onReexibirAviso(item);
                  }}
                >
                  {renderizarBadgeDestino(item)}
                  <Text style={modalLocalStyles.cardTitulo}>{item.titulo}</Text>
                  <Text style={modalLocalStyles.cardTexto} numberOfLines={3}>{item.mensagem}</Text>
                  <Text style={modalLocalStyles.cardRodape}>
                    Expira em: {new Date(item.expira_em).toLocaleString()}[cite: 10]
                  </Text>
                </TouchableOpacity>
              )}
              style={{ maxHeight: 400 }}
            />

            <TouchableOpacity 
              style={modalLocalStyles.botaoFechar} 
              onPress={() => setModalVisivel(false)}
            >
              <Text style={modalLocalStyles.textoBotaoFechar}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}