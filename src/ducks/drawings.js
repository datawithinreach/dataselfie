import uniqueId from 'utils/uniqueId';
import { createSelector } from 'reselect';

import {RECEIVE_FORM_CONTENT} from 'ducks/forms';

// action types
export const CREATE_DRAWING = 'CREATE_DRAWING';

export const DELETE_DRAWING = 'DELETE_DRAWING';

export const UPDATE_DRAWING = 'UPDATE_DRAWING';

// actions
export const createDrawing = (parentId, path, attrs = {}) => {
	let drawingId = uniqueId('drawing_');
	path.name = drawingId;
	path.data.id = drawingId;
	path.data.parentId = parentId; 
	attrs.json = path.exportJSON();
	attrs = {
		...attrs,
		parentId,
		id:drawingId

	};
	return {type: CREATE_DRAWING, drawingId, attrs};
};
export const updateDrawing = (drawingId, path, attrs = {}) => {
	attrs.json = path.exportJSON();
	attrs = {
		...attrs,
		id:drawingId
	};
	return {type: UPDATE_DRAWING, drawingId, attrs};
};

export const deleteDrawing = (drawingId) => {
	return {type: DELETE_DRAWING, drawingId};
};
// selectors
export const makeGetDrawings=()=>{ //accept multiple drawings
	return createSelector(
		(state, props)=>props.parentId,
		(state, props)=>props.parentIds,
		(state)=>state.drawings,
		(parentId, parentIds, drawings)=>{
			drawings = Object.values(drawings);
			console.log('parentIds', parentIds, parentId);
			if (parentIds){
				
				return parentIds.reduce((acc,parentId)=>acc.concat(drawings.filter(d=>d.parentId==parentId)),[]);
			}
			return drawings.filter(d=>d.parentId==parentId);
				
		}
	);
};
export const makeGetSelectedDrawings=()=>{
	return createSelector(
		(state)=>state.ui.selectedOption,
		(state)=>state.ui.selectedForm,
		(state)=>state.drawings,
		(selectedOption, selectedForm, drawings)=>Object.values(drawings).filter(d=>d.parentId==(selectedOption?selectedOption:selectedForm))
	);
};
	// let responses = form.responses.map(rid=>{// Object.values(state.responses).filter(res=>res.formId==form.id).map(response=>{
	// 	let response = state.responses[rid];
		
	// 	let background = state.forms[response.formId].drawings.map(did=>state.drawings[did]);
	// 	let encodings = form.items.map(questionId=>{
	// 		let item = state.items[questionId];
	// 		let choiceId = response.response[questionId];
	// 		let drawings = item.drawings.map(did=>state.drawings[did])
	// 			.concat(state.choices[choiceId].drawings.map(did=>state.drawings[did]));
			
	// 		return {
	// 			questionId,
	// 			choiceId,
	// 			drawings
	// 		};
	// 	});
	// 	return {
	// 		...response,
	// 		background,
	// 		identifier: response.id,
	// 		encodings
	// 	};
		
	// });

export const makeGetResponseDrawings=()=>{
	return createSelector(
		(state, ownProps)=>ownProps.responseId,
		(state)=>state.responses,
		(state)=>state.drawings,
		(responseId, responses, drawings)=>{
			let response = responses[responseId];
			drawings = Object.values(drawings);
			let background = drawings.filter(d=>d.parentId==response.formId);
			let questionIds = Object.keys(response).filter(key=>key.startsWith('question')).map(k=>k);
			let questionDrawings = questionIds.reduce((acc, qid)=>
				acc.concat(drawings.filter(d=>d.parentId==response[qid]))
				,[]);
			
			return [...background, ...questionDrawings];
		}
	);
};

// export const makeGetOptionDrawings = (optionSelector)=>{
// 	return createSelector(
// 		(state, props)=>props.questionId,
// 		optionSelector,
// 		(state)=>state.drawings,
// 		(questionId, options, drawings)=>{
// 			drawings = Object.values(drawings);
// 			return [ // drawings for each option
// 				...options.filter(o=>o.questionId==questionId).map(o=>{
// 					return {
// 						...o,
// 						drawings: drawings.filter(d=>d.parentId==o.id)
// 					};
// 				})
// 			];
// 		}
// 	);
// };
// export const makeGetAllDrawings = () =>{
// 	return createSelector(
// 		(state, props)=>props.formId,
// 		// (state, props)=>props.questions,// already selected
// 		(state)=>state.forms,
// 		(state)=>state.questions,
// 		(state)=>state.options,
// 		(state)=>state.drawings,
// 		(formId, forms, questions, options, drawings)=>{
// 			let form = forms[formId];
// 			drawings = Object.values(drawings);
// 			questions = Object.values(questions);
// 			options = Object.values(options);
// 			console.log('OPTIONS', options);
// 			return {
// 				...form,
// 				drawings: drawings.filter(d=>d.parentId==formId),
// 				questions: [
// 					...questions.filter(q=>q.formId==formId).map(q=>{
// 						return {
// 							...q,
// 							options:[ // drawings for each option
// 								...options.filter(o=>o.questionId==q.id).map(o=>{
// 									return {
// 										...o,
// 										drawings: drawings.filter(d=>d.parentId==o.id)
// 									};
// 								})
// 							]
// 						};
// 					})
// 				]
// 			};
// 		}
// 	);
// };


// reducers
export default (state = {}, action)=>{
	switch (action.type) {
		case RECEIVE_FORM_CONTENT:
			return action.drawings.reduce((acc,drawing)=>{
				return {
					...acc,
					[drawing.id] : drawing
				};
			},state);
		case CREATE_DRAWING:
		case UPDATE_DRAWING:
			return {
				...state,
				[action.drawingId]:{
					...(state[action.drawingId]||{}),
					...action.attrs
				}
			};
		
		case DELETE_DRAWING:{
			let newState = {
				...state
			};
			delete newState[action.drawingId];
			return newState;
		}

		default:
			return state;

	}
};