import uniqueId from 'utils/uniqueId';
import {CREATE_CHOICE,DELETE_CHOICE} from 'ducks/choices';
// action types
export const CREATE_ITEM = 'CREATE_ITEM';
export const DELETE_ITEM = 'DELETE_ITEM';
export const UPDATE_QUESTION = 'UPDATE_QUESTION';


// actions

export const createItem = (formId) => {
	return {type: CREATE_ITEM, formId, itemId: uniqueId('item_')};
};

export const updateQuestion = (itemId, question) => {
	return {type: UPDATE_QUESTION, itemId, question};
};

export const deleteItem = (formId, itemId) =>{
	return {
		type: DELETE_ITEM,
		formId,
		itemId
	};
};


//selectors


// reducers
export default  (state = {}, action)=>{
	switch (action.type) {
		case CREATE_ITEM:{
			let newItem = {
				id: action.itemId,
				formId: action.formId,
				question:'',
				choices:[]
			};
			return {
				...state,
				[action.itemId]:newItem
			};
		}
		case DELETE_ITEM:{
			let newState = {
				...state
			};
			delete newState[action.itemId];
			return newState;
		}
			
		case UPDATE_QUESTION:
			return {
				...state,
				[action.itemId]:{
					...state[action.itemId],
					question:action.question
				}
			};
		case CREATE_CHOICE:
			return {
				...state,
				[action.itemId]:{
					...state[action.itemId],
					choices: state[action.itemId].choices.concat(action.choiceId)
				}
			};

		case DELETE_CHOICE:
			return {
				...state,
				[action.itemId]:{
					...state[action.itemId],
					choices: state[action.itemId].choices.filter(aid=>aid!=action.choiceId)
				}
			};
		default:
			return state;

	}
};
