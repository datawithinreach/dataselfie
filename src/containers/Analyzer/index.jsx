import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createResponse} from 'ducks/responses';
import css from './index.css';
import paper, { Layer } from 'paper';
class Analyzer extends Component {
	constructor(props){
		super(props);
		this.state = {
		};
		
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
		this.showChoice = this.showChoice.bind(this);
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

		this.props.legend.items.map(item=>item.choices.map(choice=>{
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
		let canvas = document.getElementById(this.props.legend.id);
		paper.setup(canvas);
		this.props.legend.drawings.map(d=>paper.project.activeLayer.importJSON(d.json));
		paper.view.scale(0.5, new paper.Point(0,0));
	}
	showChoice(e){
		let id = e.currentTarget.dataset.id;
		if (this.layer){
			this.layer.remove();
			this.layer = null;
		}
		this.props.legend.items.map(item=>item.choices.map(choice=>{
			if (choice.id==id){
				this.layer = new Layer();
				this.layer.activate();
				item.drawings.map(d=>paper.project.activeLayer.importJSON(d.json));
				choice.drawings.map(d=>paper.project.activeLayer.importJSON(d.json));
			}
		}));
	}

	render() {
		
		let {legend, responses} = this.props;
		return (
			<div>
				<div className={css.header}> Legend </div>
				<div className={css.legend} ref={this.legend}>
					<canvas id={legend.id} className={css.canvas}/>
					{legend.items.map((item,i)=>
						<div key={item.id} className={css.item}>
							<div className={css.question}>{`Q${i+1}. ${item.question}`}</div>
							{item.choices.map((choice,i)=>
								<div key={choice.id}>
									<div className={css.choice}>
										<canvas id={choice.id} className={css.thumbCanvas}/>
										<div className={css.text}
											onPointerUp={this.showChoice}
											data-id={choice.id}>
											{`${i+1}. ${choice.text}`}
										</div>
									</div>									
								</div>
							)}

						</div>
					)}
				</div>
				<div className={css.header}> Responses </div>
				<div className={css.responses}>
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
	legend:PropTypes.object,
	responses:PropTypes.array,
};

const mapStateToProps = (state, ownProps) => {
	let form = state.forms[ownProps.formId];
	
	// move this to selectors
	let getChoice = (id)=>{
		if (!id){
			return null;
		}
		let choice = state.choices[id];
		let drawings = choice.drawings.map(id=>state.drawings[id]);
		return {
			...choice,
			drawings
		};
	};
	let getItem = (id)=>{
		if (!id){
			return null;
		}
		let item = state.items[id];
		let drawings = item.drawings.map(id=>state.drawings[id]);
		let choices = item.choices.map(getChoice);

		return {
			...item,
			choices,
			drawings
		};
	};
	
	let legend = {
		...form,
		items:form.items.map(getItem), 
		drawings:form.drawings.map(id=>state.drawings[id])
	};
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
