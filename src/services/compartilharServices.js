import { Platform } from 'react-native';

export async function compartilharCard(viewRef, evento) {
  try {
    if (Platform.OS === 'web') {
      if (viewRef && viewRef.current) {
        const { captureRef } = await import('react-native-view-shot');
        const uri = await captureRef(viewRef, {
          format: "png",
          quality: 1.0,
        });

        const tituloFormatado = evento?.titulo ? evento.titulo.replace(/\s+/g, '_') : 'evento';
        const link = document.createElement('a');
        link.href = uri;
        link.download = `${tituloFormatado}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return { 
          tipo: 'sucesso', 
          mensagem: 'A imagem do evento foi descarregada com sucesso!' 
        };
      }

      return { 
        tipo: 'erro', 
        mensagem: 'Não foi possível capturar a imagem para download.' 
      };

    } else {
      // --- LÓGICA PARA MOBILE (Android / iOS) ---
      const { captureRef } = await import('react-native-view-shot');
      const Sharing = await import('expo-sharing');

      // Captura o elemento em formato PNG
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 1.0,
      });

      // Verifica se o sharing é suportado no dispositivo atual
      const isAvailable = await Sharing.isAvailableAsync();
      if (!isAvailable) {
        return { 
          tipo: 'erro', 
          mensagem: 'A partilha de ficheiros não está disponível neste dispositivo.' 
        };
      }

      // Abre diretamente a gaveta nativa de partilha do telemóvel
      await Sharing.shareAsync(uri, {
        dialogTitle: "Compartilhar Evento Acadêmico",
        mimeType: 'image/png',
        UTI: 'public.png', // Essencial para iOS reconhecer o formato da imagem
      });

      return { 
        tipo: 'sucesso', 
        mensagem: 'Gaveta de partilha aberta com sucesso!' 
      };
    }
  } catch (error) {
    console.log("Erro na partilha:", error);
    return { tipo: 'erro', mensagem: 'Não foi possível processar ou partilhar o evento.' };
  }
}