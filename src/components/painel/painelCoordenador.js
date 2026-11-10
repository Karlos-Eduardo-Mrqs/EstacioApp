import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { painelStyles as styles } from '../../styles/painel/painelStyles';
import ConfirmPopup from '../ConfirmPopup';
import FeedbackBox from '../FeedPopup';
import PainelPublicacoes from './painelPublicacoes';
import GerenciarEventos from './eventos/painelEventos';
import PainelCursos from './cursos/painelCursos';
import PainelServicos from './servicos/painelServicos';

export default function PainelCoordenador({ usuarioAtual, onClose, onLogout }) {
  const [abaCoordenador, setAbaCoordenador] = useState('publicacoes');

  const [confirmPopup, setConfirmPopup] = useState({
    visible: false,
    titulo: '',
    mensagem: '',
    onConfirm: null,
    tipo: 'danger',
  });

  return (
    <View style={{ flex: 1, width: '100%', height: '100%', backgroundColor: '#f4f5f7' }}>
      
      {/* CABEÇALHO DO PAINEL DO COORDENADOR */}
      <View style={{ padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
        <Text style={styles.tituloPagina}>Painel do Coordenador</Text>
        <Text style={styles.subtituloPagina}>
          Bem-vindo(a), {usuarioAtual?.nome}. Gestão exclusiva para o curso vinculado.
        </Text>
        <FeedbackBox tipo="sucesso" mensagem={`Sessão associada ao Curso ID: ${usuarioAtual?.curso_id || 'Não vinculado'}`} onClose={() => setFeedback({ tipo: tipo, mensagem: mensagem })} />

        {/* SUB-ABAS DO COORDENADOR (Publicações, Eventos, Cursos, Serviços) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              style={[{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#F1F5F9' }, abaCoordenador === 'publicacoes' && { backgroundColor: '#173EA5' }]}
              onPress={() => setAbaCoordenador('publicacoes')}
            >
              <Text style={[{ color: '#334155', fontWeight: 'bold', fontSize: 13 }, abaCoordenador === 'publicacoes' && { color: '#FFF' }]}>Publicações</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#F1F5F9' }, abaCoordenador === 'eventos' && { backgroundColor: '#173EA5' }]}
              onPress={() => setAbaCoordenador('eventos')}
            >
              <Text style={[{ color: '#334155', fontWeight: 'bold', fontSize: 13 }, abaCoordenador === 'eventos' && { color: '#FFF' }]}>Eventos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#F1F5F9' }, abaCoordenador === 'cursos' && { backgroundColor: '#173EA5' }]}
              onPress={() => setAbaCoordenador('cursos')}
            >
              <Text style={[{ color: '#334155', fontWeight: 'bold', fontSize: 13 }, abaCoordenador === 'cursos' && { color: '#FFF' }]}>Cursos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#F1F5F9' }, abaCoordenador === 'servicos' && { backgroundColor: '#173EA5' }]}
              onPress={() => setAbaCoordenador('servicos')}
            >
              <Text style={[{ color: '#334155', fontWeight: 'bold', fontSize: 13 }, abaCoordenador === 'servicos' && { color: '#FFF' }]}>Serviços</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* CONTEÚDO DA SUB-ABA SELECIONADA */}
      <View style={{ flex: 1 }}>
        {abaCoordenador === 'publicacoes' && <PainelPublicacoes usuarioAtual={usuarioAtual} />}
        {abaCoordenador === 'eventos' && <GerenciarEventos usuarioAtual={usuarioAtual} onClose={onClose} onLogout={onLogout} />}
        {abaCoordenador === 'cursos' && <PainelCursos usuarioAtual={usuarioAtual} />}
        {abaCoordenador === 'servicos' && <PainelServicos usuarioAtual={usuarioAtual} />}
      </View>

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