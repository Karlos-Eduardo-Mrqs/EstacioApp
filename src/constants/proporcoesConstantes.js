export const LISTA_PROPORCOES = [
  { label: 'Horizontal (16:9)', value: '16:9', ratio: 16 / 9 },
  { label: 'Vertical (4:5)', value: '4:5', ratio: 4 / 5 },
  { label: 'Quadrado (1:1)', value: '1:1', ratio: 1 / 1 },
  { label: 'Clássico (4:3)', value: '4:3', ratio: 4 / 3 },     // 👈 Adicionado aqui
  { label: 'Retrato (3:4)', value: '3:4', ratio: 3 / 4 },
  { label: 'Widescreen (21:9)', value: '21:9', ratio: 21 / 9 },
];

export const obterAspectRatioNumerico = (propStr) => {
  const encontrada = LISTA_PROPORCOES.find(item => item.value === propStr);
  if (encontrada) {
    return encontrada.ratio;
  }
  
  // Fallback caso venha algo personalizado
  if (propStr && propStr.includes(':')) {
    const [w, h] = propStr.split(':').map(Number);
    if (w && h) return w / h;
  }

  return 16 / 9;
};