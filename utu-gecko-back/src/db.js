const config = require('./config');
const MongoClient = require('mongodb').MongoClient;

function getDBClient() {
	const uri = `mongodb+srv://${config.NAME}:${config.PASSWORD}@cluster0.alwnr.mongodb.net/utu-gecko`;
	return new MongoClient(uri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
}

const DB = {
	name: 'utu-gecko',
	collections: {
		byDate: 'byDate',
		byCoin: 'byCoin',
	},
};

module.exports = {
	getDBClient,
	DBInfo: DB,
};
