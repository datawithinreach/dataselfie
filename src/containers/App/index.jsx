import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { withRouter } from 'react-router';
import { Switch, Route, Redirect  } from 'react-router';
import Form from '../Form';
import css from './index.css';
import FormList from 'containers/FormList';
import LandingPage from 'containers/LandingPage';
import NavBar from 'containers/NavBar';
import Button from 'components/Button';
import {releaseServerError} from 'ducks/ui';
import LiveView from 'containers/LiveView';
import ResponseView from 'containers/ResponseView';

/* * Show either PageList or Page depending on the current mode
* and provides an option to navigate between them */
export class App extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		
		return (			
			<div className={css.app}>
				<Route exact path='/' component={NavBar}/>
				<Route exact path='/forms' component={NavBar}/>
				<Route path='/forms/edit/:formId' component={NavBar}/>
				{/* <NavBar/> */}
				{this.props.serverError&&
					<div className={css.snackbar}>
						<div>Error: {this.props.serverError} - Probably something went wrong in the server. You may try refresh the page.</div>
						<Button onPointerUp={this.props.releaseServerError}>Close</Button>
					</div>
				}
				{this.props.isFetching &&
					<div className={css.loadPageStyle}>Loading...</div>	
				}
				
				
				
				<Switch>
					<Route exact path='/' component={LandingPage}/>
					<Route path='/forms/view/:formId/r/:responseId' component={ResponseView}/>
					<Route path='/forms/view/:formId' component={LiveView}/>
					
					{this.props.username?
						<React.Fragment>
							<Route exact path='/forms' component={FormList}/>
							<Route path='/forms/edit/:formId' component={Form}/>
						</React.Fragment>
						:
						<React.Fragment>
							<Redirect to='/'/>
						</React.Fragment>
					}
				</Switch>


					
			
				
			</div>);
	}
}

App.propTypes = {
	isFetching:PropTypes.bool,
	username:PropTypes.string,
	serverError:PropTypes.string,
	releaseServerError:PropTypes.func,
};

const mapStateToProps = (state) => {
	
	return {
		username:state.auth.username,
		isFetching:state.ui.isFetching,
		serverError:state.ui.serverError
	};
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({releaseServerError}, dispatch);
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
