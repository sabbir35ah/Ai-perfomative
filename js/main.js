/* ═══════════════════════════════════════════════════════
   MAIN.JS — Performative site-wide interactivity
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── ACTIVE NAV LINK ── */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  /* ── MOBILE NAV TOGGLE ── */
  const burger = document.getElementById('nav-burger');
  const mobileMenu = document.getElementById('nav-mobile');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
    // Close on outside click
    document.addEventListener('click', e => {
      if (!burger.contains(e.target) && !mobileMenu.contains(e.target)) {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ── NAVBAR SCROLL SHADOW ── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.style.background = window.scrollY > 40
        ? 'rgba(7,5,26,0.97)'
        : 'rgba(7,5,26,0.90)';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── FAQ ACCORDION ── */
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // close all siblings
      item.closest('.faq-list')?.querySelectorAll('.faq-item.open').forEach(o => {
        if (o !== item) o.classList.remove('open');
      });
      item.classList.toggle('open', !isOpen);
    });
  });

  /* ── FILTER TABS (Case Studies, Integrations) ── */
  document.querySelectorAll('[data-filter-group]').forEach(group => {
    const tabs     = group.querySelectorAll('[data-filter]');
    const items    = group.querySelectorAll('[data-category]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;
        items.forEach(item => {
          const cats = item.dataset.category.split(' ');
          const show = filter === 'all' || cats.includes(filter);
          item.style.display = show ? '' : 'none';
        });
      });
    });
  });

  /* ── PRICING TOGGLE (SMB / Enterprise) ── */
  const pricingTabs = document.querySelectorAll('[data-pricing-tab]');
  const pricingSets = document.querySelectorAll('[data-pricing-set]');
  pricingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      pricingTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.dataset.pricingTab;
      pricingSets.forEach(set => {
        set.style.display = set.dataset.pricingSet === target ? '' : 'none';
      });
    });
  });

  /* ── BILLING TOGGLE (Monthly / Yearly) ── */
  const billingTabs = document.querySelectorAll('[data-billing]');
  billingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      billingTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const mode = tab.dataset.billing;
      document.querySelectorAll('[data-price-monthly]').forEach(el => {
        const m = el.dataset.priceMonthly;
        const y = el.dataset.priceYearly;
        el.textContent = mode === 'yearly' ? y : m;
      });
      // Show/hide yearly discount badge
      document.querySelectorAll('.price-yearly-badge').forEach(b => {
        b.style.opacity = mode === 'yearly' ? '1' : '0';
      });
    });
  });

  /* ── PLATFORM PICKER TABS (SMB page) ── */
  document.querySelectorAll('[data-platform-group]').forEach(group => {
    const tabs    = group.querySelectorAll('[data-platform-tab]');
    const panels  = group.querySelectorAll('[data-platform-panel]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.platformTab;
        group.querySelector(`[data-platform-panel="${target}"]`)?.classList.add('active');
      });
    });
  });

  /* ── SMOOTH SCROLL FOR ANCHOR LINKS ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── PARTNER FORM SUBMIT ── */
  const partnerForm = document.getElementById('partner-form');
  if (partnerForm) {
    partnerForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = partnerForm.querySelector('[type=submit]');
      const orig = btn.textContent;
      btn.textContent = 'Application Sent!';
      btn.style.background = '#16A34A';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.disabled = false;
        partnerForm.reset();
      }, 3000);
    });
  }

  /* ── COUNT-UP ANIMATION (Numbers page) ── */
  const countEls = document.querySelectorAll('[data-countup]');
  if (countEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseFloat(el.dataset.countup);
        const suffix = el.dataset.suffix || '';
        const dur    = 1600;
        const start  = performance.now();
        const tick   = now => {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          el.textContent = (Number.isInteger(target)
            ? Math.round(target * ease)
            : (target * ease).toFixed(1)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.unobserve(el);
      });
    }, { threshold: 0.5 });
    countEls.forEach(el => io.observe(el));
  }

});
