import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {deleteResponse} from 'ducks/responses';
import { push } from 'react-router-redux';
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
	width:PropTypes.number,
	height:PropTypes.number,
	editable:PropTypes.bool, // delete, show menu
	drawings:PropTypes.array,
	push:PropTypes.func,
};

const defaultProps = {
	width:200,
	height:200,
};

export class ResponseThumbnail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.handleShowMenu = this.handleShowMenu.bind(this);
		this.handleHideMenu = this.handleHideMenu.bind(this);
		this.openResponseView = this.openResponseView.bind(this);
	}
	handleShowMenu(){
		this.setState({showMenu:true});
	}
	handleHideMenu(){
		this.setState({showMenu:false});
	}
	openResponseView(){
		this.props.push(`/forms/view/${this.props.formId}/r/${this.props.responseId.replace('response_','')}`);
	}
	render() {
		let {name, createdAt,formId, width, height, answer} = this.props;
		console.log(answer);
		let parentIds = [formId, ... Object.values(answer)];
		return (
			<div>
				<div className={css.header}> {name} </div>
				<div className={css.note}> {createdAt} </div>
				<div className={css.drawing} onPointerEnter={this.handleShowMenu} onPointerLeave={this.handleHideMenu}>
					<DrawingThumbnail parentIds={parentIds} width={width} height={height} />
					<div className={css.menu} style={{opacity:this.state.showMenu?0.9:0.0,width:`${width+4}px`, height:`${height+4}px`}}>
						<Button onPointerUp={this.openResponseView}>Open</Button>
					</div>
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
	console.log('response', response);
	return {
		...response,
	};
};

const mapDispatchToProps = (dispatch) => { 	
	return bindActionCreators({
		deleteResponse,
		push
	}, dispatch);
};

export default connect(mapStateToProps,mapDispatchToProps)(ResponseThumbnail);
