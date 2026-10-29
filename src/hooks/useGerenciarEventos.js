import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { 
  buscarEventosDoBanco, 
  criarEventoNoBanco, 
  atualizarEventoNoBanco, 
  removerEventoDoBanco, 
  alterarStatusEventoNoBanco 
} from '../services/apiServices';
import { converterParaISO } from '../utils/dataUtils';

const EVENTOS_INICIAIS_PADRAO = [
  {
    id: '1',
    titulo: 'Semana Acadêmica',
    inicio: '2026-10-22T08:00:00',
    termino: '2026-10-24T18:00:00',
    descricao: 'Atividades e palestras acadêmicas.',
    imagem: null,
    ativo: true,
  },
];

export function useGerenciarEventos() {
  const [eventos, setEventos] = useState(EVENTOS_INICIAIS_PADRAO);
  const [busca, setBusca] = useState('');
  const [agora, setAgora] = useState(Date.now());

  const [modalEvento, setModalEvento] = useState(false);
  const [eventoEditando, setEventoEditando] = useState(null);

  const [titulo, setTitulo] = useState('');
  const [inicioTexto, setInicioTexto] = useState('');
  const [terminoTexto, setTerminoTexto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(null);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const intervalo = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    carregarEventos();
  }, []);

  async function carregarEventos() {
    try {
      setCarregando(true);
      const dados = await buscarEventosDoBanco();
      if (dados && dados.length > 0) {
        setEventos(dados);
      }
    } catch (error) {
      console.log('Mantendo lista local:', error);
    } finally {
      setCarregando(false);
    }
  }

  const eventosFiltrados = eventos.filter((evento) =>
    evento.titulo?.toLowerCase().includes(busca.toLowerCase())
  );

  const quantidadeAtivos = eventos.filter((evento) => evento.ativo).length;

  function abrirNovoEvento() {
    setEventoEditando(null);
    setTitulo('');
    setInicioTexto('');
    setTerminoTexto('');
    setDescricao('');
    setImagem(null);
    setModalEvento(true);
  }

  function abrirEdicao(evento) {
    setEventoEditando(evento);
    setTitulo(evento.titulo);
    setInicioTexto(evento.inicio || '');
    setTerminoTexto(evento.termino || '');
    setDescricao(evento.descricao || '');
    setImagem(evento.imagem || null);
    setModalEvento(true);
  }

  async function selecionarImagem() {
    try {
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!resultado.canceled && resultado.assets?.length) {
        setImagem(resultado.assets[0].uri);
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível abrir a galeria.');
    }
  }

  async function salvarEvento() {
    if (!titulo.trim() || !inicioTexto.trim() || !terminoTexto.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha o título, início e término.');
      return;
    }

    const inicioIso = converterParaISO(inicioTexto) || inicioTexto;
    const terminoIso = converterParaISO(terminoTexto) || terminoTexto;

    const payload = {
      titulo: titulo.trim(),
      inicio: inicioIso,
      termino: terminoIso,
      descricao: descricao.trim(),
      imagem,
      ativo: true,
    };

    try {
      if (eventoEditando) {
        const atualizado = await atualizarEventoNoBanco(eventoEditando.id, payload);
        setEventos(eventos.map(ev => ev.id === eventoEditando.id ? atualizado : ev));
        Alert.alert('Sucesso', 'Evento atualizado.');
      } else {
        const criado = await criarEventoNoBanco(payload);
        setEventos([criado, ...eventos]);
        Alert.alert('Sucesso', 'Evento cadastrado.');
      }
      setModalEvento(false);
      carregarEventos();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar no banco de dados.');
    }
  }

  function alternarStatus(evento) {
    const novoStatus = !evento.ativo;
    Alert.alert(
      novoStatus ? 'Ativar evento' : 'Encerrar evento',
      `Deseja ${novoStatus ? 'ativar' : 'encerrar'} "${evento.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              await alterarStatusEventoNoBanco(evento.id, novoStatus);
              setEventos(eventos.map(item => item.id === evento.id ? { ...item, ativo: novoStatus } : item));
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível alterar o status.');
            }
          }
        }
      ]
    );
  }

  function excluirEvento(evento) {
    Alert.alert(
      'Excluir evento',
      `Deseja excluir "${evento.titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await removerEventoDoBanco(evento.id);
              setEventos(eventos.filter(item => item.id !== evento.id));
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o evento.');
            }
          }
        }
      ]
    );
  }

  return {
    eventos,
    eventosFiltrados,
    quantidadeAtivos,
    busca,
    setBusca,
    agora,
    modalEvento,
    setModalEvento,
    eventoEditando,
    titulo,
    setTitulo,
    inicioTexto,
    setInicioTexto,
    terminoTexto,
    setTerminoTexto,
    descricao,
    setDescricao,
    imagem,
    setImagem,
    abrirNovoEvento,
    abrirEdicao,
    selecionarImagem,
    salvarEvento,
    alternarStatus,
    excluirEvento,
    carregando
  };
}