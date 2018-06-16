import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createResponse} from 'ducks/responses';
import css from './index.css';
import paper from 'paper';
class Analyzer extends Component {
	constructor(props){
		super(props);
		this.state = {
		};
		this.canvasList = React.createRef();
		// paper.setup(this.canvasRef.current);
		// this.tool = new paper.Tool();
		// this.tool.on({
		// 	mousedown: (event)=>{
		// 		console.log('event click');
		// 		let pidx = event.event.currentTarget.dataset.index;
		// 		paper.projects[pidx].activate();
		// 		var myCircle = new paper.Path.Circle(event.point, 10);
		// 		myCircle.fillColor = 'black';
		// 	}
			
		// });
	}
	
	componentWillUnmount(){
		console.log('will unmount');
		paper.clear();
		console.log(paper);
	}
	componentDidMount(){
		console.log('component mount');

		// this.canvasListRef.current.children.forEach(canvas=>{
		
		// });

		// draw each form response
		// this.tool.activate();
		this.props.responses.map((response,i)=>{
			let canvas = document.getElementById(response.id);
			console.log('canvas element', i, canvas);
			// paper = new paper.PaperScope();
			paper.setup(canvas);
			
			paper.view.scale(0.5, new paper.Point(0,0));
			response.background.map(d=>paper.project.activeLayer.importJSON(d.json));
			response.encodings.map(enc=>enc.drawings.map(d=>{
				paper.project.activeLayer.importJSON(d.json);
			}));
		});

		// draw the legend
		this.props.legend.map(item=>item.choices.map(choice=>{
			let canvas = document.getElementById(choice.id);
			paper.setup(canvas);
			item.drawings.map(d=>paper.project.activeLayer.importJSON(d.json));
			choice.drawings.map(d=>paper.project.activeLayer.importJSON(d.json));
			let pos = paper.project.activeLayer.position;
			let center = paper.view.center;
			paper.project.activeLayer.translate(-pos.x+center.x, -pos.y+center.y);
			let rectangle = paper.project.view.bounds;
			let strokeBounds = paper.project.activeLayer.strokeBounds;
			let itemRatio = strokeBounds.height / strokeBounds.width,
				rectRatio = rectangle.height / rectangle.width,
				scale= itemRatio<rectRatio? rectangle.width / strokeBounds.width
					: rectangle.height / strokeBounds.height;
			paper.view.scale(scale);
		}));
		console.log('paper', paper);
		
	}

	render() {
		
		let {legend, responses} = this.props;
		return (
			<div>
				<div className={css.header}> Legend </div>
				<div className={css.legend} ref={this.legend}>
					{legend.map(item=>
						<div key={item.id} className={css.item}>
							<div className={css.question}>{item.question}</div>
							{item.choices.map((choice,i)=>
								<div key={choice.id}>
									<div className={css.choice}>
										<canvas id={choice.id} className={css.canvas}/>
										<div className={css.text}>{i+1}. {choice.text}</div>
									</div>									
								</div>
							)}

						</div>
					)}
				</div>
				<div className={css.header}> Responses </div>
				<div className={css.responses} ref={this.canvasList}>
					{responses.map((response,i)=>
						<div key={response.id} className={css.response}>
							<canvas id={response.id} data-index={i} className={css.canvas}/>
						</div>
					)}
				</div>
			</div>
		);
	}
}

Analyzer.propTypes = {
	formId:PropTypes.string,
	legend:PropTypes.array,
	responses:PropTypes.array,
};

const mapStateToProps = (state, ownProps) => {
	let formId = ownProps.formId;
	let form = state.forms[formId];
	
	// collect all visual mappings
	let legend = form.items.map(id=>{
		let item = state.items[id];

		let choices = item.choices.map(cid=>{
			let choice = state.choices[cid];
			let drawings = choice.drawings.map(did=>state.drawings[did]);
			return {
				...choice,
				drawings
			};
		});
		return {
			...item,
			drawings:item.drawings.map(did=>state.drawings[did]),
			choices
		};
	});
	//collect all form responses and visual encodings
	let responses = form.responses.map(rid=>{// Object.values(state.responses).filter(res=>res.formId==form.id).map(response=>{
		let response = state.responses[rid];
		
		let background = state.forms[response.formId].drawings.map(did=>state.drawings[did]);
		let encodings = form.items.map(itemId=>{
			let item = state.items[itemId];
			let choiceId = response.response[itemId];
			let drawings = item.drawings.map(did=>state.drawings[did])
				.concat(state.choices[choiceId].drawings.map(did=>state.drawings[did]));
			
			return {
				itemId,
				choiceId,
				drawings
			};
		});
		return {
			...response,
			background,
			identifier: response.id,
			encodings
		};
		
	});
	console.log('legend, responses', legend, responses);
	return {
		...form,
		legend,
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
