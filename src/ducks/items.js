import uniqueId from 'utils/uniqueId';

// action types
export const CREATE_ITEM = 'CREATE_ITEM';
export const DELETE_ITEM = 'DELETE_ITEM';
export const UPDATE_QUESTION = 'UPDATE_QUESTION';
export const ADD_ANSWER = 'ADD_ANSWER';
export const UPDATE_ANSWER = 'UPDATE_ANSWER';
export const DELETE_ANSWER = 'DELETE_ANSWER';

// actions

export const createItem = (formId) => {
	return {type: CREATE_ITEM, formId, itemId: uniqueId('item_')};
};

export const updateQuestion = (itemId, question) => {
	return {type: UPDATE_QUESTION, itemId, question};
};

export const addAnswer = (itemId, answer) => {
	return {type: ADD_ANSWER, itemId, answer};
};

export const updateAnswer = (itemId, index, answer) => {
	return {type: UPDATE_ANSWER, itemId, index, answer};
};

export const deleteAnswer = (itemId, index) => {
	return {type: DELETE_ANSWER, itemId, index};
};

export const deleteItem = (itemId) =>{
	return {
		type: DELETE_ITEM,
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
				question:undefined,
				answers:[undefined]
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
		case ADD_ANSWER:
			return {
				...state,
				[action.itemId]:{
					...state[action.itemId],
					answers: state[action.itemId].answers.concat(action.answer)
				}
			};
		case UPDATE_ANSWER:
			return {
				...state,
				[action.itemId]:{
					...state[action.itemId],
					answers: state[action.itemId].answers
						.map((answer, index)=>index==action.index?action.answer:answer)
				}
			};
		case DELETE_ANSWER:
			return {
				...state,
				[action.itemId]:{
					...state[action.itemId],
					answers: [
						...state[action.itemId].answers.slice(0, action.index),
						...state[action.itemId].answers.slice(action.index+1)
					]
				}
			};
		default:
			return state;

	}
};
