//ref: https://github.com/sotojuan/saga-login-flow/blob/master/app/sagas/index.js

import { all, call, put, takeLatest } from 'redux-saga/effects';

import {hashSync} from 'bcryptjs';


import {
	REQUEST_LOGIN, 
	NOTIFY_LOGIN_SUCCESS, 
	NOTIFY_LOGIN_FAILURE
} from 'ducks/user';


export function* handleLogin(action){
	// send a login request to server
	let {username, password} = action;

	// hash password
	let hashed = hashSync(password, 10);
	try{
		yield call(fetch, '/login', 'POST', {username, hashed});
		yield put({type:NOTIFY_LOGIN_SUCCESS, username });
	}catch (error){
		yield put({type:NOTIFY_LOGIN_FAILURE, username });
	}
}
export function* loginSaga(){
	yield takeLatest(REQUEST_LOGIN, handleLogin);

}
export default function* rootSaga(){
	yield all([
		loginSaga
	]);
}