import React, { Component } from 'react';
import PropTypes from 'prop-types';
import css from './index.css';
class RadioGroup extends Component {
	render() {
		return (
			<div className={css.group} style={this.props.style}>
				{this.props.items.map((item,i)=>
					<label key={i} className={css.item}>{item.text}
						<input type="radio" name="radio"
							value={item.id}
							checked={this.props.checked==item.id}
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
	checked:PropTypes.string
};

export default RadioGroup;