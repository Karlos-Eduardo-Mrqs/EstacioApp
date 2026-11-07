import { TouchableOpacity, Platform, StyleSheet,useWindowDimensions } from 'react-native';
import CustomIcon from './CustomIcon';

export default function BotaoFechar({ onPress, style }) {
  // Se for web (PC), exibe 'close', senão (Mobile), exibe 'arrow-back'
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web' && width >= 768;;
  const iconeNome = isWeb ? 'close-outline' : 'arrow-back';

  return (
    <TouchableOpacity
      style={[styles.botao, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <CustomIcon 
        name={iconeNome} 
        size={22} 
        color="#0A2540" 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});