import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { painelInscStyles as s } from "../../../styles/painel/painelInscricaoStyles";
import CustomIcon from "../../CustomIcon";

export default function GerenciarListaInscricao({
  inscricoes = [],
  onEditar,
  onAlternarStatus,
  onExcluir,
}) {
  const [pesquisa, setPesquisa] = useState("");

  const inscricoesFiltradas = (inscricoes || []).filter((item) => {
    const termo = pesquisa.trim().toLowerCase();
    if (!termo) return true;

    return (
      item.nome_completo?.toLowerCase().includes(termo) ||
      item.email?.toLowerCase().includes(termo) ||
      item.telefone?.toLowerCase().includes(termo) ||
      item.matricula?.toLowerCase().includes(termo) ||
      item.cpf?.toLowerCase().includes(termo)
    );
  });

  return (
    <View style={{ marginTop: 4 }}>
      <TextInput
        style={s.searchInput}
        placeholder="Buscar inscrito por nome, e-mail, matrícula ou CPF..."
        placeholderTextColor="#94A3B8"
        value={pesquisa}
        onChangeText={setPesquisa}
      />

      {inscricoesFiltradas.length > 0 ? (
        inscricoesFiltradas.map((item) => {
          const ativa = item.status !== false;

          return (
            <View key={item.id} style={s.itemCard}>
              <View style={s.itemHeader}>
                <Text style={s.itemName} numberOfLines={1}>
                  {item.nome_completo}
                </Text>

                <View
                  style={[
                    s.badgeStatus,
                    ativa ? s.badgeAtiva : s.badgeCancelada,
                  ]}
                >
                  <Text
                    style={
                      ativa ? s.badgeTextoAtiva : s.badgeTextoCancelada
                    }
                  >
                    {ativa ? "ATIVA" : "CANCELADA"}
                  </Text>
                </View>
              </View>

              <Text style={s.itemMeta}>
                {item.eh_aluno
                  ? `🎓 Aluno • Matrícula: ${item.matricula || "-"}`
                  : `👤 Pessoa Externa • CPF: ${item.cpf || "-"}`}
              </Text>

              <Text style={s.itemMeta}>
                📞 {item.telefone || "-"} • ✉️ {item.email || "-"}
              </Text>

              <View style={s.itemActionsRow}>
                {onEditar && (
                  <TouchableOpacity
                    style={s.editBtn}
                    onPress={() => onEditar(item)}
                    activeOpacity={0.75}
                  >
                    <CustomIcon
                      name="pencil-outline"
                      size={14}
                      color="#334155"
                    />
                    <Text style={s.editBtnText}>Editar</Text>
                  </TouchableOpacity>
                )}

                {onAlternarStatus && (
                  <TouchableOpacity
                    style={[
                      s.toggleBtn,
                      ativa ? s.cancelBtn : s.activateBtn,
                    ]}
                    onPress={() => onAlternarStatus(item)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={
                        ativa ? s.cancelBtnText : s.activateBtnText
                      }
                    >
                      {ativa ? "Cancelar inscrição" : "Reativar inscrição"}
                    </Text>
                  </TouchableOpacity>
                )}

                {onExcluir && (
                  <TouchableOpacity
                    style={s.deleteBtn}
                    onPress={() => onExcluir(item)}
                    activeOpacity={0.75}
                  >
                    <CustomIcon
                      name="trash-outline"
                      size={14}
                      color="#DC2626"
                    />
                    <Text style={s.deleteBtnText}>Excluir</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })
      ) : (
        <Text style={s.emptyText}>
          Nenhuma inscrição encontrada para o filtro informado.
        </Text>
      )}
    </View>
  );
}