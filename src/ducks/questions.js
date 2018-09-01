import uniqueId from 'utils/uniqueId';
import { createSelector } from 'reselect';
// import {CREATE_OPTION, DELETE_OPTION} from 'ducks/options';
// import { CREATE_DRAWING, DELETE_DRAWING } from './drawings';
import {RECEIVE_FORM_CONTENT} from 'ducks/forms';
// action types
export const CREATE_QUESTION = 'CREATE_QUESTION';
export const DELETE_QUESTION = 'DELETE_QUESTION';
export const UPDATE_QUESTION = 'UPDATE_QUESTION';


// actions

export const createQuestion = (formId, attrs={}) => {
	let questionId = uniqueId('question_');
	attrs = {
		...attrs,
		text:'',
		formId,
		id:questionId
	};
	return {type: CREATE_QUESTION, questionId, attrs};
};

export const updateQuestion = (questionId, attrs) => {
	return {type: UPDATE_QUESTION, questionId, attrs};
};

export const deleteQuestion = (questionId) =>{
	return {
		type: DELETE_QUESTION,
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
		case RECEIVE_FORM_CONTENT:
			return action.questions.reduce((acc,question)=>{
				return {
					...acc,
					[question.id] : question
				};
			},state);

		case CREATE_QUESTION:
		case UPDATE_QUESTION:
			return {
				...state,
				[action.questionId]:{
					...(state[action.questionId]||{}),
					...action.attrs
				}
			};
		case DELETE_QUESTION:{
			let newState = {
				...state
			};
			delete newState[action.questionId];
			return newState;
		}
			

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
