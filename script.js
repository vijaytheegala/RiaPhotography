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

  /* ===== LUXURY AMBIENT GOLDEN PARTICLES IN HERO ===== */
  const canvas = document.getElementById('heroParticles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0, height = 0;
    let particles = [];
    let animId = null;
    let isVisible = true;

    function resize() {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      width = canvas.width = rect.width;
      height = canvas.height = rect.height;
    }

    class Particle {
      constructor() {
        this.reset(true);
      }
      reset(init = false) {
        this.x = Math.random() * (width || window.innerWidth);
        this.y = init ? Math.random() * (height || window.innerHeight) : (height || window.innerHeight) + 10;
        this.size = Math.random() < 0.25 ? Math.random() * 2.8 + 2.2 : Math.random() * 1.5 + 0.8;
        this.isBokeh = this.size > 2.2;
        this.speedY = Math.random() * 0.45 + 0.15;
        this.speedX = (Math.random() - 0.5) * 0.25;
        this.pulseSpeed = Math.random() * 0.02 + 0.008;
        this.pulse = Math.random() * Math.PI;
        this.maxAlpha = this.isBokeh ? Math.random() * 0.22 + 0.08 : Math.random() * 0.45 + 0.25;
        this.alpha = 0;
      }
      update() {
        this.y -= this.speedY;
        this.x += this.speedX + Math.sin(this.pulse) * 0.18;
        this.pulse += this.pulseSpeed;
        this.alpha = (Math.sin(this.pulse) + 1) * 0.5 * this.maxAlpha;

        if (this.y < -15 || this.x < -20 || this.x > width + 20) {
          this.reset(false);
        }
      }
      draw() {
        if (this.alpha <= 0.01) return;
        ctx.save();
        if (this.isBokeh) {
          const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.5);
          grad.addColorStop(0, `rgba(225, 195, 138, ${this.alpha})`);
          grad.addColorStop(0.5, `rgba(201, 169, 110, ${this.alpha * 0.4})`);
          grad.addColorStop(1, 'rgba(201, 169, 110, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.shadowBlur = 8;
          ctx.shadowColor = 'rgba(218, 185, 128, 0.8)';
          ctx.fillStyle = `rgba(235, 205, 150, ${this.alpha})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    function initParticles() {
      resize();
      const count = window.innerWidth < 768 ? 20 : 36;
      particles = Array.from({ length: count }, () => new Particle());
    }

    function loop() {
      if (!isVisible) return;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      animId = requestAnimationFrame(loop);
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          if (!animId) loop();
        } else if (animId) {
          cancelAnimationFrame(animId);
          animId = null;
        }
      }, { threshold: 0.05 });

      const heroSection = document.getElementById('home');
      if (heroSection) observer.observe(heroSection);
    }

    window.addEventListener('resize', () => {
      resize();
    }, { passive: true });

    initParticles();
    loop();
  }

});
