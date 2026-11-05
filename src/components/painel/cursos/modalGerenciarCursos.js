import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Platform, Linking } from 'react-native';
import CustomIcon from '../../CustomIcon';
import { painelEventosStyles as styles } from "../../../styles/painel/painelEventosStyles";
import FeedbackBox from '../../FeedPopup';
import ModalSelecionarIcone from './modalSelecionarIcone';

function Campo({ label, style, ...props }) {
  return (
    <View style={styles.campo}>
      <Text style={styles.label}>{label}</Text>
      <TextInput {...props} style={[styles.input, style]} placeholderTextColor="#94A3B8" />
    </View>
  );
}

// Adicione modalidade e setModalidade nos parâmetros da função ModalGerenciarCurso:
export default function ModalGerenciarCurso({
  visible,
  onClose,
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
  modalidade,     // 👈 Novo parâmetro
  setModalidade,  // 👈 Novo parâmetro
  feedback,
  salvarCurso,
}) {
  const [modalIconesVisivel, setModalIconesVisivel] = useState(false);

  const buscarLinkCorretoNaWeb = () => {
    if (!nome.trim()) {
      alert("Digite o nome do curso primeiro para pesquisar.");
      return;
    }
    const query = encodeURIComponent(`Estacio ${nome} curso`);
    Linking.openURL(`https://www.google.com/search?q=${query}`);
  };


  const TIPOS_CURSO = ['Presencial', 'Online/EAD', 'SemiPresencial'];
  const MODALIDADES_CURSO = ['Graduação', 'Mestrado', 'Doutorado', 'Técnico', 'Licenciatura'];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.modalCabecalho}>
            <Text style={styles.tituloModal}>{cursoEditando ? "Editar curso" : "Novo curso"}</Text>
            <TouchableOpacity onPress={onClose}>
              <CustomIcon name={Platform.OS === 'web' ? 'close' : 'arrow-back'} size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <FeedbackBox tipo={feedback.tipo} mensagem={feedback.mensagem} />

            <Campo
              label="Nome / Título do Curso *"
              value={nome}
              onChangeText={setNome}
              placeholder="Ex.: Nutrição ou Ciência da Computação"
              maxLength={100}
            />

            {/* Seletor de Tipo de Curso (Enum: Presencial, Online/EAD, SemiPresencial) */}
            <View style={styles.campo}>
              <Text style={styles.label}>Tipo de Ensino *</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {TIPOS_CURSO.map((item) => {
                  const selecionado = tipo === item;
                  return (
                    <TouchableOpacity
                      key={item}
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        paddingHorizontal: 4,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: selecionado ? '#173EA5' : '#CBD5E1',
                        backgroundColor: selecionado ? '#EFF6FF' : '#F8FAFC',
                        alignItems: 'center',
                      }}
                      onPress={() => setTipo(item)}
                    >
                      <Text style={{ fontSize: 11, fontWeight: 'bold', color: selecionado ? '#173EA5' : '#64748B', textAlign: 'center' }}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Seletor de Modalidade (Enum: Graduação, Mestrado, Doutorado, Técnico, Licenciatura) */}
            <View style={styles.campo}>
              <Text style={styles.label}>Modalidade Acadêmica *</Text>
              <ScrollView horizontal showsHorizontalIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {MODALIDADES_CURSO.map((item) => {
                  const selecionado = modalidade === item;
                  return (
                    <TouchableOpacity
                      key={item}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: selecionado ? '#173EA5' : '#CBD5E1',
                        backgroundColor: selecionado ? '#EFF6FF' : '#F8FAFC',
                        alignItems: 'center',
                      }}
                      onPress={() => setModalidade(item)}
                    >
                      <Text style={{ fontSize: 12, fontWeight: 'bold', color: selecionado ? '#173EA5' : '#64748B', textAlign: 'center' }}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Campo de Link Livre com Botões de Ação */}
            <View style={styles.campo}>
              <Text style={styles.label}>Link do Curso (URL)</Text>
              <TextInput
                style={[styles.input, { marginBottom: 8 }]}
                value={link}
                onChangeText={setLink}
                placeholder="Cole o link aqui (https://...)"
                placeholderTextColor="#94A3B8"
                maxLength={300}
                autoCapitalize="none"
              />

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FEF2F2',
                    borderWidth: 1,
                    borderColor: '#FCA5A5',
                    borderRadius: 6,
                    paddingVertical: 8,
                    gap: 6,
                  }}
                  onPress={buscarLinkCorretoNaWeb}
                  activeOpacity={0.8}
                >
                  <CustomIcon name="search-outline" size={16} color="#DC2626" />
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#DC2626' }}>Pesquisar no Google</Text>
                </TouchableOpacity>

              </View>
            </View>

            {/* Seletor de Ícones */}
            <View style={styles.campo}>
              <Text style={styles.label}>Ícone do Curso</Text>
              <TouchableOpacity 
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, backgroundColor: '#F8FAFC' }}
                onPress={() => setModalIconesVisivel(true)}
              >
                <CustomIcon name={icone || 'book-outline'} size={24} color="#173EA5" />
                <Text style={{ fontSize: 14, color: '#0F172A', flex: 1 }} numberOfLines={1}>
                  {icone || 'Selecionar ícone...'}
                </Text>
                <CustomIcon name="chevron-forward" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <Campo
              label="Descrição / Detalhes"
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Detalhes ou ementa resumida..."
              multiline
              style={styles.inputDescricao}
              textAlignVertical="top"
              maxLength={500}
            />

            <TouchableOpacity style={styles.botaoEnviar} onPress={salvarCurso}>
              <CustomIcon name="save-outline" size={19} color="#FFFFFF" />
              <Text style={styles.textoBotaoEnviar}>Salvar curso</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoCancelar} onPress={onClose}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      <ModalSelecionarIcone
        visible={modalIconesVisivel}
        onClose={() => setModalIconesVisivel(false)}
        onSelect={(novoIcone) => setIcone(novoIcone)}
      />
    </Modal>
  );
}