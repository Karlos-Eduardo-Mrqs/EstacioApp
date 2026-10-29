import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import AuthGuard from '../mural/guardaAutenticacao';
import GerenciarUsuarios from '../painel/painel';
import GerenciarEventos from './painelEventos';
import PainelCoordenador from './painelCoordenador';
import NotificacaoGlobalTab from '../painel/notificacaoGlobalTab';
import ConfirmPopup from '../ConfirmPopup';
import { painelNavegacaostyles as styles } from '../../styles/painel/painelNavegacaostyles';

export default function PainelNavigator({ usuarioAtual, onClose, onLogout }) {
  const perfilStr = usuarioAtual?.perfil ? usuarioAtual.perfil.trim().toLowerCase() : '';
  const ehCoordenador = perfilStr.includes('coordenador');

  // Se for coordenador, inicia na aba de eventos/coordenação; se for gerência, em utilizadores
  const [abaAtiva, setAbaAtiva] = useState(ehCoordenador ? 'coordenacao' : 'utilizadores');
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

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
    <AuthGuard usuarioAtual={usuarioAtual} perfilPermitido={['Gerência Acadêmica', 'Coordenador', 'Gerencia']} onVoltar={onClose}>
      <View style={[styles.containerPrincipal, { flexDirection: isDesktop ? 'row' : 'column' }]}>
        
        {/* ── BARRA DE NAVEGAÇÃO LATERAL OU SUPERIOR ── */}
        <View style={[styles.navContainer, isDesktop ? styles.sidebarDesktop : styles.barMobile]}>
          
          {isDesktop && (
            <View style={styles.headerDesktop}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoTextoBadge}>PAINEL</Text>
              </View>
              <Text style={styles.tituloMenu}>{ehCoordenador ? 'Área do Coordenador' : 'Gestão Acadêmica'}</Text>
              <Text style={styles.subtituloMenu} numberOfLines={1}>{usuarioAtual?.nome}</Text>
              <Text style={styles.perfilBadgeTexto} numberOfLines={1}>[{usuarioAtual?.perfil}]</Text>
            </View>
          )}

          <View style={[styles.botoesWrapper, !isDesktop && styles.botoesWrapperMobile]}>
            {!ehCoordenador && (
              <TouchableOpacity
                style={[styles.botaoNav, abaAtiva === 'utilizadores' && styles.botaoNavAtivo]}
                onPress={() => setAbaAtiva('utilizadores')}
                activeOpacity={0.8}
              >
                <Text style={styles.iconeNav}>👥</Text>
                {isDesktop && <Text style={[styles.textoBotaoNav, abaAtiva === 'utilizadores' && styles.textoBotaoNavAtivo]}>Utilizadores</Text>}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.botaoNav, (abaAtiva === 'eventos' || abaAtiva === 'coordenacao') && styles.botaoNavAtivo]}
              onPress={() => setAbaAtiva(ehCoordenador ? 'coordenacao' : 'eventos')}
              activeOpacity={0.8}
            >
              <Text style={styles.iconeNav}>📅</Text>
              {isDesktop && <Text style={[styles.textoBotaoNav, (abaAtiva === 'eventos' || abaAtiva === 'coordenacao') && styles.textoBotaoNavAtivo]}>Eventos</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.botaoNav, abaAtiva === 'notificacao' && styles.botaoNavAtivo]}
              onPress={() => setAbaAtiva('notificacao')}
              activeOpacity={0.8}
            >
              <Text style={styles.iconeNav}>🔔</Text>
              {isDesktop && <Text style={[styles.textoBotaoNav, abaAtiva === 'notificacao' && styles.textoBotaoNavAtivo]}>Notificação Global</Text>}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.botaoSair} onPress={solicitarLogout} activeOpacity={0.8}>
            <Text style={styles.iconeSair}>🚪</Text>
            {isDesktop && <Text style={styles.textoBotaoSair}>Sair</Text>}
          </TouchableOpacity>
        </View>

        {/* ── CONTEÚDO DINÂMICO SEGURO ── */}
        <View style={{ flex: 1 }}>
          {abaAtiva === 'utilizadores' && !ehCoordenador && (
            <GerenciarUsuarios usuarioAtual={usuarioAtual} onClose={onClose} onLogout={onLogout} />
          )}
          {(abaAtiva === 'eventos' || (abaAtiva === 'coordenacao' && ehCoordenador)) && (
            ehCoordenador ? (
              <PainelCoordenador usuarioAtual={usuarioAtual} onClose={onClose} onLogout={onLogout} />
            ) : (
              <GerenciarEventos usuarioAtual={usuarioAtual} onClose={onClose} onLogout={onLogout} />
            )
          )}
          {abaAtiva === 'notificacao' && (
            <NotificacaoGlobalTab />
          )}
        </View>

      </View>

      <ConfirmPopup
        visible={confirmPopup.visible}
        titulo={confirmPopup.titulo}
        mensagem={confirmPopup.mensagem}
        tipo={confirmPopup.tipo}
        onConfirm={confirmPopup.onConfirm}
        onCancel={() => setConfirmPopup(prev => ({ ...prev, visible: false }))}
      />
    </AuthGuard>
  );
}