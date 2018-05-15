import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

// import {bindActionCreators} from 'redux';
import {createForm} from 'ducks/forms';
import { push } from 'react-router-redux';
import FormThumbnail from '../FormThumbnail';
import css from './index.css';

const width = 312;
const height = 416;
const perRow = 4;
// const threshold = 10;
const calcGridLayout = (forms)=>{
	let layout = {};
	forms.map((form,i)=>{
		layout[form.id] = {
			x: (width)*(i%perRow),
			y: (height)*parseInt(i/perRow),
			width: (width-30),
			height: (height-30)
		};
	});
	return layout;
};

class FormList extends Component {
	constructor(props){
		super(props);

		this.state = {
			layout : calcGridLayout(props.forms)
		};
		this.onCreateForm = this.onCreateForm.bind(this);
	}
	onCreateForm(){
		this.props.createForm();
	}
	render() {
		const forms = this.props.forms.map((form) =>
			<FormThumbnail key={form.id}
				id = {form.id}
				x = {this.state.layout[form.id].x}
				y = {this.state.layout[form.id].y}
				width = {this.state.layout[form.id].width}
				height = {this.state.layout[form.id].height}/>
		);
		return (
			<div className={css.container}>
				<div className={css.header}>
					<div className={css.comicTitle}>
					</div>
					<div className={css.rightMenu}>
						<div className={css.button} onMouseUp={this.onCreateForm}></div>
					</div>
				</div>
				<div className={css.formList}>
					{forms}
				</div>
			</div>
		);
	}
}

FormList.propTypes = {
	forms: PropTypes.array,
	createForm:PropTypes.func,
};


const mapStateToProps = (state) => {
	console.log(Object.values(state.forms));
	return {
		forms: Object.values(state.forms)
	};
};
const mapDispatchToProps = (dispatch) => {
	return {
		createForm: ()=>{
			let action = createForm();
			dispatch(action);
			dispatch(push(`/form/${action.formId}`));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(FormList);
