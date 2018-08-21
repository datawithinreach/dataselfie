/*
	manages ui-specific states
*/

export const REQUEST_LOGIN = 'REQUEST_LOGIN';

export const REQUEST_SIGNUP = 'REQUEST_SIGNUP';
export const NOTIFY_AUTH_SUCCESS = 'NOTIFY_AUTH_SUCCESS';
export const RESEND_CONFIRM_EMAIL = 'RESEND_CONFIRM_EMAIL';
export const NOTIFY_AUTH_FAILURE = 'NOTIFY_AUTH_FAILURE';
export const REQUEST_LOGOUT = 'REQUEST_LOGOUT';
export const CLEAR_AUTH_STATUS = 'CLEAR_AUTH_STATUS';

export const requestLogin = (username, password, remember) =>{
	return {
		type: REQUEST_LOGIN,
		username,
		password,
		remember
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
export const resendConfirmEmail = (username) =>{
	return {
		type: RESEND_CONFIRM_EMAIL,
		username,
	};
};
export const requestLogout = () =>{
	return {
		type: REQUEST_LOGOUT
	};
};

export const notifyAuthSuccess = (message, username)=>{
	return {
		type:NOTIFY_AUTH_SUCCESS,
		message,
		username
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