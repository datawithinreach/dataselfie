import uniqueId from 'utils/uniqueId';
import { createSelector } from 'reselect';
// import {CREATE_OPTION, DELETE_OPTION} from 'ducks/options';
// import { CREATE_DRAWING, DELETE_DRAWING } from './drawings';
// action types
export const CREATE_QUESTION = 'CREATE_QUESTION';
export const DELETE_QUESTION = 'DELETE_QUESTION';
export const UPDATE_QUESTION = 'UPDATE_QUESTION';


// actions

export const createQuestion = (formId, text='') => {
	return {type: CREATE_QUESTION, formId, text, questionId: uniqueId('question_')};
};

export const updateQuestion = (questionId, text) => {
	return {type: UPDATE_QUESTION, questionId, text};
};

export const deleteQuestion = (formId, questionId) =>{
	return {
		type: DELETE_QUESTION,
		formId,
		questionId
	};
};



//selectors
export const makeGetQuestions = () =>{
	return createSelector(
		(state,props)=>props.formId,
		(state) => state.questions,
		(formId, questions)=>Object.values(questions).filter(question=>question.formId==formId)); // return annotations for the panel
};
// reducers
export default  (state = {}, action)=>{
	switch (action.type) {
		case CREATE_QUESTION:{
			let newItem = {
				id: action.questionId,
				formId: action.formId,
				question:'',
				// choices:[],
				// drawings:[]
			};
			return {
				...state,
				[action.questionId]:newItem
			};
		}
		case DELETE_QUESTION:{
			let newState = {
				...state
			};
			delete newState[action.questionId];
			return newState;
		}
			
		case UPDATE_QUESTION:
			return {
				...state,
				[action.questionId]:{
					...state[action.questionId],
					question:action.question
				}
			};
		// case CREATE_OPTION:
		// 	return {
		// 		...state,
		// 		[action.questionId]:{
		// 			...state[action.questionId],
		// 			choices: state[action.questionId].choices.concat(action.choiceId)
		// 		}
		// 	};

		// case DELETE_OPTION:
		// 	return {
		// 		...state,
		// 		[action.questionId]:{
		// 			...state[action.questionId],
		// 			choices: state[action.questionId].choices.filter(aid=>aid!=action.choiceId)
		// 		}
		// 	};
		// case CREATE_DRAWING:
		// 	return action.parentId.startsWith('item')?{
		// 		...state,
		// 		[action.parentId]:{
		// 			...state[action.parentId],
		// 			drawings: state[action.parentId].drawings.concat(action.drawingId)
		// 		}
		// 	}:state;

		// case DELETE_DRAWING:
		// 	return action.parentId.startsWith('item')?{
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
