/**
 * Página do formulário (index.html).
 * Lê os dados do formulário, valida, limpa e envia para a API (#10, #11, #12).
 */
const formulario = document.querySelector('#form-perfil');
const modalErro = document.querySelector('#modal-erro');
const btnFecharModal = document.querySelector('#btn-fechar-modal');

// Funções de controle do Modal (#11)
function abrirModal() {
  if (modalErro) {
    modalErro.setAttribute('open', '');
    modalErro.removeAttribute('hidden');
    btnFecharModal.focus();
  }
}

function fecharModal() {
  if (modalErro) {
    modalErro.removeAttribute('open');
    modalErro.setAttribute('hidden', '');
  }
}

if (btnFecharModal) {
  btnFecharModal.addEventListener('click', fecharModal);
}

if (modalErro) {
  modalErro.addEventListener('click', (e) => {
    const rect = modalErro.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.bottom &&
      rect.left <= e.clientX &&
      e.clientX <= rect.right
    );
    if (!isInDialog) {
      fecharModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalErro.hasAttribute('open')) {
      fecharModal();
    }
  });
}

// Manipulação do envio do formulário
if (formulario) {
  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const campos = formulario.elements;
    const nome = campos.nome.value.trim();
    
    // Tratamento e limpeza rigorosa dos hobbies e interesses (#10)
    const hobbiesBrutos = campos.hobbies.value.split(',');
    const hobbiesLimpos = hobbiesBrutos
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const interessesBrutos = campos.interesses.value.split(',');
    const interessesLimpos = interessesBrutos
      .map(item => item.trim())
      .filter(item => item.length > 0);

    // Validação de campos vazios ou sem itens válidos após limpeza (#10)
    if (!nome) {
      campos.nome.focus();
      return;
    }

    if (hobbiesLimpos.length === 0) {
      campos.hobbies.setCustomValidity('Informe ao menos um hobby válido.');
      campos.hobbies.reportValidity();
      campos.hobbies.focus();
      return;
    } else {
      campos.hobbies.setCustomValidity('');
    }

    if (interessesLimpos.length === 0) {
      campos.interesses.setCustomValidity('Informe ao menos um interesse válido.');
      campos.interesses.reportValidity();
      campos.interesses.focus();
      return;
    } else {
      campos.interesses.setCustomValidity('');
    }

    const perfil = {
      name: nome,
      hobbies: hobbiesLimpos,
      interests: interessesLimpos,
    };

    // Verificação da API configurada (#12)
    if (!CONFIG || !CONFIG.API_URL || CONFIG.API_URL.trim() === '') {
      abrirModal();
      return;
    }

    const botaoSubmit = formulario.querySelector('button[type="submit"]');
    if (botaoSubmit) {
      botaoSubmit.disabled = true;
      botaoSubmit.textContent = 'Enviando...';
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.TEMPO_LIMITE_MS || 60000);

      const resposta = await fetch(CONFIG.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(perfil),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!resposta.ok) {
        throw new Error('Erro na resposta do servidor');
      }

      const dadosResultado = await resposta.json();
      
      if (typeof CONFIG.CHAVE_RESULTADO === 'string') {
        localStorage.setItem(CONFIG.CHAVE_RESULTADO, JSON.stringify(dadosResultado));
      }

      window.location.href = 'resultado.html';

    } catch (erro) {
      // Se a API demorar demais ou falhar, mostra o modal e mantém os dados (#12)
      abrirModal();
      if (botaoSubmit) {
        botaoSubmit.disabled = false;
        botaoSubmit.textContent = 'Descobrir minha carreira';
      }
    }
  });
}
