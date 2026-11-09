/**
 * Página do formulário (index.html).
 * Valida os dados, envia para a API configurada em CONFIG.API_URL
 * e leva a pessoa para a página de resultado.
 */
const formulario = document.querySelector('#form-perfil');
const botaoEnviar = formulario.querySelector('button[type="submit"]');
const textoBotao = botaoEnviar.textContent;
const modal = document.querySelector('#modal-aviso');
const modalMensagem = document.querySelector('#modal-mensagem');

// "a, , b," vira ["a", "b"]: tira espaços das pontas e ignora itens vazios
const separarLista = (texto) =>
  texto
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '');

const exigir = (campo, valido, mensagem) => campo.setCustomValidity(valido ? '' : mensagem);

const abrirModal = (mensagem) => {
  modalMensagem.textContent = mensagem;
  modal.showModal();
};

const enviarPerfil = async (perfil) => {
  botaoEnviar.disabled = true;
  botaoEnviar.textContent = 'Analisando seu perfil...';

  try {
    const resposta = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(perfil),
      signal: AbortSignal.timeout(CONFIG.TEMPO_LIMITE_MS),
    });

    if (!resposta.ok) {
      throw new Error(`A API respondeu com status ${resposta.status}`);
    }

    const resultado = await resposta.json();
    sessionStorage.setItem(CONFIG.CHAVE_RESULTADO, JSON.stringify(resultado));
    window.location.href = 'resultado.html';
  } catch (erro) {
    console.error('Falha ao consultar a API:', erro);
    abrirModal(
      erro.name === 'TimeoutError'
        ? 'O servidor demorou demais para responder. Tente novamente em instantes.'
        : 'Não foi possível gerar seu perfil agora. Seus dados continuam no formulário. Tente novamente em instantes.',
    );
  } finally {
    botaoEnviar.disabled = false;
    botaoEnviar.textContent = textoBotao;
  }
};

// Ao digitar, limpa o aviso do campo para ele ser revalidado no próximo envio
formulario.addEventListener('input', (evento) => evento.target.setCustomValidity(''));

formulario.addEventListener('submit', (evento) => {
  evento.preventDefault();

  const { nome, hobbies, interesses } = formulario.elements;
  const nomeLimpo = nome.value.trim();
  const listaHobbies = separarLista(hobbies.value);
  const listaInteresses = separarLista(interesses.value);

  exigir(nome, nomeLimpo.length >= 2, 'Informe um nome com pelo menos 2 letras.');
  exigir(hobbies, listaHobbies.length > 0, 'Informe pelo menos um hobby.');
  exigir(interesses, listaInteresses.length > 0, 'Informe pelo menos um interesse.');

  if (!formulario.reportValidity()) {
    return;
  }

  if (!CONFIG.API_URL) {
    abrirModal('O serviço de análise ainda não está disponível.');
    return;
  }

  enviarPerfil({
    name: nomeLimpo,
    hobbies: listaHobbies,
    interests: listaInteresses,
  });
});
