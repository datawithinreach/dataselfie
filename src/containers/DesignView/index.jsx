import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {updateForm} from 'ducks/forms';
import {createQuestion,deleteQuestion,updateQuestion,makeGetQuestions} from 'ducks/questions';
import {selectQuestion} from 'ducks/ui';

import css from './index.css';
import TextField from 'components/TextField';
import TextArea from 'components/TextArea';
import Button from 'components/Button';
import Question from 'containers/Question';
import classNames from 'utils/classNames';
import DrawingCanvas from 'containers/DrawingCanvas';
// import throttle from 'utils/throttle';
class DesignView extends Component {
	constructor(props){
		super(props);

		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleDescChange = this.handleDescChange.bind(this);

		this.changeQuestion = this.changeQuestion.bind(this);

		this.createQuestion = this.createQuestion.bind(this);
		this.nextQuestion = this.nextQuestion.bind(this);
		this.prevQuestion = this.prevQuestion.bind(this);

		this.deleteQuestion = this.deleteQuestion.bind(this);

		
	}
	
	changeQuestion(e){
		// this.setState({curStep:parseInt(e.target.dataset.step), curOptionId:null});
		let qid = e.target.dataset.id;
		this.props.selectQuestion(qid);

	}
	createQuestion(){
		// set current step
		let action = this.props.createQuestion(this.props.formId);
		this.props.selectQuestion(action.questionId);
		
	}
	prevQuestion(){
		let index = this.props.questions.findIndex(q=>q.id==this.props.selectedQuestion);
		index-=1;
		if (index>=0){
			this.props.selectQuestion(this.props.questions[index].id);

		}else{
			this.props.selectQuestion(null);
		}		
	}
	nextQuestion(){
		let index = this.props.questions.findIndex(q=>q.id==this.props.selectedQuestion);
		index+=1;
		if (index<this.props.questions.length){
			this.props.selectQuestion(this.props.questions[index].id);
		}	
	}
	deleteQuestion(){
	
		if (this.props.selectedQuestion){
			let deleted = this.props.selectedQuestion;
			this.prevQuestion();
			this.props.deleteQuestion(deleted);
		}
	}

	handleTitleChange(event){
		this.props.updateForm(this.props.formId, {title:event.target.value});
	}
	handleDescChange(event){
		this.props.updateForm(this.props.formId, {description:event.target.value});
	}
	

	render() {
		let {questions, selectedQuestion, formId} = this.props;
		return (
			<div>				
				<div className={css.progress}>
					<div className={classNames(css.start,css.marker,{[css.current]:selectedQuestion==null})} data-id={null} onPointerUp={this.changeQuestion}>
						<i className="fas fa-arrow-right"></i>
					</div>
					{questions.map((question, i)=>
						<Fragment key={question.id}>
							<div className={css.bar}/>
							<div className={classNames(css.marker,{[css.current]:question.id==selectedQuestion})} data-id={question.id} onPointerUp={this.changeQuestion}>
								{i+1}
							</div>
						</Fragment>
					)
					}
					<div className={css.bar}/>			
						
					<div className={classNames(css.end,css.marker)} onPointerUp={this.createQuestion}>
						+
					</div>
					

				</div>
				<div className={css.content}>
					<div className={css.columns}>	
						<div className={css.column}>
							<div className={css.navMenu}>
								<Button onPointerUp={this.prevQuestion} outlined>
									<i className="fas fa-arrow-left"></i> Prev
								</Button>
								<Button onPointerUp={this.nextQuestion} outlined>
									<i className="fas fa-arrow-right"></i> Next
								</Button>
								<Button onPointerUp={this.deleteQuestion} outlined>
									Delete
								</Button>
							</div>
							{selectedQuestion==null?(	
								<React.Fragment>
									<TextField placeholder='Title' value={this.props.title} 
										size={36} onChange={this.handleTitleChange}/>
									<br/>
									<TextArea placeholder='Description' 
										value={this.props.description} 
										onChange={this.handleDescChange}/>
								
								</React.Fragment>
							):(
								<Question questionId={selectedQuestion}/>
							)}		
						</div>
						<div className={css.column}>
							{/* pass memoized questions for performance */}
							<DrawingCanvas formId={formId} />
						</div>
					</div>
					
				</div>

			
			</div>
		);
	}
}

DesignView.propTypes = {
	formId:PropTypes.string,
	title:PropTypes.string,
	description:PropTypes.string,
	questions:PropTypes.array,
	// drawings:PropTypes.object,// contains all drawings in a nested structure
	updateForm:PropTypes.func,
	selectedQuestion:PropTypes.string,
	createQuestion:PropTypes.func,
	deleteQuestion:PropTypes.func,
	updateQuestion:PropTypes.func,
	selectQuestion:PropTypes.func

};

const getQuestions = makeGetQuestions();

// const getDrawings = makeGetDrawings();

const mapStateToProps = (state, ownProps) => {
	let formId = ownProps.formId;
	// let form = state.forms[formId];
	let questions = getQuestions(state, ownProps);
	// let drawings = getDrawings(state, ownProps);


	return {
		...state.forms[formId],
		questions,
		// drawings,
		selectedQuestion:state.ui.selectedQuestion
	};
};

const mapDispatchToProps = (dispatch) => { 	
	return bindActionCreators({
		updateForm,
		createQuestion,
		deleteQuestion,
		updateQuestion,
		selectQuestion
	}, dispatch);
};

export default connect(mapStateToProps,mapDispatchToProps)(DesignView);
