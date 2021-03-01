import './App.css';
import CurrencyTable from './components/CurrencyTable';
import { useEffect, useState } from 'react';

function App() {
	const [latestStats, setLatestStats] = useState([]);
	const [date, setDate] = useState('');
	const [prop, setProp] = useState('Market Cap');
	const [update] = useState(true);

	useEffect(() => {
		if (update) {
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
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [update]);

	function sortBy(p) {
		if (p !== prop) {
			const stats = latestStats.sort((a, b) => {
				return b[p] - a[p];
			});
			setProp(p);
			setLatestStats([...stats]);
		}
	}

	return (
		<div className="app">
			<h1>CryptoCurrency Prices</h1>
			<h2>{date !== '' ? `Latest date: ${date}` : 'Loading...'}</h2>
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
					prop={prop}
					sortBy={(p) => {
						sortBy(p);
					}}
				/>
				{console.log('re-rendered')}
			</div>
		</div>
	);
}

export default App;
