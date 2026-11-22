// src/components/painel/painelAcessos.js
import GerenciarEventos from "./eventos/painelEventos";
import NotificacaoGlobalTab from "./notificacoes/notificacaoGlobalTab";
import PainelCursos from "./cursos/painelCursos";
import PainelServicos from "./servicos/painelServicos";
import ParceriaTab from "./parcerias/parceriaTab";
import PainelPublicacoes from "./publicacoes/painelPublicacoes";
import GerenciarUsuarios from "./usuarios/painelGerenciarUsuarios";
import PainelInscricoes from "./inscricao/painelInscricao";

export const PERFIS_PERMITIDOS_PAINEL = [
  "Gerência Acadêmica",
  "Coordenador",
  "Gerencia",
];

export const ITENS_PAINEL = [
  {
    id: "utilizadores",
    label: "Coordenadores",
    icon: "person-circle-outline",
    apenasGerencia: true,
    component: GerenciarUsuarios,
  },
  {
    id: "publicacoes",
    label: "Publicações",
    icon: "document-text-outline",
    apenasGerencia: false,
    component: PainelPublicacoes,
  },
  {
    id: "eventos",
    label: "Eventos",
    icon: "calendar",
    apenasGerencia: false,
    component: GerenciarEventos,
  },
  {
    id: "inscricao",
    label: "Inscrições",
    icon: "chatbubbles-outline",
    apenasGerencia: false,
    component: PainelInscricoes,
  },
  {
    id: "notificacao",
    label: "Notificação Global",
    icon: "bell",
    apenasGerencia: false,
    component: NotificacaoGlobalTab,
  },
  {
    id: "parcerias",
    label: "Parcerias",
    icon: "card-outline",
    apenasGerencia: true,
    component: ParceriaTab,
  },
  {
    id: "servicos",
    label: "Serviços",
    icon: "business-outline",
    apenasGerencia: false,
    component: PainelServicos,
  },
  {
    id: "cursos",
    label: "Cursos",
    icon: "book-outline",
    apenasGerencia: false,
    component: PainelCursos,
  },
];

export function verificarCoordenador(usuarioAtual) {
  const perfilStr = usuarioAtual?.perfil
    ? usuarioAtual.perfil.trim().toLowerCase()
    : "";
  return perfilStr.includes("coordenador");
}

export function obterAbaInicial(ehCoordenador) {
  return ehCoordenador ? "eventos" : "utilizadores";
}

export function obterTituloPainel(ehCoordenador) {
  return ehCoordenador ? "Área do Coordenador" : "Gestão Acadêmica";
}

export function obterItensPermitidos(ehCoordenador) {
  return ITENS_PAINEL.filter((item) => !item.apenasGerencia || !ehCoordenador);
}

export function obterComponenteAba(abaAtiva, ehCoordenador) {
  const itensPermitidos = obterItensPermitidos(ehCoordenador);
  const itemEncontrado = itensPermitidos.find((item) => item.id === abaAtiva);
  return itemEncontrado ? itemEncontrado.component : null;
}