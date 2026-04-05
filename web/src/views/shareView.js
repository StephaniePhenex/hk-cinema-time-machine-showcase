import { setVisible } from './viewUtils.js';

export function bindShareViewHandlers({ onBackToInput, onGeneratePoster }) {
  document.getElementById('back-from-share')?.addEventListener('click', onBackToInput);
  document.getElementById('share-export-btn')?.addEventListener('click', onGeneratePoster);
}

export function setShareVisible(visible) {
  setVisible('share-page', visible, 'flex');
  if (visible) document.getElementById('share-page')?.classList.add('fade-in');
}
