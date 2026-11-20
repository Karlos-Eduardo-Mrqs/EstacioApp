import { useEffect, useState, useCallback } from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import ToastPopup from '../Popup';

export default function AuthGuard({ usuarioAtual, perfilPermitido, children, onVoltar }) {
  const router = useRouter();
  const [toast, setToast] = useState({
    visible: false,
    titulo: '',
    mensagem: '',
  });

  const voltarParaMural = useCallback(() => {
    if (typeof onVoltar === 'function') {
      onVoltar();
    } else {
      router.replace('/');
    }
  }, [onVoltar, router]);

  const perfilUsuario = usuarioAtual?.perfil
    ? usuarioAtual.perfil.trim().toLowerCase()
    : '';

  const temUsuario = Boolean(usuarioAtual);
  const permitido =
    temUsuario &&
    (Array.isArray(perfilPermitido)
      ? perfilPermitido.some((p) => perfilUsuario.includes(String(p).toLowerCase()))
      : perfilUsuario.includes(String(perfilPermitido || '').toLowerCase()));

  useEffect(() => {
    if (!temUsuario) {
      setToast({
        visible: true,
        titulo: 'Acesso Restrito 🔒',
        mensagem: 'Faça login com uma conta autorizada para acessar esta área. Voltando ao mural...',
      });

      const timer = setTimeout(() => {
        voltarParaMural();
      }, 1500);

      return () => clearTimeout(timer);
    }

    if (!permitido) {
      setToast({
        visible: true,
        titulo: 'Acesso Negado ⚠️',
        mensagem: 'Você não tem autorização para entrar aqui. Voltando ao mural...',
      });

      const timer = setTimeout(() => {
        voltarParaMural();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [temUsuario, permitido, voltarParaMural]);

  const fecharToastEVoltar = () => {
    setToast((prev) => ({ ...prev, visible: false }));
    voltarParaMural();
  };

  if (!temUsuario || !permitido) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f4f5f7' }}>
        <ToastPopup
          visible={toast.visible}
          titulo={toast.titulo}
          mensagem={toast.mensagem}
          onClose={fecharToastEVoltar}
          duracao={4}
        />
      </View>
    );
  }

  return children;
}