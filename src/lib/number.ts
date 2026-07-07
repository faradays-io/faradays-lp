/* ------------------------------------------------------------------ *
 * Numeric input helpers. `sanitizeDecimal` keeps a text field to digits
 * plus a single decimal comma (pt-BR), strips leading zeros, and caps
 * the fractional part — used in place of <input type="number"> so the
 * field rejects letters, signs and exponents the browser otherwise
 * allows. Parse the result with `parseDecimal` (comma → dot).
 * ------------------------------------------------------------------ */

export function sanitizeDecimal(raw: string, decimals = 2): string {
	let v = raw.replace(/[^\d,]/g, '')
	const first = v.indexOf(',')
	if (first !== -1) {
		v = v.slice(0, first + 1) + v.slice(first + 1).replace(/,/g, '')
	}
	const [int, dec] = v.split(',')
	const cleanInt = int.replace(/^0+(?=\d)/, '')
	return dec !== undefined
		? `${cleanInt},${dec.slice(0, decimals)}`
		: cleanInt
}

// "1.234,5" → 1234.5; empty / invalid → NaN.
export function parseDecimal(value: string): number {
	return Number(value.replace(/\./g, '').replace(',', '.'))
}
