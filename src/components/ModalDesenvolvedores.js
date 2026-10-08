import React from 'react';
import { View, Text, TouchableOpacity, Modal, Linking } from 'react-native';

// Importa os estilos do ficheiro global e renomeia para 'styles' por conveniência
import { modalDesenvolvedoresStyles as styles } from '../styles/muralStyles';

export default function ModalDesenvolvedores({ visible, onClose }) {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      {/* Container de fundo com efeito escurecido */}
      <View style={styles.overlay}>
        <View style={styles.modalConteudo}>
          
          {/* Cabeçalho institucional do modal */}
          <View style={styles.cabecalhoModal}>
            <Text style={styles.tituloModal}>⚙️ Equipe de Desenvolvimento</Text>
            <TouchableOpacity onPress={onClose} style={styles.btnFechar}>
              <Text style={styles.textoFechar}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Corpo contendo a listagem dos membros do projeto */}
          <View style={styles.corpoModal}>
            <Text style={styles.subtitulo}>Membros do Projeto:</Text>
            
            <View style={styles.devItem}>
              <Text style={styles.devNome}>Carlos Eduardo</Text>
              <Text style={styles.devPapel}>Back-end & Arquitetura</Text>
            </View>
            <View style={styles.devItem}>
              <Text style={styles.devNome}>Lucas Andrade</Text>
              <Text style={styles.devPapel}>Desenvolvimento Mobile</Text>
            </View>
            <View style={styles.devItem}>
              <Text style={styles.devNome}>Vinícius Amador</Text>
              <Text style={styles.devPapel}>Interface & Componentes</Text>
            </View>
            <View style={styles.devItem}>
              <Text style={styles.devNome}>Victor Leon</Text>
              <Text style={styles.devPapel}>Integração & Suporte</Text>
            </View>

            {/* Ação para redirecionar para o repositório */}
            <TouchableOpacity style={styles.btnAcao} onPress={() => Linking.openURL('https://github.com')}>
              <Text style={styles.textoBtnAcao}>Ver Repositório no GitHub</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
}