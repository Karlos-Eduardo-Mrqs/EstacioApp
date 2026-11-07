import {Modal,Pressable,View,Text,TouchableOpacity,ScrollView,Linking,} from 'react-native';
import { modalServicosStyles as styles } from '../../styles/mural/modalServicosStyles';
import BotaoFechar from '../botaoFechar'; // 👈 Certifique-se de que o caminho do import está correto para sua pasta

export default function ModalDetalhesServico({ servico, visible, onClose }) {
  if (!servico) return null;

  const abrirEmail = (email) => {
    if (email && email !== 'A definir') {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const abrirLink = (url) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  // Inicial do responsável para o avatar
  const inicialResponsavel = servico.responsavel && servico.responsavel !== 'A definir'
    ? servico.responsavel
        .split(' ')
        .map((p) => p[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'ST';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalFundo} onPress={onClose}>
        {/* Usamos o stopPropagation para que clicar dentro do modal não feche */}
        <Pressable style={styles.modalDetalhes} onPress={(e) => e.stopPropagation()}>
          
          {/* TOPO DO MODAL */}
          <View style={styles.modalHeaderDetalhes}>
            
            <BotaoFechar onPress={onClose} />

            <Text style={styles.modalSubtopo}>
              {servico.curso ? servico.curso.toUpperCase() : 'SERVIÇO INSTITUCIONAL'}
            </Text>
            <Text style={styles.modalTituloPrincipal}>
              {servico.nome}
            </Text>

            <View style={styles.faixaAmarelaTopo} />
          </View>

          {/* CORPO DO MODAL */}
          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            
            {/* APRESENTAÇÃO */}
            <Text style={styles.secaoTitulo}>APRESENTAÇÃO</Text>
            <Text style={styles.secaoTexto}>
              {servico.descricao || 'Sem descrição informada.'}
            </Text>

            {/* CURSO / MODALIDADE */}
            <View style={styles.infoLinha}>
              <Text style={styles.infoLabel}>📌 Curso / Categoria:</Text>
              <Text style={styles.infoValor}>
                {servico.curso || 'Geral / Todos'}
              </Text>
            </View>

            {/* DIAS DE ATENDIMENTO */}
            {servico.dias ? (
              <View style={styles.infoLinha}>
                <Text style={styles.infoLabel}>🕒 Atendimento:</Text>
                <Text style={styles.infoValor}>{servico.dias}</Text>
              </View>
            ) : null}

            {/* LINKS ÚTEIS */}
            {servico.linksUteis ? (
              <>
                <Text style={[styles.secaoTitulo, { marginTop: 15 }]}>LINKS ÚTEIS</Text>
                {servico.linksUteis.split('\n').map((linha, idx) => {
                  if (!linha.trim()) return null;
                  const partes = linha.split(':');
                  const nomeLink = partes[0]?.trim() || 'Acessar Link';
                  const urlLink = partes.slice(1).join(':').replace(';', '').trim();

                  return (
                    <TouchableOpacity
                      key={idx}
                      style={styles.botaoLinkUtil}
                      onPress={() => abrirLink(urlLink)}
                    >
                      <Text style={styles.botaoLinkUtilTexto}>🔗 {nomeLink}</Text>
                    </TouchableOpacity>
                  );
                })}
              </>
            ) : null}

            {/* EVENTOS E AVISOS */}
            <Text style={[styles.secaoTitulo, { marginTop: 18 }]}>
              AVISOS E INFORMAÇÕES
            </Text>
            <Text style={styles.secaoTexto}>
              {servico.aviso || 'Nenhum aviso publicado no momento.'}
            </Text>

            {/* FALE COM A COORDENAÇÃO */}
            <Text style={[styles.secaoTitulo, { marginTop: 18 }]}>
              FALE COM A COORDENAÇÃO
            </Text>

            <View style={styles.coordenacaoBox}>
              <View style={styles.avatarMini}>
                <Text style={styles.avatarMiniTexto}>{inicialResponsavel}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.coordNome}>
                  {servico.responsavel || 'Coordenação'}
                </Text>
                <Text style={styles.coordSub}>
                  {servico.cargo || 'Coordenador(a) responsável'}
                </Text>
              </View>
            </View>

            {/* ENVIAR EMAIL */}
            {servico.email && servico.email !== 'A definir' ? (
              <TouchableOpacity
                style={styles.botaoEnviarEmail}
                onPress={() => abrirEmail(servico.email)}
              >
                <Text style={styles.botaoEnviarEmailTexto}>Enviar E-mail ({servico.email})</Text>
              </TouchableOpacity>
            ) : null}

          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}