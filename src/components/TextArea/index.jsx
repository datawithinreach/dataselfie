import React, {Component} from 'react';
import PropTypes from 'prop-types';
import css from './index.css';

class TextArea extends Component {
	constructor(props) {
		super(props);
		this.state = {
			height: 25
		};
		this.handleChange = this.handleChange.bind(this);
		// this.handleKeyPress = this.handleKeyPress.bind(this);
	}
	// handleKeyPress(e){
	// 	console.log(e);
	// 	if (e.key=='Enter'){
	//
	// 		this.setState({height:this.state.height+20});
	// 	}
	// }
	handleChange(e) {
		let lineLength = e.target.value.split(/\r*\n/).length;

		this.setState({height:25+(lineLength-1)*(this.props.fontSize)});
		if (this.props.onChange) {
			this.props.onChange(e);
		}
	}
	render() {

		return (
			<div className={css.textArea}>
				<textarea placeholder={this.props.placeholder}
					onChange={this.handleChange}
					// onKeyPress={this.handleKeyPress}
					style={{
						fontSize:this.props.fontSize+'px',
						paddingBottom: Math.round(this.props.fontSize/3.5)+'px',
						height: this.state.height+'px'
					}}
				/>
			</div>
		);
	}

}

TextArea.propTypes = {
	placeholder: PropTypes.string,
	onChange: PropTypes.func,
	fontSize: PropTypes.number
};

TextArea.defaultProps = {
	placeholder: 'Enter Text',
	fontSize: 18
};
export default TextArea;
