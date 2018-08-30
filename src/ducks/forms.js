import uniqueId from 'utils/uniqueId';
import {CREATE_ITEM, DELETE_ITEM } from 'ducks/items';
import {CREATE_RESPONSE, DELETE_RESPONSE } from 'ducks/responses';
import { CREATE_DRAWING, DELETE_DRAWING } from './drawings';
// action types
export const CREATE_FORM = 'CREATE_FORM';
export const UPDATE_FORM = 'UPDATE_FORM';
export const DELETE_FORM = 'DELETE_FORM';

export const REQUEST_FORMS = 'REQUEST_FORMS';
export const RECEIVE_FORMS = 'RECEIVE_FORMS';


// actions
export const createForm = (attrs=initAttrs) => {
	return {type: CREATE_FORM, formId: uniqueId(), attrs};
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
	return {type:REQUEST_FORMS, forms};
};

//selectors


// reducers
let initAttrs = {
	title:'',
	description: '',
	thumbnail: undefined,
	items:[],
	responses:[],
	drawings:[]
};
export default  (state = {}, action)=>{
	switch (action.type) {

		case RECEIVE_FORMS: // populate the forms from the server
			return action.forms.reduce((acc,form)=>{
				return {
					...acc,
					[form.id] : form
				};
			},state);

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
		case CREATE_ITEM:
			return {
				...state,
				[action.formId]:{
					...state[action.formId],
					items: state[action.formId].items.concat(action.itemId)
				}
			};

		case DELETE_ITEM:
			return {
				...state,
				[action.formId]:{
					...state[action.formId],
					items: state[action.formId].items.filter(iid=>iid!=action.itemId)
				}
			};
		case CREATE_RESPONSE:
			return {
				...state,
				[action.formId]:{
					...state[action.formId],
					responses: state[action.formId].responses.concat(action.responseId)
				}
			};

		case DELETE_RESPONSE:
			return {
				...state,
				[action.formId]:{
					...state[action.formId],
					responses: state[action.formId].responses.filter(iid=>iid!=action.responseId)
				}
			};	
		case CREATE_DRAWING:
			return (action.parentId.startsWith('item')||action.parentId.startsWith('choice'))?state:
				{
					...state,
					[action.parentId]:{
						...state[action.parentId],
						drawings: state[action.parentId].drawings.concat(action.drawingId)
					}
				};

		case DELETE_DRAWING:
			return (action.parentId.startsWith('item')||action.parentId.startsWith('choice'))?state:
				{
					...state,
					[action.parentId]:{
						...state[action.parentId],
						drawings: state[action.parentId].drawings.filter(aid=>aid!=action.drawingId)
					}
				};		
		default:
			return state;

	}
};
