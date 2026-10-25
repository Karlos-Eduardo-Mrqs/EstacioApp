import React, { useRef, useState } from 'react';
import { Modal, Text, TouchableOpacity, View, Image, Platform, ScrollView } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import CustomIcon from '../CustomIcon';
import FeedbackBox from '../FeedPopup';
import { buscaTabstyles as styles } from "../../styles/tabs/buscaTabStyles";

const imagemExemploPadrao = require('../../../assets/image.png');

export default function DetalhesBusca({ evento, onClose, onNotificar }) {
  const viewRef = useRef();
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });

  if (!evento) return null;

  // 🔗 Função de Compartilhamento por Captura de Tela
  const handleCompartilhar = async () => {
    setFeedback({ tipo: '', mensagem: '' });
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 1.0,
      });

      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        link.href = uri;
        link.download = `${evento.titulo ? evento.titulo.replace(/\s+/g, '_') : 'evento'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setFeedback({ tipo: 'sucesso', mensagem: 'A imagem do evento foi descarregada com sucesso!' });
      } else {
        await Sharing.shareAsync(uri, {
          dialogTitle: "Compartilhar Evento",
        });
      }
    } catch (error) {
      setFeedback({ tipo: 'erro', mensagem: 'Não foi possível processar ou partilhar o evento.' });
    }
  };

  // 🔔 Função de Notificar
  const handleNotificar = () => {
    if (onNotificar) {
      onNotificar(evento);
    }
    setFeedback({ tipo: 'sucesso', mensagem: 'Evento guardado nas notificações!' });
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <Modal 
      visible={true} 
      transparent 
      animationType="fade" 
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        {/* viewRef captura todo o conteúdo do card para partilha */}
        <View ref={viewRef} style={styles.modalContent} collapsable={false}>
          
          {/* Botão Fechar */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <CustomIcon name="close" size={20} color="#262626" />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScroll}>
            
            {/* 🖼️ Imagem em Destaque Retornada */}
            <View style={styles.imageContainerModal}>
              <Image 
                source={evento?.imagem ? { uri: evento.imagem } : imagemExemploPadrao} 
                style={styles.imagemPost} 
                resizeMode="cover" 
              />
            </View>

            {/* Informações e Descrição */}
            <View style={styles.detailsContainer}>
              <FeedbackBox tipo={feedback.tipo} mensagem={feedback.mensagem} />

              <Text style={styles.modalTitulo}>{evento?.titulo}</Text>
              
              <Text style={styles.modalDataLocal}>
                📅 {evento?.dia} de {evento?.mes} • 📍 {evento?.local || evento?.turma || "Campus"}
              </Text>

              {evento?.autor && (
                <Text style={styles.modalDataLocal}>
                  🎤 Palestrante: {evento.autor}
                </Text>
              )}

              {evento?.horas_acc && (
                <Text style={styles.modalDataLocal}>
                  🕛 Horas Acc: {evento.horas_acc}
                </Text>
              )}
              
              <Text style={styles.modalDescricaoLabel}>Sobre o evento:</Text>
              <Text style={styles.modalDescricao}>
                {evento?.descricao || "Nenhuma descrição detalhada informada para este evento."}
              </Text>

              {/* Botões de Ação */}
              <View style={styles.actionButtonsRow}>
                <TouchableOpacity 
                  style={styles.btnNotificar}
                  onPress={handleNotificar}
                >
                  <CustomIcon name="notifications-outline" size={18} color="#ffffff" style={{ marginRight: 6 }} />
                  <Text style={styles.btnNotificarTexto}>Notificar</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.btnCompartilhar}
                  onPress={handleCompartilhar}
                >
                  <Text style={styles.btnCompartilharTexto}>Compartilhar ↗</Text>
                </TouchableOpacity>
              </View>

            </View>

          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}