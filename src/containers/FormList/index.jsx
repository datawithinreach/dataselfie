import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createForm} from 'ducks/forms';
import { push } from 'react-router-redux';
import FormThumbnail from '../FormThumbnail';
import css from './index.css';
import {selectForm} from 'ducks/ui';
const width = 300;
const height = 320;
// const threshold = 10;


class FormList extends Component {
	constructor(props){
		super(props);
		

		this.onCreateForm = this.onCreateForm.bind(this);
		this.handleDeselect = this.handleDeselect.bind(this);
	}
	componentDidMount(){
		window.addEventListener('mouseup', this.handleDeselect);
	}
	handleDeselect(){
		this.props.selectForm(null);
	}
	onCreateForm(e){
		e.stopPropagation();
		this.props.createForm();
	}
	render() {
		const forms = this.props.forms.map((form) =>
			<FormThumbnail key={form.id}
				id = {form.id}
				width = {width}
				height = {height}/>
		);
		return (
			<div className={css.container}>
				<div className={css.menu}>
					<div className={css.menuItem}>
						<div className={css.button} onMouseUp={this.onCreateForm}>+</div>
					</div>
				</div>
				<div className={css.formList} onMouseUp={this.handleDeselect}>
					{forms}
				</div>
			</div>
		);
	}
}

FormList.propTypes = {
	forms: PropTypes.array,
	createForm:PropTypes.func,
	selectForm:PropTypes.func
};


const mapStateToProps = (state) => {
	console.log(Object.values(state.forms));
	return {
		forms: Object.values(state.forms)
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		...bindActionCreators({
			selectForm,
		}, dispatch),
		createForm: ()=>{
			let action = createForm();
			dispatch(action);
			dispatch(push(`/form/${action.formId}`));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(FormList);
