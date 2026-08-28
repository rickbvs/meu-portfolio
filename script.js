document.addEventListener('DOMContentLoaded', () => {

  // 1. Menu Mobile Toggle
  const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
}

  // 2. Intersection Observer
  const revealElements = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));

  // 3. Animated Counters
  const counters = document.querySelectorAll('.counter');
  let animated = false;

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          if (target === 0) {
            counter.innerText = '0';
            return;
          }
          let count = 0;
          const increment = target / 40;
          const updateCount = () => {
            count += increment;
            if (count < target) {
              counter.innerText = Math.ceil(count);
              setTimeout(updateCount, 25);
            } else {
              counter.innerText = target;
            }
          };
          updateCount();
        });
        animated = true;
      }
    });
  }, { threshold: 0.5 });

  const metricsSection = document.querySelector('.metrics-grid');
  if (metricsSection) countObserver.observe(metricsSection);

  // 4. Filtro de Modelos
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  // 5. Calculadora de Orçamento em Tempo Real
  const baseRadios = document.querySelectorAll('input[name="projectType"]');
  const addons = document.querySelectorAll('.addon');
  const totalPriceDisplay = document.getElementById('totalPrice');
  const btnSendQuote = document.getElementById('btnSendQuote');

  function calculateTotal() {
    let total = 0;
    
    // Tipo base
    baseRadios.forEach(radio => {
      if (radio.checked) total += parseInt(radio.value);
    });

    // Adicionais
    addons.forEach(addon => {
      if (addon.checked) total += parseInt(addon.value);
    });

    totalPriceDisplay.innerText = total;
    return total;
  }

  baseRadios.forEach(radio => radio.addEventListener('change', calculateTotal));
  addons.forEach(addon => addon.addEventListener('change', calculateTotal));

  // 6. Enviar Orçamento Direto para o WhatsApp
  if (btnSendQuote) {
    btnSendQuote.addEventListener('click', () => {
      const valor = calculateTotal();
      let tipo = document.querySelector('input[name="projectType"]:checked').value === "450" 
        ? "Landing Page Direta" 
        : "Site Institucional Completo";

      const mensagem = `Olá Ricardo! Simulei um orçamento no seu site para um projeto de *${tipo}* com adicionais de segurança, totalizando aproximadamente *R$ ${valor}*. Gostaria de fechar os detalhes!`;
      const url = `https://wa.me/5571996025066?text=${encodeURIComponent(mensagem)}`;
      
      window.open(url, '_blank');
    });
  }

});