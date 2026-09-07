/* =========================================================
   REVENUE GROWTH DATA SHEET
   Wires the DATA section's info cards (css/revenue-growth.css
   .data-card) to the Excel-style preview of 02.csv (.sheet-frame) -
   clicking a card highlights the column(s) of the sheet that layer
   of information actually comes from. Single-select: clicking the
   active card again clears the highlight rather than leaving it
   stuck on. Mirrors js/lightrock.js.
   ========================================================= */

const revenueGrowthDataCards = document.querySelectorAll('.data-card');
const revenueGrowthSheetCells = document.querySelectorAll('#revenueGrowthSheet [data-col]');

const clearRevenueGrowthHighlight = () => {
  revenueGrowthSheetCells.forEach(cell => cell.classList.remove('is-highlighted'));
  revenueGrowthDataCards.forEach(card => {
    card.classList.remove('is-active');
    card.setAttribute('aria-pressed', 'false');
  });
};

revenueGrowthDataCards.forEach(card => {
  card.addEventListener('click', () => {
    const wasActive = card.classList.contains('is-active');
    const columns = card.dataset.columns.split(',');

    clearRevenueGrowthHighlight();
    if (wasActive) return;

    card.classList.add('is-active');
    card.setAttribute('aria-pressed', 'true');
    revenueGrowthSheetCells.forEach(cell => {
      if (columns.includes(cell.dataset.col)) cell.classList.add('is-highlighted');
    });
  });
});

// Same fade+rise the DESIGN section's stack images use, since a
// data-grid frame has no <img> to mask-reveal like .story-image.
revealOnScroll(
  document.querySelectorAll('.sheet-frame'),
  { opacity: 0, y: 24 },
  { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
);
