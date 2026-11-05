import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import CustomIcon from "../../CustomIcon";

export default function GerenciarListaCursos({
  cursos = [],
  busca,
  setBusca,
  onEditar,
  onExcluir,
  onNovoCurso,
}) {
  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff", borderRadius: 8, borderWidth: 1, borderColor: "#DCE3ED" }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#032551" }}>Cursos cadastrados</Text>
          <Text style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>Gerencie o catálogo acadêmico.</Text>
        </View>

        {onNovoCurso && (
          <TouchableOpacity
            style={{
              backgroundColor: "#173EA5", width: 42, height: 42, borderRadius: 8,
              justifyContent: "center", alignItems: "center", borderLeftWidth: 4, borderLeftColor: "#F2C500",
              elevation: 2,
            }}
            onPress={onNovoCurso} activeOpacity={0.8}
          >
            <CustomIcon name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      <TextInput
        style={{ borderWidth: 1, borderColor: "#d1d5db", borderRadius: 8, padding: 10, marginBottom: 16, fontSize: 14, backgroundColor: "#FAFAFA" }}
        placeholder="Pesquisar por nome, descrição ou modalidade..."
        placeholderTextColor="#94A3B8"
        value={busca}
        onChangeText={setBusca}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {cursos.length > 0 ? (
          cursos.map((curso) => {
            let corBadge = '#173EA5';
            let bgBadge = '#EFF6FF';
            if (curso.tipo === 'Online/EAD') {
              corBadge = '#059669';
              bgBadge = '#ECFDF5';
            } else if (curso.tipo === 'SemiPresencial') {
              corBadge = '#D97706';
              bgBadge = '#FFFBEB';
            }

            return (
              <View
                key={curso.id}
                style={{
                  flexDirection: "row", justifyContent: "space-between", alignItems: "center",
                  padding: 12, marginBottom: 10, borderRadius: 8, borderWidth: 1,
                  borderColor: "#93c5fd", backgroundColor: "#f0f4ff",
                }}
              >
                <View style={{ flex: 1, marginRight: 10 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <CustomIcon name={curso.icone || 'book-outline'} size={20} color="#032551" />
                    <Text style={{ fontSize: 14, fontWeight: "bold", color: "#111827", flex: 1 }} numberOfLines={1}>
                      {curso.nome}
                    </Text>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: corBadge, backgroundColor: bgBadge, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' }}>
                      {curso.tipo || 'Presencial'}
                    </Text>
                  </View>

                  {curso.descricao ? (
                    <Text style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }} numberOfLines={2}>
                      {curso.descricao}
                    </Text>
                  ) : null}
                </View>

                <View style={{ flexDirection: "row", gap: 8 }}>
                  {onEditar && (
                    <TouchableOpacity style={{ padding: 6, backgroundColor: "#e0e7ff", borderRadius: 6 }} onPress={() => onEditar(curso)}>
                      <CustomIcon name="pencil-outline" size={16} color="#1d4ed8" />
                    </TouchableOpacity>
                  )}
                  {onExcluir && (
                    <TouchableOpacity style={{ padding: 6, backgroundColor: "#fee2e2", borderRadius: 6 }} onPress={() => onExcluir(curso)}>
                      <CustomIcon name="trash-outline" size={16} color="#b91c1c" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        ) : (
          <Text style={{ textAlign: "center", color: "#6b7280", marginTop: 32 }}>Nenhum curso encontrado.</Text>
        )}
      </ScrollView>
    </View>
  );
}