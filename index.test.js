import test from 'ava'
import chalk from 'chalk'

import nthIndex from './nth-index'
import ansiMark from '.'

// Encode: get escaped, testable string of correct result
// eslint-disable-next-line no-unused-vars
const encode = result => {
	const json = JSON.stringify(result)
	// eslint-disable-next-line no-console
	console.log(json.replace(/'/g, '\\\''))
}

test('Highlight start and end w/ object definition (line, column)', t => {
	// eslint-disable-next-line unicorn/escape-case
	const ansiStr = '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mBad\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37m  \u001b[39m\n\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m'
	const opts = {
		start: {line: 3, column: 11},
		end: {line: 4, column: 7},
		color: chalk.bgRed.white.bold,
		resetColor: true
	}
	const marked = ansiMark(ansiStr, opts)
	t.is(typeof marked, 'string')

	// eslint-disable-next-line unicorn/escape-case
	t.is(marked, '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mBad\u001b[33m\u001b[41m\u001b[37m\u001b[1m<span>  \u001b[22m\u001b[39m\u001b[49m\n\u001b[41m\u001b[37m\u001b[1m<body>\u001b[22m\u001b[39m\u001b[49m\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m')
})

test('Highlight start and end w/ number definition (offset)', t => {
	// eslint-disable-next-line unicorn/escape-case
	const ansiStr = '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mBad\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37m  \u001b[39m\n\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m'
	const opts = {
		start: 46,
		end: 64,
		color: chalk.bgRed.white.bold,
		resetColor: true
	}
	const marked = ansiMark(ansiStr, opts)
	t.is(typeof marked, 'string')
	// eslint-disable-next-line unicorn/escape-case
	t.is(marked, '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37m\u001b[41m\u001b[37m\u001b[1mBad<span>  \u001b[22m\u001b[39m\u001b[49m\n\u001b[41m\u001b[37m\u001b[1m<body>\u001b[22m\u001b[39m\u001b[49m\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m')
})

test('End.line marker out of bounds (max)', t => {
	// eslint-disable-next-line unicorn/escape-case
	const ansiStr = '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mBad\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37m  \u001b[39m\n\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m'
	const opts = {
		start: {line: 3, column: 11},
		end: {line: 1337, column: 7},
		color: chalk.bgRed.white.bold,
		resetColor: true
	}
	const error = t.throws(() => {
		ansiMark(ansiStr, opts)
	})
	t.is(error.message, 'End.line marker out of bounds (max).')
})

test('End.line marker out of bounds (min)', t => {
	// eslint-disable-next-line unicorn/escape-case
	const ansiStr = '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mBad\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37m  \u001b[39m\n\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m'
	const opts = {
		start: {line: 3, column: 11},
		end: {line: -1337, column: 7},
		color: chalk.bgRed.white.bold,
		resetColor: true
	}
	const error = t.throws(() => {
		ansiMark(ansiStr, opts)
	})
	t.is(error.message, 'End.line marker out of bounds (min).')
})

test('Start.line marker out of bounds (max)', t => {
	// eslint-disable-next-line unicorn/escape-case
	const ansiStr = '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mBad\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37m  \u001b[39m\n\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m'
	const opts = {
		start: {line: 1337, column: 11},
		end: {line: 4, column: 7},
		color: chalk.bgRed.white.bold,
		resetColor: true
	}
	const error = t.throws(() => {
		ansiMark(ansiStr, opts)
	})
	t.is(error.message, 'Start.line marker out of bounds (max).')
})

test('Start.line marker out of bounds (min)', t => {
	// eslint-disable-next-line unicorn/escape-case
	const ansiStr = '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mBad\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37m  \u001b[39m\n\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m'
	const opts = {
		start: {line: -1337, column: 11},
		end: {line: 4, column: 7},
		color: chalk.bgRed.white.bold,
		resetColor: true
	}
	const error = t.throws(() => {
		ansiMark(ansiStr, opts)
	})
	t.is(error.message, 'Start.line marker out of bounds (min).')
})

test('Start.column marker out of bounds (min)', t => {
	// eslint-disable-next-line unicorn/escape-case
	const ansiStr = '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mBad\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37m  \u001b[39m\n\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m'
	const opts = {
		start: {line: 3, column: -1337},
		end: {line: 4, column: 7},
		color: chalk.bgRed.white.bold,
		resetColor: true
	}
	const error = t.throws(() => {
		ansiMark(ansiStr, opts)
	})
	t.is(error.message, 'Start.column marker out of bounds (min).')
})

test('Start.column marker out of bounds (max)', t => {
	// eslint-disable-next-line unicorn/escape-case
	const ansiStr = '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mBad\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37m  \u001b[39m\n\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m'
	const opts = {
		start: {line: 3, column: 1337},
		end: {line: 4, column: 7},
		color: chalk.bgRed.white.bold,
		resetColor: true
	}
	const error = t.throws(() => {
		ansiMark(ansiStr, opts)
	})
	t.is(error.message, 'Start.column marker out of bounds (max).')
})

test('End.column marker out of bounds (min)', t => {
	// eslint-disable-next-line unicorn/escape-case
	const ansiStr = '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mBad\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37m  \u001b[39m\n\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m'
	const opts = {
		start: {line: 3, column: 1},
		end: {line: 4, column: -1337},
		color: chalk.bgRed.white.bold,
		resetColor: true
	}
	const error = t.throws(() => {
		ansiMark(ansiStr, opts)
	})
	t.is(error.message, 'End.column marker out of bounds (min).')
})

test('End.column marker out of bounds (max)', t => {
	// eslint-disable-next-line unicorn/escape-case
	const ansiStr = '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mBad\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37m  \u001b[39m\n\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m'
	const opts = {
		start: {line: 3, column: 1},
		end: {line: 4, column: 1337},
		color: chalk.bgRed.white.bold,
		resetColor: true
	}
	const error = t.throws(() => {
		ansiMark(ansiStr, opts)
	})
	t.is(error.message, 'End.column marker out of bounds (max).')
})

test('Invalid marker definition', t => {
	// eslint-disable-next-line unicorn/escape-case
	const ansiStr = '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mBad\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37m  \u001b[39m\n\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m'
	const opts = {
		start: false,
		end: false
	}
	const error = t.throws(() => {
		ansiMark(ansiStr, opts)
	})
	t.is(error.message, 'Invalid marker definition.')
})

test('nthIndex break', t => {
	const str = 'ab'
	const pat = ' '
	const result = nthIndex(str, pat, 1)
	t.is(result, -1)
})

test('Keep colors highlighting by line, column', t => {
	// eslint-disable-next-line unicorn/escape-case
	const ansiStr = '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mBad\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37m  \u001b[39m\n\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m'
	const opts = {
		start: {line: 3, column: 11},
		end: {line: 4, column: 7},
		color: chalk.bgBlack,
		resetColor: false
	}
	const marked = ansiMark(ansiStr, opts)
	t.is(typeof marked, 'string')
	// eslint-disable-next-line unicorn/escape-case
	t.is(marked, '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mBad\u001b[33m\u001b[40m<\u001b[36mspan\u001b[33m>\u001b[37m  \u001b[39m\u001b[49m\n\u001b[40m\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[49m\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m')
})

test('Keep colors highlighting by offset', t => {
	// eslint-disable-next-line unicorn/escape-case
	const ansiStr = '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mBad\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37m  \u001b[39m\n\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m'

	const opts = {
		start: 46,
		end: 64,
		color: chalk.bgBlack,
		resetColor: false
	}
	const marked = ansiMark(ansiStr, opts)
	t.is(typeof marked, 'string')
	// eslint-disable-next-line unicorn/escape-case
	t.is(marked, '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37m\u001b[40mBad\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37m  \u001b[39m\u001b[49m\n\u001b[40m\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[49m\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m')
})

