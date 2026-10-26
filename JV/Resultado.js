/**
 * Página de resultado (resultado.html).
 * Lê o JSON da API (guardado pelo formulário) ou, com ?exemplo na URL,
 * os dados de js/dados-exemplo.js, e mostra o perfil na tela.
 */
const secaoResultado = document.querySelector('#resultado');
const secaoSemResultado = document.querySelector('#sem-resultado');
const listaCarreiras = document.querySelector('#lista-carreiras');
const modeloCarreira = document.querySelector('#modelo-carreira');

const lerDados = () => {
  if (new URLSearchParams(window.location.search).has('exemplo')) {
    return DADOS_EXEMPLO;
  }

  try {
    return JSON.parse(sessionStorage.getItem(CONFIG.CHAVE_RESULTADO));
  } catch {
    return null;
  }
};

const dadosValidos = (dados) =>
  Boolean(dados) &&
  Array.isArray(dados.recommended_careers) &&
  dados.recommended_careers.length > 0;

// Cria um <li> para cada texto, sempre com textContent (texto vem da API)
const preencherLista = (lista, textos = []) => {
  lista.replaceChildren(
    ...textos.map((texto) => {
      const item = document.createElement('li');
      item.textContent = texto;
      return item;
    }),
  );
};

const criarCartao = (carreira, ehMelhor) => {
  const cartao = modeloCarreira.content.cloneNode(true);

  cartao.querySelector('.carreira').classList.toggle('carreira--principal', ehMelhor);
  cartao.querySelector('.carreira__selo').hidden = !ehMelhor;
  cartao.querySelector('.carreira__titulo').textContent = carreira.title;
  cartao.querySelector('.carreira__percentual').textContent = `${carreira.match_score}%`;
  cartao.querySelector('.barra__nivel').style.setProperty('--nivel', `${carreira.match_score}%`);
  cartao.querySelector('.carreira__resumo').textContent = carreira.summary;
  preencherLista(cartao.querySelector('.chips'), carreira.key_skills);
  preencherLista(cartao.querySelector('.roteiro'), carreira.learning_path);

  return cartao;
};

const dados = lerDados();

if (dadosValidos(dados)) {
  const carreiras = [...dados.recommended_careers].sort((a, b) => b.match_score - a.match_score);

  document.querySelector('#nome-usuario').textContent = dados.user_name;
  document.querySelector('#sintese').textContent = dados.career_identity_statement;
  listaCarreiras.replaceChildren(
    ...carreiras.map((carreira, indice) => criarCartao(carreira, indice === 0)),
  );
  secaoResultado.hidden = false;
} else {
  secaoSemResultado.hidden = false;
}
