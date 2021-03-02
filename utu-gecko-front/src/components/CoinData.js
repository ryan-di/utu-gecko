import React, { useEffect, useState } from 'react';
import '../stylesheets/CoinData.css';
const uniqueKeygen = require('unique-keygen');

export default function CoinData(props) {
	const [data, setData] = useState([]);
	const container = React.createRef();
	const [msg, setMSG] = useState('Loading...');
	const keys = ['Date', 'Open', 'High', 'Close', 'Volume', 'Market Cap'];

	useEffect(() => {
		fetch(`/api/data/coin/${props.name}/${props.date}/31`)
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
	}, [props.name, props.date]);

	return (
		<div className="coin-records-container" ref={container}>
			<div
				style={{
					backgroundColor: 'black',
					color: 'white',
					fontWeight: 'bolder',
					height: '60px',
					lineHeight: '60px',
					margin: '0 auto',
					textAlign: 'left',
					width: '100%',
					position: 'fixed',
					top: 0,
					left: 0,
					zIndex: 4,
				}}
			>
				<span
					className="back-ctrl"
					onClick={() => {
						props.backCtrl();
						console.log(container.current);
						container.current.style.display = 'none';
					}}
				>
					{'<'} BACK
				</span>
			</div>
			<h1 style={{ marginTop: '100px' }}>
				Latest data for <span style={{ color: 'goldenrod' }}>{props.name}</span>
			</h1>
			<h2>From {props.date}</h2>
			{msg === '' ? (
				<div className="table-wrapper">
					<table>
						<thead>
							<tr>
								{keys.map((key) => {
									return <th key={uniqueKeygen(5)}>{key}</th>;
								})}
							</tr>
						</thead>
						<tbody>
							{data.map((record) => {
								return (
									<tr key={uniqueKeygen(5)}>
										{keys.map((key) => {
											return <td key={uniqueKeygen(5)}>{record[key]}</td>;
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
