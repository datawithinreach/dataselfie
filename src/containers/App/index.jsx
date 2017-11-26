import React from 'react';
// import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// import bindActionCreators from 'redux';
import Form from '../Form';
import css from './index.css';
// import {actions as uiActions} from '../ducks/ui';

/* * Show either PageList or Page depending on the current mode
* and provides an option to navigate between them */
export class App extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className={css.app}>
				<Form/>
			</div>
		);
	}
}

App.propTypes = {};

const mapStateToProps = (state) => {
	return state;
};

// const mapDispatchToProps = (dispatch) => {
// 	return {bindActionCreators(uiActions, dispatch)};
// };

export default connect(mapStateToProps)(App);
