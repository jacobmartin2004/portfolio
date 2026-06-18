'use strict';

const menuToggle = document.querySelector('[data-menu-toggle]');
const siteNav = document.querySelector('[data-site-nav]');
const navLinks = document.querySelectorAll('.site-nav a');
const revealItems = document.querySelectorAll('.reveal');
const countItems = document.querySelectorAll('[data-count]');
const sections = document.querySelectorAll('main section[id]');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('is-open');
    siteNav.classList.toggle('is-open');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('is-open');
      siteNav.classList.remove('is-open');
    });
  });
}

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  });
}, {
  threshold: 0.16
});

revealItems.forEach((item) => revealObserver.observe(item));

const animateCount = (element) => {
  const target = Number(element.dataset.count || 0);
  const duration = 1400;
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = String(Math.round(target * eased));

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      element.textContent = `${target}+`;
    }
  };

  requestAnimationFrame(tick);
};

const countObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    animateCount(entry.target);
    observer.unobserve(entry.target);
  });
}, {
  threshold: 0.6
});

countItems.forEach((item) => countObserver.observe(item));

const setActiveLink = () => {
  const scrollY = window.scrollY + 140;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.site-nav a[href="#${id}"]`);

    if (!link) {
      return;
    }

    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach((navLink) => navLink.classList.remove('is-active'));
      link.classList.add('is-active');
    }
  });
};

setActiveLink();
window.addEventListener('scroll', setActiveLink, { passive: true });
