import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configura como a notificação deve se comportar quando o app estiver aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function solicitarPermissaoEAgendarLembrete(evento) {
  try {
    if (Platform.OS === 'web') {
      // --- LÓGICA PARA WEB / PC ---
      if (!('Notification' in window)) {
        return { sucesso: false, mensagem: "Este navegador não suporta notificações de sistema." };
      }

      const permissao = await Notification.requestPermission();
      if (permissao === 'granted') {
 
        // A API nativa do navegador exige uma URL de imagem em string (ou pode omitir o icon)
        new Notification("📅 Lembrete de Evento - Estácio", {
          body: `"${evento.titulo}" foi agendado para ${evento.dia} de ${evento.mes}!`,
          icon: '/icone.png', 
        });
        return { sucesso: true };
      } else {
        return { sucesso: false, mensagem: "Permissão de notificação negada pelo navegador." };
      }
    } else {
      // --- LÓGICA PARA MOBILE (Android / iOS) ---
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return { sucesso: false, mensagem: 'É necessário permitir notificações para receber lembretes no telemóvel.' };
      }

      // Agenda a notificação localmente
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "📅 Lembrete Acadêmico",
          body: `Não se esqueça do evento: ${evento.titulo} (${evento.dia} de ${evento.mes}).`,
          sound: true,
        },
        trigger: null,
      });

      return { sucesso: true };
    }
  } catch (error) {
    console.log("Erro ao configurar notificação:", error);
    return { sucesso: false, mensagem: "Ocorreu um erro ao configurar o lembrete." };
  }
}