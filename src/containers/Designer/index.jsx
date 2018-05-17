import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {updateForm} from 'ducks/forms';
import {createItem,deleteItem,updateQuestion,addAnswer,updateAnswer, deleteAnswer} from 'ducks/items';
import css from './index.css';
import TextField from 'components/TextField';
import TextArea from 'components/TextArea';
import classNames from 'utils/classNames';
// import throttle from 'utils/throttle';
class Designer extends Component {
	constructor(props){
		super(props);

		this.state = {
			curStep: -1
		};
		this.changeStep = this.changeStep.bind(this);
		this.addItem = this.addItem.bind(this);
		this.nextItem = this.nextItem.bind(this);
		this.prevItem = this.prevItem.bind(this);
		this.deleteItem = this.deleteItem.bind(this);
		this.addAnswer = this.addAnswer.bind(this);
		this.deleteAnswer = this.deleteAnswer.bind(this);
		
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleDescChange = this.handleDescChange.bind(this);
		this.handleQuestionChange = this.handleQuestionChange.bind(this);
	}
	changeStep(e){
		this.setState({curStep:parseInt(e.target.dataset.step)});
	}
	addItem(){
		
		// set current step
		this.props.createItem(this.props.formId);
		this.setState({curStep:this.props.items.length});
		
	}
	prevItem(){
		if (this.state.curStep-1>=-1){
			this.setState({curStep:this.state.curStep-1});
		}			
	}
	nextItem(){
		if (this.state.curStep+1<this.props.items.length){
			this.setState({curStep:this.state.curStep+1});
		}		
	}
	deleteItem(){
		let {curStep} = this.state;
		
		if (curStep>=0){
			let item = this.props.items[curStep];
			this.props.deleteItem(item.id);
			if (curStep==this.props.items.length-1){ // if last item
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
		let item = this.props.items[this.state.curStep];
		this.props.updateQuestion(item.id, event.target.value);
	}
	addAnswer(){
		let item = this.props.items[this.state.curStep];
		this.props.addAnswer(item.id, null);
	}
	deleteAnswer(event){
		let item = this.props.items[this.state.curStep];
		let index = parseInt(event.target.dataset.index);
		if (isNaN(index)==false){
			this.props.deleteAnswer(item.id, index);
		}
	}
	handleAnswerChange(index, event){
		let item = this.props.items[this.state.curStep];
		// let index = parseInt(event.target.dataset.index);
		this.props.updateAnswer(item.id, index, event.target.value);
	}
	render() {
		let {curStep} = this.state;
		let {items} = this.props;
		let curItem = curStep>=0 && curStep<items.length? items[curStep]:null;
		return (
			<div>				
				<div className={css.progress}>
					<div className={classNames(css.start,css.marker,{[css.current]:-1==curStep})} data-step={-1} onMouseUp={this.changeStep}>
					0
					</div>
					{items.map((item, i)=>
						<Fragment key={i}>
							<div className={css.bar}/>
							<div className={classNames(css.marker,{[css.current]:i==curStep})} data-step={i} onMouseUp={this.changeStep}>
								{i+1}
							</div>
						</Fragment>
					)
					}
					<div className={css.bar}/>			
						
					<div className={classNames(css.end,css.marker)} onMouseUp={this.addItem}>
						+
					</div>
					

				</div>
				<div className={css.editItem}>
					{curStep==-1&&(	
						<Fragment>
							<div>
								<div className={css.button} onMouseUp={this.prevItem}><i className="fas fa-arrow-left"></i></div>
								<div className={css.button} onMouseUp={this.nextItem}><i className="fas fa-arrow-right"></i></div>
							</div>
							<TextField placeholder='Title' value={this.props.title} size={48} onChange={this.handleTitleChange}/>
							<br/>
							<TextArea placeholder='Description'  value={this.props.description} onChange={this.handleDescChange}/>
						</Fragment>
						
					)}
					{curStep!=-1&&(
						<div className={css.columns}>						
							<div className={css.column}>
								<div>
									<div className={css.button} onMouseUp={this.prevItem}><i className="fas fa-arrow-left"></i></div>
									<div className={css.button} onMouseUp={this.nextItem}><i className="fas fa-arrow-right"></i></div>
									<div className={css.button} onMouseUp={this.deleteItem}>Delete</div>
								</div>
								
								<div className={css.question}>
									<TextField placeholder='Question' value={curItem.question} onChange={this.handleQuestionChange}/>
								</div>
								
								<div className={css.answers}>
									{curItem&&curItem.answers.map((answer, i)=>
										<div key={i} className={css.answer}>											
											<TextField placeholder='Answer' style={{width:'100%'}} value={answer} onChange={this.handleAnswerChange.bind(this,i)}/>	
											<div className={css.button} data-index={i} onMouseUp={this.editEncoding}><i className="fas fa-pencil-alt"></i></div>
											<div className={css.button} data-index={i} onMouseUp={this.deleteAnswer}><i className="fas fa-times"></i></div>
										</div>
									)}
									
								</div>
								<div className={css.button} onMouseUp={this.addAnswer}>Add Answer</div>
							</div>
							<div className={css.column}>
								Encoding
							</div>
						</div>
					)}
				</div>

			
			</div>
		);
	}
}

Designer.propTypes = {
	formId:PropTypes.string,
	title:PropTypes.string,
	description:PropTypes.string,
	items:PropTypes.array,
	updateForm:PropTypes.func,
	createItem:PropTypes.func,
	deleteItem:PropTypes.func,
	updateQuestion:PropTypes.func,
	addAnswer:PropTypes.func,
	updateAnswer:PropTypes.func,
	deleteAnswer:PropTypes.func

};

const mapStateToProps = (state, ownProps) => {
	let formId = ownProps.formId;

	// collect items and encodings (use selectors)
	let items = Object.values(state.items).filter(item=>item.formId==formId);

	console.log('items', items);
	let form = state.forms[formId];
	return {
		...form,
		items,
		encodings:{}
	};
};

const mapDispatchToProps = (dispatch) => { 	
	return bindActionCreators({
		updateForm,
		createItem,
		deleteItem,
		updateQuestion,
		addAnswer,
		updateAnswer,
		deleteAnswer
	}, dispatch);
};

export default connect(mapStateToProps,mapDispatchToProps)(Designer);
