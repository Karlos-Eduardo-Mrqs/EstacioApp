import { View, Text} from 'react-native';
import {CustomIcon} from './CustomIcon';
import { feedPopupStyles as styles } from '../styles/feedPopupStyles';

export default function FeedbackBox({ tipo, mensagem }) {
  if (!mensagem) return null;

  const isErro = tipo === 'erro';

  return (
    <View style={[styles.feedbackBox, isErro ? styles.errorBox : styles.successBox]}>
      <CustomIcon
        name={isErro ? 'alert-circle-outline' : 'checkmark-circle-outline'}
        size={20}
        color={isErro ? '#d32f2f' : '#2e7d32'}
      />
      <Text style={[styles.feedbackText, isErro ? styles.errorText : styles.successText]}>
        {mensagem}
      </Text>
    </View>
  );
}
