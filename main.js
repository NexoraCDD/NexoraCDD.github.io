(() => {
  'use strict';
  const WA = 'https://wa.me/5535991672959';
  const $ = (s, r = document) => r.querySelector(s);

  // Ano dinâmico
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  // Menu mobile
  const toggle = $('.toggle'), links = $('#menu');
  if (toggle && links) {
    const set = open => { links.classList.toggle('open', open); toggle.setAttribute('aria-expanded', open); };
    toggle.addEventListener('click', () => set(!links.classList.contains('open')));
    links.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  }

  // FAQ expansível
  document.querySelectorAll('.q button').forEach(btn => {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !open);
      btn.nextElementSibling.querySelector('div').inert = open;
    });
    btn.nextElementSibling.querySelector('div').inert = true;
  });

  // Formulário -> mensagem estruturada no WhatsApp
  const form = $('#quote');
  if (!form) return;
  const done = $('#done'), waLink = $('#done-link');
  const rules = {
    name: v => v.trim().length >= 3 || 'Informe seu nome completo.',
    email: (v, el) => (v.trim() && el.validity.valid) || 'Informe um e-mail válido, como nome@exemplo.com.',
    service: v => !!v || 'Escolha o serviço desejado.',
    desc: v => v.trim().length >= 20 || 'Descreva o projeto com pelo menos 20 caracteres.'
  };
  const check = el => {
    const r = rules[el.name]; if (!r) return true;
    const res = r(el.value, el), ok = res === true, err = $('#err-' + el.name);
    el.setAttribute('aria-invalid', !ok); err.textContent = ok ? '' : res; return ok;
  };
  form.querySelectorAll('input,select,textarea').forEach(el => {
    el.addEventListener('blur', () => check(el));
    el.addEventListener('input', () => el.getAttribute('aria-invalid') === 'true' && check(el));
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const bad = [...form.elements].filter(el => rules[el.name] && !check(el));
    if (bad.length) { bad[0].focus(); return; }
    const d = Object.fromEntries(new FormData(form));
    const lines = ['Olá! Gostaria de solicitar um orçamento.', '',
      `*Nome:* ${d.name.trim()}`, `*E-mail:* ${d.email.trim()}`,
      d.company.trim() ? `*Empresa:* ${d.company.trim()}` : false,
      `*Serviço:* ${d.service}`, d.budget ? `*Investimento estimado:* ${d.budget}` : false,
      '', '*Sobre o projeto:*', d.desc.trim()].filter(l => l !== false && l !== undefined);
    const url = `${WA}?text=${encodeURIComponent(lines.join('\n'))}`;
    waLink.href = url;
    done.hidden = false; done.focus();
    window.open(url, '_blank', 'noopener');
  });
})();
