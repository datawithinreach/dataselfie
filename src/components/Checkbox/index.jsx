import React, {Component} from 'react';
import PropTypes from 'prop-types';
import css from './index.css';

class TextField extends Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			checked:this.props.defaultChecked
		};
	}

	handleChange(e) {
		if (this.props.onChange) {
			this.props.onChange(e);
		}
		this.setState({checked: e.target.checked});
	}
	render() {
		let otherProps = {...this.props};
		Object.keys(TextField.propTypes).forEach(k=>delete otherProps[k]);
        
		return (
			<label className={css.container}>
				<input className={css.checkbox} type="checkbox" 
					{...otherProps}
					onChange={this.handleChange} checked={this.state.checked}/>
				<span className={css.checkmark}></span>
				<span className={css.label}>{this.props.label}</span>
			</label>
	
		);
	}

}

TextField.propTypes = {
	onChange: PropTypes.func,
	label:PropTypes.string,
	defaultChecked:PropTypes.bool,
};

TextField.defaultProps = {
	label:''
};
export default TextField;
