import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {createDrawing, deleteDrawing, makeGetSelectedDrawings} from 'ducks/drawings';
import Style from 'components/Style';
import LayerView from 'containers/LayerView';
import classNames from 'utils/classNames';
import css from './index.css';
import autodraw from 'utils/autodraw';
import penTool from './tools/pen';
import eraserTool from './tools/eraser';
import autodrawTool from './tools/autodraw';
import {PaperScope} from 'paper';

class DrawingCanvas extends Component {
	constructor(props){
		super(props);
		
		this.state = {
			tool:'pen',
			showStylePanel:false,
			showLayerPanel:false,
			recognized:[],
			style:{
				color:'#000000',
				width:1,
				opacity:1.0
			}
		};
		this.paper = new PaperScope();  // always use this to create anything

		//for auto draw
		this.paths = [];
		this.autodrawn = null;
		

		this.showStylePanel = this.showStylePanel.bind(this);
		this.hideStylePanel = this.hideStylePanel.bind(this);
		this.showLayerPanel = this.showLayerPanel.bind(this);
		this.hideLayerPanel = this.hideLayerPanel.bind(this);

		this.handleChangeTool = this.handleChangeTool.bind(this);
		this.handleStyleUpdate = this.handleStyleUpdate.bind(this);

		this.handleToggleLayer = this.handleToggleLayer.bind(this);
		this.canvasRef = React.createRef();
		// this.selectSuggestion = this.selectSuggestion.bind(this);
		// this.layerMap = {};
	}
	componentWillUnmount(){
		this.paper.clear();
	}
	componentDidMount(){

		// setup 
		console.log('DrawingCanvas PaperScope', this.paper);
		this.paper.setup(this.canvasRef.current);

		let {color, stroke,opacity} = this.state.style;
		this.paper.project.currentStyle = {
			strokeColor:color,
			strokeWidth:stroke,
			opacity,
			strokeCap:'round'
		};

		this.setupTools();
		
		this.setupLayer(this.paper, this.props.drawings, this.props.selected);

	}

	componentDidUpdate(prevProps){
		console.log('componentDidUpdate', this.props);
		// this is probably called every time & every stroke...TODO: improve!
		if (prevProps.selectedQuestion!=this.props.selectedQuestion){// when question changed
			//reset layer visibility
			let layer = this.paper.project.layers;
			for (let i=0; i<layer.length; i++){
				layer[i].visible = false;
			}
			//except background
			this.paper.project.layers[this.props.formId].visible = true;

			// add new layers if there are new options added
			// this.setupLayer(this.paper, this.props.drawings, this.props.selected);
			// console.log('before:',this.paper.project.layers);
			// // remove layers if the options were removed
			// let getOptions = (questions)=>questions.reduce((acc,q)=>acc.concat(q.options),[]);
			// let options = getOptions(this.props.drawings.questions);
			// let prevOptions = getOptions(prevProps.drawings.questions);

			// for (let i=0; i<prevOptions.length;i++){
			// 	if (!options.find(d=>d.id==prevOptions[i].id)){
			// 		console.log('remove!', prevOptions[i].id);
			// 		this.paper.project.layers[prevOptions[i].id].remove();
			// 	}
			// }

			// prevOptions.filter(po=>!options.find(o=>o.id==po.id))
			// 	.forEach(po=>this.paper.project.layers[po.id].remove());
			// console.log('if (prevProps.drawings!=this.props.drawings){', this.paper.project.layers,  this.props.drawings);
		}
		if (prevProps.selected!=this.props.selected){
			// setup  drawings again
			if (this.props.formId!=this.paper.project.activeLayer.name){
				this.paper.project.activeLayer.visible=false;
			}
			
			this.setupLayer(this.paper, this.props.drawings, this.props.selected);
			this.paper.project.layers[this.props.selected].activate();
			this.paper.project.activeLayer.visible=true;
		}

		// if question changed, reset layer visibility??
	}

	setupLayer(paper, drawings, layerId){
		let createLayer = (id, drawings)=>{
			if (paper.project.layers[id]) return paper.project.layers[id];// return if exists
			
			let layer = new paper.Layer({
				name:id,
				project:paper.project
			});
			drawings.forEach(d=>layer.importJSON(d.json));
			
			layer.data.id = id;
			return layer;
		};
		//background layer
		createLayer(layerId, drawings);
		// add drawings that belong to all items in the form...
		// drawings.questions.forEach(q=>q.options.forEach(option=>createLayer(option)));
		console.log('activeLayer remain the same?', paper.project.activeLayer.name, layerId);
		paper.project.layers[this.props.selected].activate();//activeLayer should remain the same
		console.log('AFTER: activeLayer remain the same?', paper.project.activeLayer.name, layerId);
	}

	setupTools(){
		penTool.create(this.paper, (path)=>{
			this.props.createDrawing(this.paper.project.activeLayer.data.id, path);
		});
		eraserTool.create(this.paper, (removed)=>{
			removed.map(item=>{
				console.log('delete', item.data);
				if (!item.data.parentId) return;
				this.props.deleteDrawing(item.data.id);
			});
		});
		autodrawTool.create(this.paper, (path)=>{
			this.paths.push(path);
			let query = this.paths.map(path=>path.segments.map(seg=>({x:seg.point.x,y:seg.point.y})));
			console.log('query',query);
			autodraw(query).then(results=>{
				console.log('recognized',results);
				this.autodrawn = null;
				this.setState({
					recognized:results
				});				
			});
		});
		console.log('tools', this.paper.tools, this.paper.tool);
		
	}

	selectSuggestion(icon){
		
		this.paper.project.activeLayer.importSVG(icon, (item)=>{
			item.style = this.paper.project.currentStyle;
			// bounds
			if (this.paths.length>0){
				let group = new this.paper.Group({children:this.paths, visible:false});
				item.fitBounds(group.bounds);
				group.remove();
			}else if (this.autodrawn){				
				item.fitBounds(this.autodrawn.bounds);
				// remove previously drawn path
				this.autodrawn.remove();
				this.props.deleteDrawing(this.autodrawn.data.id);
			}
			this.props.createDrawing(this.paper.project.activeLayer.data.id, item);

			this.paths = [];
			this.autodrawn = item;
			console.log('auto drawn', item);
		});
		
	}
	handleToggleLayer(id){
		let layer = this.paper.project.layers[id];
		if (!layer){
			let drawings = this.props.allDrawings.filter(d=>d.parentId==id);
			this.setupLayer(this.paper, drawings, id);
		}else{
			layer.visible = !layer.visible;
		}
		
		//TODO: layer reordering
		this.paper.view.update();//force
		// this.forceUpdate();// necessary?
	}
	handleStyleUpdate(style){
		let {color, stroke,opacity} = style;
		
		this.paper.project.currentStyle = {
			...this.paper.project.currentStyle,
			strokeColor:color,
			strokeWidth:stroke,
			opacity
		};
		this.setState({style});
	}
	clearAutoDrawState(){
		this.paths = [];
		this.autodrawn = null;
		this.setState({
			recognized:[]
		});	
	}
	handleChangeTool(event){
		let toolName = event.currentTarget.dataset.tool;
		this.setState({
			tool:toolName
		});
		this.paper.tools.find(tool=>tool.name==toolName).activate();
		this.clearAutoDrawState();
	}
	showStylePanel(){
		this.setState({showStylePanel:true, showLayerPanel:false});
	}
	showLayerPanel(){
		this.setState({showLayerPanel:true, showStylePanel:false});
	}
	hideStylePanel(){
		this.setState({showStylePanel:false});
	}
	hideLayerPanel(){
		this.setState({showLayerPanel:false});
	}


	render() {
		// let style = this.paper.project? this.paper.project.currentStyle:this.initStyle;
		// console.log('style', style)
		let layers = this.paper.project?this.paper.project.layers:null;
		return (
			<div className={css.canvasContainer}>
				<div className={css.menu}>
					<div className={classNames(css.button,{[css.selectedTool]: this.state.tool=='pen'})} 
						data-tool='pen' 
						onPointerUp={this.handleChangeTool}>
						<i className="fas fa-pencil-alt"></i>
					</div>
					<div className={classNames(css.button,{[css.selectedTool]: this.state.tool=='eraser'})} 
						data-tool='eraser' 
						onPointerUp={this.handleChangeTool}>
						<i className="fas fa-eraser"></i>
					</div>
					<div className={classNames(css.button,{[css.selectedTool]: this.state.tool=='autodraw'})} 
						data-tool='autodraw' 
						onPointerUp={this.handleChangeTool}>
						<i className="fas fa-magic"></i>
					</div>
					<div className={css.button} onPointerUp={this.showStylePanel}>
						<i className="fas fa-palette"></i>
					</div>
					<div className={css.button} onPointerUp={this.showLayerPanel}>
						<i className="flaticon-layers"></i>
					</div>
				</div>
				{this.state.tool=='autodraw' && 
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
		
				<div className={css.optionPanel} style={{left:'140px', display:this.state.showLayerPanel?'flex':'none'}}>
					<div className={classNames(css.button,css.mute)} onPointerUp={this.hideLayerPanel}>Close</div>
					<LayerView onToggleLayer={this.handleToggleLayer} layers={layers}/>
				</div>

				<div className={css.optionPanel} style={{left:'80px', display:this.state.showStylePanel?'flex':'none'}}>
					<div className={classNames(css.button,css.mute)} onPointerUp={this.hideStylePanel}>Close</div>
					<Style color={this.state.style.color}
						stroke={this.state.style.width}
						opacity={this.state.style.opacity}
						onStyleUpdate={this.handleStyleUpdate}/>
				</div>
				
				<canvas ref={this.canvasRef} className={css.canvas}/>
				
			</div>
		);
	}
}

DrawingCanvas.propTypes = {
	formId:PropTypes.string,
	drawings:PropTypes.array,// contains drawings in a nested structure
	allDrawings:PropTypes.array,
	selected:PropTypes.string,
	selectedQuestion:PropTypes.string,
	createDrawing:PropTypes.func,
	deleteDrawing:PropTypes.func
};

const getDrawings = makeGetSelectedDrawings();

const mapStateToProps = (state, ownProps) =>{
	let drawings = getDrawings(state, ownProps);
	console.log('drawings', drawings);
	return {
		drawings,
		allDrawings:Object.values(state.drawings),
		selected:state.ui.selectedOption?state.ui.selectedOption:ownProps.formId,//option or background
		selectedQuestion:state.ui.selectedQuestion // to reset the visibility
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
