import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createResponse} from 'ducks/responses';
import Legend from 'containers/Legend';
import ResponseThumbnail from 'containers/ResponseThumbnail';
import {makeGetResponses} from 'ducks/responses';
import css from './index.css';
class ResultView extends Component {
	constructor(props){
		super(props);

		this.state={
			selected:null
		};
	}
	selectResponse(selected,e){
		e.stopPropagation();
		this.setState({selected});
	}
	

	render() {
		
		let {formId, title, responses} = this.props;
		return (
			<div>
				
				<div className={css.header}>Legend</div>
				<div className={css.title}>{title}</div>
				<Legend formId={formId}/>
				<div className={css.header}>Responses</div>
				<div className={css.responses} onPointerUp={this.selectResponse.bind(this,null)}>
					{responses.map(response=>(
						<ResponseThumbnail key={response.id} selected={this.state.selected==response.id} responseId={response.id} onPointerUp={this.selectResponse.bind(this,response.id)}/>	
					))}
				</div>
				
				
			</div>
		);
	}
}

ResultView.propTypes = {
	formId:PropTypes.string,
	title:PropTypes.string,
	responses:PropTypes.array,
};
ResultView.defaultProps = {
	responses:[]
};

const getResponses = makeGetResponses();
const mapStateToProps = (state, ownProps) => {
	let form = state.forms[ownProps.formId];
	let responses = getResponses(state, ownProps);
	// responses = Object.values(state.responses).filter(d=>d.formId==ownProps.formId);
	// console.log('responses', responses, state.responses);
	return {
		...form,
		responses,
	};
};

const mapDispatchToProps = (dispatch) => { 	
	return bindActionCreators({
		createResponse
	}, dispatch);
};

export default connect(mapStateToProps,mapDispatchToProps)(ResultView);
