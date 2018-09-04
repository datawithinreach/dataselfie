import React from 'react';
import PropTypes from 'prop-types';
import css from './index.css';
const propTypes = {
	label:PropTypes.string,
	defaultChecked:PropTypes.bool,
	onChange:PropTypes.func,
};

const defaultProps = {};

export default class Switch extends React.Component {
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
		Object.keys(Switch.propTypes).forEach(k=>delete otherProps[k]);

		return (
			<div className={css.container} {...otherProps}>
				<label className={css.switch}>
					<input  className={css.checkbox} type="checkbox" 
						{...otherProps}
						onChange={this.handleChange} checked={this.state.checked}/>
					<span className={css.slider}></span>
				</label>
				<span className={css.label}>{this.props.label}</span>

			</div>

		);
	}
}

Switch.propTypes = propTypes;
Switch.defaultProps = defaultProps;