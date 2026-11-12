# 🎓 Portal Acadêmico & Mural Institucional (Estácio)

[![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.com)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Firebase Hosting](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)

Sistema multiplataforma (Web e Mobile) desenvolvido para otimizar a comunicação institucional, gestão de eventos, comunicados e serviços acadêmicos entre a Gerência Acadêmica, Coordenadores e Estudantes.

---

## 🚀 Acesse a Aplicação

Experimente a versão em produção hospedada no Firebase Hosting:

👉 **[https://estacioapp-17a0d.web.app/](https://estacioapp-17a0d.web.app/)**

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:** React Native, Expo, React Native Web, Tailwind / Estilizações Personalizadas.
* **Gerenciamento de Estado & Hooks:** Hooks customizados para lógica de negócio isolada.
* **Backend & Banco de Dados:** Supabase (PostgreSQL, Storage para mídias e autenticação relacional).
* **Deploy & Hospedagem:** Firebase Hosting.

---

## ⚙️ Funcionalidades Principais

* **Controle de Acesso Baseado em Perfis (RBAC):**
  * *Gerência Acadêmica / Admin:* Visibilidade global do mural, criação de comunicados institucionais e gestão completa de cursos e serviços.
  
  * *Coordenadores:* Acesso restrito e focado na gestão do seu próprio curso, publicações autorais e controle de serviços locais.
  
  * *Estudantes:* Visualização de eventos, integração com o calendário de notificações e busca inteligente por cursos.

* **Mural de Publicações e Eventos:** Sistema dinâmico com suporte a imagens otimizadas, proporções customizáveis e redirecionamento de links externos (Google Meet / Links Úteis).

* **Busca Inteligente:** Filtros dinâmicos por título, descrição e nome de cursos nas abas de busca e painéis administrativos.

---

## 📦 Como Executar o Projeto Localmente

Siga os passos abaixo para clonar e rodar o projeto na sua máquina:

1. **Clone o repositório:** [https://github.com/Karlos-Eduardo-Mrqs/EstacioApp.git](https://github.com/Karlos-Eduardo-Mrqs/EstacioApp.git)

2. Instale as dependências:

```bash
npm install
```

3. Inicie o projeto limpando o cache do Metro Bundler:

```Bash
npx expo start --clear
```

## 👨‍💻 Desenvolvedores

| 👤 Nome | 💼 Função |
|------|------|
| [**Carlos Eduardo**](https://github.com/Karlos-Eduardo-Mrqs) | FullStack, Arquitetura, UI/UX & Principal Desenvolvedor do Mural |
| [**Lucas Andrade**](https://github.com/Lucas-deAndrade21) | FullStack, Organização do Banco de Dados & Desenvolvedor da Coordenação |
| [**Victor Leon**](https://github.com/VictorLMMartello) | Back-end, Criptografias & Organização do Banco de Dados |
| [**Vinicius Velasco**](https://github.com/vVelasco30) | Full-stack & Principal Desenvolvedor da Gerência Acadêmica |
