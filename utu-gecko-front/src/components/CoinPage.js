import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import './CoinPage.css';
const uniqueKeygen = require('unique-keygen');

export default function CoinPage() {
	const { name, date } = useParams();
	const [data, setData] = useState([]);
	const [msg, setMSG] = useState('Loading...');
	const props = ['Date', 'Open', 'High', 'Close', 'Volume', 'Market Cap'];

	useEffect(() => {
		fetch(`/api/data/coin/${name}/${date}/31`)
			.then((res) => {
				if (res.ok) return res.json();
				else throw Error('fetching coin data went wrong');
			})
			.then((result) => {
				setData(result.data);
				setMSG('');
			})
			.catch((e) => {
				setMSG('Something went wrong. Please try again later.');
				console.log(e);
			});
	}, [name, date]);

	return (
		<div>
			<h1>
				Latest stats for <span style={{ color: 'goldenrod' }}>{name}</span>
			</h1>
			{msg === '' ? (
				<div className="table-wrapper">
					<table>
						<thead>
							<tr>
								{props.map((prop) => {
									return <th key={uniqueKeygen(5)}>{prop}</th>;
								})}
							</tr>
						</thead>
						<tbody>
							{data.map((record) => {
								return (
									<tr key={uniqueKeygen(5)}>
										{props.map((prop) => {
											return <td key={uniqueKeygen(5)}>{record[prop]}</td>;
										})}
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			) : (
				<h3>{msg}</h3>
			)}
		</div>
	);
}
