import { combineReducers } from 'redux';
import ui from './ui';
import forms from './forms';
import items from './items';
import choices from './choices';
import drawings from './drawings';
import { routerReducer as router } from 'react-router-redux';
export default combineReducers({
	ui,
	forms,
	items,
	choices,
	drawings,
	router
});
