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
  selectedIds: [], // Changed to array for multi-select
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
      this.selectedIds = [];
      this.emit();
    }
  },

  redo() {
    if (this.historyIndex < this.history.length - 1) {
      this.historyIndex++;
      this.doc = JSON.parse(this.history[this.historyIndex]);
      this.selectedIds = [];
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
    this.selectedIds = [];
    this.emit();
  },

  addElement(el) {
    if (this.snapToGrid) {
      const page = this.getPage();
      if (page.elements.length > 0) {
        let maxY = 0;
        page.elements.forEach(e => {
          if (e.y + e.h > maxY) maxY = e.y + e.h;
        });
        el.y = Math.round((maxY + 20) / 8) * 8;
        el.x = 40;
      } else {
        el.x = 40; el.y = 40;
      }
    }
    this.getPage().elements.push(el);
    this.selectedIds = [el.id];
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
    this.selectedIds = this.selectedIds.filter(sid => sid !== id);
    this.pushHistory();
    this.emit();
  },

  deleteSelected() {
    const page = this.getPage();
    page.elements = page.elements.filter(e => !this.selectedIds.includes(e.id));
    this.selectedIds = [];
    this.pushHistory();
    this.emit();
  },

  select(id, isShift) {
    if (isShift) {
      if (this.selectedIds.includes(id)) {
        this.selectedIds = this.selectedIds.filter(sid => sid !== id);
      } else {
        this.selectedIds.push(id);
      }
    } else {
      this.selectedIds = [id];
    }
    this.emit();
  },

  clearSelection() { this.selectedIds = []; this.emit(); },

  alignSelection(type) {
    if (this.selectedIds.length < 2) return;
    const els = this.selectedIds.map(id => this.getElement(id)).filter(Boolean);
    if (els.length === 0) return;

    if (type === 'left') {
      const minX = Math.min(...els.map(e => e.x));
      els.forEach(e => e.x = minX);
    } else if (type === 'right') {
      const maxRight = Math.max(...els.map(e => e.x + e.w));
      els.forEach(e => e.x = maxRight - e.w);
    } else if (type === 'center-h') {
      const avgX = els.reduce((sum, e) => sum + (e.x + e.w / 2), 0) / els.length;
      els.forEach(e => e.x = avgX - e.w / 2);
    } else if (type === 'top') {
      const minY = Math.min(...els.map(e => e.y));
      els.forEach(e => e.y = minY);
    } else if (type === 'bottom') {
      const maxBottom = Math.max(...els.map(e => e.y + e.h));
      els.forEach(e => e.y = maxBottom - e.h);
    } else if (type === 'center-v') {
      const avgY = els.reduce((sum, e) => sum + (e.y + e.h / 2), 0) / els.length;
      els.forEach(e => e.y = avgY - e.h / 2);
    }

    this.pushHistory();
    this.emit();
  },

  bringForward() {
    this.selectedIds.forEach(id => {
      const el = this.getElement(id);
      if (el) el.z = Date.now();
    });
    this.pushHistory();
    this.emit();
  },

  sendBackward() {
    this.selectedIds.forEach(id => {
      const el = this.getElement(id);
      if (el) el.z = 0;
    });
    this.pushHistory();
    this.emit();
  },

  loadDoc(doc) { 
    this.doc = doc; 
    this.selectedIds = []; 
    this.pushHistory();
    this.emit(); 
  },
};

store.init();