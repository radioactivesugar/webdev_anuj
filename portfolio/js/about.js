/* =========================================================
   ABOUT PAGE SCRIPT
   On-load entrance for the intro hero (name letters + image mask),
   the same two-step timeline as the index.html hero. Everything
   below the intro reveals on scroll via js/story.js.
   ========================================================= */

const aboutTitleLetters = splitLetters(document.getElementById('about-title'));
// Footer wordmark: same split-letter reveal as index.html, triggered
// on scroll since it sits at the bottom of the page.
const footerWordmarkLetters = splitLetters(document.getElementById('footer-wordmark'));
observeTitle(footerWordmarkLetters);

const aboutTl = gsap.timeline();

aboutTl
  .add(() => revealLetters(aboutTitleLetters))
  .to('#aboutImageMask', {
    scaleY: 1,
    duration: 1,
    ease: 'power3.inOut'
  }, '+=0.3');

// Decorative thumbnail rail fades in after the hero settles.
revealOnScroll(
  document.querySelectorAll('.about-intro__thumb'),
  { opacity: 0, y: 12 },
  { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
  { threshold: 0.1 }
);
