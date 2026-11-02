import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import CustomIcon from "../CustomIcon";
import ConfirmModal from "../ConfirmPopup";
import { NotificaTabStyles as styles } from "../../styles/tabs/notificaTabStyles";
import { formatarDataApenas } from "../../utils/dataUtils";

export default function NotificacoesTab({ notificacoes, onRemover, onSelectEvento }) {
  const [confirmModal, setConfirmModal] = useState({
    visible: false,
    eventoId: null,
    tituloEvento: '',
  });

  const abrirConfirmacao = (evento) => {
    setConfirmModal({
      visible: true,
      eventoId: evento.id,
      tituloEvento: evento.titulo,
    });
  };

  const confirmarRemocao = () => {
    if (confirmModal.eventoId && onRemover) {
      onRemover(confirmModal.eventoId);
    }
    setConfirmModal({ visible: false, eventoId: null, tituloEvento: '' });
  };

  return (
    <ScrollView contentContainerStyle={styles.containerTab} showsVerticalScrollIndicator={false}>
      <CustomIcon name="notifications-outline" size={36} color="#032551" />
      <Text style={styles.tituloTab}>Notificações e Avisos</Text>

      {notificacoes && notificacoes.length > 0 ? (
        <View style={styles.listaContainer}>
          {notificacoes.map((evento) => {
            let nomeTurma = "Geral";
            if (evento?.turma) {
              nomeTurma = typeof evento.turma === 'object' ? (evento.turma.nome || "Geral") : evento.turma;
            } else if (evento?.curso) {
              nomeTurma = typeof evento.curso === 'object' ? (evento.curso.nome || "Geral") : evento.curso;
            }

            const dataFormatada = formatarDataApenas(evento.inicio || evento.data || evento.dataEvento) || `${evento.dia || ''} de ${evento.mes || ''}`;

            return (
              <View key={evento.id} style={styles.cartaoNotificacao}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={styles.tagEvento}>{evento.tipo || "Evento"}</Text>
                  <Text style={styles.tituloEvento} numberOfLines={2}>
                    {evento.titulo}
                  </Text>
                  <Text style={styles.dataEvento}>
                    📅 {dataFormatada} | 🎓 {nomeTurma}
                  </Text>
                </View>

                <View style={styles.botoesAcao}>
                  {onSelectEvento && (
                    <TouchableOpacity style={styles.btnDetalhes} onPress={() => onSelectEvento(evento)}>
                      <Text style={styles.textoBtnDetalhes}>Ver</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity 
                    style={styles.btnRemover} 
                    onPress={() => abrirConfirmacao(evento)}
                    activeOpacity={0.7}
                  >
                    <CustomIcon name="trash-outline" size={16} color="#b00020" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <Text style={styles.textoTab}>
          Nenhum evento salvo nas suas notificações ainda. Clique em "Notificar" nos detalhes de um evento para guardá-lo aqui.
        </Text>
      )}
    
      <ConfirmModal
        visible={confirmModal.visible}
        titulo="Remover Notificação"
        mensagem={`Deseja realmente remover "${confirmModal.tituloEvento}" das suas notificações salvas?`}
        tipo="danger"
        onConfirm={confirmarRemocao}
        onCancel={() => setConfirmModal({ visible: false, eventoId: null, tituloEvento: '' })}
      />
    </ScrollView>
  );
}