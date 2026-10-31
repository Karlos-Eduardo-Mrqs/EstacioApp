import { View } from 'react-native';
import CalendarioAcademico from './CalendarioMural';
import ListaCarrosseis from './ListaCarrosseis';
import BuscaTab from '../tabs/buscaTab';
import NotificacoesTab from '../tabs/notificaTab';
import ConfiguracoesTab from '../tabs/configuracoesTab';
import ParceriasAlunoTab from '../tabs/parceriasTab';

export default function ConteudoAbas({ activeTab, scriptApp, appCtrl, avisosAtivos, onReexibirAviso }) {
  return (
    <View style={{ flex: 1 }}>
      {activeTab === "mural" && (
        <>
            <CalendarioAcademico
                {...scriptApp}
                cursosFavoritos={appCtrl.cursosSelecionados}
                onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)}
                avisosAtivos={avisosAtivos}
                onReexibirAviso={onReexibirAviso}
            />
          
            <ListaCarrosseis
                {...scriptApp}
                onSelectCurso={(curso) => appCtrl.setCursoSelecionado(curso)}
                onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)}
                cursosFavoritosIds={appCtrl.cursosSelecionados}
            />
        </>
      )}

      {activeTab === "busca" && (
        <BuscaTab 
          eventosLista={scriptApp.todosOsEventos} 
          onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)} 
          onNotificar={(ev) => scriptApp.salvarNotificacao(ev)} 
        />
      )}

      {activeTab === "notificacoes" && (
        <NotificacoesTab
          notificacoes={scriptApp.notificacoesSalvas}
          onRemover={(id) => scriptApp.removerNotificacao(id)}
          onSelectEvento={(ev) => scriptApp.setEventoSelecionado(ev)}
        />
      )}

      {/* 👈 2. Renderização da Aba de Parcerias para o Aluno */}
      {activeTab === "parcerias" && (
        <ParceriasAlunoTab />
      )}

      {activeTab === "configuracoes" && (
        <ConfiguracoesTab 
          isDesktop={appCtrl.isDesktop}
          onOpenDevs={() => appCtrl.setModalDevsVisivel(true)}
          onRedefinirCursos={appCtrl.handleRedefinirCursos}
          cursosSelecionados={appCtrl.cursosSelecionados}
          cursosDisponiveis={scriptApp.cursos}
          onOpenSobre={() =>
            scriptApp.exibirPopup(
              "ℹ️ Sobre o Mural Acadêmico",
              "Mural Acadêmico - Estácio Nova América v1.0.",
              "sucesso"
            )
          }
        />
      )}
    </View>
  );
}