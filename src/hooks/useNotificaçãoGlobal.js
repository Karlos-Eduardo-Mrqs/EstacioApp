import { useState, useEffect } from "react";
import { buscarCursosDoBanco } from "../services/cursoServices";
import { buscarEventosDoBanco } from "../services/eventoServices";
import { buscarTodosAvisosAtivosDoBanco, criarAvisoGlobalNoBanco } from "../services/notificacaoService";

export function useNotificacaoGlobal(usuarioAtual) {
  const [cursos, setCursos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const [modalVisualizarVisivel, setModalVisualizarVisivel] = useState(false);
  const [avisosEnviados, setAvisosEnviados] = useState([]);
  const [carregandoAvisos, setCarregandoAvisos] = useState(false);

  const [toast, setToast] = useState({ visible: false, titulo: "", mensagem: "" });

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [dadosCursos, dadosEventos] = await Promise.all([
        buscarCursosDoBanco(),
        buscarEventosDoBanco()
      ]);
      setCursos(dadosCursos || []);
      setEventos(dadosEventos || []);
    } catch (error) {
        setToast({ visible: true, titulo: "Erro!", mensagem: "Falha ao carregar dados." });
        console.log("Erro ao carregar dados:", error);
    }
  }

  const enviarNotificacao = async ({ titulo, mensagem, tipoDestino, cursoId, eventoId, limparCampos }) => {
    if (!titulo.trim() || !mensagem.trim()) {
      setToast({ visible: true, titulo: "Atenção", mensagem: "Preencha o título e a mensagem." });
      return;
    }

    try {
      setCarregando(true);

      await criarAvisoGlobalNoBanco({
        titulo,
        mensagem,
        curso_id: tipoDestino === "curso" ? cursoId : null,
        evento_id: tipoDestino === "evento" ? eventoId : null,
        usuario_id: usuarioAtual?.id || usuarioAtual?.usuario_id || null, // 👈 Garante diferentes variações de propriedades do objeto de usuário
        duracaoHoras: 24,
      });

      setToast({ visible: true, titulo: "Sucesso!", mensagem: "O comunicado foi disparado com sucesso." });
      limparCampos();
    } catch (error) {
      console.error("Erro ao enviar aviso:", error);
      setToast({ visible: true, titulo: "Erro", mensagem: "Não foi possível enviar o comunicado." });
    } finally {
      setCarregando(false);
    }
  };

  const abrirVisualizacaoAvisos = async () => {
    try {
      setCarregandoAvisos(true);
      setModalVisualizarVisivel(true);

      const lista = await buscarTodosAvisosAtivosDoBanco();

      const listaMapeada = (lista || []).map((aviso) => {
        let cursoEncontrado = aviso.curso_id ? cursos.find((c) => Number(c.id) === Number(aviso.curso_id)) : null;
        let eventoEncontrado = aviso.evento_id ? eventos.find((e) => Number(e.id) === Number(aviso.evento_id)) : null;

        return {
          ...aviso,
          nomeDestinatarioCurso: cursoEncontrado ? cursoEncontrado.titulo : null,
          nomeDestinatarioEvento: eventoEncontrado ? eventoEncontrado.titulo : null,
        };
      });

      setAvisosEnviados(listaMapeada);
    } catch (error) {
      console.log("Erro ao buscar avisos:", error);
      setToast({ visible: true, titulo: "Erro", mensagem: "Não foi possível carregar os avisos ativos." });
    } finally {
      setCarregandoAvisos(false);
    }
  };

  return {
    cursos,
    eventos,
    carregando,
    modalVisualizarVisivel,
    setModalVisualizarVisivel,
    avisosEnviados,
    carregandoAvisos,
    toast,
    setToast,
    enviarNotificacao,
    abrirVisualizacaoAvisos,
  };
}