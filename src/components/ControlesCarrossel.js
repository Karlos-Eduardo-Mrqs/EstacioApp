import { TouchableOpacity, View } from "react-native";
import CustomIcon from "./CustomIcon";

export default function ControlesCarrossel({
  scrollRef,
  scrollX = 0,
  larguraConteudo = 0,
  larguraContainer = 0,
  passoScroll = 280,
}) {
  const podeVoltar = scrollX > 4;
  const maxScroll = Math.max(0, larguraConteudo - larguraContainer);
  const podeAvancar = maxScroll > 0 ? scrollX < maxScroll - 4 : true;

  const rolarPara = (direcao) => {
    if (!scrollRef?.current) return;

    const proximoX =
      direcao === "esquerda"
        ? Math.max(0, scrollX - passoScroll)
        : scrollX + passoScroll;

    scrollRef.current.scrollTo({
      x: proximoX,
      animated: true,
    });
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
      <TouchableOpacity
        onPress={() => rolarPara("esquerda")}
        disabled={!podeVoltar}
        activeOpacity={0.75}
        accessibilityLabel="Rolar para a esquerda"
        style={{
          width: 30,
          height: 30,
          borderRadius: 7,
          borderWidth: 1,
          borderColor: podeVoltar ? "#CBD5E1" : "#E2E8F0",
          backgroundColor: podeVoltar ? "#FFFFFF" : "#F8FAFC",
          justifyContent: "center",
          alignItems: "center",
          opacity: podeVoltar ? 1 : 0.45,
        }}
      >
        <CustomIcon
          name="chevron-back"
          size={17}
          color={podeVoltar ? "#032551" : "#94A3B8"}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => rolarPara("direita")}
        disabled={!podeAvancar}
        activeOpacity={0.75}
        accessibilityLabel="Rolar para a direita"
        style={{
          width: 30,
          height: 30,
          borderRadius: 7,
          borderWidth: 1,
          borderColor: podeAvancar ? "#CBD5E1" : "#E2E8F0",
          backgroundColor: podeAvancar ? "#FFFFFF" : "#F8FAFC",
          justifyContent: "center",
          alignItems: "center",
          opacity: podeAvancar ? 1 : 0.45,
        }}
      >
        <CustomIcon
          name="chevron-forward"
          size={17}
          color={podeAvancar ? "#032551" : "#94A3B8"}
        />
      </TouchableOpacity>
    </View>
  );
}