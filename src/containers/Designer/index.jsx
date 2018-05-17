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
class Designer extends Component {
	constructor(props){
		super(props);

		this.state = {
			curStep: -1
		};
		this.changeStep = this.changeStep.bind(this);
		this.addItem = this.addItem.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleDescChange = this.handleDescChange.bind(this);
	}
	changeStep(e){
		this.setState({curStep:e.target.dataset.step});
	}
	addItem(){
		console.log('add a new item');
		// set current step
		this.props.createItem(this.props.formId);
		
	}
	handleTitleChange(title){
		this.props.updateForm(this.props.formId, {title});
	}
	handleDescChange(desc){
		this.props.updateForm(this.props.formId, {desc});
	}
	render() {
		return (
			<div>				
				<div className={css.progress}>
					<div className={classNames(css.start,css.marker,{[css.current]:-1==this.state.curStep})} data-step={-1} onMouseUp={this.changeStep}/>
					{this.props.items.map((item, i)=>
						<Fragment key={i}>
							<div className={css.bar}/>
							<div className={classNames(css.marker,{[css.current]:i==this.state.curStep})} data-step={i} onMouseUp={this.changeStep}/>
						</Fragment>
					)
					}
					<div className={css.bar}/>			
						
					<div className={classNames(css.end,css.marker)} onMouseUp={this.addItem}>
						+
					</div>
					

				</div>
				{this.state.curStep==-1&&(
					<div>
						<br/>
						<TextField placeholder='Title' size={48} onChange={this.handleTitleChange}/>
						<br/>
						<TextArea placeholder='Description' onChange={this.handleDescChange}/>
					</div>
				)}
				{this.state.curStep!=-1&&(
					<div className={css.designArea}>
					
						<div className={css.question}>
							<div>
								Question.<TextArea placeholder='Description' onChange={this.handleDescChange}/>
							</div>
							<div>
								Answer.<TextArea placeholder='Description' onChange={this.handleDescChange}/>
							</div>
						</div>
						<div className={css.encoding}>
							Encoding
						</div>
					</div>
				)}

			
			</div>
		);
	}
}

Designer.propTypes = {
	formId:PropTypes.string,
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
