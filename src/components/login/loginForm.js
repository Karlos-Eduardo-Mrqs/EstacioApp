import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { styles } from '../../styles/loginForm';
import { USUARIOS_MOCK } from '../../constants/Dados';
import CustomIcon from "../CustomIcon"; // Ajuste o caminho relativo se necessário
import FeedbackBox from '../../components/FeedPopup';

export default function LoginScreen({ onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });

  const handleLogin = () => {
    setFeedback({ tipo: '', mensagem: '' });
    const emailLimpo = email.trim().toLowerCase();

    if (!emailLimpo || !senha) {
      setFeedback({
        tipo: 'erro',
        mensagem: 'Por favor, preencha o e-mail e a senha.',
      });
      return;
    }

    // Procura o utilizador na mock data
    const usuarioEncontrado = USUARIOS_MOCK.find(
      (user) => user.email.toLowerCase() === emailLimpo && user.senha === senha
    );

    if (usuarioEncontrado) {
      // Verifica se tem perfil administrativo / coordenação autorizado
      if (usuarioEncontrado.perfil === 'Gerência Acadêmica' || usuarioEncontrado.perfil === 'Coordenador') {
        setFeedback({
          tipo: 'sucesso',
          mensagem: `Bem-vindo(a), ${usuarioEncontrado.nome}! A abrir painel...`,
        });

        // Aguarda 1 segundo para o utilizador ler a mensagem de sucesso e abre o painel
        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(usuarioEncontrado); // 👈 Dispara a abertura do painel administrativo
          }
        }, 1000);
      } else {
        setFeedback({
          tipo: 'erro',
          mensagem: 'Este perfil não possui acesso administrativo.',
        });
      }
    } else {
      setFeedback({
        tipo: 'erro',
        mensagem: 'E-mail ou senha incorretos.',
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

          <FeedbackBox tipo={feedback.tipo} mensagem={feedback.mensagem} />

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
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <CustomIcon name="log-in-outline" size={18} color="#fff" />
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={voltar}>
            <Text style={styles.backText}>← voltar</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}