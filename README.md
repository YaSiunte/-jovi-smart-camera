# Jovi Smart Camera — versão React

Aplicação que ajuda estudantes a fotografar conteúdos de aula (lousas, slides,
anotações) com feedback inteligente em tempo real sobre iluminação, nitidez e
enquadramento, organizando as fotos por matéria para consulta posterior.

Este repositório contém a migração do protótipo (HTML/CSS/JS puro, feito nas
sprints anteriores) para **React**, usando componentes funcionais organizados
em estrutura de pai para filho, `localStorage` para persistência de dados e
operações com `Math` (arredondamento, médias, geração de ids, cálculo de
prazos).

## Tecnologias utilizadas

- [React 18](https://react.dev/) (componentes funcionais + hooks)
- [Vite](https://vitejs.dev/) como bundler e servidor de desenvolvimento
- [Tesseract.js](https://github.com/naptha/tesseract.js) para reconhecimento
  de texto (OCR) no navegador, usado como parte da análise de qualidade
- `localStorage` do navegador para persistência (fotos, matérias, lixeira e
  histórico)
- CSS puro (sem framework), mantendo a identidade visual do protótipo
  original (paleta escura, tipografia Montserrat + Work Sans)
- Deploy: [Vercel](https://vercel.com/)

## Como instalar as dependências

Pré-requisitos: [Node.js](https://nodejs.org/) 18 ou superior e `npm`.

```bash
# 1. Clone o repositório
git clone <URL-DO-REPOSITORIO>
cd jovi-smart-camera

# 2. Instale as dependências
npm install
```

## Como executar o projeto

```bash
npm run dev
```

O terminal vai exibir um endereço local, geralmente
`http://localhost:5173`. Abra esse endereço no navegador.

> A funcionalidade de câmera (`getUserMedia`) exige HTTPS ou `localhost`.
> Rodando localmente com `npm run dev` isso já é atendido automaticamente.
> No navegador, é necessário permitir o acesso à câmera quando solicitado.

Para gerar a versão de produção (usada no deploy):

```bash
npm run build
npm run preview   # opcional, serve a build localmente
```

## Usuários e senhas para teste

A aplicação tem uma tela de login simulada (sem backend). Use as credenciais
abaixo para entrar:

- **Email:** `aluno@jovi.com`
- **Senha:** `123456`

## Onde e como a IA foi utilizada no projeto

A IA (Claude, da Anthropic) foi utilizada como par de desenvolvimento durante
a migração do protótipo HTML/CSS/JS para React: na definição da
arquitetura de componentes (estrutura pai → filho: `App` → `Header`,
`CapturaView`, `MateriasView`, `EstatisticasView`, `LixeiraView`, `Footer`, e
seus respectivos componentes filhos), na escrita dos hooks customizados de
persistência em `localStorage` (`usePhotos`, `useHistory`, `useAuth`), na
implementação das funções matemáticas usadas para pontuar a qualidade da
imagem (cálculo de brilho e nitidez a partir dos pixels do `canvas`, médias,
arredondamentos e geração de identificadores), na estilização (CSS) mantendo
a identidade visual do protótipo original, e na elaboração deste README. Todo
o código gerado pela IA foi revisado, testado e ajustado pela equipe antes da
entrega.

## Link do Deploy na Vercel

*(atualizar depois de publicar o deploy)*

## Estrutura do projeto

```
src/
├─ components/
│  ├─ layout/        → Header, Footer (usados pelo App)
│  ├─ auth/           → LoginForm
│  ├─ captura/        → CapturaView (câmera + análise) e QualityFeedback (filho)
│  ├─ materias/       → MateriasView, PhotoCard e PhotoModal (filhos)
│  ├─ estatisticas/   → EstatisticasView
│  ├─ lixeira/        → LixeiraView
│  └─ common/         → EmptyState (componente reaproveitado)
├─ hooks/             → useLocalStorage, usePhotos, useHistory, useAuth
├─ utils/             → mathUtils, imageAnalysis, storage
├─ App.jsx            → componente raiz (pai de toda a aplicação)
└─ main.jsx           → ponto de entrada do React
```

## Funcionalidades

- **Captura com feedback inteligente**: análise em tempo real de brilho e
  nitidez (calculados a partir dos pixels do `canvas`) combinada com OCR para
  detectar se o conteúdo está legível, sugerindo ajustes antes de salvar.
- **Organização por matéria**: fotos são salvas em "pastas" por matéria, com
  busca e contadores.
- **Estatísticas**: total de fotos, qualidade média, percentual de boas
  capturas e distribuição por matéria — tudo calculado com `Math`.
- **Histórico de atividades**: registro de capturas, exclusões, restaurações
  e exportações.
- **Lixeira**: fotos excluídas ficam recuperáveis por 7 dias (contagem
  regressiva calculada com `Math`) antes da exclusão definitiva.
- **Exportação**: baixe qualquer foto capturada em PNG.
