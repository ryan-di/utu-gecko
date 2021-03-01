import './App.css';
import CurrencyTable from './components/CurrencyTable';
import { useEffect, useState } from 'react';

function App() {
	const [latestStats, setLatestStats] = useState([]);
	const [update] = useState(true);

	useEffect(() => {
		if (update) {
			fetch('/api/stats/')
				.then((res) => {
					if (res.ok) return res.json();
					else throw Error('Something went wrong');
				})
				.then((data) => {
					setLatestStats(data.data);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [update]);

	return (
		<div className="app">
			<h1>Cryptocurrency Prices by Market Cap</h1>
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
				/>
			</div>
		</div>
	);
}

export default App;
