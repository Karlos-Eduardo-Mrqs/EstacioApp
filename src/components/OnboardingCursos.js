import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Stepper, { Step } from './Stepper';
import {Onboardingstyles as styles} from "../styles/OnboardingCursosStyles";

export default function OnboardingCursos({ 
  cursosDisponiveis = [], 
  onConcluirSetup, 
  onPular,
  stepInicial = 1 
}) {
  const [cursosSelecionados, setCursosSelecionados] = useState([]);
  const [stepAtual, setStepAtual] = useState(stepInicial);

  const toggleCurso = (cursoId) => {
    if (cursosSelecionados.includes(cursoId)) {
      setCursosSelecionados(cursosSelecionados.filter((id) => id !== cursoId));
    } else {
      if (cursosSelecionados.length >= 5) return;
      setCursosSelecionados([...cursosSelecionados, cursoId]);
    }
  };

  const totalSelecionados = cursosSelecionados.length;
  const isPasso2Valido = totalSelecionados >= 3 && totalSelecionados <= 5;
  const atingiuMaximo = totalSelecionados >= 5;

  const nomesCursosSelecionados = cursosDisponiveis.filter(
    (curso) => cursosSelecionados.includes(curso.id || curso.titulo)
  );

  return (
    <View style={styles.container}>
      {/* BOTÃO "FAZER DEPOIS" NO TOPO */}
      {onPular && (
        <TouchableOpacity style={styles.btnPularHeader} onPress={onPular}>
          <Text style={styles.textoPularHeader}>Configurar Depois ✕</Text>
        </TouchableOpacity>
      )}

      <Stepper
        initialStep={stepInicial}
        step={stepAtual}
        onStepChange={(step) => setStepAtual(step)}
        onFinalStepCompleted={() => {
          if (onConcluirSetup) {
            onConcluirSetup(cursosSelecionados);
          }
        }}
        backButtonText="Voltar"
        nextButtonText="Continuar"
        completeButtonText="Entrar no Mural"
        nextButtonProps={
          stepAtual === 2 && !isPasso2Valido
            ? { disabled: true, title: "Selecione entre 3 e 5 cursos para continuar" }
            : {}
        }
      >
        {/* PASSO 1: Boas-vindas (Exibido apenas no primeiro acesso normal) */}
        <Step title="Boas-vindas">
          <View style={styles.stepContent}>
            <Text style={styles.titulo}>Seja bem-vindo ao Mural Acadêmico! 👋</Text>
            <Text style={styles.subtitulo}>
              Para personalizarmos o seu feed de eventos, avisos e comunicados do campus, selecione de 3 a 5 cursos de seu interesse na próxima etapa.
            </Text>
          </View>
        </Step>

        {/* PASSO 2: Seleção de Cursos */}
        <Step title="Cursos">
          <View style={styles.stepContent}>
            <Text style={styles.titulo}>Selecione seus Cursos</Text>
            <Text style={styles.contadorText}>
              Selecionados: <Text style={styles.destaqueContador}>{totalSelecionados}/5</Text>{' '}
              {atingiuMaximo ? '(Máximo atingido 🔒)' : totalSelecionados < 3 ? '(Mínimo de 3 obrigatório)' : '✓ Pronto para avançar'}
            </Text>

            <ScrollView style={styles.listaScroll} showsVerticalScrollIndicator={true}>
              {cursosDisponiveis && cursosDisponiveis.length > 0 ? (
                cursosDisponiveis.map((curso) => {
                  const itemKey = curso.id || curso.titulo;
                  const selecionado = cursosSelecionados.includes(itemKey);
                  const desativado = atingiuMaximo && !selecionado;

                  return (
                    <TouchableOpacity
                      key={itemKey}
                      activeOpacity={desativado ? 1 : 0.7}
                      style={[
                        styles.cardCurso,
                        selecionado && styles.cardCursoSelecionado,
                        desativado && styles.cardCursoDesativado,
                      ]}
                      onPress={() => !desativado && toggleCurso(itemKey)}
                    >
                      <Text
                        style={[
                          styles.nomeCurso,
                          selecionado && styles.nomeCursoSelecionado,
                          desativado && styles.nomeCursoDesativado,
                        ]}
                      >
                        {curso.titulo || curso.nome}
                      </Text>
                      {selecionado ? (
                        <Text style={styles.checkIcon}>✓</Text>
                      ) : desativado ? (
                        <Text style={styles.lockIcon}>🔒</Text>
                      ) : null}
                    </TouchableOpacity>
                  );
                })
              ) : (
                <Text style={styles.textoVazio}>Carregando cursos disponíveis...</Text>
              )}
            </ScrollView>
          </View>
        </Step>

        {/* PASSO 3: Revisão */}
        <Step title="Revisão">
          <View style={styles.stepContent}>
            <Text style={styles.titulo}>Tudo pronto para começar! 🚀</Text>
            <Text style={styles.subtitulo}>
              Você selecionou <Text style={styles.bold}>{totalSelecionados} cursos</Text> de interesse:
            </Text>

            <View style={styles.resumoContainer}>
              {nomesCursosSelecionados.map((curso, idx) => (
                <View key={idx} style={styles.resumoItem}>
                  <Text style={styles.resumoBullet}>•</Text>
                  <Text style={styles.resumoTexto}>{curso.titulo || curso.nome}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.descricaoFinal}>
              Os eventos e avisos relacionados a esses cursos terão destaque exclusivo no seu carrossel e calendário.
            </Text>
          </View>
        </Step>
      </Stepper>
    </View>
  );
}
