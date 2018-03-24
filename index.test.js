import test from 'ava'
import chalk from 'chalk'
import ansiMark from '.'

// Encode: get escaped, testable string of correct result
// eslint-disable-next-line no-unused-vars
const encode = result => {
	const json = JSON.stringify(result)
	// eslint-disable-next-line no-console
	console.log(json.replace(/'/g, '\\\''))
}

/*
<body>
	<span>Good</span>
	<span>Bad<span>
<body>
*/
// const ansiStr = '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mBad\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37m  \u001b[39m\n\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m'

test('Highlight start and end w/ object definition (line, column)', t => {
	// eslint-disable-next-line unicorn/escape-case
	const ansiStr = '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mBad\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37m  \u001b[39m\n\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m'
	const opts = {
		start: {line: 3, column: 11},
		end: {line: 4, column: 6},
		color: chalk.bgRed.white.bold,
		resetColor: true
	}
	const marked = ansiMark(ansiStr, opts)
	t.is(typeof marked, 'string')

	// eslint-disable-next-line unicorn/escape-case
	t.is(marked, '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mBad\u001b[33m\u001b[41m\u001b[37m\u001b[1m<span>  \u001b[22m\u001b[39m\u001b[49m\n\u001b[41m\u001b[37m\u001b[1m<body>\u001b[22m\u001b[39m\u001b[49m\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m')
})

test('Highlight start - end w/ number offsets (linear, single-line)', t => {
	// eslint-disable-next-line unicorn/escape-case
	const ansiStr = '\u001b[37m\u001b[33m<\u001b[36mdiv\u001b[33m>\u001b[37mHighlight me!\u001b[33m</\u001b[36mdiv\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\u001b[39m'

	const opts = {
		start: 6,
		end: 18,
		color: chalk.bgRed.white.bold,
		resetColor: true
	}
	const marked = ansiMark(ansiStr, opts)
	t.is(typeof marked, 'string')
	// eslint-disable-next-line unicorn/escape-case
	t.is(marked, '\u001b[37m\u001b[33m<\u001b[36mdiv\u001b[33m>\u001b[37m\u001b[41m\u001b[37m\u001b[1mHighlight me!\u001b[22m\u001b[39m\u001b[49m\u001b[33m</\u001b[36mdiv\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\u001b[39m')
})

test('Highlight start - end w/ number offsets (linear, multi-line)', t => {
	// eslint-disable-next-line unicorn/escape-case
	const ansiStr = '\u001b[37m\u001b[33m<\u001b[36mdiv\u001b[33m>\u001b[37m\u001b[33m</\u001b[36mdiv\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\u001b[33m<\u001b[36mdiv\u001b[33m>\u001b[37m\u001b[33m</\u001b[36mdiv\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\u001b[39m'
	// 12345678901234567
	//      |          |
	// <div></div>␊<div></div>
	const opts = {
		start: 6,
		end: 17,
		color: chalk.bgRed.white.bold,
		resetColor: true
	}
	const marked = ansiMark(ansiStr, opts)
	t.is(typeof marked, 'string')
	// eslint-disable-next-line unicorn/escape-case
	t.is(marked, '\u001b[37m\u001b[33m<\u001b[36mdiv\u001b[33m>\u001b[37m\u001b[33m\u001b[41m\u001b[37m\u001b[1m</div>\u001b[22m\u001b[39m\u001b[49m\n\u001b[41m\u001b[37m\u001b[1m<div>\u001b[22m\u001b[39m\u001b[49m\u001b[37m\u001b[33m</\u001b[36mdiv\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\u001b[39m')
})

test('Out of bounds markers are realigned', t => {
	// eslint-disable-next-line unicorn/escape-case
	const ansiStr = '\u001b[37m\u001b[33m<\u001b[36mdiv\u001b[33m>\u001b[37m\u001b[33m</\u001b[36mdiv\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\u001b[33m<\u001b[36mdiv\u001b[33m>\u001b[37m\u001b[33m</\u001b[36mdiv\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\u001b[39m'
	const opts = {
		start: {line: -1337, column: -1337},
		end: {line: 1337, column: 1337},
		color: chalk.bgRed.white.bold,
		resetColor: true
	}
	const result = ansiMark(ansiStr, opts)
	// eslint-disable-next-line unicorn/escape-case
	t.is(result, '\u001b[37m\u001b[33m\u001b[41m\u001b[37m\u001b[1m<div></div>\u001b[22m\u001b[39m\u001b[49m\n\u001b[41m\u001b[37m\u001b[1m<div></div>\u001b[22m\u001b[39m\u001b[49m\n\u001b[41m\u001b[37m\u001b[1m\u001b[22m\u001b[39m\u001b[49m\u001b[37m\u001b[39m')
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

test('Keep colors highlighting by line, column', t => {
	// eslint-disable-next-line unicorn/escape-case
	const ansiStr = '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mBad\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37m  \u001b[39m\n\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m'
	const opts = {
		start: {line: 3, column: 11},
		end: {line: 4, column: 6},
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
		end: 63,
		color: chalk.bgBlack,
		resetColor: false
	}
	const marked = ansiMark(ansiStr, opts)
	t.is(typeof marked, 'string')
	// eslint-disable-next-line unicorn/escape-case
	t.is(marked, '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37m\u001b[40mBad\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37m  \u001b[39m\u001b[49m\n\u001b[40m\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[49m\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m')
})

test('Throws if start-end lines are flipped', t => {
	// eslint-disable-next-line unicorn/escape-case
	const ansiStr = '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mBad\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37m  \u001b[39m\n\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m'

	const opts = {
		start: {line: 2, column: 1},
		end: {line: 1, column: 2},
		color: chalk.bgBlack,
		resetColor: false
	}
	const error = t.throws(() => {
		ansiMark(ansiStr, opts)
	})
	t.is(error.message, 'Your start line is after your end line.')
})

test('Throws if start-end columns are flipped', t => {
	// eslint-disable-next-line unicorn/escape-case
	const ansiStr = '\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mGood\u001b[33m</\u001b[36mspan\u001b[33m>\u001b[37m\u001b[39m\n\u001b[37m\t\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37mBad\u001b[33m<\u001b[36mspan\u001b[33m>\u001b[37m  \u001b[39m\n\u001b[37m\u001b[33m<\u001b[36mbody\u001b[33m>\u001b[37m            \u001b[39m\n\u001b[37m\u001b[39m'

	const opts = {
		start: {line: 1, column: 2},
		end: {line: 1, column: 1},
		color: chalk.bgBlack,
		resetColor: false
	}
	const error = t.throws(() => {
		ansiMark(ansiStr, opts)
	})
	t.is(error.message, 'Your end column is after your start column.')
})
