/* ============================================================
   TARKOV PUB — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  // --- CONFIG ---
  const CONFIG = {
    inviteUrl: 'https://discord.gg/tvAKkru',
    siteName: 'Tarkov Pub',
  };

  // --- UTILITY ---
  function $(selector) {
    return document.querySelector(selector);
  }

  function $$(selector) {
    return document.querySelectorAll(selector);
  }

  function track(label) {
    try {
      console.log(`[${CONFIG.siteName}] click:`, label, new Date().toISOString());
    } catch (e) { /* silent */ }
  }

  // --- INIT ---
  function init() {
    setupYear();
    setupTracking();
    setupCopyInvite();
    setupScrollTop();
    setupScrollAnimations();
    setupSmoothScroll();
  }

  // Set copyright year
  function setupYear() {
    const el = $('#year');
    if (el) el.textContent = new Date().getFullYear();
  }

  // Track Discord join clicks
  function setupTracking() {
    const ids = ['joinTop', 'joinHero', 'joinSide', 'joinWhy', 'joinFaq', 'joinSticky'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('click', () => track(id));
    });
  }

  // Copy invite link
  function setupCopyInvite() {
    const btn = $('#copyInvite');
    const status = $('#copyStatus');
    if (!btn || !status) return;

    btn.addEventListener('click', async () => {
      track('copyInvite');
      try {
        await navigator.clipboard.writeText(CONFIG.inviteUrl);
        status.textContent = '✅ Invite link copied!';
        btn.textContent = 'Copied!';
        setTimeout(() => {
          status.textContent = '';
          btn.textContent = 'Copy invite';
        }, 3000);
      } catch (e) {
        status.textContent = 'Copy failed — here it is: ' + CONFIG.inviteUrl;
      }
    });
  }

  // Scroll to top
  function setupScrollTop() {
    const btn = $('#scrollTop');
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      track('scrollTop');
    });
  }

  // Intersection Observer for scroll-triggered animations
  function setupScrollAnimations() {
    const targets = $$('.scroll-reveal');
    if (!targets.length || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach(el => observer.observe(el));
  }

  // Smooth scroll for anchor links
  function setupSmoothScroll() {
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        const target = $(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // --- RUN ---
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
