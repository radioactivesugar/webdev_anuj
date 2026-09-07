/* =========================================================
   MAIN SCRIPT (index.html only)
   Shared utilities (splitLetters/revealLetters/observeTitle/
   revealOnScroll/initFooterClock) now live in js/common.js, which is
   loaded before this file.
   1. Hero section        - ported from landing.html
   2. Work section        - featured grid reveal + Archive timeline
                             (Archive block ported from timeline.html)
   ========================================================= */
// Shared by both the hero section's skill nodes and the archive
// timeline below - the same 5 categories, same colors, in both
// places (timeline.csv's own Type column uses these exact names).
const archiveCategories = [
  'Visual Journalism',
  'Graphic Design',
  'Game Design',
  'Web Development',
  'Creatives'
];

const archiveCategoryColors = {
  'Visual Journalism': '#e05d5d',
  'Graphic Design': '#2b9348',
  'Game Design': '#e3a008',
  'Web Development': '#3182ce',
  'Creatives': '#805ad5'
};

// Split every section title up front so layout doesn't shift later.
const heroLetters = splitLetters(document.getElementById('hero-title'));
const workLetters = splitLetters(document.getElementById('work-title'));
const contactLetters = splitLetters(document.getElementById('contact-title'));
// Footer wordmark reuses the same split, but css/contact.css flips its
// starting position so it rises up from below instead of dropping in.
const footerWordmarkLetters = splitLetters(document.getElementById('footer-wordmark'));

// Every title reveals/retreats as it scrolls in and out of view
// (observeTitle comes from js/common.js) - hero-title happens to
// already be in view at load, so this still plays as an immediate
// entrance there, but now also drops back up if scrolled fully past
// and re-enters on the way back, same as the titles below the fold.
observeTitle(heroLetters, { bidirectional: true });
observeTitle(workLetters, { bidirectional: true });
observeTitle(contactLetters, { bidirectional: true });
observeTitle(footerWordmarkLetters, { bidirectional: true, hiddenY: '120%' });

// Lines up the "A" that ends "BASED IN INDIA" with the right edge of
// the "R" that ends "DESIGNER" - not the title/wrapper/section's own
// edge, and not the subtitle's own start either. DESIGNER is centered
// within the full-width .hero-title-wrapper (css `.section-title`'s
// justify-content:center), so its rendered position moves with
// viewport width/font-size and can't be reached with CSS alone;
// #heroSubtitleLastLetter (wrapping just that final "A") gives a
// measurable point on the subtitle's side the same way heroLetters'
// last entry (from splitLetters - already applied to the whole title
// for its own drop-in reveal) does on the title's. Re-measures from
// wherever the subtitle currently sits, so it converges correctly on
// repeated calls (e.g. on resize) regardless of the starting position.
// Skipped below the 576px breakpoint, where css/hero.css switches the
// subtitle to a static, centered layout instead (not enough room
// beside DESIGNER there).
function alignHeroSubtitleToTitle() {
  if (window.innerWidth <= 576) return;
  const wrapper = document.querySelector('.hero-title-wrapper');
  const subtitle = document.querySelector('.hero-subtitle');
  const subtitleLastLetter = document.getElementById('heroSubtitleLastLetter');
  const titleLastLetter = heroLetters[heroLetters.length - 1];
  if (!wrapper || !subtitle || !subtitleLastLetter || !titleLastLetter) return;

  const wrapperRect = wrapper.getBoundingClientRect();
  const currentSubtitleLeft = subtitle.getBoundingClientRect().left - wrapperRect.left;
  const delta = titleLastLetter.getBoundingClientRect().right - subtitleLastLetter.getBoundingClientRect().left;
  subtitle.style.left = `${currentSubtitleLeft + delta}px`;
}

alignHeroSubtitleToTitle();
window.addEventListener('resize', alignHeroSubtitleToTitle);
// Re-measure once the real webfonts (css/style.css @font-face, all
// font-display: swap) have actually swapped in - the first call above
// runs against fallback-font metrics, which render DESIGNER/BASED IN
// INDIA at slightly different widths than the real fonts do.
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(alignHeroSubtitleToTitle);
}

/* ---------------------------------------------------------
   1. Hero section (ported from landing.html)
   --------------------------------------------------------- */
const heroImageMaskEl = document.getElementById('heroImageMask');
const heroImageReveal = { reveal: 100 };

// Timed to land just after the hero title's own reveal (0.8s duration
// + the 0.3s gap the two used to share on one timeline), now that the
// title's animation is driven by observeTitle above instead.
gsap.to(heroImageReveal, {
  reveal: 0,
  duration: 1,
  ease: 'power3.inOut',
  delay: 1.1,
  onUpdate: () => { heroImageMaskEl.style.clipPath = `inset(0% 0% ${heroImageReveal.reveal}% 0%)`; }
});

// Rewired from the old hero "skill node" dots (removed - the Archive
// timeline itself, moved up into the hero, is the interactive content
// now) to the timeline's own legend buttons. #archiveFilterNav's "All"
// button has no matching entry below, so hovering it is a harmless
// no-op via the `if (!data) return` guard.
const heroNodes = document.querySelectorAll('#archiveFilterNav .archive-filter-btn');
const heroInfoCard = document.getElementById('heroInfoCard');
const heroCardIcon = document.getElementById('heroCardIcon');
const heroCardDesc = document.getElementById('heroCardDesc');
const heroCardLinks = document.getElementById('heroCardLinks');

// Same 5 categories as the archive timeline (and timeline.csv's own
// Type column) - keyed by the exact data-category value on each
// legend button, so the button's own text doubles as the lookup key.
// Dates below are pulled from each project's entry in timeline.csv (the
// Archive timeline's own data source) so this list stays consistent with
// it - see js/timeline-data.js / loadArchiveProjects() below.
const heroNodeData = {
  'Web Development': {
    color: archiveCategoryColors['Web Development'],
    desc: 'Crafting responsive, performance-driven web interfaces with modern CSS and JavaScript animation frameworks.',
    projects: [
      { name: 'Bird Map', url: '#', date: 'Oct 2025' },
      { name: 'Moodstich', url: '#', date: 'Jul 2025' }
    ]
  },
  'Visual Journalism': {
    color: archiveCategoryColors['Visual Journalism'],
    desc: 'Using the understanding of systems and data, I design holistic visualisations and infographics for various platforms.',
    // Trimmed to the 2 most recent, matching every other node's list
    // length - the full 5 made this card noticeably taller than the rest.
    projects: [
      { name: 'Intermission // ITC', url: 'project.html', date: '17 Aug 2026' },
      { name: 'Revenue Growth', url: 'revenue-growth.html', date: '6 Jul 2026' }
    ]
  },
  'Game Design': {
    color: archiveCategoryColors['Game Design'],
    desc: 'Designing mechanics, rules, and visual logic for immersive web-based interactive games.',
    projects: [
      { name: 'Crisis City', url: '#', date: 'Apr 2024' },
      { name: '1 Dash', url: '#', date: 'Aug 2023' }
    ]
  },
  'Graphic Design': {
    color: archiveCategoryColors['Graphic Design'],
    desc: 'Brand identity systems, typography visual hierarchy, and print media design.',
    projects: [
      { name: 'Packaging — Baarbara Coffee', url: '#', date: 'Jun 2018' },
      { name: 'Limitless Institute', url: '#', date: '16 Apr 2020' }
    ]
  },
  Creatives: {
    color: archiveCategoryColors['Creatives'],
    desc: 'Personal, exploratory work across writing, illustration, and audio-reactive experiments - made purely out of curiosity.',
    projects: [
      { name: 'Hades — A Gateway to Olympus', url: '#', date: '19 Jan 2021' },
      { name: 'Fabled Ciphers', url: '#', date: 'Oct 2018' }
    ]
  }
};

// Converts a '#rrggbb' category color to an rgba() string at the
// given alpha - used to soften the hero info-card's glow (a solid
// hex color at full strength read as too strong/saturated for a
// subtle glow; the box-shadow's own blur alone wasn't enough to tone
// it down).
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// One hand-drawn line icon per category - same minimal stroke style
// (and, for graphic/game, the literal same icons) as aboutme.html's
// .skill-tag icons, so the two pages share one visual language for
// these categories rather than each inventing its own. Set as the
// corner icon's content (inherits data.color via currentColor,
// applied inline below) instead of a project photo - a photo can't
// represent a whole category, and cropping one down to a small swatch
// read as arbitrary.
const heroNodeIcons = {
  'Web Development': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M8 6 3 12l5 6"/><path d="M16 6l5 6-5 6"/></svg>',
  'Visual Journalism': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><line x1="4" y1="20" x2="4" y2="12"/><line x1="12" y1="20" x2="12" y2="6"/><line x1="20" y1="20" x2="20" y2="15"/></svg>',
  'Game Design': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="3" y="8" width="18" height="9" rx="4"/><line x1="7.5" y1="10.5" x2="7.5" y2="14.5"/><line x1="5.5" y1="12.5" x2="9.5" y2="12.5"/><circle cx="17" cy="11.5" r="0.8" fill="currentColor" stroke="none"/><circle cx="15" cy="13.5" r="0.8" fill="currentColor" stroke="none"/></svg>',
  'Graphic Design': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><circle cx="9" cy="9" r="6"/><rect x="10" y="10" width="10" height="10" rx="1"/></svg>',
  Creatives: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 2c0 5-5 10-10 10 5 0 10 5 10 10 0-5 5-10 10-10-5 0-10-5-10-10Z"/></svg>'
};

let activeHeroNode = null;

// The card follows the cursor while a legend button is hovered
// (updated on every mousemove below) and disappears the instant the
// cursor leaves it - mouseleave (unlike mouseout) doesn't re-fire for
// the button's own child elements, so hovering the dot/label inside it
// doesn't cause a flicker. The dot's own permanent category color
// (set inline in the HTML) is left alone here - unlike the old hero
// nodes, these dots already show their color at rest.
heroNodes.forEach(node => {
  node.addEventListener('mouseenter', () => {
    const key = node.getAttribute('data-category');
    const data = heroNodeData[key];
    if (!data) return;

    heroCardDesc.textContent = data.desc;
    heroCardLinks.innerHTML = data.projects
      .map(p => `<li><a href="${p.url}">${p.name}</a><span class="hero-info-card__date">${p.date}</span></li>`)
      .join('');
    heroCardIcon.innerHTML = heroNodeIcons[key] || '';
    heroCardIcon.style.color = data.color;
    // Tints the card's own glow (css/hero.css's --glow) to match -
    // softened with alpha rather than the solid category color.
    heroInfoCard.style.setProperty('--glow', hexToRgba(data.color, 0.35));

    heroInfoCard.classList.add('is-active');
    activeHeroNode = node;
  });

  node.addEventListener('mouseleave', () => {
    heroInfoCard.classList.remove('is-active');
    activeHeroNode = null;
  });
});

document.getElementById('about').addEventListener('mousemove', (e) => {
  if (!activeHeroNode || window.innerWidth <= 992) return;

  const sectionRect = document.getElementById('about').getBoundingClientRect();
  // Measured live (not the CSS width alone) since the list's project
  // count varies per node, so the card's real height varies too.
  const cardWidth = heroInfoCard.offsetWidth || 360;
  const cardHeight = heroInfoCard.offsetHeight || 200;

  let leftPos = e.clientX - sectionRect.left + 24;
  let topPos = e.clientY - sectionRect.top - 20;

  // Flip to the other side of the cursor first if the default spot
  // would run past that edge of the section...
  if (leftPos + cardWidth > sectionRect.width) {
    leftPos = e.clientX - sectionRect.left - cardWidth - 24;
  }
  if (topPos + cardHeight > sectionRect.height) {
    topPos = e.clientY - sectionRect.top - cardHeight + 20;
  }

  // ...then clamp as a hard fallback, so it's never partly off-frame
  // even for a node right in a corner (the flip alone can undershoot).
  leftPos = Math.max(10, Math.min(leftPos, sectionRect.width - cardWidth - 10));
  topPos = Math.max(10, Math.min(topPos, sectionRect.height - cardHeight - 10));

  heroInfoCard.style.top = `${topPos}px`;
  heroInfoCard.style.left = `${leftPos}px`;
});

/* ---------------------------------------------------------
   2a. Featured grid - scroll reveal
   Plain fade+rise (not the clip-path image mask other reveals use) -
   these cards are text-only now, no cover image baked into the cell
   to mask-reveal.
   --------------------------------------------------------- */
const featuredCards = document.querySelectorAll('.featured-card');

revealOnScroll(
  featuredCards,
  { opacity: 0, y: 20 },
  { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
);

/* ---------------------------------------------------------
   2a-i. Custom cursor over the Featured grid
   Arrow badge by default anywhere over #featuredGrid; swaps to a
   small dot + that card's own cover image (data-cover) while over a
   specific .featured-card - see .featured-cursor in css/work.css.
   --------------------------------------------------------- */
const featuredGrid = document.getElementById('featuredGrid');
const featuredCursor = document.getElementById('featuredCursor');
const featuredCursorImg = document.getElementById('featuredCursorImg');

if (featuredGrid && featuredCursor) {
  featuredGrid.addEventListener('mouseenter', () => featuredCursor.classList.add('is-visible'));
  featuredGrid.addEventListener('mouseleave', () => featuredCursor.classList.remove('is-visible', 'is-card'));
  // The preview image is a fairly large 550x400 box offset down-right
  // from the cursor (css/work.css) - flip it to the other side on
  // whichever axis would otherwise run it past the viewport edge, so
  // it's never partly cut off near the right or bottom of the screen.
  featuredGrid.addEventListener('mousemove', (e) => {
    featuredCursor.style.left = `${e.clientX}px`;
    featuredCursor.style.top = `${e.clientY}px`;
    featuredCursor.classList.toggle('featured-cursor--flip-x', e.clientX + 30 + 550 > window.innerWidth);
    featuredCursor.classList.toggle('featured-cursor--flip-y', e.clientY + 30 + 400 > window.innerHeight);
  });

  featuredCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      featuredCursor.classList.add('is-card');
      featuredCursorImg.style.opacity = 1;
      featuredCursorImg.src = card.dataset.cover || '';
    });
    card.addEventListener('mouseleave', () => featuredCursor.classList.remove('is-card'));
  });
}

/* ---------------------------------------------------------
   2b. Archive timeline + gallery (ported from timeline.html)
   Real project data lives in timeline.csv (fetched + parsed below)
   rather than being hardcoded here - edit that file to add/update
   projects, no JS changes needed for ordinary edits.
   --------------------------------------------------------- */
// timeline.csv has one project under "Product design", which isn't
// one of the 5 categories above - it lands in Creatives (closest fit:
// a personal college project, not client Graphic Design work). If a
// future CSV row uses a category outside the 5 above, it'll land here
// too - rename it to one of the 5 in the CSV to place it deliberately.
const ARCHIVE_CATEGORY_FALLBACK = 'Creatives';

// Random (but stable per-project, via the seed) placeholder photo -
// used until a real image is dropped into images/archive/ for that
// project (see the numbering assigned in initArchive() below + the
// README in that folder for the exact filename each project expects).
function getArchiveFallbackImage(id) {
  return `https://picsum.photos/seed/${encodeURIComponent(id)}/400/300`;
}

/* Minimal CSV parser: handles quoted fields, commas/newlines inside
   quotes, and "" as an escaped quote (RFC4180-ish) - enough for
   timeline.csv's mixed date formats and multi-line quoted fields
   without pulling in a library. */
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { inQuotes = false; }
      } else {
        field += char;
      }
    } else if (char === '"') {
      inQuotes = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const ARCHIVE_MONTHS = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10, novemeber: 10,
  dec: 11, december: 11, decemeber: 11
};

// timeline.csv's Date column mixes "Mon DD, YYYY", "DD Mon YYYY" (with
// an optional "1st/2nd/3rd/16th"), and "Month YYYY" (day defaults to
// the 1st). Falls back to just the year (Jan 1) - with a console
// warning - if no month name can be found at all; see the
// "Publication Design" row, whose Date cell is just "16th 2020" in
// the CSV (missing the month) - fix that cell to get its real date.
function parseArchiveDate(raw) {
  const str = raw.trim().replace(/\s+/g, ' ');

  let m = str.match(/^([A-Za-z]+)\.?\s+(\d{1,2}),?\s*(\d{4})$/);
  if (m && ARCHIVE_MONTHS[m[1].toLowerCase()] !== undefined) {
    return new Date(parseInt(m[3], 10), ARCHIVE_MONTHS[m[1].toLowerCase()], parseInt(m[2], 10)).getTime();
  }

  m = str.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)\.?\s+(\d{4})$/);
  if (m && ARCHIVE_MONTHS[m[2].toLowerCase()] !== undefined) {
    return new Date(parseInt(m[3], 10), ARCHIVE_MONTHS[m[2].toLowerCase()], parseInt(m[1], 10)).getTime();
  }

  m = str.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (m && ARCHIVE_MONTHS[m[1].toLowerCase()] !== undefined) {
    return new Date(parseInt(m[2], 10), ARCHIVE_MONTHS[m[1].toLowerCase()], 1).getTime();
  }

  m = str.match(/(\d{4})/);
  if (m) {
    console.warn(`[archive] couldn't fully parse date "${raw}" - defaulting to Jan 1, ${m[1]}. Check timeline.csv.`);
    return new Date(parseInt(m[1], 10), 0, 1).getTime();
  }

  console.warn(`[archive] couldn't parse date "${raw}" at all - dropping that row. Check timeline.csv.`);
  return null;
}

function formatArchiveDate(timestamp) {
  const d = new Date(timestamp);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

async function fetchTimelineCSVText() {
  try {
    const res = await fetch('timeline.csv');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (err) {
    // fetch() of a local file is blocked by the browser when this page
    // is opened directly as a file:// URL (no server) - not fixable
    // from JS. Fall back to the embedded copy from js/timeline-data.js
    // (kept in sync with timeline.csv - regenerate it if the CSV
    // changes and the site is meant to also work opened as a file).
    if (typeof window.TIMELINE_CSV_FALLBACK === 'string') {
      console.warn('[archive] fetch(timeline.csv) failed (likely opened as a file:// page) - using the embedded fallback copy from js/timeline-data.js instead. Edits to timeline.csv won\'t show up until that fallback is regenerated.', err);
      return window.TIMELINE_CSV_FALLBACK;
    }
    throw err;
  }
}

async function loadArchiveProjects() {
  const text = await fetchTimelineCSVText();
  const rows = parseCSV(text).filter(r => r.some(cell => cell.trim() !== ''));

  // Row 0 is "Projects,,,,,,," (a section label) - the real header is
  // the first row that starts with "Project Name".
  const headerIndex = rows.findIndex(r => r[0] && r[0].trim() === 'Project Name');
  const header = rows[headerIndex].map(h => h.trim());
  const dataRows = rows.slice(headerIndex + 1);

  const col = (row, name) => {
    const idx = header.indexOf(name);
    return idx === -1 ? '' : (row[idx] || '').trim();
  };

  const projects = [];
  dataRows.forEach((row, i) => {
    const name = col(row, 'Project Name');
    if (!name) return;

    const timestamp = parseArchiveDate(col(row, 'Date'));
    if (timestamp === null) return;

    const rawCategory = col(row, 'Type');
    const category = archiveCategoryColors[rawCategory] ? rawCategory : ARCHIVE_CATEGORY_FALLBACK;

    projects.push({
      id: i,
      name,
      subtitle: col(row, 'Small Desc'),
      dateStr: formatArchiveDate(timestamp),
      timestamp,
      duration: col(row, 'Duration'),
      category,
      impact: parseFloat(col(row, 'impact(0-9)')) || 1,
      stack: col(row, 'Tools Used'),
      link: col(row, 'Link'),
      color: archiveCategoryColors[category]
    });
  });

  projects.sort((a, b) => a.timestamp - b.timestamp);
  return projects;
}

function updateArchiveTooltipContent(proj) {
  document.getElementById('archiveTooltipTitle').innerText = proj.name;
  document.getElementById('archiveTooltipSub').innerText = proj.subtitle;
  document.getElementById('archiveTooltipDate').innerText = proj.dateStr;
  document.getElementById('archiveTooltipOrg').innerText = proj.duration ? `Duration: ${proj.duration}` : '';
  document.getElementById('archiveTooltipStack').innerText = proj.stack;

  const linkEl = document.getElementById('archiveTooltipLink');
  if (proj.link) {
    linkEl.href = proj.link;
    linkEl.style.display = 'flex';
  } else {
    linkEl.removeAttribute('href');
    linkEl.style.display = 'none';
  }
}

(async function initArchive() {
  let archiveProjects;
  try {
    archiveProjects = await loadArchiveProjects();
  } catch (err) {
    console.error('[archive] failed to load timeline.csv', err);
    return;
  }
  if (!archiveProjects.length) return;

  const ARCHIVE_PAD_MS = 1000 * 60 * 60 * 24 * 45; // ~45 days breathing room either side
  const ARCHIVE_MIN_TIME = archiveProjects[0].timestamp - ARCHIVE_PAD_MS;
  const ARCHIVE_MAX_TIME = archiveProjects[archiveProjects.length - 1].timestamp + ARCHIVE_PAD_MS;

  const archiveGalleryTrack = document.getElementById('archiveGalleryTrack');
  const archiveGalleryWrapper = document.getElementById('archiveGalleryWrapper');

  archiveProjects.forEach((proj, idx) => {
    const card = document.createElement('div');
    card.className = 'archive-card';
    card.dataset.id = proj.id;
    card.dataset.category = proj.category;
    card.style.zIndex = idx + 1;

    const imageBox = document.createElement('div');
    imageBox.className = 'archive-card__image-box';

    const img = document.createElement('img');
    img.alt = proj.name;
    img.addEventListener('error', () => {
      img.src = getArchiveFallbackImage(proj.id);
    }, { once: true });
    // Numbered by chronological position (idx, after the timestamp
    // sort above) rather than derived from the project name - a
    // fixed slot per position, same convention as images/project/ etc.
    // See images/archive/README.txt for the exact name -> number list.
    img.src = `images/archive/${String(idx + 1).padStart(2, '0')}.png`;
    imageBox.appendChild(img);

    const info = document.createElement('div');
    info.className = 'archive-card__info';
    const heading = document.createElement('h3');
    heading.textContent = proj.name;
    info.appendChild(heading);

    card.appendChild(imageBox);
    card.appendChild(info);
    archiveGalleryTrack.appendChild(card);
  });

  const archiveChartWrapper = document.getElementById('archiveChartWrapper');
  const archiveChartDom = document.getElementById('archiveChart');
  const archiveChart = echarts.init(archiveChartDom);
  const archiveTooltip = document.getElementById('archiveTooltip');

  function prepareArchiveSeriesData(filteredData) {
    const sortedByImpact = [...filteredData].sort((a, b) => b.impact - a.impact);

    return sortedByImpact.map(p => ({
      name: p.name,
      value: [p.timestamp, 0, p.impact, p.category, p.id],
      projectData: p,
      cursor: p.link ? 'pointer' : 'default',
      itemStyle: {
        color: p.color,
        opacity: 0.6
      }
    }));
  }

  const archiveChartOption = {
    tooltip: { show: false },
    grid: {
      left: '5%',
      right: '5%',
      top: '10%',
      bottom: '10%'
    },
    xAxis: {
      type: 'time',
      min: ARCHIVE_MIN_TIME,
      max: ARCHIVE_MAX_TIME,
      splitLine: { show: false },
      axisLine: {
        onZero: true,
        lineStyle: { color: '#1d1d1f', width: 1.5 }
      },
      axisLabel: {
        color: '#1d1d1f',
        formatter: '{yyyy}',
        verticalAlign: 'middle',
        margin: -22,
        fontSize: 11,
        fontWeight: 'bold'
      },
      axisTick: {
        alignWithLabel: true,
        length: 10,
        inside: true,
        lineStyle: { color: '#1d1d1f', width: 1.5 }
      }
    },
    yAxis: {
      type: 'value',
      min: -10,
      max: 10,
      show: false
    },
    series: [{
      type: 'scatter',
      symbolSize: function (data) {
        return data[2] * 7;
      },
      data: prepareArchiveSeriesData(archiveProjects),
      animationDuration: 400,
      emphasis: {
        scale: 1.12,
        itemStyle: {
          opacity: 0.6,
          shadowBlur: 8,
          shadowColor: 'rgba(0,0,0,0.15)'
        }
      }
    }]
  };

  archiveChart.setOption(archiveChartOption);

  // Tooltip visibility/position is normally driven entirely by
  // echarts' own mouseover/mouseout on the chart series, plus the
  // wrapper's mousemove tracking the cursor below. archiveActiveProjId
  // and archiveHoveringBubble (set further down, near the mouseover/
  // mouseout handlers) let the tooltip stay open and frozen in place
  // long enough for its share icon to actually be reachable/clickable.
  let archiveActiveProjId = null;
  let archiveHoveringBubble = false;
  let archiveLastMouseX = 0;
  let archiveLastMouseY = 0;

  // Positions the tooltip near the cursor (both wrapper-relative) so
  // it still reads as attached to the mouse and moves with it -
  // flipping horizontally to the other side of the cursor if that
  // would push it past the wrapper's edge, then clamping as a hard
  // fallback. Vertically it always sits ABOVE the cursor rather than
  // below (or below-by-default-flipping-to-above): every bubble sits
  // on the same horizontal timeline, vertically centered in this
  // wrapper, so the cursor hovering one is already right at that
  // center line - placing the tooltip below it (even by a little)
  // routinely put it right back on top of the neighboring bubbles.
  // Anchoring above means its own height only ever pushes it further
  // up (spilling above the chart entirely for a tall tooltip, same as
  // before), never back down into the timeline.
  function positionArchiveTooltip(mouseX, mouseY) {
    const bounds = archiveChartWrapper.getBoundingClientRect();
    const tooltipWidth = archiveTooltip.offsetWidth || 230;
    const tooltipHeight = archiveTooltip.offsetHeight || 160;

    let targetLeft = mouseX - 115;

    if (targetLeft + tooltipWidth + 10 > bounds.width) {
      targetLeft = mouseX - tooltipWidth + 115;
    }

    targetLeft = Math.max(10, Math.min(targetLeft, bounds.width - tooltipWidth - 10));

    archiveTooltip.style.left = `${targetLeft}px`;
    archiveTooltip.style.top = `${mouseY - tooltipHeight - 18}px`;
  }

  // Only reposition while no tooltip is currently pinned (i.e. pure
  // scanning, nothing shown yet) - once archiveActiveProjId is set
  // (below), the tooltip freezes in place instead of continuing to
  // chase the mouse, including during the moment the cursor leaves
  // the bubble to head for the share icon (archiveHoveringBubble
  // alone isn't enough here - it goes false right as that transition
  // starts, which is exactly when the freeze matters most). Otherwise
  // the icon is a moving target that recedes by exactly as much as
  // you move toward it, since its position is always relative to
  // wherever this handler last put the tooltip.
  archiveChartWrapper.addEventListener('mousemove', (e) => {
    const bounds = archiveChartWrapper.getBoundingClientRect();
    archiveLastMouseX = e.clientX - bounds.left;
    archiveLastMouseY = e.clientY - bounds.top;

    if (archiveActiveProjId !== null) return;
    positionArchiveTooltip(archiveLastMouseX, archiveLastMouseY);
  });

  // Hides the tooltip immediately, with no grace period, the instant
  // the cursor leaves the chart wrapper entirely - the grace-period
  // hide below exists only to bridge the small gap between a bubble
  // and the tooltip's own share icon; once the cursor's left the
  // whole wrapper there's no such icon left to reach.
  archiveChartWrapper.addEventListener('mouseleave', () => {
    cancelArchiveTooltipHide();
    archiveTooltip.classList.remove('is-active');
    archiveActiveProjId = null;
    archiveHoveringBubble = false;
    resetArchiveGallery();
  });

  function updateArchiveFrameVisibility() {
    const wrapperBounds = archiveGalleryWrapper.getBoundingClientRect();
    const cards = document.querySelectorAll('.archive-card:not(.is-hidden)');

    cards.forEach(card => {
      const cardBounds = card.getBoundingClientRect();
      if (cardBounds.right < wrapperBounds.left - 20 || cardBounds.left > wrapperBounds.right + 20) {
        card.style.visibility = 'hidden';
      } else {
        card.style.visibility = 'visible';
      }
    });
  }

  const ARCHIVE_GAP_OFFSET = 120;

  function focusArchiveCard(id) {
    const cards = Array.from(document.querySelectorAll('.archive-card:not(.is-hidden)'));
    const targetIndex = cards.findIndex(c => parseInt(c.dataset.id) === id);
    const targetCard = cards[targetIndex];

    if (!targetCard) return;

    cards.forEach((c, idx) => {
      if (idx === targetIndex) {
        c.classList.add('is-active');
        gsap.to(c, { scale: 1.06, x: 0, duration: 0.65, ease: 'power2.out', overwrite: 'auto' });
      } else if (idx < targetIndex) {
        c.classList.remove('is-active');
        gsap.to(c, { scale: 0.95, x: -ARCHIVE_GAP_OFFSET, duration: 0.65, ease: 'power2.out', overwrite: 'auto' });
      } else {
        c.classList.remove('is-active');
        gsap.to(c, { scale: 0.95, x: ARCHIVE_GAP_OFFSET, duration: 0.65, ease: 'power2.out', overwrite: 'auto' });
      }
    });

    const cardOffset = targetCard.offsetLeft + (targetCard.offsetWidth / 2);
    const containerWidth = archiveGalleryWrapper.offsetWidth;
    const targetX = (containerWidth / 2) - cardOffset;

    gsap.to(archiveGalleryTrack, {
      x: targetX,
      duration: 0.65,
      ease: 'power2.out',
      overwrite: 'auto',
      onUpdate: updateArchiveFrameVisibility,
      onComplete: updateArchiveFrameVisibility
    });

    archiveTooltip.classList.add('is-active');
  }

  function resetArchiveGallery() {
    const cards = document.querySelectorAll('.archive-card:not(.is-hidden)');
    cards.forEach(c => {
      c.classList.remove('is-active');
      gsap.to(c, { scale: 1, x: 0, duration: 0.65, ease: 'power2.out', overwrite: 'auto' });
    });

    gsap.to(archiveGalleryTrack, {
      x: 0,
      duration: 0.65,
      ease: 'power2.out',
      overwrite: 'auto',
      onUpdate: updateArchiveFrameVisibility,
      onComplete: updateArchiveFrameVisibility
    });
  }

  // mouseout fires the instant the cursor leaves the bubble - before
  // it could ever reach the share icon in the tooltip's corner. The
  // tooltip renders at an offset from the cursor rather than under
  // it, so the path from bubble to icon necessarily crosses a gap
  // that's neither on the bubble nor yet inside the tooltip - hiding
  // on the very first mousemove that lands in that gap (which an
  // instant isOverTooltip check would do) kills the tooltip before
  // the cursor ever arrives. A short grace-period timer instead:
  // mouseout schedules a hide a moment later, and either re-entering
  // a bubble (mouseover) or actually reaching the tooltip (mousemove
  // below) cancels it - same idea as a hoverable dropdown menu with a
  // gap under its trigger.
  let archiveHideTimer = null;

  function cancelArchiveTooltipHide() {
    clearTimeout(archiveHideTimer);
    archiveHideTimer = null;
  }

  function scheduleArchiveTooltipHide() {
    cancelArchiveTooltipHide();
    archiveHideTimer = setTimeout(() => {
      archiveTooltip.classList.remove('is-active');
      archiveActiveProjId = null;
    }, 300);
  }

  archiveChart.on('mouseover', 'series', function (params) {
    cancelArchiveTooltipHide();
    const proj = params.data.projectData;
    updateArchiveTooltipContent(proj);
    // Re-measure now that the real content is in - this project's card
    // may be taller/wider than whatever was showing during the scan.
    positionArchiveTooltip(archiveLastMouseX, archiveLastMouseY);
    focusArchiveCard(proj.id);
    archiveActiveProjId = proj.id;
    archiveHoveringBubble = true;
  });

  archiveChart.on('mouseout', 'series', function () {
    archiveHoveringBubble = false;
    resetArchiveGallery();
    scheduleArchiveTooltipHide();
  });

  // Clicking the bubble itself opens the link too (same URL the share
  // icon in the tooltip points to) - a bigger, easier target than the
  // icon, for projects that have one.
  archiveChart.on('click', 'series', function (params) {
    const proj = params.data.projectData;
    if (proj.link) {
      window.open(proj.link, '_blank', 'noopener');
    }
  });

  document.addEventListener('mousemove', (e) => {
    if (archiveActiveProjId === null || archiveHoveringBubble) return;
    const rect = archiveTooltip.getBoundingClientRect();
    const isOverTooltip = e.clientX >= rect.left && e.clientX <= rect.right &&
                           e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (isOverTooltip) {
      cancelArchiveTooltipHide();
    }
  });

  let selectedArchiveCategories = new Set(['All']);
  const archiveFilterButtons = document.querySelectorAll('.archive-filter-btn');

  archiveFilterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.category;

      if (cat === 'All') {
        selectedArchiveCategories.clear();
        selectedArchiveCategories.add('All');
      } else {
        selectedArchiveCategories.delete('All');
        if (selectedArchiveCategories.has(cat)) {
          selectedArchiveCategories.delete(cat);
          if (selectedArchiveCategories.size === 0) selectedArchiveCategories.add('All');
        } else {
          selectedArchiveCategories.add(cat);
        }
      }

      archiveFilterButtons.forEach(b => {
        if (selectedArchiveCategories.has(b.dataset.category)) {
          b.classList.add('is-active');
        } else {
          b.classList.remove('is-active');
        }
      });

      const activeProjects = archiveProjects.filter(p =>
        selectedArchiveCategories.has('All') || selectedArchiveCategories.has(p.category)
      );

      archiveChart.setOption({
        series: [{
          data: prepareArchiveSeriesData(activeProjects)
        }]
      });

      document.querySelectorAll('.archive-card').forEach(card => {
        if (selectedArchiveCategories.has('All') || selectedArchiveCategories.has(card.dataset.category)) {
          card.classList.remove('is-hidden');
        } else {
          card.classList.add('is-hidden');
        }
      });

      resetArchiveGallery();
    });
  });

  updateArchiveFrameVisibility();

  window.addEventListener('resize', () => {
    archiveChart.resize();
    resetArchiveGallery();
  });
})();

// Footer live clock (initFooterClock) is started from js/common.js.
