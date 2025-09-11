// Utility zur dynamischen Wortanzahl-Ermittlung für JSX/HTML Content
export function computeWordCountFromNode(node) {
  if (!node) return 0;
  // Falls DOM-Node: innerText bevorzugen
  if (typeof window !== 'undefined' && node instanceof HTMLElement) {
    return node.innerText.trim().split(/\s+/).filter(Boolean).length;
  }
  // Fallback: Text aus children extrahieren (React-Node)
  if (typeof node === 'object' && node.props && node.props.children) {
    const flatten = (children) => Array.isArray(children)
      ? children.flatMap(flatten)
      : (typeof children === 'string' ? [children] : (children && children.props ? flatten(children.props.children) : []));
    const text = flatten(node.props.children).join(' ');
    return text.trim().split(/\s+/).filter(Boolean).length;
  }
  return 0;
}
