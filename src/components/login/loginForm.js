import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import { styles } from '../../styles/loginForm';
import CustomIcon from "../CustomIcon";
import FeedbackBox from '../../components/FeedPopup';
import { fazerLoginNoBanco } from '../../services/apiServices';

export default function LoginScreen({ onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    setFeedback({ tipo: '', mensagem: '' });
    const emailLimpo = email.trim().toLowerCase();

    if (!emailLimpo || !senha) {
      setFeedback({
        tipo: 'erro',
        mensagem: 'Por favor, preencha o e-mail e a senha.',
      });
      return;
    }

    try {
      setCarregando(true);
      const usuarioEncontrado = await fazerLoginNoBanco(emailLimpo, senha);

      const perfilBanco = usuarioEncontrado.perfil ? usuarioEncontrado.perfil.trim().charAt(0).toUpperCase() + usuarioEncontrado.perfil.trim().slice(1).toLowerCase() : '';
      
      const temPermissao = 
        perfilBanco.includes('Coordenador') || 
        perfilBanco.includes('Gerencia');
      
      if (temPermissao) {
        setFeedback({
          tipo: 'sucesso',
          mensagem: `Bem-vindo(a), ${usuarioEncontrado.nome}! A abrir painel...`,
        });

        // 1. Fecha o teclado imediatamente para libertar o foco da tela
        Keyboard.dismiss();

        // 2. Abre o painel com um delay fluido de 0.5s
        setTimeout(() => {
          setCarregando(false);
          if (onLoginSuccess) {
            onLoginSuccess(usuarioEncontrado);
          }
        }, 500);
      } else {
        setCarregando(false);
        setFeedback({
          tipo: 'erro',
          mensagem: `Acesso negado. Perfil detetado: "${usuarioEncontrado.perfil || 'Nenhum'}".`,
        });
      }
    } catch (error) {
      setCarregando(false);
      setFeedback({
        tipo: 'erro',
        mensagem: error.message || 'E-mail ou senha incorretos.',
      });
    }
  };

  const voltar = () => {
    if (onClose) onClose();
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Painel Administrativo</Text>
          <Text style={styles.subtitle}>Acesso para coordenadores e gerência.</Text>

          <FeedbackBox tipo={feedback.tipo} mensagem={feedback.mensagem} onClose={() => setFeedback({ tipo: feedback.tipo, mensagem: feedback.mensagem })} />

          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="email@estacio.br"
            placeholderTextColor="#777"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (feedback.mensagem) setFeedback({ tipo: '', mensagem: '' });
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Senha</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor="#777"
              value={senha}
              onChangeText={(text) => {
                setSenha(text);
                if (feedback.mensagem) setFeedback({ tipo: '', mensagem: '' });
              }}
              secureTextEntry={!mostrarSenha}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setMostrarSenha(!mostrarSenha)}
              style={styles.eyeButton}
            >
              <CustomIcon
                name={mostrarSenha ? 'eye-outline' : 'eye-off-outline'}
                size={18}
                color="#777"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, carregando && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={carregando}
            activeOpacity={0.8}
          >
            <CustomIcon name="log-in-outline" size={18} color="#fff" />
            <Text style={styles.loginButtonText}>
              {carregando ? 'A entrar...' : 'Entrar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={voltar}>
            <Text style={styles.backText}>← voltar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}