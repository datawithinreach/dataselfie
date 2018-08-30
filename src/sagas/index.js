//ref: https://github.com/sotojuan/saga-login-flow/blob/master/app/sagas/index.js

import { all } from 'redux-saga/effects';

import auth from 'sagas/auth';
import forms from 'sagas/forms';
export default function* rootSaga(){
	yield all([
		...auth,
		...forms
	]);
}