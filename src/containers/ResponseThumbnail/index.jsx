import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {deleteResponse} from 'ducks/responses';
// import { push } from 'react-router-redux';
import Button from 'components/Button';
// import {makeGetResponseDrawings} from 'ducks/drawings';
import DrawingThumbnail from 'containers/DrawingThumbnail';
import css from './index.css';

const propTypes = {
	responseId:PropTypes.string,
	formId:PropTypes.string,
	name:PropTypes.string,
	createdAt:PropTypes.string,
	answer:PropTypes.object,
	selected:PropTypes.bool,
	width:PropTypes.number,
	height:PropTypes.number,
	editable:PropTypes.bool, // delete, show menu
	// drawings:PropTypes.array,
	// push:PropTypes.func,
	deleteResponse:PropTypes.func,
};

const defaultProps = {
	width:200,
	height:200,
};

export class ResponseThumbnail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			confirmDelete:false 
		};
		// this.handleShowMenu = this.handleShowMenu.bind(this);
		// this.handleHideMenu = this.handleHideMenu.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		
		// this.openResponseView = this.openResponseView.bind(this);
		this.confirmDelete = this.confirmDelete.bind(this);
		this.cancelDelete = this.cancelDelete.bind(this);
	}
	// handleShowMenu(){
	// 	this.setState({showMenu:true});
	// }
	// handleHideMenu(){
	// 	this.setState({showMenu:false});
	// }
	// openResponseView(){
	// 	this.props.push(`/forms/view/${this.props.formId}/r/${this.props.responseId.replace('response_','')}`);
	// }
	handleDelete(){
		this.setState({confirmDelete:true});
	}
	confirmDelete(){
		this.props.deleteResponse(this.props.responseId);
	}
	cancelDelete(){
		this.setState({confirmDelete:false});
	}
	render() {
		let {name, createdAt,formId, width, height, answer, selected} = this.props;
		let parentIds = [formId];
		for (const qId of Object.keys(answer)){
			if (!answer[qId]) continue;
			if (typeof answer[qId]=='string'){
				parentIds.push(answer[qId]);
			}else{//multiple answers
				for (const oId of Object.keys(answer[qId])){
					if (answer[qId][oId]){
						parentIds.push(oId);
					}
					
				}
			}
		}
		let otherProps = {...this.props};
		Object.keys(ResponseThumbnail.propTypes).forEach(k=>delete otherProps[k]);
		return (
			<div className={css.container} {...otherProps}>
				<div className={css.header}> {name} </div>
				<div className={css.note}> {createdAt} </div>
				<div className={css.drawing} 
					// onPointerEnter={this.handleShowMenu} onPointerLeave={this.handleHideMenu}
				>
					<DrawingThumbnail parentIds={parentIds} width={width} height={height} />
					{(this.state.showMenu || selected) && <div className={css.menu} style={{opacity:0.9,width:`${width+4}px`, height:`${height+4}px`}}>
						<Button className={css.deleteBtn}
							onPointerUp={this.handleDelete}>
							<i className="fas fa-trash-alt"></i>
							{/* <img src="assets/icons/trash.svg"/> */}
						</Button>
						{this.state.confirmDelete?
							<div className={css.confirmPopup}>
								<Button onPointerUp={this.confirmDelete}>Delete</Button>
								<Button onPointerUp={this.cancelDelete}>Cancel</Button>
							</div>
							:
							<Button link href={`/forms/view/${this.props.formId}/r/${this.props.responseId.replace('response_','')}`} target='_blank'>Open</Button>
						}
						
					</div>}
					
				</div>
			</div>
		);
	}
}

ResponseThumbnail.propTypes = propTypes;
ResponseThumbnail.defaultProps = defaultProps;


// const getResponseDrawings = makeGetResponseDrawings();
const mapStateToProps = (state, ownProps) => {
	let response = state.responses[ownProps.responseId];
	// let drawings = getResponseDrawings(state, ownProps);
	return {
		...response,
	};
};

const mapDispatchToProps = (dispatch) => { 	
	return bindActionCreators({
		deleteResponse,
	}, dispatch);
};

export default connect(mapStateToProps,mapDispatchToProps)(ResponseThumbnail);
