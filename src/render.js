export function renderContent(el, isEditor = false) {
  const node = document.createElement('div');
  Object.assign(node.style, {
    width: '100%', height: '100%',
    ...el.style,
  });

  const autoEmbed = (text) => {
    if (text.trim().startsWith('<iframe') || text.trim().startsWith('<div') || text.trim().startsWith('<script') || text.trim().startsWith('<blockquote')) {
      const div = document.createElement('div');
      div.innerHTML = text;
      div.style.width = '100%';
      div.style.height = '100%';
      div.style.pointerEvents = 'none';
      return div;
    }
    return null;
  };

  switch (el.type) {
    case 'text': {
      const embedded = autoEmbed(el.props.text);
      if (embedded) {
        node.appendChild(embedded);
      } else {
        node.innerHTML = el.props.text; // Use innerHTML to allow text formatting
        node.style.whiteSpace = 'pre-wrap';
      }
      node.style.overflow = 'hidden';
      break;
    }
    case 'button': {
      const a = document.createElement('a');
      a.href = el.props.href || '#';
      a.innerHTML = el.props.text;
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
    case 'embed': {
      const div = document.createElement('div');
      div.innerHTML = el.props.html || '';
      div.style.width = '100%';
      div.style.height = '100%';
      if (!el.props.html || el.props.html.trim() === '') {
         div.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#888;background:#222;border:1px dashed #444;">Paste HTML in right panel</div>';
      }
      if (isEditor) div.style.pointerEvents = 'none';
      node.appendChild(div);
      break;
    }
    case 'image': {
      if (el.props.src) {
        const img = document.createElement('img');
        img.src = el.props.src;
        Object.assign(img.style, {
          width: '100%', height: '100%',
          objectFit: el.style.objectFit || 'cover',
          borderRadius: el.style.borderRadius || '0',
          pointerEvents: 'none'
        });
        node.appendChild(img);
      } else {
        node.style.display = 'flex';
        node.style.alignItems = 'center';
        node.style.justifyContent = 'center';
        node.style.color = '#888';
        node.textContent = 'Upload Image';
      }
      break;
    }
    case 'collapsible': {
      const details = document.createElement('details');
      Object.assign(details.style, {
        width: '100%', height: '100%',
        padding: '12px', boxSizing: 'border-box',
        overflow: 'hidden'
      });
      
      const summary = document.createElement('summary');
      summary.textContent = el.props.title || 'Click to expand';
      summary.style.cursor = 'pointer';
      summary.style.fontWeight = 'bold';
      summary.style.outline = 'none';
      
      const content = document.createElement('div');
      content.style.marginTop = '12px';
      content.style.fontSize = '14px';
      
      const embedded = autoEmbed(el.props.content);
      if (embedded) {
        content.appendChild(embedded);
      } else {
        content.innerHTML = el.props.content;
        content.style.whiteSpace = 'pre-wrap';
      }

      details.appendChild(summary);
      details.appendChild(content);
      
      if (isEditor) details.style.pointerEvents = 'none';
      node.appendChild(details);
      break;
    }
  }

  if (isEditor) {
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5
    });
    node.appendChild(overlay);
  }

  return node;
}