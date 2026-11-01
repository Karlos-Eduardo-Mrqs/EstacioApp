import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { obterIconeDaWeb } from '../../services/parceriaServices'; // 👈 Sobe duas pastas (painel -> components -> services)
import CustomIcon from "../CustomIcon"; // 👈 Sobe uma pasta (painel -> components)

export default function GerenciarListaParcerias({
  parcerias = [],
  onEditar,
  onExcluir,
  onNovaParceria,
}) {
  const [pesquisa, setPesquisa] = useState("");

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Função auxiliar para exibir DD/MM/AAAA
  const formatarDataExibicao = (dataStr) => {
    if (!dataStr) return "Não informada";
    if (dataStr.includes("-")) {
      const [ano, mes, dia] = dataStr.split("-");
      return `${dia}/${mes}/${ano}`;
    }
    return dataStr;
  };

  const parceriasProcessadas = parcerias
    .map((parceria) => {
      let dataObj;
      if (parceria.duracao && parceria.duracao.includes("/")) {
        const [dia, mes, ano] = parceria.duracao.split("/");
        dataObj = new Date(Number(ano), Number(mes) - 1, Number(dia));
      } else {
        dataObj = new Date(parceria.duracao);
      }

      const expirada = !isNaN(dataObj.getTime()) && dataObj < hoje;

      return {
        ...parceria,
        dataObj,
        expirada,
      };
    })
    .filter((p) => {
      const termo = pesquisa.toLowerCase();
      const tituloMatch = p.titulo?.toLowerCase().includes(termo);
      const descMatch = p.descricao?.toLowerCase().includes(termo);
      return tituloMatch || descMatch;
    });

  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#DCE3ED",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#032551" }}>
            Parcerias cadastradas
          </Text>
          <Text style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
            Gerencie empresas parceiras, descontos e vigências.
          </Text>
        </View>

        {onNovaParceria && (
          <TouchableOpacity
            style={{
              backgroundColor: "#173EA5",
              width: 42,
              height: 42,
              borderRadius: 8,
              justifyContent: "center",
              alignItems: "center",
              borderLeftWidth: 4,
              borderLeftColor: "#F2C500",
              elevation: 2,
            }}
            onPress={onNovaParceria}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "#d1d5db",
          borderRadius: 8,
          padding: 10,
          marginBottom: 16,
          fontSize: 14,
          backgroundColor: "#FAFAFA",
        }}
        placeholder="Pesquisar parceria por título ou empresa..."
        placeholderTextColor="#94A3B8"
        value={pesquisa}
        onChangeText={setPesquisa}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {parceriasProcessadas.length > 0 ? (
          parceriasProcessadas.map((parceria) => {
            const iconeParceiro = obterIconeDaWeb(parceria.link);
            const dataExibicao = formatarDataExibicao(parceria.duracao);

            return (
              <View
                key={parceria.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 12,
                  marginBottom: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: parceria.expirada ? "#e5e7eb" : "#93c5fd",
                  backgroundColor: parceria.expirada ? "#f9fafb" : "#f0f4ff",
                  opacity: parceria.expirada ? 0.65 : 1,
                }}
              >
                <View style={{ flex: 1, marginRight: 10 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: "bold",
                        color: parceria.expirada ? "#6b7280" : "#1d4ed8",
                      }}
                    >
                      {parceria.expirada ? "⏳ EXPIRADA" : "🟢 EM VIGÊNCIA"}
                    </Text>
                    {parceria.desconto && (
                      <Text
                        style={{
                          fontSize: 11,
                          color: "#D97706",
                          fontWeight: "bold",
                        }}
                      >
                        • 🏷️ {parceria.desconto}
                      </Text>
                    )}
                  </View>

                  {/* Título com o ÍCONE PEQUENO (24x24px) ao lado */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {iconeParceiro ? (
                      <Image
                        source={{ uri: iconeParceiro }}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 4,
                          backgroundColor: "#fff",
                        }}
                        resizeMode="contain"
                      />
                    ) : (
                      <Text style={{ fontSize: 16 }}>🤝</Text>
                    )}

                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "bold",
                        color: parceria.expirada ? "#4b5563" : "#111827",
                        flex: 1,
                      }}
                      numberOfLines={1}
                    >
                      {parceria.titulo}
                    </Text>
                  </View>

                  <Text
                    style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}
                  >
                    📅 Válido até: {dataExibicao}
                  </Text>
                </View>

                {/* Botões de Ação */}
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {onEditar && (
                    <TouchableOpacity
                      style={{
                        padding: 6,
                        backgroundColor: "#e0e7ff",
                        borderRadius: 6,
                      }}
                      onPress={() => onEditar(parceria)}
                    >
                      <CustomIcon
                        name="pencil-outline"
                        size={16}
                        color="#1d4ed8"
                      />
                    </TouchableOpacity>
                  )}
                  {onExcluir && (
                    <TouchableOpacity
                      style={{
                        padding: 6,
                        backgroundColor: "#fee2e2",
                        borderRadius: 6,
                      }}
                      onPress={() => onExcluir(parceria)}
                    >
                      <CustomIcon
                        name="trash-outline"
                        size={16}
                        color="#b91c1c"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        ) : (
          <Text
            style={{ textAlign: "center", color: "#6b7280", marginTop: 32 }}
          >
            Nenhuma parceria encontrada.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
