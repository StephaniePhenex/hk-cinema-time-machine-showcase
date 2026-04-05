/**
 * 场记板风格 DOM 渲染：FilmTrace HK 生日纪念卡样式
 * 数据绑定：title_zh, title_en, year, director 来自 daily_classics.json
 * 致X月X日的你：使用用户选择的日期
 */

/** 从 YYYY-MM-DD 解析出「X月X日」 */
function formatMonthDay(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length < 3) return '';
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  return `${m}月${d}日`;
}

/**
 * @param {Object[]} films - FilmEntry[] 来自 daily_classics.json
 * @param {string} date - YYYY-MM-DD 用户选择的日期
 * @param {string} userNickname - 用户昵称（暂未使用于场记板）
 */
export function renderClapperboard(films, date, userNickname) {
  const container = document.getElementById('capture-area-clapper');
  if (!container) return;

  const f = films[0];
  const titleZh = (f.title_zh || f.title_en || '未知').trim();
  const titleEn = (f.title_en || titleZh).trim();
  const year = f.year ?? '';
  const director = (f.director || '').trim();
  const quoteZh = '那一日的香港，光影如诗';
  const monthDay = formatMonthDay(date);
  const systemRefYear = /^\d{4}$/.test(String(year)) ? String(year) : '0000';
  const stripeHtml = '<span class="cyber-stripe"></span>'.repeat(11);

  // Static template only; all dynamic text content is set with textContent below.
  container.innerHTML = `
    <div class="cyber-scene">
      <div class="cyber-board-shell">
        <div class="cyber-open-clapper">
          <div class="cyber-open-neon"></div>
          <div class="cyber-open-stripes">
            ${stripeHtml}
          </div>
        </div>
        <div class="cyber-clapperboard">
          <div class="cyber-lower-clapper">
            <div class="cyber-open-neon"></div>
            <div class="cyber-open-stripes">
              ${stripeHtml}
            </div>
          </div>
          <div class="cyber-clapper-body">
            <div class="cyber-circuit-overlay" aria-hidden="true">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 20 H20 V40 H40 V60 H100" fill="none" stroke="cyan" stroke-width="0.5" />
                <circle cx="20" cy="20" r="1" fill="cyan" />
                <circle cx="100" cy="60" r="1" fill="cyan" />
                <path d="M100 78 H68 V52 H44" fill="none" stroke="cyan" stroke-width="0.5" />
              </svg>
            </div>
            <div class="cyber-grid-row">
              <div class="cyber-grid-col">
                <span class="cyber-field-label">Production</span>
                <h2 class="cyber-production-title" id="clap-title-zh"></h2>
                <p class="cyber-sub-title" id="clap-title-en"></p>
              </div>
              <div class="cyber-grid-col cyber-grid-col-right">
                <span class="cyber-field-label">Release Year</span>
                <h3 class="cyber-year-value" id="clap-year"></h3>
              </div>
            </div>
            <div class="cyber-divider"></div>
            <div class="cyber-director-block">
              <span class="cyber-field-label">Director</span>
              <h4 class="cyber-director-name" id="clap-director"></h4>
            </div>
            <div class="cyber-divider"></div>
            <div class="cyber-message-block">
              <p class="cyber-message-text" id="clap-message"></p>
            </div>
            <div class="cyber-system-ref" id="clap-system-ref"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  const titleZhEl = container.querySelector('#clap-title-zh');
  const titleEnEl = container.querySelector('#clap-title-en');
  const yearEl = container.querySelector('#clap-year');
  const directorEl = container.querySelector('#clap-director');
  const messageEl = container.querySelector('#clap-message');
  const refEl = container.querySelector('#clap-system-ref');
  if (!titleZhEl || !titleEnEl || !yearEl || !directorEl || !messageEl || !refEl) return;

  titleZhEl.textContent = titleZh;
  titleEnEl.textContent = titleEn;
  yearEl.textContent = String(year);
  directorEl.textContent = director;
  messageEl.textContent = `致${monthDay}的你：\n${quoteZh}`;
  refEl.textContent = `SYS_REF: ${systemRefYear}_HK_FILM_MEMORY`;
}
