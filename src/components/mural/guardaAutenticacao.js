import { View, Text, TouchableOpacity } from 'react-native';
import { CoresInstitucionais } from '../../styles/theme';

export default function AuthGuard({ usuarioAtual, perfilPermitido, children, onVoltar }) {
  if (!usuarioAtual) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#f4f5f7' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#172554', marginBottom: 8 }}>Acesso Restrito 🔒</Text>
        <Text style={{ fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 20 }}>
          Precisa de efetuar login com uma conta autorizada para aceder a este painel.
        </Text>
        <TouchableOpacity 
          style={{ backgroundColor: '#032551', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 }}
          onPress={onVoltar}
        >
          <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Voltar ao Início</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const perfilUsuario = usuarioAtual.perfil ? usuarioAtual.perfil.trim().toLowerCase() : '';
  const permitido = Array.isArray(perfilPermitido) 
    ? perfilPermitido.some(p => perfilUsuario.includes(p.toLowerCase()))
    : perfilUsuario.includes(perfilPermitido.toLowerCase());

  if (!permitido) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#f4f5f7' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#dc2626', marginBottom: 8 }}>Acesso Negado ⚠️</Text>
        <Text style={{ fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 20 }}>
          A sua conta ({usuarioAtual.perfil}) não possui privilégios para aceder a esta secção.
        </Text>
        <TouchableOpacity 
          style={{ backgroundColor: '#032551', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 }}
          onPress={onVoltar}
        >
          <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return children;
}