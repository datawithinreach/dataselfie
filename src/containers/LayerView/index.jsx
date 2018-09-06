import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import css from './index.css';
import classNames from 'utils/classNames';

import DrawingThumbnail from 'containers/DrawingThumbnail';
import {makeGetQuestionnaire} from 'ducks/forms';

const propTypes = {
	formId:PropTypes.string,
	title:PropTypes.string,
	questions:PropTypes.array,
	onToggleLayer:PropTypes.func,
	layers:PropTypes.array,
	selected: PropTypes.string,
	horizontal:PropTypes.bool,
};

const defaultProps = {
	horizontal:false
};

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

		let {formId, title, questions, selected} = this.props;
		return (
			<div className={css.layers} touch-action='pan-y'>
				<div className={classNames(css.layer, {[css.invisible]:!this.visible(formId), [css.selected]:selected==formId})} 
					onPointerUp={this.toggleLayer} data-id={formId}>
					<div className={css.leftGroup}>
						<DrawingThumbnail width={40} height={40} selected={selected==formId} parentId={formId} />
						<label>{this.abbreviate(title)}</label>
					</div>
					<i 
						className={classNames('fas', {
							'fa-eye':this.visible(formId),
							'fa-eye-slash':!this.visible(formId),
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
	let form = state.forms[ownProps.formId];
	let questions = getQuestions(state,ownProps);
	
	return {
		...form,
		questions
	};
};

const mapDispatchToProps = () => { 	
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(LayerView);

