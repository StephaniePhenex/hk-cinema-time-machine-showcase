/**
 * 卡片 DOM 渲染：沉浸海报风（拍立得/胶片）
 * 仅渲染到下载收藏区
 */

/**
 * @param {Object[]} films - FilmEntry[]
 * @param {string} date - YYYY-MM-DD
 */
export function renderCard(films, date) {
  renderCardToTarget(films, date, {
    heroId: 'hero-section',
    frameNumTopId: 'frame-num-top',
    frameNumBotId: 'frame-num-bot',
    frameIdBotId: 'frame-id-bot',
  });
}

function renderCardToTarget(films, date, ids) {
  const heroEl = document.getElementById(ids.heroId);
  if (!heroEl) return;

  const primary = films[0];
  const title = (primary.title_zh || primary.title_en || '未知').trim();
  const director = (primary.director || '').trim();
  const year = primary.year || '';
  const ratingRaw = primary.douban_rating;
  const ratingDisplay =
    ratingRaw == null || ratingRaw === '' || (typeof ratingRaw === 'number' && (ratingRaw < 0 || ratingRaw > 10))
      ? '—'
      : Number(ratingRaw).toFixed(1);
  const genres = primary.genres;
  const genreStr = Array.isArray(genres) && genres.length > 0 ? genres.join('/') : '—';
  const genreWrap = Array.isArray(genres) && genres.length > 2;
  const genreText = genreWrap && Array.isArray(genres)
    ? genres
        .reduce((acc, g, i) => {
          if (i % 2 === 0) acc.push([g]);
          else acc[acc.length - 1].push(g);
          return acc;
        }, [])
        .map(chunk => chunk.join('/'))
        .join('\n')
    : genreStr;
  const base = import.meta.env.BASE_URL;
  const mm_dd = date ? date.slice(5) : '';
  const localPosterUrl = mm_dd ? `${base}images/posters/${mm_dd}.jpg` : null;
  const posterUrl = localPosterUrl || primary.poster_url;
  const hkfaa = primary.hkfaa_best_picture;

  // Static template only; dynamic text/URLs are assigned via textContent/setAttribute.
  heroEl.innerHTML = `
    <div class="relative w-full h-full" id="hero-shell">
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
      <div class="absolute bottom-5 left-4 right-6 flex justify-between items-end">
        <div class="min-w-0 pr-4" style="max-width: 68%">
          <div id="hero-badge" class="text-white cinema-title text-[9px] px-2 py-0.5 inline-block italic mb-1 tracking-widest"></div>
          <h2 id="hero-title" class="text-white text-2xl font-black italic cinema-title leading-tight uppercase break-words"></h2>
          <p id="hero-director-year" class="font-bold text-[9px] mt-1 uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis" style="color:#a8b5b0"></p>
        </div>
        <div class="flex gap-3 text-right flex-shrink-0">
          <div class="text-center">
            <p class="text-[8px] text-slate-300 font-bold uppercase tracking-tighter">豆瓣</p>
            <p id="hero-rating" class="text-lg font-black text-white cinema-title"></p>
          </div>
          <div class="text-center min-w-0" style="max-width: 5.5rem">
            <p class="text-[8px] text-slate-300 font-bold uppercase tracking-tighter">类型</p>
            <p id="hero-genre" class="text-sm font-bold text-white cinema-title"></p>
          </div>
        </div>
      </div>
    </div>
  `;

  const shell = heroEl.querySelector('#hero-shell');
  const badgeEl = heroEl.querySelector('#hero-badge');
  const titleEl = heroEl.querySelector('#hero-title');
  const directorYearEl = heroEl.querySelector('#hero-director-year');
  const ratingEl = heroEl.querySelector('#hero-rating');
  const genreEl = heroEl.querySelector('#hero-genre');
  if (!shell || !badgeEl || !titleEl || !directorYearEl || !ratingEl || !genreEl) return;

  shell.style.background = 'linear-gradient(135deg,#2f3e3a 0%,#3d4f4a 50%,#2a3634 100%)';
  if (posterUrl) {
    shell.dataset.posterUrl = posterUrl;
    const img = document.createElement('img');
    img.src = posterUrl;
    img.alt = '';
    img.crossOrigin = 'anonymous';
    img.className = 'absolute inset-0 w-full h-full object-cover';
    shell.prepend(img);
  } else {
    delete shell.dataset.posterUrl;
  }

  badgeEl.textContent = hkfaa ? '金像奖最佳影片' : '当日精选';
  badgeEl.style.backgroundColor = hkfaa ? '#3d4f4a' : '#2f3e3a';
  titleEl.textContent = title;
  directorYearEl.textContent = `${director} · ${year}`;
  ratingEl.textContent = ratingDisplay;
  genreEl.textContent = genreText;
  if (genreWrap) {
    genreEl.style.whiteSpace = 'pre-line';
    genreEl.classList.remove('whitespace-nowrap', 'overflow-hidden', 'text-ellipsis');
  } else {
    genreEl.style.whiteSpace = 'normal';
    genreEl.classList.add('whitespace-nowrap', 'overflow-hidden', 'text-ellipsis');
  }

  // 胶片边框编号：使用年份后两位
  const frameNum = String(primary.year || 90).slice(-2);
  const topEl = document.getElementById(ids.frameNumTopId);
  const botEl = document.getElementById(ids.frameNumBotId);
  const idEl = document.getElementById(ids.frameIdBotId);
  if (topEl) topEl.textContent = frameNum;
  if (botEl) botEl.textContent = frameNum;
  if (idEl) idEl.textContent = frameNum + 'A';
}
