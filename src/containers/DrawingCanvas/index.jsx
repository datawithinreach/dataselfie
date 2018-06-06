import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {createDrawing, deleteDrawing} from 'ducks/drawings';
// import { select, event } from 'd3-selection';
// import {line,curveCardinal} from 'd3-shape';
// import {drag} from 'd3-drag';
// import intersect from 'utils/intersect';
import Style from 'components/Style';
import classNames from 'utils/classNames';
import css from './index.css';
import autodraw from 'utils/autodraw';
import paper from 'paper';
class DrawingCanvas extends React.Component {
	constructor(props){
		super(props);
		
		this.state = {
			penOption:{
				color:'#000000',
				stroke:1,
				opacity:1.0
			},
			showPenOptionMenu:false,
			mode:'pen',
			recognized:[]
		};
		this.paths = [];
		// this.drag = drag()
		// 	.container(function() {// initiating element = lasso target
		// 		return this;
		// 	})
		// 	// .filter(()=>event.pointerType == 'pen')
		// 	.on('start', this.drawStart.bind(this));
		// this.line = line().curve(curveCardinal.tension(0.5));//.curve(curveBasis);	

		this.handleStyleUpdate = this.handleStyleUpdate.bind(this);
		this.togglePenOption = this.togglePenOption.bind(this);
		this.handleChangeMode = this.handleChangeMode.bind(this);

		this.canvasRef = React.createRef();
		// this.addSuggestion = this.addSuggestion.bind(this);

	}
	componentDidMount(){
		// select(this.container)//cover the whole svg area
		// 	.call(this.drag);
		console.log('paper',paper);
		paper.setup(this.canvasRef.current);
		this.props.drawings.forEach(d=>{
			paper.project.activeLayer.importJSON(d.json);
		});
		let penTool = new paper.Tool();
		let path=null;
		penTool.on({
			activate: function(){
				console.log('activate', this.name);
			},
			deactivate:function(){
				console.log('activate', this.name);
			},
			mousedrag:(e)=>{
				let {color,stroke,opacity} = this.state.penOption;
				let {mode} = this.state;
				if (!path){
					
					path = new paper.Path({
						segments: [e.point],
						strokeWidth: mode=='eraser'? 2:stroke,
						strokeColor: mode=='eraser'? '#9e9e9e':color,
						strokeCap:'round',
						opacity: mode=='eraser'? 1: opacity,
						dashArray:mode=='eraser'?[5,5]:[]
					});
				}else{
					path.add(e.point);
				}
			},
			mouseup:()=>{
				if (path){
					path.simplify();

					//add to redux state
					

					if (this.state.mode=='eraser'){
						let removed = [];
						paper.project.activeLayer.children.forEach(child=>{
							if (path==child){
								return;
							}							

							if (child.intersects(path)){
								removed.push(child);
							}
							if (child instanceof paper.Group &&
								child.getItems().some(d=>d.intersects(path))){
								removed.push(child);
							}
						});
						removed.forEach(item=>item.remove());
						path.remove();
					}else{
						if (this.props.choiceId){
							let id = this.props.createDrawing(this.props.choiceId, {
								json:path.exportJSON()
							});
							path.data.id = id;
						}
						if (this.state.mode=='autodraw'){
							this.paths.push(path);
							let query = this.paths.map(path=>path.segments.map(seg=>({x:seg.point.x,y:seg.point.y})));
							console.log('query',query);
							autodraw(query).then(results=>{
								console.log('recognized',results);
								this.setState({
									recognized:results
								});
							});
						}
					}
					
					path = null;
					

				}
			}
		});

		penTool.activate();
		// Draw the view now:
		paper.view.draw();

	}
	addSuggestion(icon){
		let group = new paper.Group({children:this.paths, visible:false});
		if (this.autodrawn){
			// console.log('exists!', this.autodrawn);
			this.autodrawn.remove();
		}
		paper.project.activeLayer.importSVG(icon, (item)=>{
			// console.log('added', item);
			// item.position  = new paper.Point(225, 225);
			// item.scaling = 0.2;
			item.strokeWidth = this.state.penOption.stroke;
			item.strokeColor = this.state.penOption.color;
			item.opacity = this.state.penOption.opacity;
			item.fitBounds(group.bounds);
			group.remove();
			this.autodrawn = item;
		});
	}
	// erase(d){
	// 	// delete drawings 
	// 	this.props.drawings.forEach(drawing=>{
	// 		// console.log(drawing.path);
	// 		if (intersect(drawing.path,d)){
	// 			this.props.deleteDrawing(this.props.choiceId, drawing.id);
	// 		}
	// 	});		
	// }
	handleStyleUpdate(style){
		console.log('style', style);
		this.setState({penOption:{...style}});
	}
	handleChangeMode(event){
		this.setState({
			mode:event.currentTarget.dataset.mode,
			recognized:[]
		});
		
		this.paths = [];
		this.autodrawn = null;

	}
	togglePenOption(){
		this.setState({showPenOptionMenu:!this.state.showPenOptionMenu});

	}
	render() {
		return (
			<div className={css.canvasContainer}>
				{/* {this.props.choiceText!='' && 
				<div className={css.label}>
					{this.props.choiceText}
				</div>} */}
				<div className={css.menu}>
					<div className={classNames(css.button,{[css.selectedMode]: this.state.mode=='pen'})} 
						data-mode='pen' 
						onMouseUp={this.handleChangeMode}>
						<i className="fas fa-pencil-alt"></i>
					</div>
					<div className={classNames(css.button,{[css.selectedMode]: this.state.mode=='eraser'})} 
						data-mode='eraser' 
						onMouseUp={this.handleChangeMode}>
						<i className="fas fa-eraser"></i>
					</div>
					<div className={classNames(css.button,{[css.selectedMode]: this.state.mode=='autodraw'})} 
						data-mode='autodraw' 
						onMouseUp={this.handleChangeMode}>
						<i className="fas fa-magic"></i>
					</div>
					<div className={css.button} onMouseUp={this.togglePenOption}>
						<i className="fas fa-palette"></i>
					</div>
				</div>
				{this.state.mode=='autodraw' && 
					<div className={css.suggestions}>
						{this.state.recognized.map(shape=>
							shape.icons.map((icon,i)=>
								<figure key={[shape.name,i].join('-')} className={css.suggestion}
									onPointerUp={this.addSuggestion.bind(this, icon)}>
									<img src={icon} alt={shape.name} title={shape.name}/>
								</figure>
							)
							
						)}
					</div>						
				}
				{this.state.showPenOptionMenu&&
					<div className={css.penOption}>
						<Style color={this.state.penOption.color}
							stroke={this.state.penOption.stroke}
							opacity={this.state.penOption.opacity}
							onStyleUpdate={this.handleStyleUpdate}/>
					</div>
				}
				<canvas ref={this.canvasRef} className={css.canvas}/>
				{/* <svg className={css.canvas} 
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
				</svg> */}
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
			// createDrawing,
			deleteDrawing
		}, dispatch),
		createDrawing: (choiceId, attrs)=>{
			let action = createDrawing(choiceId, attrs);
			dispatch(action);
			return action.id;
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawingCanvas);
