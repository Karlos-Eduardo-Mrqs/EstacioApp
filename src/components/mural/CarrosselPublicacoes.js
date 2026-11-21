import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { modalCursosStyles as modalStyles } from "../../styles/mural/modalCursosStyles";
import { obterAspectRatioNumerico } from "../../constants/proporcoesConstantes";
import ControlesCarrossel from "../ControlesCarrossel";
import CustomIcon from "../CustomIcon";

export default function CarrosselPublicacoesCurso({
  publicacoes = [],
  carregandoPublicacoes = false,
  publicacoesExpandidas = [],
  alternarDescricao,
  precisaExpandir,
  onSelectImagem,
}) {
  const { width } = useWindowDimensions();
  const larguraCardPublicacao = width < 600 ? 260 : 300;

  const carrosselRef = useRef(null);
  const [scrollX, setScrollX] = useState(0);
  const [larguraConteudo, setLarguraConteudo] = useState(0);
  const [larguraContainer, setLarguraContainer] = useState(0);

  return (
    <View style={modalStyles.blocoSecao}>
      <Text style={[modalStyles.tituloBlocoSecao, { letterSpacing: 0.3 }]}>
        PUBLICAÇÕES DO CURSO
      </Text>
      <View style={modalStyles.linhaAmarela} />

      {carregandoPublicacoes ? (
        <ActivityIndicator
          size="small"
          color="#173EA5"
          style={{ marginVertical: 20 }}
        />
      ) : publicacoes.length > 0 ? (
        <>
          <ScrollView
            ref={carrosselRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            scrollEventThrottle={16}
            onScroll={(e) => setScrollX(e.nativeEvent.contentOffset.x)}
            onLayout={(e) => setLarguraContainer(e.nativeEvent.layout.width)}
            onContentSizeChange={(w) => setLarguraConteudo(w)}
            contentContainerStyle={modalStyles.listaPublicacoes}
          >
            {publicacoes.map((publicacao) => {
              const imagemObj = publicacao.imagem;
              const imagemUrl =
                typeof imagemObj === "object" ? imagemObj?.caminho_img : imagemObj;
              const proporcaoCard = imagemObj?.proporcao || "16:9";

              return (
                <View
                  key={publicacao.id}
                  style={[
                    modalStyles.publicacaoCard,
                    {
                      width: larguraCardPublicacao,
                      borderRadius: 10,
                      overflow: "hidden",
                      borderWidth: 1,
                      borderColor: "#E2E8F0",
                    },
                  ]}
                >
                  {imagemUrl ? (
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => onSelectImagem?.(imagemUrl)}
                      style={{
                        width: "100%",
                        aspectRatio: obterAspectRatioNumerico(proporcaoCard),
                        backgroundColor: "#E2E8F0",
                      }}
                    >
                      <Image
                        source={{ uri: imagemUrl }}
                        style={modalStyles.imagemPublicacao}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  ) : (
                    <View style={modalStyles.imagemPublicacaoVazia}>
                      <CustomIcon name="image-outline" size={30} color="#999" />
                    </View>
                  )}

                  <View style={[modalStyles.conteudoPublicacao, { padding: 12 }]}>
                    <Text
                      style={[
                        modalStyles.tituloPublicacao,
                        { fontWeight: "700", color: "#032551", fontSize: 13.5 },
                      ]}
                    >
                      {publicacao.titulo}
                    </Text>

                    <Text
                      numberOfLines={
                        publicacoesExpandidas.includes(publicacao.id) ? undefined : 3
                      }
                      style={[
                        modalStyles.descricaoPublicacao,
                        { color: "#475569", fontSize: 12, lineHeight: 18, marginTop: 4 },
                      ]}
                    >
                      {publicacao.descricao}
                    </Text>

                    {precisaExpandir?.(publicacao.descricao) && (
                      <TouchableOpacity
                        onPress={() => alternarDescricao?.(publicacao.id)}
                        style={{ marginTop: 6 }}
                      >
                        <Text
                          style={[
                            modalStyles.btnExpandirPublicacao,
                            { fontWeight: "600", fontSize: 11 },
                          ]}
                        >
                          {publicacoesExpandidas.includes(publicacao.id)
                            ? "Ver menos"
                            : "Ver mais"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              marginTop: 8,
            }}
          >
            <ControlesCarrossel
              scrollRef={carrosselRef}
              scrollX={scrollX}
              larguraConteudo={larguraConteudo}
              larguraContainer={larguraContainer}
              passoScroll={larguraCardPublicacao + 12}
            />
          </View>
        </>
      ) : (
        <Text
          style={[
            modalStyles.textoVazio,
            { color: "#64748B", fontSize: 13, fontStyle: "italic" },
          ]}
        >
          Nenhuma publicação disponível para este curso.
        </Text>
      )}
    </View>
  );
}