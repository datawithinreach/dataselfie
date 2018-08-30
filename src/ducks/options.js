import uniqueId from 'utils/uniqueId';
import { createSelector } from 'reselect';
// import { CREATE_DRAWING, DELETE_DRAWING } from './drawings';

// action types
export const CREATE_OPTION = 'CREATE_OPTION';
export const UPDATE_OPTION = 'UPDATE_OPTION';
export const DELETE_OPTION = 'DELETE_OPTION';

// actions
export const createOption = (questionId, text) => {
	return {type: CREATE_OPTION, questionId, text,  optionId: uniqueId('option_')};
};

export const updateOption = (optionId, text) => {
	return {type: UPDATE_OPTION, optionId, text};
};

export const deleteOption = (questionId, optionId) => {
	return {type: DELETE_OPTION, questionId, optionId};
};



//selectors

export const makeGetOptions = () =>{
	return createSelector(
		(state,props)=>props.questionId,
		(state) => state.options,
		(questionId, options)=>Object.values(options).filter(option=>option.questionId==questionId)); // return annotations for the panel
};

// reducers
export default  (state = {}, action)=>{
	switch (action.type) {
		case CREATE_OPTION:{
			let newItem = {
				id: action.optionId,
				questionId: action.questionId,
				text:'',
				drawings:[]
			};
			return {
				...state,
				[action.optionId]:newItem
			};
		}
		case DELETE_OPTION:{
			let newState = {
				...state
			};
			delete newState[action.optionId];
			return newState;
		}
			
		case UPDATE_OPTION:
			return {
				...state,
				[action.optionId]:{
					...state[action.optionId],
					text:action.text
				}
			};
		// case CREATE_DRAWING:
		// 	return action.parentId.startsWith('choice')?{
		// 		...state,
		// 		[action.parentId]:{
		// 			...state[action.parentId],
		// 			drawings: state[action.parentId].drawings.concat(action.drawingId)
		// 		}
		// 	}:state;

		// case DELETE_DRAWING:
		// 	return action.parentId.startsWith('choice')?{
		// 		...state,
		// 		[action.parentId]:{
		// 			...state[action.parentId],
		// 			drawings: state[action.parentId].drawings.filter(aid=>aid!=action.drawingId)
		// 		}
		// 	}:state;
		default:
			return state;

	}
};
