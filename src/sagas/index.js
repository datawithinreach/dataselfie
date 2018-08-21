//ref: https://github.com/sotojuan/saga-login-flow/blob/master/app/sagas/index.js

import { all, call, put, takeLatest } from 'redux-saga/effects';
// import { push } from 'react-router-redux';
let url = 'http://localhost:8889';
// let api = {
// 	signup: function(username, password, email){
// 		return fetch(`${url}/signup`, 
// 			{ 
// 				method:'POST', 
// 				headers: {
// 					'Content-Type': 'application/json'
// 				},
// 				body: JSON.stringify({username, password, email})
// 			}).then(resp=>resp.json())

// 	}
// };
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
		let response = yield call(fetch, `${url}/login`, 
			{ 
				method:'POST', 
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({username, password})
			});
		response = yield response.json();
		console.log('received response', response);
		if (!response.status){
			throw Error (response.message);
		}
		if (!remember){
			console.log('save user name in the session');
			sessionStorage.setItem('username', username);
		}	
		
		// the user needs to confirm the email
		yield put(notifyAuthSuccess(response.message, remember?username:null));
	}catch (error){
		yield put(notifyAuthFailure(error.message));
	}
}

function* handleSignup(action){
	let {username, password, email} = action;

	try{
		let response = yield call(fetch, `${url}/signup`, 
			{ 
				method:'POST', 
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({username, password, email})
			});
		response = yield response.json();
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
		let response = yield call(fetch, `${url}/resend`, 
			{ 
				method:'POST', 
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({username})
			});
		response = yield response.json();
		if (!response.status){
			throw Error (response.message);
		}
		// the user needs to confirm the email
		yield put(notifyAuthSuccess(response.message));
	}catch (error){
		yield put(notifyAuthFailure(error.message));
	}
}
function* loginSaga(){
	yield takeLatest(REQUEST_LOGIN, handleLogin);
}


function* signupSaga(){
	yield takeLatest(REQUEST_SIGNUP, handleSignup);
}

function* resendConfirmEmail(){
	yield takeLatest(RESEND_CONFIRM_EMAIL, handleResendConfirmEmail);
}

export default function* rootSaga(){
	yield all([
		loginSaga(),
		signupSaga(),
		resendConfirmEmail()
	]);
}