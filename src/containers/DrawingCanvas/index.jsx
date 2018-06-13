import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {createDrawing, deleteDrawing} from 'ducks/drawings';
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
	
		this.handleStyleUpdate = this.handleStyleUpdate.bind(this);
		this.togglePenOption = this.togglePenOption.bind(this);
		this.handleChangeMode = this.handleChangeMode.bind(this);

		this.canvasRef = React.createRef();
		// this.selectSuggestion = this.selectSuggestion.bind(this);

	}
	componentDidMount(){
		// initialize canvas
		paper.setup(this.canvasRef.current);
		
		// populate
		console.log(this.props.drawings);
		this.props.drawings.forEach(d=>{
			paper.project.activeLayer.importJSON(d.json);
		});
		// TODO: separate into multiple tools
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
						removed.map(item=>{
							this.props.deleteDrawing(this.props.choiceId, item.data.id);
						});
						removed.forEach(item=>item.remove());
						path.remove();
					}else{

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
						}else{// add directly only if not auto-draw
							if (this.props.choiceId){
								this.props.createDrawing(this.props.choiceId, path);
							}
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
	componentDidUpdate(prevProps){
		// when switched to a new question, clear canvas
		if (prevProps.itemId!=this.props.itemId){
			paper.project.clear();
			this.props.drawings.forEach(d=>{
				paper.project.activeLayer.importJSON(d.json);				
			});
		}
	
	}
	selectSuggestion(icon){
		let group = new paper.Group({children:this.paths, visible:false});
		if (this.autodrawn){
			// console.log('exists!', this.autodrawn);
			this.autodrawn.remove();
		}
		paper.project.activeLayer.importSVG(icon, (item)=>{
			console.log('added', item);
			// item.position  = new paper.Point(225, 225);
			// item.scaling = 0.2;
			item.strokeWidth = this.state.penOption.stroke;
			item.strokeColor = this.state.penOption.color;
			item.opacity = this.state.penOption.opacity;
			item.fitBounds(group.bounds);
			group.remove();
			this.paths = [];
			this.autodrawn = item;
		});
		
	}
	handleStyleUpdate(style){
		console.log('style', style);
		this.setState({penOption:{...style}});
	}
	clearAutoDrawState(){
		this.paths = [];
		this.autodrawn = null;
	}
	handleChangeMode(event){
		this.setState({
			mode:event.currentTarget.dataset.mode,
			recognized:[]
		});	
		this.clearAutoDrawState();
	}
	togglePenOption(){
		this.setState({showPenOptionMenu:!this.state.showPenOptionMenu});

	}
	render() {
		return (
			<div className={css.canvasContainer}>
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
						{this.state.recognized.length>0 &&
							<p>Do you mean: </p>
						}
						<div className={css.thumbs}>
							{this.state.recognized.map(shape=>
								shape.icons.map((icon,i)=>
									<figure key={[shape.name,i].join('-')} className={css.suggestion}
										onPointerUp={this.selectSuggestion.bind(this, icon)}>
										<img src={icon} alt={shape.name} title={shape.name}/>
									</figure>
								)							
							)}
						</div>
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
			createDrawing,
			deleteDrawing
		}, dispatch)//,
		// createDrawing: (choiceId, attrs)=>{
		// 	let action = createDrawing(choiceId, attrs);
		// 	dispatch(action);
		// 	return action.id;
		// }
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawingCanvas);
