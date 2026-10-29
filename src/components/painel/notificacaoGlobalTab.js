import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CURSOS = [
  'Engenharia de Software',
  'Administração',
  'Sistemas de Informação',
];

export default function NotificacaoGlobalTab() {
  const [curso, setCurso] = useState(CURSOS[0]);
  const [modalCursos, setModalCursos] = useState(false);
  const [tituloAviso, setTituloAviso] = useState('');
  const [mensagem, setMensagem] = useState('');

  const enviarNotificacao = () => {
    if (!tituloAviso.trim() || !mensagem.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha o título e a mensagem.');
      return;
    }

    Alert.alert(
      'Confirmar envio',
      `Destinatários: ${curso}\n\n${tituloAviso}\n\n${mensagem}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            Alert.alert('Enviado!', 'As notificações globais foram enviadas com sucesso.');
            setTituloAviso('');
            setMensagem('');
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.tituloPagina}>Notificação Global</Text>
      <Text style={styles.subtitulo}>Envie um comunicado oficial para os utilizadores do curso selecionado.</Text>

      <View style={styles.painel}>
        <View style={styles.linhaAmarela}>
          <Text style={styles.tituloSecao}>Nova Notificação</Text>
          <Text style={styles.textoAuxiliar}>Preencha os campos abaixo para disparar o aviso.</Text>
        </View>

        <View style={styles.formularioNotificacao}>
          <Text style={styles.label}>Curso destinatário</Text>

          <TouchableOpacity style={styles.seletorCurso} onPress={() => setModalCursos(true)}>
            <Text style={styles.textoCurso} numberOfLines={1}>{curso}</Text>
            <Ionicons name="chevron-down" size={20} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.campo}>
            <Text style={styles.label}>Título da notificação</Text>
            <TextInput
              style={styles.input}
              value={tituloAviso}
              onChangeText={setTituloAviso}
              placeholder="Ex.: Comunicado importante"
              placeholderTextColor="#94A3B8"
              maxLength={100}
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.label}>Mensagem</Text>
            <TextInput
              style={[styles.input, styles.inputMensagem]}
              value={mensagem}
              onChangeText={setMensagem}
              placeholder="Digite o comunicado..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              maxLength={1000}
            />
          </View>

          <Text style={styles.contadorCaracteres}>{mensagem.length}/1000 caracteres</Text>

          <TouchableOpacity style={styles.botaoEnviar} onPress={enviarNotificacao}>
            <Ionicons name="send-outline" size={18} color="#FFFFFF" />
            <Text style={styles.textoBotaoEnviar}>Enviar notificação global</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de selecção de cursos */}
      <Modal visible={modalCursos} transparent animationType="fade" onRequestClose={() => setModalCursos(false)}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.tituloModal}>Selecionar curso</Text>

            {CURSOS.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.opcaoCurso, curso === item && styles.opcaoSelecionada]}
                onPress={() => {
                  setCurso(item);
                  setModalCursos(false);
                }}
              >
                <Text style={[styles.textoCurso, curso === item && styles.textoCursoSelecionado]}>{item}</Text>
                {curso === item && <Ionicons name="checkmark-circle" size={21} color="#173EA5" />}
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.botaoCancelar} onPress={() => setModalCursos(false)}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingBottom: 40 },
  tituloPagina: { color: '#172554', fontSize: 23, fontWeight: '800', marginBottom: 5 },
  subtitulo: { color: '#64748B', fontSize: 13, lineHeight: 19, marginBottom: 16 },
  painel: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE3ED', borderRadius: 9, overflow: 'hidden' },
  linhaAmarela: { borderLeftWidth: 4, borderLeftColor: '#F2C500', padding: 13, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  tituloSecao: { color: '#172554', fontSize: 15, fontWeight: '800' },
  textoAuxiliar: { color: '#64748B', fontSize: 11, marginTop: 4 },
  formularioNotificacao: { padding: 16 },
  campo: { marginBottom: 13 },
  label: { color: '#172554', fontSize: 12, fontWeight: '700', marginBottom: 7 },
  input: { minHeight: 43, borderWidth: 1, borderColor: '#D6DFEA', borderRadius: 8, paddingHorizontal: 11, paddingVertical: 10, color: '#172554', fontSize: 13, backgroundColor: '#FFFFFF' },
  inputMensagem: { minHeight: 120 },
  seletorCurso: { minHeight: 44, borderWidth: 1, borderColor: '#D6DFEA', borderRadius: 8, paddingHorizontal: 11, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15, backgroundColor: '#FFFFFF' },
  textoCurso: { color: '#172554', fontSize: 13 },
  contadorCaracteres: { textAlign: 'right', color: '#64748B', fontSize: 10, marginBottom: 12 },
  botaoEnviar: { backgroundColor: '#173EA5', borderLeftWidth: 4, borderLeftColor: '#F2C500', borderRadius: 8, padding: 13, flexDirection: 'row', gap: 9, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  textoBotaoEnviar: { color: '#FFFFFF', fontSize: 13, fontWeight: '800', textAlign: 'center' },
  overlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.48)', justifyContent: 'center', padding: 16 },
  modal: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 17, borderTopWidth: 4, borderTopColor: '#F2C500' },
  tituloModal: { color: '#172554', fontSize: 19, fontWeight: '800', marginBottom: 15 },
  opcaoCurso: { padding: 13, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, marginBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  opcaoSelecionada: { backgroundColor: '#EEF2FF', borderColor: '#173EA5' },
  textoCursoSelecionado: { color: '#173EA5', fontWeight: '700' },
  botaoCancelar: { alignItems: 'center', padding: 12, marginTop: 6 },
  textoCancelar: { color: '#64748B', fontSize: 13, fontWeight: '700' },
});