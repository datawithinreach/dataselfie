import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createOption, updateOption, deleteOption, makeGetOptions} from 'ducks/options';
import {selectOption} from 'ducks/ui';
import TextField from 'components/TextField';
import classNames from 'utils/classNames';
import css from './index.css';
class Question extends Component {
	constructor(props){
		super(props);
	}
	createOption(){
		this.props.createOption(this.props.id, '');
	}
	deleteOption(optionId){
		this.props.deleteOption(optionId);
	}
	handleoptionChange(id, event){
		// let index = parseInt(event.target.dataset.index);
		this.props.updateOption(id, event.target.value);
	}
	
	editDrawing(id){
		this.props.selectOption(id);
		
	}
	render() {
		return (
			<div>
			
								
				<div className={css.question}>
					<TextField placeholder='Question' 
						value={this.props.text} 
						onChange={this.handleQuestionChange}/>
				</div>
								
				<div className={css.options}>
					{this.props.options.map((option)=>
						<div key={option.id} className={css.option}>											
							<TextField placeholder='Option' 
								style={{width:'100%'}} 
								value={option.text} 
								onChange={this.handleOptionChange.bind(this,option.id)}/>	
							<div className={classNames(css.button,{[css.selectedOption]: this.props.selectedOption==option.id})} 
								onPointerUp={this.editDrawing.bind(this,option.id)}>
								<i className="fas fa-edit"></i>
							</div>
							<div className={css.button} 
								onPointerUp={this.deleteOption.bind(this,option.id)}>
								<i className="fas fa-times"></i>
							</div>
						</div>
					)}
									
				</div>
				<div className={css.button} onPointerUp={this.createOption}>Add Option</div>
			</div>
		);
	}
}

Question.propTypes = {
	id:PropTypes.string,
	text:PropTypes.string,
	options:PropTypes.array,
	selectedOption:PropTypes.string,
	selectOption:PropTypes.func,
	createOption:PropTypes.func,
	deleteOption:PropTypes.func,
	updateOption:PropTypes.func
};

const getOptions = makeGetOptions();
const mapStateToProps = (state, ownProps) => {
	let question = state.questions[ownProps.id];
	let options = getOptions(state, ownProps);
	return {
		...question,
		options,
		selectedOption:state.ui.selectedOption
	};
};

const mapDispatchToProps = (dispatch) => { 	
	return bindActionCreators({
		createOption,
		deleteOption,
		updateOption,
		selectOption
	}, dispatch);
};

export default connect(mapStateToProps,mapDispatchToProps)(Question);
