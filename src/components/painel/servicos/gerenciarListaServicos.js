import {ScrollView,Text,TextInput,TouchableOpacity,View} from "react-native";
import { painelServicosstyles as styles } from "../../../styles/painel/painelServicosStyles";
import CustomIcon from "../../CustomIcon"; // 👈 Importa o CustomIcon

export default function GerenciarListaServicos({
  servicos = [],
  pesquisa,
  setPesquisa,
  onEditar,
  onExcluir,
  onDetalhes,
  onNovoServico,
}) {
  return (
    <View style={styles.areaGerenciamento}>
      <View style={styles.listaHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.tituloLista}>Serviços cadastrados</Text>
          <Text style={styles.quantidade}>
            Gerencie os serviços disponíveis.
          </Text>
        </View>
        
        {/* Só exibe o botão de adicionar se onNovoServico for passado (Gerência) */}
        {onNovoServico && (
          <TouchableOpacity
            style={styles.botaoAdicionar}
            onPress={onNovoServico}
            activeOpacity={0.8}
          >
            <CustomIcon name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.pesquisaContainer}>
        <CustomIcon name="search-outline" size={18} color="#999" style={{ marginRight: 6 }} />
        <TextInput
          style={styles.inputPesquisa}
          placeholder="Pesquisar por serviço, coordenador ou curso..."
          placeholderTextColor="#999"
          value={pesquisa}
          onChangeText={setPesquisa}
        />
      </View>

      <Text style={styles.contagemLista}>
        {servicos.length} serviço(s) encontrado(s)
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listaServicos}
      >
        {servicos.length > 0 ? (
          servicos.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardConteudo}>
                <Text style={styles.cardResponsavel} numberOfLines={1}>
                  Coordenador: {item.responsavel}
                </Text>
                <Text style={styles.cardTitulo} numberOfLines={2}>
                  {item.nome}
                </Text>
                <View style={styles.cardCurso}>
                  <Text style={styles.cardCursoTexto}>Curso: {item.curso}</Text>
                </View>
              </View>

              <View style={styles.cardAcoes}>
                {onEditar && (
                  <TouchableOpacity
                    style={styles.botaoEditar}
                    onPress={() => onEditar(item)}
                  >
                    <CustomIcon name="pencil-outline" size={16} color="#1d4ed8" />
                  </TouchableOpacity>
                )}

                {/* Só exibe o botão de excluir se onExcluir for permitido */}
                {onExcluir && (
                  <TouchableOpacity
                    style={styles.botaoExcluir}
                    onPress={() => onExcluir(item.id)}
                  >
                    <CustomIcon name="trash-outline" size={16} color="#b91c1c" />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.botaoDetalhes}
                  onPress={() => onDetalhes(item)}
                >
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.semResultados}>
            <Text style={styles.semResultadosTexto}>
              Nenhum serviço encontrado.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}