import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
class FileLoader extends PureComponent {
	constructor(props){
		super(props);

		this.handleDragEnter = this.handleDragEnter.bind(this);
		this.handleDrop = this.handleDrop.bind(this);
		this.handleDragOver = this.handleDragOver.bind(this);
		this.handleDragLeave = this.handleDragLeave.bind(this);
	}
	handleDrop(e){
		e.preventDefault();
		e.stopPropagation();
		if (this.props.onDrop){
			this.props.onDrop(e);
		}
	}
	handleDragEnter(e){
		e.preventDefault();
		e.stopPropagation();
		this.dragTargetSaved=e.target;
		if (this.props.onDragEnter){
			this.props.onDragEnter(e);
		}
	}
	handleDragOver(e){
		if (e.dataTransfer.types.includes('Files')==false){
			return;
		}
		e.preventDefault();
		e.stopPropagation();
		if (this.props.onDragOver){
			this.props.onDragOver(e);
		}
	}
	handleDragLeave(e){
		e.preventDefault();
		e.stopPropagation();
		if (this.props.onDragLeave &&  this.dragTargetSaved==e.target){
			this.props.onDragLeave(e);
		}
	}

	render () {
		let child = React.Children.only(this.props.children);
		return  React.cloneElement(child,
			{	
				onDragEnter: this.handleDragEnter,
				onDragOver: this.handleDragOver,
				onDragLeave: this.handleDragLeave,
				onDrop: this.handleDrop

			});
	
	}
}

FileLoader.propTypes = {
	onDrop:PropTypes.func,
	onDragEnter:PropTypes.func,
	onDragOver:PropTypes.func,
	onDragLeave:PropTypes.func,
	children:PropTypes.element.isRequired,
};

export default FileLoader;