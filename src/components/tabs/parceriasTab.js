import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Linking, TextInput } from "react-native";
import CustomIcon from "../CustomIcon";
import { buscarParceriasDoBanco, obterIconeDaWeb } from "../../services/parceriaServices";
import { parceriasTabStyles as styles } from "../../styles/tabs/parceriasTabStyles";

export default function ParceriasAlunoTab() {
  const [parcerias, setParcerias] = useState([]);
  const [pesquisa, setPesquisa] = useState("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarParcerias();
  }, []);

  async function carregarParcerias() {
    try {
      setCarregando(true);
      const dados = await buscarParceriasDoBanco();
      setParcerias(dados || []);
    } catch (error) {
      console.log("Erro ao carregar parcerias para o aluno:", error);
    } finally {
      setCarregando(false);
    }
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const parceriasFiltradas = parcerias
    .map((parceria) => {
      let dataObj;
      if (parceria.duracao && parceria.duracao.includes("/")) {
        const [dia, mes, ano] = parceria.duracao.split("/");
        dataObj = new Date(Number(ano), Number(mes) - 1, Number(dia));
      } else {
        dataObj = new Date(parceria.duracao);
      }
      const expirada = !isNaN(dataObj.getTime()) && dataObj < hoje;
      return { ...parceria, expirada };
    })
    .filter((p) => {
      const termo = pesquisa.toLowerCase();
      return (
        p.titulo?.toLowerCase().includes(termo) ||
        p.descricao?.toLowerCase().includes(termo) ||
        p.desconto?.toLowerCase().includes(termo)
      );
    });

  const abrirLinkParceiro = (url) => {
    if (!url) return;
    const linkFinal = url.startsWith("http") ? url : `https://${url}`;
    Linking.openURL(linkFinal).catch((err) => console.error("Erro ao abrir link:", err));
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerWrapper}>
        <Text style={styles.tituloPagina}>Parcerias e Descontos</Text>
        <Text style={styles.subtituloPagina}>
          Aproveite benefícios exclusivos e descontos especiais para estudantes.
        </Text>
      </View>

      {/* Barra de Pesquisa */}
      <TextInput
        style={styles.inputPesquisa}
        placeholder="Pesquisar por empresa ou benefício..."
        placeholderTextColor="#94A3B8"
        value={pesquisa}
        onChangeText={setPesquisa}
      />

      {carregando ? (
        <Text style={styles.textoFeedback}>A carregar parcerias...</Text>
      ) : parceriasFiltradas.length > 0 ? (
        <View style={styles.listaCards}>
          {parceriasFiltradas.map((p) => {
            const iconeUrl = obterIconeDaWeb(p.link);

            let dataExibicao = p.duracao || "";
            if (dataExibicao.includes("-")) {
              const [ano, mes, dia] = dataExibicao.split("-");
              dataExibicao = `${dia}/${mes}/${ano}`;
            }

            return (
              <View
                key={p.id}
                style={[styles.card, p.expirada && styles.cardExpirada]}
              >
                <View style={styles.cardTopo}>
                  <View style={styles.infoPrincipal}>
                    {iconeUrl ? (
                      <Image
                        source={{ uri: iconeUrl }}
                        style={styles.iconeLogo}
                        resizeMode="contain"
                      />
                    ) : (
                      <Text style={styles.iconeFallback}>🤝</Text>
                    )}

                    <View style={styles.tituloEDesconto}>
                      <Text style={styles.nomeParceiro} numberOfLines={1}>
                        {p.titulo}
                      </Text>
                      {p.desconto ? (
                        <View style={styles.badgeDesconto}>
                          <Text style={styles.textoDesconto} numberOfLines={1}>
                            🏷️ {p.desconto}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>

                  <View
                    style={[
                      styles.badgeStatus,
                      p.expirada && styles.badgeStatusExpirada,
                    ]}
                  >
                    <Text
                      style={[
                        styles.textoStatus,
                        p.expirada && styles.textoStatusExpirada,
                      ]}
                    >
                      {p.expirada ? "ENCERRADA" : "DISPONÍVEL"}
                    </Text>
                  </View>
                </View>

                {p.descricao ? (
                  <Text style={styles.descricaoParceria} numberOfLines={2}>
                    {p.descricao}
                  </Text>
                ) : null}

                <View style={styles.cardRodape}>
                  <Text style={styles.textoValidade} numberOfLines={1}>
                    ⏳ {dataExibicao}
                  </Text>

                  {p.link && !p.expirada && (
                    <TouchableOpacity
                      style={styles.botaoAcessar}
                      onPress={() => abrirLinkParceiro(p.link)}
                      activeOpacity={0.85}
                    >
                      <CustomIcon name="open-outline" size={12} color="#FFFFFF" />
                      <Text style={styles.textoBotaoAcessar}>Site</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <Text style={styles.textoFeedback}>
          Nenhuma parceria disponível no momento.
        </Text>
      )}
    </ScrollView>
  );
}