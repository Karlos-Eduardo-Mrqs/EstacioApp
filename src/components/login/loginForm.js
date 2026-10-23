import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { styles } from '../../styles/loginForm';
import CustomIcon from "../CustomIcon";
import FeedbackBox from '../../components/FeedPopup';
import { fazerLoginNoBanco } from '../../services/apiServices'; // 👈 Importa a função do banco

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
      // Faz a consulta real na tabela 'usuario' do Supabase
      const usuarioEncontrado = await fazerLoginNoBanco(emailLimpo, senha);

      // Verifica se tem perfil administrativo / coordenação autorizado
      if (usuarioEncontrado.perfil === 'Gerência Acadêmica' || usuarioEncontrado.perfil === 'Coordenador') {
        setFeedback({
          tipo: 'sucesso',
          mensagem: `Bem-vindo(a), ${usuarioEncontrado.nome}! A abrir painel...`,
        });

        setTimeout(() => {
          if (onLoginSuccess) {
            onLoginSuccess(usuarioEncontrado);
          }
        }, 1000);
      } else {
        setFeedback({
          tipo: 'erro',
          mensagem: 'Este perfil não possui acesso administrativo.',
        });
      }
    } catch (error) {
      setFeedback({
        tipo: 'erro',
        mensagem: error.message || 'E-mail ou senha incorretos.',
      });
    } finally {
      setCarregando(false);
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