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
const aboutImageMaskEl = document.getElementById('aboutImageMask');
const aboutImageReveal = { reveal: 100 };

aboutTl
  .add(() => revealLetters(aboutTitleLetters))
  .to(aboutImageReveal, {
    reveal: 0,
    duration: 1,
    ease: 'power3.inOut',
    onUpdate: () => { aboutImageMaskEl.style.clipPath = `inset(0% 0% ${aboutImageReveal.reveal}% 0%)`; }
  }, '+=0.3');

// Reveals every child of `container` together as one staggered batch
// the moment the container itself scrolls into view, rather than each
// child triggering independently (js/common.js's revealOnScroll does
// the latter - fine for a long page of paragraphs, but a `stagger` on
// a single-element tween is a no-op, so a tight row like a tag list or
// a process flow needs its own container-level observer instead).
function revealGroupOnScroll(container, children, fromVars, toVars) {
  if (!container || !children.length) return;
  gsap.set(children, fromVars);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        gsap.to(children, toVars);
        observer.unobserve(container);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });
  observer.observe(container);
}

// Disciplines - the whole tag row reveals together, each tag nudging
// up slightly with a short stagger.
revealGroupOnScroll(
  document.querySelector('.skill-tags'),
  document.querySelectorAll('.skill-tag'),
  { opacity: 0, y: 10 },
  { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.06 }
);

// Process - same idea, one step after another across the row/column.
revealGroupOnScroll(
  document.querySelector('.process-flow'),
  document.querySelectorAll('.process-step'),
  { opacity: 0, y: 16 },
  { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08 }
);

// Tools marquee - the strip itself fades in; the tags inside scroll
// continuously via CSS (see .tools-marquee__track in about.css), not
// GSAP, so there's nothing further to trigger here.
revealOnScroll(
  document.querySelectorAll('.tools-marquee'),
  { opacity: 0 },
  { opacity: 1, duration: 0.8, ease: 'power1.out' },
  { threshold: 0.1 }
);

// "Recent work" cursor dot - the ITC image is a link straight to the
// case study (see aboutme.html), so js/common.js's initImageLightbox
// deliberately skips it, leaving it with no cursor at all (native
// pointer hidden via .story-image img { cursor: none }, css/story.css).
// A plain black dot follows the mouse instead, active only while
// hovering that one link.
const cursorDot = document.getElementById('cursorDot');
const recentWorkLink = document.querySelector('a.story-image--full');

if (cursorDot && recentWorkLink) {
  document.addEventListener('mousemove', (e) => {
    cursorDot.style.left = `${e.clientX}px`;
    cursorDot.style.top = `${e.clientY}px`;
  });

  recentWorkLink.addEventListener('mouseenter', () => cursorDot.classList.add('is-active'));
  recentWorkLink.addEventListener('mouseleave', () => cursorDot.classList.remove('is-active'));
}

// Pull quote - words fade in one by one (10% -> 100% opacity) tracking
// the scrollbar directly, rather than story.js's default one-shot
// reveal-on-entry (see the :not(.pull-quote) exclusion in story.js).
// A scroll-scrubbed color fill on the parent <p> runs alongside it -
// color lives on the <p> and the split .word spans inherit it via
// currentColor, so the two tweens never touch the same property and
// compose cleanly.
if (typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  const pullQuoteEl = document.querySelector('.pull-quote');
  if (pullQuoteEl) {
    const pullQuoteWords = splitWords(pullQuoteEl);
    gsap.set(pullQuoteWords, { opacity: 0.1 });

    const pullQuoteTl = gsap.timeline({
      scrollTrigger: {
        trigger: pullQuoteEl,
        start: 'top 85%',
        end: 'top 35%',
        scrub: true
      }
    });

    pullQuoteTl
      .to(pullQuoteEl, {
        color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim() || '#000000',
        ease: 'none'
      }, 0)
      .to(pullQuoteWords, {
        opacity: 1,
        ease: 'none',
        stagger: 0.15
      }, 0);
  }
}
