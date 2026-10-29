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
      const { captureRef } = await import('react-native-view-shot');
      const Sharing = await import('expo-sharing');

      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 1.0,
      });

      if (!(await Sharing.isAvailableAsync())) {
        return { tipo: 'erro', mensagem: 'O compartilhamento não está disponível neste dispositivo.' };
      }

      await Sharing.shareAsync(uri, {
        dialogTitle: "Compartilhar Evento",
        mimeType: 'image/png',
      });

      return { tipo: 'sucesso', mensagem: 'Evento partilhado com sucesso!' };
    }
  } catch (error) {
    console.log("Erro na partilha:", error);
    return { tipo: 'erro', mensagem: 'Não foi possível processar ou partilhar o evento.' };
  }
}