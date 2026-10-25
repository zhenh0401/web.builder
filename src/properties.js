import { store } from './store.js';

let lastSelectedId = undefined;
let lastActivePageId = undefined;

export function renderProperties() {
  const panel = document.getElementById('properties');
  
  if (store.selectedIds.length === 0) {
    if (lastSelectedId === null && store.doc.activePageId === lastActivePageId) return;
    lastSelectedId = null;
    lastActivePageId = store.doc.activePageId;
    renderPageProps(panel);
    return;
  }

  // If multiple elements are selected, show the alignment tools
  if (store.selectedIds.length > 1) {
    renderMultiSelectProps(panel);
    return;
  }

  // Single element selected
  const el = store.getElement(store.selectedIds[0]);
  if (!el) return;

  if (store.selectedIds[0] === lastSelectedId) return;
  lastSelectedId = store.selectedIds[0];
  renderElementProps(panel, el);
}

function renderMultiSelectProps(panel) {
  panel.innerHTML = `
    <div style="font-weight:bold;margin-bottom:12px;">${store.selectedIds.length} Elements Selected</div>
    <div style="margin-bottom:12px; font-size:12px; color:#aaa;">Align horizontally:</div>
    <div style="display:flex; gap:4px; margin-bottom:12px;">
      <button id="align-left" style="flex:1;padding:6px;background:#333;border:1px solid #555;color:#fff;cursor:pointer;">Left</button>
      <button id="align-center-h" style="flex:1;padding:6px;background:#333;border:1px solid #555;color:#fff;cursor:pointer;">Center</button>
      <button id="align-right" style="flex:1;padding:6px;background:#333;border:1px solid #555;color:#fff;cursor:pointer;">Right</button>
    </div>
    <div style="margin-bottom:12px; font-size:12px; color:#aaa;">Align vertically:</div>
    <div style="display:flex; gap:4px; margin-bottom:24px;">
      <button id="align-top" style="flex:1;padding:6px;background:#333;border:1px solid #555;color:#fff;cursor:pointer;">Top</button>
      <button id="align-center-v" style="flex:1;padding:6px;background:#333;border:1px solid #555;color:#fff;cursor:pointer;">Middle</button>
      <button id="align-bottom" style="flex:1;padding:6px;background:#333;border:1px solid #555;color:#fff;cursor:pointer;">Bottom</button>
    </div>
    <button id="prop-delete" style="width:100%;padding:8px;background:#7f1d1d;border:none;color:#fff;border-radius:4px;cursor:pointer;">Delete Elements</button>
  `;

  panel.querySelector('#align-left').onclick = () => store.alignSelection('left');
  panel.querySelector('#align-center-h').onclick = () => store.alignSelection('center-h');
  panel.querySelector('#align-right').onclick = () => store.alignSelection('right');
  panel.querySelector('#align-top').onclick = () => store.alignSelection('top');
  panel.querySelector('#align-center-v').onclick = () => store.alignSelection('center-v');
  panel.querySelector('#align-bottom').onclick = () => store.alignSelection('bottom');
  panel.querySelector('#prop-delete').onclick = () => store.deleteSelected();
}

function renderElementProps(panel, el) {
  let html = `<div style="font-size:12px;color:#2563eb;margin-bottom:12px;cursor:pointer;" id="back-to-page">← Back to Page Settings</div>`;
  html += `<div style="font-weight:bold;margin-bottom:12px;">Edit ${el.type.toUpperCase()}</div>`;

  // Z-Index Controls
  html += `
    <div style="display:flex; gap:4px; margin-bottom:16px;">
      <button id="layer-up" style="flex:1;padding:6px;background:#333;border:1px solid #555;color:#fff;cursor:pointer;">Bring Forward</button>
      <button id="layer-down" style="flex:1;padding:6px;background:#333;border:1px solid #555;color:#fff;cursor:pointer;">Send Backward</button>
    </div>
  `;

  if (el.type === 'text' || el.type === 'button') {
    html += `<div style="margin-bottom:12px;"><label style="display:block;font-size:11px;color:#666;">Text (Supports HTML)</label><textarea id="prop-text" style="width:100%;height:60px;padding:6px;background:#252525;border:1px solid #444;color:#fff;border-radius:4px;resize:vertical;">${el.props.text || ''}</textarea></div>`;
    
    html += `<div style="display:flex;gap:8px;margin-bottom:12px;">
      <div style="flex:2;"><label style="display:block;font-size:11px;color:#666;">Font Family</label>
        <select id="prop-fontFamily" style="width:100%;padding:6px;background:#252525;border:1px solid #444;color:#fff;border-radius:4px;">
          <option value="-apple-system, BlinkMacSystemFont, sans-serif" ${el.style.fontFamily?.includes('sans-serif') ? 'selected' : ''}>Sans-Serif</option>
          <option value="Georgia, serif" ${el.style.fontFamily?.includes('Georgia') ? 'selected' : ''}>Serif</option>
          <option value="monospace" ${el.style.fontFamily?.includes('monospace') ? 'selected' : ''}>Monospace</option>
        </select>
      </div>
      <div style="flex:1;"><label style="display:block;font-size:11px;color:#666;">Size</label><input id="prop-fontSize" type="text" value="${el.style.fontSize || ''}" placeholder="16px" style="width:100%;padding:6px;background:#252525;border:1px solid #444;color:#fff;border-radius:4px;"></div>
    </div>`;

    const isBold = el.style.fontWeight === 'bold' || parseInt(el.style.fontWeight) > 500;
    const isItalic = el.style.fontStyle === 'italic';
    const isUnder = el.style.textDecoration === 'underline';
    html += `<div style="display:flex;gap:8px;margin-bottom:12px;">
      <button id="fmt-bold" style="flex:1;padding:6px;background:${isBold ? '#2563eb' : '#252525'};color:#fff;border:1px solid #444;border-radius:4px;cursor:pointer;font-weight:bold;">B</button>
      <button id="fmt-italic" style="flex:1;padding:6px;background:${isItalic ? '#2563eb' : '#252525'};color:#fff;border:1px solid #444;border-radius:4px;cursor:pointer;font-style:italic;">I</button>
      <button id="fmt-under" style="flex:1;padding:6px;background:${isUnder ? '#2563eb' : '#252525'};color:#fff;border:1px solid #444;border-radius:4px;cursor:pointer;text-decoration:underline;">U</button>
    </div>`;
  }

  if (el.type === 'button') {
    html += `<div style="margin-bottom:12px;"><label style="display:block;font-size:11px;color:#666;">URL</label><input id="prop-url" type="text" value="${escapeAttr(el.props.href)}" style="width:100%;padding:6px;background:#252525;border:1px solid #444;color:#fff;border-radius:4px;"></div>`;
  }

  if (el.type === 'image') {
    html += `<div style="margin-bottom:12px;"><label style="display:block;font-size:11px;color:#666;">Upload Image</label><input id="prop-img" type="file" accept="image/*" style="width:100%;font-size:12px;color:#ccc;"></div>`;
    html += `<div style="margin-bottom:12px;"><label style="display:block;font-size:11px;color:#666;">Image URL</label><input id="prop-img-url" type="text" value="${escapeAttr(el.props.src)}" style="width:100%;padding:6px;background:#252525;border:1px solid #444;color:#fff;border-radius:4px;"></div>`;
  }

  if (el.type === 'embed') {
    html += `<div style="margin-bottom:12px;"><label style="display:block;font-size:11px;color:#666;">Embed HTML Code</label><textarea id="prop-html" style="width:100%;height:100px;padding:6px;background:#252525;border:1px solid #444;color:#fff;border-radius:4px;font-family:monospace;resize:vertical;">${el.props.html}</textarea></div>`;
    html += `<button id="btn-yt-embed" style="width:100%;margin-bottom:12px;padding:6px;background:#ff0000;border:none;color:#fff;border-radius:4px;cursor:pointer;">+ Insert YouTube</button>`;
  }

  if (el.type === 'collapsible') {
    html += `<div style="margin-bottom:12px;"><label style="display:block;font-size:11px;color:#666;">Title</label><input id="prop-title" type="text" value="${escapeAttr(el.props.title)}" style="width:100%;padding:6px;background:#252525;border:1px solid #444;color:#fff;border-radius:4px;"></div>`;
    html += `<div style="margin-bottom:12px;"><label style="display:block;font-size:11px;color:#666;">Content (Supports HTML)</label><textarea id="prop-content" style="width:100%;height:80px;padding:6px;background:#252525;border:1px solid #444;color:#fff;border-radius:4px;resize:vertical;">${el.props.content}</textarea></div>`;
  }

  html += `
    <div style="margin-bottom:12px;"><label style="display:block;font-size:11px;color:#666;">Background Color</label><input id="prop-bg" type="color" value="${(el.style.background || '#000000').slice(0,7)}" style="width:100%;height:32px;border:none;"></div>
    <div style="margin-bottom:12px;"><label style="display:block;font-size:11px;color:#666;">Text Color</label><input id="prop-color" type="color" value="${(el.style.color || '#ffffff').slice(0,7)}" style="width:100%;height:32px;border:none;"></div>
    <div style="margin-bottom:12px;"><label style="display:block;font-size:11px;color:#666;">Corner Radius (px)</label><input id="prop-radius" type="number" value="${parseInt(el.style.borderRadius) || 0}" style="width:100%;padding:6px;background:#252525;border:1px solid #444;color:#fff;border-radius:4px;"></div>
    <button id="prop-delete" style="width:100%;padding:8px;background:#7f1d1d;border:none;color:#fff;border-radius:4px;cursor:pointer;margin-top:20px;">Delete Element</button>
  `;

  panel.innerHTML = html;

  panel.querySelector('#back-to-page').onclick = () => { store.clearSelection(); };
  panel.querySelector('#layer-up').onclick = () => store.bringForward();
  panel.querySelector('#layer-down').onclick = () => store.sendBackward();
  
  if (panel.querySelector('#prop-text')) panel.querySelector('#prop-text').oninput = e => store.updateElement(el.id, { props: { ...el.props, text: e.target.value } });
  if (panel.querySelector('#prop-url')) panel.querySelector('#prop-url').oninput = e => store.updateElement(el.id, { props: { ...el.props, href: e.target.value } });
  if (panel.querySelector('#prop-title')) panel.querySelector('#prop-title').oninput = e => store.updateElement(el.id, { props: { ...el.props, title: e.target.value } });
  if (panel.querySelector('#prop-content')) panel.querySelector('#prop-content').oninput = e => store.updateElement(el.id, { props: { ...el.props, content: e.target.value } });
  
  if (panel.querySelector('#prop-fontFamily')) panel.querySelector('#prop-fontFamily').onchange = e => store.updateStyle(el.id, { fontFamily: e.target.value });
  if (panel.querySelector('#prop-fontSize')) panel.querySelector('#prop-fontSize').oninput = e => store.updateStyle(el.id, { fontSize: e.target.value });
  
  if (panel.querySelector('#fmt-bold')) panel.querySelector('#fmt-bold').onclick = () => store.updateStyle(el.id, { fontWeight: el.style.fontWeight === 'bold' ? 'normal' : 'bold' });
  if (panel.querySelector('#fmt-italic')) panel.querySelector('#fmt-italic').onclick = () => store.updateStyle(el.id, { fontStyle: el.style.fontStyle === 'italic' ? 'normal' : 'italic' });
  if (panel.querySelector('#fmt-under')) panel.querySelector('#fmt-under').onclick = () => store.updateStyle(el.id, { textDecoration: el.style.textDecoration === 'underline' ? 'none' : 'underline' });

  if (panel.querySelector('#prop-html')) {
    panel.querySelector('#prop-html').oninput = e => store.updateElement(el.id, { props: { ...el.props, html: e.target.value } });
    panel.querySelector('#btn-yt-embed').onclick = () => {
      const url = prompt("Paste YouTube Video URL:");
      if (!url) return;
      let vidId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.includes('youtu.be/') ? url.split('youtu.be/')[1].split('?')[0] : '';
      if (vidId) {
        const iframe = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${vidId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        store.updateElement(el.id, { props: { ...el.props, html: iframe } });
      } else alert("Invalid URL");
    };
  }

  if (panel.querySelector('#prop-img')) panel.querySelector('#prop-img').onchange = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => store.updateElement(el.id, { props: { ...el.props, src: ev.target.result } });
    reader.readAsDataURL(file);
  };
  if (panel.querySelector('#prop-img-url')) panel.querySelector('#prop-img-url').oninput = e => store.updateElement(el.id, { props: { ...el.props, src: e.target.value } });

  panel.querySelector('#prop-bg').oninput = e => store.updateStyle(el.id, { background: e.target.value });
  panel.querySelector('#prop-color').oninput = e => store.updateStyle(el.id, { color: e.target.value });
  panel.querySelector('#prop-radius').oninput = e => store.updateStyle(el.id, { borderRadius: e.target.value + 'px' });
  panel.querySelector('#prop-delete').onclick = () => store.deleteSelected();
}

function renderPageProps(panel) {
  const doc = store.doc;
  panel.innerHTML = `
    <div style="font-weight:bold;margin-bottom:12px;">Page & Header Settings</div>
    
    <div style="margin-bottom:12px;"><label style="display:block;font-size:11px;color:#666;">Site Name</label><input id="doc-site-name" type="text" value="${escapeAttr(doc.siteName)}" style="width:100%;padding:6px;background:#252525;border:1px solid #444;color:#fff;border-radius:4px;"></div>
    <div style="margin-bottom:12px;"><label style="display:block;font-size:11px;color:#666;">Page Name</label><input id="doc-page-name" type="text" value="${escapeAttr(store.getPage().name)}" style="width:100%;padding:6px;background:#252525;border:1px solid #444;color:#fff;border-radius:4px;"></div>

    <div style="margin-bottom:12px;"><label style="display:block;font-size:11px;color:#666;">Theme</label>
      <select id="doc-theme" style="width:100%;padding:6px;background:#252525;border:1px solid #444;color:#fff;border-radius:4px;">
        <option value="dark" ${doc.theme === 'dark' ? 'selected' : ''}>Dark Mode</option>
        <option value="light" ${doc.theme === 'light' ? 'selected' : ''}>Light Mode</option>
      </select>
    </div>

    <div style="margin-bottom:12px; display:flex; align-items:center; gap:8px;">
      <input type="checkbox" id="doc-snap-grid" ${store.snapToGrid ? 'checked' : ''}>
      <label style="font-size:12px;color:#ccc;">Auto-Align New Items</label>
    </div>

    <div style="margin-bottom:12px; display:flex; align-items:center; gap:8px;">
      <input type="checkbox" id="doc-show-grid" ${store.showGrid ? 'checked' : ''}>
      <label style="font-size:12px;color:#ccc;">Show Canvas Grid</label>
    </div>

    <div style="margin-bottom:12px;"><label style="display:block;font-size:11px;color:#666;">Header Background</label><input id="doc-header-bg" type="color" value="${doc.header.background.slice(0,7)}" style="width:100%;height:32px;border:none;"></div>
    <div style="margin-bottom:12px;"><label style="display:block;font-size:11px;color:#666;">Header Text Color</label><input id="doc-header-color" type="color" value="${doc.header.textColor.slice(0,7)}" style="width:100%;height:32px;border:none;"></div>
    <div style="margin-bottom:24px;"><label style="display:block;font-size:11px;color:#666;">Header Background Image</label><input id="doc-header-img" type="file" accept="image/*" style="width:100%;font-size:12px;color:#ccc;"></div>

    <button id="doc-add-page" style="width:100%;padding:10px;background:#2563eb;border:none;color:#fff;border-radius:6px;cursor:pointer;font-weight:bold;">＋ Add New Page</button>
  `;

  panel.querySelector('#doc-site-name').oninput = e => { doc.siteName = e.target.value; store.emit(); };
  panel.querySelector('#doc-page-name').oninput = e => { store.getPage().name = e.target.value; store.emit(); };
  panel.querySelector('#doc-theme').onchange = e => { doc.theme = e.target.value; store.emit(); };
  panel.querySelector('#doc-snap-grid').onchange = e => { store.snapToGrid = e.target.checked; };
  panel.querySelector('#doc-show-grid').onchange = e => { store.showGrid = e.target.checked; store.emit(); };
  panel.querySelector('#doc-header-bg').oninput = e => { doc.header.background = e.target.value; store.emit(); };
  panel.querySelector('#doc-header-color').oninput = e => { doc.header.textColor = e.target.value; store.emit(); };
  
  panel.querySelector('#doc-header-img').onchange = e => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { doc.header.imageUrl = ev.target.result; store.emit(); };
    reader.readAsDataURL(file);
  };

  panel.querySelector('#doc-add-page').onclick = () => { store.addPage(); };
}

function escapeAttr(s) {
  return String(s || '').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}