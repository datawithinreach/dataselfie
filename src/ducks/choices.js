import uniqueId from 'utils/uniqueId';
import { CREATE_DRAWING, DELETE_DRAWING } from './drawings';

// action types
export const CREATE_CHOICE = 'CREATE_CHOICE';
export const UPDATE_CHOICE_TEXT = 'UPDATE_CHOICE_TEXT';
export const DELETE_CHOICE = 'DELETE_CHOICE';

// actions
export const createChoice = (itemId, text) => {
	return {type: CREATE_CHOICE, itemId, text,  choiceId: uniqueId('choice_id')};
};

export const updateChoiceText = (choiceId, text) => {
	return {type: UPDATE_CHOICE_TEXT, choiceId, text};
};

export const deleteChoice = (itemId, choiceId) => {
	return {type: DELETE_CHOICE, itemId, choiceId};
};



//selectors


// reducers
export default  (state = {}, action)=>{
	switch (action.type) {
		case CREATE_CHOICE:{
			let newItem = {
				id: action.choiceId,
				itemId: action.itemId,
				text:'',
				drawings:[]
			};
			return {
				...state,
				[action.choiceId]:newItem
			};
		}
		case DELETE_CHOICE:{
			let newState = {
				...state
			};
			delete newState[action.choiceId];
			return newState;
		}
			
		case UPDATE_CHOICE_TEXT:
			return {
				...state,
				[action.choiceId]:{
					...state[action.choiceId],
					text:action.text
				}
			};
		case CREATE_DRAWING:
			return action.parentId.startsWith('choice')?{
				...state,
				[action.parentId]:{
					...state[action.parentId],
					drawings: state[action.parentId].drawings.concat(action.drawingId)
				}
			}:state;

		case DELETE_DRAWING:
			return action.parentId.startsWith('choice')?{
				...state,
				[action.parentId]:{
					...state[action.parentId],
					drawings: state[action.parentId].drawings.filter(aid=>aid!=action.drawingId)
				}
			}:state;
		default:
			return state;

	}
};
