import { Modal, View, Text, TouchableOpacity, Platform } from 'react-native';

export default function ConfirmPopup({ visible, titulo, mensagem, onConfirm, onCancel, tipo = 'info' }) {
  const ehPerigo = tipo === 'danger';

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
      }}>
        <View style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          padding: 24,
          width: '100%',
          maxWidth: 400,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)', // 👈 Substitui propriedades antigas shadow*
          elevation: 5
        }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#032551', marginBottom: 10 }}>
            {titulo}
          </Text>
          <Text style={{ fontSize: 14, color: '#4b5563', marginBottom: 24, lineHeight: 20 }}>
            {mensagem}
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
            <TouchableOpacity 
              style={{
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: '#e5e7eb'
              }} 
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text style={{ color: '#374151', fontWeight: 'bold', fontSize: 14 }}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={{
                paddingVertical: 10,
                paddingHorizontal: 16,
                borderRadius: 8,
                backgroundColor: ehPerigo ? '#ef4444' : '#0284c7'
              }} 
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 14 }}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}