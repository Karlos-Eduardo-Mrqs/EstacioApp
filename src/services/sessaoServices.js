import AsyncStorage from '@react-native-async-storage/async-storage';

const CHAVE_SESSAO = '@usuario_logado';

export async function salvarSessaoUsuario(usuario) {
  try {
    await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(usuario));
  } catch (error) {
    console.log('Erro ao salvar sessão:', error);
  }
}

export async function recuperarSessaoUsuario() {
  try {
    const dados = await AsyncStorage.getItem(CHAVE_SESSAO);
    return dados ? JSON.parse(dados) : null;
  } catch (error) {
    console.log('Erro ao recuperar sessão:', error);
    return null;
  }
}

export async function limparSessaoUsuario() {
  try {
    await AsyncStorage.removeItem(CHAVE_SESSAO);
  } catch (error) {
    console.log('Erro ao limpar sessão:', error);
  }
}