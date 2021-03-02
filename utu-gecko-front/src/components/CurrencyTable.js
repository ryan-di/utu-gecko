import React from 'react';
import '../stylesheets/CurrencyTable.css';

const uniqueKeygen = require('unique-keygen');

function CurrencyRow(props) {
	return (
		<tr className="data-row">
			<td>{props.index}</td>
			{props.order.map((key) => {
				return (
					<td
						key={uniqueKeygen(5)}
						className={key === 'Currency' ? 'name' : ''}
					>
						{key === 'Price' || key === 'Market Cap' ? '$' : ''}
						{typeof props.data[key] === 'number' ? (
							formatNum(Math.round(props.data[key] * 100) / 100)
						) : (
							<span onClick={() => props.displayCoinData(props.data[key])}>
								{props.data[key]}
							</span>
						)}
						{['24h', '7d', '30d', 'All'].includes(key) ? '%' : ''}
					</td>
				);
			})}
		</tr>
	);
}

export default function CurrencyTable(props) {
	return (
		<table>
			<thead>
				<tr>
					<th>#</th>
					<th>Currency</th>
					{props.order.map((o) =>
						o !== 'Currency' ? (
							<th
								className={`
								number-th
								${o === props.prop ? 'current-th' : ''}
								`}
								key={uniqueKeygen(3)}
								onClick={() => {
									props.sortBy(o);
								}}
							>
								{o}
							</th>
						) : (
							''
						)
					)}
				</tr>
			</thead>
			<tbody className="tbody-wrapper">
				{props.data.map((d, index) => (
					<CurrencyRow
						data={d}
						date={props.date}
						key={d.Currency}
						order={props.order}
						index={index + 1}
						displayCoinData={props.displayCoinData}
					/>
				))}
			</tbody>
		</table>
	);
}

function formatNum(num) {
	let parts = num.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return parts.join('.');
}
