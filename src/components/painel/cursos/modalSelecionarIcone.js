import { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, TextInput, Platform, ScrollView } from 'react-native';
import CustomIcon from '../../CustomIcon';
import BotaoFechar from '../../botaoFechar';
import { LISTA_ICONES_CURSOS } from '../../../constants/iconesConstantes'; // 👈 Importa a lista rica do arquivo de constantes

export default function ModalSelecionarIcone({ visible, onClose, onSelect }) {
  const [pesquisa, setPesquisa] = useState('');

  // Filtra os ícones baseando-se tanto no nome quanto nas tags correspondentes
  const iconesFiltrados = LISTA_ICONES_CURSOS.filter(item => {
    const termo = pesquisa.toLowerCase();
    const nomeMatch = item.nome.toLowerCase().includes(termo);
    const tagsMatch = item.tags.some(tag => tag.toLowerCase().includes(termo));
    return nomeMatch || tagsMatch;
  });

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={<BotaoFechar onPress={() => onClose()} />}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <View style={{ backgroundColor: '#fff', width: '100%', maxWidth: 420, borderRadius: 12, padding: 20, maxHeight: '80%' }}>
          
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#032551' }}>Selecionar Ícone do Curso</Text>
            <TouchableOpacity onPress={onClose}>
              <CustomIcon name={Platform.OS === 'web' ? 'close' : 'arrow-back'} size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <TextInput
            style={{ borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 10, marginBottom: 16, fontSize: 14, backgroundColor: '#FAFAFA' }}
            placeholder="Pesquisar por nome ou tag (ex: ti, saude, direito)..."
            placeholderTextColor="#94A3B8"
            value={pesquisa}
            onChangeText={setPesquisa}
          />
            <ScrollView showsVerticalScrollIndicator={false}>
              
              <FlatList data={iconesFiltrados} keyExtractor={(item) => item.nome} numColumns={4}
                columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      width: 70,
                      height: 70,
                      backgroundColor: '#f8fafc',
                      borderWidth: 1,
                      borderColor: '#e2e8f0',
                      borderRadius: 8,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    onPress={() => {
                      onSelect(item.nome);
                      onClose();
                    }}
                  >
                    <CustomIcon name={item.nome} size={28} color="#173EA5" />
                  </TouchableOpacity>
                )}
                style={{ maxHeight: 350 }}
                showsVerticalScrollIndicator={false}
              />
              
            </ScrollView>    
              

        </View>
      </View>
    </Modal>
  );
}