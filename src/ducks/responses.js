import uniqueId from 'utils/uniqueId';

// action types
export const ADD_RESPONSE = 'ADD_RESPONSE';

export const UPDATE_RESPONSE = 'UPDATE_RESPONSE';

export const DELETE_RESPONSE = 'DELETE_RESPONSE';

// actions

export const createResponse = (formId, attrs = {}) => {
	return {type: ADD_RESPONSE, formId, responseId: uniqueId('response_'), attrs};
};


export const updateResponse = (responseId, attrs) => {
	return {type: UPDATE_RESPONSE, responseId, attrs};
};


export const deleteResponse = (formId, responseId) => {
	return {type: DELETE_RESPONSE, formId, responseId};
};

export default (state = {}, action)=>{
	switch (action.type) {
		case ADD_RESPONSE:
			return {
				...state,
				[action.responseId]:{
					id:action.responseId,
					formId:action.formId,
					...action.attrs
				}
			};
		case UPDATE_RESPONSE:
			return {
				...state,
				[action.responseId]:{
					...state[action.responseId],
					...action.attrs
				}
			};

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