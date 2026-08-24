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

// Titles below the fold reveal once scrolled into view (observeTitle
// comes from js/common.js), reusing the same stagger/ease as the
// hero's on-load entrance for a consistent feel.
observeTitle(workLetters);
observeTitle(contactLetters);
observeTitle(footerWordmarkLetters);

/* ---------------------------------------------------------
   1. Hero section (ported from landing.html)
   --------------------------------------------------------- */
const heroTl = gsap.timeline();

heroTl
  .add(() => revealLetters(heroLetters))
  .to('#heroImageMask', {
    scaleY: 1,
    duration: 1,
    ease: 'power3.inOut'
  }, '+=0.3');

const heroNodes = document.querySelectorAll('.hero-node');
const heroInfoCard = document.getElementById('heroInfoCard');
const heroCardDesc = document.getElementById('heroCardDesc');
const heroCardLinks = document.getElementById('heroCardLinks');

// Same 5 categories as the archive timeline below (and timeline.csv's
// own Type column) - each node's dot turns that category's color on
// hover, and its example projects are real timeline.csv entries.
const heroNodeData = {
  web: {
    color: archiveCategoryColors['Web Development'],
    desc: 'Crafting responsive, performance-driven web interfaces with modern CSS and JavaScript animation frameworks.',
    projects: [
      { name: 'Bird Map', url: '#' },
      { name: 'Moodstich', url: '#' }
    ]
  },
  visual: {
    color: archiveCategoryColors['Visual Journalism'],
    desc: 'Using the understanding of systems and data, I design holistic visualisations and infographics for various platforms.',
    projects: [
      { name: 'Intermission // ITC', url: 'project.html' },
      { name: 'Undersea Cables', url: 'undersea-cables.html' },
      { name: 'Intermission // Bajaj Finance', url: 'bajaj-finance.html' },
      { name: 'Investment Chart', url: 'lightrock.html' },
      { name: 'Revenue Growth', url: 'revenue-growth.html' }
    ]
  },
  game: {
    color: archiveCategoryColors['Game Design'],
    desc: 'Designing mechanics, rules, and visual logic for immersive web-based interactive games.',
    projects: [
      { name: 'Crisis City', url: '#' },
      { name: '1 Dash', url: '#' }
    ]
  },
  graphic: {
    color: archiveCategoryColors['Graphic Design'],
    desc: 'Brand identity systems, typography visual hierarchy, and print media design.',
    projects: [
      { name: 'Packaging — Baarbara Coffee', url: '#' },
      { name: 'Limitless Institute', url: '#' }
    ]
  },
  creatives: {
    color: archiveCategoryColors['Creatives'],
    desc: 'Personal, exploratory work across writing, illustration, and audio-reactive experiments - made purely out of curiosity.',
    projects: [
      { name: 'Hades — A Gateway to Olympus', url: '#' },
      { name: 'Fabled Ciphers', url: '#' }
    ]
  }
};

let activeHeroNode = null;

// The card follows the cursor while a node is hovered (updated on
// every mousemove below) and disappears the instant the cursor
// leaves that node - mouseleave (unlike mouseout) doesn't re-fire for
// the node's own child elements, so hovering the dot/label inside it
// doesn't cause a flicker.
heroNodes.forEach(node => {
  node.addEventListener('mouseenter', () => {
    const key = node.getAttribute('data-node');
    const data = heroNodeData[key];
    if (!data) return;

    heroCardDesc.textContent = data.desc;
    heroCardLinks.innerHTML = data.projects
      .map(p => `<li><a href="${p.url}">${p.name}</a></li>`)
      .join('');

    node.querySelector('.hero-node__dot').style.backgroundColor = data.color;
    heroInfoCard.classList.add('is-active');
    activeHeroNode = node;
  });

  node.addEventListener('mouseleave', () => {
    heroInfoCard.classList.remove('is-active');
    node.querySelector('.hero-node__dot').style.backgroundColor = '';
    activeHeroNode = null;
  });
});

document.getElementById('about').addEventListener('mousemove', (e) => {
  if (!activeHeroNode || window.innerWidth <= 992) return;

  const sectionRect = document.getElementById('about').getBoundingClientRect();
  let leftPos = e.clientX - sectionRect.left + 24;
  let topPos = e.clientY - sectionRect.top - 20;

  if (leftPos + 360 > sectionRect.width) {
    leftPos = e.clientX - sectionRect.left - 384;
  }

  heroInfoCard.style.top = `${topPos}px`;
  heroInfoCard.style.left = `${leftPos}px`;
});

/* ---------------------------------------------------------
   2a. Featured work grid - scroll reveal
   Reuses the hero's vertical mask-reveal logic (scaleY 0 -> 1)
   --------------------------------------------------------- */
const workCards = document.querySelectorAll('.work-card');

gsap.set(workCards, { scaleY: 0 });

const workGridObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      gsap.to(workCards, {
        scaleY: 1,
        duration: 0.9,
        ease: 'power3.inOut',
        stagger: 0.08
      });
      workGridObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

const workGridEl = document.querySelector('.work-grid');
if (workGridEl) workGridObserver.observe(workGridEl);

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
// project (see loadArchiveProjects()'s "image" field + the README in
// that folder for the exact filename each project expects).
function getArchiveFallbackImage(id) {
  return `https://picsum.photos/seed/${encodeURIComponent(id)}/400/300`;
}

// Slugified from the project name, e.g. "Hades — A Gateway to Olympus"
// -> images/archive/hades-a-gateway-to-olympus.jpg - drop a matching
// file in and it's picked up automatically; anything missing falls
// back to the generated placeholder above.
function slugifyArchiveName(name) {
  return name
    .toLowerCase()
    .normalize('NFKD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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
      image: `images/archive/${slugifyArchiveName(name)}.jpg`,
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
    img.src = proj.image;
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
        margin: -16,
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
    if (archiveActiveProjId !== null) return;

    const bounds = archiveChartWrapper.getBoundingClientRect();
    const mouseX = e.clientX - bounds.left;
    const mouseY = e.clientY - bounds.top;

    let targetLeft = mouseX - 115;
    let targetTop = mouseY + 18;

    if (targetLeft < 10) targetLeft = 10;
    if (targetLeft + 235 > bounds.width) targetLeft = bounds.width - 245;

    archiveTooltip.style.left = `${targetLeft}px`;
    archiveTooltip.style.top = `${targetTop}px`;
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
