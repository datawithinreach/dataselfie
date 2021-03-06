import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { push } from 'react-router-redux';
import {createResponse} from 'ducks/responses';
import {requestFormContent} from 'ducks/forms';
import {makeGetQuestionnaire} from 'ducks/forms';
import {selectForm} from 'ducks/ui';
import classNames from 'utils/classNames';
import TextField from 'components/TextField';
import RadioGroup from 'components/RadioGroup';
import Checkbox from 'components/Checkbox';
import Button from 'components/Button';

import css from './index.css';


class LiveView extends Component {
	constructor(props){
		super(props);
		this.state = {
			selectedQuestion: null,
			response:{
				answer:{}
			},
			showError:false
		};
		this.changeQuestion = this.changeQuestion.bind(this);
		this.nextQuestion = this.nextQuestion.bind(this);
		this.prevQuestion = this.prevQuestion.bind(this);
		this.handleRadioChange = this.handleRadioChange.bind(this);
		this.handleResponseNameChange = this.handleResponseNameChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleReleaseError = this.handleReleaseError.bind(this);
	}
	componentDidMount(){
		
		if (!this.props.preview){
			let {loggedInUsername='', formId, requestFormContent, selectForm} = this.props;
			console.log('loggedInUsername', loggedInUsername, formId);
			requestFormContent(loggedInUsername, formId, true);//retrieve form content from server		
			selectForm(formId);// when acceced directly from the url
		}
	}

	changeQuestion(e){
		// console.log('changeQuestion',e.target);
		let qid = e.target.dataset.id;
		this.setState({selectedQuestion:qid});
	}
	prevQuestion(){
		let index = this.props.questions.findIndex(q=>q.id==this.state.selectedQuestion);
		index-=1;
		if (index>=0){
			this.setState({selectedQuestion:this.props.questions[index].id});
		}else{
			this.setState({selectedQuestion:null});
		}
	}
	nextQuestion(){
		let index = this.props.questions.findIndex(q=>q.id==this.state.selectedQuestion);
		index+=1;
		if (index<this.props.questions.length){
			this.setState({selectedQuestion:this.props.questions[index].id});
		}	
	}
	getQuestion(){
		return this.props.questions.find(q=>q.id==this.state.selectedQuestion);
	}
	handleRadioChange(event){
		// console.log('selected',event.target.value);
		let question = this.getQuestion();
		this.setState({response:{
			...this.state.response,
			answer:{
				...this.state.response.answer,
				[question.id]:event.target.value
			}
		}});
	}
	handleCheckboxChange(optionId, event){
		let question = this.getQuestion();
		let {response} = this.state;
		console.log(optionId, event.target.checked);
		this.setState({response:{
			...this.state.response,
			answer : {
				...this.state.response.answer,
				[question.id]:{
					...(response.answer[question.id]||{}),
					[optionId]:event.target.checked
				}
			}
			
		}});
	}
	handleResponseNameChange(event){
		// console.log('handleResponseNameChange',event.target.value);
		this.setState({response:{
			...this.state.response,
			name:event.target.value
		}});

	}
	handleReleaseError(){
		this.setState({showError:false});
	}
	handleSubmit(){
		let {response} = this.state;
		let {questions} = this.props;
		if ((this.props.collectName?response.name:true) && questions.every(item=>response.answer[item.id])){
			// add question order
			// response = {
			// 	...this.state.response,
			// 	order:questions.map(q=>q.id)
			// };
			// this.setState({response});
			console.log('submitting', response);		
			if (!this.props.preview){
				let {responseId} = this.props.createResponse(this.props.formId, response);
				this.props.push(`/forms/view/${this.props.formId}/r/${responseId.replace('response_','')}`);
			}else{
				this.setState({showError:true, error:'You can not actually submit your response in the preview mode.'});
			}
			
		}else{
			let missing =  questions.length - questions.filter(item=>response.answer[item.id]).length;
			if (this.props.collectName){
				missing += (response.name?0:1);	
				this.setState({showError:true, error:`There ${missing>1?'are':'is'} ${missing} missing fields in this form.`});
			}else{
				this.setState({showError:true, error:`There ${missing>0?'are':'is'} ${missing} missing fields in this form.`});
			}
			
		}
		
	}
	render() {
		let {selectedQuestion, response, showError} = this.state;
		
		let {questions, loggedInUsername, username, collectName, preview} = this.props;
		// console.log(username, loggedInUsername);
		let curQuestion = this.getQuestion();
		return (
			<div style={{margin:preview?'0px':'10px'}}>
				{!preview&&
				<div className={css.navBar}>
					<Button link href='/' filled>DataSelfie</Button>
					{username && username==loggedInUsername &&
						<div className={css.rightMenu}>
							<div className={css.menuItem}>
								<Button  link href={`/forms/edit/${this.props.formId}`} outlined>Edit</Button>
							</div>
						</div>
					}
				</div>
				}
				<div className={css.progress}>
					<div className={classNames(css.start,css.marker,{[css.current]:selectedQuestion==null,  [css.incomplete]: showError&&(collectName?response.name==null:false)})} data-id={null} onPointerUp={this.changeQuestion}>
						<i className="fas fa-arrow-right"></i>
					</div>
					{questions.map((question,i)=>
						<Fragment key={question.id}>
							<div className={css.bar}/>
							<div className={classNames(css.marker,{[css.current]:question.id==selectedQuestion, [css.incomplete]: showError&&response.answer[this.props.questions[i].id]==null})} 
								data-id={question.id} onPointerUp={this.changeQuestion}>
								{i+1}
							</div>
						</Fragment>
					)
					}
				</div>
				<div className={css.content}>
					<div className={classNames(css.error,{[css.showError]:this.state.showError==true})}>
						{this.state.error}
						<a style={{marginLeft:'10px'}}onPointerUp={this.handleReleaseError}>Clear</a>
					</div>
					<div className={css.navMenu}>
						<Button onPointerUp={this.prevQuestion} outlined disabled={selectedQuestion==null}>
							<i className="fas fa-arrow-left"></i> Prev
						</Button>
						<Button onPointerUp={this.nextQuestion} outlined disabled={questions.length==0 || selectedQuestion==questions[questions.length-1].id}>
							<i className="fas fa-arrow-right"></i> Next
						</Button>
						<Button onPointerUp={this.handleSubmit} outlined>
							Submit
						</Button>
					</div>
					{selectedQuestion==null?(
						<Fragment>
							<br/>
							<div className={css.title}>{this.props.title}</div>
							<br/>
							{collectName &&
							<Fragment>
								<div>{this.props.prompt}</div>
								<br/>				
								<TextField placeholder='Write a response name.'	
									value={response.name? response.name: ''}
									onChange={this.handleResponseNameChange}/>
							</Fragment>}
						</Fragment>
						
					):(
						<Fragment>
							<div className={css.question}>
								<div>{curQuestion.text}</div>
							</div>
							{curQuestion.allowMultipleAnswers?
								<div style={{display:'flex', flexDirection:'column'}}>
									{curQuestion.options.map((option)=>
										<Checkbox key={option.id} 
											style={{margin:'5px'}}
											checked={response.answer[curQuestion.id]?response.answer[curQuestion.id][option.id]:false}
											label={option.text}
											data-id={option.id}
											onChange={this.handleCheckboxChange.bind(this, option.id)}/>)}
								</div>
								:
								<RadioGroup items={curQuestion.options}
									checked={response.answer[curQuestion.id]} 
									onChange={this.handleRadioChange}/>
								
							}
						</Fragment>
					)}
				</div>

			</div>
		);
	}
}

LiveView.propTypes = {
	formId:PropTypes.string,
	title:PropTypes.string,
	loggedInUsername:PropTypes.string,
	username:PropTypes.string,
	prompt:PropTypes.string,
	questions:PropTypes.array,
	collectName:PropTypes.bool,
	preview:PropTypes.bool,
	createResponse:PropTypes.func,
	requestFormContent:PropTypes.func,
	selectForm:PropTypes.func,
	push:PropTypes.func,
};
LiveView.defaultProps = {
	preview:false
};

const getQuestions = makeGetQuestionnaire();
const mapStateToProps = (state, ownProps) => {
	// let formId = state.ui.selectedForm?
	// state.ui.selectedForm:
	


	let formId = ownProps.formId?ownProps.formId:ownProps.match.params.formId;
	

	let form = state.forms[formId];
	console.log('form', form);
	let questions = getQuestions(state, {...ownProps, formId});

	return {
		formId,
		...form,
		questions,
		loggedInUsername: state.auth.username
	};
};

const mapDispatchToProps = (dispatch) => { 	
	return bindActionCreators({
		createResponse,
		requestFormContent,
		selectForm,
		push
	}, dispatch);
};

export default connect(mapStateToProps,mapDispatchToProps)(LiveView);
