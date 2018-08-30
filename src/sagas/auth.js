import { call, put, takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
// import { push } from 'react-router-redux';
import api from 'sagas/api';

import {
	REQUEST_LOGIN, 
	REQUEST_SIGNUP,
	RESEND_CONFIRM_EMAIL,
	notifyAuthSuccess,
	notifyAuthFailure
} from 'ducks/auth';


function* handleLogin(action){
	// send a login request to server
	let {username, password, remember} = action;

	try{
		let response = yield call(api.login, username, password);
		console.log('received response', response);
		if (!response.status){
			throw Error (response.message);
		}
		if (!remember){
			// console.log('save user name in the session');
			sessionStorage.setItem('username', username);
		}else{
			localStorage.setItem('username', username);
		}	
		
		// the user needs to confirm the email
		yield put(notifyAuthSuccess(response.message, username));
		yield put(push('/forms')); // route to the forms
	}catch (error){
		yield put(notifyAuthFailure(error.message));
	}
}

function* handleSignup(action){
	let {username, password, email} = action;

	try{
		let response = yield call(api.signup, username, password, email);
		if (!response.status){
			throw Error (response.message);
		}

		// the user needs to confirm the email
		yield put(notifyAuthSuccess(response.message));
	}catch (error){
		yield put(notifyAuthFailure(error.message));
	}
}
function* handleResendConfirmEmail(action){
	let {username} = action;
	try{
		let response = yield call(api.resendConfirmEmail, username);
		if (!response.status){
			throw Error (response.message);
		}
		// the user needs to confirm the email
		yield put(notifyAuthSuccess(response.message));
	}catch (error){
		yield put(notifyAuthFailure(error.message));
	}
}
// function* loginSaga(){
// 	yield takeLatest(REQUEST_LOGIN, handleLogin);
// }


// function* signupSaga(){
// 	yield takeLatest(REQUEST_SIGNUP, handleSignup);
// }

// function* resendConfirmEmail(){
// 	yield takeLatest(RESEND_CONFIRM_EMAIL, handleResendConfirmEmail);
// }

export default [
	takeLatest(REQUEST_LOGIN, handleLogin),
	takeLatest(REQUEST_SIGNUP, handleSignup),
	takeLatest(RESEND_CONFIRM_EMAIL, handleResendConfirmEmail)
];