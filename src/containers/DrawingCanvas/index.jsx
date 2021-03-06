import React,{Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {createDrawing, deleteDrawing, updateDrawing, makeGetSelectedDrawings} from 'ducks/drawings';
import {makeGetOptions} from 'ducks/options';
import Style from 'components/Style';
import FileLoader from 'components/FileLoader';
import Button from 'components/Button';
import Checkbox from 'components/Checkbox';
import LayerView from 'containers/LayerView';
import classNames from 'utils/classNames';
import css from './index.css';
import autodraw from 'utils/autodraw';
import uniqueId from 'utils/uniqueId';
import penTool from './tools/pen';
import eraserTool from './tools/eraser';
import autodrawTool from './tools/autodraw';
import selectionTool from './tools/selection';
import fillTool from './tools/fill';
import {PaperScope} from 'paper';
import {scaleOrdinal, scaleLinear} from 'd3-scale';

import { Picker } from 'emoji-mart';

let defaultPalette = ['#F44336', '#9C27B0',  '#3F51B5', '#03A9F4', '#009688', '#8BC34A',
	'#FFEB3B', '#FF9800', '#795548','#E91E63', '#673AB7','#2196F3',
	'#00BCD4','#4CAF50','#CDDC39', '#FFC107',  '#FF5722'];
let colorMap = scaleOrdinal().range(defaultPalette);
let sizeMap = scaleLinear().range([0.5, 1.5]);
class DrawingCanvas extends Component {
	constructor(props){
		super(props);
		
		this.state = {
			tool:'pen',
			showStylePanel:false,
			showLayerPanel:false,
			showEmojiPanel:false,
			showEditPanel:false,
			recognized:[],
			style:{
				color:'#000000',
				width:3,
				opacity:1.0
			},
			dragFile:false,
			selectedDrawings:null
		};
		this.paper = new PaperScope();  // always use this to create anything
		//for auto draw
		this.paths = [];
		this.autodrawn = null;
		

		this.toggleStylePanel = this.toggleStylePanel.bind(this);
		this.toggleEmojiPanel = this.toggleEmojiPanel.bind(this);
		this.toggleLayerPanel = this.toggleLayerPanel.bind(this);
		this.toggleEditPanel = this.toggleEditPanel.bind(this);
		// this.hideLayerPanel = this.hideLayerPanel.bind(this);

		this.handleChangeTool = this.handleChangeTool.bind(this);
		this.handleStyleUpdate = this.handleStyleUpdate.bind(this);
		this.handleEmojiSelect = this.handleEmojiSelect.bind(this);
		

		this.handleToggleLayer = this.handleToggleLayer.bind(this);
		this.canvasRef = React.createRef();

		this.handleDragEnter = this.handleDragEnter.bind(this);
		this.handleDrop = this.handleDrop.bind(this);
		this.handleDragLeave = this.handleDragLeave.bind(this);

		this.closeOptionPanel = this.closeOptionPanel.bind(this);

		this.handlePropagate = this.handlePropagate.bind(this);
		this.handleSizeEncoding = this.handleSizeEncoding.bind(this);
		this.handleColorEncoding = this.handleColorEncoding.bind(this);
		
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
		// console.log('prevProps', prevProps);
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
			if (prevProps.selected!=this.props.selected){
				for (let i=0; i<this.paper.project.layers.length; i++){
					if (this.props.formId!=this.paper.project.layers[i].name){
						this.paper.project.layers[i].visible=false;
					}
				}
			}

			
			
			this.setupLayer(this.paper, this.props.drawings, this.props.selected);
			// console.log('selected', this.props.selected);
			this.paper.project.layers[this.props.selected].activate();
			this.paper.project.activeLayer.visible=true;
		}

		// if question changed, reset layer visibility??
		this.paper.view.update();

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
		// console.log('activeLayer remain the same?', paper.project.activeLayer.name, layerId);
		paper.project.layers[this.props.selected].activate();//activeLayer should remain the same
		// console.log('AFTER: activeLayer remain the same?', paper.project.activeLayer.name, layerId);
	}
	getDrawing(layerId, drawingId){
		let layer = this.paper.project.layers[layerId];
		if (!layer){
			return null;
		}
		if (layer.children[drawingId]){
			return layer.children[drawingId];
		}
		return null;
	}
	setupTools(){
		penTool.create(this.paper, (path)=>{
			this.props.createDrawing(this.paper.project.activeLayer.data.id, path);
		});
		eraserTool.create(this.paper, (removed)=>{
			removed.map(drawing=>{
				// console.log('delete', drawing.data);
				if (!drawing.data.parentId) return;
				// find siblings if there is any
				let layer = this.paper.project.activeLayer;
				this.props.options.forEach((option)=>{// for each option drawings
					if (option.id==layer.data.id){//skip current layer
						return;
					}
					//find the drawing for each option
					let drawings = this.props.allDrawings.filter(d=>d.parentId==option.id);
					drawings.forEach(d=>{
						let sibling = this.getDrawing(option.id, d.id);
						// console.log('--------------', sibling.data, drawing.data);
						let remove = sibling?false:true;
						sibling = sibling?sibling:layer.importJSON(d.json);
						// if the drawing is in the same group
						if (sibling && sibling.data.groupId &&
								sibling.data.groupId==drawing.data.groupId){
							this.props.deleteDrawing(sibling.name, sibling);
						}
						if (remove){
							sibling.remove();
						}
						
					});
				});
				this.props.deleteDrawing(drawing.data.id);
			});
		});
		autodrawTool.create(this.paper, (path)=>{
			this.paths.push(path);
			let query = this.paths.map(path=>path.segments.map(seg=>({x:seg.point.x,y:seg.point.y})));
			// console.log('query',query);
			autodraw(query).then(results=>{
				console.log('recognized',results);
				this.autodrawn = null;
				this.setState({
					recognized:results
				});				
			});
		});
		selectionTool.create(this.paper, (selected, mode, sx, sy,p)=>{
			selected.forEach(drawing=>{
				//find groups if necessary
				let layer = this.paper.project.activeLayer;
				this.props.options.forEach((option)=>{// for each option drawings
					
					// if (option.id==layer.data.id){//skip current layer
					// 	console.log('skip', layer.data.id);
					// 	return;
					// }
					// console.log('option:',option.id);
					//find the drawing for each option
					let drawings = this.props.allDrawings.filter(d=>d.parentId==option.id);
					drawings.forEach(d=>{
						let sibling = this.getDrawing(option.id, d.id);
						let remove = sibling?false:true;
						sibling = sibling?sibling:layer.importJSON(d.json);
						// console.log('potential',sibling.data);
						// if the drawing is in the same group
						if (sibling && sibling.data.groupId &&
							sibling.data.groupId==drawing.data.groupId){
							// console.log('----- same group',sibling);
							sibling.position = drawing.position;
							if (mode=='scale' && drawing.id!=sibling.id){
								// console.log('sx,sy,p',sx,sy,p);
								sibling.scale(sx,sy, p);
								// sibling.scaling = drawing.scaling;
							}
							this.props.updateDrawing(sibling.name, sibling);
						}
						if (remove){
							sibling.remove();
						}
						
					});
				});
				
				this.props.updateDrawing(drawing.name, drawing);
			});
		}, (selectedDrawings)=>{
			// console.log('selected Items', selectedDrawings);
			this.setState({selectedDrawings});
		});
		fillTool.create(this.paper, (item)=>{
			// console.log('fill selected', item);
			this.props.updateDrawing(item.data.id, item);
		});
		// console.log('tools', this.paper.tools, this.paper.tool);
		
	}
	handleDragEnter(){
		this.setState({dragFile: true});
	}
	
	handleDrop(e) {
		// console.log('dropped', e.clientX, e.clientY);
		// let rect = e.currentTarget.getBoundingClientRect();
		// let x = rect.left - e.clientX;
		// let y = rect.top - e.clientY;
	
		this.setState({dragFile: false});

		let resize = raster=>{
			let factor = raster.width/(this.paper.view.size.width/2);
			if (factor>1){
				raster.scale(1/factor);
			}
			factor = raster.height/(this.paper.view.size.height/2);
			if (factor>1){
				raster.scale(1/factor);
			}
		};

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

			raster.onLoad = ()=> {
				resize(raster);
				raster.onLoad = null;
			};
			this.props.createDrawing(this.paper.project.activeLayer.data.id, raster);
		
			
			
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
					// console.log(e.target.result);
					let raster = new this.paper.Raster({
						crossOrigin: 'anonymous',
						source:e.target.result,
						position: this.paper.view.center
					});
					raster.onLoad = ()=> {
						resize(raster);
						raster.onLoad = null;
					};
		
					this.props.createDrawing(this.paper.project.activeLayer.data.id, raster);
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
			// console.log('auto drawn', item);
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
		let {color, stroke, opacity} = style;
		// console.log('opacity', opacity);
		this.paper.project.currentStyle = {
			...this.paper.project.currentStyle,
			strokeColor:color,
			strokeWidth:stroke,
			opacity
		};
		//HACK: style does not have opacity property
		this.paper.project.currentStyle.opacity=opacity;
		this.setState({style});
		this.closeOptionPanel();
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
			this.closeOptionPanel();
			this.paper.view.update();
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
		this.closeOptionPanel();
		this.paper.tools.find(tool=>tool.name==toolName).activate();
		// if (toolName)
		this.clearAutoDrawState();
	}
	toggleStylePanel(){
		this.setState({showStylePanel:!this.state.showStylePanel, showLayerPanel:false, showEmojiPanel:false, showEditPanel:false});
	}
	toggleEmojiPanel(){
		this.setState({showEmojiPanel:!this.state.showEmojiPanel, showLayerPanel:false, showStylePanel:false, showEditPanel:false});
	}
	toggleLayerPanel(){
		this.setState({showLayerPanel:!this.state.showLayerPanel, showStylePanel:false, showEmojiPanel:false, showEditPanel:false});
	}
	toggleEditPanel(){
		this.setState({showLayerPanel:false, showStylePanel:false, showEmojiPanel:false, showEditPanel:!this.showEditPanel});
	}
	closeOptionPanel(){
		this.setState({showStylePanel:false, showLayerPanel:false, showEmojiPanel:false, showEditPanel:false});
	}
	
	handlePropagate(){
		let {selectedDrawings=null} = this.state;
		if (!selectedDrawings || selectedDrawings.length==0){//just in case
			return;
		}
		if (!this.props.selectedQuestion || this.props.options.length==0){
			return;
		}
		// console.log('propagate to ', this.props.options);
		// duplicate the shapes
		selectedDrawings.filter(d=>!d.data.groupId).forEach(d=>{
			let groupId = uniqueId('group');
			d.data.groupId = groupId;
			this.props.options
				.forEach(option=>{
					// only for siblings
					if (this.paper.project.activeLayer.data.id==option.id){
						return;
					}
					let copy = d.clone();
					copy.data.groupId = groupId;
					this.props.createDrawing(option.id, copy);
				});
			
		});
	}
	handleSizeEncoding(event){
		console.log('--handleSizeEncoding--',event.target.checked);
		//find groups if necessary
		let layer = this.paper.project.activeLayer;
		sizeMap.domain([0,this.props.options.length]);

		// for each drawing
		this.state.selectedDrawings.filter(d=>!d.data.group).forEach(drawing=>{
			// find siblings and resize 
			let siblings = [];
			this.props.options.forEach((option)=>{// for each option drawings
				//find the drawing for each option
				let drawings = this.props.allDrawings.filter(d=>d.parentId==option.id);
				drawings.forEach(d=>{
					let sibling = this.getDrawing(option.id, d.id);
					let remove = sibling?false:true;
					sibling = sibling?sibling:layer.importJSON(d.json);
					if (remove){
						sibling.data.remove = true;
					}
					siblings.push(sibling);
				});
			});
			// if the drawing is in the same group
			siblings.forEach((sibling,i)=>{
				if (sibling && sibling.data.groupId &&
					sibling.data.groupId==drawing.data.groupId){
					if (event.target.checked){
						sibling.scale(sizeMap(i));
						sibling.data.sizeEncoding = true;
					}else{
						sibling.data.sizeEncoding = false;
						sibling.fitBounds(drawing.bounds);
					}
					this.props.updateDrawing(sibling.name, sibling);
				}

				if (sibling.data.remove){
					sibling.remove();
				}
			});
			

		});
	}
	handleColorEncoding(event){
		console.log('--handleColorEncoding--',event.target.checked);
		//find groups if necessary
		let layer = this.paper.project.activeLayer;
	
		// for each drawing
		this.state.selectedDrawings.filter(d=>!d.data.group).forEach(drawing=>{
			// find siblings and resize 
			this.props.options.forEach((option,i)=>{// for each option drawings
				//find the drawing for each option
				let drawings = this.props.allDrawings.filter(d=>d.parentId==option.id);
				drawings.forEach(d=>{
					let sibling = this.getDrawing(option.id, d.id);
					let remove = sibling?false:true;
					sibling = sibling?sibling:layer.importJSON(d.json);
					// if the drawing is in the same group
					if (sibling && sibling.data.groupId &&
						sibling.data.groupId==drawing.data.groupId){
						sibling.position = drawing.position;
						if (event.target.checked){
							sibling.strokeColor = sibling.fillColor = colorMap(i);
							sibling.data.colorEncoding = true;
						}else{
							sibling.strokeColor = sibling.fillColor = drawing.fillColor;
							sibling.data.colorEncoding = false;
						}
						this.props.updateDrawing(sibling.name, sibling);
					}
					if (remove){
						sibling.remove();
					}
				});
			});
		});
	}
	render() {
		// let style = this.paper.project? this.paper.project.currentStyle:this.initStyle;
		// console.log('style', style)
		let {selected, selectedText, formId} = this.props;
		let {style} = this.state;
		return (
			<div className={css.container}>
				<div className={css.info}><i className="fas fa-paint-brush"></i> &nbsp; 
					{`Draw ${selected==formId? 'a Background': 'for '+selectedText}`}
				</div>
				<div className={css.submenu}>
					{this.state.recognized.length>0 &&
						<React.Fragment>
							<p>Do you mean: </p>
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
						</React.Fragment>
						
					}
					{this.state.selectedDrawings && this.props.selectedQuestion && 
						this.state.selectedDrawings.some(d=>!d.data.groupId) &&
						<Button style={{marginLeft:'70px'}} outlined onPointerUp={this.handlePropagate}>
							Propagate
						</Button>
					}
					{this.state.selectedDrawings && this.props.selectedQuestion && 
						this.state.selectedDrawings.every(d=>d.data.groupId) &&
						<Button style={{marginLeft:'70px'}} outlined onPointerUp={this.toggleEditPanel}>
							Edit
						</Button>
					}
				</div>		
				<div className={css.canvasContainer}>
					<div className={css.menu}>
						<Button className={this.state.tool=='pen'?css.selectedTool:''} outlined
							data-tool='pen' 
							onPointerUp={this.handleChangeTool}>
							<i className="fas fa-pencil-alt"></i>
						</Button>
						<Button className={this.state.tool=='eraser'?css.selectedTool:''} outlined
							data-tool='eraser' 
							onPointerUp={this.handleChangeTool}>
							<i className="fas fa-eraser"></i>
						</Button>
						<Button className={this.state.tool=='autodraw'?css.selectedTool:''} outlined
							data-tool='autodraw' 
							onPointerUp={this.handleChangeTool}>
							<i className="fas fa-magic"></i>
						</Button>
						<Button className={this.state.tool=='selection'?css.selectedTool:''} outlined
							data-tool='selection' 
							onPointerUp={this.handleChangeTool}>
							<i className="flaticon-graphic-design"></i>
						</Button>
						<Button className={this.state.tool=='fill'?css.selectedTool:''} outlined
							data-tool='fill' 
							onPointerUp={this.handleChangeTool}>
							<i className="fas fa-fill"></i>
						</Button>
						<Button  onPointerUp={this.toggleEmojiPanel} outlined>
							<i className="far fa-smile"></i>
						</Button>
						<Button  onPointerUp={this.toggleStylePanel} outlined>
							<i style={{color:style.color, opacity:style.opacity}}className="fas fa-palette"></i>
						</Button>

						<Button  onPointerUp={this.toggleLayerPanel} outlined>
							<i className="fas fa-layer-group"></i>
						</Button>
					</div>

					<div className={css.optionPanel} style={{left:'80px', width:'320px', display:this.state.showEmojiPanel?'flex':'none'}}>
						{/* <div className={classNames(css.button,css.mute)} onPointerUp={this.closeOptionPanel}>Close</div> */}
						<Picker emojiSize={32} native={true}
							onSelect={this.handleEmojiSelect} style={{width:'300px', borderWidth:'0px'}}/>
					</div>
					{this.state.selectedDrawings && <div className={css.optionPanel} style={{left:'80px', width:'200px', display:this.state.showEditPanel?'flex':'none'}}>
						<div className={classNames(css.button,css.mute)} onPointerUp={this.closeOptionPanel}>Close</div>
						<div className={css.editPanel}>
							<Checkbox 
								style={{margin:'5px'}}
								checked={this.state.selectedDrawings[0].data.sizeEncoding}
								label={'Size Variation'}
								onChange={this.handleSizeEncoding}/>
							<Checkbox 
								style={{margin:'5px'}}
								checked={this.state.selectedDrawings[0].data.colorEncoding}
								label={'Color Variation'}
								onChange={this.handleColorEncoding}/>
						</div>
					</div>}
					<div className={css.optionPanel} style={{left:'80px', display:this.state.showStylePanel?'flex':'none'}}>
						<div className={classNames(css.button,css.mute)} onPointerUp={this.closeOptionPanel}>Close</div>
						<Style color={this.state.style.color}
							stroke={this.state.style.width}
							opacity={this.state.style.opacity}
							onStyleUpdate={this.handleStyleUpdate}/>
					</div>
					<div className={css.optionPanel} style={{left:'80px', display:this.state.showLayerPanel?'flex':'none'}}>
						<div className={classNames(css.button,css.mute)} onPointerUp={this.closeOptionPanel}>Close</div>
						<LayerView formId={this.props.formId} onToggleLayer={this.handleToggleLayer} selected={this.props.selected}/>
					</div>

					<FileLoader onDrop={this.handleDrop}
						onDragEnter={this.handleDragEnter}
						onDragLeave={this.handleDragLeave}>
						<canvas touch-action="none" ref={this.canvasRef} className={css.canvas} onPointerDown={this.closeOptionPanel}
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
	options:PropTypes.array,
	createDrawing:PropTypes.func,
	updateDrawing:PropTypes.func,
	deleteDrawing:PropTypes.func
};

const getDrawings = makeGetSelectedDrawings();
const getOptions = makeGetOptions();
const mapStateToProps = (state, ownProps) =>{
	let drawings = getDrawings(state, ownProps);

	let selected = ownProps.formId;
	let selectedText = state.forms[selected].title;
	if (state.ui.selectedOption){
		selected = state.ui.selectedOption;
		selectedText = state.options[selected].text;
	}
	let options = getOptions(state, {questionId:state.ui.selectedQuestion});
	// console.log('drawings', drawings);
	return {
		drawings,
		allDrawings:Object.values(state.drawings),
		selected,//option or background
		selectedText,
		options,
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
