import '../stylesheets/App.css';
import CurrencyTable from './CurrencyTable';
import { useEffect, useState } from 'react';

function App() {
	const [latestStats, setLatestStats] = useState([]);
	const [msg, setMSG] = useState('Loading...');
	const [date, setDate] = useState('');
	const [prop, setProp] = useState('Market Cap');

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

	return (
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
					/>
					{console.log('re-rendered')}
				</div>
			)}
		</div>
	);
}

export default App;
