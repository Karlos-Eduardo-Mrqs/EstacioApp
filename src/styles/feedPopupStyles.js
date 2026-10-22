import { StyleSheet } from 'react-native';

export const feedPopupStyles = StyleSheet.create({
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorBox: { backgroundColor: '#fde8e8', borderWidth: 1, borderColor: '#f8b4b4' },
  successBox: { backgroundColor: '#edefdf', borderWidth: 1, borderColor: '#c3e6cb' },
  feedbackText: { fontSize: 12, flex: 1, fontWeight: '500' },
  errorText: { color: '#c53030' },
  successText: { color: '#276749' },
});