import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import reduxFreeze from 'redux-freeze';
import rootReducer from './ducks';
import App from './containers/App';
import localforage from 'localforage';
import throttle from 'utils/throttle';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';

// TODO: remove in the production mode
let env = 'development';//hack

//disable context menu
// document.addEventListener('contextmenu', event => event.preventDefault());

//disable default drag actions
window.addEventListener('dragover',function(e){
	e = e || event;
	e.preventDefault();
},false);
window.addEventListener('drop',function(e){
	e = e || event;
	e.preventDefault();
},false);

// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const router = routerMiddleware(history);


var middleware;

if (env=='production'){
	middleware = [router];
}else{
	middleware = [reduxFreeze, logger, router];
}



// configure redux store
let loadPageStyle = {
	position: 'absolute',
	width: '100vw', 
	height: '100vh',
	lineHeight: '100vh',
	textAlign:'center',
	fontFamily: 'Roboto, san-serif',
	fontWeight:100,
	fontSize:'42px',
	color:'#757575'
};

let loadData = new Promise((resolve, reject)=>{
	localforage.getItem('state').then(data=>{
		resolve(data);
	}).catch(err=>{
		reject(err);
	});
});


// create redux store
loadData.then(data=>{
	let store = createStore(rootReducer,
		data?data:undefined,
		applyMiddleware(...middleware));
	
	store.subscribe(throttle(()=>{
		let state = {...store.getState()};
		delete state['ui']; //don't save ui state
		delete state['router']; // and router
		localforage.setItem('state', state);
	}, 1000));

	render(
		<Provider store={store}>
			{ /* ConnectedRouter will use the store from Provider automatically */ }
			<ConnectedRouter history={history}>
				<App/>
			</ConnectedRouter>
		</Provider>,
		document.getElementById('container'));
	
}).catch((err)=>{
	console.log(err);
	render(<div style={loadPageStyle}>Failed to initialize data!</div>,
		document.getElementById('container'));
});


render(<div style={loadPageStyle}>Loading data...</div>,
	document.getElementById('container'));
