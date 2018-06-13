import uniqueId from 'utils/uniqueId';
// action types
export const CREATE_DRAWING = 'CREATE_DRAWING';

export const DELETE_DRAWING = 'DELETE_DRAWING';

export const UPDATE_DRAWING = 'UPDATE_DRAWING';

// actions
export const createDrawing = (choiceId, path, attrs = {}) => {
	let id = uniqueId('drawing_');
	path.data.id = id;
	attrs.json = path.exportJSON();
	return {type: CREATE_DRAWING, choiceId, drawingId: id, attrs};
};

export const updateDrawing = (drawingId, attrs = {}) => {
	return {type: UPDATE_DRAWING, drawingId, attrs};
};

export const deleteDrawing = (choiceId, drawingId) => {
	return {type: DELETE_DRAWING, choiceId, drawingId};
};

// reduders
export default (state = {}, action)=>{
	switch (action.type) {
		case CREATE_DRAWING:
			return {
				...state,
				[action.drawingId]:{
					id:action.drawingId,
					choiceId:action.choiceId,
					...action.attrs
				}
			};
		case UPDATE_DRAWING:
			return {
				...state,
				[action.drawingId]:{
					...state[action.drawingId],
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