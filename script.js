/* ARCANA — interações principais */
(() => {
  'use strict';

  const SUPPORT_EMAIL = 'warcanatarot@gmail.com';
  const form = document.querySelector('#contact-form');
  const nameInput = document.querySelector('#name');
  const emailInput = document.querySelector('#email');
  const interestInput = document.querySelector('#interest');
  const messageInput = document.querySelector('#message');
  const feedback = document.querySelector('#form-feedback');
  const toast = document.querySelector('#toast');
  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.querySelector('#site-nav');
  const themeToggle = document.querySelector('.theme-toggle');

  const year = document.querySelector('#current-year');
  if (year) year.textContent = new Date().getFullYear();

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => toast.classList.remove('show'), 3500);
  }

  // Menu mobile: o JS e o CSS usam a mesma classe .open.
  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
      siteNav.classList.toggle('open', !isOpen);
    });

    siteNav.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', () => {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
        siteNav.classList.remove('open');
      });
    });
  }

  // Alternância de tema claro/escuro.
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-theme');
      themeToggle.setAttribute('aria-label', isLight ? 'Ativar tema escuro' : 'Ativar tema claro');
      themeToggle.setAttribute('title', isLight ? 'Ativar tema escuro' : 'Ativar tema claro');
      themeToggle.textContent = isLight ? '☾' : '☼';
    });
  }

  function chooseInterest(rawValue) {
    if (!interestInput || !rawValue) return;
    const text = rawValue.toLocaleLowerCase('pt-BR');
    let pattern;

    if (text.includes('maiores')) pattern = /e-book arcanos maiores/i;
    else if (text.includes('menores')) pattern = /e-book arcanos menores/i;
    else if (text.includes('curso')) pattern = /curso tarô do zero/i;
    else if (text.includes('leitura') || text.includes('tarô')) pattern = /leitura de tarô/i;
    else pattern = /outros materiais|outro assunto/i;

    const option = Array.from(interestInput.options).find((item) => pattern.test(item.textContent.trim()));
    if (option) interestInput.value = option.value || option.textContent.trim();
  }

  // Preenche o assunto ao clicar em um serviço ou material.
  document.querySelectorAll('[data-service], [data-product]').forEach((link) => {
    link.addEventListener('click', () => chooseInterest(link.dataset.service || link.dataset.product));
  });

  // Formulário: abre o aplicativo de e-mail com a mensagem preparada.
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const customerName = nameInput?.value.trim() || '';
      const customerEmail = emailInput?.value.trim() || '';
      const interest = interestInput?.value.trim() || 'Outro assunto';
      const message = messageInput?.value.trim() || '';
      const subject = `Contato Arcana — ${interest}`;
      const body = [
        'Olá, Arcana!', '',
        'Gostaria de entrar em contato pelo site.', '',
        `Nome: ${customerName}`,
        `E-mail para resposta: ${customerEmail}`,
        `Assunto: ${interest}`, '',
        'Mensagem:', message
      ].join('\n');
      const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      if (feedback) {
        feedback.textContent = 'O aplicativo de e-mail deve abrir com a mensagem pronta. Confira os dados e clique em Enviar para concluir.';
      }
      showToast('Mensagem preparada. Finalize o envio no seu aplicativo de e-mail.');
      window.location.href = mailto;
    });
  }

  // Rolagem suave dos links internos; não interfere com links externos.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (window.history && window.history.replaceState) window.history.replaceState(null, '', targetId);
    });
  });
})();
