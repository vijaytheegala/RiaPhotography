document.addEventListener('DOMContentLoaded', () => {

  /* ===== PRELOADER ===== */
  const pl = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => pl.classList.add('gone'), 1000);
  });

  /* ===== CURSOR ===== */
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;
  let cursorVisible = false;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    if (!cursorVisible) {
      cursorVisible = true;
      dot.classList.add('visible');
      ring.classList.add('visible');
    }
  });

  (function animRing() {
    rx += (mx - rx) * .13;
    ry += (my - ry) * .13;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .srv-card, .pi, .fb').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('h'));
    el.addEventListener('mouseleave', () => ring.classList.remove('h'));
  });

  /* ===== NAVBAR ===== */
  const nav = document.getElementById('navbar');
  const burger = document.getElementById('burger');
  const navList = document.getElementById('navList');
  const btt = document.getElementById('btt');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', scrollY > 40);
    if (btt) btt.classList.toggle('on', scrollY > 400);
    highlightNav();
  }, { passive: true });

  burger.addEventListener('click', () => {
    burger.classList.toggle('on');
    navList.classList.toggle('open');
  });
  navList.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('on');
    navList.classList.remove('open');
  }));

  function highlightNav() {
    const secs = document.querySelectorAll('section[id]');
    let cur = '';
    secs.forEach(s => { if (scrollY >= s.offsetTop - 110) cur = s.id; });
    document.querySelectorAll('.nl').forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + cur);
    });
  }

  /* ===== SMOOTH SCROLL ===== */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });

  /* ===== COUNTER ANIMATION ===== */
  function countUp(el) {
    const target = +el.getAttribute('data-count');
    let cur = 0;
    const step = target / 55;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = Math.floor(cur);
      if (cur >= target) clearInterval(t);
    }, 25);
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        countUp(e.target);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: .5 });

  document.querySelectorAll('.hp-num').forEach(n => counterObserver.observe(n));

  /* ===== AOS ===== */
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 750, once: true, easing: 'ease-out-quad', offset: 70 });
  }

  /* ===== PORTFOLIO FILTER ===== */
  const fbs = document.querySelectorAll('.fb');
  const pis = document.querySelectorAll('.pi');
  fbs.forEach(b => b.addEventListener('click', () => {
    fbs.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    const f = b.getAttribute('data-f');
    pis.forEach(p => {
      const show = f === 'all' || p.classList.contains(f);
      p.style.transition = 'all .35s ease';
      if (show) {
        p.style.display = '';
        requestAnimationFrame(() => { p.style.opacity = '1'; p.style.transform = 'scale(1)'; });
      } else {
        p.style.opacity = '0'; p.style.transform = 'scale(.92)';
        setTimeout(() => p.style.display = 'none', 350);
      }
    });
  }));

  /* ===== LIGHTBOX ===== */
  const lb = document.getElementById('lb');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');

  if (lb && lbImg && lbClose) {
    document.querySelectorAll('.pi img').forEach(img => {
      img.parentElement.addEventListener('click', () => {
        lbImg.src = img.src;
        lb.classList.add('on');
        document.body.style.overflow = 'hidden';
      });
    });
    const closeLb = () => { lb.classList.remove('on'); document.body.style.overflow = ''; };
    lbClose.addEventListener('click', closeLb);
    lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLb(); });
  }

  /* ===== TESTIMONIAL SLIDER ===== */
  const track = document.getElementById('testiTrack');
  const dotsC = document.getElementById('tDots');
  const tPrev = document.getElementById('tPrev');
  const tNext = document.getElementById('tNext');
  const cards = track ? [...track.querySelectorAll('.testi-card')] : [];
  let idx = 0, timer;

  function buildDots() {
    if (!dotsC) return;
    dotsC.innerHTML = '';
    cards.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'tdot' + (i === 0 ? ' on' : '');
      d.addEventListener('click', () => go(i));
      dotsC.appendChild(d);
    });
  }

  function go(i) {
    if (!track) return;
    idx = ((i % cards.length) + cards.length) % cards.length;
    track.style.transform = `translateX(-${idx * 100}%)`;
    document.querySelectorAll('.tdot').forEach((d, j) => d.classList.toggle('on', j === idx));
    clearInterval(timer);
    timer = setInterval(() => go(idx + 1), 5000);
  }

  if (tPrev) tPrev.addEventListener('click', () => go(idx - 1));
  if (tNext) tNext.addEventListener('click', () => go(idx + 1));
  buildDots();
  timer = setInterval(() => go(idx + 1), 5000);

  /* ===== CONTACT FORM → WHATSAPP ===== */
  const cf = document.getElementById('cForm');
  if (cf) {
    cf.addEventListener('submit', e => {
      e.preventDefault();
      const inputs = cf.querySelectorAll('input');
      const name = inputs[0] ? inputs[0].value : '';
      const phone = inputs[1] ? inputs[1].value : '';
      const service = cf.querySelector('select') ? cf.querySelector('select').value : '';
      const msg = cf.querySelector('textarea') ? cf.querySelector('textarea').value : '';
      const text = encodeURIComponent(
        `Hi! I want to book a photoshoot.\n\nName: ${name}\nPhone: ${phone}\nService: ${service}\nMessage: ${msg}`
      );
      window.open(`https://wa.me/919395563930?text=${text}`, '_blank');
    });
  }

  /* ===== BACK TO TOP ===== */
  if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ===== SUBTLE PARALLAX ON HERO GIRL ===== */
  const heroImg = document.querySelector('.hero-img');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      if (scrollY < window.innerHeight) {
        heroImg.style.transform = `translateY(${scrollY * 0.06}px)`;
      }
    }, { passive: true });
  }

});
