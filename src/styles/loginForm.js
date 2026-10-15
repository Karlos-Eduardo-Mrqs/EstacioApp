import { StyleSheet } from 'react-native';
import { CoresInstitucionais } from '../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f8',
  },

  keyboard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',

    borderLeftWidth: 4,
    borderLeftColor: '#f2c500',

    borderRadius: 10,

    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 16,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 4,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,

    backgroundColor: '#e7f1fc',

    alignItems: 'center',
    justifyContent: 'center',

    marginBottom: 12,
  },

  title: {
    fontSize: 21,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 3,
  },

  subtitle: {
    fontSize: 13,
    color: '#777777',
    marginBottom: 16,
  },

  /* Estilos para o alerta visual */
  feedbackBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 6,
    marginBottom: 14,
    gap: 8,
  },
  errorBox: {
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  successBox: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  feedbackText: {
    fontSize: 13,
    flex: 1,
  },
  errorText: {
    color: '#c62828',
  },
  successText: {
    color: '#2e7d32',
  },

  label: {
    fontSize: 13,
    color: '#444444',
    marginBottom: 6,
  },

  input: {
    height: 40,

    borderWidth: 1,
    borderColor: '#dcdfe5',

    borderRadius: 10,

    backgroundColor: '#ffffff',

    paddingHorizontal: 12,

    fontSize: 13,
    color: '#333333',

    marginBottom: 14,
  },

  passwordContainer: {
    height: 40,

    borderWidth: 1,
    borderColor: '#dcdfe5',

    borderRadius: 10,

    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 20,
  },

  passwordInput: {
    flex: 1,

    height: '100%',

    paddingHorizontal: 12,

    fontSize: 13,
    color: '#333333',
  },

  eyeButton: {
    width: 40,
    height: '100%',

    alignItems: 'center',
    justifyContent: 'center',
  },

  loginButton: {
    height: 39,

    backgroundColor: '#1d4bb5',

    borderRadius: 20,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    gap: 6,

    marginBottom: 16,
  },

  loginButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  backButton: {
    alignItems: 'center',
    paddingVertical: 2,
  },

  backText: {
    color: '#1643a5',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});