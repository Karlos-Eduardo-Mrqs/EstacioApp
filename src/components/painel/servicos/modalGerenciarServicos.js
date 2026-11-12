import { useState } from "react";
import {
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { painelServicosstyles as styles } from "../../../styles/painel/painelServicosStyles";
import BotaoFechar from "../../BotaoFechar";

export default function ModalGerenciarServico({
  visible,
  onClose,
  servicoEditando,
  nome,
  setNome,
  usuarioAtual,
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
  coordenadorId,
  coordenadoresDisponiveis = [],
  cursosDisponiveis = [],
  salvarServico,
}) {
  const [nomeLinkTemp, setNomeLinkTemp] = useState("");
  const [urlLinkTemp, setUrlLinkTemp] = useState("");

  // 🔍 Verifica se o usuário logado é Coordenador
  const perfilNorm = usuarioAtual?.perfil ? usuarioAtual.perfil.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : "";
  const ehCoordenador = perfilNorm.includes("coordenador");

  // Seleciona o coordenador e preenche o curso automaticamente (mantendo editável)
  const handleSelecaoCoordenador = (idSelecionado) => {
    setCoordenadorId(idSelecionado);
    if (!idSelecionado) return;

    const coordEncontrado = coordenadoresDisponiveis.find(
      (c) => String(c.id) === String(idSelecionado),
    );

    if (coordEncontrado) {
      const idDoCursoAssociado =
        coordEncontrado.cursoId || coordEncontrado.curso_id;
      if (idDoCursoAssociado) {
        setCursoId(String(idDoCursoAssociado));
      } else if (coordEncontrado.curso) {
        const cursoCorrespondente = cursosDisponiveis.find(
          (c) => c.nome?.toLowerCase() === coordEncontrado.curso?.toLowerCase(),
        );
        if (cursoCorrespondente) {
          setCursoId(String(cursoCorrespondente.id));
        }
      }
    }
  };

  const adicionarLinkRapido = () => {
    if (!nomeLinkTemp.trim() || !urlLinkTemp.trim()) return;

    const novoItem = `${nomeLinkTemp.trim()}: ${urlLinkTemp.trim()};`;
    const textoAtualizado = linksUteis
      ? `${linksUteis.trim()}\n${novoItem}`
      : novoItem;

    setLinksUteis(textoAtualizado);
    setNomeLinkTemp("");
    setUrlLinkTemp("");
  };

  // 🧹 Função opcional para limpar formatações estranhas ao colar do Docs
  const limparTextoColado = (texto) => {
    // Remove caracteres de controle indesejados mantendo quebras de linha normais
    return texto.replace(/[\u200B-\u200D\uFEFF]/g, "");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={<BotaoFechar onPress={() => onClose()} />}
    >
      <View style={styles.modalFundo}>
        <View style={styles.modalFormulario}>
          <View style={styles.modalHeaderFormulario}>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTitulo}>
                {servicoEditando ? "Editar serviço" : "Novo serviço"}
              </Text>
              <Text style={styles.modalSubtitulo}>
                Preencha as informações do serviço institucional.
              </Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <BotaoFechar onPress={onClose} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.label}>Nome do serviço *</Text>
            <TextInput
              style={styles.inputFormulario}
              placeholder="Ex: Núcleo de Apoio ao Estudante"
              placeholderTextColor="#999"
              value={nome}
              onChangeText={setNome}
            />

            {/* 👤 COORDENADOR RESPONSÁVEL (Aparece apenas se NÃO for coordenador) */}
            {!ehCoordenador && (
              <>
                <Text style={styles.label}>Coordenador responsável *</Text>
                <View style={styles.seletorWrapperWeb}>
                  {Platform.OS === "web" ? (
                    <select
                      value={coordenadorId}
                      onChange={(e) => handleSelecaoCoordenador(e.target.value)}
                      style={styles.selectEstilizadoWeb}
                    >
                      <option value="">Selecione um coordenador</option>
                      {coordenadoresDisponiveis.map((coord) => (
                        <option key={coord.id} value={coord.id}>
                          {coord.nome}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <ScrollView style={styles.listaCoordenadores} nestedScrollEnabled>
                      {coordenadoresDisponiveis.map((coord) => (
                        <TouchableOpacity
                          key={coord.id}
                          style={[
                            styles.opcaoCoordenador,
                            {
                              backgroundColor:
                                String(coordenadorId) === String(coord.id)
                                  ? "#EFF6FF"
                                  : "transparent",
                            },
                          ]}
                          onPress={() => handleSelecaoCoordenador(String(coord.id))}
                        >
                          <Text style={styles.opcaoCoordenadorTexto}>
                            {coord.nome}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </View>
              </>
            )}

            {/* 🏫 CURSO VINCULADO (Aparece apenas se NÃO for coordenador) */}
            {!ehCoordenador && (
              <>
                <Text style={styles.label}>Curso vinculado</Text>
                <View style={styles.seletorWrapperWeb}>
                  {Platform.OS === "web" ? (
                    <select
                      value={cursoId}
                      onChange={(e) => setCursoId(e.target.value)}
                      style={styles.selectEstilizadoWeb}
                    >
                      <option value="">Geral / Todos</option>
                      {cursosDisponiveis.map((curso) => (
                        <option key={curso.id} value={curso.id}>
                          {curso.nome}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <ScrollView style={styles.listaCoordenadores} nestedScrollEnabled>
                      <TouchableOpacity
                        style={[
                          styles.opcaoCoordenador,
                          { backgroundColor: !cursoId ? "#EFF6FF" : "transparent" },
                        ]}
                        onPress={() => setCursoId("")}
                      >
                        <Text style={styles.opcaoCoordenadorTexto}>
                          Geral / Todos
                        </Text>
                      </TouchableOpacity>
                      {cursosDisponiveis.map((curso) => (
                        <TouchableOpacity
                          key={curso.id}
                          style={[
                            styles.opcaoCoordenador,
                            {
                              backgroundColor:
                                String(cursoId) === String(curso.id)
                                  ? "#EFF6FF"
                                  : "transparent",
                            },
                          ]}
                          onPress={() => setCursoId(String(curso.id))}
                        >
                          <Text style={styles.opcaoCoordenadorTexto}>
                            {curso.nome}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </View>
              </>
            )}
            
            {/* DESCRIÇÃO COM TRATAMENTO DE TEXTO */}
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={[styles.inputFormulario, styles.inputMultilinha]}
              placeholder="Descreva o serviço..."
              placeholderTextColor="#999"
              value={descricao}
              onChangeText={(t) => setDescricao(limparTextoColado(t))}
              multiline
            />

            <Text style={styles.label}>Dias e horários de atendimento</Text>
            <TextInput
              style={[styles.inputFormulario, styles.inputMultilinha]}
              placeholder="Ex: Segunda a sexta, das 8h às 17h"
              placeholderTextColor="#999"
              value={dias}
              onChangeText={(t) => setDias(limparTextoColado(t))}
              multiline
            />

            {/* LINKS ÚTEIS */}
            <Text style={styles.label}>Links úteis</Text>
            <View style={styles.linksRowContainer}>
              <TextInput
                style={styles.inputLinkNome}
                placeholder="Nome (ex: Manual)"
                placeholderTextColor="#999"
                value={nomeLinkTemp}
                onChangeText={setNomeLinkTemp}
              />
              <TextInput
                style={styles.inputLinkUrl}
                placeholder="Link (https://...)"
                placeholderTextColor="#999"
                value={urlLinkTemp}
                onChangeText={setUrlLinkTemp}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.botaoAddLinkModerno}
                onPress={adicionarLinkRapido}
              >
                <Text style={styles.botaoAddLinkTextoModerno}>
                  + Adicionar Link
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.inputFormulario, styles.inputMultilinha]}
              placeholder={
                "Formulário de Inscrição: https://...;\nManual do Aluno: https://...;"
              }
              placeholderTextColor="#999"
              value={linksUteis}
              onChangeText={setLinksUteis}
              multiline
              autoCapitalize="none"
            />

            <Text style={styles.label}>Avisos</Text>
            <TextInput
              style={[styles.inputFormulario, styles.inputMultilinha]}
              placeholder="Informações ou avisos do serviço..."
              placeholderTextColor="#999"
              value={aviso}
              onChangeText={(t) => setAviso(limparTextoColado(t))}
              multiline
            />

            <TouchableOpacity
              style={styles.botaoSalvar}
              onPress={salvarServico}
            >
              <Text style={styles.botaoSalvarTexto}>
                {servicoEditando ? "Salvar alterações" : "+ Cadastrar serviço"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoCancelar} onPress={onClose}>
              <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
