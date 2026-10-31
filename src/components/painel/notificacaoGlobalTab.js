import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { buscarCursosDoBanco } from "../../services/cursoServices"; // 👈 Sobe 3 níveis (notificacao -> painel -> components -> src)
import { criarAvisoGlobalNoBanco } from "../../services/notificacaoService"; 
import { notificacaoGlobalstyles as styles } from "../../styles/painel/notificacaoGlobalTabStyles"; // 👈 Sobe 3 níveis
import FormularioNotificacao from "./formNotificacao";

import ToastPopup from "../Popup";

export default function NotificacaoGlobalTab() {
  const [cursos, setCursos] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    titulo: "",
    mensagem: "",
  });

  useEffect(() => {
    carregarCursos();
  }, []);

  async function carregarCursos() {
    try {
      const dadosCursos = await buscarCursosDoBanco();
      setCursos(dadosCursos || []);
    } catch (error) {
      console.log("Erro ao carregar cursos:", error);
    }
  }

  const handleEnviarNotificacao = async ({
    titulo,
    mensagem,
    cursoId,
    limparCampos,
  }) => {
    if (!titulo.trim() || !mensagem.trim()) {
      setToast({
        visible: true,
        titulo: "Atenção",
        mensagem: "Preencha o título e a mensagem.",
      });
      return;
    }

    try {
      setCarregando(true);
      await criarAvisoGlobalNoBanco({
        titulo: titulo,
        mensagem: mensagem,
        curso_id: cursoId,
        duracaoHoras: 24,
      });

      setToast({
        visible: true,
        titulo: "Sucesso!",
        mensagem: "O aviso global foi disparado com sucesso para o mural.",
      });
      limparCampos();
    } catch (error) {
      console.error("Erro ao enviar aviso:", error);
      setToast({
        visible: true,
        titulo: "Erro",
        mensagem: "Não foi possível enviar o comunicado.",
      });
    } finally {
      setCarregando(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <FormularioNotificacao
        cursos={cursos}
        onEnviar={handleEnviarNotificacao}
        carregando={carregando}
      />

      <ToastPopup
        visible={toast.visible}
        titulo={toast.titulo}
        mensagem={toast.mensagem}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </ScrollView>
  );
}
