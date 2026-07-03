document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const COUNT = 80;
    const CONNECT_DIST = 120;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.r = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34,197,94,.4)';
        ctx.fill();
      }
    }

    function init() {
      resize();
      particles = Array.from({ length: COUNT }, () => new Particle());
    }

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(34,197,94,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    init();
    animate();

    const burger = document.getElementById('burgerBtn');
    const menu = document.getElementById('mobileMenu');
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      menu.classList.toggle('open');
    });
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        menu.classList.remove('open');
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('active');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: .15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));

    const certificates = [
      { img: 'img/sertifikat1.png', title: 'Sertifikat 1' },
      { img: 'img/sertifikat2.png', title: 'Sertifikat 2' },
      { img: 'img/sertifikat3.png', title: 'Sertifikat 3' },
      { img: 'img/sertifikat4.png', title: 'Sertifikat 4' },
      { img: 'img/sertifikat5.png', title: 'Sertifikat 5' },
      { img: 'img/sertifikat6.png', title: 'Sertifikat 6' },
      { img: 'img/sertifikat7.png', title: 'Sertifikat 7' },
      { img: 'img/sertifikat8.png', title: 'Sertifikat 8' },
      { img: 'img/sertifikat9.png', title: 'Sertifikat 9' },
      { img: 'img/cyber_usti-1.png', title: 'Cyber USTI' },
      { img: 'img/Workshop_cyber_usti-1.png', title: 'Workshop Cyber USTI' },
      { img: 'img/Sertifikat_YOGA RAMADANI_Fundamental of Associate Network Administrator - Nasional-1.png', title: 'Fundamental Network Administrator' },
    ];

    const certGrid = document.getElementById('certGrid');
    if (certGrid) {
      certificates.forEach((cert, i) => {
        const div = document.createElement('div');
        div.className = 'cert-card';
        div.setAttribute('data-reveal', i % 3 === 0 ? 'left' : i % 3 === 1 ? 'bottom' : 'right');
        div.innerHTML = `
          <img src="${cert.img}" alt="${cert.title}" loading="lazy" />
          <div class="overlay"><span><i class="fas fa-search-plus mr-1.5 text-[10px]"></i>View</span></div>
        `;
        div.addEventListener('click', () => openLightbox(i));
        certGrid.appendChild(div);
        observer.observe(div);
      });
    }

    let lbIdx = 0;
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImg');
    const lbCap = document.getElementById('lbCaption');
    const lbCounter = document.getElementById('lbCounter');

    function openLightbox(idx) {
      lbIdx = idx;
      updateLightbox();
      lb.classList.remove('opacity-0', 'pointer-events-none');
      document.body.style.overflow = 'hidden';
    }

    function updateLightbox() {
      const cert = certificates[lbIdx];
      lbImg.src = cert.img;
      lbImg.alt = cert.title;
      lbCap.textContent = cert.title;
      lbCounter.textContent = `${lbIdx + 1} / ${certificates.length}`;
    }

    document.getElementById('lbClose').addEventListener('click', closeLightbox);
    document.getElementById('lbPrev').addEventListener('click', () => {
      lbIdx = (lbIdx - 1 + certificates.length) % certificates.length;
      updateLightbox();
    });
    document.getElementById('lbNext').addEventListener('click', () => {
      lbIdx = (lbIdx + 1) % certificates.length;
      updateLightbox();
    });

    lb.addEventListener('click', (e) => {
      if (e.target === lb) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('opacity-0')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          lbIdx = (lbIdx - 1 + certificates.length) % certificates.length;
          updateLightbox();
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          lbIdx = (lbIdx + 1) % certificates.length;
          updateLightbox();
        }
      }
    });

    function closeLightbox() {
      lb.classList.add('opacity-0', 'pointer-events-none');
      document.body.style.overflow = '';
    }
  });