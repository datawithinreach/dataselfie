import uniqueId from 'utils/uniqueId';
import { createSelector } from 'reselect';
// import { CREATE_DRAWING, DELETE_DRAWING } from './drawings';
import {RECEIVE_FORM_CONTENT} from 'ducks/forms';
// action types
export const CREATE_OPTION = 'CREATE_OPTION';
export const UPDATE_OPTION = 'UPDATE_OPTION';
export const DELETE_OPTION = 'DELETE_OPTION';

// actions


export const createOption = (questionId, attrs={}) => {
	let optionId = uniqueId('option_');
	attrs = {
		...attrs,
		text:'',
		questionId,
		id:optionId
	};
	return {type: CREATE_OPTION, optionId, attrs};
};

export const updateOption = (optionId, attrs) => {
	return {type: UPDATE_OPTION, optionId, attrs};
};

export const deleteOption = (optionId) => {
	return {type: DELETE_OPTION, optionId};
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
		case RECEIVE_FORM_CONTENT:
			return action.options.reduce((acc,option)=>{
				return {
					...acc,
					[option.id] : option
				};
			},state);
		case CREATE_OPTION:
		case UPDATE_OPTION:
			return {
				...state,
				[action.optionId]:{
					...(state[action.optionId]||{}),
					...action.attrs
				}
			};
		case DELETE_OPTION:{
			let newState = {
				...state
			};
			delete newState[action.optionId];
			return newState;
		}
			

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
