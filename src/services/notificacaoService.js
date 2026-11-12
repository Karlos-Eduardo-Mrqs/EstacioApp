import { supabase } from '../../lib/supabase'; // 👈 Essencial para o Supabase deixar de dar "not defined"
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
        // Fallback: se o browser não suporta, guarda localmente para aparecer na aba na mesma
        await guardarNotificacaoLocal(evento);
        return { 
          sucesso: true, 
          tipo: 'sucesso', 
          mensagem: "Lembrete guardado localmente com sucesso!" 
        };
      }

      if (Notification.permission === 'denied') {
        return { 
          sucesso: false, 
          tipo: 'erro', 
          mensagem: "As notificações estão bloqueadas neste site. Altere a permissão nas definições do navegador." 
        };
      }

      // Tenta pedir permissão, mas garante o salvamento local independentemente da recusa do pop-up do browser
      try {
        await Notification.requestPermission();
      } catch (e) {
        setToast({ visible: true, titulo: "Aviso!", mensagem: "Falha ao ativar a permissão web, ative-a manualmente." });
        console.log("Aviso de permissão web:", e);
      }

      await guardarNotificacaoLocal(evento);

      return { 
        sucesso: true, 
        tipo: 'sucesso', 
        mensagem: "Lembrete guardado com sucesso!" 
      };

    } else {
      // --- LÓGICA PARA MOBILE (Android / iOS) ---
      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        // Guarda sempre localmente primeiro para garantir que aparece na aba de notificações
        await guardarNotificacaoLocal(evento);

        if (finalStatus === 'granted') {
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
          }).catch(() => {}); // Ignora falhas menores de agendamento de OS se houver restrição pontual

          Vibration.vibrate(300);
        }

        return { 
          sucesso: true, 
          tipo: 'sucesso', 
          mensagem: 'Lembrete guardado com sucesso!' 
        };

      } catch (mobileError) {
        console.log("Aviso de notificação mobile:", mobileError);
        // Garante o salvamento local mesmo se a API nativa falhar no telemóvel
        await guardarNotificacaoLocal(evento);
        return { 
          sucesso: true, 
          tipo: 'sucesso', 
          mensagem: 'Lembrete guardado com sucesso!' 
        };
      }
    }
  } catch (error) {
    console.log("Erro geral ao configurar notificação:", error);
    // Blindagem final para salvar localmente e nunca frustrar o utilizador com o modal de erro
    await guardarNotificacaoLocal(evento);
    return { 
      sucesso: true, 
      tipo: 'sucesso', 
      mensagem: "Lembrete guardado com sucesso!" 
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

// Envia/Cria um novo aviso (Global, para um Curso específico ou para um Evento específico)
export async function criarAvisoGlobalNoBanco({ titulo, mensagem, curso_id, evento_id, usuario_id, duracaoHoras = 24 }) {
  const dataExpiracao = new Date();
  dataExpiracao.setHours(dataExpiracao.getHours() + Number(duracaoHoras));

  const { data, error } = await supabase
    .from('aviso')
    .insert([{
      titulo: titulo.trim(),
      mensagem: mensagem.trim(),
      curso_id: curso_id ? Number(curso_id) : null,
      evento_id: evento_id ? Number(evento_id) : null,
      usuario_id: usuario_id ? Number(usuario_id) : null,
      expira_em: dataExpiracao.toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// 1. Certifique-se de que esta função está exportada
export async function buscarAvisosAtivosDoBanco(cursosFavoritosIds = [], eventosInscritosIds = []) {
  const agoraIso = new Date().toISOString();

  // 1. Busca os avisos fazendo o JOIN com as tabelas curso e evento
  const { data, error } = await supabase
    .from('aviso')
    .select(`
      *,
      curso:curso_id ( id, nome ),
      evento:evento_id ( id, titulo )
    `)
    .gt('expira_em', agoraIso)
    .order('created_at', { ascending: false });

  if (error) throw error;
  const avisos = data || [];

  // 2. Se a lista de eventos inscritos/salvos não foi passada, recupera do AsyncStorage (@notificacoes_salvas)
  let idsEventosUsuario = eventosInscritosIds || [];
  if (idsEventosUsuario.length === 0) {
    try {
      const salvosJson = await AsyncStorage.getItem('@notificacoes_salvas');
      const lembretesSalvos = salvosJson ? JSON.parse(salvosJson) : [];
      idsEventosUsuario = lembretesSalvos.map(e => e.id);
    } catch (e) {
      console.log("Erro ao ler lembretes locais para o filtro:", e);
    }
  }

  // 3. Aplica o filtro cruzando Global, Cursos Favoritos e Eventos Salvos/Inscritos
  return avisos.filter(a => {
    // Aviso Global (sem restrição de curso ou evento)
    if (a.curso_id === null && a.evento_id === null) return true;

    // Aviso direcionado a Curso
    if (a.curso_id !== null) {
      if (cursosFavoritosIds && cursosFavoritosIds.some(idFav => Number(idFav) === Number(a.curso_id))) {
        return true;
      }
    }

    // Aviso direcionado a Evento
    if (a.evento_id !== null) {
      if (idsEventosUsuario && idsEventosUsuario.some(idEvt => Number(idEvt) === Number(a.evento_id))) {
        return true;
      }
    }

    return false;
  });
}

export async function buscarTodosAvisosAtivosDoBanco() {
  const agoraIso = new Date().toISOString();

  // 1. Busca os avisos fazendo o JOIN com as tabelas curso e evento
  const { data, error } = await supabase
    .from('aviso')
    .select(`
      *,
      curso:curso_id ( id, nome),
      evento:evento_id ( id, titulo)
    `)
    .gt('expira_em', agoraIso)
    .order('created_at', { ascending: false });

  if (error) throw error;
  const avisos = data || [];

  return avisos.map(aviso => {
    let nomeCurso = null;
    let nomeEvento = null;

    if (aviso.curso_id && cursos) {
      const cursoFound = cursos.find(c => Number(c.id) === Number(aviso.curso_id));
      if (cursoFound) {
        nomeCurso = cursoFound.titulo || cursoFound.nome || `Curso #${aviso.curso_id}`;
      }
    }

    if (aviso.evento_id && eventos) {
      const eventoFound = eventos.find(e => Number(e.id) === Number(aviso.evento_id));
      if (eventoFound) {
        nomeEvento = eventoFound.titulo || eventoFound.nome || `Evento #${aviso.evento_id}`;
      }
    }

    return {
      ...aviso,
      nomeDestinatarioCurso: nomeCurso,
      nomeDestinatarioEvento: nomeEvento,
    };
  });
}