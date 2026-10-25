import { renderContent } from './render.js';

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function elementToHTML(el) {
  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, {
    position: 'absolute', left: el.x + 'px', top: el.y + 'px',
    width: el.w + 'px', height: el.h + 'px', zIndex: el.z,
  });
  wrapper.appendChild(renderContent(el, false));
  return wrapper.outerHTML;
}

export function exportHTML(doc) {
  const isDark = doc.theme === 'dark';
  const bgColor = isDark ? '#121212' : '#ffffff';
  const textColor = isDark ? '#e0e0e0' : '#333333';

  const pagesHTML = doc.pages.map(page => {
    const els = [...page.elements].sort((a, b) => a.z - b.z);
    const bodyHTML = els.map(elementToHTML).join('\n');
    return `
      <div class="page-content" data-page-id="${page.id}" data-page-name="${escapeHtml(page.name)}" style="display: ${page.id === doc.activePageId ? 'block' : 'none'}; position: relative; width: 100%; height: 800px;">
        ${bodyHTML}
      </div>
    `;
  }).join('\n');

  const navLinks = doc.pages.map(p => `
    <span class="nav-link" data-page-id="${p.id}" data-page-name="${escapeHtml(p.name)}" style="cursor: pointer; font-size: 16px; opacity: ${p.id === doc.activePageId ? 1 : 0.7};">
      ${escapeHtml(p.name)}
    </span>
  `).join('');

  const bgStyle = doc.header.imageUrl 
    ? `background-image: url(${doc.header.imageUrl}); background-size: cover; background-position: center;` 
    : `background-color: ${doc.header.background};`;

  const activePageName = doc.pages.find(p => p.id === doc.activePageId)?.name || '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(doc.siteName)}</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: ${bgColor}; color: ${textColor}; }
  
  #header {
    width: 100%; display: flex; align-items: center; ${bgStyle}
  }
  
  .header-inner { 
    position: relative;
    display: flex; 
    justify-content: space-between; 
    align-items: flex-start; 
    width: 100%; 
    max-width: 1200px; 
    margin: 0 auto; 
    height: 250px; 
    padding: 32px 48px 0 48px; 
    box-sizing: border-box;
  }
  
  .site-name { margin: 0; font-size: 22px; font-weight: 600; color: ${doc.header.textColor}; z-index: 2; }
  .page-title { 
    position: absolute; 
    left: 50%; 
    top: 50%; 
    transform: translate(-50%, -50%); 
    margin: 0; 
    font-size: 48px; 
    font-weight: 800; 
    color: ${doc.header.textColor}; 
    text-align: center; 
    white-space: nowrap; 
    z-index: 1; 
  }
  .nav-links { display: flex; gap: 24px; color: ${doc.header.textColor}; z-index: 2; }
  
  #app-container { width: 100%; max-width: 1200px; margin: 0 auto; position: relative; min-height: 800px; }
</style>
</head>
<body>

<div id="header">
  <div class="header-inner">
    <h1 class="site-name">${escapeHtml(doc.siteName)}</h1>
    <h2 class="page-title" id="header-page-title">${escapeHtml(activePageName)}</h2>
    <div class="nav-links">${navLinks}</div>
  </div>
</div>

<div id="app-container">
  ${pagesHTML}
</div>

<script>
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = e.target.dataset.pageId;
      const name = e.target.dataset.pageName;
      
      document.querySelectorAll('.nav-link').forEach(l => l.style.opacity = '0.7');
      e.target.style.opacity = '1';
      
      document.getElementById('header-page-title').textContent = name;
      
      document.querySelectorAll('.page-content').forEach(p => p.style.display = 'none');
      document.querySelector('[data-page-id="' + id + '"]').style.display = 'block';
    });
  });
</script>

<script type="application/json" id="__builder-data">
${JSON.stringify(doc)}
</script>
</body>
</html>`;
}

export function downloadHTML(doc, filename) {
  const html = exportHTML(doc);
  const blob = new Blob([html], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename || 'index.html';
  a.click();
  URL.revokeObjectURL(a.href);
}