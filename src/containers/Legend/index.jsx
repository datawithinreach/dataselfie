import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import {makeGetDrawings} from 'ducks/drawings';
import {makeGetQuestionnaire} from 'ducks/forms';
import css from './index.css';
import DrawingThumbnail from 'containers/DrawingThumbnail';
const propTypes = {
	formId: PropTypes.string,
	questions:PropTypes.array
};

const defaultProps = {};

export class Legend extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible:props.questions.reduce((acc,q)=>{
				acc[q.id] = q.options.length>0? (
					q.allowMultipleAnswers?
						{[q.options[0].id]:true}
						:q.options[0].id
				):null;
				return acc;
			},{})
		};
		
	}

	selectOption(option){
		let {visible} = this.state;
		let q = this.props.questions.find(q=>q.id==option.questionId);
		let oneVisible= (q)=>Object.values(visible[q.id]).filter(v=>v==true).length==1;
		this.setState({
			visible:{
				...visible,
				[option.questionId]:q.allowMultipleAnswers?{
					...(visible[q.id]||{}),
					[option.id]:oneVisible(q)?true:!visible[q.id][option.id]
				}:option.id
			}
		});

	}
	isVisible(option){
		let {visible} = this.state;
		let q = this.props.questions.find(q=>q.id==option.questionId);
		return q.allowMultipleAnswers? visible[q.id][option.id]:visible[q.id]==option.id;
	}
	render() {
		let {formId, questions} = this.props;
		let {visible} = this.state;
		let parentIds = [formId];
		for (const qId of Object.keys(visible)){
			if (!visible[qId]) continue;
			if (typeof visible[qId]=='string'){
				parentIds.push(visible[qId]);
			}else{//multiple answers
				for (const oId of Object.keys(visible[qId])){
					if (visible[qId][oId]){
						parentIds.push(oId);
					}
					
				}
			}
		}

		return (
			<div className={css.legend} ref={this.legend}>
				<DrawingThumbnail width={300} height={300} parentIds={parentIds} selectable={false}/>
				<div className={css.questions}>
					{questions.map((question,i)=>(
						<div key={i} className={css.question}>
							<div className={css.header}>
								{question.text}
							</div>
							<div className={css.options}>
								{question.options.map((option,i)=>
									<div key={i} className={[css.option, 
										this.isVisible(option)?css.selected:''].join(' ')}
									onPointerUp={this.selectOption.bind(this, option)} >
										<DrawingThumbnail key={question.id} 
											className={css.drawing}
											parentId={option.id}
											width={40}
											height={40}
											selected={true}/>
										<div className={css.label}>{option.text}</div>
									</div>
								)}
							</div>
						</div>
					))}
				</div>
				

			</div>
		);
	}
}

Legend.propTypes = propTypes;
Legend.defaultProps = defaultProps;

// let getDrawings = makeGetDrawings();
let getQuestions = makeGetQuestionnaire();
const mapStateToProps = (state, ownProps) =>{
	
	let form = state.forms[ownProps.id];
	let questions = getQuestions(state, ownProps);
	// get questions
	// let drawings = getDrawings(state, {...ownProps, parentId:ownProps.formId});
	return {
		...form,
		questions
	};
};

const mapDispatchToProps = () => {
	return {
		// ...bindActionCreators({
		// 	// createDrawing,
		// 	// deleteDrawing
		// }, dispatch)//,
		// // createDrawing: (choiceId, attrs)=>{
		// // 	let action = createDrawing(choiceId, attrs);
		// // 	dispatch(action);
		// // 	return action.id;
		// // }
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Legend);
