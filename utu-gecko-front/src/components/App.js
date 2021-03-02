import '../stylesheets/App.css';
import CurrencyTable from './CurrencyTable';
import CoinData from './CoinData';
import React, { useEffect, useState } from 'react';

function App() {
	const [latestStats, setLatestStats] = useState([]);
	const [coinName, setCoinName] = useState('');
	const [msg, setMSG] = useState('Loading...');
	const [date, setDate] = useState('');
	const [prop, setProp] = useState('Market Cap');
	const coinDataContainer = React.createRef();

	useEffect(() => {
		fetch('/api/stats/')
			.then((res) => {
				if (res.ok) return res.json();
				else throw Error('Something went wrong');
			})
			.then((data) => {
				const k = 'Market Cap';
				const stats = data.stats.sort((a, b) => {
					return b[k] - a[k];
				});
				setLatestStats(stats);
				setDate(data.date);
				setMSG('');
			})
			.catch((error) => {
				setMSG('Something went wrong. Please try again later.');
				console.log(error);
			});
	}, []);

	function sortBy(p) {
		if (p !== prop) {
			const stats = latestStats.sort((a, b) => {
				return b[p] - a[p];
			});
			setProp(p);
			setLatestStats([...stats]);
		}
	}

	function displayCoinData(name) {
		setCoinName(name);
		coinDataContainer.current.style.visibility = 'visible';
		coinDataContainer.current.style.opacity = 1;
		console.log(`clicked coin name is ${name}`);
	}

	function backCtrl() {
		setCoinName('');
		coinDataContainer.current.style.visibility = 'hidden';
		coinDataContainer.current.style.opacity = 0;
	}

	return (
		<>
			<div className="coin-data" ref={coinDataContainer}>
				{coinName !== '' ? (
					<CoinData date={date} name={coinName} backCtrl={backCtrl} />
				) : (
					''
				)}
			</div>
			<div className="app">
				<h1>CryptoCurrency Prices</h1>
				{date !== '' ? <h2>{date}</h2> : ''}
				{msg !== '' ? (
					<h3>{msg}</h3>
				) : (
					<div className="currency-table-wrapper">
						<CurrencyTable
							data={latestStats}
							order={[
								'Currency',
								'Price',
								'24h',
								'7d',
								'30d',
								'Volume',
								'Market Cap',
							]}
							date={date}
							prop={prop}
							sortBy={(p) => {
								sortBy(p);
							}}
							displayCoinData={displayCoinData}
						/>
					</div>
				)}
			</div>
		</>
	);
}

export default App;
