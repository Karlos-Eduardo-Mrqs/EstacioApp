const fs = require('fs');
const path = require('path');

const nomesDosIcones = [
  'settings-outline', 'settings', 'calendar-outline', 'calendar', 'home-outline', 'home',
  'search-outline', 'search', 'notifications-outline', 'bell', 'star-outline', 'star',
  'ribbon-outline', 'ribbon', 'time-outline', 'clock', 'log-in-outline', 'person-outline',
  'user', 'lock-closed-outline', 'lock', 'eye-outline', 'eye', 'eye-off-outline', 'eye-off',
  'alert-circle-outline', 'checkmark-circle-outline', 'information-circle-outline', 'info',
  'trash-outline', 'trash', 'instagram', 'logo-instagram', 'linkedin', 'logo-linkedin',
  'github', 'logo-github', 'close', 'close-outline', 'arrow-back', 'book-outline', 'book',
  'library-outline', 'library', 'hardware-chip-outline', 'scale-outline', 'pulse-outline',
  'stats-chart-outline', 'medkit-outline', 'code-slash-outline', 'partner-shops',
  'hand-left-outline', 'school-outline', 'location-outline', 'mail-outline', 
  'document-text-outline', 'megaphone-outline', 'trophy-outline', 'people-outline', 
  'open-outline', 'filter-outline','chatbubbles-outline', 'chatbubbles',
  'document-lock-outline','image-outline',
  'wallet-outline', 'wallet',
  'card-outline',
  'shield-checkmark-outline',
  'person-circle-outline',
  'key-outline',
  'help-circle-outline', 'help-circle',
  'download-outline',
  'print-outline',
  'qr-code-outline',
  'construct-outline',
  'bulb-outline','image-outline',
  'analytics-outline',
  'bookmarks-outline',
  'log-out-outline','create-outline', 'create',
  'pencil-outline', 'pencil','briefcase-outline','fitness-outline',
  'radio-button-on','radio-button-off','add','chevron-down','send-outline','save-outline','chevron-forward','book-sharp',
  "paw-outline",
 "flower-outline",
 "paw-outline",
 "flower-outline",
 "earth-outline",
 "car-sport-outline",
 "airplane-outline",
 "flash-outline",
 "business-outline",
 "restaurant-outline","chevron-up","grid-outline","lock-open-outline"
];

 

async function iniciar() {
  console.log('🔄 Gerando lista de mapeamento com os links diretos dos ícones...');

  let codigo = 'export const globalIcons = {\n';

  nomesDosIcones.forEach((nome) => {
    let nomeMapeado = nome;
    if (nome === 'clock') nomeMapeado = 'time';
    if (nome === 'user') nomeMapeado = 'person';
    if (nome === 'info') nomeMapeado = 'information-circle';
    if (nome === 'bell') nomeMapeado = 'notifications';
    if (nome === 'partner-shops') nomeMapeado = 'people';
    if (nome === 'instagram') nomeMapeado = 'logo-instagram';
    if (nome === 'linkedin') nomeMapeado = 'logo-linkedin';
    if (nome === 'github') nomeMapeado = 'logo-github';
    if (nome === 'lock') nomeMapeado = 'lock-closed';

    // Atribui diretamente o link direto do SVG oficial como valor
    const linkIcone = `https://raw.githubusercontent.com/ionic-team/ionicons/main/src/svg/${nomeMapeado}.svg`;
    codigo += `  '${nome}': '${linkIcone}',\n`;
  });

  codigo += '};\n';

  const pastaComponentes = path.join(__dirname, 'src', 'constants');
  if (!fs.existsSync(pastaComponentes)) {
    fs.mkdirSync(pastaComponentes, { recursive: true });
  }

  const caminhoSaida = path.join(pastaComponentes, 'iconesLocais.js');
  fs.writeFileSync(caminhoSaida, codigo);

  console.log('\n🎉 Processo concluído com sucesso!');
  console.log('📝 Arquivo gerado em: src/components/iconesLocais.js com os links diretos.');
}

iniciar();