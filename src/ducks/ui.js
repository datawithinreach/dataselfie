/*
	manages ui-specific states
*/

import {CREATE_FORM, DELETE_FORM, REQUEST_FORMS, RECEIVE_FORMS} from './forms';

export const SELECT_FORM = 'SELECT_FORM';
export const OPEN_FORM = 'OPEN_FORM';
export const ALERT_SERVER_ERROR = 'ALERT_SERVER_ERROR';
export const RELEASE_SERVER_ERROR = 'RELEASE_SERVER_ERROR';


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

export const alertServerError = (message) =>{
	return {
		type: ALERT_SERVER_ERROR,
		message
	};
};
export const releaseServerError = () =>{
	return {
		type: RELEASE_SERVER_ERROR		
	};
};


export default (state=null, action)=>{
	switch (action.type) {
		case SELECT_FORM:
		case OPEN_FORM:
		case CREATE_FORM:
			return {
				...state,
				selectedForm: action.formId
			};
		case DELETE_FORM:
			return {
				...state,
				selectedForm:action.formId==state.selectedForm? null:state.selectedForm
			};
		case REQUEST_FORMS:
			return {
				...state,
				isFetching:true
			};
		case RECEIVE_FORMS:
			return {
				...state,
				isFetching:false
			};
		case ALERT_SERVER_ERROR:
			return {
				...state,
				serverError: action.message? action.message:'There was a communication error with the server. Please try refresh the page'
			};
		case RELEASE_SERVER_ERROR:
			return {
				...state,
				serverError:null
			};
		default:
			return state;

	}
};
