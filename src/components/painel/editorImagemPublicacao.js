import { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';

import {
  Gesture,
  GestureDetector
} from 'react-native-gesture-handler';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring
} from 'react-native-reanimated';

import CustomIcon from '../CustomIcon';

export default function EditorImagemPublicacao({
  imagem,
  onCancelar,
  onConfirmar
}) {
  const [viewport, setViewport] = useState({
    width: 0,
    height: 0
  });

  const escala = useSharedValue(1);
  const escalaInicial = useSharedValue(1);

  const posicaoX = useSharedValue(0);
  const posicaoY = useSharedValue(0);

  const posicaoInicialX = useSharedValue(0);
  const posicaoInicialY = useSharedValue(0);

  // Escala necessária para preencher o quadro 4:5.
  const escalaBase = imagem && viewport.width && viewport.height
    ? Math.max(
        viewport.width / imagem.width,
        viewport.height / imagem.height
      )
    : 1;

  const larguraImagem = imagem?.width * escalaBase || 0;
  const alturaImagem = imagem?.height * escalaBase || 0;

  function limitarPosicao(valor, tamanhoImagem, tamanhoQuadro, zoom) {
    const limite = Math.max(
      0,
      (tamanhoImagem * zoom - tamanhoQuadro) / 2
    );

    return Math.max(-limite, Math.min(limite, valor));
  }

  const gestoPan = Gesture.Pan()
    .onStart(() => {
      posicaoInicialX.value = posicaoX.value;
      posicaoInicialY.value = posicaoY.value;
    })
    .onUpdate((evento) => {
      const novaX = posicaoInicialX.value + evento.translationX;
      const novaY = posicaoInicialY.value + evento.translationY;

      posicaoX.value = limitarPosicao(
        novaX,
        larguraImagem,
        viewport.width,
        escala.value
      );

      posicaoY.value = limitarPosicao(
        novaY,
        alturaImagem,
        viewport.height,
        escala.value
      );
    });

  const gestoPinch = Gesture.Pinch()
    .onStart(() => {
      escalaInicial.value = escala.value;
    })
    .onUpdate((evento) => {
      const novaEscala = Math.max(
        1,
        Math.min(escalaInicial.value * evento.scale, 4)
      );

      escala.value = novaEscala;

      posicaoX.value = limitarPosicao(
        posicaoX.value,
        larguraImagem,
        viewport.width,
        novaEscala
      );

      posicaoY.value = limitarPosicao(
        posicaoY.value,
        alturaImagem,
        viewport.height,
        novaEscala
      );
    });

  const gestos = Gesture.Simultaneous(
    gestoPan,
    gestoPinch
  );

  const estiloImagem = useAnimatedStyle(() => ({
    transform: [
      { translateX: posicaoX.value },
      { translateY: posicaoY.value },
      { scale: escala.value }
    ]
  }));

  function redefinirImagem() {
    escala.value = withSpring(1);
    posicaoX.value = withSpring(0);
    posicaoY.value = withSpring(0);
  }

  function confirmar() {
    if (!imagem || !viewport.width || !viewport.height) {
      return;
    }

    const escalaFinal = escalaBase * escala.value;

    const larguraRecorte = viewport.width / escalaFinal;
    const alturaRecorte = viewport.height / escalaFinal;

    const origemX =
      (imagem.width - larguraRecorte) / 2 -
      posicaoX.value / escalaFinal;

    const origemY =
      (imagem.height - alturaRecorte) / 2 -
      posicaoY.value / escalaFinal;

    const recorte = {
      originX: Math.max(
        0,
        Math.round(origemX)
      ),
      originY: Math.max(
        0,
        Math.round(origemY)
      ),
      width: Math.round(larguraRecorte),
      height: Math.round(alturaRecorte)
    };

    onConfirmar(recorte);
  }

  if (!imagem?.uri || !imagem?.width || !imagem?.height) {
    return (
      <Text>
        Não foi possível carregar as dimensões da imagem.
      </Text>
    );
  }

  return (
    <View style={{ gap: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        Ajustar imagem
      </Text>

      <Text style={{ color: '#64748B' }}>
        Arraste a imagem e use o gesto de pinça para ajustar
        o zoom. A área visível será utilizada na publicação.
      </Text>

      <View
        onLayout={(evento) => {
          const { width, height } = evento.nativeEvent.layout;

          setViewport({ width, height });
        }}
        style={{
          width: '100%',
          aspectRatio: 4 / 5,
          backgroundColor: '#0F172A',
          overflow: 'hidden',
          borderRadius: 10
        }}
      >
        {viewport.width > 0 && (
          <GestureDetector gesture={gestos}>
            <Animated.View
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Animated.Image
                source={{ uri: imagem.uri }}
                resizeMode="stretch"
                style={[
                  {
                    position: 'absolute',
                    width: larguraImagem,
                    height: alturaImagem
                  },
                  estiloImagem
                ]}
              />
            </Animated.View>
          </GestureDetector>
        )}
      </View>

      <Text style={{ color: '#64748B', fontSize: 12 }}>
        Proporção final: 4:5
      </Text>

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity
          onPress={redefinirImagem}
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: '#E2E8F0',
            borderRadius: 8,
            alignItems: 'center'
          }}
        >
          <Text>Redefinir</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onCancelar}
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: '#E2E8F0',
            borderRadius: 8,
            alignItems: 'center'
          }}
        >
          <Text>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={confirmar}
          style={{
            flex: 1,
            padding: 12,
            backgroundColor: '#173EA5',
            borderRadius: 8,
            alignItems: 'center'
          }}
        >
          <Text style={{ color: '#FFFFFF' }}>
            Confirmar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}