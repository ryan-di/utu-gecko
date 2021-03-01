const { getDBClient, DBInfo } = require('./db');
const { getAllDates } = require('./utilities');

const DAYINMS = 24 * 60 * 60 * 1000;

function StatsProxy() {
	// update the latest date once every day so that
	// we can be sure that the latest cache is valid
	const latestCacheKey = 'latestCacheKey';
	setInterval(() => {
		delete cache[latestCacheKey];
	}, DAYINMS);

	const cache = {};

	return {
		/**
		 * Given a start date and a duration, return the available
		 * stats for each currency in an array. For a date and a duration
		 * that execeeds the records in the database, an empty array may be
		 * returned.
		 * @param {String} startDate
		 * @param {Number} duration
		 */
		getStatsFrom(startDate, duration) {
			const cacheKey = startDate + ' & ' + duration;
			// already exists in cache
			return new Promise((resolve, reject) => {
				if (cacheKey in cache) {
					resolve(cache[cacheKey]);
				} else {
					fetchDataFrom(startDate, duration)
						.then((data) => {
							const result = {
								date: startDate,
								requested: duration,
								length: data.length,
								stats: getCoinsStats(data),
							};
							cache[cacheKey] = result;
							const cacheKey2 = startDate + '&' + data.length;
							cache[cacheKey2] = cache[cacheKey];
							resolve(result);
						})
						.catch((error) => {
							reject(error);
						});
				}
			});
		},

		getLatestStats(days) {
			return new Promise((resolve, reject) => {
				if (latestCacheKey in cache) {
					resolve(cache[latestCacheKey]);
				} else {
					getLatestRecordsByDate(days)
						.then((records) => {
							// stats => result => cache => resolve
							const stats = getCoinsStats(records);
							const result = {
								date: stats[0].Date,
								stats: stats,
							};
							cache[latestCacheKey] = result;
							resolve(result);
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				}
			});
		},

		getCoinStatsFrom(coin, startDate, duration) {
			return new Promise((resolve, reject) => {
				const cacheKey = coin + '&' + startDate + '&' + duration;
				if (cacheKey in cache) {
					resolve(cache[cacheKey]);
				} else {
					getCoinRecordsFrom(coin, startDate, duration)
						.then((records) => {
							const result = {
								date: startDate,
								coin: coin,
								requested: duration,
								length: records.length,
							};
							if (records.length > 0) {
								result.stats = getCoinStats(records);
							} else {
								result.stats = {};
							}
							cache[cacheKey] = result;
							cacheKey2 = coin + '&' + startDate + '&' + result.length;
							cache[cacheKey2] = cache[cacheKey];
							resolve(result);
						})
						.catch((error) => {
							reject(error);
						});
				}
			});
		},
	};
}

function DataProxy() {
	let cache = {};
	const latestCacheKey = 'latestCacheKey';
	setInterval(() => {
		delete cache[latestCacheKey];
	}, DAYINMS);

	return {
		getLatestData(duration) {
			return new Promise((resolve, reject) => {
				if (latestCacheKey in cache) {
					resolve(cache[latestCacheKey]);
				} else {
					getLatestRecordsByDate(duration)
						.then((records) => {
							const result = {
								date: records[0].date,
								length: records.length,
								data: records,
							};
							cache[latestCacheKey] = result;
							resolve(result);
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				}
			});
		},

		getDataFrom(startDate, duration) {
			return new Promise((resolve, reject) => {
				const cacheKey = startDate + '&' + duration;
				if (cacheKey in cache) {
					resolve(cache[cacheKey]);
				} else {
					fetchDataFrom(startDate, duration)
						.then((records) => {
							cache[cacheKey] = {
								date: startDate,
								requested: duration,
								length: records.length,
								data: records,
							};
							const cacheKey2 = startDate + '&' + records.length;
							cache[cacheKey2] = cache[cacheKey];
							resolve(cache[cacheKey]);
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				}
			});
		},

		getCoinDataFrom(coin, startDate, duration) {
			return new Promise((resolve, reject) => {
				const cacheKey = coin + '&' + startDate + '&' + duration;
				if (cacheKey in cache) {
					resolve(cache[cacheKey]);
				} else {
					getCoinRecordsFrom(coin, startDate, duration)
						.then((records) => {
							cache[cacheKey] = {
								date: startDate,
								coin: coin,
								requested: duration,
								length: records.length,
								data: records,
							};
							const cacheKey2 = coin + '&' + startDate + '&' + records.length;
							cache[cacheKey2] = cache[cacheKey];
							resolve(cache[cacheKey]);
						})
						.catch((e) => {
							console.log(e);
							reject(e);
						});
				}
			});
		},
	};
}

/**
 * fetch currency records from the given date (inclusive) backwards
 * for #duration days
 * @param {String} date
 * @param {Number} duration
 */
function fetchDataFrom(date, duration) {
	return new Promise((resolve, reject) => {
		const client = getDBClient();
		try {
			client.connect(async (error) => {
				if (!error) {
					const db = client.db(DBInfo.name);
					const data = await db.collection(DBInfo.collections.byDate).find({
						date: {
							$in: getAllDates(date, duration),
						},
					});
					resolve(data.toArray());
				} else {
					throw error;
				}
			});
		} catch (e) {
			reject(error);
		} finally {
			client.close();
		}
	});
}

/**
 * Get the latest available #days of records
 * @param {Number} duration
 * @returns {Promise} records
 */
function getLatestRecordsByDate(duration) {
	return new Promise((resolve, reject) => {
		const client = getDBClient();
		try {
			client.connect(async (error) => {
				const db = client.db(DBInfo.name);
				const collection = db.collection(DBInfo.collections.byDate);
				let records = await collection
					.find(
						{},
						{
							sort: { dateNum: -1 },
							limit: duration,
						}
					)
					.toArray();
				resolve(records);
			});
		} catch (e) {
			reject(e);
		} finally {
			client.close();
		}
	});
}

function getCoinRecordsFrom(name, startDate, duration) {
	return new Promise((resolve, reject) => {
		const client = getDBClient();
		try {
			client.connect(async (error) => {
				const db = client.db(DBInfo.name);
				const collection = db.collection(DBInfo.collections.byCoin);
				const results = await collection
					.find({
						$query: {
							Currency: name,
							Date: {
								$in: getAllDates(startDate, duration),
							},
						},
						$orderby: {
							dateNum: -1,
						},
					})
					.toArray();
				resolve(results);
			});
		} catch (e) {
			reject(e);
		} finally {
			client.close();
		}
	});
}

/**
 * Given an array of records, where each record if of the format
 *
 * 	{
 * 		date: "2019-12-04",
 * 		dateNum: 1575417600000,
 * 		data: [
 * 			{
 * 				Currency: "tezos"
 * 				// ...
 * 			}
 * 		]
 * 	}
 *
 * compute the following stats (if available):
 *
 * price (close), 24h change, 7d change, 30d change, 24h volume and market cap
 *
 * for each currency in each record using the `getCoinStats()` method.
 * @param {Object[]} records
 * @returns {Array} an array of currency stats objects
 */
function getCoinsStats(records) {
	let currencies = new Map();
	for (let record of records) {
		for (let curRecord of record.data) {
			if (currencies.has(curRecord.Currency)) {
				currencies.get(curRecord.Currency).push(curRecord);
			} else {
				currencies.set(curRecord.Currency, [curRecord]);
			}
		}
	}
	const result = [];
	for (let coinRecords of currencies.values()) {
		result.push(getCoinStats(coinRecords));
	}

	return result;
}

/**
 * Given an array of records for a particular currency,
 * compute the following stats (if available):
 *
 * price (close), 24h change, 7d change, 30d change, 24h volume and market cap
 *
 * @param {Object[]} coinRecords
 * @returns {Object} a stats object for the given currency records
 */
function getCoinStats(records) {
	const rec = records[0];
	const obj = {
		Currency: rec.Currency,
		Date: rec.Date,
		Price: rec.Close,
		Volume: rec.Volume,
		'Market Cap': rec['Market Cap'],
	};

	const length = records.length;
	const h = (n) =>
		Math.round(
			((rec.Close - records[n - 1].Close) / records[n - 1].Close) * 1000
		) / 10;
	if (length > 1) obj['24h'] = h(2);
	if (length > 7) obj['7d'] = h(8);
	if (length > 30) obj['30d'] = h(31);
	obj['All'] = h(length);
	return obj;
}

module.exports = {
	StatsProxy,
	DataProxy,
};
