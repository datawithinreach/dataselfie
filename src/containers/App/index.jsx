import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
// import bindActionCreators from 'redux';
import { withRouter } from 'react-router';
import { Switch, Route } from 'react-router';
import Form from '../Form';
import css from './index.css';
import FormList from 'containers/FormList';
import LandingPage from 'containers/LandingPage';
import NavBar from 'containers/NavBar';
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
				<NavBar/>
				{this.props.isFetching &&
					<div className={css.loadPageStyle}>Loading...</div>	
				}
				
				
				<Switch>
					<Route exact path='/' component={LandingPage}/>
					<Route exact path='/forms' component={FormList}/>
					<Route path='/forms/:formId' component={Form}/>
				</Switch>
			
				
			</div>);
	}
}

App.propTypes = {
	isFetching:PropTypes.bool,
};

const mapStateToProps = (state) => {
	return {
		isFetching:state.ui.isFetching,
	};
};

// const mapDispatchToProps = (dispatch) => {
// 	return {bindActionCreators(uiActions, dispatch)};
// };

export default withRouter(connect(mapStateToProps)(App));
