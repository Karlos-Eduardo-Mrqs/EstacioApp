import { View, Text, useWindowDimensions, Platform } from 'react-native';
import CustomIcon from './CustomIcon';
import BotaoFechar from './BotaoFechar';
import { feedPopupStyles as styles } from '../styles/feedPopupStyles';

export default function FeedbackBox({ tipo, mensagem, onClose }) {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  if (!mensagem) return null;

  const isErro = tipo === 'erro';

  return (
    <View style={[
      styles.feedbackBox, 
      isErro ? styles.errorBox : styles.successBox,
      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' } // 👈 Garante o alinhamento horizontal
    ]}>
      
      {/* Bloco esquerdo: Ícone e Mensagem */}
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 8, marginRight: 8 }}>
        <CustomIcon
          name={isErro ? 'alert-circle-outline' : 'checkmark-circle-outline'}
          size={20}
          color={isErro ? '#d32f2f' : '#2e7d32'}
        />
        <Text style={[styles.feedbackText, isErro ? styles.errorText : styles.successText, { flex: 1 }]}>
          {mensagem}
        </Text>
      </View>

      {/* Botão de Fechar opcional (só aparece se a função onClose for passada) */}
      {onClose && (
        <BotaoFechar 
          onPress={onClose} 
          style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: 'transparent', borderWidth: 0 }} 
        />
      )}
    </View>
  );
}