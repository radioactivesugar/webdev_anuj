/* =========================================================
   CASE STUDY SCRIPT
   Shared by every case-study page (project.html, bajaj-finance.html,
   undersea-cables.html, ...). Every page's hero must use the ids
   #case-study-title and #caseStudyHeroImage for this to find them.
   On-load entrance for the hero (title letters + image mask), the
   same two-step timeline as the index.html hero. Story content and
   the pager preview images reveal on scroll via js/story.js.
   Also drives a subtle scroll parallax on images that visually
   overlap a heading, via the GSAP ScrollTrigger plugin.
   ========================================================= */

const caseStudyTitleLetters = splitLetters(document.getElementById('case-study-title'));
// Footer wordmark: same split-letter reveal as index.html, triggered
// on scroll since it sits at the bottom of the page.
const footerWordmarkLetters = splitLetters(document.getElementById('footer-wordmark'));
observeTitle(footerWordmarkLetters);

const caseStudyTl = gsap.timeline();

caseStudyTl
  .to('#caseStudyHeroImage', {
    scaleY: 1,
    duration: 1,
    ease: 'power3.inOut'
  })
  .add(() => revealLetters(caseStudyTitleLetters), '-=0.5');

/* ---------------------------------------------------------
   Parallax for images overlapping a heading/text.
   GSAP composes this scroll-linked `y` with the mask reveal's
   `scaleY` on the same element fine (they're separate transform
   components in GSAP's internal cache) - no wrapper div needed.
   The hero image is deliberately excluded: .case-study-hero__meta is
   bottom-aligned to it with plain CSS (`bottom: 0`), which only
   works against the image's untransformed layout box - a parallax
   `y` on top of that would desync the two. */
if (typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  const parallaxTargets = document.querySelectorAll('.story-image--parallax');

  parallaxTargets.forEach(el => {
    gsap.to(el, {
      y: 40,
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });
}
