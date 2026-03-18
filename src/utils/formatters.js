export function formatNumber(n) {
  if (n === null || n === undefined) return '0'
  return n.toLocaleString('en-US')
}
