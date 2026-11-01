import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking, TextInput } from 'react-native';
import CustomIcon from '../CustomIcon';
import { buscarParceriasDoBanco, obterIconeDaWeb } from '../../services/parceriaServices';

export default function ParceriasAlunoTab() {
  const [parcerias, setParcerias] = useState([]);
  const [pesquisa, setPesquisa] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarParcerias();
  }, []);

  async function carregarParcerias() {
    try {
      setCarregando(true);
      const dados = await buscarParceriasDoBanco();
      setParcerias(dados || []);
    } catch (error) {
      console.log('Erro ao carregar parcerias para o aluno:', error);
    } finally {
      setCarregando(false);
    }
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const parceriasFiltradas = parcerias
    .map((parceria) => {
      let dataObj;
      if (parceria.duracao && parceria.duracao.includes('/')) {
        const [dia, mes, ano] = parceria.duracao.split('/');
        dataObj = new Date(Number(ano), Number(mes) - 1, Number(dia));
      } else {
        dataObj = new Date(parceria.duracao);
      }
      const expirada = !isNaN(dataObj.getTime()) && dataObj < hoje;
      return { ...parceria, expirada };
    })
    .filter((p) => {
      // Exibe apenas as ativas/em vigência ou todas se preferir. Vamos mostrar as ativas no topo!
      const termo = pesquisa.toLowerCase();
      return p.titulo?.toLowerCase().includes(termo) || p.descricao?.toLowerCase().includes(termo);
    });

  const abrirLinkParceiro = (url) => {
    if (!url) return;
    const linkFinal = url.startsWith('http') ? url : `https://${url}`;
    Linking.openURL(linkFinal).catch((err) => console.error("Erro ao abrir link:", err));
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40, backgroundColor: '#F8FAFC', flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <Text style={{ fontSize: 22, fontWeight: '800', color: '#032551', marginBottom: 4 }}>Parcerias e Descontos</Text>
      <Text style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>Aproveite benefícios exclusivos e descontos especiais para estudantes.</Text>

      {/* Barra de Pesquisa */}
      <TextInput
        style={{ borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 10, marginBottom: 16, fontSize: 14, backgroundColor: '#FFFFFF', color: '#0F172A' }}
        placeholder="Pesquisar por empresa ou benefício..."
        placeholderTextColor="#94A3B8"
        value={pesquisa}
        onChangeText={setPesquisa}
      />

      {carregando ? (
        <Text style={{ textAlign: 'center', color: '#64748B', marginTop: 40 }}>A carregar parcerias...</Text>
      ) : parceriasFiltradas.length > 0 ? (
        <View style={{ gap: 12 }}>
          {parceriasFiltradas.map((p) => {
            const iconeUrl = obterIconeDaWeb(p.link);

            // Formata data para DD/MM/AAAA
            let dataExibicao = p.duracao || '';
            if (dataExibicao.includes('-')) {
              const [ano, mes, dia] = dataExibicao.split('-');
              dataExibicao = `${dia}/${mes}/${ano}`;
            }

            return (
              <View 
                key={p.id} 
                style={{ 
                  backgroundColor: '#FFFFFF', 
                  borderRadius: 10, 
                  borderWidth: 1, 
                  borderColor: p.expirada ? '#E2E8F0' : '#BFDBFE', 
                  padding: 16,
                  opacity: p.expirada ? 0.7 : 1,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                  elevation: 2
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                    {iconeUrl ? (
                      <Image 
                        source={{ uri: iconeUrl }} 
                        style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: '#F1F5F9' }} 
                        resizeMode="contain" 
                      />
                    ) : (
                      <Text style={{ fontSize: 24 }}>🤝</Text>
                    )}

                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: '700', color: '#032551' }} numberOfLines={1}>{p.titulo}</Text>
                      {p.desconto && (
                        <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#D97706', marginTop: 2 }}>🏷️ {p.desconto}</Text>
                      )}
                    </View>
                  </View>

                  <View style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: p.expirada ? '#F1F5F9' : '#EFF6FF' }}>
                    <Text style={{ fontSize: 10, fontWeight: 'bold', color: p.expirada ? '#64748B' : '#1D4ED8' }}>
                      {p.expirada ? 'ENCERRADA' : 'DISPONÍVEL'}
                    </Text>
                  </View>
                </View>

                {p.descricao ? (
                  <Text style={{ fontSize: 13, color: '#475569', lineHeight: 18, marginBottom: 12 }}>{p.descricao}</Text>
                ) : null}

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10, marginTop: 4 }}>
                  <Text style={{ fontSize: 11, color: '#64748B', fontWeight: '600' }}>
                    ⏳ Válido até: {dataExibicao}
                  </Text>

                  {p.link && !p.expirada && (
                    <TouchableOpacity 
                      style={{ backgroundColor: '#173EA5', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, flexDirection: 'row', alignItems: 'center', gap: 6 }}
                      onPress={() => abrirLinkParceiro(p.link)}
                    >
                      <CustomIcon name="open-outline" size={14} color="#FFFFFF" />
                      <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>Acessar o Site</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <Text style={{ textAlign: 'center', color: '#64748B', marginTop: 40, fontSize: 14 }}>Nenhuma parceria disponível no momento.</Text>
      )}
    </ScrollView>
  );
}