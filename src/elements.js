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
  style: { color: '#ffffff', fontSize: '20px', fontWeight: '500', lineHeight: '1.4' },
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
  style: {
    background: '#1e1e1e',
    border: '1px solid #333333',
    borderRadius: '12px',
  },
  props: {},
});