import { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { formatarDataApenas } from "../../../utils/dataUtils";
import CustomIcon from "../../CustomIcon";

function formatarPeriodoEvento(evento) {
  const inicioFmt = formatarDataApenas(
    evento.data_inicio || evento.inicio || evento.data || evento.dataEvento,
  );
  const fimFmt = evento.data_fim ? formatarDataApenas(evento.data_fim) : "";

  if (inicioFmt && fimFmt && fimFmt !== inicioFmt) {
    return `${inicioFmt} até ${fimFmt}`;
  }

  return inicioFmt || "Data a definir";
}

function calcularEstadoTempoEvento(evento, agora) {
  const isEncerradoOuCancelado =
    evento.status === false || evento.status === "false";

  if (isEncerradoOuCancelado) {
    return {
      textoTempo: "🔴 Encerrado / Cancelado",
      corBadgeFundo: "#FEF2F2",
      corBadgeTexto: "#DC2626",
    };
  }

  const referenciaData =
    evento.dataFimObj && !isNaN(evento.dataFimObj.getTime())
      ? evento.dataFimObj
      : evento.dataObj;

  if (!referenciaData || isNaN(referenciaData.getTime())) {
    return {
      textoTempo: "🟢 Ativo",
      corBadgeFundo: "#F0FDF4",
      corBadgeTexto: "#15803D",
    };
  }

  const diffMs = referenciaData.getTime() - agora;
  const segundosTotais = Math.floor(diffMs / 1000);

  if (segundosTotais < 0) {
    return {
      textoTempo: "🔴 Encerrado (Passou da data)",
      corBadgeFundo: "#FEF2F2",
      corBadgeTexto: "#DC2626",
    };
  }

  const dias = Math.floor(segundosTotais / (3600 * 24));
  const horasFaltam = Math.floor((segundosTotais % (3600 * 24)) / 3600);
  const minutosFaltam = Math.floor((segundosTotais % 3600) / 60);
  const segundosFaltam = segundosTotais % 60;

  const h = String(horasFaltam).padStart(2, "0");
  const m = String(minutosFaltam).padStart(2, "0");
  const s = String(segundosFaltam).padStart(2, "0");

  return {
    textoTempo: dias > 0 ? `⏳ ${dias} dias • ${h}:${m}:${s}` : `⏳ ${h}:${m}:${s}`,
    corBadgeFundo: "#EFF6FF",
    corBadgeTexto: "#2563EB",
  };
}

function CabecalhoListaEventos({ onNovoEvento }) {
  return (
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
          Eventos cadastrados
        </Text>
        <Text style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>
          Gerencie datas, locais e status.
        </Text>
      </View>

      {onNovoEvento && (
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
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 3,
            elevation: 2,
          }}
          onPress={onNovoEvento}
          activeOpacity={0.8}
        >
          <CustomIcon name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
}

function RodapeInfoEvento({ evento, agora }) {
  const horas = evento.horasAAC ?? evento.horas_aac ?? evento.horasacc;
  const temHoras =
    horas !== undefined && horas !== null && horas !== "" && Number(horas) !== 0;

  const { textoTempo, corBadgeFundo, corBadgeTexto } = calcularEstadoTempoEvento(
    evento,
    agora,
  );

  const inscricoesAbertas = Boolean(
    evento.possui_inscricao ?? evento.possui_eventos,
  );

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <View
          style={{
            backgroundColor: corBadgeFundo,
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 6,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              color: corBadgeTexto,
              fontWeight: "600",
            }}
          >
            {textoTempo}
          </Text>
        </View>

        <Text
          style={{
            fontSize: 12,
            color: "#64748B",
            fontWeight: "500",
          }}
        >
          🕒 {temHoras ? `${horas} h AAC` : "Horas não definidas"}
        </Text>
      </View>

      {inscricoesAbertas && (
        <View
          style={{
            alignSelf: "flex-start",
            backgroundColor: "#F0FDF4",
            borderWidth: 1,
            borderColor: "#BBF7D0",
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 6,
            marginTop: 6,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              color: "#15803D",
              fontWeight: "600",
            }}
          >
            📝 Inscrições abertas
            {evento.limite_vagas ? ` • Máx. ${evento.limite_vagas}` : ""}
          </Text>
        </View>
      )}

      {evento.link_transmissao && (
        <Text
          style={{
            fontSize: 12,
            color: "#2563EB",
            fontWeight: "500",
            marginTop: 6,
          }}
        >
          🔗 Evento com link online disponível
        </Text>
      )}
    </View>
  );
}

function AcoesEventoCard({ evento, onEditar, onExcluir }) {
  if (!onEditar && !onExcluir) return null;

  return (
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
  );
}

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
      const inicioRaw =
        evento.data_inicio || evento.inicio || evento.data || evento.dataEvento;
      const fimRaw = evento.data_fim || evento.fim || null;
      const dataObj = inicioRaw ? new Date(inicioRaw) : new Date(NaN);
      const dataFimObj = fimRaw ? new Date(fimRaw) : null;

      return {
        ...evento,
        dataObj,
        dataFimObj,
      };
    })
    .filter((evento) => {
      const termo = pesquisa.trim().toLowerCase();
      if (!termo) return true;
      const tituloMatch = evento.titulo?.toLowerCase().includes(termo);
      const localMatch = evento.local?.toLowerCase().includes(termo);
      return Boolean(tituloMatch || localMatch);
    })
    .sort((a, b) => {
      const aValida = !isNaN(a.dataObj.getTime());
      const bValida = !isNaN(b.dataObj.getTime());
      if (!aValida && !bValida) return 0;
      if (!aValida) return 1;
      if (!bValida) return -1;
      return b.dataObj - a.dataObj;
    });

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      <CabecalhoListaEventos onNovoEvento={onNovoEvento} />

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
        placeholder="Pesquisar evento por título ou local..."
        placeholderTextColor="#94A3B8"
        value={pesquisa}
        onChangeText={setPesquisa}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {eventosProcessados.length > 0 ? (
          eventosProcessados.map((evento) => {
            const periodoFormatado = formatarPeriodoEvento(evento);
            const inativo =
              evento.status === false || evento.status === "false";

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
                  borderColor: inativo ? "#FECACA" : "#E2E8F0",
                  backgroundColor: inativo ? "#FFFBFB" : "#FFFFFF",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                }}
              >
                <View style={{ flex: 1, marginRight: 12 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 8,
                      marginBottom: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#475569",
                        fontWeight: "500",
                      }}
                    >
                      📅 {periodoFormatado}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#CBD5E1" }}>•</Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#475569",
                        fontWeight: "500",
                      }}
                    >
                      📍 {evento.local || "Local a definir"}
                    </Text>
                  </View>

                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "700",
                      color: inativo ? "#64748B" : "#0F172A",
                      marginBottom: 8,
                    }}
                    numberOfLines={1}
                  >
                    {evento.titulo}
                  </Text>

                  <RodapeInfoEvento evento={evento} agora={agora} />
                </View>

                <AcoesEventoCard
                  evento={evento}
                  onEditar={onEditar}
                  onExcluir={onExcluir}
                />
              </View>
            );
          })
        ) : (
          <Text
            style={{ textAlign: "center", color: "#6b7280", marginTop: 32 }}
          >
            Nenhum evento encontrado.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}