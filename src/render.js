export function renderContent(el) {
  const node = document.createElement('div');
  Object.assign(node.style, {
    width: '100%', height: '100%',
    ...el.style,
  });

  switch (el.type) {
    case 'text': {
      node.textContent = el.props.text;
      node.style.whiteSpace = 'pre-wrap';
      node.style.overflow = 'hidden';
      break;
    }
    case 'button': {
      const a = document.createElement('a');
      a.href = el.props.href || '#';
      a.textContent = el.props.text;
      Object.assign(a.style, {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '100%', height: '100%',
        color: 'inherit', textDecoration: 'inherit',
      });
      node.appendChild(a);
      break;
    }
    case 'divider':
    case 'box':
      break;
  }
  return node;
}