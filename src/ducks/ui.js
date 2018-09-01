/*
	manages ui-specific states
*/

import {CREATE_FORM, DELETE_FORM, 
	REQUEST_FORM_CONTENT, RECEIVE_FORM_CONTENT,
	REQUEST_FORMS, RECEIVE_FORMS} from './forms';

export const SELECT_FORM = 'SELECT_FORM';
export const OPEN_FORM = 'OPEN_FORM';

export const SELECT_OPTION = 'SELECT_OPTION';
export const SELECT_QUESTION = 'SELECT_QUESTION';

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
export const selectOption = (optionId) =>{
	return {
		type: SELECT_OPTION,
		optionId
	};
};
export const selectQuestion = (questionId) =>{
	return {
		type: SELECT_QUESTION,
		questionId
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

let initState = {
	selectedForm:null,
	selectedQuestion:null,
	selectedOption:null
};
export default (state=initState, action)=>{
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
		case SELECT_QUESTION:
			return {
				...state,
				selectedQuestion:action.questionId,
				selectedOption:!action.questionId?null:state.selectedOption
			};
		case SELECT_OPTION:
			return {
				...state,
				selectedOption:action.optionId
			};
		case REQUEST_FORM_CONTENT:
		case REQUEST_FORMS:
			return {
				...state,
				isFetching:true
			};
		case RECEIVE_FORM_CONTENT:
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
