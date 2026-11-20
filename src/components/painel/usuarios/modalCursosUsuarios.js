import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import CustomIcon from "../../CustomIcon";

export default function ModalCursosUsuarios({
  visible,
  onClose,
  usuario,
  cursosLista = [],
}) {
  const obterCursosDoCoordenador = (item) => {
    if (!item) return [];

    if (Array.isArray(item.cursos) && item.cursos.length > 0) {
      return item.cursos.map((c) =>
        typeof c === "string" ? c : c.titulo || c.nome || `Curso #${c.id}`
      );
    }

    const ids = Array.isArray(item.cursos_ids)
      ? item.cursos_ids
      : item.curso_id
        ? [item.curso_id]
        : [];

    return ids
      .map((id) => {
        const encontrado = cursosLista.find((c) => Number(c.id) === Number(id));
        return encontrado ? encontrado.titulo || encontrado.nome : null;
      })
      .filter(Boolean);
  };

  const cursosVinculados = obterCursosDoCoordenador(usuario);

  return (
    <Modal
      visible={Boolean(visible)}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(15, 23, 42, 0.5)",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
        onPress={onClose}
      >
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: 440,
            backgroundColor: "#FFFFFF",
            borderRadius: 14,
            padding: 20,
            borderWidth: 1,
            borderColor: "#E2E8F0",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#032551",
                flex: 1,
              }}
            >
              Cursos orientados
            </Text>
            <TouchableOpacity onPress={onClose}>
              <CustomIcon name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <Text style={{ fontSize: 13, color: "#64748B", marginBottom: 14 }}>
            Coordenador:{" "}
            <Text style={{ fontWeight: "700", color: "#1E293B" }}>
              {usuario?.nome}
            </Text>
          </Text>

          {cursosVinculados.length > 0 ? (
            <View style={{ gap: 8, marginBottom: 16 }}>
              {cursosVinculados.map((nomeCursoItem, idx) => (
                <View
                  key={`${nomeCursoItem}-${idx}`}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    padding: 10,
                    borderRadius: 8,
                    backgroundColor: "#F8FAFC",
                    borderWidth: 1,
                    borderColor: "#E2E8F0",
                  }}
                >
                  <CustomIcon name="school-outline" size={15} color="#032551" />
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: "#1E293B",
                      flex: 1,
                    }}
                  >
                    {nomeCursoItem}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <View
              style={{
                padding: 16,
                borderRadius: 8,
                backgroundColor: "#F8FAFC",
                borderWidth: 1,
                borderColor: "#E2E8F0",
                marginBottom: 16,
              }}
            >
              <Text style={{ fontSize: 13, color: "#64748B", textAlign: "center" }}>
                Nenhum curso vinculado a este coordenador no momento.
              </Text>
            </View>
          )}

          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: "#032551",
              paddingVertical: 10,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 13 }}>
              Fechar
            </Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}