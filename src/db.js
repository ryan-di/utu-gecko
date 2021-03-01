// client.connect(async (err) => {
// 	const db = client.db('utu-gecko');

// 	const info = await db.collection('historical-data').findOne({
// 		date: '2019-12-04',
// 	});
// 	// perform actions on the collection object
// 	console.log(info);
// 	client.close();
// });

function getDBClient() {
	const MongoClient = require('mongodb').MongoClient;
	const uri =
		'mongodb+srv://ryandev:ryandev@cluster0.alwnr.mongodb.net/utu-gecko';
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
