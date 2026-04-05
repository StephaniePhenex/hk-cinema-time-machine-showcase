export function setVisible(id, visible, displayClass = null) {
  const el = document.getElementById(id);
  if (!el) return;
  if (visible) {
    el.classList.remove('hidden');
    if (displayClass) el.classList.add(displayClass);
  } else {
    el.classList.add('hidden');
  }
}
