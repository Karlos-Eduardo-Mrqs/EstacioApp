import {ActivityIndicator,ScrollView,StatusBar,Text,View,} from "react-native";
import { useGerenciarEventos } from "../../hooks/useGerenciarEventos";
import { painelEventosStyles as styles } from "../../styles/painel/painelEventosStyles";
import ConfirmPopup from "../ConfirmPopup";
import ToastPopup from "../Popup";
import GerenciarListaEventos from "./gerenciarListaEventos"; 
import ModalGerenciarEvento from "./modalGerenciarEvento";
import CustomIcon from "../CustomIcon";

export default function PainelEventosTela() {
  const {
    eventos,
    eventosFiltrados,
    cursos,
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
    dataApenas, setDataApenas, horaApenas, setHoraApenas,
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
    carregando, solicitarRemocaoImagem, agora
  } = useGerenciarEventos();

  // 📊 Calcula dinamicamente quantos eventos já passaram com base no relógio 'agora'
  const quantidadeEncerrados = eventos.filter((evento) => {
    const dataObj = new Date(evento.inicio || evento.data || evento.dataEvento);
    return dataObj.getTime() < agora;
  }).length;

  return (
    <View style={styles.safeArea}>
      <StatusBar backgroundColor="#F4F5F7" barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.tituloPagina}>Painel de Eventos</Text>
        <Text style={styles.subtitulo}>Gerencie os eventos e o calendário acadêmico.</Text>

        {/* 📈 Cartões de Resumo Atualizados (3 colunas) */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>

          <View style={[styles.resumoCard, { flex: 1 }]}>
            <CustomIcon name="time-outline" size={21} color="#DC2626" />
            <Text style={[styles.resumoNumero, { color: "#DC2626" }]}>{quantidadeEncerrados}</Text>
            <Text style={styles.resumoTexto}>Encerrados</Text>
          </View>

          <View style={[styles.resumoCard, { flex: 1 }]}>
            <CustomIcon name="library-outline" size={21} color="#173EA5" />
            <Text style={styles.resumoNumero}>{eventos.length}</Text>
            <Text style={styles.resumoTexto}>Total</Text>
          </View>
        </View>

        {carregando ? (
          <ActivityIndicator size="large" color="#173EA5" style={{ marginVertical: 20 }} />
        ) : (
          <GerenciarListaEventos
            eventos={eventosFiltrados}
            agora={agora}
            onEditar={(evento) => abrirEdicao(evento)}
            onExcluir={(id) => excluirEvento({ id })}
            onNovoEvento={abrirNovoEvento}
          />
        )}
      </ScrollView>

      <ModalGerenciarEvento
        visible={modalEvento}
        onClose={() => setModalEvento(false)}
        eventoEditando={eventoEditando}
        titulo={titulo} setTitulo={setTitulo}
        dataTexto={dataTexto} setDataTexto={setDataTexto}
        palestrante={palestrante} setPalestrante={setPalestrante}
        horasAAC={horasAAC} setHorasAAC={setHorasAAC}
        cursos={cursos} cursoId={cursoId} setCursoId={setCursoId}
        descricao={descricao} setDescricao={setDescricao}
        local={local} setLocal={setLocal}
        imagem={imagem} setImagem={setImagem}
        descricaoImagem={descricaoImagem}
        dataApenas={dataApenas}
        setDataApenas={setDataApenas}     
        horaApenas={horaApenas}
        setHoraApenas={setHoraApenas}
        setDescricaoImagem={setDescricaoImagem}
        feedback={feedback}
        selecionarImagem={selecionarImagem}
        solicitarRemocaoImagem={solicitarRemocaoImagem}
        salvarEvento={salvarEvento}
      />

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