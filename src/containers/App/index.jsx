import React from 'react';
// import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// import bindActionCreators from 'redux';
import { withRouter } from 'react-router';
import { Switch, Route } from 'react-router';
import Form from '../Form';
import css from './index.css';
import FormList from 'containers/FormList';
// import {actions as uiActions} from '../ducks/ui';

/* * Show either PageList or Page depending on the current mode
* and provides an option to navigate between them */
export class App extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div className={css.app}>
			<Switch>
				<Route exact path='/' component={FormList}/>
				<Route path='/form/:formId' component={Form}/>
			</Switch>
		</div>);
	}
}

App.propTypes = {};

const mapStateToProps = (state) => {
	return state;
};

// const mapDispatchToProps = (dispatch) => {
// 	return {bindActionCreators(uiActions, dispatch)};
// };

export default withRouter(connect(mapStateToProps)(App));
