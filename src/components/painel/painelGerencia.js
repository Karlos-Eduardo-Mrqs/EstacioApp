// src/components/painel/painelGerenciaAcademica.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { painelStyles as styles } from '../../styles/painel/painelStyles';
import ConfirmPopup from '../ConfirmPopup';
import FeedbackBox from '../FeedPopup';
import GerenciarUsuarios from './usuarios/painelGerenciarUsuarios';
import PainelPublicacoes from './publicacoes/painelPublicacoes';
import GerenciarEventos from './eventos/painelEventos';
import PainelCursos from './cursos/painelCursos';
import PainelServicos from './servicos/painelServicos';
import ParceriaTab from './parcerias/parceriaTab';

export default function PainelGerenciaAcademica({ usuarioAtual, onClose, onLogout }) {
  const [abaGerencia, setAbaGerencia] = useState('utilizadores');

  const [confirmPopup, setConfirmPopup] = useState({
    visible: false,
    titulo: '',
    mensagem: '',
    onConfirm: null,
    tipo: 'danger',
  });

  return (
    <View style={{ flex: 1, width: '100%', height: '100%', backgroundColor: '#f4f5f7' }}>
      
      {/* CABEÇALHO DO PAINEL DA GERÊNCIA */}
      <View style={{ padding: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' }}>
        <Text style={styles.tituloPagina}>Gestão Acadêmica</Text>
        <Text style={styles.subtituloPagina}>
          Painel administrativo global, bem-vindo(a), {usuarioAtual?.nome}.
        </Text>

        {/* SUB-ABAS DA GERÊNCIA (Utilizadores, Publicações, Eventos, Cursos, Serviços, Parcerias) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              style={[{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#F1F5F9' }, abaGerencia === 'utilizadores' && { backgroundColor: '#173EA5' }]}
              onPress={() => setAbaGerencia('utilizadores')}
            >
              <Text style={[{ color: '#334155', fontWeight: 'bold', fontSize: 13 }, abaGerencia === 'utilizadores' && { color: '#FFF' }]}>Coordenadores</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#F1F5F9' }, abaGerencia === 'publicacoes' && { backgroundColor: '#173EA5' }]}
              onPress={() => setAbaGerencia('publicacoes')}
            >
              <Text style={[{ color: '#334155', fontWeight: 'bold', fontSize: 13 }, abaGerencia === 'publicacoes' && { color: '#FFF' }]}>Publicações</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#F1F5F9' }, abaGerencia === 'eventos' && { backgroundColor: '#173EA5' }]}
              onPress={() => setAbaGerencia('eventos')}
            >
              <Text style={[{ color: '#334155', fontWeight: 'bold', fontSize: 13 }, abaGerencia === 'eventos' && { color: '#FFF' }]}>Eventos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#F1F5F9' }, abaGerencia === 'cursos' && { backgroundColor: '#173EA5' }]}
              onPress={() => setAbaGerencia('cursos')}
            >
              <Text style={[{ color: '#334155', fontWeight: 'bold', fontSize: 13 }, abaGerencia === 'cursos' && { color: '#FFF' }]}>Cursos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#F1F5F9' }, abaGerencia === 'servicos' && { backgroundColor: '#173EA5' }]}
              onPress={() => setAbaGerencia('servicos')}
            >
              <Text style={[{ color: '#334155', fontWeight: 'bold', fontSize: 13 }, abaGerencia === 'servicos' && { color: '#FFF' }]}>Serviços</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#F1F5F9' }, abaGerencia === 'parcerias' && { backgroundColor: '#173EA5' }]}
              onPress={() => setAbaGerencia('parcerias')}
            >
              <Text style={[{ color: '#334155', fontWeight: 'bold', fontSize: 13 }, abaGerencia === 'parcerias' && { color: '#FFF' }]}>Parcerias</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* CONTEÚDO DA SUB-ABA SELECIONADA */}
      <View style={{ flex: 1 }}>
        {abaGerencia === 'utilizadores' && <GerenciarUsuarios usuarioAtual={usuarioAtual} onClose={onClose} onLogout={onLogout} />}
        {abaGerencia === 'publicacoes' && <PainelPublicacoes usuarioAtual={usuarioAtual} />}
        {abaGerencia === 'eventos' && <GerenciarEventos usuarioAtual={usuarioAtual} onClose={onClose} onLogout={onLogout} />}
        {abaGerencia === 'cursos' && <PainelCursos usuarioAtual={usuarioAtual} />}
        {abaGerencia === 'servicos' && <PainelServicos usuarioAtual={usuarioAtual} />}
        {abaGerencia === 'parcerias' && <ParceriaTab />}
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