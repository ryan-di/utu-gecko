import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	useLocation,
} from 'react-router-dom';
import './stylesheets/index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import CoinPage from './components/CoinPage';

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<Switch>
				<Route path="/" component={App} exact />
				<Route path="/coin/:name/:date" component={CoinPage} exact />
				<Route path="*" component={NoMatch} />
			</Switch>
		</Router>
	</React.StrictMode>,
	document.getElementById('root')
);

function NoMatch() {
	let location = useLocation();

	return (
		<div>
			<h3>
				No match for <code>{location.pathname}</code>
			</h3>
		</div>
	);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
