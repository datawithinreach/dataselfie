import React from 'react';
import PropTypes from 'prop-types';
import css from './index.css';
import classNames from 'utils/classNames';
const propTypes = {
	form:PropTypes.object,
	onLayerVisible:PropTypes.func,
	selected: PropTypes.string,
};

const defaultProps = {};

export default class LayerView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible:{
				[this.props.selected]:true
			}
		};
		this.toggleLayer = this.toggleLayer.bind(this);
	}
	toggleLayer(e){
		let id = e.target.dataset.id;
		let visible = !this.state.visible[id];
		this.setState({
			visible:{
				...this.state.visible,
				[id] : visible
			}
		});
		if (this.props.onLayerVisible){
			this.props.onLayerVisible(id, visible);
		}
	}
	visible(id){
		return this.state.visible[id];
	}
	active(id){
		return this.props.selected==id;
	}
	render() {
		let {form} = this.props;
		return (
			<div className={css.layers}>
				<div className={classNames(css.layer,
					{[css.invisible]:!this.visible(form.id), [css.selected]:this.active(form.id)})} 
				onPointerUp={this.toggleLayer} data-id={form.id}>
					<i 	
						className={classNames('fas', {
							'fa-eye':this.visible(form.id),
							'fa-eye-slash':!this.visible(form.id),
						})} 
					></i>
					<label>{form.title}</label>
				</div>							
				{form.questions.map((question,i)=>
					<React.Fragment key={question.id}>
						<div className={classNames(css.layer,{[css.invisible]:!this.visible(question.id), [css.selected]:this.active(question.id)})} 
							onPointerUp={this.toggleLayer} data-id={question.id}>
							<i 
								className={classNames('fas', {
									'fa-eye':this.visible(question.id),
									'fa-eye-slash':!this.visible(question.id),
								})}
							></i>
							<label>{`Q${i+1}. ${question.text}`}</label>
						</div>
						{question.options.map((option,i)=>
							<div key={option.id} 
								className={classNames(css.layer, css.indent,
									{[css.invisible]:!this.visible(option.id), [css.selected]:this.active(option.id)})}
								onPointerUp={this.toggleLayer} data-id={option.id}>
								<i 
									className={classNames('fas', {
										'fa-eye':this.visible(option.id),
										'fa-eye-slash':!this.visible(option.id)
									})}
								></i>
								<label>{`${i+1}. ${option.text}`}</label>
							</div>
						)}
					</React.Fragment>
				)}
			</div>
		);
	}
}

LayerView.propTypes = propTypes;
LayerView.defaultProps = defaultProps;

