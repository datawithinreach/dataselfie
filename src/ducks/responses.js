import uniqueId from 'utils/uniqueId';

// action types
export const CREATE_RESPONSE = 'CREATE_RESPONSE';

export const UPDATE_RESPONSE = 'UPDATE_RESPONSE';

export const DELETE_RESPONSE = 'DELETE_RESPONSE';

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