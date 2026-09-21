// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.topnav__links');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('is-open');
  navLinks.classList.toggle('is-open');
});

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('is-open');
    navLinks.classList.remove('is-open');
  });
});

// Hide top nav on scroll down, show on scroll up
const topnav = document.getElementById('topnav');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  if (currentScrollY > lastScrollY && currentScrollY > 160) {
    topnav.classList.add('is-hidden');
  } else {
    topnav.classList.remove('is-hidden');
  }
  lastScrollY = currentScrollY;

  // Back to top button
  const backToTop = document.getElementById('backToTop');
  if (currentScrollY > 800) {
    backToTop.classList.add('is-visible');
  } else {
    backToTop.classList.remove('is-visible');
  }
}, { passive: true });

// Back to top
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Active nav link highlighting
const sections = document.querySelectorAll('main > section[id], #contact');
const navAnchors = document.querySelectorAll('.topnav__links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navAnchors.forEach((a) => {
        a.classList.toggle('is-active', a.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-45% 0px -45% 0px' });

sections.forEach((section) => sectionObserver.observe(section));

// Scroll reveal animation
// NOTE: this used to rely purely on IntersectionObserver, but that let a
// handful of elements (short ones like .tag lines, and ones inside
// grid/gallery wrappers) get skipped when the browser coalesces layout
// between scroll positions and never reports an intersection for them —
// leaving real content permanently invisible (opacity: 0) for some users.
// To make sure nothing can ever get stuck hidden, revealing is now driven
// by a direct getBoundingClientRect() check on scroll/resize (rAF-throttled),
// which can't skip an element the way batched observer entries can, plus a
// hard safety-net timeout that reveals everything regardless.
const revealTargets = Array.from(document.querySelectorAll('.section__inner > *'));
revealTargets.forEach((el) => el.classList.add('reveal'));

let pendingReveal = revealTargets.slice();

function checkReveal() {
  if (pendingReveal.length === 0) return;
  const vh = window.innerHeight;
  pendingReveal = pendingReveal.filter((el) => {
    const rect = el.getBoundingClientRect();
    const isNear = rect.top < vh * 0.92 && rect.bottom > 0;
    if (isNear) {
      el.classList.add('is-visible');
      return false;
    }
    return true;
  });
}

let revealTicking = false;
function requestRevealCheck() {
  if (revealTicking) return;
  revealTicking = true;
  requestAnimationFrame(() => {
    checkReveal();
    revealTicking = false;
  });
}

window.addEventListener('scroll', requestRevealCheck, { passive: true });
window.addEventListener('resize', requestRevealCheck);
window.addEventListener('load', checkReveal);
document.addEventListener('DOMContentLoaded', checkReveal);
checkReveal();

// Safety net: whatever hasn't been revealed yet (e.g. a very fast scroll,
// a jump via anchor link, or any other edge case) is revealed after a short
// delay so nothing is ever permanently stuck at opacity: 0.
setTimeout(() => {
  pendingReveal.forEach((el) => el.classList.add('is-visible'));
  pendingReveal = [];
}, 1200);
