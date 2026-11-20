import {KeyboardAvoidingView,Modal,Platform,ScrollView,Text,TextInput,TouchableOpacity,useWindowDimensions,View,} from 'react-native';
import CustomIcon from '../../../components/CustomIcon';
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
  cursosSelecionados = [],
  setCursosSelecionados,
  alternarSelecaoCurso,
  onCriar,
  styles,
}) {
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;

  const handleToggleCurso = (idCurso) => {
    const numId = Number(idCurso);
    if (Number.isNaN(numId)) return;

    if (typeof alternarSelecaoCurso === 'function') {
      alternarSelecaoCurso(numId);
      return;
    }

    if (typeof setCursosSelecionados === 'function') {
      setCursosSelecionados((prev = []) => {
        const base = Array.isArray(prev) ? prev.map((id) => Number(id)) : [];
        const idNum = Number(item.id);
        const selecionado = selecionadosNormalizados.includes(idNum);
        return base.includes(numId)
          ? base.filter((itemId) => itemId !== numId)
          : [...base, numId];
      });
    }
  };

  const selecionadosNormalizados = Array.isArray(cursosSelecionados)
    ? cursosSelecionados.map((id) => Number(id))
    : [];

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
                {usuarioEditando ? 'Editar usuario' : 'Novo usuario'}
              </Text>
              <Text style={styles.modalSubtitulo}>
                {usuarioEditando
                  ? 'Altere os dados necessários.'
                  : 'Preencha os dados para cadastrar.'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.botaoFechar}
              onPress={onClose}
              accessibilityLabel="Fechar modal"
            >
              <CustomIcon
                name={isDesktop ? 'close' : 'arrow-back'}
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
                  perfil === 'Gerência Acadêmica' && styles.opcaoSelecionada,
                ]}
                onPress={() => {
                  setPerfil('Gerência Acadêmica');
                  if (setCursosSelecionados) setCursosSelecionados([]);
                }}
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

            {/* CURSOS (MÚLTIPLOS): SOMENTE PARA COORDENADORES */}
            {perfil === 'Coordenador' && (
              <View style={{ marginBottom: 12 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 6,
                  }}
                >
                  <Text style={[styles.label, { marginBottom: 0 }]}> Cursos orientados * ({selecionadosNormalizados.length} selecionado(s)) </Text>

                  {cursosSelecionados.length > 0 && setCursosSelecionados && (
                    <TouchableOpacity onPress={() => setCursosSelecionados([])}>
                      <Text style={{ fontSize: 12, color: '#DC2626', fontWeight: '600' }}>
                        Limpar
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#CBD5E1',
                    borderRadius: 8,
                    backgroundColor: '#FFFFFF',
                    maxHeight: 190,
                    padding: 6,
                  }}
                >
                  {cursos.length === 0 ? (
                    <Text style={{ fontSize: 12.5, color: '#64748B', padding: 10 }}>
                      Carregando cursos...
                    </Text>
                  ) : (
                    <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                      {cursos.map((item) => {
                        const idNum = Number(item.id);
                        const selecionado = cursosSelecionados.includes(idNum);
                        const tituloCurso = item.titulo || item.nome;

                        return (
                          <TouchableOpacity
                            key={item.id}
                            onPress={() => handleToggleCurso(idNum)}
                            activeOpacity={0.75}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              paddingVertical: 9,
                              paddingHorizontal: 10,
                              borderRadius: 6,
                              marginBottom: 4,
                              backgroundColor: selecionado ? '#EEF2FF' : '#F8FAFC',
                              borderWidth: 1,
                              borderColor: selecionado ? '#818CF8' : '#E2E8F0',
                            }}
                          >
                            <Text
                              style={{
                                fontSize: 13,
                                fontWeight: selecionado ? '700' : '500',
                                color: selecionado ? '#1E3A8A' : '#334155',
                                flex: 1,
                                marginRight: 8,
                              }}
                            >
                              {tituloCurso}
                            </Text>

                            <CustomIcon
                              name={selecionado ? 'checkbox' : 'square-outline'}
                              size={18}
                              color={selecionado ? '#1D4ED8' : '#94A3B8'}
                            />
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  )}
                </View>
              </View>
            )}

            <Text style={styles.label}>
              {usuarioEditando
                ? 'Nova senha (deixe em branco para manter)'
                : 'Senha temporária *'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={
                usuarioEditando
                  ? 'Preencha apenas se quiser alterar'
                  : 'Informe uma senha temporária'
              }
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
                {usuarioEditando ? 'Salvar alterações' : '+ Criar usuarios'}
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