/*
	manages ui-specific states
*/
import {combineReducers} from 'redux';

import {CREATE_FORM, DELETE_FORM} from './forms';

export const SELECT_FORM = 'SELECT_FORM';
export const OPEN_FORM = 'OPEN_FORM';

export const selectForm = (formId) =>{
	return {
		type: SELECT_FORM,
		formId
	};
};

export const openForm = (formId) =>{
	return {
		type: OPEN_FORM,
		formId
	};
};



const selectedForm = (state=null, action)=>{
	switch (action.type) {
		case SELECT_FORM:
		case OPEN_FORM:
		case CREATE_FORM:
			return action.formId;
		case DELETE_FORM:
			return action.formId==state? null:state;
		default:
			return state;

	}
};


export default combineReducers({
	selectedForm
});
