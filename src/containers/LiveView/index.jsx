import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createResponse} from 'ducks/responses';
import {makeGetQuestionnaire} from 'ducks/forms';
import classNames from 'utils/classNames';
import TextField from 'components/TextField';
import RadioGroup from 'components/RadioGroup';
import Button from 'components/Button';

import css from './index.css';


class LiveView extends Component {
	constructor(props){
		super(props);
		this.state = {
			selectedQuestion: null,
			response:{},
			showError:false
		};
		this.changeQuestion = this.changeQuestion.bind(this);
		this.nextQuestion = this.nextQuestion.bind(this);
		this.prevQuestion = this.prevQuestion.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.handleResponseNameChange = this.handleResponseNameChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleReleaseError = this.handleReleaseError.bind(this);
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
	handleSelect(event){
		// console.log('selected',event.target.value);
		let question = this.getQuestion();
		this.setState({response:{
			...this.state.response,
			[question.id]:event.target.value
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
		if (response.name && questions.every(item=>response[item.id])){
			console.log('submitting', this.state.response);		
			if (!this.props.preview){
				this.props.createResponse(this.props.formId, {response});
			}else{
				this.setState({showError:true, error:'You can not actually submit your response in the preview mode.'});
			}
			
		}else{
			let missing =  questions.length - questions.filter(item=>response[item.id]).length;
			missing += (response.name?0:1);
			this.setState({showError:true, error:`There ${missing>1?'are':'is'} ${missing} missing fields in this form.`});
		}
		
	}
	render() {
		let {selectedQuestion, response, showError} = this.state;
		// console.log('response',response.id);
		let {questions} = this.props;
		let curQuestion = this.getQuestion();
		return (
			<div>
				<div className={css.progress}>
					<div className={classNames(css.start,css.marker,{[css.current]:selectedQuestion==null,  [css.incomplete]: showError&&response.name==null})} data-id={null} onPointerUp={this.changeQuestion}>
						<i className="fas fa-arrow-right"></i>
					</div>
					{questions.map((question,i)=>
						<Fragment key={question.id}>
							<div className={css.bar}/>
							<div className={classNames(css.marker,{[css.current]:question.id==selectedQuestion, [css.incomplete]: showError&&response[this.props.questions[i].id]==null})} 
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
						<Button onPointerUp={this.prevQuestion} outlined>
							<i className="fas fa-arrow-left"></i> Prev
						</Button>
						<Button onPointerUp={this.nextQuestion} outlined>
							<i className="fas fa-arrow-right"></i> Next
						</Button>
						<Button onPointerUp={this.handleSubmit} outlined>
							Submit
						</Button>
					</div>
					{selectedQuestion==null?(
						<Fragment>
							<div className={css.title}>{this.props.title}</div>
							<br/>
							<div>{this.props.description}</div>
							<br/>				
							{/* <div>Please write down any identifier for your response such as a name or date.</div>									 */}
							<TextField placeholder='ID, e.g., name or date'	
								value={response.id? response.id: ''}
								onChange={this.handleResponseNameChange}/>
						</Fragment>
						
					):(
						<Fragment>
							<div className={css.question}>
								<div>{curQuestion.text}</div>
							</div>
							<RadioGroup items={curQuestion.options}
								checked={response[curQuestion.id]} 
								onChange={this.handleSelect}/>
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
	description:PropTypes.string,
	questions:PropTypes.array,
	preview:PropTypes.bool,
	createResponse:PropTypes.func
};

const getQuestions = makeGetQuestionnaire();
const mapStateToProps = (state, ownProps) => {
	let formId = ownProps.formId;
	let form = state.forms[formId];
	let questions = getQuestions(state, ownProps);

	return {
		...form,
		questions
	};
};

const mapDispatchToProps = (dispatch) => { 	
	return bindActionCreators({
		createResponse
	}, dispatch);
};

export default connect(mapStateToProps,mapDispatchToProps)(LiveView);
