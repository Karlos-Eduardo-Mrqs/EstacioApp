import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CoresInstitucionais } from '../../styles/theme';
import ModalDetalhesServico from './ModalServicos';
import { carrosselServicosStyles as styles } from '../../styles/mural/carrosselServicosStyles';

export default function CarrosselServicos({ servicos = [], onSelectServico }) {
  const [servicoSelecionado, setServicoSelecionado] = useState(null);

  if (!servicos || servicos.length === 0) return null;

  const handlePressServico = (item) => {
    setServicoSelecionado(item);
    if (onSelectServico) {
      onSelectServico(item);
    }
  };

  return (
    <View style={{ marginBottom: 28, marginTop: 12 }}>
      {/* TÍTULO DA SEÇÃO */}
      <View style={{ paddingHorizontal: 16, marginBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: 'bold',
            color: CoresInstitucionais.azulPrincipal || '#0A2540',
            letterSpacing: 0.8,
            textTransform: 'uppercase',
          }}
        >
          🏢 SERVIÇOS INSTITUCIONAIS
        </Text>
      </View>

      {/* LINHA DIVISÓRIA SUTIL */}
      <View
        style={{
          height: 2,
          backgroundColor: '#0A2540',
          marginBottom: 14,
          marginHorizontal: 16,
          borderRadius: 2,
          opacity: 0.8,
        }}
      />

      {/* CARROSSEL HORIZONTAL */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
      >
        {servicos.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={styles.cardCarrosselModerno}
            activeOpacity={0.85}
            onPress={() => handlePressServico(item)}
          >
            {/* Tag Numérica / Ícone */}
            <View style={styles.cardHeaderTop}>
              <View style={styles.badgeNumero}>
                <Text style={styles.cardNumero}>#{index + 1}</Text>
              </View>
            </View>

            {/* Conteúdo Central */}
            <View style={styles.cardBody}>
              <Text style={styles.cardTitulo} numberOfLines={2}>
                {item.nome}
              </Text>
              <Text style={styles.cardDescricao} numberOfLines={2}>
                {item.descricao || 'Conheça este serviço institucional da Estácio.'}
              </Text>
            </View>

            {/* Rodapé do Card */}
            <View style={styles.cardFooter}>
              <View style={styles.tagContainer}>
                <Text style={styles.tagTexto} numberOfLines={1}>
                  📌 {item.curso || 'Geral'}
                </Text>
              </View>

              <View style={styles.botaoDetalhesPequeno}>
                <Text style={styles.botaoDetalhesText}>Detalhes →</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* MODAL DE DETALHES */}
      <ModalDetalhesServico
        servico={servicoSelecionado}
        visible={servicoSelecionado !== null}
        onClose={() => setServicoSelecionado(null)}
      />
    </View>
  );
}