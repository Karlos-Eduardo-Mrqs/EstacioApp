import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { solicitarPermissaoEAgendarLembrete } from "../services/notificacaoService";

export function useNotificacoes(exibirPopup) {
  const [notificacoesSalvas, setNotificacoesSalvas] = useState([]);

  // Carregar notificações salvas ao iniciar utilizando a chave unificada
  useEffect(() => {
    async function carregarNotificacoes() {
      try {
        const salvas = await AsyncStorage.getItem("@notificacoes_salvas");
        if (salvas) {
          setNotificacoesSalvas(JSON.parse(salvas));
        }
      } catch (e) {
        console.log("Erro ao carregar notificações", e);
        setToast({ visible: true, titulo: "Erro!", mensagem: "Falha ao carregar notificações." });
      }
    }
    carregarNotificacoes();
  }, []);

  const salvarNotificacao = async (evento) => {
    try {
      const jaExiste = notificacoesSalvas.some((item) => item.id === evento.id);
      if (jaExiste) {
        exibirPopup(
          "⚠️ Notificação Existente",
          "Este evento já está guardado nas suas notificações!",
          "aviso",
          4,
        );
        return;
      }

      const resultado = await solicitarPermissaoEAgendarLembrete(evento);

      if (!resultado.sucesso) {
        exibirPopup(
          "🔒 Permissão Necessária",
          resultado.mensagem || "Ative as notificações para receber lembretes.",
          "aviso",
          5,
        );
        return;
      }

      const novaLista = [evento, ...notificacoesSalvas];
      setNotificacoesSalvas(novaLista);
      await AsyncStorage.setItem(
        "@notificacoes_salvas",
        JSON.stringify(novaLista),
      );

      exibirPopup(
        "🔔 Lembrete Ativado!",
        "Evento adicionado aos lembretes do dispositivo.",
        "sucesso",
        4,
      );
    } catch (e) {
      exibirPopup(
        "❌ Erro",
        "Não foi possível configurar o lembrete no dispositivo.",
        "erro",
        4,
      );
    }
  };

  const removerNotificacao = async (id) => {
    try {
      const novaLista = notificacoesSalvas.filter((item) => item.id !== id);
      setNotificacoesSalvas(novaLista);
      await AsyncStorage.setItem(
        "@notificacoes_salvas",
        JSON.stringify(novaLista),
      );

      exibirPopup(
        "🗑️ Removido",
        "Notificação removida com sucesso!",
        "sucesso",
        4,
      );
    } catch (e) {
      exibirPopup(
        "❌ Erro",
        "Ocorreu um erro ao tentar remover a notificação.",
        "erro",
        4,
      );
    }
  };

  return {
    notificacoesSalvas,
    salvarNotificacao,
    removerNotificacao,
  };
}