import uniqueId from 'utils/uniqueId';
import {CREATE_ITEM, DELETE_ITEM } from 'ducks/items';
import {CREATE_RESPONSE, DELETE_RESPONSE } from 'ducks/responses';
// action types
export const CREATE_FORM = 'CREATE_FORM';
export const UPDATE_FORM = 'UPDATE_FORM';
export const DELETE_FORM = 'DELETE_FORM';


// actions

export const createForm = () => {
	return {type: CREATE_FORM, formId: uniqueId()};
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


//selectors


// reducers
export default  (state = {}, action)=>{
	switch (action.type) {
		case CREATE_FORM:{
			let newPage = {
				id: action.formId,
				title:'',
				description: '',
				thumbnail: undefined,
				items:[],
				responses:[]
			};
			return {
				...state,
				[action.formId]:newPage
			};
		}
		case DELETE_FORM:{
			let newState = {
				...state
			};
			delete newState[action.formId];
			return newState;
		}
			
		case UPDATE_FORM:
			return {
				...state,
				[action.formId]:{
					...state[action.formId],
					...action.attrs
				}
			};
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
		default:
			return state;

	}
};
