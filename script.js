document.addEventListener('DOMContentLoaded', () => {

  const WA_NUMBER = '5571996025066';
  const waLink = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

  // 1. Links de WhatsApp: cada botão tem sua mensagem em data-wa
  document.querySelectorAll('[data-wa]').forEach(a => {
    a.href = waLink(a.dataset.wa);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // 2. Menu mobile
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  const closeMenu = () => {
    if (!navMenu) return;
    navMenu.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Abrir menu');
    navToggle.querySelector('i').className = 'fa-solid fa-bars';
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('active');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      navToggle.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    });

    navMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // 3. Barra de navegação que esconde ao rolar para baixo
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      const current = window.pageYOffset || document.documentElement.scrollTop;
      const menuOpen = navMenu && navMenu.classList.contains('active');

      if (navbar && !menuOpen) {
        if (current > lastScroll && current > 120) {
          navbar.classList.add('navbar--hidden');
        } else {
          navbar.classList.remove('navbar--hidden');
        }
      }
      lastScroll = current <= 0 ? 0 : current;
      ticking = false;
    });
  }, { passive: true });

  // 4. Monte seu pedido: resumo ao vivo + mensagem pronta para o WhatsApp
  const bizInput = document.getElementById('bizName');
  const typeRadios = document.querySelectorAll('input[name="projectType"]');
  const addons = document.querySelectorAll('.addon');
  const sumBiz = document.getElementById('sumBiz');
  const sumType = document.getElementById('sumType');
  const sumExtras = document.getElementById('sumExtras');
  const btnSendQuote = document.getElementById('btnSendQuote');

  function getSelection() {
    const checked = document.querySelector('input[name="projectType"]:checked');
    return {
      biz: bizInput ? bizInput.value.trim() : '',
      type: checked ? checked.value : '',
      extras: Array.from(addons).filter(a => a.checked).map(a => a.value)
    };
  }

  function renderSummary() {
    const { biz, type, extras } = getSelection();
    sumBiz.textContent = biz || 'Não informado';
    sumType.textContent = type;
    sumExtras.textContent = extras.length ? extras.join(', ') : 'Nenhum por enquanto';
  }

  function buildMessage({ biz, type, extras }) {
    const lines = ['Olá, Ricardo! Montei o meu pedido no seu site e gostaria de conversar sobre valor e prazo.', ''];
    if (biz) lines.push(`*Meu negócio:* ${biz}`);
    lines.push(`*Tipo de site:* ${type}`);
    lines.push(`*Extras:* ${extras.length ? extras.join(', ') : 'nenhum por enquanto'}`);
    lines.push('', 'Pode me passar um orçamento?');
    return lines.join('\n');
  }

  if (sumBiz && sumType && sumExtras) {
    if (bizInput) bizInput.addEventListener('input', renderSummary);
    typeRadios.forEach(r => r.addEventListener('change', renderSummary));
    addons.forEach(a => a.addEventListener('change', renderSummary));
    renderSummary();
  }

  if (btnSendQuote) {
    btnSendQuote.addEventListener('click', () => {
      window.open(waLink(buildMessage(getSelection())), '_blank', 'noopener');
    });
  }

  // 5. Botão flutuante: aparece depois do topo e some na chamada final (que já tem botão)
  const waFloat = document.getElementById('waFloat');
  const hero = document.getElementById('topo');
  const contact = document.getElementById('contato');

  if (waFloat && hero && 'IntersectionObserver' in window) {
    let heroVisible = true;
    let contactVisible = false;
    const update = () => waFloat.classList.toggle('visible', !heroVisible && !contactVisible);

    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      update();
    }).observe(hero);

    if (contact) {
      new IntersectionObserver(([entry]) => {
        contactVisible = entry.isIntersecting;
        update();
      }).observe(contact);
    }
  } else if (waFloat) {
    waFloat.classList.add('visible');
  }

});