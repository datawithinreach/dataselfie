import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import reduxFreeze from 'redux-freeze';
import rootReducer from './ducks';
import rootSaga from './sagas';
import App from './containers/App';
// import localforage from 'localforage';
// import throttle from 'utils/throttle';
import createHashHistory from 'history/createHashHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';

// TODO: remove in the production mode
let env = 'development';//hack

//disable context menu
// document.addEventListener('contextmenu', event => event.preventDefault());
// document.body.addEventListener('touchmove', event => event.preventDefault(), { passive: false });
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
const history = createHashHistory();

// Build the middleware for intercepting and dispatching navigation actions
const router = routerMiddleware(history);
const sagas = createSagaMiddleware();


var middleware;

if (env=='production'){
	middleware = [router, sagas];
}else{
	middleware = [reduxFreeze, logger, router, sagas];
}

// configure redux store
// let loadPageStyle = {
// 	position: 'absolute',
// 	width: '100vw', 
// 	height: '100vh',
// 	lineHeight: '100vh',
// 	textAlign:'center',
// 	fontFamily: 'Roboto, san-serif',
// 	fontWeight:100,
// 	fontSize:'42px',
// 	color:'#757575'
// };

// let loadData = new Promise((resolve, reject)=>{
// 	localforage.getItem('state').then(data=>{
// 		resolve(data);
// 	}).catch(err=>{
// 		reject(err);
// 	});
// });
let username = localStorage.getItem('username');
if (!username){
	username = sessionStorage.getItem('username');
}
let initData = undefined;
if (username){
	initData = {auth:{
		username
	}};
}
let store = createStore(rootReducer,
	initData,
	applyMiddleware(...middleware));
sagas.run(rootSaga);//run sagas after mounting
render(
	<Provider store={store}>
		{ /* ConnectedRouter will use the store from Provider automatically */ }
		<ConnectedRouter history={history}>
			<App/>
		</ConnectedRouter>
	</Provider>,
	document.getElementById('container'));
// create redux store
// loadData.then(data=>{
// 	let store = createStore(rootReducer,
// 		data?data:undefined,
// 		applyMiddleware(...middleware));
// 	sagas.run(rootSaga);//run sagas after mounting
// 	// store.subscribe(throttle(()=>{
// 	// 	let state = {...store.getState()};
// 	// 	let keys = ['user'];
// 	// 	state = Object.keys(state).reduce(function(acc, key){
// 	// 		if (keys.includes(key)==false){
// 	// 			delete acc[key];
// 	// 		}
// 	// 		return acc;
// 	// 	},{});
// 	// 	// delete state['ui']; //don't save ui state
// 	// 	// delete state['router']; // and router
// 	// 	localforage.setItem('state', state);
// 	// }, 1000));

	
	
// }).catch((err)=>{
// 	console.log(err);
// 	render(<div style={loadPageStyle}>Failed to initialize data!</div>,
// 		document.getElementById('container'));
// });


// render(<div style={loadPageStyle}>Loading data...</div>,
// 	document.getElementById('container'));
