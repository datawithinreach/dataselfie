import React, {Component} from 'react';
import PropTypes from 'prop-types';
import css from './index.css';

class TextField extends Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		if (this.props.onChange) {
			this.props.onChange(e);
		}
	}
	render() {

		return (
			<label className={css.container}>
				<input className={css.checkbox} type="checkbox"
					onChange={this.handleChange}/>
				<span className={css.checkmark}></span>
				<span className={css.label}>{this.props.label}</span>
			</label>
	
		);
	}

}

TextField.propTypes = {
	onChange: PropTypes.func,
	label:PropTypes.string,
};

TextField.defaultProps = {
	label:''
};
export default TextField;
