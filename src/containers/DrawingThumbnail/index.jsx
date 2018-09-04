import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import css from './index.css';
import {makeGetDrawings} from 'ducks/drawings';
import {PaperScope} from 'paper';
const propTypes = {
	className:PropTypes.string,
	selected:PropTypes.bool,
	drawings:PropTypes.array,
	width:PropTypes.number,
	height:PropTypes.number,
	selectable:PropTypes.bool,
	fitted:PropTypes.bool,
};

const defaultProps = {
	width:50,
	height:50,
	selected:false,
	fitted:false
};

export class DrawingThumbnail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.paper = new PaperScope();
		this.canvasRef = React.createRef();
	}
	componentDidMount(){
		this.paper.setup(this.canvasRef.current);
		this.draw(this.paper, this.props.drawings);

		let layer = this.paper.project.activeLayer;
		if (this.props.fitted){
			let pos = layer.position;
			let center = this.paper.view.center;
			// console.log(pos, center);
			layer.translate(-pos.x+center.x, -pos.y+center.y);
			let rectangle = this.paper.project.view.bounds;
			let strokeBounds = layer.strokeBounds;
			let itemRatio = strokeBounds.height / strokeBounds.width,
				rectRatio = rectangle.height / rectangle.width,
				scale= itemRatio<rectRatio? rectangle.width / strokeBounds.width
					: rectangle.height / strokeBounds.height;
			// console.log(scale);
			this.paper.view.scale(scale);
		}else{
			this.paper.view.scale(this.props.width/450, new this.paper.Point(0,0));
		}

	}
	componentDidUpdate(prevProps){
		if (prevProps.drawings!=this.props.drawings){
			this.draw(this.paper, this.props.drawings);
		}
	}
	draw(paper, drawings){        
		// paper.project.activeLayer.clear();
		paper.project.clear();
		// new this.paper.Layer({
		// 	project:this.paper.project
		// });
		paper.activate();
		let layer = paper.project.activeLayer;
		// for (let i=0; i<layer.children.length;i++){
		// 	if (!drawings.find(d=>d.id==layer.children[i].name)){
		// 		layer.children[i].remove();
		// 	}
		// }
		
		drawings.forEach(d=>{
			if (!layer.children[d.id]){
				layer.importJSON(d.json);
			}            
		});

		// layer.children.filter(child=>!drawings.find(d=>d.id=child.name)).forEach(child=>child.remove());
        
		// console.log(paper.project.currentStyle, paper.project);
	}
	render() {
		let {selected,className} = this.props;
		let otherProps = {...this.props};
		Object.keys(DrawingThumbnail.propTypes).forEach(k=>delete otherProps[k]);
		
		return (
			<canvas ref={this.canvasRef} 
				className={[className, css.thumbnail, selected?css.selected:''].join(' ')} 
				width={this.props.width} height={this.props.height}
				{...otherProps}/>
		);
	}
}

DrawingThumbnail.propTypes = propTypes;
DrawingThumbnail.defaultProps = defaultProps;


// const getOptions = makeGetOptions();
const makeMapStateToProps = () => {
	const getDrawings = makeGetDrawings();        
	const mapStateToProps = (state, ownProps) => {
		let drawings = getDrawings(state, ownProps);
		return {
			drawings,
		};
	};
	return mapStateToProps;
};

const mapDispatchToProps = () => { 	
	return {};
};

const mergeProps = (stateProps, dispatchProps, ownProps)=> {
	let props = {...ownProps};
	delete props.parentId;
	delete props.parentIds;
	return Object.assign({}, props, stateProps, dispatchProps);
};

export default connect(makeMapStateToProps, mapDispatchToProps, mergeProps)(DrawingThumbnail);
