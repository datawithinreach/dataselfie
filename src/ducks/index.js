import { combineReducers } from 'redux';
import ui from './ui';
import auth from './auth';
import forms from './forms';
import items from './items';
import choices from './choices';
import drawings from './drawings';
import responses from './responses';

import { routerReducer as router } from 'react-router-redux';
export default combineReducers({
	ui,
	auth,
	forms,
	items,
	choices,
	drawings,
	responses,
	router
});
