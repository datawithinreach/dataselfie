import { call, put, takeLatest } from 'redux-saga/effects';
// import { push } from 'react-router-redux';
import {send} from 'sagas/api';

import {
	REQUEST_FORMS, 
	CREATE_FORM,
	UPDATE_FORM,
	DELETE_FORM,
	REQUEST_FORM_CONTENT,
	receiveForms,
	receiveFormContent
} from 'ducks/forms';

import {
	alertServerError
} from 'ducks/ui';

// function* handleRequestForms(action){
// 	try{
// 		let response = yield call(send, 'request_forms', action);
// 		if (!response.status){
// 			throw Error (response.message);
// 		}
// 		yield put(receiveForms(response.forms)); 
// 	}catch (error){
// 		yield put(alertServerError(error.message));
// 	}
// }

function makeHandler(path, postAction){
	return function* (action){
		try{
			let response = yield call(send, path, action);
			if (!response.status){
				throw Error (response.message);
			}
			if (postAction){
				yield put(postAction(response.data));
			}
			
		}catch (error){
			yield put(alertServerError(error.message));
		}
	};
}
// function* handleForm(action){
// 	try{
// 		let response = yield call(send, action);
// 		if (!response.status){
// 			throw Error (response.message);
// 		}
// 	}catch (error){
// 		yield put(alertServerError(error.message));
// 	}
// }
// function* handleDeleteForm(action){
// 	try{
// 		let response = yield call(send, action);
// 		if (!response.status){
// 			throw Error (response.message);
// 		}
// 		// the user needs to confirm the email
// 		// yield put(notifyAuthSuccess(response.message));
// 	}catch (error){
// 		yield put(alertServerError(error.message));
// 	}
// }


export default [
	takeLatest(REQUEST_FORMS, makeHandler('request_forms', receiveForms)),
	takeLatest(CREATE_FORM, makeHandler('upsert_form')),
	takeLatest(UPDATE_FORM, makeHandler('upsert_form')),
	takeLatest(DELETE_FORM, makeHandler('delete_form')),
	takeLatest(REQUEST_FORM_CONTENT, makeHandler('request_form_content'), receiveFormContent)
];