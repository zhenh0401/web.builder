import { renderContent } from './render.js';
import { store } from './store.js';

export function renderCanvas() {
  const canvas = document.getElementById('canvas');
  canvas.style.background = store.doc.background;

  const sorted = [...store.doc.elements].sort((a, b) => a.z - b.z);
  const needed = new Set(sorted.map(e => e.id));

  for (const node of [...canvas.children]) {
    if (!needed.has(node.dataset.elId)) node.remove();
  }

  for (const el of sorted) {
    let node = canvas.querySelector(`[data-el-id="${el.id}"]`);
    if (!node) {
      node = document.createElement('div');
      node.dataset.elId = el.id;
      canvas.appendChild(node);
      attachInteractions(node);
    }
    Object.assign(node.style, {
      position: 'absolute',
      left: el.x + 'px',
      top: el.y + 'px',
      width: el.w + 'px',
      height: el.h + 'px',
      zIndex: el.z,
      outline: store.selectedId === el.id ? '2px solid #2563eb' : 'none',
    });
    node.replaceChildren(renderContent(el));
  }
}

function attachInteractions(node) {
  let startX, startY, origX, origY;

  node.addEventListener('pointerdown', e => {
    store.select(node.dataset.elId);
    e.preventDefault();
    node.setPointerCapture(e.pointerId);

    const el = store.getElement(node.dataset.elId);
    startX = e.clientX;
    startY = e.clientY;
    origX = el.x;
    origY = el.y;
    node.style.cursor = 'grabbing';
  });

  node.addEventListener('pointermove', e => {
    if (!node.hasPointerCapture(e.pointerId)) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const nx = Math.round((origX + dx) / 8) * 8;
    const ny = Math.round((origY + dy) / 8) * 8;
    store.updateElement(node.dataset.elId, { x: nx, y: ny });
  });

  node.addEventListener('pointerup', e => {
    node.releasePointerCapture(e.pointerId);
    node.style.cursor = '';
  });
}