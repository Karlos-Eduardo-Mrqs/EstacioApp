import * as Notifications from 'expo-notifications';
import { Platform, Vibration } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      if (!('Notification' in window)) {
        return { 
          sucesso: false, 
          tipo: 'erro', 
          mensagem: "Este navegador não suporta notificações de sistema." 
        };
      }

      // Verifica se já foi bloqueado anteriormente pelo utilizador
      if (Notification.permission === 'denied') {
        return { 
          sucesso: false, 
          tipo: 'erro', 
          mensagem: "As notificações estão bloqueadas neste site. Altere a permissão no ícone de cadeado na barra de endereços do navegador." 
        };
      }

      const permissao = await Notification.requestPermission();
      if (permissao === 'granted') {
        await guardarNotificacaoLocal(evento);

        new Notification(`📅 Lembrete: ${evento.titulo}`, {
          body: evento.descricao || `Agendado para ${evento.dia || ''} de ${evento.mes || ''}!`,
          icon: '/icone.png', 
        });
        return { 
          sucesso: true, 
          tipo: 'sucesso', 
          mensagem: "Lembrete guardado com sucesso!" 
        };
      } else {
        return { 
          sucesso: false, 
          tipo: 'erro', 
          mensagem: "Permissão de notificação negada pelo navegador." 
        };
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
        return { 
          sucesso: false, 
          tipo: 'erro', 
          mensagem: 'É necessário permitir notificações nas definições do telemóvel.' 
        };
      }

      await guardarNotificacaoLocal(evento);

      let triggerConfig = null;
      if (evento.inicio) {
        const dataEvento = new Date(evento.inicio);
        if (dataEvento > new Date()) {
          triggerConfig = dataEvento;
        }
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: `📅 Lembrete Acadêmico: ${evento.titulo}`,
          body: evento.descricao || `Não se esqueça deste evento agendado!`,
          sound: true,
        },
        trigger: triggerConfig,
      });

      Vibration.vibrate(300);

      return { 
        sucesso: true, 
        tipo: 'sucesso', 
        mensagem: 'Lembrete guardado e notificação agendada com sucesso!' 
      };
    }
  } catch (error) {
    console.log("Erro ao configurar notificação:", error);
    return { 
      sucesso: false, 
      tipo: 'erro', 
      mensagem: "Ocorreu um erro ao configurar o lembrete." 
    };
  }
}

async function guardarNotificacaoLocal(evento) {
  try {
    const chaveStorage = '@notificacoes_salvas';
    const salvosJson = await AsyncStorage.getItem(chaveStorage);
    const lembretesSalvos = salvosJson ? JSON.parse(salvosJson) : [];

    const jaExiste = lembretesSalvos.some(item => item.id === evento.id);
    if (!jaExiste) {
      lembretesSalvos.push(evento);
      await AsyncStorage.setItem(chaveStorage, JSON.stringify(lembretesSalvos));
    }
  } catch (e) {
    console.log("Erro ao guardar notificação no armazenamento local:", e);
  }
}