import { supabase } from '../../lib/supabase'; // 👈 Adicione esta linha no topo do arquivo
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


// Solicita uma persmissão de agendar/notificar evento
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

// Armazena a notificação localmente
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

// Envia/Cria um novo aviso global ou direcionado a um curso específico
export async function criarAvisoGlobalNoBanco({ titulo, mensagem, curso_id, duracaoHoras = 24 }) {
  const dataExpiracao = new Date();
  dataExpiracao.setHours(dataExpiracao.getHours() + Number(duracaoHoras));

  const { data, error } = await supabase
    .from('aviso')
    .insert([{
      titulo: titulo.trim(),
      mensagem: mensagem.trim(),
      curso_id: curso_id ? Number(curso_id) : null, // null significa global (para todo mundo)
      expira_em: dataExpiracao.toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Busca os avisos válidos (não expirados) para o mural do aluno, filtrando pela lista de cursos favoritos ou globais
export async function buscarAvisosAtivosDoBanco(cursosFavoritosIds = []) {
  const agoraIso = new Date().toISOString();

  // Busca todos os avisos que ainda não expiraram
  const { data, error } = await supabase
    .from('aviso')
    .select('*, curso(nome)')
    .gt('expira_em', agoraIso)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const avisos = data || [];

  // Filtra os avisos: mantém se o curso_id for nulo (global) ou se o curso_id do aviso estiver incluído na lista de favoritos do aluno
  return avisos.filter(a => {
    if (a.curso_id === null) return true;
    if (!cursosFavoritosIds || cursosFavoritosIds.length === 0) return false;
    
    // Converte para número para garantir compatibilidade na comparação
    return cursosFavoritosIds.some(idFav => Number(idFav) === Number(a.curso_id));
  });
}