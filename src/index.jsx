import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import immutableStateChecker from 'redux-immutable-state-invariant';
import rootReducer from './ducks';
import App from './containers/App';

// TODO: remove in the production mode
let env = 'development';//hack
let middleware =  env!='production'?[immutableStateChecker(), logger]:[];

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

// configure redux store
let store = createStore(rootReducer,
	applyMiddleware(...middleware));



// create redux store

render(
	<Provider store={store}>
		<App/>
	</Provider>,
	document.getElementById('container'));
