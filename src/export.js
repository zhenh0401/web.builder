import { renderContent } from './render.js';

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function elementToHTML(el) {
  const wrapper = document.createElement('div');
  Object.assign(wrapper.style, {
    position: 'absolute',
    left: el.x + 'px',
    top: el.y + 'px',
    width: el.w + 'px',
    height: el.h + 'px',
    zIndex: el.z,
  });
  wrapper.appendChild(renderContent(el));
  return wrapper.outerHTML;
}

export function exportHTML(doc) {
  const els = [...doc.elements].sort((a, b) => a.z - b.z);
  const bodyHTML = els.map(elementToHTML).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>My Page</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: ${escapeHtml(doc.background)}; }
  .page { position: relative; width: ${doc.canvas.width}px; height: ${doc.canvas.height}px; margin: 0 auto; }
</style>
</head>
<body>
<div class="page">
${bodyHTML}
</div>
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