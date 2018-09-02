import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import css from './index.css';
import {makeGetDrawings} from 'ducks/drawings';
import {PaperScope} from 'paper';
const propTypes = {
	parentId:PropTypes.string,
	selected:PropTypes.bool,
	drawings:PropTypes.array,
	width:PropTypes.number,
	height:PropTypes.number,
};

const defaultProps = {
	width:50,
	height:50
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
		this.paper.view.scale(this.props.width/450, new this.paper.Point(0,0));
	}
	componentDidUpdate(prevProps){
		if (prevProps.drawings!=this.props.drawings){
			this.draw(this.paper, this.props.drawings);
		}
	}
	draw(paper, drawings){        
		// paper.project.activeLayer.clear();
		let layer = paper.project.activeLayer;
		drawings.forEach(d=>{
			if (!layer.children[d.id]){
				// console.log('new drawing!');
				layer.importJSON(d.json);
			}            
		});
		for (let i=0; i<layer.children.length;i++){
			if (!drawings.find(d=>d.id==layer.children[i].name)){
				layer.children[i].remove();
			}
		}
		// layer.children.filter(child=>!drawings.find(d=>d.id=child.name)).forEach(child=>child.remove());
        
		// console.log(paper.project.currentStyle, paper.project);
	}
	render() {
		let {selected} = this.props;
		// console.log('selected', selected);
		let otherProps = {...this.props};
		Object.keys(DrawingThumbnail.propTypes).forEach(k=>delete otherProps[k]);

		return (
			<canvas ref={this.canvasRef} 
				className={[css.thumbnail, selected?css.selected:''].join(' ')} 
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
		// let question = state.questions[ownProps.questionId];
		// let options = getOptions(state, ownProps);

		let drawings = getDrawings(state, ownProps);
		// console.log('drawing thumbnail', ownProps.parentId, drawings);
		return {
			// ...question,
			// options,
			drawings,
			// selectedOption:state.ui.selectedOption
		};
	};
	return mapStateToProps;
};

const mapDispatchToProps = () => { 	
	return {};
};

export default connect(makeMapStateToProps, mapDispatchToProps)(DrawingThumbnail);
