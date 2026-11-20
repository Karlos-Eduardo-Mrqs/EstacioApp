import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { painelServicosstyles as styles } from "../../../styles/painel/painelServicosStyles";
import CustomIcon from "../../CustomIcon";

export default function GerenciarListaServicos({
  servicos = [],
  pesquisa,
  setPesquisa,
  onEditar,
  onExcluir,
  onAlternarStatus,
  alternarStatusServico,
  onVisualizarMural,
  onDetalhes,
  onNovoServico,
}) {
  const handleAlternar = onAlternarStatus || alternarStatusServico;
  const handleVisualizar = onVisualizarMural || onDetalhes;
  
  return (
    <View style={styles.areaGerenciamento}>
      <View style={styles.listaHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.tituloLista}>Serviços cadastrados</Text>
          <Text style={styles.quantidade}>
            Gerencie os serviços disponíveis.
          </Text>
        </View>

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

      <View style={[styles.pesquisaContainer, { marginBottom: 10 }]}>
        <CustomIcon name="search-outline" size={18} color="#999" style={{ marginRight: 6 }} />
        <TextInput
          style={styles.inputPesquisa}
          placeholder="Pesquisar por serviço, coordenador ou curso..."
          placeholderTextColor="#999"
          value={pesquisa}
          onChangeText={setPesquisa}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listaServicos}
      >
        {servicos.length > 0 ? (
          servicos.map((item) => {
            const estaAtivo =
              typeof item.status === "boolean"
                ? item.status
                : String(item.status).toLowerCase() !== "bloqueado" && String(item.status).toLowerCase() !== "inativo";

            return (
              <View
                key={item.id}
                style={[
                  styles.card,
                  !estaAtivo && {
                    borderColor: "#FCA5A5",
                    backgroundColor: "#FFFDFD",
                  },
                ]}
              >
                <View style={styles.cardConteudo}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 4,
                      gap: 8,
                    }}
                  >
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: 999,
                        backgroundColor: estaAtivo ? "#ECFDF5" : "#FEF2F2",
                        borderWidth: 1,
                        borderColor: estaAtivo ? "#A7F3D0" : "#FECACA",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          fontWeight: "700",
                          color: estaAtivo ? "#047857" : "#B91C1C",
                        }}
                      >
                        {estaAtivo ? "● Liberado" : "● Bloqueado"}
                      </Text>
                    </View>
                  </View>

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
                  {!estaAtivo && handleVisualizar && (
                    <TouchableOpacity
                      onPress={() => handleVisualizar(item)}
                      activeOpacity={0.8}
                      accessibilityLabel="Visualizar serviço no mural"
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 8,
                        backgroundColor: "#EFF6FF",
                        borderWidth: 1,
                        borderColor: "#BFDBFE",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CustomIcon name="eye-outline" size={16} color="#1D4ED8" />
                    </TouchableOpacity>
                  )}

                  {onEditar && (
                    <TouchableOpacity
                      style={styles.botaoEditar}
                      onPress={() => onEditar(item)}
                    >
                      <CustomIcon name="pencil-outline" size={16} color="#1d4ed8" />
                    </TouchableOpacity>
                  )}

                  {onExcluir && (
                    <TouchableOpacity
                      style={styles.botaoExcluir}
                      onPress={() => onExcluir(item.id)}
                    >
                      <CustomIcon name="trash-outline" size={16} color="#b91c1c" />
                    </TouchableOpacity>
                  )}

                  {handleAlternar && (
                    <TouchableOpacity
                      onPress={() => handleAlternar(item)}
                      activeOpacity={0.8}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                        paddingHorizontal: 10,
                        paddingVertical: 7,
                        borderRadius: 8,
                        backgroundColor: estaAtivo ? "#ECFDF5" : "#FEF2F2",
                        borderWidth: 1,
                        borderColor: estaAtivo ? "#6EE7B7" : "#FCA5A5",
                        justifyContent: "center",
                      }}
                    >
                      <CustomIcon
                        name={estaAtivo ? "lock-open-outline" : "lock-closed-outline"}
                        size={14}
                        color={estaAtivo ? "#047857" : "#B91C1C"}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
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