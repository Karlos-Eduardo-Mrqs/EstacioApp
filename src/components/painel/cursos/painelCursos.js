import { ActivityIndicator, ScrollView, StatusBar, Text, View } from 'react-native';
import { painelEventosStyles as styles } from "../../../styles/painel/painelEventosStyles";
import { useGerenciarCursos } from "../../../hooks/useGerenciarCursos";
import GerenciarListaCursos from './gerenciarListasCursos';
import ModalGerenciarCurso from './modalGerenciarCursos';
import ToastPopup from '../../Popup';
import ConfirmPopup from '../../ConfirmPopup';
import CustomIcon from '../../CustomIcon';

export default function PainelCursos() {
  const {
    cursos,
    cursosFiltrados,
    busca,
    setBusca,
    carregando,
    modalCurso,
    setModalCurso,
    cursoEditando,
    nome,
    setNome,
    descricao,
    setDescricao,
    link,
    setLink,
    icone,
    setIcone,
    tipo,
    setTipo,
    modalidade,     
    setModalidade, 
    feedback,
    toast,
    setToast,
    confirmacao,
    setConfirmacao,
    abrirNovoCurso,
    abrirEdicaoCurso,
    salvarCurso,
    excluirCurso
  } = useGerenciarCursos();

  return (
    <View style={styles.safeArea}>
      <StatusBar backgroundColor="#F4F5F7" barStyle="dark-content" />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.tituloPagina}>Painel de Cursos</Text>
        <Text style={styles.subtitulo}>Gerencie os cursos acadêmicos e ementas disponíveis.</Text>

        <View style={styles.resumoContainer}>
          <View style={[styles.resumoCard, { flex: 1 }]}>
            <CustomIcon name="library-outline" size={23} color="#173EA5" />
            <Text style={styles.resumoNumero}>{cursos.length}</Text>
            <Text style={styles.resumoTexto}>Cursos Cadastrados</Text>
          </View>
        </View>

        {carregando ? (
          <ActivityIndicator size="large" color="#173EA5" style={{ marginVertical: 20 }} />
        ) : (
          <GerenciarListaCursos
            cursos={cursosFiltrados}
            busca={busca}
            setBusca={setBusca}
            onEditar={(curso) => abrirEdicaoCurso(curso)}
            onExcluir={(curso) => excluirCurso(curso)}
            onNovoCurso={abrirNovoCurso}
          />
        )}
      </ScrollView>

      <ModalGerenciarCurso
        visible={modalCurso}
        onClose={() => setModalCurso(false)}
        cursoEditando={cursoEditando}
        nome={nome} setNome={setNome}
        descricao={descricao} setDescricao={setDescricao}
        link={link} setLink={setLink}
        icone={icone} setIcone={setIcone}
        tipo={tipo} setTipo={setTipo}
        modalidade={modalidade} setModalidade={setModalidade} // 👈 Repassa ao modal
        feedback={feedback}
        salvarCurso={salvarCurso}
      />

      <ToastPopup
        visible={toast.visible}
        titulo={toast.nome}
        mensagem={toast.mensagem}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />

      <ConfirmPopup
        visible={confirmacao.visible}
        titulo={confirmacao.nome}
        mensagem={confirmacao.mensagem}
        tipo={confirmacao.tipo}
        onConfirm={confirmacao.onConfirm}
        onCancel={() => setConfirmacao((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
}