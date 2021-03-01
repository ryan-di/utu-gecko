/**
 * Check if the given date string `d` is of the format
 * `yyyy-mm-dd`
 * and that it is a valid date as far as `Date.parse()` is concerned
 * @param {string} d
 */
function checkDate(d) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
	// note: Date.parse("2019-11-31") === Date.parse("2019-12-01")
	if (isNaN(Date.parse(d))) return false;
	return true;
}

/**
 * verify the given `duration` string and parse it as an integer
 *
 * if `duration` is not valid, return `0`
 * @param {string} duration
 */
function getDays(duration) {
	if (!/^\d+$/.test(duration)) {
		return 0;
	}
	return parseInt(duration);
}

/**
 * Given a date in "Nov 19, 2020"
 * return "2020-11-19"
 * @param {String} date
 */
function convertDate(date) {
	const d = new Date(Date.parse(date));
	return formatDate(d);
}

/**
 * Given a date in its number representation, return it in the
 *
 * yyyy-mm-dd
 *
 * format
 * @param {Number} num
 */
function getDateFromNum(num) {
	let d = new Date(num);
	return formatDate(d);
}

/**
 * Given a `Date` object, return its string representation in the
 *
 * `'yyyy-mm-dd'`
 *
 * format
 * @param {Date} date
 */
function formatDate(date) {
	let d = '' + date.getDate();
	let m = '' + (date.getMonth() + 1);
	let y = '' + date.getFullYear();

	if (d.length < 2) d = '0' + d;
	if (m.length < 2) m = '0' + m;

	return [y, m, d].join('-');
}

/**
 * Given a `startDate` in the format of 'yyyy-mm-dd' and a integer `duration`
 * return an array of of `duration` dates from the given date (inclusive)
 * backwards in the same date format
 *
 * e.g. given `"2019-11-30"`, `3`
 *
 * return `["2019-11-30", "2019-11-29", "2019-11-28"]`
 * @param {String} startDate
 * @param {Number} duration
 */
function getAllDates(startDate, duration) {
	const dayInMS = 24 * 60 * 60 * 1000;
	const startDateInNum = Date.parse(startDate);
	const result = [startDate];
	for (let i = 1; i < duration; i++) {
		result.push(startDateInNum - dayInMS * i);
	}
	return result.map((d) => getDateFromNum(d));
}

/**
 * Given a currecy record of the form
 *
 * ```json
 * {
 * 	"Currency": "tezos",
 * 	"Date": "Dec 04, 2019",
 * 	"Open": "1.29",
 * 	"High": "1.32",
 * 	"Low": "1.25",
 * 	"Close": "1.25",
 * 	"Volume": "46,048,752",
 * 	"Market Cap": "824,588,509"
 * }
 *```
 * change its prices, volume and market cap to number;
 * @param {Object} record
 * @returns {Object} processed record object
 */
function processRecord(record) {
	let obj = Object.assign({}, record, { Date: convertDate(record.Date) });
	for (let key in obj) {
		if (key !== 'Currency' && key !== 'Date') {
			obj[key] = Number(obj[key].replace(/,/g, ''));
		}
	}
	return obj;
}

module.exports = {
	convertDate,
	checkDate,
	getDays,
	getAllDates,
	processRecord,
};
