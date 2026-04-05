import { setVisible } from './viewUtils.js';

export function getInputSelection() {
  const name = document.getElementById('userName')?.value?.trim() || '你';
  const date = document.getElementById('birthDate')?.value || '';
  return { name, date };
}

export function bindInputViewHandlers({ onGenerate, onBackFromEmpty }) {
  document.getElementById('generate-btn')?.addEventListener('click', onGenerate);
  document.getElementById('back-from-empty')?.addEventListener('click', onBackFromEmpty);
}

export function setInputVisible(visible) {
  setVisible('input-page', visible, 'flex');
}

export function setEmptyVisible(visible) {
  setVisible('empty-state', visible);
}
