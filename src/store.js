export function uid() {
  return 'el_' + Math.random().toString(36).slice(2, 9);
}

const defaultPage = () => ({ id: uid(), name: 'Home', elements: [] });

export const store = {
  doc: {
    version: 1,
    siteName: 'My Website',
    theme: 'dark',
    header: { background: '#1a1a1a', textColor: '#ffffff', imageUrl: '' },
    pages: [defaultPage()],
    activePageId: null
  },
  selectedId: null,
  listeners: [],
  history: [],
  historyIndex: -1,
  snapToGrid: true,
  showGrid: true,

  init() {
    if (!this.doc.activePageId) this.doc.activePageId = this.doc.pages[0].id;
    this.history = [JSON.stringify(this.doc)];
    this.historyIndex = 0;
  },

  subscribe(fn) { this.listeners.push(fn); },
  emit() { this.listeners.forEach(fn => fn()); },

  pushHistory() {
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    this.history.push(JSON.stringify(this.doc));
    this.historyIndex++;
  },

  undo() {
    if (this.historyIndex > 0) {
      this.historyIndex--;
      this.doc = JSON.parse(this.history[this.historyIndex]);
      this.selectedId = null;
      this.emit();
    }
  },

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.doc = JSON.parse(this.history[this.historyIndex]);
      this.selectedId = null;
      this.emit();
    }
  },

  getPage() {
    if (!this.doc.activePageId) this.doc.activePageId = this.doc.pages[0].id;
    return this.doc.pages.find(p => p.id === this.doc.activePageId);
  },

  getElement(id) { 
    const page = this.getPage();
    return page ? page.elements.find(e => e.id === id) : null; 
  },

  addPage() {
    const p = { id: uid(), name: `Page ${this.doc.pages.length + 1}`, elements: [] };
    this.doc.pages.push(p);
    this.doc.activePageId = p.id;
    this.pushHistory();
    this.emit();
  },

  switchPage(id) {
    this.doc.activePageId = id;
    this.selectedId = null;
    this.emit();
  },

  addElement(el) {
    // AUTO-ORGANIZE LOGIC: Find the lowest available Y position
    if (this.snapToGrid) {
      const page = this.getPage();
      if (page.elements.length > 0) {
        let maxY = 0;
        page.elements.forEach(e => {
          if (e.y + e.h > maxY) maxY = e.y + e.h;
        });
        el.y = Math.round((maxY + 20) / 8) * 8; // Place below lowest element
        el.x = 40;
      } else {
        el.x = 40; el.y = 40; // First element
      }
    }

    this.getPage().elements.push(el);
    this.selectedId = el.id;
    this.pushHistory();
    this.emit();
  },

  updateElement(id, patch) {
    const el = this.getElement(id);
    if (!el) return;
    Object.assign(el, patch);
    this.pushHistory();
    this.emit();
  },

  updateStyle(id, stylePatch) {
    const el = this.getElement(id);
    if (!el) return;
    el.style = { ...el.style, ...stylePatch };
    this.pushHistory();
    this.emit();
  },

  deleteElement(id) {
    const page = this.getPage();
    page.elements = page.elements.filter(e => e.id !== id);
    if (this.selectedId === id) this.selectedId = null;
    this.pushHistory();
    this.emit();
  },

  deleteSelected() {
    if (this.selectedId) this.deleteElement(this.selectedId);
  },

  select(id) { this.selectedId = id; this.emit(); },

  loadDoc(doc) { 
    this.doc = doc; 
    this.selectedId = null; 
    this.pushHistory();
    this.emit(); 
  },
};

store.init();