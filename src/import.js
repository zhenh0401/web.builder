export function importFromText(text) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');

  const dataEl = doc.getElementById('__builder-data');
  if (dataEl) {
    const model = JSON.parse(dataEl.textContent);
    if (model.version === 1 && Array.isArray(model.elements)) {
      return model;
    }
  }
  throw new Error('No builder data found in file.');
}