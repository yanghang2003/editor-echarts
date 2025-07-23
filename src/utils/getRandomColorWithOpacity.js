export function getRandomColorWithOpacity() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  // 将 HEX 颜色 (#RRGGBB) 转换为 RGBA (R, G, B, 0.1)
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, 0.1)`; // 添加 0.1 透明度
}