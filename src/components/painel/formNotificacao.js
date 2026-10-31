import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { notificacaoFormStyles as styles } from '@/styles/painel/notificacaoGlobalTabStyles';

export default function FormularioNotificacao({ cursos, onEnviar, carregando }) {
  const [cursoSelecionado, setCursoSelecionado] = useState(null); // null = Global / Todos
  const [modalCursos, setModalCursos] = useState(false);
  const [tituloAviso, setTituloAviso] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmeter = () => {
    onEnviar({
      titulo: tituloAviso,
      mensagem: mensagem,
      cursoId: cursoSelecionado ? cursoSelecionado.id : null,
      limparCampos: () => {
        setTituloAviso('');
        setMensagem('');
        setCursoSelecionado(null);
      }
    });
  };

  const nomeCursoAtual = cursoSelecionado ? cursoSelecionado.titulo : '🌍 Todos os Cursos (Global)';

  return (
    <View style={styles.painel}>
      <View style={styles.linhaAmarela}>
            <Text style={styles.tituloPagina}>Notificação Global</Text>
            <Text style={styles.subtitulo}>Envie um comunicado oficial para o mural dos alunos.</Text>
            <Text style={styles.textoAuxiliar}>O aviso ficará ativo por 24 horas no mural acadêmico.</Text>
      </View>

      <View style={styles.formularioNotificacao}>
        <Text style={styles.label}>Curso destinatário</Text>

        <TouchableOpacity style={styles.seletorCurso} onPress={() => setModalCursos(true)}>
          <Text style={styles.textoCurso} numberOfLines={1}>{nomeCursoAtual}</Text>
          <Ionicons name="chevron-down" size={20} color="#64748B" />
        </TouchableOpacity>

        <View style={styles.campo}>
          <Text style={styles.label}>Título da notificação</Text>
          <TextInput
            style={styles.input}
            value={tituloAviso}
            onChangeText={setTituloAviso}
            placeholder="Ex.: Manutenção nos servidores"
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
            placeholder="Digite o comunicado oficial..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            maxLength={1000}
          />
        </View>

        <Text style={styles.contadorCaracteres}>{mensagem.length}/1000 caracteres</Text>

        <TouchableOpacity 
          style={[styles.botaoEnviar, carregando && { opacity: 0.7 }]} 
          onPress={handleSubmeter}
          disabled={carregando}
        >
          <Ionicons name="send-outline" size={18} color="#FFFFFF" />
          <Text style={styles.textoBotaoEnviar}>{carregando ? 'A enviar...' : 'Enviar notificação global'}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de seleção de cursos */}
      <Modal visible={modalCursos} transparent animationType="fade" onRequestClose={() => setModalCursos(false)}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.tituloModal}>Selecionar destinatário</Text>

            <TouchableOpacity
              style={[styles.opcaoCurso, !cursoSelecionado && styles.opcaoSelecionada]}
              onPress={() => {
                setCursoSelecionado(null);
                setModalCursos(false);
              }}
            >
              <Text style={[styles.textoCurso, !cursoSelecionado && styles.textoCursoSelecionado]}>
                🌍 Todos os Cursos (Global)
              </Text>
              {!cursoSelecionado && <Ionicons name="checkmark-circle" size={21} color="#173EA5" />}
            </TouchableOpacity>

            {cursos.map((c) => {
              const selecionado = cursoSelecionado?.id === c.id;
              return (
                <TouchableOpacity
                  key={c.id}
                  style={[styles.opcaoCurso, selecionado && styles.opcaoSelecionada]}
                  onPress={() => {
                    setCursoSelecionado(c);
                    setModalCursos(false);
                  }}
                >
                  <Text style={[styles.textoCurso, selecionado && styles.textoCursoSelecionado]}>{c.titulo}</Text>
                  {selecionado && <Ionicons name="checkmark-circle" size={21} color="#173EA5" />}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity style={styles.botaoCancelar} onPress={() => setModalCursos(false)}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
