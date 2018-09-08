import React from 'react';
import PropTypes from 'prop-types';
import css from './index.css';
const propTypes = {
	label:PropTypes.string,
	name:PropTypes.string,
	checked:PropTypes.bool,
	onChange:PropTypes.func,
};

const defaultProps = {};

export default class Switch extends React.Component {
	constructor(props) {
		super(props);
		// this.handleChange = this.handleChange.bind(this);
		// this.state = {
		// 	checked:props.defaultChecked?props.defaultChecked:false
		// };
	}
	// componentDidUpdate(prevProps){
	// 	if ()
	// }
	// handleChange(e) {
	// 	if (this.props.onChange) {
	// 		this.props.onChange(e);
	// 	}
	// 	this.setState({checked: e.target.checked});
	// }

	render() {
		let otherProps = {...this.props};
		Object.keys(Switch.propTypes).forEach(k=>delete otherProps[k]);

		return (
			<div className={css.container} {...otherProps}>
				<label className={css.switch}>
					<input  className={css.checkbox} type="checkbox" name={this.props.name}
						onChange={this.props.onChange} checked={this.props.checked?this.props.checked:false}/>
					<span className={css.slider}></span>
				</label>
				<span className={css.label}>{this.props.label}</span>

			</div>

		);
	}
}

Switch.propTypes = propTypes;
Switch.defaultProps = defaultProps;