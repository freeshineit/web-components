export function ensureGlobalStyles(id: string, cssText: string) {
  if (typeof document === 'undefined') return;
  if (document.getElementById(id)) return;

  const style = document.createElement('style');
  style.id = id;
  style.textContent = cssText;
  document.head.appendChild(style);
}
