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
			<div className={css.textField}>
				<input type="text"
					placeholder={this.props.placeholder}
					onChange={this.handleChange}
					style={{fontSize:this.props.fontSize+'px',
						paddingBottom: Math.round(this.props.fontSize/3.5)+'px'}}
				/>
			</div>
		);
	}

}

TextField.propTypes = {
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	fontSize: PropTypes.number
};

TextField.defaultProps = {
	placeholder: 'Enter Text',
	fontSize: 16
};
export default TextField;
