import React from 'react';
import PropTypes from 'prop-types';
import css from './index.css';


export default class Button extends React.Component {
	render() {
		let otherProps = {...this.props};
		Object.keys(Button.propTypes).forEach(k=>delete otherProps[k]);
        
		let style={};
		if (this.props.stretch){
			style.width = '100%';
			style.marginLeft = style.marginRight = '0px';
		}
		return (
			<button className={css.button} {...otherProps}
				style={style}>
				{this.props.label}
			</button>
		);
	}
}

Button.propTypes = {
	label:PropTypes.string,
	stretch:PropTypes.bool,
};

