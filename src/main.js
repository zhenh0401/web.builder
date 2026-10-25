import { store } from './store.js';
import { renderCanvas } from './editor-render.js';
import { renderProperties } from './properties.js';
import { createText, createButton, createDivider, createBox } from './elements.js';
import { downloadHTML } from './export.js';
import { importFromText } from './import.js';

const factories = { text: createText, button: createButton, divider: createDivider, box: createBox };

document.querySelectorAll('[data-add]').forEach(btn => {
  btn.addEventListener('click', () => {
    const make = factories[btn.dataset.add];
    if (make) store.addElement(make(100, 100));
  });
});

document.getElementById('btn-export').addEventListener('click', () => {
  let filename = 'index.html';
  if (store.exportVersion > 0) {
    filename = `index-v${store.exportVersion}.html`;
  }
  downloadHTML(store.doc, filename);
  store.exportVersion++;
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

store.subscribe(renderCanvas);
store.subscribe(renderProperties);
renderCanvas();
renderProperties();