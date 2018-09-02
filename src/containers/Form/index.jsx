import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import css from './index.css';
import DesignView from 'containers/DesignView';
import LiveView from 'containers/LiveView';
import ResultView from 'containers/ResultView';
import classNames from 'utils/classNames';
import {requestFormContent} from 'ducks/forms';
import {selectForm} from 'ducks/ui';
import {bindActionCreators} from 'redux';
// import css from './index.css'; 
export class Form extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mode:'design'
		};
		this.changeMode = this.changeMode.bind(this);
	}
	componentDidMount(){
		let {username, id, requestFormContent, selectForm} = this.props;
		requestFormContent(username, id);//retrieve form content from server
		if (this.props.isLoading){
			selectForm(id);// when acceced directly from the url
		}
		
	}
	changeMode(e){
		this.setState({mode:e.target.dataset.mode});
	}
	renderMode(){

		if (this.props.isLoading){
			return '';
		}else if (this.state.mode=='design'){
			return <DesignView formId={this.props.id}/>;
		}else if (this.state.mode=='preview'){
			return <LiveView formId={this.props.id}/>;
		}else if (this.state.mode=='analyze'){
			return <ResultView formId={this.props.id}/>;
		}
	}
	render() {
		return (
			<div className={css.container}>
				<div className={css.menu}>
					<div className={classNames(css.menuItem, {[css.selected]:this.state.mode=='design'})} data-mode='design' onPointerUp={this.changeMode}>Design</div>
					<div className={classNames(css.menuItem, {[css.selected]:this.state.mode=='preview'})} data-mode='preview' onPointerUp={this.changeMode}>Preview</div>
					<div className={classNames(css.menuItem, {[css.selected]:this.state.mode=='analyze'})} data-mode='analyze' onPointerUp={this.changeMode}>Results</div>
					<div className={css.menuItem} onPointerUp={this.handleShare}>Share</div>
				</div>
				<div className={css.content}>
					{this.renderMode()}
				</div>



			</div>
		);
	}
}

Form.propTypes = {
	// items:PropTypes.array,
	id:PropTypes.string,
	username:PropTypes.string,
	isLoading:PropTypes.bool,
	selectForm:PropTypes.func,
	requestFormContent:PropTypes.func,
};

const mapStateToProps = (state, ownProps) => {
	let formId = state.ui.selectedForm?
		state.ui.selectedForm:
		ownProps.match.params.formId;
	let form = state.forms[formId];
	return {
		...form,
		username:state.auth.username,
		isLoading:!form,
		id: formId // in case form is emtpy...
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		...bindActionCreators({
			requestFormContent,
			selectForm
		}, dispatch)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Form);
