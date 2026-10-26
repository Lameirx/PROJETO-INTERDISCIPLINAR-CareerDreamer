# Career Dreamer — Mapeamento Vocacional

> Descubra carreiras em tecnologia que combinam com você.

O **Career Dreamer** é uma página web em que a pessoa conta o que gosta de fazer no tempo livre e o que desperta sua curiosidade. Com essas informações, o sistema devolve um mapa de carreiras em tecnologia, da mais para a menos compatível, com o que estudar primeiro em cada uma.

## Descrição do projeto

A pessoa preenche **nome**, **hobbies** e **áreas de interesse**. Os dados são enviados para uma API com inteligência artificial, que devolve um perfil profissional em JSON. Esse perfil é exibido na página de resultado com:

- uma síntese do perfil;
- as carreiras recomendadas, ordenadas pela compatibilidade (em %);
- as competências-chave de cada carreira;
- um roteiro de estudos numerado, em ordem.

O projeto foi desenvolvido como atividade acadêmica do curso de Análise e Desenvolvimento de Sistemas, a partir de uma versão com defeitos entregue pela professora. Os problemas encontrados estão em [`ISSUES.md`](ISSUES.md) e as correções estão documentadas no Relatório de Correção de Software (RCS), em PDF, neste repositório.

## Público-alvo

- **Estudantes** que querem conhecer carreiras em tecnologia e saber por onde começar a estudar.
- **Instituições de ensino**, como núcleos de carreiras e professores, que aplicam a ferramenta com turmas.

Como parte do público acessa pelo celular, a página funciona em telas pequenas. Ela também foi ajustada para pessoas com baixa visão e para quem usa leitor de tela ou navega só pelo teclado.

## Funcionalidades

**Formulário de perfil (`index.html`)**

- Nome com 2 a 60 caracteres; hobbies e áreas de interesse separados por vírgula.
- Campos obrigatórios com aviso no próprio campo. Espaços sobrando e itens vazios (por exemplo `, , ,`) são ignorados.
- Envio dos dados para a API (`POST` em JSON).
- Durante o envio, o botão mostra que está carregando e não pode ser clicado duas vezes.
- Limite de tempo configurável para a resposta da API.
- Se a API não estiver configurada, demorar demais ou der erro, aparece uma janela (modal) "Tente mais tarde" e o que a pessoa digitou **não é apagado**.

**Página de resultado (`resultado.html`)**

- "Perfil de (nome)" e síntese do perfil.
- Carreiras da mais para a menos compatível, cada uma com título, porcentagem e barra de compatibilidade, resumo, competências-chave (etiquetas) e roteiro de estudos.
- A primeira carreira recebe o selo **"Melhor combinação"**.
- Se a página for aberta sem dados, mostra uma mensagem amigável com um botão para voltar ao formulário.
- Modo de teste sem a API: `resultado.html?exemplo`.

**Qualidade**

- Layout responsivo, testado em tela de celular de 360 px, sem zoom e sem rolagem lateral.
- Acessibilidade: HTML semântico, idioma `pt-BR`, rótulos ligados aos campos, contraste mínimo de 4,5:1 (WCAG AA) e foco visível na navegação por teclado.

## Tecnologias utilizadas

- **HTML5** semântico, incluindo o elemento nativo `<dialog>` para o modal.
- **CSS3**: variáveis CSS, Flexbox e Grid.
- **JavaScript (ES6)** puro, sem frameworks: `async/await`, `fetch`, `AbortSignal.timeout`, módulos de lógica simples e `sessionStorage` para levar o resultado do formulário até a página de resultado.
- **API REST** com respostas em JSON.
- **Git e GitHub** para versionamento; **VS Code com Live Server** (opcional) para desenvolvimento.

## Requisitos mínimos

- Navegador atualizado: Chrome ou Edge 103+, Firefox 100+ ou Safari 16+.
- Conexão com a internet para consultar a API.
- O endereço da API, fornecido pela professora (cada grupo configura o seu).
- Opcional: [VS Code](https://code.visualstudio.com/) com a extensão **Live Server**.

Não é necessário instalar nada nem usar Node.js: o projeto não tem etapa de compilação.

## Instruções para execução

1. **Obtenha o projeto**: no GitHub, use *Code → Download ZIP* e extraia a pasta, ou clone o repositório com `git clone` e o endereço do seu repositório.

2. **Configure a API**: abra `js/config.js` e preencha o endereço **completo** do endpoint em `API_URL`:

   ```js
   const CONFIG = Object.freeze({
     API_URL: 'http://127.0.0.1:8000/api/career-match',
     TEMPO_LIMITE_MS: 60000,
     CHAVE_RESULTADO: 'careerDreamer:resultado',
   });
   ```

   Enquanto `API_URL` estiver vazio (`''`), o botão do formulário mostra o modal "Tente mais tarde".

3. **Execute**:
   - **Opção recomendada:** no VS Code, clique com o botão direito em `index.html` e escolha *Open with Live Server*. A página recarrega sozinha a cada alteração salva.
   - **Opção simples:** dê um duplo clique em `index.html` para abrir no navegador.

4. **Teste sem a API**: abra `resultado.html?exemplo` (ou clique em "Ver um resultado de exemplo" no rodapé da página inicial).

**Observações**

- Se a API estiver em um plano gratuito de hospedagem (por exemplo, Render), a primeira requisição depois de um tempo parado pode levar cerca de 1 minuto. O limite de 60 segundos em `TEMPO_LIMITE_MS` considera isso.
- Se o navegador bloquear a requisição por CORS, é preciso que o servidor da API permita a origem da página. Isso é uma configuração do backend.

## Integração com a API

**Requisição:** `POST` para `CONFIG.API_URL`, com `Content-Type: application/json`.

```json
{
  "name": "Ana Maria Clara",
  "hobbies": ["dançar", "cantar", "organizar maratonas de programação"],
  "interests": ["design de jogos", "desenvolvimento de pessoas", "planejar documentos"]
}
```

**Resposta de sucesso** (status `200`):

```json
{
  "user_name": "Ana Maria Clara",
  "career_identity_statement": "Texto curto que resume o perfil da pessoa.",
  "recommended_careers": [
    {
      "id": "ux-ui-designer",
      "title": "Designer de UX/UI",
      "match_score": 92,
      "summary": "O que essa profissão faz, em uma ou duas frases.",
      "key_skills": ["Figma", "Pesquisa com usuários"],
      "learning_path": ["Passo 1", "Passo 2", "Passo 3"]
    }
  ]
}
```

Qualquer status diferente de `2xx` é tratado como erro. A quantidade de carreiras pode variar. Um exemplo completo está em `js/dados-exemplo.js`.

## Estrutura do projeto

```
├── index.html            → formulário
├── resultado.html        → página de resultado
├── css/
│   └── style.css         → todos os estilos
├── js/
│   ├── config.js         → endereço da API e limite de tempo
│   ├── app.js            → lógica do formulário (validação e envio)
│   ├── resultado.js      → lógica da página de resultado
│   └── dados-exemplo.js  → resposta de exemplo para testes
├── ISSUES.md             → problemas relatados pelo cliente
├── README.md
└── Relatorio_de_correcao_de_software_RCS.pdf
```

## Desenvolvedores

| Nome | RGM |

| Melissa C.Lameiras | 04896622-3 |


## Informações acadêmicas

Atividade das disciplinas **Design Profissional** (Profª Isabella Luiza Souza) e **Desenvolvimento Front-End para Web** (Profª Aline Santos).
