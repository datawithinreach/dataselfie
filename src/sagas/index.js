//ref: https://github.com/sotojuan/saga-login-flow/blob/master/app/sagas/index.js

import { all, call, put, takeLatest } from 'redux-saga/effects';

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
	notifyAuthSuccess,
	notifyAuthFailure
} from 'ducks/user';


function* handleLogin(action){
	// send a login request to server
	let {username, password} = action;

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
		yield put(notifyAuthSuccess(username, response.message));
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
		yield put(notifyAuthSuccess(username, response.message));
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
export default function* rootSaga(){
	yield all([
		loginSaga(),
		signupSaga()
	]);
}