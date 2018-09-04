import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import {makeGetQuestionnaire} from 'ducks/forms';
import Button from 'components/Button';
import DrawingThumbnail from 'containers/DrawingThumbnail';
import {selectForm} from 'ducks/ui';
import {requestFormContent} from 'ducks/forms';
import css from './index.css';

const propTypes = {
	formId:PropTypes.string,
	form:PropTypes.object,
	name:PropTypes.string,
	createdAt:PropTypes.string,
	questions:PropTypes.array,
	loggedInUsername:PropTypes.string,
	answer:PropTypes.object,
	selectForm:PropTypes.func,
	requestFormContent:PropTypes.func,
	makeGetQuestionnaire:PropTypes.func,
};

const defaultProps = {};

export class ResponseView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount(){
		if (!this.props.form){
			let {loggedInUsername=null, formId, requestFormContent, selectForm} = this.props;
			console.log('loggedInUsername', loggedInUsername, formId);
			requestFormContent(loggedInUsername, formId);//retrieve form content from server		
			selectForm(formId);// when acceced directly from the url

		}
	}
	render() {

		let {name, createdAt, formId, questions=[], loggedInUsername, form={}, answer={}} = this.props;
		let parentIds = [formId, ...Object.values(answer)];
		return (
		

			<div>
                
				<div className={css.navBar}>
					<Button link href='/' filled>DataSelfie</Button>
					{form.username ==loggedInUsername &&
						<div className={css.rightMenu}>
							<div className={css.menuItem}>
								<Button  link href={window.location.href.replace('view', 'edit')} outlined>Edit</Button>
							</div>
						</div>
					}
				</div>
				<div className={css.header}> {name} </div>
				<div className={css.note}> {createdAt} </div>
				<div className={css.response}>
					<DrawingThumbnail parentIds={parentIds} width={450} height={450} selected={false}/>
					<div className={css.questions}>
						{questions.map((question,i)=>(
							<div key={i} className={css.question}>
								<div className={css.header}>
									{question.text}
								</div>
								<div className={css.options}>
									{question.options.map((option,i)=>
										<div key={i} className={[css.option, answer[question.id]==option.id?css.selected:''].join(' ')}>
											<DrawingThumbnail key={question.id} 
												parentId={option.id}
												// fitted 
												// width={50}
												// height={50}
												selected={answer[question.id]==option.id}/>
											<div className={css.label}>{option.text}</div>
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}
}

ResponseView.propTypes = propTypes;
ResponseView.defaultProps = defaultProps;



const getQuestions = makeGetQuestionnaire();
const mapStateToProps = (state, ownProps) => {
	let formId = ownProps.match.params.formId;
	let responseId = 'response_'+ownProps.match.params.responseId;
	let questions = getQuestions(state, {formId});
	console.log('responseId', responseId, formId);
	let form = state.forms[formId];
	let response = state.responses[responseId];
	return {
		formId,
		form,
		...response,
		questions,
		loggedInUsername: state.auth.username
	};
};

const mapDispatchToProps = (dispatch) => { 	
	return bindActionCreators({
		// createResponse,
		makeGetQuestionnaire,
		requestFormContent,
		selectForm
	}, dispatch);
};

export default connect(mapStateToProps,mapDispatchToProps)(ResponseView);
