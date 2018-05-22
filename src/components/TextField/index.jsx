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
			<div className={css.textField} style={this.props.style}>
				<input type="text"
					placeholder={this.props.placeholder}
					onChange={this.handleChange}
					style={{fontSize:this.props.size+'px',
						paddingBottom: Math.round(this.props.size/3.5)+'px'}}
					disabled={this.props.disabled}
					value = {this.props.value}
				/>
			</div>
		);
	}

}

TextField.propTypes = {
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	size: PropTypes.number,
	style: PropTypes.object,
	value: PropTypes.string,
	disabled:PropTypes.bool
};

TextField.defaultProps = {
	placeholder: 'Enter Text',
	size: 18,
	disabled:false
};
export default TextField;
