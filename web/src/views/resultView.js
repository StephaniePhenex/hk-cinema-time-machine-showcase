import { setVisible } from './viewUtils.js';

export function bindResultViewHandlers({
  onBackToShare,
  onDownload,
  onRetry,
  onCloseSaveModal,
}) {
  document.getElementById('download-btn')?.addEventListener('click', onBackToShare);
  document.getElementById('share-btn')?.addEventListener('click', onDownload);
  document.getElementById('retry-btn')?.addEventListener('click', onRetry);
  document.getElementById('save-modal-close')?.addEventListener('click', onCloseSaveModal);
  document.getElementById('save-image-modal')?.addEventListener('click', (e) => {
    if (e.target.id === 'save-image-modal') onCloseSaveModal();
  });
}

export function setResultVisible(visible) {
  setVisible('result-card', visible, 'flex');
  if (visible) document.getElementById('result-card')?.classList.add('fade-in');
}

export function setLoadingVisible(visible) {
  setVisible('loading-state', visible);
}

export function setErrorVisible(visible, message = '') {
  setVisible('error-state', visible);
  if (visible) {
    const messageEl = document.getElementById('error-message');
    if (messageEl) messageEl.textContent = message;
  }
}

export function renderDynamicText(textData) {
  const container = document.getElementById('dynamic-text');
  if (!container) return;
  container.textContent = '';
  if (textData.namePrefix) {
    const strong = document.createElement('strong');
    strong.className = 'font-bold';
    strong.style.color = '#2f3e3a';
    strong.textContent = `${textData.namePrefix}，`;
    container.appendChild(strong);
  }
  container.appendChild(document.createTextNode(textData.body));
}

export function setDownloadButtonLoading(isLoading) {
  const btn = document.getElementById('share-btn');
  if (!btn) return;
  btn.disabled = isLoading;
  btn.textContent = isLoading ? '下载中…' : '下载';
}

export function showSaveModal(blobUrl) {
  const modal = document.getElementById('save-image-modal');
  const img = document.getElementById('save-modal-img');
  if (!modal || !img) return;
  img.src = blobUrl;
  modal.classList.remove('hidden');
  modal.classList.add('flex', 'items-center', 'justify-center');
}

export function hideSaveModal() {
  const modal = document.getElementById('save-image-modal');
  const img = document.getElementById('save-modal-img');
  if (!modal || !img) return;
  const blobUrl = img.src;
  img.src = '';
  modal.classList.add('hidden');
  modal.classList.remove('flex', 'items-center', 'justify-center');
  if (blobUrl && blobUrl.startsWith('blob:')) {
    URL.revokeObjectURL(blobUrl);
  }
}
