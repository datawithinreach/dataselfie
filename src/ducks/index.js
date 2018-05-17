import { combineReducers } from 'redux';
import ui from './ui';
import forms from './forms';
import items from './items';
import { routerReducer as router } from 'react-router-redux';
export default combineReducers({
	ui,
	forms,
	items,
	router
});
