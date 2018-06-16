import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {updateForm} from 'ducks/forms';
import {createItem,deleteItem,updateQuestion} from 'ducks/items';
import {createChoice, updateChoiceText, deleteChoice} from 'ducks/choices';

import css from './index.css';
import TextField from 'components/TextField';
import TextArea from 'components/TextArea';
import classNames from 'utils/classNames';
import DrawingCanvas from 'containers/DrawingCanvas';
// import throttle from 'utils/throttle';
class Designer extends Component {
	constructor(props){
		super(props);

		this.state = {
			curStep: -1,
			curChoiceId:null
		};
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleDescChange = this.handleDescChange.bind(this);

		this.changeStep = this.changeStep.bind(this);

		this.createItem = this.createItem.bind(this);
		this.nextItem = this.nextItem.bind(this);
		this.prevItem = this.prevItem.bind(this);
		this.deleteItem = this.deleteItem.bind(this);


		this.createChoice = this.createChoice.bind(this);
		// this.deleteChoice = this.deleteChoice.bind(this);
		this.editEncoding = this.editEncoding.bind(this);
		

		this.handleQuestionChange = this.handleQuestionChange.bind(this);
	}
	changeStep(e){
		this.setState({curStep:parseInt(e.target.dataset.step), curChoiceId:null});
	}
	createItem(){
		
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
			this.props.deleteItem(this.props.formId, item.id);
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
	getCurItem(){
		let {curStep} = this.state;
		let {items} = this.props;
		return curStep>=0 && curStep<items.length? items[curStep]:null;
	}

	createChoice(){
		let item = this.props.items[this.state.curStep];
		this.props.createChoice(item.id, '');
	}
	deleteChoice(id){
		let item = this.props.items[this.state.curStep];
		// let id = event.currentTarget.dataset.id;
		this.props.deleteChoice(item.id, id);
	}
	handleChoiceChange(id, event){
		// let index = parseInt(event.target.dataset.index);
		this.props.updateChoiceText(id, event.target.value);
	}
	editEncoding(id){
		
		// let index = parseInt(event.currentTarget.dataset.index);
		// console.log('editEncoding', this.state.curChoiceId, index, event.currentTarget.dataset);
		if (id == this.state.curChoiceId){
			this.setState({curChoiceId:null});
		}else{
			this.setState({curChoiceId:id});
		}
		
	}

	render() {
		let {curStep, curChoiceId} = this.state;
		let {items} = this.props;
		let curItem = this.getCurItem();
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
						
					<div className={classNames(css.end,css.marker)} onMouseUp={this.createItem}>
						+
					</div>
					

				</div>
				<div className={css.content}>
					
				
					<div className={css.columns}>	
						{curStep==-1&&(	
							<div className={css.column}>
								<div>
									<div className={css.button} onMouseUp={this.prevItem}>
										<i className="fas fa-arrow-left"></i>
									</div>
									<div className={css.button} onMouseUp={this.nextItem}>
										<i className="fas fa-arrow-right"></i>
									</div>
								</div>
								<TextField placeholder='Title' value={this.props.title} 
									size={48} onChange={this.handleTitleChange}/>
								<br/>
								<TextArea placeholder='Description' 
									value={this.props.description} 
									onChange={this.handleDescChange}/>
							</div>
						
						)}		
						{curStep!=-1&&(			
							<div className={css.column}>
								<div>
									<div className={css.button} onMouseUp={this.prevItem}>
										<i className="fas fa-arrow-left"></i>
									</div>
									<div className={css.button} onMouseUp={this.nextItem}>
										<i className="fas fa-arrow-right"></i>
									</div>
									<div className={css.button} onMouseUp={this.deleteItem}>
										Delete
									</div>
								</div>
								
								<div className={css.question}>
									<TextField placeholder='Question' 
										value={curItem.question} 
										onChange={this.handleQuestionChange}/>
								</div>
								
								<div className={css.choices}>
									{curItem&&curItem.choices.map((choice)=>
										<div key={choice.id} className={css.choice}>											
											<TextField placeholder='Choice' 
												style={{width:'100%'}} 
												value={choice.text} 
												onChange={this.handleChoiceChange.bind(this,choice.id)}/>	
											<div className={classNames(css.button,{[css.selectedChoice]: curChoiceId==choice.id})} 
												onMouseUp={this.editEncoding.bind(this,choice.id)}>
												<i className="fas fa-edit"></i>
											</div>
											<div className={css.button} 
												onMouseUp={this.deleteChoice.bind(this,choice.id)}>
												<i className="fas fa-times"></i>
											</div>
										</div>
									)}
									
								</div>
								<div className={css.button} onMouseUp={this.createChoice}>Add Choice</div>
							</div>
						)}
						<div className={css.column}>
							<DrawingCanvas formId={this.props.formId} 
								itemId={curStep==-1?null:curItem.id} 
								choiceId={curChoiceId} />
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
	items:PropTypes.array,
	updateForm:PropTypes.func,
	createItem:PropTypes.func,
	deleteItem:PropTypes.func,
	updateQuestion:PropTypes.func,
	createChoice:PropTypes.func,
	updateChoiceText:PropTypes.func,
	deleteChoice:PropTypes.func

};

const mapStateToProps = (state, ownProps) => {
	let formId = ownProps.formId;
	let form = state.forms[formId];
	let items = form.items.map(iid=>{
		let item = state.items[iid];
		return {
			...item,
			choices: item.choices.map(cid=>state.choices[cid])
		};
	});
	return {
		...form,
		items
	};
};

const mapDispatchToProps = (dispatch) => { 	
	return bindActionCreators({
		updateForm,
		createItem,
		deleteItem,
		updateQuestion,
		createChoice,
		updateChoiceText,
		deleteChoice
	}, dispatch);
};

export default connect(mapStateToProps,mapDispatchToProps)(Designer);
