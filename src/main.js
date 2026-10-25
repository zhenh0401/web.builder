import { store } from './store.js';
import { renderCanvas } from './editor-render.js';
import { renderProperties } from './properties.js';
import { createText, createButton, createDivider, createBox, createEmbed, createImage, createCollapsible } from './elements.js';
import { downloadHTML } from './export.js';
import { importFromText } from './import.js';

const factories = { 
  text: createText, button: createButton, divider: createDivider, box: createBox, 
  embed: createEmbed, image: createImage, collapsible: createCollapsible 
};

document.querySelectorAll('[data-add]').forEach(btn => {
  btn.addEventListener('click', () => {
    const make = factories[btn.dataset.add];
    if (make) store.addElement(make(100, 100));
  });
});

// Clicking empty space clears the selection
document.getElementById('canvas-wrap').addEventListener('pointerdown', e => {
  if (e.target.id === 'canvas' || e.target.id === 'canvas-wrap') {
    store.clearSelection();
  }
});

document.getElementById('btn-export').addEventListener('click', () => {
  downloadHTML(store.doc, 'index.html');
});

document.getElementById('btn-import').addEventListener('click', () => {
  document.getElementById('file-import').click();
});

document.getElementById('file-import').addEventListener('change', async e => {
  const file = e.target.files[0];
  if (!file) return;
  const text = await file.text();
  try {
    const model = importFromText(text);
    store.loadDoc(model); 
  } catch (err) {
    alert('Import failed: ' + err.message);
  }
  e.target.value = '';
});

document.addEventListener('keydown', e => {
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

  if (e.key === 'Delete' || e.key === 'Backspace') {
    e.preventDefault();
    store.deleteSelected();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
    e.preventDefault();
    if (e.shiftKey) store.redo();
    else store.undo();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
    e.preventDefault();
    store.redo();
  }
});

window.store = store;

store.subscribe(renderCanvas);
store.subscribe(renderProperties);
renderCanvas();
renderProperties();