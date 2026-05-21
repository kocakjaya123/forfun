export function formatRupiah(value, { maximumFractionDigits = 0 } = {}) {
  const n = Number(value) || 0;
  const formatted = new Intl.NumberFormat('id-ID', { maximumFractionDigits }).format(n);
  return `Rp ${formatted}`;
}

export default formatRupiah;
