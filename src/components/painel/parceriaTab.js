import { View, Text, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { painelEventosStyles as styles } from "../../styles/painel/painelEventosStyles"; // 👈 Sobe duas pastas (painel -> components -> styles)
import { useGerenciarParcerias } from "../../hooks/useGerenciarParcerias"; // 👈 Sobe duas pastas (painel -> components -> hooks)
import GerenciarListaParcerias from './gerenciarListaParcerias';
import ModalGerenciarParceria from './modalGerenciarParcerias';
import ToastPopup from '../Popup'; // 👈 Sobe uma pasta (painel -> components)
import ConfirmPopup from '../ConfirmPopup'; // 👈 Sobe uma pasta (painel -> components)

export default function ParceriaTab() {
  const {
    parcerias,
    parceriasFiltradas,
    quantidadeAtivas,
    modalParceria,
    setModalParceria,
    parceriaEditando,
    titulo,
    setTitulo,
    descricao,
    setDescricao,
    link,
    setLink,
    duracao,
    setDuracao,
    desconto,
    setDesconto,
    feedback,
    toast,
    setToast,
    confirmacao,
    setConfirmacao,
    abrirNovaParceria,
    abrirEdicao,
    salvarParceria,
    solicitarExclusao,
    carregando,
  } = useGerenciarParcerias();

  return (
    <View style={styles.safeArea}>
      <StatusBar backgroundColor="#F4F5F7" barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.tituloPagina}>Painel de Parcerias</Text>
        <Text style={styles.subtitulo}>
          Gerencie empresas conveniadas e cupons acadêmicos.
        </Text>

        {/* CARTÕES DE RESUMO */}
        <View style={styles.resumoContainer}>
          <View style={styles.resumoCard}>
            <Ionicons name="hand-left-outline" size={23} color="#173EA5" />
            <Text style={styles.resumoNumero}>{quantidadeAtivas}</Text>
            <Text style={styles.resumoTexto}>Parcerias ativas</Text>
          </View>

          <View style={styles.resumoCard}>
            <Ionicons name="albums-outline" size={23} color="#173EA5" />
            <Text style={styles.resumoNumero}>{parcerias.length}</Text>
            <Text style={styles.resumoTexto}>Total de registros</Text>
          </View>
        </View>

        {carregando ? (
          <ActivityIndicator
            size="large"
            color="#173EA5"
            style={{ marginVertical: 20 }}
          />
        ) : (
          <GerenciarListaParcerias
            parcerias={parceriasFiltradas}
            onEditar={(parceria) => abrirEdicao(parceria)}
            onExcluir={(parceria) => solicitarExclusao(parceria)}
            onNovaParceria={abrirNovaParceria}
          />
        )}
      </ScrollView>

      {/* Modal de Cadastro/Edição */}
      <ModalGerenciarParceria
        visible={modalParceria}
        onClose={() => setModalParceria(false)}
        parceriaEditando={parceriaEditando}
        titulo={titulo}
        setTitulo={setTitulo}
        descricao={descricao}
        setDescricao={setDescricao}
        link={link}
        setLink={setLink}
        duracao={duracao}
        setDuracao={setDuracao}
        desconto={desconto}
        setDesconto={setDesconto}
        feedback={feedback}
        salvarParceria={salvarParceria}
      />

      {/* Popups de Feedback e Confirmação */}
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
