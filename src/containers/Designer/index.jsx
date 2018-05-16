import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import css from './index.css';
import TextField from 'components/TextField';
class Designer extends Component {
	constructor(props){
		super(props);

		this.state = {
			curStep: -1
		};
		this.changeStep = this.changeStep.bind(this);
	}
	changeStep(){

	}
	renderQuestion(){
		if (this.state.curStep==-1){
			// render the title and responseId field?
			return <TextField placeholder='Enter Title' fontSize={42}/>;
		}else{
			// let item = this.props.items[this.curStep];
			// render current question
			return <TextField placeholder='Enter Question'/>;

		}

	}
	renderEncoding(){

	}
	render() {
		return (
			<div>				
				<div className={css.progress}>
					<div className={css.start}>
						<div className={css.marker} data-step={0} onMouseUp={this.changeStep}/>
					</div>
					<div className={css.step}>
						<div className={css.bar}/>
						<div className={css.marker}/>
					</div>
					<div className={[css.step, css.current].join(' ')}>
						<div className={css.bar}/>
						<div className={css.marker}/>
					</div>
					<div className={css.end}>
						<div className={css.bar}/>
						<div className={css.marker}>
						+
						</div>
					</div>

				</div>
				<div className={css.designArea}>
					<div className={css.question}>
						{this.renderQuestion()}
					</div>
					<div className={css.encoding}>
						Encoding
					</div>
				</div>
			</div>
		);
	}
}

Designer.propTypes = {
	formId:PropTypes.string,
	items:PropTypes.array,

};

const mapStateToProps = (state, ownProps) => {
	let formId = ownProps.formId;

	// collect items and encodings (use selectors)


	console.log('ownProps.match', ownProps.match);
	let form = state.forms[formId];
	return {
		...form,
		items:[],
		encodings:{}
	};
};

// const mapDispatchToProps = (dispatch) => { 	return
// {bindActionCreators(uiActions, dispatch)}; };

export default connect(mapStateToProps)(Designer);
