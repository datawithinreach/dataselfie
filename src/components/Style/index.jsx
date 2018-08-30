import React from 'react';
import PropTypes from 'prop-types';
import css from './index.css';
export class Style extends React.PureComponent{
	constructor(props){
		super(props);

		this.handleOpacityStart = this.handleOpacityStart.bind(this);
		this.handleOpacityEnd = this.handleOpacityEnd.bind(this);
		this.handleOpacity = this.handleOpacity.bind(this);

		this.handleOpacityTap = this.handleOpacityTap.bind(this);

		this.colors = [ //'#CDDC39'
			'#F44336','#E91E63','#9C27B0','#673AB7','#3F51B5',
			'#2196F3','#03A9F4','#00BCD4','#009688','#4CAF50',
			'#8BC34A','#FFEB3B','#FFC107','#FF9800',
			'#FF5722','#FFFFFF', '#9E9E9E','#000000'
		];
		this.strokes = [
			1, 2, 3, 4, 
			6, 8, 10, 12,
			13, 16, 19, 22
		];
		// if (props.selectedPen=='drawingPen' || props.selectedPen=='annotationPen'){
		// 	this.state.opacity = props.penOptions[props.selectedPen].opacity;
		// }
		this.state ={
			color:props.color,
			stroke:props.stroke,
			opacity : props.opacity
		};
	}
	
	static getDerivedStateFromProps (nextProps){
		console.log('nextProps', nextProps);
		return {
			color: nextProps.color,
			stroke: nextProps.stroke,
			opacity : nextProps.opacity
		};
	}
	
	handleOpacityStart(e){
		this.opacity = this.state.opacity;
		this.opacitySliderWidth = e.target.parentNode.getBoundingClientRect().width;
		this.opacitySliderX = e.clientX;
		window.addEventListener('mousemove', this.handleOpacity);
		window.addEventListener('mouseup', this.handleOpacityEnd);
	}
	handleOpacity(e){
		if (!this.opacitySliderX){
			return;
		}
		let dx = e.clientX-this.opacitySliderX;
		let da = dx/this.opacitySliderWidth;
		let newOpacity = this.opacity + da;

		if (newOpacity>1.0){
			newOpacity = 1.0;
		}

		if (newOpacity<0.0){
			newOpacity = 0.0;
		}

		this.setState({
			opacity:newOpacity
		});
		this.props.onStyleUpdate({...this.state, opacity:newOpacity});
	}
	handleOpacityEnd(){
		if (!this.opacitySliderX){
			return;
		}
		this.opacity = this.opacitySliderX = this.opacitySliderWidth = null;
		window.removeEventListener('mousemove', this.handleOpacity);
		window.removeEventListener('mouseup', this.handleOpacityEnd);
	
	}
	handleOpacityTap(e){
		if (this.opacitySliderX){
			return;
		}
		// e = e.srcEvent;

		let rect = e.target.parentNode.getBoundingClientRect();
		// console.log();
		let newOpacity = (e.clientX-rect.x)/rect.width;
		if (newOpacity>1.0){
			newOpacity = 1.0;
		}

		if (newOpacity<0.0){
			newOpacity = 0.0;
		}
		this.setState({
			opacity:newOpacity
		});
		this.props.onStyleUpdate({...this.state, opacity:newOpacity});
	}
	
	handleSelectStroke(stroke){
		this.setState({stroke});
		this.props.onStyleUpdate({...this.state, stroke});
	}
	handleSelectColor(color){
		
		this.setState({color});
		this.props.onStyleUpdate({...this.state, color});
	}
	render(){

		return (
			<div>
				<div className={css.drawingPenOption}>
					<div className={css.colors}>
						{this.colors.map((color,i)=>(
							<div  key={i} 
								className={[
									css.color,
									color=='#FFFFFF'?css.white:undefined,
									color==this.state.color?css.selectedOption:''].join(' ')
								}
								style={{backgroundColor:color}}
								onPointerUp={this.handleSelectColor.bind(this,color)}/>
						))}
					</div>
					<div className={css.strokes}>
						{this.strokes.map((stroke,i)=>(
							<div key={i} 
								className={[
									css.stroke,
									stroke==this.state.stroke?css.selectedOption:''].join(' ')
								}
								onPointerUp={this.handleSelectStroke.bind(this,stroke)}
							>
								<div className={css.strokeBar}
									style={{height:`${stroke}px`, backgroundColor:this.state.color=='#FFFFFF'?'#000000':this.state.color}}></div>
							</div>
						))}
					</div>
					<div className={css.opacitySlider}>
						<div className={css.checkboard}>
						</div>

						<div className={css.gradient}
							style={{background: `linear-gradient(to right, ${this.state.color=='#FFFFFF'?'#000000':this.state.color}00 0%, ${this.state.color=='#FFFFFF'?'#000000':this.state.color}FF 100%)`}}
							onPointerUp={this.handleOpacityTap}
						>
						</div>
						<div className={css.handle} 
							style={{left:`${this.state.opacity*100}%`}}
							onPointerDown={this.handleOpacityStart}
						/>
					</div>
				</div>
			</div>
						
		


		);
	}
}
Style.propTypes = {
	color:PropTypes.string,
	stroke:PropTypes.number,
	opacity:PropTypes.number,
	onStyleUpdate:PropTypes.func
};


export default Style;
