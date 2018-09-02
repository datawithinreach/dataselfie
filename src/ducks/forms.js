import uniqueId from 'utils/uniqueId';
import { createSelector } from 'reselect';
// import {CREATE_QUESTION, DELETE_QUESTION } from 'ducks/questions';
// import {CREATE_RESPONSE, DELETE_RESPONSE } from 'ducks/responses';
// import { CREATE_DRAWING, DELETE_DRAWING } from './drawings';
// action types
export const CREATE_FORM = 'CREATE_FORM';
export const UPDATE_FORM = 'UPDATE_FORM';
export const DELETE_FORM = 'DELETE_FORM';

export const REQUEST_FORMS = 'REQUEST_FORMS';
export const RECEIVE_FORMS = 'RECEIVE_FORMS';

export const REQUEST_FORM_CONTENT = 'REQUEST_FORM_CONTENT';
export const RECEIVE_FORM_CONTENT = 'RECEIVE_FORM_CONTENT';
// actions
export const createForm = (username, attrs={}) => {
	let formId = uniqueId();
	attrs = {
		title:'Untitled',
		description: '',
		...attrs,
		username,
		id:formId
	};
	return {type: CREATE_FORM, formId, username, attrs};
};

export const updateForm = (formId, attrs) => {
	return {type: UPDATE_FORM, formId, attrs};
};

export const deleteForm = (formId) =>{
	return {
		type: DELETE_FORM,
		formId
	};
};
export const requestForms = (username)=>{
	return {type:REQUEST_FORMS, username};
};
export const receiveForms = (forms)=>{
	return {type:RECEIVE_FORMS, forms};
};
export const requestFormContent = (username, formId)=>{
	return {type:REQUEST_FORM_CONTENT, username, formId};
};
export const receiveFormContent = (data)=>{
	return {type:RECEIVE_FORM_CONTENT, ...data};
};

//selectors
export const makeGetFormsByUser = () =>{
	return createSelector(
		(state) => state.auth.username,
		(state) => state.forms,
		(username, forms)=>username? Object.values(forms).filter(form=>form.username==username) : []); // return annotations for the panel
};
export const makeGetQuestionnaire = () =>{// except drawings
	return createSelector(
		(state)=>state.ui.selectedForm,
		(state)=>state.questions,
		(state)=>state.options,
		(formId, questions, options)=>{
			questions = Object.values(questions);
			options = Object.values(options);
			return [
				...questions.filter(q=>q.formId==formId).map(q=>{
					return {
						...q,
						options: options.filter(o=>o.questionId==q.id)
					};
				})
			];
		}
	);
};
// reducers

export default  (state = {}, action)=>{
	switch (action.type) {

		case RECEIVE_FORMS: // populate the forms from the server
			return action.forms.reduce((acc,form)=>{
				return {
					...acc,
					[form.id] : form
				};
			},state);
		
		case RECEIVE_FORM_CONTENT:// necessary when directly accessing from url
			return {
				...state,
				[action.form.id]: {
					...state[action.form.id],
					...action.form
				}
			};
		case CREATE_FORM:
		case UPDATE_FORM:
			return {
				...state,
				[action.formId]:{
					...(state[action.formId]||{}),
					...action.attrs
				}
			};
		case DELETE_FORM:{
			let newState = {
				...state
			};
			delete newState[action.formId];
			return newState;
		}
		// case CREATE_QUESTION:
		// 	return {
		// 		...state,`
		// 		[action.formId]:{
		// 			...state[action.formId],
		// 			items: state[action.formId].items.concat(action.questionId)
		// 		}
		// 	};

		// case DELETE_QUESTION:
		// 	return {
		// 		...state,
		// 		[action.formId]:{
		// 			...state[action.formId],
		// 			items: state[action.formId].items.filter(iid=>iid!=action.questionId)
		// 		}
		// 	};
		// case CREATE_RESPONSE:
		// 	return {
		// 		...state,
		// 		[action.formId]:{
		// 			...state[action.formId],
		// 			responses: state[action.formId].responses.concat(action.responseId)
		// 		}
		// 	};

		// case DELETE_RESPONSE:
		// 	return {
		// 		...state,
		// 		[action.formId]:{
		// 			...state[action.formId],
		// 			responses: state[action.formId].responses.filter(iid=>iid!=action.responseId)
		// 		}
		// 	};	
		// case CREATE_DRAWING:
		// 	return (action.parentId.startsWith('item')||action.parentId.startsWith('choice'))?state:
		// 		{
		// 			...state,
		// 			[action.parentId]:{
		// 				...state[action.parentId],
		// 				drawings: state[action.parentId].drawings.concat(action.drawingId)
		// 			}
		// 		};

		// case DELETE_DRAWING:
		// 	return (action.parentId.startsWith('item')||action.parentId.startsWith('choice'))?state:
		// 		{
		// 			...state,
		// 			[action.parentId]:{
		// 				...state[action.parentId],
		// 				drawings: state[action.parentId].drawings.filter(aid=>aid!=action.drawingId)
		// 			}
		// 		};		
		default:
			return state;

	}
};
