/**
 * 动态文案数据生成：只返回纯数据，不返回 HTML，避免 XSS 注入风险。
 *
 * @param {string} name - 用户昵称
 * @param {string} date - YYYY-MM-DD
 * @param {Object[]} films - FilmEntry[]
 * @param {Object} [options] - { omitName: boolean } 为 true 时不显示昵称前缀
 * @returns {{namePrefix: string, body: string}}
 */
export function generateTextData(name, date, films, options = {}) {
  const omitName = options.omitName === true;
  const displayName = name?.trim() || '你';
  const dateStr = formatDate(date);

  if (!films || films.length === 0) {
    return {
      namePrefix: omitName ? '' : displayName,
      body: `你的生日${dateStr}这一天暂无精选港片数据。`,
    };
  }

  // 统一只显示海报对应主影片（与卡片主信息一致）
  const f = films[0];
  const title = (f.title_zh || f.title_en || '未知').trim();
  // 海报页底部文案使用导演中文名，其他部分（海报主图、打板器）保持英文
  const director = ((f.director_zh && f.director_zh.trim()) || f.director || '').trim();
  const cinema = (f.premiere_cinema || '').trim();

  let text = `你的生日${dateStr}这一天，${director ? director + '导演的' : ''}《${title}》在香港上映。`;
  if (cinema) {
    text += ` 首映于 ${cinema}。`;
  }
  // 有温度的问候：建立影片与出生在这一天的人之间的联系
  text += ' 这部电影是否点亮过属于你的光影记忆？';
  if (f.hkfaa_best_picture) {
    text += ' 本片荣获香港电影金像奖最佳影片！';
  }
  return {
    namePrefix: omitName ? '' : displayName,
    body: text,
  };
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T12:00:00');
  if (isNaN(d.getTime())) return dateStr;
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${m}月${day}日`;
}
