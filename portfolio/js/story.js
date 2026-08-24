/* =========================================================
   STORY SCRIPT
   Wires up scroll reveal for the shared story-block components
   (css/story.css) used by aboutme.html and project.html.
   Depends on splitLetters/splitWords/observeTitle/revealOnScroll/
   revealWordsOnScroll from js/common.js.
   Each element animates independently the moment IT scrolls into
   view, so a long page of copy/images reveals progressively rather
   than all firing at once.
   ========================================================= */

// Lede paragraphs: words appear one by one.
revealWordsOnScroll(document.querySelectorAll('.story-text__lede'));

// Regular body copy: fade + rise in as a whole paragraph.
revealOnScroll(
  document.querySelectorAll('.story-text__body'),
  { opacity: 0, y: 24 },
  { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
);

// Images: the same vertical mask reveal as the hero image.
revealOnScroll(
  document.querySelectorAll('.story-image'),
  { scaleY: 0 },
  { scaleY: 1, duration: 0.9, ease: 'power3.inOut' }
);

// Mid-page section headings (SCRIPT, EXPLORATIONS, Q&A, ...) get the
// same letter drop-in as the page's main title, triggered on scroll
// since these sit further down the page.
document.querySelectorAll('.story-heading').forEach(heading => {
  observeTitle(splitLetters(heading));
});
