import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from '@expo/vector-icons'; // 👈 Importa os ícones do Expo
import CustomIcon from "../CustomIcon";
import { formatarDataApenas } from "../../utils/dataUtils";

export default function GerenciarListaEventos({ eventos = [], onEditar, onExcluir, onNovoEvento }) {
  const [pesquisa, setPesquisa] = useState("");

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // 1. Processa, filtra por pesquisa, verifica se já passou e ordena (do mais atual para o mais antigo)
  const eventosProcessados = eventos
    .map((evento) => {
      const dataObj = new Date(evento.inicio || evento.data || evento.dataEvento);
      
      // Verifica se a data já passou (comparando com a meia-noite de hoje)
      const jaPassou = !isNaN(dataObj.getTime()) && dataObj < hoje;

      return {
        ...evento,
        dataObj,
        jaPassou,
      };
    })
    .filter((evento) => {
      const termo = pesquisa.toLowerCase();
      const tituloMatch = evento.titulo?.toLowerCase().includes(termo);
      const localMatch = evento.local?.toLowerCase().includes(termo);
      return tituloMatch || localMatch;
    })
    .sort((a, b) => {
      // Ordenação invertida: do mais atual (futuro/próximo) para o mais antigo
      if (isNaN(a.dataObj.getTime())) return 1;
      if (isNaN(b.dataObj.getTime())) return -1;
      return b.dataObj - a.dataObj; 
    });

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: "#fff" }}>
      {/* Cabeçalho da Seção com o Botão de Adicionar Circular */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#032551' }}>
            Eventos cadastrados
          </Text>
          <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>
            Gerencie datas, locais e status.
          </Text>
        </View>

        {onNovoEvento && (
          <TouchableOpacity 
            style={{ 
              backgroundColor: '#173EA5', 
              width: 42, 
              height: 42, 
              borderRadius: 8, // Cantos levemente arredondados em vez de circular
              justifyContent: 'center', 
              alignItems: 'center',
              borderLeftWidth: 4, // 👈 Cria a faixa amarela na lateral esquerda
              borderLeftColor: '#F2C500', // Cor amarela padrão do tema
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 3,
              elevation: 2
            }} 
            onPress={onNovoEvento}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Barra de Pesquisa */}
      <TextInput
        style={{ borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 10, marginBottom: 16, fontSize: 14, backgroundColor: '#FAFAFA' }}
        placeholder="Pesquisar evento por título ou local..."
        placeholderTextColor="#94A3B8"
        value={pesquisa}
        onChangeText={setPesquisa}
      />

      {/* Lista de Eventos Ordenada (Mais Atual para Mais Antigo) e Estilizada por Status */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {eventosProcessados.length > 0 ? (
          eventosProcessados.map((evento) => {
            const dataFormatada = formatarDataApenas(evento.inicio || evento.data || evento.dataEvento);

            return (
              <View 
                key={evento.id} 
                style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: 12, 
                  marginBottom: 10, 
                  borderRadius: 8, 
                  borderWidth: 1,
                  // Estilização condicional baseada na data:
                  borderColor: evento.jaPassou ? '#e5e7eb' : '#93c5fd',
                  backgroundColor: evento.jaPassou ? '#f9fafb' : '#f0f4ff',
                  opacity: evento.jaPassou ? 0.65 : 1 // Mais opaco se já passou
                }}
              >
                <View style={{ flex: 1, marginRight: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Text style={{ fontSize: 11, fontWeight: 'bold', color: evento.jaPassou ? '#6b7280' : '#1d4ed8' }}>
                      {evento.jaPassou ? '⏳ ENCERRADO' : '🟢 ATIVO'}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#4b5563' }}>• 📍 {evento.local || 'Local a definir'}</Text>
                  </View>

                  <Text style={{ fontSize: 14, fontWeight: 'bold', color: evento.jaPassou ? '#4b5563' : '#111827' }} numberOfLines={1}>
                    {evento.titulo}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                    📅 {dataFormatada || "Data a definir"}
                  </Text>
                </View>

                {/* Botões de Ação Administrativa */}
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {onEditar && (
                    <TouchableOpacity 
                      style={{ padding: 6, backgroundColor: '#e0e7ff', borderRadius: 6 }}
                      onPress={() => onEditar(evento)}
                    >
                      <CustomIcon name="log-in-outline" size={16} color="#1d4ed8" />
                    </TouchableOpacity>
                  )}
                  {onExcluir && (
                    <TouchableOpacity 
                      style={{ padding: 6, backgroundColor: '#fee2e2', borderRadius: 6 }}
                      onPress={() => onExcluir(evento)} // 👈 Envia o objeto 'evento' completo em vez de apenas 'evento.id'
                    >
                      <CustomIcon name="trash-outline" size={16} color="#b91c1c" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        ) : (
          <Text style={{ textAlign: 'center', color: '#6b7280', marginTop: 32 }}>
            Nenhum evento encontrado.
          </Text>
        )}
      </ScrollView>
    </View>
  );
}