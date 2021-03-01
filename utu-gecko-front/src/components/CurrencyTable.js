import React from 'react';
import './CurrencyTable.css';

const uniqueKeygen = require('unique-keygen');

function CurrencyRow(props) {
	return (
		<tr className="data-row">
			<td>{props.index}</td>
			{props.order.map((o) => {
				return (
					<td key={uniqueKeygen(5)} className={o === 'Currency' ? 'name' : ''}>
						{o === 'Price' || o === 'Market Cap' ? '$' : ''}
						{typeof props.data[o] === 'number'
							? formatNum(Math.round(props.data[o] * 100) / 100)
							: props.data[o]}
						{['24h', '7d', '30d', 'All'].includes(o) ? '%' : ''}
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
					{props.order.map((o) => (
						<th
							className={`
								${o === 'Currency' ? 'name-th' : 'number-th'}
								${o === props.prop ? 'current-th' : ''}
								`}
							key={uniqueKeygen(3)}
							onClick={() => {
								props.sortBy(o);
							}}
						>
							{o}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{props.data.map((d, index) => (
					<CurrencyRow
						data={d}
						key={d.Currency}
						order={props.order}
						index={index + 1}
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
