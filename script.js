// ===== パーティクル生成 =====
function createParticles() {
  const c = document.getElementById('particles');
  if (!c) return;
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;animation-delay:${Math.random()*14}s;animation-duration:${12+Math.random()*10}s;`;
    c.appendChild(p);
  }
}

// ===== ヘッダースクロール =====
function initHeader() {
  const h = document.getElementById('header');
  if (!h) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        h.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  });
}

// ===== モバイルメニュー =====
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const nav = document.getElementById('nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
    nav.classList.toggle('active');
  });
  nav.querySelectorAll('.nav-link').forEach(link =>
    link.addEventListener('click', () => {
      btn.classList.remove('active');
      nav.classList.remove('active');
    })
  );
}

// ===== スクロールアニメーション =====
function initScrollAnimations() {
  const cards = document.querySelectorAll('.category-card');
  const cardObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = Array.from(cards).indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 100);
        cardObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(card => cardObs.observe(card));

  const fadeItems = document.querySelectorAll('.fade-in-item');
  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  fadeItems.forEach(item => fadeObs.observe(item));
}

// ===== カウントアップアニメーション =====
function initCountUp() {
  const nums = document.querySelectorAll('.stat-number[data-target]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const duration = 1500;
        const start = performance.now();
        function update(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased);
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  nums.forEach(n => obs.observe(n));
}

// ===== カードホバーグロー追従 =====
function initCardGlow() {
  document.querySelectorAll('.category-card').forEach(card => {
    const glow = card.querySelector('.card-glow');
    if (!glow) return;
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(201,168,76,.1), transparent 55%)`;
    });
  });
}

// ===== カードクリックでリンク遷移 =====
function initCardLinks() {
  document.querySelectorAll('.category-card[data-href]').forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const href = card.dataset.href;
      if (href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.location.href = href;
      }
    });
  });
}

// ===== ダークモードトグル =====
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const saved = localStorage.getItem('theme');
  if (saved === 'light') document.body.classList.add('light-mode');

  btn.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    const isLight = document.body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

// ===== 検索フィルター =====
function initSearch() {
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClear');
  const resultsText = document.getElementById('searchResultsText');
  if (!input) return;

  const cards = document.querySelectorAll('.category-card');
  const aiTopics = document.querySelectorAll('.ai-topic-card');

  function doFilter() {
    const q = input.value.trim().toLowerCase();
    clearBtn.classList.toggle('active', q.length > 0);

    if (!q) {
      cards.forEach(c => { c.style.display = ''; c.classList.add('visible'); });
      aiTopics.forEach(c => { c.style.display = ''; });
      resultsText.textContent = '';
      return;
    }

    let count = 0;

    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      const match = text.includes(q);
      card.style.display = match ? '' : 'none';
      if (match) { card.classList.add('visible'); count++; }
    });

    aiTopics.forEach(topic => {
      const text = topic.textContent.toLowerCase();
      const match = text.includes(q);
      topic.style.display = match ? '' : 'none';
      if (match) count++;
    });

    resultsText.textContent = count > 0
      ? `「${input.value.trim()}」に ${count} 件マッチしました`
      : `「${input.value.trim()}」に一致する蔵書はありません`;
  }

  input.addEventListener('input', doFilter);
  clearBtn.addEventListener('click', () => {
    input.value = '';
    doFilter();
    input.focus();
  });
}

// ===== スムーズスクロール =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ===== 初期化 =====
document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  initHeader();
  initMobileMenu();
  initScrollAnimations();
  initCountUp();
  initCardGlow();
  initCardLinks();
  initThemeToggle();
  initSearch();
  initSmoothScroll();
});
