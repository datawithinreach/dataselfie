import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {createDrawing, deleteDrawing, updateDrawing, makeGetSelectedDrawings} from 'ducks/drawings';
import Style from 'components/Style';
import FileLoader from 'components/FileLoader';
import LayerView from 'containers/LayerView';
import classNames from 'utils/classNames';
import css from './index.css';
import autodraw from 'utils/autodraw';
import penTool from './tools/pen';
import eraserTool from './tools/eraser';
import autodrawTool from './tools/autodraw';
import selectionTool from './tools/selection';
import fillTool from './tools/fill';
import {PaperScope} from 'paper';

import { Picker } from 'emoji-mart';

class DrawingCanvas extends Component {
	constructor(props){
		super(props);
		
		this.state = {
			tool:'pen',
			showStylePanel:false,
			showLayerPanel:false,
			showEmojiPanel:false,
			recognized:[],
			style:{
				color:'#000000',
				width:1,
				opacity:1.0
			},
			dragFile:false
		};
		this.paper = new PaperScope();  // always use this to create anything

		//for auto draw
		this.paths = [];
		this.autodrawn = null;
		

		this.toggleStylePanel = this.toggleStylePanel.bind(this);
		this.toggleEmojiPanel = this.toggleEmojiPanel.bind(this);
		this.toggleLayerPanel = this.toggleLayerPanel.bind(this);
		// this.hideLayerPanel = this.hideLayerPanel.bind(this);

		this.handleChangeTool = this.handleChangeTool.bind(this);
		this.handleStyleUpdate = this.handleStyleUpdate.bind(this);
		this.handleEmojiSelect = this.handleEmojiSelect.bind(this);
		

		this.handleToggleLayer = this.handleToggleLayer.bind(this);
		this.canvasRef = React.createRef();

		this.handleDragEnter = this.handleDragEnter.bind(this);
		this.handleDrop = this.handleDrop.bind(this);
		this.handleDragLeave = this.handleDragLeave.bind(this);

		this.handlePointerDownCanvas = this.handlePointerDownCanvas.bind(this);
		// this.layerMap = {};
	}
	componentWillUnmount(){
		this.paper.clear();
	}
	componentDidMount(){

		// setup 
		this.paper.setup(this.canvasRef.current);

		let {color, stroke,opacity} = this.state.style;
		this.paper.project.currentStyle = {
			strokeColor:color,
			strokeWidth:stroke,
			opacity,
			strokeCap:'round',
			strokeJoin:'round'
		};

		this.setupTools();
		
		this.setupLayer(this.paper, this.props.drawings, this.props.selected);
		
		//when not starting from background (e.g., from preview back to design)
		if (!this.paper.project.layers[this.props.formId]){
			this.handleToggleLayer(this.props.formId);
		}

	}

	componentDidUpdate(prevProps){
		// this is probably called every time & every stroke...TODO: improve!
		if (prevProps.selectedQuestion!=this.props.selectedQuestion){// when question changed
			//reset layer visibility
			let layer = this.paper.project.layers;
			for (let i=0; i<layer.length; i++){
				layer[i].visible = false;
			}
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
		if (prevProps.selected!=this.props.selected || prevProps.drawings!=this.props.drawings){
			// setup  drawings again
			if (this.props.formId!=this.paper.project.activeLayer.name){
				this.paper.project.activeLayer.visible=false;
			}
			
			this.setupLayer(this.paper, this.props.drawings, this.props.selected);
			console.log('selected', this.props.selected);
			this.paper.project.layers[this.props.selected].activate();
			this.paper.project.activeLayer.visible=true;
		}

		// if question changed, reset layer visibility??
	}

	setupLayer(paper, drawings, layerId){
		paper.activate();

		let layer = paper.project.layers[layerId];
		if (!layer){
			layer = new paper.Layer({
				name:layerId,
				project:paper.project,
				data:{id: layerId}
			});
		}
		
		drawings.forEach(d=>{
			if (!layer.children[d.id]){
				layer.importJSON(d.json);
			}            
		});
		//remove deleted
		for (let i=0; i<layer.children.length;i++){
			if (layer.children[i].guide){
				continue;
			}
			if (!drawings.find(d=>d.id==layer.children[i].name)){
				layer.children[i].remove();
			}
		}

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
		selectionTool.create(this.paper, (selected)=>{
			selected.forEach(drawing=>this.props.updateDrawing(drawing.name, drawing));
		});
		fillTool.create(this.paper, (item)=>{
			console.log('fill selected', item);
			this.props.updateDrawing(item.data.id, item);
		});
		console.log('tools', this.paper.tools, this.paper.tool);
		
	}
	handleDragEnter(){
		this.setState({dragFile: true});
	}
	
	handleDrop(e) {
		// console.log('dropped', e.clientX, e.clientY);
		let rect = e.currentTarget.getBoundingClientRect();
		let x = rect.left - e.clientX;
		let y = rect.top - e.clientY;
	
		this.setState({dragFile: false});

		let url = e.dataTransfer.getData('text/html');
		
		if (url.length>0){
			var rex = /src="?([^"\s]+)"?\s*/;
			url = rex.exec(url);
			url = url[1];
			// console.log(url);
			let raster = new this.paper.Raster({
				crossOrigin: 'anonymous',
				source:url,
				position: this.paper.view.center
			});
			raster.onLoad = function() {
				if (raster.width>120){
					raster.height  = 120/raster.width*raster.height;
					raster.width= 120;
				}
				if (raster.height>120){
					raster.width  = 120/raster.height*raster.width;
					raster.height= 120;
				}
			};
		
			
			
		}else if (e.dataTransfer.files.length>=1){
			let file = e.dataTransfer.files[0];

			if (file.size>1000000){// larger than 1 MB
				// this.setState({showInfo:true, infoMessage:'File size greater than 1 MB is currently not supported.'});
				// setTimeout(()=>{
				// 	this.setState({showInfo:false});
				// },5000);
				return;
			}
			if (file.type.match(/image.*/)){
				let reader = new FileReader();			
				reader.onloadend = (e) => {
					console.log(e.target.result);
					new this.paper.Raster({
						crossOrigin: 'anonymous',
						source:e.target.result,
						position: new this.paper.Point(x,y)
					});
					// this.props.createDrawing(this.paper.project.activeLayer.data.id, path);
				};
				reader.readAsDataURL(file);
			}
		}
	}

	handleDragLeave() {
		this.setState({dragFile: false});
	}
	selectSuggestion(icon){
		
		this.paper.project.activeLayer.importSVG(icon, (item)=>{
			item.style = this.paper.project.currentStyle;
			item.strokeWidth = this.paper.project.currentStyle.strokeWidth;
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
	handleEmojiSelect(emoji){
		// console.log('selected', emoji);
		if(emoji.native){
			let textItem = new this.paper.PointText({
				point:this.paper.view.center.add(new this.paper.Point(-32,32)),
				content:emoji.native,
				fontSize:64
			});
			this.props.createDrawing(this.paper.project.activeLayer.data.id, textItem);
		}
		
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
	toggleStylePanel(){
		this.setState({showStylePanel:!this.state.showStylePanel, showLayerPanel:false, showEmojiPanel:false});
	}
	toggleEmojiPanel(){
		this.setState({showEmojiPanel:!this.state.showEmojiPanel, showLayerPanel:false, showStylePanel:false});
	}
	toggleLayerPanel(){
		this.setState({showLayerPanel:!this.state.showLayerPanel, showStylePanel:false, showEmojiPanel:false});
	}
	handlePointerDownCanvas(){
		this.setState({showStylePanel:false, showLayerPanel:false, showEmojiPanel:false});
	}


	render() {
		// let style = this.paper.project? this.paper.project.currentStyle:this.initStyle;
		// console.log('style', style)
		let {selected, selectedText, formId} = this.props;
		let layers = this.paper.project?this.paper.project.layers:null;
		return (
			<div className={css.container}>
				<div className={css.info}><i className="fas fa-paint-brush"></i> &nbsp; 
					{`Draw ${selected==formId? 'a Background': 'for '+selectedText}`}
				</div>
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
						<div className={classNames(css.button,{[css.selectedTool]: this.state.tool=='selection'})} 
							data-tool='selection' 
							onPointerUp={this.handleChangeTool}>
							<i className="flaticon-graphic-design"></i>
						</div>
						<div className={classNames(css.button,{[css.selectedTool]: this.state.tool=='fill'})} 
							data-tool='fill' 
							onPointerUp={this.handleChangeTool}>
							<i className="fas fa-fill"></i>
						</div>
						<div className={css.button} onPointerUp={this.toggleEmojiPanel}>
							<i className="far fa-smile"></i>
						</div>
						<div className={css.button} onPointerUp={this.toggleStylePanel}>
							<i className="fas fa-palette"></i>
						</div>

						<div className={css.button} onPointerUp={this.toggleLayerPanel}>
							<i className="fas fa-layer-group"></i>
						</div>
					</div>

					<div className={css.optionPanel} style={{left:'80px', width:'320px', display:this.state.showEmojiPanel?'flex':'none'}}>
						{/* <div className={classNames(css.button,css.mute)} onPointerUp={this.hideStylePanel}>Close</div> */}
						<Picker 
							onSelect={this.handleEmojiSelect} style={{width:'300px', borderWidth:'0px'}}/>
					</div>
					<div className={css.optionPanel} style={{left:'80px', display:this.state.showStylePanel?'flex':'none'}}>
						{/* <div className={classNames(css.button,css.mute)} onPointerUp={this.hideStylePanel}>Close</div> */}
						<Style color={this.state.style.color}
							stroke={this.state.style.width}
							opacity={this.state.style.opacity}
							onStyleUpdate={this.handleStyleUpdate}/>
					</div>
					<div className={css.optionPanel} style={{left:'80px', display:this.state.showLayerPanel?'flex':'none'}}>
						{/* <div className={classNames(css.button,css.mute)} onPointerUp={this.hideLayerPanel}>Close</div> */}
						<LayerView formId={this.props.formId} onToggleLayer={this.handleToggleLayer} layers={layers} selected={this.props.selected}/>
					</div>

					<FileLoader onDrop={this.handleDrop}
						onDragEnter={this.handleDragEnter}
						onDragLeave={this.handleDragLeave}>
						<canvas ref={this.canvasRef} className={css.canvas} onPointerDown={this.handlePointerDownCanvas}
							style={{ strokeDasharray: this.state.dragFile?'5,5':'none' }}/>
					</FileLoader>
				</div>
			</div>
		);
	}
}

DrawingCanvas.propTypes = {
	formId:PropTypes.string,
	drawings:PropTypes.array,
	allDrawings:PropTypes.array,
	selected:PropTypes.string,
	selectedText:PropTypes.string,
	selectedQuestion:PropTypes.string,
	createDrawing:PropTypes.func,
	updateDrawing:PropTypes.func,
	deleteDrawing:PropTypes.func
};

const getDrawings = makeGetSelectedDrawings();

const mapStateToProps = (state, ownProps) =>{
	let drawings = getDrawings(state, ownProps);

	let selected = ownProps.formId;
	let selectedText = state.forms[selected].title;
	if (state.ui.selectedOption){
		selected = state.ui.selectedOption;
		selectedText = state.options[selected].text;
	}
	console.log('drawings', drawings);
	return {
		drawings,
		allDrawings:Object.values(state.drawings),
		selected,//option or background
		selectedText,
		selectedQuestion:state.ui.selectedQuestion // to reset the visibility
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		...bindActionCreators({
			createDrawing,
			updateDrawing,
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
