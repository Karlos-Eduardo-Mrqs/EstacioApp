import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';

// Lista de animações com suas tiras completas de imagens
const ANIMAGOES = [
  {
    id: 'jojo',
    nome: 'Pose JoJo / Anime',
    totalFrames: 6,
    imagem: require('../../assets/sprites/jojo_strip.png'), // Substitua pelo caminho exato da sua imagem
  },
  {
    id: 'm7',
    nome: 'Maestria M7',
    totalFrames: 6,
    imagem: require('../../assets/sprites/m7_strip.png'),
  },
  {
    id: 'domínio',
    nome: 'Expansão de Domínio (JJK)',
    totalFrames: 10,
    imagem: require('../../assets/sprites/jjk_strip.png'),
  },
  {
    id: 'fluminense',
    nome: 'Comemoração Fluminense',
    totalFrames: 10,
    imagem: require('../../assets/sprites/flu_strip.png'),
  },
];

// Largura da janela do boneco na tela (em pixels)
const FRAME_WIDTH = 150; 
const FRAME_HEIGHT = 180; 

export default function PixelAnimationTest({ onClose }) {
  const [animacaoIndex, setAnimacaoIndex] = useState(0);
  const [frameAtual, setFrameAtual] = useState(0);

  const animacaoAtiva = ANIMAGOES[animacaoIndex];

  // Loop automático alternando entre os frames
  useEffect(() => {
    setFrameAtual(0); // Reseta para o primeiro frame quando muda de animação

    const intervalo = setInterval(() => {
      setFrameAtual((prev) => (prev + 1) % animacaoAtiva.totalFrames);
    }, 120); // Velocidade do frame (140ms)

    return () => clearInterval(intervalo);
  }, [animacaoIndex]);

  // Cálculo da posição horizontal (X) para cortar o frame correto na tira
  const totalWidth = FRAME_WIDTH * animacaoAtiva.totalFrames;
  const offsetX = -frameAtual * FRAME_WIDTH;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Laboratório de Sprites (Tira Completa)</Text>

      {/* JANELA DE EXIBIÇÃO (MÁSCARA DO FRAME) */}
      <View style={styles.stageWindow}>
        <View
          style={{
            width: totalWidth,
            height: FRAME_HEIGHT,
            transform: [{ translateX: offsetX }],
          }}
        >
          <Image
            source={animacaoAtiva.imagem}
            style={{ width: totalWidth, height: FRAME_HEIGHT }}
            resizeMode="stretch"
          />
        </View>
      </View>

      <Text style={styles.status}>
        {animacaoAtiva.nome} • Frame {frameAtual + 1} de {animacaoAtiva.totalFrames}
      </Text>

      {/* BOTAO PARA ALTERNAR ENTRE AS ANIMAÇÕES */}
      <View style={styles.botoesContainer}>
        {ANIMAGOES.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.botao,
              animacaoIndex === index && styles.botaoAtivo,
            ]}
            onPress={() => setAnimacaoIndex(index)}
          >
            <Text style={styles.textoBotao}>{item.nome}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* FECHAR MODAL */}
      {onClose && (
        <TouchableOpacity style={styles.botaoFechar} onPress={onClose}>
          <Text style={styles.textoFechar}>← Voltar para o Mural</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f8fafc',
    marginBottom: 20,
  },
  stageWindow: {
    width: FRAME_WIDTH,
    height: FRAME_HEIGHT,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#38bdf8',
    overflow: 'hidden', // Esconde todos os outros frames da tira
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  status: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 12,
    marginBottom: 24,
  },
  botoesContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  botao: {
    backgroundColor: '#334155',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  botaoAtivo: {
    backgroundColor: '#0284c7',
  },
  textoBotao: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  botaoFechar: {
    marginTop: 30,
  },
  textoFechar: {
    color: '#38bdf8',
    fontSize: 14,
  },
});