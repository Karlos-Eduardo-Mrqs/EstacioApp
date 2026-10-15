// Lista de rotas válidas mapeadas no projeto (baseado na estrutura do Expo Router)
const ROTAS_VALIDAS = [
  '/','/index','/admin','/evento-detalhe','/modal-desenvolvedores'
];

// Rotas que exigem privilégios de Administrador
const ROTAS_PROTEGIDAS = [
  '/admin'
];

/**
 * Valida se uma rota existe e se o utilizador tem permissão para acessá-la.
 * @param {string} caminho - O caminho da rota (ex: '/admin')
 * @param {boolean} [isAdmin=false] - Indica se o utilizador logado é administrador
 * @returns {object} Resultado contendo o status de validade e mensagem opcional
 */
export function validarRota(caminho, isAdmin = false) {
  if (!caminho) {
    return { valida: false, motivo: 'Caminho não fornecido.' };
  }

  // Remove eventuais parâmetros de query (ex: /evento?id=123 vira /evento)
  const rotaLimpa = caminho.split('?')[0];

  // 1. Verifica se a rota existe no sistema
  const existe = ROTAS_VALIDAS.includes(rotaLimpa);
  if (!existe) {
    return { 
      valida: false, 
      motivo: 'Rota inválida ou não encontrada.' 
    };
  }

  // 2. Verifica se a rota é protegida e exige privilégios de admin
  if (ROTAS_PROTEGIDAS.includes(rotaLimpa) && !isAdmin) {
    return { 
      valida: false, 
      motivo: 'Acesso restrito: Requer permissão de Administrador.' 
    };
  }

  // Rota totalmente válida e permitida
  return { 
    valida: true, 
    motivo: 'Acesso autorizado.' 
  };
}