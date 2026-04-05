import { getFilmsForDate } from '../dateLookup.js';

export async function loadDailyClassics() {
  const base = import.meta.env.BASE_URL;
  const res = await fetch(`${base}daily_classics.json`);
  if (!res.ok) {
    throw new Error('无法加载影片数据');
  }
  return res.json();
}

export function getFilmsByDate(date, dailyClassics) {
  return getFilmsForDate(date, dailyClassics);
}
