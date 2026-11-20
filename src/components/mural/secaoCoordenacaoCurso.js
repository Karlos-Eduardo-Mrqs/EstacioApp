import { Linking, Text, TouchableOpacity, View } from "react-native";
import { modalCursosStyles as modalStyles } from "../../styles/mural/modalCursosStyles";
import CustomIcon from "../CustomIcon";

export default function SectionCoordenacaoCurso({ curso, coordenadores = [] }) {
  const tituloCurso = curso?.nome || curso?.titulo || "este curso";
  const listaCoord = Array.isArray(coordenadores) ? coordenadores : [];

  return (
    <View style={modalStyles.blocoSecao}>
      <Text style={[modalStyles.tituloBlocoSecao, { letterSpacing: 0.3 }]}>
        FALE COM A COORDENAÇÃO
      </Text>
      <View style={modalStyles.linhaAmarela} />

      {listaCoord.length > 0 ? (
        listaCoord.map((coord, index) => (
          <View
            key={coord.id ?? coord.email ?? index}
            style={[
              modalStyles.cardCoordenacao,
              {
                padding: 14,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#E2E8F0",
                backgroundColor: "#FFFFFF",
              },
              index > 0 && { marginTop: 12 },
            ]}
          >
            <View style={modalStyles.topoCoordenacao}>
              <View style={[modalStyles.avatarCoordenacao, { backgroundColor: "#032551" }]}>
                <CustomIcon name="person-outline" size={18} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    modalStyles.nomeCoordenacao,
                    { fontWeight: "700", color: "#032551", fontSize: 14 },
                  ]}
                >
                  {coord.nome || "Coordenador(a)"}
                </Text>
                <Text
                  style={[
                    modalStyles.descricaoCoordenacao,
                    { color: "#64748B", fontSize: 11.5 },
                  ]}
                >
                  Coordenação de {tituloCurso}
                </Text>
              </View>
            </View>

            <View
              style={{
                marginTop: 10,
                gap: 6,
                borderTopWidth: 1,
                borderTopColor: "#F1F5F9",
                paddingTop: 10,
              }}
            >
              {coord.email ? (
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      `mailto:${coord.email}?subject=${encodeURIComponent(
                        `Dúvida sobre o curso ${tituloCurso}`
                      )}`
                    )
                  }
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <CustomIcon name="mail-outline" size={14} color="#054ca9" />
                  <Text style={{ fontSize: 12, color: "#054ca9", fontWeight: "600" }}>
                    {coord.email}
                  </Text>
                </TouchableOpacity>
              ) : null}

              {coord.telefone ? (
                <TouchableOpacity
                  onPress={() => Linking.openURL(`tel:${coord.telefone}`)}
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <CustomIcon name="phone-portrait-outline" size={14} color="#054ca9" />
                  <Text style={{ fontSize: 12, color: "#054ca9", fontWeight: "600" }}>
                    {coord.telefone}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        ))
      ) : (
        <View
          style={[
            modalStyles.cardCoordenacao,
            {
              padding: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "#E2E8F0",
              backgroundColor: "#FFFFFF",
            },
          ]}
        >
          <View style={modalStyles.topoCoordenacao}>
            <View style={[modalStyles.avatarCoordenacao, { backgroundColor: "#032551" }]}>
              <CustomIcon name="school-outline" size={18} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  modalStyles.nomeCoordenacao,
                  { fontWeight: "700", color: "#032551", fontSize: 14 },
                ]}
              >
                Coordenação Acadêmica (coordenacao@estacio.br)
              </Text>
              <Text
                style={[
                  modalStyles.descricaoCoordenacao,
                  { color: "#64748B", fontSize: 11.5 },
                ]}
              >
                Precisa de suporte ou esclarecer dúvidas sobre a matriz curricular?
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              modalStyles.btnContato,
              { marginTop: 14, borderRadius: 8, paddingVertical: 12 },
            ]}
            onPress={() =>
              Linking.openURL(
                `mailto:coordenacao@estacio.br?subject=${encodeURIComponent(
                  `Dúvida sobre o curso ${tituloCurso}`
                )}`
              )
            }
            activeOpacity={0.8}
          >
            <CustomIcon name="send-outline" size={15} color="#FFFFFF" />
            <Text style={[modalStyles.textoBtnContato, { fontWeight: "700", fontSize: 13 }]}>
              Enviar E-mail
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}