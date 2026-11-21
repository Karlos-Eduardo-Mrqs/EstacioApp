import { TouchableOpacity, View } from "react-native";
import CustomIcon from "./CustomIcon";

export default function ControlesCarrossel({
  scrollRef,
  scrollX = 0,
  larguraConteudo = 0,
  larguraContainer = 0,
  passoScroll = 300,
}) {
  const temOverflow =
    larguraConteudo > 0 && larguraContainer > 0
      ? larguraConteudo > larguraContainer + 6
      : true;

  if (!temOverflow) return null;

  const podeVoltar = scrollX > 6;
  const maxScroll = Math.max(0, larguraConteudo - larguraContainer);
  const podeAvancar = maxScroll > 0 ? scrollX < maxScroll - 6 : true;

  const rolarPara = (direcao) => {
    if (!scrollRef?.current) return;

    const proximoX =
      direcao === "esquerda"
        ? Math.max(0, scrollX - passoScroll)
        : Math.min(
            maxScroll > 0 ? maxScroll : scrollX + passoScroll,
            scrollX + passoScroll,
          );

    scrollRef.current.scrollTo({
      x: proximoX,
      animated: true,
    });
  };

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: "#F1F5F9",
        padding: 3,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#E2E8F0",
      }}
    >
      <TouchableOpacity
        onPress={() => rolarPara("esquerda")}
        disabled={!podeVoltar}
        activeOpacity={0.75}
        accessibilityLabel="Rolar para a esquerda"
        style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          backgroundColor: podeVoltar ? "#032551" : "transparent",
          justifyContent: "center",
          alignItems: "center",
          opacity: podeVoltar ? 1 : 0.35,
        }}
      >
        <CustomIcon
          name="chevron-back"
          size={16}
          color={podeVoltar ? "#FFFFFF" : "#64748B"}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => rolarPara("direita")}
        disabled={!podeAvancar}
        activeOpacity={0.75}
        accessibilityLabel="Rolar para a direita"
        style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          backgroundColor: podeAvancar ? "#032551" : "transparent",
          justifyContent: "center",
          alignItems: "center",
          opacity: podeAvancar ? 1 : 0.35,
        }}
      >
        <CustomIcon
          name="chevron-forward"
          size={16}
          color={podeAvancar ? "#FFFFFF" : "#64748B"}
        />
      </TouchableOpacity>
    </View>
  );
}