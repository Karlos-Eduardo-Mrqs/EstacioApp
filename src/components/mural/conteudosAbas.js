import { View } from "react-native";
import { renderConteudoAbaAtiva } from "../Navegacao";

export default function ConteudoAbas({
  activeTab,
  scriptApp,
  appCtrl,
  avisosAtivos,
  onReexibirAviso,
}) {
  return (
    <View style={{ flex: 1 }}>
      {renderConteudoAbaAtiva({
        activeTab,
        scriptApp,
        appCtrl,
        avisosAtivos,
        onReexibirAviso,
      })}
    </View>
  );
}