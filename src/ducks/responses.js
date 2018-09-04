import uniqueId from 'utils/uniqueId';
import { createSelector } from 'reselect';

// action types
export const CREATE_RESPONSE = 'CREATE_RESPONSE';

export const UPDATE_RESPONSE = 'UPDATE_RESPONSE';

export const DELETE_RESPONSE = 'DELETE_RESPONSE';

export const RECEIVE_FORM_CONTENT = 'RECEIVE_FORM_CONTENT';
// actions
export const createResponse = (formId, attrs = {}) => {
	let responseId = uniqueId('response_');
	attrs = {
		...attrs,
		formId,
		id:responseId
	};
	return {type: CREATE_RESPONSE, responseId, attrs};
};


export const updateResponse = (responseId, attrs) => {
	return {type: UPDATE_RESPONSE, responseId, attrs};
};


export const deleteResponse = (responseId) => {
	return {type: DELETE_RESPONSE, responseId};
};

// selector 

export const makeGetResponses=()=>{
	return createSelector(
		(state, props)=>props.formId,
		(state)=>state.responses,
		(formId, responses)=>Object.values(responses).filter(d=>d.formId==formId)
	);
};


export default (state = {}, action)=>{
	switch (action.type) {
		case CREATE_RESPONSE:
		case UPDATE_RESPONSE:
			return {
				...state,
				[action.responseId]:{
					...(state[action.responseId]||{}),
					...action.attrs
				}
			};
		case RECEIVE_FORM_CONTENT:
			return action.responses.reduce((acc,response)=>{
				return {
					...acc,
					[response.id] : response
				};
			},state);
		case DELETE_RESPONSE:{
			let newState = {
				...state
			};
			delete newState[action.responseId];
			return newState;
		}
		default:
			return state;

	}
};