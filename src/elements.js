import { uid } from './store.js';

const base = (x, y) => ({
  id: uid(),
  x, y,
  w: 200, h: 80,
  z: Date.now(),
  style: {},
  props: {},
});

export const createText = (x, y) => ({
  ...base(x, y),
  type: 'text',
  w: 320, h: 48,
  style: { color: '#ffffff', fontSize: '24px', fontWeight: '600' },
  props: { text: 'Hello, world' },
});

export const createButton = (x, y) => ({
  ...base(x, y),
  type: 'button',
  w: 140, h: 44,
  style: {
    background: '#2563eb', color: '#ffffff',
    borderRadius: '6px', border: 'none',
    fontSize: '15px', fontWeight: '600',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', textDecoration: 'none',
  },
  props: { text: 'Click me', href: '#' },
});

export const createDivider = (x, y) => ({
  ...base(x, y),
  type: 'divider',
  w: 300, h: 2,
  style: { background: '#444444' },
  props: {},
});

export const createBox = (x, y) => ({
  ...base(x, y),
  type: 'box',
  w: 300, h: 200,
  style: { background: '#1e1e1e', border: '1px solid #333333', borderRadius: '12px' },
  props: {},
});

export const createEmbed = (x, y) => ({
  ...base(x, y),
  type: 'embed',
  w: 480, h: 270,
  style: { border: 'none', borderRadius: '8px', overflow: 'hidden' },
  props: { html: '' }, // Raw HTML is pasted here
});

export const createImage = (x, y) => ({
  ...base(x, y),
  type: 'image',
  w: 400, h: 300,
  style: { background: '#252525', objectFit: 'cover', borderRadius: '8px' },
  props: { src: '' },
});

export const createCollapsible = (x, y) => ({
  ...base(x, y),
  type: 'collapsible',
  w: 600, h: 80,
  style: { background: '#1e1e1e', color: '#ffffff', border: '1px solid #444', borderRadius: '8px' },
  props: { 
    title: 'Click to expand',
    content: 'Add your text or paste HTML embed code here. It will automatically render!' 
  },
});