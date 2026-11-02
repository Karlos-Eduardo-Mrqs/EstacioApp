import {
    ActivityIndicator,
    ScrollView,
    StatusBar,
    Text,
    View,
} from "react-native";
import { useGerenciarEventos } from "../../hooks/useGerenciarEventos";
import { painelEventosStyles as styles } from "../../styles/painel/painelEventosStyles";
import ConfirmPopup from "../ConfirmPopup";
import ToastPopup from "../Popup";
import GerenciarListaEventos from "./gerenciarListaEventos"; // 👈 Importa o componente de listagem isolado e correto
import ModalGerenciarEvento from "./modalGerenciarEvento";
import CustomIcon from "../CustomIcon";

export default function PainelEventosTela() {
  const {
    eventos,
    eventosFiltrados,
    quantidadeAtivos,
    cursos,
    busca,
    setBusca,
    modalEvento,
    setModalEvento,
    eventoEditando,
    titulo,
    setTitulo,
    descricao,
    setDescricao,
    dataTexto,
    setDataTexto,
    palestrante,
    setPalestrante,
    cursoId,
    setCursoId,
    horasAAC,
    setHorasAAC,
    local,
    setLocal,
    imagem,
    setImagem,
    descricaoImagem,
    setDescricaoImagem,
    feedback,
    toast,
    setToast,
    confirmacao,
    setConfirmacao,
    abrirNovoEvento,
    abrirEdicao,
    selecionarImagem,
    salvarEvento,
    excluirEvento,
    carregando,
  } = useGerenciarEventos();

  return (
    <View style={styles.safeArea}>
      <StatusBar backgroundColor="#F4F5F7" barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.tituloPagina}>Painel de Eventos</Text>
        <Text style={styles.subtitulo}>
          Gerencie os eventos e o calendário acadêmico.
        </Text>

        <View style={styles.resumoContainer}>
          <View style={styles.resumoCard}>
            <CustomIcon name="calendar-outline" size={23} color="#173EA5" />
            <Text style={styles.resumoNumero}>{quantidadeAtivos}</Text>
            <Text style={styles.resumoTexto}>Eventos ativos</Text>
          </View>

          <View style={styles.resumoCard}>
            <CustomIcon name="library-outline" size={23} color="#173EA5" />
            <Text style={styles.resumoNumero}>{eventos.length}</Text>
            <Text style={styles.resumoTexto}>Total de eventos</Text>
          </View>
        </View>

        {carregando ? (
          <ActivityIndicator
            size="large"
            color="#173EA5"
            style={{ marginVertical: 20 }}
          />
        ) : (
          /* ── COMPONENTE ISOLADO DE GERENCIAMENTO E LISTAGEM ── */
          <GerenciarListaEventos
            eventos={eventosFiltrados}
            onEditar={(evento) => abrirEdicao(evento)}
            onExcluir={(id) => excluirEvento({ id })}
            onNovoEvento={abrirNovoEvento}
          />
        )}
      </ScrollView>

      {/* Modal de Cadastro / Edição */}
      <ModalGerenciarEvento
        visible={modalEvento}
        onClose={() => setModalEvento(false)}
        eventoEditando={eventoEditando}
        titulo={titulo}
        setTitulo={setTitulo}
        dataTexto={dataTexto}
        setDataTexto={setDataTexto}
        palestrante={palestrante}
        setPalestrante={setPalestrante}
        horasAAC={horasAAC}
        setHorasAAC={setHorasAAC}
        cursos={cursos}
        cursoId={cursoId}
        setCursoId={setCursoId}
        descricao={descricao}
        setDescricao={setDescricao}
        local={local}
        setLocal={setLocal}
        imagem={imagem}
        setImagem={setImagem}
        descricaoImagem={descricaoImagem}
        setDescricaoImagem={setDescricaoImagem}
        feedback={feedback}
        selecionarImagem={selecionarImagem}
        salvarEvento={salvarEvento}
      />

      {/* ── POPUPS DE FEEDBACK E CONFIRMAÇÃO ── */}
      <ToastPopup
        visible={toast.visible}
        titulo={toast.titulo}
        mensagem={toast.mensagem}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />

      <ConfirmPopup
        visible={confirmacao.visible}
        titulo={confirmacao.titulo}
        mensagem={confirmacao.mensagem}
        tipo={confirmacao.tipo}
        onConfirm={confirmacao.onConfirm}
        onCancel={() => setConfirmacao((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
}
