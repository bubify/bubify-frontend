export function isNumeric(n: any) {
  return (!isNaN(parseFloat(n)) && isFinite(n) && !(n.indexOf(' ') >= 0)) || n.length === 0;
}