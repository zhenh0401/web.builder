export function uid() {
  return 'el_' + Math.random().toString(36).slice(2, 9);
}

export const store = {
  doc: {
    version: 1,
    canvas: { width: 1200, height: 800 },
    background: '#121212',
    elements: [],
  },
  selectedId: null,
  currentFilename: 'index.html',
  exportVersion: 0,
  listeners: [],

  subscribe(fn) { this.listeners.push(fn); },
  emit() { this.listeners.forEach(fn => fn()); },

  getElement(id) { return this.doc.elements.find(e => e.id === id); },

  addElement(el) {
    this.doc.elements.push(el);
    this.selectedId = el.id;
    this.emit();
  },

  updateElement(id, patch) {
    const el = this.getElement(id);
    if (!el) return;
    Object.assign(el, patch);
    this.emit();
  },

  updateStyle(id, stylePatch) {
    const el = this.getElement(id);
    if (!el) return;
    el.style = { ...el.style, ...stylePatch };
    this.emit();
  },

  deleteElement(id) {
    this.doc.elements = this.doc.elements.filter(e => e.id !== id);
    if (this.selectedId === id) this.selectedId = null;
    this.emit();
  },

  select(id) { this.selectedId = id; this.emit(); },

  loadDoc(doc) { 
    this.doc = doc; 
    this.selectedId = null; 
    this.exportVersion = 0;
    this.emit(); 
  },
};