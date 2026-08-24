/* =========================================================
   COMMON SCRIPT
   Shared across every page (index.html, aboutme.html, project.html).
   Load this before any page-specific script (main.js / about.js / project.js).

   1. splitLetters()      - wraps a heading's text in .letter spans
   2. revealLetters()     - the drop/rise-in stagger animation for those
   3. observeTitle()      - reveals a split heading once it scrolls into view
   4. revealOnScroll()    - generic fade/mask reveal for any list of elements,
                            each animating independently as IT scrolls into
                            view (not all at once) - used by story.js for
                            image masks.
   5. splitWords()        - wraps a paragraph's text in .word spans
   6. revealWordsOnScroll()- word-by-word reveal for body copy, each
                            paragraph triggering its own stagger the
                            moment IT scrolls into view.
   7. initFooterClock()   - live India-time readout in the shared footer
   ========================================================= */

function splitLetters(el) {
  const text = el.textContent;
  el.innerHTML = '';
  text.split('').forEach(char => {
    const span = document.createElement('span');
    span.classList.add('letter');
    // A lone space as the entire content of an inline-block box gets
    // trimmed to zero width by the browser; U+00A0 renders the same
    // but isn't collapsible, so word gaps (e.g. "ANUJ DEBNATH") survive.
    span.textContent = char === ' ' ? ' ' : char;
    el.appendChild(span);
  });
  return el.querySelectorAll('.letter');
}

function revealLetters(letters) {
  gsap.to(letters, {
    y: '0%',
    duration: 0.8,
    ease: 'power2.out',
    stagger: { each: 0.05, from: 'center' }
  });
}

// Titles below the fold reveal once scrolled into view; reuses the
// same stagger/ease as an on-load hero entrance for a consistent feel.
function observeTitle(letters) {
  const target = letters[0]?.parentElement;
  if (!target) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        revealLetters(letters);
        observer.unobserve(target);
      }
    });
  }, { threshold: 0.4 });
  observer.observe(target);
}

// Generic scroll reveal: each element in `elements` animates from
// `fromVars` to `toVars` independently, the moment IT crosses into
// view - so a long page of copy/images reveals progressively as you
// scroll rather than all firing together on load.
function revealOnScroll(elements, fromVars, toVars, opts = {}) {
  const list = Array.from(elements);
  if (!list.length) return;
  gsap.set(list, fromVars);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        gsap.to(entry.target, toVars);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: opts.threshold ?? 0.2, rootMargin: opts.rootMargin ?? '0px 0px -60px 0px' });
  list.forEach(el => observer.observe(el));
}

// Wraps every word in its own inline-block span (needed for GSAP to
// move/fade them individually) while leaving the whitespace between
// them as plain text nodes, so normal word-wrapping still works.
// Walks the DOM recursively rather than flattening to textContent, so
// any inline markup already inside the paragraph (an icon <svg>, a
// colored <span>) survives untouched instead of being wiped out.
function splitWords(el) {
  function walk(node) {
    Array.from(node.childNodes).forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        if (!child.textContent) return;
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(token => {
          if (token === '') return;
          if (/^\s+$/.test(token)) {
            frag.appendChild(document.createTextNode(token));
          } else {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = token;
            frag.appendChild(span);
          }
        });
        node.replaceChild(frag, child);
      } else if (child.nodeType === Node.ELEMENT_NODE && !child.classList.contains('word')) {
        walk(child);
      }
    });
  }
  walk(el);
  return el.querySelectorAll('.word');
}

// Each paragraph gets its own word-split + its own trigger, so a long
// page of copy reveals word-by-word, paragraph-by-paragraph as you
// scroll - never all at once.
function revealWordsOnScroll(paragraphs, opts = {}) {
  Array.from(paragraphs).forEach(p => {
    const words = splitWords(p);
    if (!words.length) return;
    gsap.set(words, { opacity: 0, y: 6 });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.to(words, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power1.out',
            stagger: 0.025
          });
          observer.unobserve(p);
        }
      });
    }, { threshold: opts.threshold ?? 0.3, rootMargin: opts.rootMargin ?? '0px 0px -40px 0px' });
    observer.observe(p);
  });
}

function initFooterClock() {
  const footerClockEl = document.getElementById('footerClock');
  if (!footerClockEl) return;

  function update() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    footerClockEl.textContent = `INDIA: (GMT+5:30) ${timeStr}`;
  }

  update();
  setInterval(update, 30000);
}

initFooterClock();
