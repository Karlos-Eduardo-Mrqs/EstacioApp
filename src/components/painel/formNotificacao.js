import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { notificacaoFormStyles as styles } from '@/styles/painel/notificacaoGlobalTabStyles';
import CustomIcon from '../CustomIcon';

export default function FormularioNotificacao({ cursos, eventos = [], onEnviar, onVisualizar, carregando }) {
  const [tipoDestino, setTipoDestino] = useState('todos');
  const [cursoSelecionado, setCursoSelecionado] = useState(null);
  const [eventoSelecionado, setEventoSelecionado] = useState(null);

  const [modalCursos, setModalCursos] = useState(false);
  const [modalEventos, setModalEventos] = useState(false);
  
  const [tituloAviso, setTituloAviso] = useState('');
  const [mensagem, setMensagem] = useState('');

  // 📄 Estados para controlar a paginação (carregar de 20 em 20)
  const ITENS_POR_PAGINA = 20;
  const [limiteEventos, setLimiteEventos] = useState(ITENS_POR_PAGINA);

  const handleSubmeter = () => {
    onEnviar({
      titulo: tituloAviso,
      mensagem: mensagem,
      tipoDestino: tipoDestino,
      cursoId: tipoDestino === 'curso' && cursoSelecionado ? cursoSelecionado.id : null,
      eventoId: tipoDestino === 'evento' && eventoSelecionado ? eventoSelecionado.id : null,
      limparCampos: () => {
        setTituloAviso('');
        setMensagem('');
        setTipoDestino('todos');
        setCursoSelecionado(null);
        setEventoSelecionado(null);
        setLimiteEventos(ITENS_POR_PAGINA);
      }
    });
  };

  const nomeCursoAtual = cursoSelecionado ? cursoSelecionado.titulo : 'Selecione um curso...';
  const nomeEventoAtual = eventoSelecionado ? eventoSelecionado.titulo : 'Selecione um evento...';

  // Fia os eventos cortados pelo limite atual da página
  const eventosPaginados = eventos.slice(0, limiteEventos);

  const carregarMaisEventos = () => {
    if (limiteEventos < eventos.length) {
      setLimiteEventos((prev) => prev + ITENS_POR_PAGINA);
    }
  };

  return (
    <View style={styles.painel}>
      <View style={styles.linhaAmarela}>
            <Text style={styles.tituloPagina}>Notificação Global</Text>
            <Text style={styles.subtitulo}>Envie um comunicado oficial para o mural dos alunos.</Text>
            <Text style={styles.textoAuxiliar}>O aviso ficará ativo por 24 horas no mural acadêmico.</Text>
      </View>

      <View style={styles.formularioNotificacao}>
        <Text style={styles.label}>Público-alvo (Destinatário)</Text>

        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          <TouchableOpacity 
            style={[styles.radioBtn, tipoDestino === 'todos' && styles.radioBtnAtivo]}
            onPress={() => { setTipoDestino('todos'); setCursoSelecionado(null); setEventoSelecionado(null); }}
          >
            <CustomIcon name={tipoDestino === 'todos' ? "radio-button-on" : "radio-button-off"} size={18} color={tipoDestino === 'todos' ? "#173EA5" : "#64748B"} />
            <Text style={[styles.radioText, tipoDestino === 'todos' && styles.radioTextAtivo]}>Todos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.radioBtn, tipoDestino === 'curso' && styles.radioBtnAtivo]}
            onPress={() => { setTipoDestino('curso'); setEventoSelecionado(null); }}
          >
            <CustomIcon name={tipoDestino === 'curso' ? "radio-button-on" : "radio-button-off"} size={18} color={tipoDestino === 'curso' ? "#173EA5" : "#64748B"} />
            <Text style={[styles.radioText, tipoDestino === 'curso' && tipoDestino === 'curso' && styles.radioTextAtivo]}>Curso</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.radioBtn, tipoDestino === 'evento' && styles.radioBtnAtivo]}
            onPress={() => { setTipoDestino('evento'); setCursoSelecionado(null); }}
          >
            <CustomIcon name={tipoDestino === 'evento' ? "radio-button-on" : "radio-button-off"} size={18} color={tipoDestino === 'evento' ? "#173EA5" : "#64748B"} />
            <Text style={[styles.radioText, tipoDestino === 'evento' && styles.radioTextAtivo]}>Evento</Text>
          </TouchableOpacity>
        </View>

        {tipoDestino === 'curso' && (
          <View style={styles.campo}>
            <Text style={styles.label}>Selecione o Curso</Text>
            <TouchableOpacity style={styles.seletorCurso} onPress={() => setModalCursos(true)}>
              <Text style={styles.textoCurso} numberOfLines={1}>{nomeCursoAtual}</Text>
              <CustomIcon name="chevron-down" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
        )}

        {tipoDestino === 'evento' && (
          <View style={styles.campo}>
            <Text style={styles.label}>Selecione o Evento</Text>
            <TouchableOpacity style={styles.seletorCurso} onPress={() => setModalEventos(true)}>
              <Text style={styles.textoCurso} numberOfLines={1}>{nomeEventoAtual}</Text>
              <CustomIcon name="chevron-down" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>
        )}

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
          <CustomIcon name="send-outline" size={18} color="#FFFFFF" />
          <Text style={styles.textoBotaoEnviar}>{carregando ? 'A enviar...' : 'Enviar notificação'}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.botaoVisualizar} 
          onPress={onVisualizar}
        >
          <CustomIcon name="eye-outline" size={18} color="#032551" />
          <Text style={styles.textoBotaoVisualizar}>Ver Avisos Enviados</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de Cursos */}
      <Modal visible={modalCursos} transparent animationType="fade" onRequestClose={() => setModalCursos(false)}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.tituloModal}>Selecionar Curso</Text>
            <FlatList
              data={cursos}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                const selecionado = cursoSelecionado?.id === item.id;
                return (
                  <TouchableOpacity
                    style={[styles.opcaoCurso, selecionado && styles.opcaoSelecionada]}
                    onPress={() => { setCursoSelecionado(item); setModalCursos(false); }}
                  >
                    <Text style={[styles.textoCurso, selecionado && styles.textoCursoSelecionado]}>{item.titulo}</Text>
                    {selecionado && <CustomIcon name="checkmark-circle" size={21} color="#173EA5" />}
                  </TouchableOpacity>
                );
              }}
              style={{ maxHeight: 300 }}
            />
            <TouchableOpacity style={styles.botaoCancelar} onPress={() => setModalCursos(false)}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 🚀 Modal de Eventos com paginação via FlatList (Scroll infinito de 20 em 20) */}
      <Modal visible={modalEventos} transparent animationType="fade" onRequestClose={() => setModalEventos(false)}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.tituloModal}>Selecionar Evento </Text>
            
            <FlatList
              data={eventosPaginados}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => {
                const selecionado = eventoSelecionado?.id === item.id;
                return (
                  <TouchableOpacity
                    style={[styles.opcaoCurso, selecionado && styles.opcaoSelecionada]}
                    onPress={() => { setEventoSelecionado(item); setModalEventos(false); }}
                  >
                    <Text style={[styles.textoCurso, selecionado && styles.textoCursoSelecionado]} numberOfLines={1}>
                      {item.titulo}
                    </Text>
                    {selecionado && <CustomIcon name="checkmark-circle-outline" size={21} color="#173EA5" />}
                  </TouchableOpacity>
                );
              }}
              onEndReached={carregarMaisEventos}
              onEndReachedThreshold={0.5} // Dispara quando faltar 50% para o fim da lista atual
              style={{ maxHeight: 300 }}
              ListFooterComponent={
                limiteEventos < eventos.length ? (
                  <Text style={{ textAlign: 'center', padding: 10, color: '#64748B', fontSize: 12 }}>
                    A carregar mais eventos...
                  </Text>
                ) : null
              }
            />

            <TouchableOpacity style={styles.botaoCancelar} onPress={() => setModalEventos(false)}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}