import React from 'react';
import PropTypes from 'prop-types';
import css from './index.css';


export default class Button extends React.Component {
	constructor(props){
		super(props);
		this.handlePointerDown = this.handlePointerDown.bind(this);
	}
	handlePointerDown(){
		if (this.props.onPointerDown){
			this.props.onPointerDown(arguments);
		}
		if (this.props.link){
			location.href=this.props.href;
		}
	}
	render() {
		let {stretch, outlined, filled, children} = this.props;
		let otherProps = {...this.props};
		Object.keys(Button.propTypes).forEach(k=>delete otherProps[k]);
        
		let style={};
		if (stretch){
			style.width = '100%';
			style.marginLeft = style.marginRight = '0px';
		}
		if (outlined){
			style.border='2px solid #212121';
		}else if(filled){
			style.border='2px solid #212121';
			style.backgroundColor = '#212121';
			style.color = 'white';
		}
		return (
			<button className={[this.props.className, css.button, filled?css.filled:''].join(' ')} {...otherProps}
				onPointerDown = {this.handlePointerDown}
				style={{...style, ...this.props.style}}>
				{children}
			</button>
		);
	}
}

Button.propTypes = {
	className:PropTypes.string,
	style:PropTypes.string,
	label:PropTypes.string,
	stretch:PropTypes.bool,
	children:PropTypes.node.isRequired,
	outlined:PropTypes.bool,
	filled:PropTypes.bool,
	link:PropTypes.bool,
	onPointerDown:PropTypes.func,
	href:PropTypes.string,
};
Button.defaultProps = {
	outlined:false,
	filled:false,
	stretch:false,
	link:false,
	href:'/'
};

