import { Dimensions, Platform, StyleSheet } from "react-native";
import { CoresInstitucionais } from "../theme";

const { width } = Dimensions.get("window");

const ITEM_WIDTH = Platform.OS === 'web' ? 340 : (width > 0 ? width * 0.8 : 300);

export const carrosselStyles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  tituloSecao: {
    fontSize: 11,
    fontWeight: "bold",
    color: CoresInstitucionais.azulPrincipal,
    borderBottomWidth: 2,
    borderBottomColor: CoresInstitucionais.azulSecundario,
    paddingBottom: 5,
    marginBottom: 12,
    marginHorizontal: 15,
  },
  track: {
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  itemCard: {
    width: ITEM_WIDTH,
    minWidth: ITEM_WIDTH,
    maxWidth: ITEM_WIDTH,
    flexShrink: 0,
    flexGrow: 0,
    height: 160,          
    backgroundColor: CoresInstitucionais.azulPrincipal,
    borderRadius: 16,
    paddingTop: 16,       // Padding superior fixo
    paddingBottom: 16,    // Padding inferior fixo
    paddingHorizontal: 20,
    justifyContent: "flex-start", // Alinha do topo para baixo de forma consistente em todos os cards
    alignItems: "center",
    marginRight: 16,
    borderWidth: 2,
    borderColor: CoresInstitucionais.amarelo,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: CoresInstitucionais.amarelo,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,     // Espaço fixo exato entre o ícone e o título em todos os cards
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: CoresInstitucionais.brancoPuro,
    marginBottom: 4,
    textAlign: "center",
  },
  itemDescription: {
    fontSize: 13,
    color: CoresInstitucionais.brancoPuro,
    lineHeight: 18,
    textAlign: "center",
  },
});