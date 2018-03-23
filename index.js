const path = require('path')
const ansiRegex = require('ansi-regex')
const superSplit = require('super-split')
const arrayUniq = require('array-uniq')

const nthIndex = require(path.join(__dirname, 'nth-index'))

const hlx = (str, pos, opts) => {
	const start = pos.start
	const end = pos.end
	const inCol = opts.start.column
	const outCol = opts.end.column
	const len = end - start
	const section = str.substr(start, len)

	const ansies = arrayUniq(section.match(ansiRegex()))
	const atomic = superSplit(section, ansies)

	let a2x = []
	atomic.forEach(atom => {
		if (ansies.includes(atom) === false) {
			a2x = a2x.concat(atom.split(''))
			return
		}
		a2x.push(atom)
	})

	let output = ''
	let x = 0
	let y = -1
	const height = opts.end.line - opts.start.line
	let inPoint
	let outPoint

	const markNotBegun = () => {
		return typeof inPoint !== 'number' &&
			typeof outPoint !== 'number'
	}

	const markHasEnded = () => {
		return typeof inPoint === 'number' &&
			typeof outPoint === 'number'
	}

	const outsideOfMark = () => {
		return markNotBegun() || markHasEnded()
	}

	a2x.forEach(subAtom => {
		if (ansies.includes(subAtom) === false) {
			if (subAtom === '\n') {
				y += 1
				x = 0
			} else {
				x += 1
			}

			if (x === inCol && y === 0) {
				inPoint = output.length
			}

			output += subAtom

			if (x === outCol - 1 && y === height) {
				outPoint = output.length
			}

			return
		}

		if (outsideOfMark()) {
			output += subAtom
		} else if (!outsideOfMark() && !opts.resetColor) {
			output += subAtom
		}
	})

	const pre = output.substr(0, inPoint)
	const mark = opts.color(output.substr(inPoint, outPoint - inPoint))
	const post = output.substr(outPoint)

	const marked = pre + mark + post
	return marked
}

const isOutOfBounds = (text, opts) => {
	const startLine = opts.start.line - 1
	const endLine = opts.end.line
	const startColumn = opts.start.column - 1
	const endColumn = opts.end.column

	const lines = text.split('\n')
	const totalLines = lines.length

	if (endLine > totalLines) {
		return 'End.line marker out of bounds (max).'
	}
	if (endLine < 0) {
		return 'End.line marker out of bounds (min).'
	}
	if (startLine > totalLines) {
		return 'Start.line marker out of bounds (max).'
	}
	if (startLine < 0) {
		return 'Start.line marker out of bounds (min).'
	}
	if (startColumn < 0) {
		return 'Start.column marker out of bounds (min).'
	}
	if (startColumn > lines[startLine].length) {
		return 'Start.column marker out of bounds (max).'
	}
	if (endColumn < 0) {
		return 'End.column marker out of bounds (min).'
	}
	if (endColumn > lines[endLine - 1].length) {
		return 'End.column marker out of bounds (max).'
	}

	return false
}

const markByLineColumn = (text, opts) => {
	const outOfBounds = isOutOfBounds(text, opts)
	if (outOfBounds) {
		throw new Error(outOfBounds)
	}

	const startLine = opts.start.line - 1
	const endLine = opts.end.line
	const startPosLine = nthIndex(text, '\n', startLine)
	const endPosLine = nthIndex(text, '\n', endLine)
	const pos = {
		start: startPosLine,
		end: endPosLine
	}

	const marked = hlx(text, pos, opts)
	const result = text.substr(0, startPosLine) + marked + text.substr(endPosLine)
	return result
}

const markByOffset = (str, opts) => {
	const ansies = arrayUniq(str.match(ansiRegex()))
	const atomic = superSplit(str, ansies)

	let a2x = []
	atomic.forEach(atom => {
		if (ansies.includes(atom) === false) {
			a2x = a2x.concat(atom.split(''))
			return
		}
		a2x.push(atom)
	})

	let output = ''
	let x = 0
	let inPoint
	let outPoint

	const markNotBegun = () => {
		return typeof inPoint !== 'number' &&
			typeof outPoint !== 'number'
	}

	const markHasEnded = () => {
		return typeof inPoint === 'number' &&
			typeof outPoint === 'number'
	}

	const outsideOfMark = () => {
		return markNotBegun() || markHasEnded()
	}

	a2x.forEach(subAtom => {
		if (ansies.includes(subAtom) === false) {
			x += 1

			if (x === opts.start) {
				inPoint = output.length
			}

			output += subAtom

			if (x === opts.end - 1) {
				outPoint = output.length
			}

			return
		}

		if (outsideOfMark()) {
			output += subAtom
		} else if (!outsideOfMark() && !opts.resetColor) {
			output += subAtom
		}
	})

	const pre = output.substr(0, inPoint)
	const mark = opts.color(output.substr(inPoint, outPoint - inPoint))
	const post = output.substr(outPoint)

	const marked = pre + mark + post
	return marked
}

const validMarkersNumbers = opts => {
	return typeof opts.start === 'number' &&
		typeof opts.end === 'number'
}

const validMarkersObject = opts => {
	return typeof opts.start === 'object' &&
		typeof opts.end === 'object' &&
		typeof opts.start.line === 'number' &&
		typeof opts.start.column === 'number' &&
		typeof opts.end.line === 'number' &&
		typeof opts.end.column === 'number'
}

const mark = (text, opts) => {
	if (validMarkersObject(opts)) {
		return markByLineColumn(text, opts)
	}

	if (validMarkersNumbers(opts)) {
		return markByOffset(text, opts)
	}

	throw new Error('Invalid marker definition.')
}

module.exports = mark
