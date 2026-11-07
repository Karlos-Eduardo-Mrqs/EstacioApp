import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { painelServicosstyles as styles } from "../../../styles/painel/painelServicosStyles";

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
          <Text style={styles.quantidade}>Gerencie os serviços disponíveis.</Text>
        </View>
        <TouchableOpacity
          style={styles.botaoAdicionar}
          onPress={onNovoServico}
          activeOpacity={0.8}
        >
          <Text style={styles.botaoAdicionarTexto}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.pesquisaContainer}>
        <Text style={styles.iconePesquisa}>⌕</Text>
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listaServicos}>
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
                  <Text style={styles.cardCursoTexto}>
                    Curso: {item.curso}
                  </Text>
                </View>
              </View>

              <View style={styles.cardAcoes}>
                <TouchableOpacity
                  style={styles.botaoEditar}
                  onPress={() => onEditar(item)}
                >
                  <Text style={styles.iconeAcao}>✎</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.botaoExcluir}
                  onPress={() => onExcluir(item.id)}
                >
                  <Text style={styles.iconeExcluir}>▤</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.botaoDetalhes} onPress={() => onDetalhes(item)}>
                  <Text style={styles.detalhesTexto}>Detalhes</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.semResultados}>
            <Text style={styles.semResultadosTexto}>Nenhum serviço encontrado.</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}