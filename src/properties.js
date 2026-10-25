import { store } from './store.js';

let lastSelectedId = null;

export function renderProperties() {
  const panel = document.getElementById('properties');
  const el = store.selectedId ? store.getElement(store.selectedId) : null;

  if (store.selectedId === lastSelectedId && el) return;
  lastSelectedId = store.selectedId;

  if (!el) {
    panel.innerHTML = '<div style="color:#666;font-size:13px;">Select an element</div>';
    return;
  }

  panel.innerHTML = `
    <div style="margin-bottom:12px;">
      <label style="display:block;font-size:11px;color:#666;margin-bottom:4px;">Text</label>
      <input id="prop-text" type="text" value="${escapeAttr(el.props.text || '')}" style="width:100%;padding:6px;background:#252525;border:1px solid #444;color:#fff;border-radius:4px;font-size:13px;">
    </div>
    <div style="margin-bottom:12px;">
      <label style="display:block;font-size:11px;color:#666;margin-bottom:4px;">Background</label>
      <input id="prop-bg" type="color" value="${(el.style.background || '#000000').slice(0,7)}" style="width:100%;height:32px;background:#252525;border:1px solid #444;border-radius:4px;">
    </div>
    <div style="margin-bottom:12px;">
      <label style="display:block;font-size:11px;color:#666;margin-bottom:4px;">Text Color</label>
      <input id="prop-color" type="color" value="${(el.style.color || '#ffffff').slice(0,7)}" style="width:100%;height:32px;background:#252525;border:1px solid #444;border-radius:4px;">
    </div>
    <div style="margin-bottom:12px;">
      <label style="display:block;font-size:11px;color:#666;margin-bottom:4px;">Font Size</label>
      <input id="prop-fontSize" type="text" value="${el.style.fontSize || ''}" placeholder="16px" style="width:100%;padding:6px;background:#252525;border:1px solid #444;color:#fff;border-radius:4px;font-size:13px;">
    </div>
    <button id="prop-delete" style="width:100%;padding:8px;background:#7f1d1d;border:1px solid #991b1b;color:#fff;border-radius:4px;cursor:pointer;font-size:13px;">Delete Element</button>
  `;

  panel.querySelector('#prop-text').addEventListener('input', e => {
    store.updateElement(el.id, { props: { ...el.props, text: e.target.value } });
  });
  panel.querySelector('#prop-bg').addEventListener('input', e => {
    store.updateStyle(el.id, { background: e.target.value });
  });
  panel.querySelector('#prop-color').addEventListener('input', e => {
    store.updateStyle(el.id, { color: e.target.value });
  });
  panel.querySelector('#prop-fontSize').addEventListener('input', e => {
    store.updateStyle(el.id, { fontSize: e.target.value });
  });
  panel.querySelector('#prop-delete').addEventListener('click', () => {
    store.deleteElement(el.id);
  });
}

function escapeAttr(s) {
  return String(s).replace(/"/g, '&quot;').replace(/</g, '&lt;');
}