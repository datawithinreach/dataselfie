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
	CREATE_QUESTION,
	UPDATE_QUESTION,
	DELETE_QUESTION,
} from 'ducks/questions';

import {
	CREATE_OPTION,
	UPDATE_OPTION,
	DELETE_OPTION,
} from 'ducks/options';

import {
	CREATE_DRAWING,
	UPDATE_DRAWING,
	DELETE_DRAWING,
} from 'ducks/drawings';

import {
	CREATE_RESPONSE,
	UPDATE_RESPONSE,
	DELETE_RESPONSE,
} from 'ducks/responses';

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
	takeLatest(REQUEST_FORM_CONTENT, makeHandler('request_form_content', receiveFormContent)),
	takeLatest(CREATE_FORM, makeHandler('upsert_form')),
	takeLatest(UPDATE_FORM, makeHandler('upsert_form')),
	takeLatest(DELETE_FORM, makeHandler('delete_form')),

	takeLatest(CREATE_QUESTION, makeHandler('upsert_question')),
	takeLatest(UPDATE_QUESTION, makeHandler('upsert_question')),
	takeLatest(DELETE_QUESTION, makeHandler('delete_question')),

	takeLatest(CREATE_OPTION, makeHandler('upsert_option')),
	takeLatest(UPDATE_OPTION, makeHandler('upsert_option')),
	takeLatest(DELETE_OPTION, makeHandler('delete_option')),

	takeLatest(CREATE_DRAWING, makeHandler('upsert_drawing')),
	takeLatest(UPDATE_DRAWING, makeHandler('upsert_drawing')),
	takeLatest(DELETE_DRAWING, makeHandler('delete_drawing')),

	takeLatest(CREATE_RESPONSE, makeHandler('upsert_response')),
	takeLatest(UPDATE_RESPONSE, makeHandler('upsert_response')),
	takeLatest(DELETE_RESPONSE, makeHandler('delete_response')),

	
];