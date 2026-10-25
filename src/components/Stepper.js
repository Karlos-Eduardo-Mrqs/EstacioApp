import React, { Children, isValidElement, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Stepperstyles as styles } from '../styles/StepperStyles';

export function Step({ children }) {
  return <View style={styles.stepContainer}>{children}</View>;
}

export default function Stepper({
  children,
  step,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  backButtonText = 'Voltar',
  nextButtonText = 'Continuar',
  completeButtonText = 'Entrar no Mural',
  nextButtonProps = {},
}) {
  const steps = Children.toArray(children).filter(isValidElement);
  const total = steps.length;
  const [internalStep, setInternalStep] = useState(initialStep);

  const current = typeof step === 'number' ? step : internalStep;
  const isLast = current === total;

  const handleNext = () => {
    if (isLast) {
      onFinalStepCompleted();
    } else {
      const next = current + 1;
      setInternalStep(next);
      onStepChange(next);
    }
  };

  const handleBack = () => {
    if (current > 1) {
      const prev = current - 1;
      setInternalStep(prev);
      onStepChange(prev);
    }
  };

  return (
    <View style={styles.container}>
      {/* CABEÇALHO COM INDICADORES DE PASSOS */}
      <View style={styles.headerContainer}>
        {steps.map((entry, index) => {
          const num = index + 1;
          const isActive = num === current;
          const isComplete = num < current;

          return (
            <View key={num} style={styles.stepIndicatorWrapper}>
              <View
                style={[
                  styles.indicatorCircle,
                  isActive && styles.indicatorActive,
                  isComplete && styles.indicatorComplete,
                ]}
              >
                <Text
                  style={[
                    styles.indicatorText,
                    (isActive || isComplete) && styles.indicatorTextActive,
                  ]}
                >
                  {isComplete ? '✓' : num}
                </Text>
              </View>
              <Text
                style={[
                  styles.indicatorLabel,
                  isActive && styles.indicatorLabelActive,
                ]}
                numberOfLines={1}
              >
                {entry.props.title || `Passo ${num}`}
              </Text>
            </View>
          );
        })}
      </View>

      {/* CONTEÚDO DO PASSO ATUAL */}
      <View style={styles.bodyContainer}>
        {steps[current - 1]}
      </View>

      {/* RODAPÉ COM OS BOTÕES DE NAVEGAÇÃO */}
      <View style={styles.footerContainer}>
        {current > 1 ? (
          <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.8}>
            <Text style={styles.backButtonText}>← {backButtonText}</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <TouchableOpacity
          style={[
            styles.nextButton,
            nextButtonProps.disabled && styles.disabledButton,
          ]}
          onPress={handleNext}
          disabled={nextButtonProps.disabled}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {isLast ? completeButtonText : nextButtonText} {isLast ? '✓' : '→'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
