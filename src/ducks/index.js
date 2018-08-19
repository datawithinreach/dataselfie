import { combineReducers } from 'redux';
import ui from './ui';
import user from './user';
import forms from './forms';
import items from './items';
import choices from './choices';
import drawings from './drawings';
import responses from './responses';

import { routerReducer as router } from 'react-router-redux';
export default combineReducers({
	ui,
	user,
	forms,
	items,
	choices,
	drawings,
	responses,
	router
});
