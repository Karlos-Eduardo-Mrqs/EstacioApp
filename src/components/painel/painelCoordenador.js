import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { painelStyles as styles } from '../../styles/painel/painelStyles';
import ConfirmPopup from '../ConfirmPopup';
import FeedbackBox from '../FeedPopup';

export default function PainelCoordenador({ usuarioAtual, onClose, onLogout }) {
  const [confirmPopup, setConfirmPopup] = useState({
    visible: false,
    titulo: '',
    mensagem: '',
    onConfirm: null,
    tipo: 'danger',
  });

  const solicitarLogout = () => {
    setConfirmPopup({
      visible: true,
      titulo: 'Sair do sistema',
      mensagem: 'Deseja realmente encerrar a sua sessão atual?',
      tipo: 'danger',
      onConfirm: () => {
        setConfirmPopup(prev => ({ ...prev, visible: false }));
        if (onLogout) onLogout();
        else if (onClose) onClose();
      }
    });
  };

  return (
    <View style={{ flex: 1, width: '100%', height: '100%', backgroundColor: '#f4f5f7' }}>
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* CABEÇALHO DO PAINEL DO COORDENADOR */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <TouchableOpacity 
            onPress={solicitarLogout}
            style={{ backgroundColor: '#fee2e2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
          >
            <Text style={{ color: '#ef4444', fontWeight: 'bold', fontSize: 14 }}>🚪 Sair</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.tituloPagina}>Painel do Coordenador</Text>
        <Text style={styles.subtituloPagina}>
          Bem-vindo(a), {usuarioAtual?.nome}. Aqui podes gerir as informações e eventos do teu curso.
        </Text>

        <FeedbackBox tipo="sucesso" mensagem={`Sessão ativa associada ao curso ID: ${usuarioAtual?.curso_id || 'Geral'}`} />

        {/* ÁREA DE CONTEÚDO EXCLUSIVA PARA COORDENADORES */}
        <View style={{ marginTop: 20, padding: 20, backgroundColor: '#fff', borderRadius: 12, boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)', elevation: 2 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#032551', marginBottom: 10 }}>
            📌 Funcionalidades da Coordenação
          </Text>
          <Text style={{ fontSize: 14, color: '#4b5563', lineHeight: 22 }}>
            • Visualizar avisos pendentes do curso.{'\n'}
            • Propor novos eventos para o calendário acadêmico.{'\n'}
            • Acompanhar relatórios de interações dos alunos.
          </Text>
        </View>

      </ScrollView>

      {/* COMPONENTE DE CONFIRMAÇÃO OBRIGATÓRIO */}
      <ConfirmPopup
        visible={confirmPopup.visible}
        titulo={confirmPopup.titulo}
        mensagem={confirmPopup.mensagem}
        tipo={confirmPopup.tipo}
        onConfirm={confirmPopup.onConfirm}
        onCancel={() => setConfirmPopup(prev => ({ ...prev, visible: false }))}
      />
    </View>
  );
}