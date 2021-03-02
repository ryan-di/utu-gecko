const express = require('express');
const { StatsProxy, DataProxy } = require('./query');
const { checkDate, getDays } = require('./utilities');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '/build')));

const statsProxy = StatsProxy();
const dataProxy = DataProxy();

const paramsHelper = (req, res) => {
	if (!checkDate(req.params.startDate)) {
		res.status(400).json({
			msg: 'Wrong date. Should be a valid date in the yyyy-mm-dd format',
		});
		return false;
	}
	const days = getDays(req.params.duration);
	if (days <= 0) {
		res.status(400).json({
			msg: 'Invalid duration. Please provide an integer >= 1.',
		});
		return false;
	}
	req.params.duration = days;
	return true;
};

// ------------------------ stats -----------------------------
app.get('/api/stats/', (req, res) => {
	statsProxy
		.getLatestStats(31)
		.then((data) => {
			res.status(200).json(data);
		})
		.catch((e) => {
			console.log(e);
			res.status(500).json({
				msg: 'Something went wrong on our end. Please retry again later.',
			});
		});
});

app.get('/api/stats/:startDate/:duration', (req, res) => {
	// check given parameters
	if (paramsHelper(req, res)) {
		statsProxy
			.getStatsFrom(req.params.startDate, req.params.duration)
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((e) => {
				console.log(e);
				res.status(500).json({
					msg: 'Something went wrong on our end. Please retry again later.',
				});
			});
	}
});

app.get('/api/stats/coin/:name/:startDate/:duration', (req, res) => {
	// check given parameters
	if (paramsHelper(req, res)) {
		statsProxy
			.getCoinStatsFrom(
				req.params.name,
				req.params.startDate,
				req.params.duration
			)
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((e) => {
				console.log(e);
				res.status(500).json({
					msg: 'Something went wrong on our end. Please retry again later.',
				});
			});
	}
});

// ------------------------ data -----------------------------
app.get('/api/data/', (req, res) => {
	// return the latest 30 day data by date to the client
	dataProxy
		.getLatestData(31)
		.then((data) => {
			res.status(200).json(data);
		})
		.catch((e) => {
			console.log(e);
			res.status(500).json({
				msg: 'Something went wrong on our end. Please retry again later.',
			});
		});
});

app.get('/api/data/:startDate/:duration', (req, res) => {
	if (paramsHelper(req, res)) {
		dataProxy
			.getDataFrom(req.params.startDate, req.params.duration)
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((e) => {
				console.log(e);
				res.status(500).json({
					msg: 'Something went wrong on our end. Please retry again later.',
				});
			});
	}
});

app.get('/api/data/coin/:name/:startDate/:duration', (req, res) => {
	if (paramsHelper(req, res)) {
		dataProxy
			.getCoinDataFrom(
				req.params.name,
				req.params.startDate,
				req.params.duration
			)
			.then((data) => {
				res.status(200).json(data);
			})
			.catch((e) => {
				console.log(e);
				res.status(500).json({
					msg: 'Something went wrong on our end. Please retry again later.',
				});
			});
	}
});

app.use(function (req, res, next) {
	res.status(404).json({
		status: 404,
		msg: '404 Not Found',
	});
});

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '/build/index.html'));
});

app.listen(8000, () => {
	console.log('Listening on port 8000');
});
