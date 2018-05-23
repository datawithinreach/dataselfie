import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createResponse} from 'ducks/responses';
import {line,curveCardinal} from 'd3-shape';
import css from './index.css';


class Analyzer extends Component {
	constructor(props){
		super(props);
		this.state = {
		};
		this.line = line().curve(curveCardinal.tension(0.5));//.curve(curveBasis);	
	}
	

	render() {
		
		let {responses} = this.props;
		return (
			<div className={css.responses}>
				{responses.map(response=>
					<div key={response.id} className={css.response}>
						<svg className={css.canvas}
						>
							<g transform={`scale(${1/2})`}>
								{response.encodings.map(enc=>enc.drawings.map(drawing=>(
									<path key={drawing.id} className={css.drawing} 
										d={this.line(drawing.path)} 
										stroke={drawing.color}
										strokeWidth={drawing.stroke}
										strokeOpacity={drawing.opacity}
									/>)
								))}
							</g>
						</svg>
					</div>
				)}
			</div>
		);
	}
}

Analyzer.propTypes = {
	formId:PropTypes.string,
	responses:PropTypes.array,
};

const mapStateToProps = (state, ownProps) => {
	let formId = ownProps.formId;
	let form = state.forms[formId];
	let responses = form.responses.map(rid=>{// Object.values(state.responses).filter(res=>res.formId==form.id).map(response=>{
		let response = state.responses[rid];
		
		
		let encodings = form.items.map(itemId=>{
			let choiceId = response.response[itemId];
			let drawings = state.choices[choiceId].drawings.map(did=>state.drawings[did]);
			return {
				itemId,
				choiceId,
				drawings
			};
		});
		return {
			...response,
			identifier: response.id,
			encodings
		};
		
	});
	console.log('responses', responses);
	return {
		...form,
		responses,
		drawings:state.drawings
	};
};

const mapDispatchToProps = (dispatch) => { 	
	return bindActionCreators({
		createResponse
	}, dispatch);
};

export default connect(mapStateToProps,mapDispatchToProps)(Analyzer);
