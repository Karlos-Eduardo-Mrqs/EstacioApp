import {KeyboardAvoidingView,Modal,Platform,ScrollView,Text,TextInput,TouchableOpacity,useWindowDimensions,View,} from 'react-native';
import CustomIcon from "../../../components/CustomIcon"; 
import { Picker } from '@react-native-picker/picker';
import { formatarEntradaTelefone } from '../../../utils/dataUtils';

export default function PainelGerenciarUsuarios({
  visible,
  onClose,
  usuarioEditando,
  nome,
  setNome,
  email,
  setEmail,
  senha,
  setSenha,
  perfil,
  setPerfil,
  matricula,
  setMatricula,
  telefone,
  setTelefone,
  cursos = [],
  cursoId,
  setCursoId,
  onCriar,
  styles,
}) {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalFundo}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.modalContainer}>
          {/* CABEÇALHO DO MODAL */}
          <View style={styles.modalCabecalho}>
            <View>
              <Text style={styles.modalTitulo}>
                {usuarioEditando ? "Editar usuario" : "Novo usuario"}
              </Text>
              <Text style={styles.modalSubtitulo}>
                {usuarioEditando ? "Altere os dados necessários." : "Preencha os dados para cadastrar."}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.botaoFechar}
              onPress={onClose}
              accessibilityLabel="Fechar modal"
            >
              <CustomIcon
                name={isDesktop ? "close" : "arrow-back"}
                size={22}
                color="#032551"
              />
            </TouchableOpacity>
          </View>

          {/* CORPO DO FORMULÁRIO */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.label}>Nome *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex.: Coordenador"
              placeholderTextColor="#9ca3af"
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />

            <Text style={styles.label}>E-mail *</Text>
            <TextInput
              style={styles.input}
              placeholder="coordenador@estacio.br"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Telefone *</Text>
            <TextInput
              style={styles.input}
              placeholder="(00) 00000-0000"
              placeholderTextColor="#9ca3af"
              value={telefone}
              onChangeText={(texto) => setTelefone(formatarEntradaTelefone(texto))}
              keyboardType="phone-pad"
              maxLength={20}
            />

            <Text style={styles.label}>Matrícula (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Informe a matrícula, se houver"
              placeholderTextColor="#9ca3af"
              value={matricula}
              onChangeText={setMatricula}
              autoCapitalize="characters"
              autoCorrect={false}
            />

            <Text style={styles.label}>Tipo de perfil *</Text>
            <View style={styles.opcoesPerfil}>
              <TouchableOpacity
                style={[
                  styles.opcaoPerfil,
                  perfil === 'Coordenador' && styles.opcaoSelecionada,
                ]}
                onPress={() => setPerfil('Coordenador')}
              >
                <Text
                  style={[
                    styles.opcaoPerfilTexto,
                    perfil === 'Coordenador' &&
                      styles.opcaoPerfilTextoSelecionado,
                  ]}
                >
                  Coordenador
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.opcaoPerfil,
                  perfil === 'Gerência Acadêmica' &&
                    styles.opcaoSelecionada,
                ]}
                onPress={() => setPerfil('Gerência Acadêmica')}
              >
                <Text
                  style={[
                    styles.opcaoPerfilTexto,
                    perfil === 'Gerência Acadêmica' &&
                      styles.opcaoPerfilTextoSelecionado,
                  ]}
                >
                  Gerência Acadêmica
                </Text>
              </TouchableOpacity>
            </View>

            {/* CURSO: SOMENTE PARA COORDENADORES */}
            {perfil === 'Coordenador' && (
              <>
                <Text style={styles.label}>Curso *</Text>
                <View
                  style={[
                    styles.input,
                    {
                      padding: 0,
                      overflow: 'hidden',
                      justifyContent: 'center',
                    },
                  ]}
                >
                  {Platform.OS === 'web' ? (
                    <select
                      value={cursoId == null ? '' : String(cursoId)}
                      onChange={(event) => {
                        const valor = event.target.value;
                        setCursoId(valor === '' ? null : Number(valor));
                      }}
                      style={{
                        width: '100%',
                        height: 46,
                        padding: '0 12px',
                        border: 'none',
                        outline: 'none',
                        backgroundColor: 'transparent',
                        color: '#334155',
                        fontSize: 14,
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                      }}
                    >
                      <option value="">
                        {cursos.length === 0 ? "A carregar cursos..." : "Selecione um curso"}
                      </option>
                      {cursos.map((item) => (
                        <option key={item.id} value={String(item.id)}>
                          {item.titulo || item.nome}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <Picker
                      selectedValue={cursoId == null ? '' : String(cursoId)}
                      onValueChange={(valor) => {
                        if (valor === '') {
                          setCursoId(null);
                          return;
                        }
                        const selecionado = cursos.find(
                          (item) => String(item.id) === String(valor)
                        );
                        setCursoId(selecionado ? selecionado.id : null);
                      }}
                      style={{ width: '100%' }}
                    >
                      <Picker.Item 
                        label={cursos.length === 0 ? "A carregar cursos..." : "Selecione um curso"} 
                        value="" 
                      />
                      {cursos.map((item) => (
                        <Picker.Item 
                          key={item.id} 
                          label={item.titulo || item.nome} 
                          value={String(item.id)} 
                        />
                      ))}
                    </Picker>
                  )}
                </View>
              </>
            )}

            <Text style={styles.label}>
              {usuarioEditando ? "Nova senha (deixe em branco para manter)" : "Senha temporária *"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={usuarioEditando ? "Preencha apenas se quiser alterar" : "Informe uma senha temporária"}
              placeholderTextColor="#9ca3af"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="off"
            />

            <TouchableOpacity
              style={styles.botaoCriar}
              onPress={onCriar}
              activeOpacity={0.8}
            >
              <Text style={styles.textoCriar}>
                {usuarioEditando ? "Salvar alterações" : "+ Criar usuarios"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoCancelar}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}