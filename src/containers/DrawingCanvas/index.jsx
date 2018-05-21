import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {createDrawing, deleteDrawing} from 'ducks/drawings';
import { select, event } from 'd3-selection';
import {line,curveCardinal} from 'd3-shape';
import {drag} from 'd3-drag';
import intersect from 'utils/intersect';
import Style from 'components/Style';
import css from './index.css';
class DrawingCanvas extends React.Component {
	constructor(props){
		super(props);
		
		this.state = {
			penOption:{
				color:'#000000',
				stroke:1,
				opacity:1.0
			}
		};
		this.drag = drag()
			.container(function() {// initiating element = lasso target
				return this;
			})
			// .filter(()=>event.pointerType == 'pen')
			.on('start', this.drawStart.bind(this));
		this.line = line().curve(curveCardinal.tension(0.5));//.curve(curveBasis);	

		this.handleStyleUpdate = this.handleStyleUpdate.bind(this);

	}
	componentDidMount(){
		select(this.container)//cover the whole svg area
			.call(this.drag);
	}
	drawStart() {
		let erasing = event.sourceEvent.buttons==32;
		
		let g = select(this.container);

		// let {x,y,k} = this.props.zoom;
		// let t = zoomIdentity.translate(x,y).scale(k);
		var x0 = event.x,// t.invertX(event.x),
			y0 = event.y,//t.invertY(event.y),
			d = [[x0, y0],[x0, y0]],
			active = g.append('path')
				.attr('class', erasing? css.eraser : css.drawing)
				.attr('stroke', this.state.penOption.color)
				.attr('stroke-width', this.state.penOption.stroke)
				.attr('stroke-opacity', this.state.penOption.opacity)
				.datum(d);

		event.on('drag.draw', () => {// only for this drag gesture
			var x1 = event.x,//t.invertX(event.x),
				y1 = event.y,//t.invertY(event.y),
				dx = x1 - x0,
				dy = y1 - y0;

			if (dx * dx + dy * dy > 0) {
				d.push([
					x0 = x1,
					y0 = y1
				]);
			} else {
				d[d.length - 1] = [x1, y1];
			}
			active.attr('d', this.line);
		});
		event.on('end.draw', ()=>{
			if (d.length<1) return;// requires at least a line
			if (erasing){
				this.erase(d);
			}else{
				this.add(d);
			}
			active.remove();
		});
	}
	add(d){
		if (this.props.choiceId){
			this.props.createDrawing(this.props.choiceId, {
				path:d,
				...this.state.penOption
			});
		}
		
	}
	erase(d){
		// delete drawings 
		this.props.drawings.forEach(drawing=>{
			if (!intersect(drawing.path,d)){
				this.props.deleteDrawing(this.props.choiceId, drawing.id);
			}
		});		
	}
	handleStyleUpdate(style){
		console.log('style', style);
		this.setState({penOption:{...style}});
	}
	render() {
		return (
			<div className={css.canvasContainer}>
				{this.props.choiceText!='' && 
				<div className={css.label}>
					{this.props.choiceText}
				</div>}
				<Style color={this.state.penOption.color}
					stroke={this.state.penOption.color}
					opacity={this.state.penOption.color}
					onStyleUpdate={this.handleStyleUpdate}/>
				<svg className={css.canvas} 
					ref={node=>this.container=node}
				>
					{this.props.drawings.map((drawing,i)=>(
						<path key={i} className={css.drawing} 
							d={this.line(drawing.path)} 
							stroke={drawing.color}
							strokeWidth={drawing.stroke}
							strokeOpacity={drawing.opacity}
						/>)
					)}
				</svg>
			</div>
		);
	}
}

DrawingCanvas.propTypes = {
	formId:PropTypes.string,
	itemId:PropTypes.string,
	choiceId:PropTypes.string,
	choiceText:PropTypes.string,
	drawings:PropTypes.array,
	createDrawing:PropTypes.func,
	deleteDrawing:PropTypes.func
};

const mapStateToProps = (state, ownProps) =>{
	let choice = state.choices[ownProps.choiceId];
	let drawings = choice?choice.drawings.map(did=>state.drawings[did]):[];
	console.log(drawings);
	return {
		choiceText:choice?choice.text:'',
		drawings
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		...bindActionCreators({
			createDrawing,
			deleteDrawing
		}, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawingCanvas);
