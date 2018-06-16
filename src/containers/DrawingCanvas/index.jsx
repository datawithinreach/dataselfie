import React,{Component,Fragment} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {createDrawing, deleteDrawing} from 'ducks/drawings';
import Style from 'components/Style';
import classNames from 'utils/classNames';
import css from './index.css';
import autodraw from 'utils/autodraw';
import paper, { Layer } from 'paper';
class DrawingCanvas extends Component {
	constructor(props){
		super(props);
		
		this.state = {
			penOption:{
				color:'#000000',
				stroke:1,
				opacity:1.0
			},
			showStyle:false,
			showLayer:false,
			mode:'pen',
			recognized:[],
			layers:[]
		};
		this.paths = [];
	
		this.handleStyleUpdate = this.handleStyleUpdate.bind(this);
		this.showStyle = this.showStyle.bind(this);
		this.hideStyle = this.hideStyle.bind(this);
		this.showLayer = this.showLayer.bind(this);
		this.hideLayer = this.hideLayer.bind(this);
		this.handleChangeMode = this.handleChangeMode.bind(this);
		this.toggleLayer = this.toggleLayer.bind(this);
		this.canvasRef = React.createRef();
		// this.selectSuggestion = this.selectSuggestion.bind(this);
		this.layerMap = {};

	}
	componentWillUnmount(){
		paper.clear();
		console.log('DrawingCanvas clear paper', paper);
	}
	componentDidMount(){

		// initialize canvas
		console.log('DrawingCanvas initialize paper', paper);
		paper.setup(this.canvasRef.current);
		this.initialize();
		
		// TODO: separate into an independent file?
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
				// TODO: delegate this style variable to currentStyle
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
						// remove items only in the active layer
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
							console.log('delete', item.data);
							this.props.deleteDrawing(item.data.parentId, item.data.id);
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
								this.autodrawn = null;
								this.setState({
									recognized:results
								});
							});
						}else{// add directly only if not auto-draw
							console.log('adding drawing to ', paper.project.activeLayer);
							this.props.createDrawing(paper.project.activeLayer.data.id, path);
							// if (this.props.choiceId){
							// 	
							// }
						}
					}
					path = null;
				}
			}
		});

		// penTool.activate();
		// // Draw the view now:
		// paper.view.draw();

	}

	componentDidUpdate(prevProps){
		// when switched to a new question, clear canvas
		// if (prevProps.itemId!=this.props.itemId ||
		// 	prevProps.choiceId!=this.props.choiceId){
		// 	paper.project.clear();
		// 	this.props.drawings.forEach(d=>{
		// 		paper.project.activeLayer.importJSON(d.json);				
		// 	});
		// }
		// item changed, reset visible states
		if (prevProps.item!=this.props.item){
			for (let layer of Object.values(this.layerMap)){
				layer.visible=false;
			}
		}
		
		this.initialize();

	
	}
	initialize(){
		let {form, item, choice} = this.props;
		// update canvas based on 

		// add drawings that belong to this form
		if (!this.layerMap[form.id]){
			let bgr = new Layer({visible:false});
			form.drawings.forEach(d=>bgr.importJSON(d.json));
			this.layerMap[form.id] = bgr;
		}
		// update text
		this.layerMap[form.id].name = form.title;
		this.layerMap[form.id].data = form;
		
		// add drawings that belong to all items in the form...
		form.items.forEach(item=>{
			if (!this.layerMap[item.id]){
				// drawings in an item
				let itemBgr = new Layer({visible:false});
				item.drawings.forEach(d=>itemBgr.importJSON(d.json));
				this.layerMap[item.id] = itemBgr;
			}
			this.layerMap[item.id].name = item.question;
			this.layerMap[item.id].data = item;
			
			// drawings of choices
			item.choices.forEach(choice=>{
				if (!this.layerMap[choice.id]){
					let vis = new Layer({visible:false});
					choice.drawings.forEach(d=>vis.importJSON(d.json));
					this.layerMap[choice.id] = vis;
				}
				this.layerMap[choice.id].name = choice.text;
				this.layerMap[choice.id].data = choice;
				
			});	

			//TODO: handle deleted choices
		});
		//TODO: handle deleted items
		
		// only make this choice 
		console.log(choice);
		if (choice){			
			console.log('activate choice layer');
			this.layerMap[item.id].visible = true;	
			this.layerMap[choice.id].visible = true;
			this.layerMap[choice.id].activate();
			
		}else if (item){
			console.log('activate item layer');
			this.layerMap[item.id].visible = true;	
			this.layerMap[item.id].activate();
		}else{
			console.log('activate form layer',this.layerMap[form.id]);
			this.layerMap[form.id].visible = true;	
			this.layerMap[form.id].activate();
		}
		console.log('current active layer', paper.project.activeLayer);
		console.log('layerMap', this.layerMap);
	}
	selectSuggestion(icon){
		
		paper.project.activeLayer.importSVG(icon, (item)=>{
			console.log('added', item);
			// item.position  = new paper.Point(225, 225);
			// item.scaling = 0.2;
	
			item.strokeWidth = this.state.penOption.stroke;
			item.strokeColor = this.state.penOption.color;
			item.opacity = this.state.penOption.opacity;
			
			// bounds
			if (this.paths.length>0){
				let group = new paper.Group({children:this.paths, visible:false});
				item.fitBounds(group.bounds);
				group.remove();
			}else if (this.autodrawn){				
				item.fitBounds(this.autodrawn.bounds);
				// remove previously drawn path
				this.autodrawn.remove();
				// if (this.props.choiceId){
				// 	this.props.createDrawing(this.props.choiceId, this.autodrawn);
				this.props.deleteDrawing(this.autodrawn.data.parentId, this.autodrawn.data.id);
				// }
				
			}
			this.props.createDrawing(paper.project.activeLayer.data.id, item);

			this.paths = [];
			this.autodrawn = item;
		});
		
	}
	toggleLayer(event){
		let layerId = event.currentTarget.dataset.id;
		this.layerMap[layerId].visible = !this.layerMap[layerId].visible;
		paper.view.update();//force
		this.forceUpdate();
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
	showStyle(){
		this.setState({showStyle:true, showLayer:false});
	}
	showLayer(){
		this.setState({showLayer:true, showStyle:false});
	}
	hideStyle(){
		this.setState({showStyle:false});
	}
	hideLayer(){
		this.setState({showLayer:false});
	}
	visible(id){
		return this.layerMap[id]&&this.layerMap[id].visible;
	}
	active(id){
		return paper.project.activeLayer&& paper.project.activeLayer.data.id==id;
	}

	render() {
		let {form} = this.props;
		
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
					<div className={css.button} onMouseUp={this.showStyle}>
						<i className="fas fa-palette"></i>
					</div>
					<div className={css.button} onMouseUp={this.showLayer}>
						<i className="flaticon-layers"></i>
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
		
				{this.state.showLayer&&
					<div className={css.optionPanel}>
						<div className={classNames(css.button,css.mute)} onPointerUp={this.hideLayer}>Close</div>
						<div className={css.layers}>
							<div className={classNames(css.layer,{[css.invisible]:!this.visible(form.id), [css.selected]:this.active(form.id)})} 
								onPointerUp={this.toggleLayer} data-id={this.props.form.id}>
								<i 	
									className={classNames('fas', {
										'fa-eye':this.visible(form.id),
										'fa-eye-slash':!this.visible(form.id),
									})} 
								></i>
								<label>{this.props.form.title}</label>
							</div>							
							{this.props.form.items.map((item,i)=>
								<Fragment key={item.id}>
									<div className={classNames(css.layer,{[css.invisible]:!this.visible(item.id), [css.selected]:this.active(item.id)})} 
										onPointerUp={this.toggleLayer} data-id={item.id}>
										<i 
											className={classNames('fas', {
												'fa-eye':this.visible(item.id),
												'fa-eye-slash':!this.visible(item.id),
											})}
										></i>
										<label>{`Q${i+1}. ${item.question}`}</label>
									</div>
									{item.choices.map((choice,i)=>
										<div key={choice.id} 
											className={classNames(css.layer, css.indent,{[css.invisible]:!this.visible(choice.id), [css.selected]:this.active(choice.id)})}
											onPointerUp={this.toggleLayer} data-id={choice.id}>
											<i 
												className={classNames('fas', {
													'fa-eye':this.visible(choice.id),
													'fa-eye-slash':!this.visible(choice.id)
												})}
											></i>
											<label>{`${i+1}. ${choice.text}`}</label>
										</div>
									)}
								</Fragment>
							)}
						</div>
						
					</div>
				}
				{this.state.showStyle&&
					<div className={css.optionPanel}>
						<div className={classNames(css.button,css.mute)} onPointerUp={this.hideStyle}>Close</div>
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
	// formId:PropTypes.string,
	// itemId:PropTypes.string,
	// choiceId:PropTypes.string,
	// choiceText:PropTypes.string,

	form:PropTypes.object,
	item:PropTypes.object,
	choice:PropTypes.object,
	createDrawing:PropTypes.func,
	deleteDrawing:PropTypes.func
};

const mapStateToProps = (state, ownProps) =>{
	let form = state.forms[ownProps.formId];
	console.log(ownProps.formId);
	
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
	
	form = {
		...form,
		items:form.items.map(getItem), 
		drawings:form.drawings.map(id=>state.drawings[id])
	};
	console.log(form);
	let item = getItem(ownProps.itemId),
		choice = getChoice(ownProps.choiceId); //current item & choice if any
	// let item = state.choices[ownProps.itemId];
	// let choice = state.choices[ownProps.choiceId];
	// let drawings = choice?choice.drawings.map(did=>state.drawings[did]):[];
	// console.log(drawings);
	return {
		form,
		item,
		choice
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
