export function badge(label, tone = 'neutral') {
  return `<span data-tone="${tone}">${label}</span>`;
}
