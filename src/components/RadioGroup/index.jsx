import React, { Component } from 'react';
import PropTypes from 'prop-types';
import css from './index.css';
class RadioGroup extends Component {
	render() {
		// console.log(this.props.checked);
		let otherProps = {...this.props};
		Object.keys(RadioGroup.propTypes).forEach(k=>delete otherProps[k]);
		return (
			<div className={css.group} style={{...this.props.style, display:this.props.horizontal?'flex':'block'}}
				{...otherProps}>
				{this.props.items.map((item,i)=>
					<label key={i} className={css.item}>{this.props.getLabel(item)}
						<input type="radio" name={this.props.name}
							value={this.props.getValue(item)}
							checked={this.props.checked==this.props.getValue(item)}
							onChange={this.props.onChange}/>
						<span className={css.checkmark}></span>
					</label>
				)}
			</div>
		);
	}
}

RadioGroup.propTypes = {
	items:PropTypes.array,
	style:PropTypes.object,
	onChange:PropTypes.func,
	checked:PropTypes.string,
	getLabel:PropTypes.func,
	getValue:PropTypes.func,
	horizontal:PropTypes.bool,
	name:PropTypes.string,
};
RadioGroup.defaultProps = {
	getLabel: d=>d.text,
	getValue: d=>d.id,
	horizontal:false,
	name:'radio'
};

export default RadioGroup;