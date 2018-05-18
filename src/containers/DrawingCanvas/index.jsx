import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import css from './index.css';
class DrawingCanvas extends React.Component {
	render() {
		return (
			<div className={css.canvasContainer}>
				{this.props.answer}
				<canvas className={css.canvas}>
				</canvas>
			</div>
		);
	}
}

DrawingCanvas.propTypes = {
	formId:PropTypes.string,
	itemId:PropTypes.string,
	answer:PropTypes.string,
	answerIdx:PropTypes.number
};

const mapStateToProps = (state) =>{
	return state;
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DrawingCanvas);
