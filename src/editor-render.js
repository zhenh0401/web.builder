import { renderContent } from './render.js';
import { store } from './store.js';

export function renderCanvas() {
  const canvas = document.getElementById('canvas');
  const doc = store.doc;
  
  const isDark = doc.theme === 'dark';
  document.body.style.background = isDark ? '#121212' : '#f5f5f5';
  document.body.style.color = isDark ? '#e0e0e0' : '#333';
  canvas.style.background = isDark ? '#121212' : '#ffffff';
  
  if (store.showGrid) {
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    canvas.style.backgroundImage = `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`;
    canvas.style.backgroundSize = '8px 8px';
  } else {
    canvas.style.backgroundImage = 'none';
  }

  const headerEl = document.getElementById('site-header');
  headerEl.style.background = doc.header.background;
  headerEl.style.color = doc.header.textColor;
  if (doc.header.imageUrl) {
    headerEl.style.backgroundImage = `url(${doc.header.imageUrl})`;
    headerEl.style.backgroundSize = 'cover';
    headerEl.style.backgroundPosition = 'center';
  } else {
    headerEl.style.backgroundImage = 'none';
  }

  const activePageName = store.getPage().name;

  // Top corners alignment, absolute center for title
  headerEl.innerHTML = `
    <div style="position: relative; display: flex; justify-content: space-between; align-items: flex-start; width: 100%; max-width: 1200px; margin: 0 auto; height: 250px; padding: 32px 48px 0 48px; box-sizing: border-box;">
      
      <!-- Left (Top Left Corner) -->
      <h1 style="margin: 0; font-size: 22px; font-weight: 600; color: ${doc.header.textColor}; z-index: 2;">${doc.siteName}</h1>
      
      <!-- Middle (Absolute Center) -->
      <h2 style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); margin: 0; font-size: 48px; font-weight: 800; color: ${doc.header.textColor}; text-align: center; white-space: nowrap; z-index: 1;">${activePageName}</h2>
      
      <!-- Right (Top Right Corner) -->
      <div style="display: flex; gap: 24px; z-index: 2;">
        ${doc.pages.map(p => `
          <span style="cursor: pointer; font-size: 16px; font-weight: ${p.id === doc.activePageId ? 'bold' : 'normal'}; color: ${doc.header.textColor}; opacity: ${p.id === doc.activePageId ? 1 : 0.7};" onclick="window.store.switchPage('${p.id}')">
            ${p.name}
          </span>
        `).join('')}
      </div>
    </div>
  `;

  const page = store.getPage();
  const sorted = [...page.elements].sort((a, b) => a.z - b.z);
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
      left: el.x + 'px', top: el.y + 'px',
      width: el.w + 'px', height: el.h + 'px',
      zIndex: el.z,
      outline: store.selectedId === el.id ? '2px solid #2563eb' : 'none',
    });
    node.replaceChildren(renderContent(el, true));
    if (store.selectedId === el.id) {
      ['nw', 'ne', 'sw', 'se'].forEach(pos => {
        const handle = document.createElement('div');
        handle.className = `resize-handle ${pos}`;
        handle.dataset.handle = pos;
        node.appendChild(handle);
      });
    }
  }
}

function attachInteractions(node) {
  let startX, startY, origX, origY, origW, origH;
  let isResizing = false;
  let resizeDir = '';

  node.addEventListener('pointerdown', e => {
    store.select(node.dataset.elId);
    const handleEl = e.target.closest('.resize-handle');
    if (handleEl) { isResizing = true; resizeDir = handleEl.dataset.handle; } else { isResizing = false; }
    e.preventDefault();
    node.setPointerCapture(e.pointerId);
    const el = store.getElement(node.dataset.elId);
    startX = e.clientX; startY = e.clientY;
    origX = el.x; origY = el.y; origW = el.w; origH = el.h;
    if (!isResizing) node.style.cursor = 'grabbing';
  });

  node.addEventListener('pointermove', e => {
    if (!node.hasPointerCapture(e.pointerId)) return;
    const dx = e.clientX - startX; const dy = e.clientY - startY;
    
    const snap = (val) => store.snapToGrid ? Math.round(val / 8) * 8 : val;

    if (isResizing) {
      let newX = origX, newY = origY, newW = origW, newH = origH;
      if (resizeDir.includes('e')) newW = Math.max(20, origW + dx);
      if (resizeDir.includes('s')) newH = Math.max(20, origH + dy);
      if (resizeDir.includes('w')) { newW = Math.max(20, origW - dx); newX = origX + dx; }
      if (resizeDir.includes('n')) { newH = Math.max(20, origH - dy); newY = origY + dy; }
      
      store.updateElement(node.dataset.elId, { 
        x: snap(newX), y: snap(newY), w: snap(newW), h: snap(newH) 
      });
    } else {
      store.updateElement(node.dataset.elId, { x: snap(origX + dx), y: snap(origY + dy) });
    }
  });

  node.addEventListener('pointerup', e => {
    node.releasePointerCapture(e.pointerId);
    node.style.cursor = '';
    isResizing = false;
  });
}