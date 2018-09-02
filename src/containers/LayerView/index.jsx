import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import css from './index.css';
import classNames from 'utils/classNames';

import DrawingThumbnail from 'containers/DrawingThumbnail';
import {makeGetQuestionnaire} from 'ducks/forms';

const propTypes = {
	form:PropTypes.object,
	questions:PropTypes.array,
	onToggleLayer:PropTypes.func,
	layers:PropTypes.array,
	selected: PropTypes.string,
};

const defaultProps = {};

export class LayerView extends React.Component {
	constructor(props) {
		super(props);
		// this.state = {
		// 	visible:{
		// 		[this.props.selected]:true
		// 	}
		// };
		this.toggleLayer = this.toggleLayer.bind(this);
	}
	// componentDidUpdate(prevProps){
	// 	if (prevProps)
	// }
	toggleLayer(e){
		let id = e.currentTarget.dataset.id;
		if (id==this.props.selected){
			return;
		}
		// let visible = !this.state.visible[id];
		// this.setState({
		// 	visible:{
		// 		...this.state.visible,
		// 		[id] : visible
		// 	}
		// });
		if (this.props.onToggleLayer){
			this.props.onToggleLayer(id);
		}
		this.forceUpdate();// necessary hack..
	}
	abbreviate(text, limit=60){
		if (text.length>limit){
			return text.slice(0,limit-3).concat('...');
		}
		return text;
	}
	visible(id){
		let {layers, selected} = this.props;
		if (id==selected){
			return true;
		}
		
		return layers? (layers[id]?layers[id].visible:false):false;
	}
	render() {

		console.log('---------------');
		let {form, questions, selected} = this.props;
		return (
			<div className={css.layers}>
				<div className={classNames(css.layer, {[css.invisible]:!this.visible(form.id), [css.selected]:selected==form.id})} 
					onPointerUp={this.toggleLayer} data-id={form.id}>
					<div className={css.leftGroup}>
						<DrawingThumbnail width={40} height={40} selected={selected==form.id} parentId={form.id} />
						<label>{this.abbreviate(form.title)}</label>
					</div>
					<i 
						className={classNames('fas', {
							'fa-eye':this.visible(form.id),
							'fa-eye-slash':!this.visible(form.id),
						})}
					></i>
				</div>							
				{questions.map((question,i)=>
					<React.Fragment key={question.id}>
						<div className={css.question}>
							{`Q${i+1}. ${this.abbreviate(question.text)}`}
						</div>
						{question.options.map((option,i)=>
							<div key={option.id} 
								className={classNames(css.layer, {[css.invisible]:!this.visible(option.id), [css.selected]:selected==option.id})} 
								onPointerUp={this.toggleLayer} data-id={option.id}>
								<div className={css.leftGroup}>
									<DrawingThumbnail width={40} height={40} selected={selected==option.id} parentId={option.id} />
									<label>{`${i+1}. ${this.abbreviate(option.text)}`}</label>
								</div>
								<i 
									className={classNames('fas', {
										'fa-eye':this.visible(option.id),
										'fa-eye-slash':!this.visible(option.id),
									})}
								></i>
								
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



const getQuestions = makeGetQuestionnaire();

const mapStateToProps = (state, ownProps) => {
	let form = state.forms[state.ui.selectedForm];
	let questions = getQuestions(state,ownProps);
	let selected = state.ui.selectedOption?state.ui.selectedOption:state.ui.selectedForm;//option or background

	
	return {
		form,
		questions,
		selected
	};
};

const mapDispatchToProps = () => { 	
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(LayerView);

