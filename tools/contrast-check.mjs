const luminance = (hex) => {
  const c = hex.match(/[a-f\d]{2}/gi).map((x) => parseInt(x, 16) / 255).map((x) => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4);
  return .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
};
const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + .05) / (lo + .05);
};
const pairs = [
  ['dark body', '#E7EEF6', '#07111F'], ['dark muted', '#93A7BD', '#07111F'],
  ['dark accent', '#34D399', '#07111F'], ['dark warning', '#FBBF24', '#07111F'],
  ['dark danger', '#F87171', '#07111F'], ['dark info', '#60A5FA', '#07111F'],
  ['light body', '#0B1626', '#F7FAFC'], ['light muted', '#506478', '#F7FAFC'],
  ['light accent', '#047857', '#F7FAFC'], ['light warning', '#B45309', '#F7FAFC'],
  ['light danger', '#B91C1C', '#F7FAFC'], ['light info', '#1D4ED8', '#F7FAFC'],
];
const failures = pairs.map(([name, fg, bg]) => [name, ratio(fg, bg)]).filter(([, value]) => value < 4.5);
for (const [name, value] of pairs.map(([name, fg, bg]) => [name, ratio(fg, bg)])) console.log(`${name}: ${value.toFixed(2)}:1`);
if (failures.length) { console.error('Contrast below WCAG AA 4.5:1:', failures); process.exitCode = 1; }
