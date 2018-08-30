import { combineReducers } from 'redux';
import ui from './ui';
import auth from './auth';
import forms from './forms';
import questions from './questions';
import options from './options';
import drawings from './drawings';
import responses from './responses';

import { routerReducer as router } from 'react-router-redux';
export default combineReducers({
	ui,
	auth,
	forms,
	questions,
	options,
	drawings,
	responses,
	router
});
