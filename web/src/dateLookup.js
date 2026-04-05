/**
 * 日期匹配逻辑：YYYY-MM-DD → MM-DD → daily_classics[mm_dd]
 */

/**
 * @param {string} fullDate - YYYY-MM-DD
 * @param {Object} dailyClassics - { "MM-DD": FilmEntry[] }
 * @returns {Object[]} films array or []
 */
export function getFilmsForDate(fullDate, dailyClassics) {
  if (!fullDate || !dailyClassics || typeof dailyClassics !== 'object') {
    return [];
  }
  const parts = fullDate.split('-');
  if (parts.length < 2) return [];
  const mm = parts[1].padStart(2, '0');
  const dd = parts[2] ? parts[2].padStart(2, '0') : '01';
  const mm_dd = `${mm}-${dd}`;
  return dailyClassics[mm_dd] || [];
}

/**
 * @param {Object} dailyClassics
 * @returns {string[]} available MM-DD keys
 */
export function getAvailableDates(dailyClassics) {
  if (!dailyClassics || typeof dailyClassics !== 'object') return [];
  return Object.keys(dailyClassics);
}
