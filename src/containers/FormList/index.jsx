import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createForm} from 'ducks/forms';
import {selectForm} from 'ducks/ui';
import {requestForms, makeGetFormsByUser} from 'ducks/forms';
import FormThumbnail from '../FormThumbnail';
// import Button from 'components/Button';
import css from './index.css';
const width = 225;
const height = 225;
// const threshold = 10;


class FormList extends Component {
	constructor(props){
		super(props);
		

		this.onCreateForm = this.onCreateForm.bind(this);
		this.handleDeselect = this.handleDeselect.bind(this);
	}
	componentDidMount(){
		window.addEventListener('pointerup', this.handleDeselect);
		this.props.requestForms(this.props.username);
	}
	componentWillUnmount(){
		// console.log('unmounted!!');
		window.removeEventListener('pointerup', this.handleDeselect);
	}
	handleDeselect(){
		this.props.selectForm(null);
	}
	onCreateForm(e){
		e.stopPropagation();
		this.props.createForm(this.props.username);
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
				{/* <div className={css.menu}>
					<div className={css.menuItem}>
						<Button onPointerUp={this.onCreateForm} outlined>New Form</Button>
					</div>
				</div> */}
				<div className={css.formList} onPointerUp={this.handleDeselect}>
					<div className={css.addButton} style={{width:`${width}px`, height:`${height}px`}} onPointerUp={this.onCreateForm}>
						+
					</div>
					{forms}
				</div>
			</div>
		);
	}
}

FormList.propTypes = {
	username:PropTypes.string,
	forms: PropTypes.array,
	createForm:PropTypes.func,
	selectForm:PropTypes.func,
	requestForms:PropTypes.func,
};

const getForms = makeGetFormsByUser();

const mapStateToProps = (state) => {
	// let username = state.auth.username;//? state.auth.username : sessionStorage.getItem('username');
	let forms = getForms(state);
	console.log('form list', forms);
	return {
		username:state.auth.username,
		forms
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		...bindActionCreators({
			selectForm,
			requestForms
		}, dispatch),
		createForm: (username)=>{
			let action = createForm(username);
			dispatch(action);
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(FormList);
