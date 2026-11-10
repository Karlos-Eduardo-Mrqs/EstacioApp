import React from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Text, View } from 'react-native';
import { painelServicosstyles as styles } from "../../../styles/painel/painelServicosStyles";
import { useGerenciarServicos } from "../../../hooks/useGerenciarServicos";
import GerenciarListaServicos from './gerenciarListaServicos';
import ModalGerenciarServico from './modalGerenciarServicos';
import ToastPopup from '../../Popup';
import ConfirmPopup from '../../ConfirmPopup';
import CustomIcon from '../../CustomIcon';

export default function PainelServicos() {
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
  } = useGerenciarServicos();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0A2540" barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Serviços Institucionais</Text>
          <Text style={styles.subtitulo}>Gerencie os serviços e seus respectivos coordenadores.</Text>
        </View>

        <View style={styles.indicadores}>
          <View style={[styles.indicadorCard, { flex: 1 }]}>
            <CustomIcon name="grid-outline" size={23} color="#2451A4" />
            <Text style={styles.indicadorNumero}>{quantidadeServicos}</Text>
            <Text style={styles.indicadorLegenda}>Total de serviços</Text>
          </View>
          <View style={[styles.indicadorCard, { flex: 1 }]}>
            <CustomIcon name="people-outline" size={23} color="#2451A4" />
            <Text style={styles.indicadorNumero}>{quantidadeCoordenadores}</Text>
            <Text style={styles.indicadorLegenda}>Coordenadores vinculados</Text>
          </View>
        </View>

        {carregando ? (
          <ActivityIndicator size="large" color="#2451A4" style={{ marginVertical: 20 }} />
        ) : (
          <GerenciarListaServicos
            servicos={servicosFiltrados}
            pesquisa={pesquisa}
            setPesquisa={setPesquisa}
            onEditar={(item) => abrirEdicao(item)}
            onExcluir={(id) => confirmarExclusao(id)}
            onDetalhes={(item) => setServicoSelecionado(item)}
            onNovoServico={abrirCadastro}
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
        coordenadoresDisponiveis={coordenadoresDisponiveis}
        cursosDisponiveis={cursosDisponiveis}
        salvarServico={salvarServico}
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