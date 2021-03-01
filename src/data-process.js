// read historical data in .csv format and converts to json format
const csv = require('csvtojson');
const { convertDate, processRecord } = require('./utilities');
const { writeFile } = require('fs');
const { getDBClient, DBInfo } = require('./db');

const csvFilePath = './src/data/crypto_historical_data.csv';

function convertToJSONByDate() {
	const resultByDate = {};
	csv()
		.fromFile(csvFilePath)
		.subscribe(
			(currencyJson) => {
				const currencyRecord = processRecord(currencyJson);
				const date = convertDate(currencyRecord.Date);
				const dateNum = Date.parse(date);
				currencyRecord.dateNum = dateNum;

				if (date in resultByDate) {
					resultByDate[date].data.push(currencyRecord);
				} else {
					resultByDate[date] = {
						date,
						dateNum,
						data: [currencyRecord],
					};
				}
			},
			// onError callback
			(error) => {
				console.log(error);
			},
			// onComplete callback
			() => {
				// write to atlas
				const records = Object.values(resultByDate);
				saveToCollection(records, DBInfo.collections.byDate);
				// write to file for debug purposes
				saveToFile(records, './src/data/byDate.json');
			}
		);
}

function convertToJSONByCoin() {
	const resultByCoin = [];
	csv()
		.fromFile(csvFilePath)
		.subscribe(
			(currencyJson) => {
				const currencyRecord = processRecord(currencyJson);
				const date = convertDate(currencyRecord.Date);
				const dateNum = Date.parse(date);
				currencyRecord.dateNum = dateNum;
				resultByCoin.push(currencyRecord);
			},
			// onError callback
			(error) => {
				console.log(error);
			},
			// onComplete callback
			() => {
				const records = Object.values(resultByCoin);
				saveToCollection(records, DBInfo.collections.byCoin);
				// write to file for debug purposes
				saveToFile(records, './src/data/byCoin.json');
			}
		);
}

function saveToCollection(records, collectionName) {
	const client = getDBClient();
	client.connect(async (error) => {
		const db = client.db(DBInfo.name);
		const collection = db.collection(collectionName);
		if (collectionName === DBInfo.collections.byDate) {
			collection.createIndex({ dateNum: -1 });
		} else if (collectionName === DBInfo.collections.byCoin) {
			collection.createIndex({ Currency: 1, dateNum: -1 });
		}
		await collection.insertMany(records);
		client.close();
	});
}

function saveToFile(data, filePath) {
	const d = JSON.stringify(data, null, 2);
	writeFile(filePath, d, (error) => {
		if (error) console.log(error);
	});
}

convertToJSONByDate();
convertToJSONByCoin();
