// Credit: Kennebec - https://stackoverflow.com/a/14482123/2816869
const nthIndex = (str, pat, n) => {
	const l = str.length
	let i = -1
	while (n-- && i++ < l) {
		i = str.indexOf(pat, i)
		if (i < 0) {
			break
		}
	}
	return i
}

module.exports = nthIndex
