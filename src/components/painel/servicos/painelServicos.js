import { ActivityIndicator, ScrollView, StatusBar, Text, View } from 'react-native';
import { painelServicosstyles as styles } from "../../../styles/painel/painelServicosStyles";
import { useGerenciarServicos } from "../../../hooks/useGerenciarServicos";
import GerenciarListaServicos from './gerenciarListaServicos';
import ModalGerenciarServico from './modalGerenciarServicos';
import ToastPopup from '../../Popup';
import ConfirmPopup from '../../ConfirmPopup';
import CustomIcon from '../../CustomIcon';
import ModalDetalhesServico from '../../mural/ModalServicos';

export default function PainelServicos({ usuarioAtual }) {
  const {
    servicosFiltrados,
    pesquisa,
    setPesquisa,
    carregando,
    quantidadeServicos,
    quantidadeCoordenadores,
    modalFormulario,
    setModalFormulario,
    servicoEditando,
    servicoSelecionado,
    setServicoSelecionado,
    nome,
    setNome,
    coordenadorId,
    setCoordenadorId,
    cursoId,
    setCursoId,
    descricao,
    setDescricao,
    dias,
    setDias,
    linksUteis,
    setLinksUteis,
    aviso,
    setAviso,
    coordenadoresDisponiveis,
    cursosDisponiveis,
    toast,
    setToast,
    confirmacao,
    setConfirmacao,
    abrirCadastro,
    abrirEdicao,
    salvarServico,
    confirmarExclusao,
    alternarStatusServico,
  } = useGerenciarServicos(usuarioAtual);
  
  const perfilNorm = usuarioAtual?.perfil ? usuarioAtual.perfil.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
  const ehCoordenador = perfilNorm.includes("coordenador");

  // 💡 Cálculo opcional para os indicadores específicos do Coordenador (ex: contar quantos links úteis ele tem preenchidos nos serviços dele)
  const servicoDoCoordenador = servicosFiltrados[0]; // Como o coordenador vê o seu próprio serviço
  const totalLinksCoordenador = servicoDoCoordenador?.linksUteis ? servicoDoCoordenador.linksUteis.split('\n').filter(Boolean).length : 0;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0A2540" barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Serviços Institucionais</Text>
          <Text style={styles.subtitulo}>
            {ehCoordenador ? "Gerencie o serviço vinculado ao seu perfil." : "Gerencie os serviços e seus respectivos coordenadores."}
          </Text>
        </View>

        {/* 📊 INDICADORES CONDICIONAIS (Gerência vs Coordenador) */}
        <View style={styles.indicadores}>
          <View style={[styles.indicadorCard, { flex: 1 }]}>
            <CustomIcon name="grid-outline" size={23} color="#2451A4" />
            <Text style={styles.indicadorNumero}>{quantidadeServicos}</Text>
            <Text style={styles.indicadorLegenda}>
              {ehCoordenador ? "Serviço vinculado" : "Total de serviços"}
            </Text>
          </View>

          {ehCoordenador ? (
            // 👤 Indicadores exclusivos para o Coordenador
            <View style={[styles.indicadorCard, { flex: 1 }]}>
              <CustomIcon name="link-outline" size={23} color="#2451A4" />
              <Text style={styles.indicadorNumero}>{totalLinksCoordenador}</Text>
              <Text style={styles.indicadorLegenda}>Links úteis cadastrados</Text>
            </View>
          ) : (
            // 🛡️ Indicadores exclusivos para a Gerência
            <View style={[styles.indicadorCard, { flex: 1 }]}>
              <CustomIcon name="people-outline" size={23} color="#2451A4" />
              <Text style={styles.indicadorNumero}>{quantidadeCoordenadores}</Text>
              <Text style={styles.indicadorLegenda}>Coordenadores vinculados</Text>
            </View>
          )}
        </View>

        {carregando ? (
          <ActivityIndicator size="large" color="#2451A4" style={{ marginVertical: 20 }} />
        ) : (
          <GerenciarListaServicos
            servicos={servicosFiltrados}
            pesquisa={pesquisa}
            setPesquisa={setPesquisa}
            onEditar={(item) => abrirEdicao(item)}
            onExcluir={ehCoordenador ? null : (id) => confirmarExclusao(id)}
            onAlternarStatus={ehCoordenador ? null : (item) => alternarStatusServico(item)}
            onDetalhes={(item) => setServicoSelecionado(item)}
            onNovoServico={ehCoordenador ? null : abrirCadastro}
          />
        )}
      </ScrollView>

      <ModalGerenciarServico
        visible={modalFormulario}
        onClose={() => setModalFormulario(false)}
        servicoEditando={servicoEditando}
        nome={nome}
        setNome={setNome}
        coordenadorId={coordenadorId}
        setCoordenadorId={setCoordenadorId}
        cursoId={cursoId}
        setCursoId={setCursoId}
        descricao={descricao}
        setDescricao={setDescricao}
        dias={dias}
        setDias={setDias}
        linksUteis={linksUteis}
        setLinksUteis={setLinksUteis}
        aviso={aviso}
        setAviso={setAviso}
        usuarioAtual={usuarioAtual}
        coordenadoresDisponiveis={coordenadoresDisponiveis}
        cursosDisponiveis={cursosDisponiveis}
        salvarServico={salvarServico}
      />

      <ModalDetalhesServico
        servico={servicoSelecionado}
        visible={Boolean(servicoSelecionado)}
        onClose={() => setServicoSelecionado(null)}
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