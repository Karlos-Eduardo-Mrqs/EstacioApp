import { useState } from "react";
import {ScrollView,Text,TextInput,TouchableOpacity,View,} from "react-native";
import { formatarDataApenas } from "../../utils/dataUtils";
import CustomIcon from "../CustomIcon";

export default function GerenciarListaEventos({
  eventos = [],
  agora = Date.now(),
  onEditar,
  onExcluir,
  onNovoEvento,
}) {
  const [pesquisa, setPesquisa] = useState("");

  const eventosProcessados = eventos
    .map((evento) => {
      const dataObj = new Date(
        evento.inicio || evento.data || evento.dataEvento,
      );

      // Verifica se a data já passou (comparando com a meia-noite de hoje)
      return {
        ...evento,
        dataObj
      };
    })
    .filter((evento) => {
      const termo = pesquisa.toLowerCase();
      const tituloMatch = evento.titulo?.toLowerCase().includes(termo);
      const localMatch = evento.local?.toLowerCase().includes(termo);
      return tituloMatch || localMatch;
    })
    .sort((a, b) => {
      if (isNaN(a.dataObj.getTime())) return 1;
      if (isNaN(b.dataObj.getTime())) return -1;
      return b.dataObj - a.dataObj;
    });

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#032551" }}>Eventos cadastrados</Text>
          <Text style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>Gerencie datas, locais e status.</Text>
        </View>

        {onNovoEvento && (
          <TouchableOpacity
            style={{
              backgroundColor: "#173EA5", width: 42, height: 42, borderRadius: 8,
              justifyContent: "center", alignItems: "center", borderLeftWidth: 4, borderLeftColor: "#F2C500",
              shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3, elevation: 2,
            }}
            onPress={onNovoEvento} activeOpacity={0.8}
          >
            <CustomIcon name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      <TextInput
        style={{ borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 10, marginBottom: 16, fontSize: 14, backgroundColor: "#FAFAFA" }}
        placeholder="Pesquisar evento por título ou local..."
        placeholderTextColor="#94A3B8"
        value={pesquisa}
        onChangeText={setPesquisa}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {eventosProcessados.length > 0 ? (
          eventosProcessados.map((evento) => {
            const dataFormatada = formatarDataApenas(evento.inicio || evento.data || evento.dataEvento);

            return (
              <View
                key={evento.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 16,
                  marginBottom: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#E2E8F0", // Borda mais suave e moderna (Slate 200)
                  backgroundColor: "#FFFFFF", // Fundo limpo em vez de azul total
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              >
                <View style={{ flex: 1, marginRight: 12 }}>
                  {/* Linha Superior: Data e Local */}
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <Text style={{ fontSize: 12, color: "#475569", fontWeight: "500" }}>
                      📅 {dataFormatada || "Data a definir"}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#CBD5E1" }}>•</Text>
                    <Text style={{ fontSize: 12, color: "#475569", fontWeight: "500" }}>
                      📍 {evento.local || "Local a definir"}
                    </Text>
                  </View>

                  {/* Título do Evento */}
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "700",
                      color: "#0F172A",
                      marginBottom: 8,
                    }}
                    numberOfLines={1}
                  >
                    {evento.titulo}
                  </Text>
                  
                  {/* Bloco Inferior: Timer e Horas AAC em linha única ou organizada */}
                  {(() => {
                    const horas = evento.horasAAC ?? evento.horas_aac ?? evento.horasacc;
                    const temHoras = horas !== undefined && horas !== null && horas !== "" && horas !== 0;

                    const diffMs = evento.dataObj.getTime() - agora;
                    const jaAconteceu = diffMs < 0;

                    let textoTempo = "";
                    let corBadgeFundo = jaAconteceu ? "#FEF2F2" : "#EFF6FF";
                    let corBadgeTexto = jaAconteceu ? "#DC2626" : "#2563EB";

                    if (jaAconteceu) {
                      textoTempo = "🔴 Encerrado";
                    } else {
                      const segundosTotais = Math.floor(diffMs / 1000);
                      const dias = Math.floor(segundosTotais / (3600 * 24));
                      const horasFaltam = Math.floor((segundosTotais % (3600 * 24)) / 3600);
                      const minutosFaltam = Math.floor((segundosTotais % 3600) / 60);
                      const segundosFaltam = segundosTotais % 60;

                      const h = String(horasFaltam).padStart(2, "0");
                      const m = String(minutosFaltam).padStart(2, "0");
                      const s = String(segundosFaltam).padStart(2, "0");

                      if (dias > 0) {
                        textoTempo = `⏳ ${dias} dias • ${h}:${m}:${s}`;
                      } else {
                        textoTempo = `⏳ ${h}:${m}:${s}`;
                      }
                    }

                    return (
                      <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                        {/* Pílula de Tempo / Timer */}
                        <View style={{
                          backgroundColor: corBadgeFundo,
                          paddingHorizontal: 8,
                          paddingVertical: 3,
                          borderRadius: 6,
                        }}>
                          <Text style={{ fontSize: 11, color: corBadgeTexto, fontWeight: "600" }}>
                            {textoTempo}
                          </Text>
                        </View>

                        {/* Horas AAC */}
                        <Text style={{ fontSize: 12, color: "#64748B", fontWeight: "500" }}>
                          🕒 {temHoras ? `${horas} h AAC` : "Horas não definidas"}
                        </Text>
                      </View>
                    );
                  })()}
                </View>

                {/* Botões de Ação Administrativa Limpos */}
                <View style={{ flexDirection: "row", gap: 6 }}>
                  {onEditar && (
                    <TouchableOpacity
                      style={{
                        padding: 8,
                        backgroundColor: "#F1F5F9",
                        borderRadius: 8,
                      }}
                      onPress={() => onEditar(evento)}
                    >
                      <CustomIcon name="pencil-outline" size={16} color="#334155" />
                    </TouchableOpacity>
                  )}
                  {onExcluir && (
                    <TouchableOpacity
                      style={{
                        padding: 8,
                        backgroundColor: "#FEF2F2",
                        borderRadius: 8,
                      }}
                      onPress={() => onExcluir(evento)}
                    >
                      <CustomIcon name="trash-outline" size={16} color="#DC2626" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        ) : (
          <Text style={{ textAlign: "center", color: "#6b7280", marginTop: 32 }}>Nenhum evento encontrado.</Text>
        )}
      </ScrollView>
    </View>
  );
}