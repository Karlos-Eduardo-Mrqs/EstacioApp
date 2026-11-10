import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Stepper, { Step } from './Stepper';
import {Onboardingstyles as styles} from "../styles/OnboardingCursosStyles";
import BotaoFechar from './botaoFechar'; // 👈 Importa o seu botão de fechar corporativo se preferir

export default function OnboardingCursos({ 
  cursosDisponiveis = [], 
  onConcluirSetup, 
  onPular,
  stepInicial = 1,
  jaConfigurou
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
      {/* ✖️ BOTÃO DE FECHAR SUPERIOR APRIMORADO */}
      {onPular && (
        <View style={styles.headerTopoContainer}>
          <TouchableOpacity style={styles.btnPularHeaderModerno} onPress={onPular} activeOpacity={0.7}>
            <Text style={styles.textoPularHeader}>
              {jaConfigurou ? "Cancelar edição ✕" : "Configurar Depois ✕"}
            </Text>
          </TouchableOpacity>
        </View>
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
        {/* PASSO 1: Boas-vindas */}
        <Step title="Boas-vindas">
          <View style={styles.stepContent}>
            
            {/* 💡 MENSAGEM CONDICIONAL DO POPUP */}
            {jaConfigurou ? (
              <View style={styles.avisoBoxEdicao}>
                <Text style={styles.avisoTextoEdicao}>
                  ℹ️ Como já possui uma lista configurada, você pode cancelar a edição a qualquer momento e <Text style={{ fontWeight: 'bold' }}>refazer a sua lista quando quiser entrando em Configurações</Text>.
                </Text>
              </View>
            ) : (
              <View style={styles.avisoBoxPrimeiroAcesso}>
                <Text style={styles.avisoTextoPrimeiroAcesso}>
                  ⚡ Selecione de 3 a 5 cursos para personalizar o seu feed. Você poderá alterar isso depois nas <Text style={{ fontWeight: 'bold' }}>Configurações</Text>.
                </Text>
              </View>
            )}

            <Text style={styles.titulo}>
              {jaConfigurou ? "Editar seus Cursos ⚙️" : "Seja bem-vindo ao Mural Acadêmico! 👋"}
            </Text>
            
            <Text style={styles.subtitulo}>
              {jaConfigurou 
                ? "Atualize as suas preferências para continuar a receber comunicados direcionados no seu feed."
                : "Para personalizarmos o seu feed de eventos e avisos do campus, selecione de 3 a 5 cursos de seu interesse na próxima etapa."
              }
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
              Lembre-se de que se precisar refazer ou modificar a sua seleção de cursos futuramente, basta entrar na aba de <Text style={{ fontWeight: 'bold' }}>Configurações</Text>.
            </Text>
          </View>
        </Step>
      </Stepper>
    </View>
  );
}