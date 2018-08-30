import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import css from './index.css';
import Designer from 'containers/Designer';
import Viewer from 'containers/Viewer';
import Analyzer from 'containers/Analyzer';
import classNames from 'utils/classNames';
// import { withRouter } from 'react-router';
// import { Link } from 'react-router-dom';
// import bindActionCreators from 'redux'; import css from './index.css'; import
/* // {actions as uiActions} from '../ducks/ui'; Show either PageList or Page
 * depending on the current mode
* and provides an option to navigate between
 * them
 */
export class Form extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			mode:'design'
		};
		this.changeMode = this.changeMode.bind(this);
	}
	changeMode(e){
		this.setState({mode:e.target.dataset.mode});
	}
	renderMode(){
		if (this.state.mode=='design'){
			return <Designer formId={this.props.id}/>;
		}else if (this.state.mode=='view'){
			return <Viewer formId={this.props.id}/>;
		}else if (this.state.mode=='analyze'){
			return <Analyzer formId={this.props.id}/>;
		}
	}
	render() {
		return (
			<div className={css.container}>
				<div className={css.menu}>
					<div className={classNames(css.menuItem, {[css.selected]:this.state.mode=='design'})} data-mode='design' onPointerUp={this.changeMode}>Design</div>
					<div className={classNames(css.menuItem, {[css.selected]:this.state.mode=='view'})} data-mode='view' onPointerUp={this.changeMode}>Preview</div>
					<div className={classNames(css.menuItem, {[css.selected]:this.state.mode=='analyze'})} data-mode='analyze' onPointerUp={this.changeMode}>Results</div>
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
	id:PropTypes.string
};

const mapStateToProps = (state, ownProps) => {
	let formId = state.ui.selectedForm?
		state.ui.selectedForm:
		ownProps.match.params.formId;
	let form = state.forms[formId];
	return {
		...form
	};
};

// const mapDispatchToProps = (dispatch) => { 	return
// {bindActionCreators(uiActions, dispatch)}; };

export default connect(mapStateToProps)(Form);
