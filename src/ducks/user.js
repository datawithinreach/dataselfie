/*
	manages ui-specific states
*/

export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const NOTIFY_LOGIN_SUCCESS = 'NOTIFY_LOGIN_SUCCESS';
export const NOTIFY_LOGIN_FAILURE = 'NOTIFY_LOGIN_FAILURE';

export const REQUEST_SIGNUP = 'REQUEST_SIGNUP';
export const NOTIFY_SIGNUP_SUCCESS = 'NOTIFY_SIGNUP_SUCCESS';
export const NOTIFY_SIGNUP_FAILURE = 'NOTIFY_SIGNUP_FAILURE';

export const REQUEST_LOGOUT = 'REQUEST_LOGOUT';

export const requestLogin = (username, password) =>{
	return {
		type: REQUEST_LOGIN,
		username,
		password
	};
};

export const requestSignUp = (username, password, email) =>{
	return {
		type: REQUEST_SIGNUP,
		username,
		password,
		email
	};
};



//TODO: load it from a session storage or indexDB if applicable
let initState = {
	username:null,
	status:null
};

export default (state=initState, action)=>{
	switch (action.type) {
		case REQUEST_LOGIN:
			return {
				...state,
				status:REQUEST_LOGIN
			};//TODO: progress bar?
		case NOTIFY_LOGIN_SUCCESS:
			return {
				...state,
				username: action.username,
				status:NOTIFY_LOGIN_SUCCESS
			};
		case NOTIFY_LOGIN_FAILURE:
			return {
				...state,
				username: action.username,
				status:NOTIFY_LOGIN_FAILURE
			};
		case REQUEST_SIGNUP:
			return {
				...state,
				status:REQUEST_SIGNUP
			};//TODO: progress bar?
		case NOTIFY_SIGNUP_SUCCESS:
			return {
				...state,
				username: action.username,
				status:NOTIFY_SIGNUP_SUCCESS
			};
		case NOTIFY_SIGNUP_FAILURE:
			return {
				...state,
				username: action.username,
				status:NOTIFY_SIGNUP_FAILURE
			};
		case REQUEST_LOGOUT:
			return {
				...state,
				username:null,
				status:null
			};
		default:
			return state;

	}
};