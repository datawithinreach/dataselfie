import React, {Component} from 'react';
import PropTypes from 'prop-types';
import css from './index.css';

class Checkbox extends Component {
	constructor(props) {
		super(props);
		// this.handleChange = this.handleChange.bind(this);
		// this.state = {
		// 	checked:this.props.defaultChecked
		// };
	}

	// handleChange(e) {
	// 	if (this.props.onChange) {
	// 		this.props.onChange(e, this.props.data);
	// 	}
	// 	this.setState({checked: e.target.checked});
	// }
	render() {
		let otherProps = {...this.props};
		Object.keys(Checkbox.propTypes).forEach(k=>delete otherProps[k]);
        
		return (
			<label className={css.container} {...otherProps}>
				<input className={css.checkbox} type="checkbox" 
					name={this.props.name}
					onChange={this.props.onChange} checked={this.props.checked?this.props.checked:false}/>
				<span className={css.checkmark}></span>
				<span className={css.label}>{this.props.label}</span>
			</label>
	
		);
	}

}

Checkbox.propTypes = {
	onChange: PropTypes.func,
	label:PropTypes.string,
	name:PropTypes.string,
	checked:PropTypes.bool
};

Checkbox.defaultProps = {
	label:''
};
export default Checkbox;
