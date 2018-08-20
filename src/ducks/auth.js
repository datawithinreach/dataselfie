/*
	manages ui-specific states
*/

export const REQUEST_LOGIN = 'REQUEST_LOGIN';

export const REQUEST_SIGNUP = 'REQUEST_SIGNUP';
export const NOTIFY_AUTH_SUCCESS = 'NOTIFY_AUTH_SUCCESS';

export const NOTIFY_AUTH_FAILURE = 'NOTIFY_AUTH_FAILURE';
export const REQUEST_LOGOUT = 'REQUEST_LOGOUT';
export const CLEAR_AUTH_STATUS = 'CLEAR_AUTH_STATUS';

export const requestLogin = (username, password) =>{
	return {
		type: REQUEST_LOGIN,
		username,
		password
	};
};

export const requestSignup = (username, password, email) =>{
	return {
		type: REQUEST_SIGNUP,
		username,
		password,
		email
	};
};
export const notifyAuthSuccess = (message)=>{
	return {
		type:NOTIFY_AUTH_SUCCESS,
		message
	};
};

export const notifyAuthFailure = (message)=>{
	return {
		type:NOTIFY_AUTH_FAILURE,
		message
	};
};
export const clearAuthStatus = () =>{
	return {
		type: CLEAR_AUTH_STATUS
	};
};


//TODO: load it from a session storage or indexDB if applicable
let initState = {
	username:null,
	status:null
};

export default (state=initState, action)=>{
	switch (action.type) {
		// case REQUEST_LOGIN:
		// 	return {
		// 		...state,
		// 		status: null
		// 	};//TODO: progress bar?
		case NOTIFY_AUTH_SUCCESS:
			return {
				...state,
				username: action.username,
				status: action.message
			};
		case NOTIFY_AUTH_FAILURE:
			return {
				...state,
				username: null,
				status: action.message
			};
		// case REQUEST_SIGNUP:
		// 	return {
		// 		...state,
		// 		status:REQUEST_SIGNUP
		// 	};//TODO: progress bar?

		case REQUEST_LOGOUT:
			return {
				...state,
				username:null,
				status:null
			};
		case CLEAR_AUTH_STATUS:
			return {
				...state,
				status:null
			};
		default:
			return state;

	}
};