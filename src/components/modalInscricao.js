import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { modalInscricaoStyles as styles } from "../styles/modalInscricaoStyles";
import {
  formatarEntradaCPF,
  formatarEntradaTelefone,
} from "../utils/dataUtils";
import BotaoFechar from "./BotaoFechar";
import CustomIcon from "./CustomIcon";
import FeedbackBox from "./FeedPopup";

export default function ModalFormularioInscricao({
  visible,
  onClose,
  evento,
  inscricaoInicial = null,
  onSalvar,
  salvando = false,
}) {
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [ehAluno, setEhAluno] = useState(true);
  const [matricula, setMatricula] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState({ tipo: "", mensagem: "" });

  useEffect(() => {
    if (!visible) return;

    setFeedback({ tipo: "", mensagem: "" });

    if (inscricaoInicial) {
      setNomeCompleto(inscricaoInicial.nome_completo || "");
      setEhAluno(inscricaoInicial.eh_aluno !== false);
      setMatricula(inscricaoInicial.matricula || "");
      setCpf(formatarEntradaCPF(inscricaoInicial.cpf || ""));
      setTelefone(formatarEntradaTelefone(inscricaoInicial.telefone || ""));
      setEmail(inscricaoInicial.email || "");
    } else {
      setNomeCompleto("");
      setEhAluno(true);
      setMatricula("");
      setCpf("");
      setTelefone("");
      setEmail("");
    }
  }, [visible, inscricaoInicial]);

  async function handleSubmit() {
    if (!evento?.id) {
      setFeedback({ tipo: "erro", mensagem: "Evento não identificado." });
      return;
    }

    if (!nomeCompleto.trim() || !telefone.trim() || !email.trim()) {
      setFeedback({
        tipo: "erro",
        mensagem: "Preencha Nome Completo, Telefone e E-mail.",
      });
      return;
    }

    if (ehAluno && !matricula.trim()) {
      setFeedback({
        tipo: "erro",
        mensagem: "Informe a matrícula do aluno.",
      });
      return;
    }

    const cpfDigitos = cpf.replace(/\D/g, "");
    if (!ehAluno && cpfDigitos.length !== 11) {
      setFeedback({
        tipo: "erro",
        mensagem: "Informe um CPF válido com 11 dígitos.",
      });
      return;
    }

    try {
      await onSalvar({
        eventoId: evento.id,
        nomeCompleto: nomeCompleto.trim(),
        ehAluno,
        matricula: ehAluno ? matricula.trim() : null,
        cpf: !ehAluno ? cpf.trim() : null,
        telefone: telefone.trim(),
        email: email.trim(),
        status: inscricaoInicial ? inscricaoInicial.status !== false : true,
      });
    } catch (error) {
      setFeedback({
        tipo: "erro",
        mensagem: error?.message || "Não foi possível salvar a inscrição.",
      });
    }
  }

  function alternarTipoParticipante() {
    const proximoValor = !ehAluno;
    setEhAluno(proximoValor);
    if (proximoValor) {
      setCpf("");
    } else {
      setMatricula("");
    }
  }

  const nomeEvento = evento?.titulo || "Evento";
  const tituloCabecalho = inscricaoInicial
    ? `Editar Inscrição - ${nomeEvento}`
    : `Nova Inscrição - ${nomeEvento}`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.cabecalho}>
            <Text style={styles.tituloModal} numberOfLines={2}>
              {tituloCabecalho}
            </Text>
            <BotaoFechar onPress={onClose} />
          </View>

          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <FeedbackBox
              tipo={feedback.tipo}
              mensagem={feedback.mensagem}
              onClose={() => setFeedback({ tipo: "", mensagem: "" })}
            />

            <View style={styles.campo}>
              <Text style={styles.label}>Nome completo *</Text>
              <TextInput
                style={styles.input}
                value={nomeCompleto}
                onChangeText={setNomeCompleto}
                placeholder="Ex.: Maria Clara Souza"
                placeholderTextColor="#94A3B8"
                maxLength={120}
              />
            </View>

            <TouchableOpacity
              style={[styles.checkboxCard, ehAluno && styles.checkboxCardAtivo]}
              onPress={alternarTipoParticipante}
              activeOpacity={0.75}
            >
              <View style={styles.checkboxConteudo}>
                <CustomIcon
                  name={ehAluno ? "checkbox" : "square-outline"}
                  size={22}
                  color="#173EA5"
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.checkboxTitulo}>
                    É aluno da instituição?
                  </Text>
                  <Text style={styles.checkboxSubtitulo}>
                    {ehAluno
                      ? "Identificação por matrícula acadêmica"
                      : "Identificação por CPF (participante externo)"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {ehAluno ? (
              <View style={styles.campo}>
                <Text style={styles.label}>Matrícula *</Text>
                <TextInput
                  style={styles.input}
                  value={matricula}
                  onChangeText={(t) => setMatricula(t.replace(/\D/g, ""))}
                  placeholder="Ex.: 2024012345"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  maxLength={30}
                />
              </View>
            ) : (
              <View style={styles.campo}>
                <Text style={styles.label}>CPF *</Text>
                <TextInput
                  style={styles.input}
                  value={cpf}
                  onChangeText={(t) => setCpf(formatarEntradaCPF(t))}
                  placeholder="000.000.000-00"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  maxLength={14}
                />
              </View>
            )}

            <View style={styles.campo}>
              <Text style={styles.label}>Telefone *</Text>
              <TextInput
                style={styles.input}
                value={telefone}
                onChangeText={(t) => setTelefone(formatarEntradaTelefone(t))}
                placeholder="+55 (21) 99999-9999"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                maxLength={19}
              />
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>E-mail *</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Ex.: aluno@exemplo.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                maxLength={120}
              />
            </View>

            <View style={styles.acoesContainer}>
              <TouchableOpacity
                style={[
                  styles.botaoSalvar,
                  salvando && styles.botaoSalvarDesabilitado,
                ]}
                onPress={handleSubmit}
                disabled={salvando}
                activeOpacity={0.85}
              >
                <CustomIcon name="save-outline" size={19} color="#FFFFFF" />
                <Text style={styles.textoBotaoSalvar}>
                  {salvando ? "Salvando..." : "Salvar inscrição"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botaoCancelar}
                onPress={onClose}
                disabled={salvando}
              >
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
