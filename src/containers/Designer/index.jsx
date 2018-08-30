import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {updateForm} from 'ducks/forms';
import {createQuestion,deleteQuestion,updateQuestion, makeGetQuestions} from 'ducks/questions';


import css from './index.css';
import TextField from 'components/TextField';
import TextArea from 'components/TextArea';
import Question from 'containers/Question';
import classNames from 'utils/classNames';
import DrawingCanvas from 'containers/DrawingCanvas';
// import throttle from 'utils/throttle';
class Designer extends Component {
	constructor(props){
		super(props);

		this.state = {
			curStep: -1,
		};
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleDescChange = this.handleDescChange.bind(this);

		this.changeStep = this.changeStep.bind(this);

		this.createQuestion = this.createQuestion.bind(this);
		this.nextItem = this.nextItem.bind(this);
		this.prevItem = this.prevItem.bind(this);
		this.deleteQuestion = this.deleteQuestion.bind(this);


		this.createOption = this.createOption.bind(this);
		this.deleteOption = this.deleteOption.bind(this);
		this.editEncoding = this.editEncoding.bind(this);
		

		this.handleQuestionChange = this.handleQuestionChange.bind(this);
	}
	changeStep(e){
		this.setState({curStep:parseInt(e.target.dataset.step), curOptionId:null});
	}
	createQuestion(){
		
		// set current step
		this.props.createQuestion(this.props.formId);
		this.setState({curStep:this.props.questions.length});
		
	}
	prevItem(){
		if (this.state.curStep-1>=-1){
			this.setState({curStep:this.state.curStep-1});
		}			
	}
	nextItem(){
		if (this.state.curStep+1<this.props.questions.length){
			this.setState({curStep:this.state.curStep+1});
		}		
	}
	deleteQuestion(){
		let {curStep} = this.state;
		
		if (curStep>=0){
			let item = this.props.questions[curStep];
			this.props.deleteQuestion(this.props.formId, item.id);
			if (curStep==this.props.questions.length-1){ // if last item
				this.setState({curStep: curStep-1}); // move the cursor to the next last item
			}
		}
	}
	handleTitleChange(event){
		this.props.updateForm(this.props.formId, {title:event.target.value});
	}
	handleDescChange(event){
		this.props.updateForm(this.props.formId, {description:event.target.value});
	}
	
	handleQuestionChange(event){
		let item = this.props.questions[this.state.curStep];
		this.props.updateQuestion(item.id, event.target.value);
	}
	getCurItem(){
		let {curStep} = this.state;
		let {questions} = this.props;
		return curStep>=0 && curStep<questions.length? questions[curStep]:null;
	}



	render() {
		let {curStep, curOptionId} = this.state;
		let {questions} = this.props;
		let curItem = this.getCurItem();
		return (
			<div>				
				<div className={css.progress}>
					<div className={classNames(css.start,css.marker,{[css.current]:-1==curStep})} data-step={-1} onPointerUp={this.changeStep}>
					0
					</div>
					{questions.map((item, i)=>
						<Fragment key={i}>
							<div className={css.bar}/>
							<div className={classNames(css.marker,{[css.current]:i==curStep})} data-step={i} onPointerUp={this.changeStep}>
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
							{curStep==-1?(	
								<React.Fragment>
									<div className={css.navMenu}>
										<div className={css.button} onPointerUp={this.prevItem}>
											<i className="fas fa-arrow-left"></i>
										</div>
										<div className={css.button} onPointerUp={this.nextItem}>
											<i className="fas fa-arrow-right"></i>
										</div>
									</div>
									<TextField placeholder='Title' value={this.props.title} 
										size={48} onChange={this.handleTitleChange}/>
									<br/>
									<TextArea placeholder='Description' 
										value={this.props.description} 
										onChange={this.handleDescChange}/>
								
								</React.Fragment>
							):(
								<Question id={curItem.id}/>
							)}		
						</div>
						<div className={css.column}>
							<DrawingCanvas formId={this.props.formId} 
								questionId={curStep==-1?null:curItem.id} 
								optionId={curOptionId} />
						</div>
					</div>
					
				</div>

			
			</div>
		);
	}
}

Designer.propTypes = {
	formId:PropTypes.string,
	title:PropTypes.string,
	description:PropTypes.string,
	questions:PropTypes.array,
	updateForm:PropTypes.func,
	createQuestion:PropTypes.func,
	deleteQuestion:PropTypes.func,
	updateQuestion:PropTypes.func

};

const getQuestions = makeGetQuestions();
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
		updateForm,
		createQuestion,
		deleteQuestion,
		updateQuestion
	}, dispatch);
};

export default connect(mapStateToProps,mapDispatchToProps)(Designer);
