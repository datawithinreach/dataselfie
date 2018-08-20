import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import css from './index.css';
import Button from 'components/Button';
import TextField from 'components/TextField';
import Checkbox from 'components/Checkbox';
import {requestLogin, requestSignup, clearAuthStatus, notifyAuthFailure} from 'ducks/user';

export class NavBar extends React.Component {
	constructor(props){
		super(props);
		this.showLogin = this.showLogin.bind(this);
		this.closePopup = this.closePopup.bind(this);
		this.showSignup = this.showSignup.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleSignup = this.handleSignup.bind(this);
		this.handleFormChange = this.handleFormChange.bind(this);
		this.state = {
			showLogin:false,
			showSignup:false,
			form:{}
		};
	}
	showLogin(){
		this.setState({showLogin:true, form:{}});
		this.props.clearAuthStatus();
	}
	showSignup(){
		this.setState({showSignup:true, form:{}});
		this.props.clearAuthStatus();
	}
	handleLogin(){

	}
	handleSignup(){
		let form = this.state.form;
		let names = ['username', 'password', 'confirmPassword', 'email'];
		for (let i=0; i<names.length; i++){
			let value = form[names[i]];
			if (!value || value==''){
				this.props.notifyAuthFailure(`${names[i]} is required`);
				return;
			}
		}
		if (form['password']!=form['confirmPassword']){
			this.props.notifyAuthFailure('Password does not match the confirm password.');
			return;
		}
		function validateEmail(email) {
			var re = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
			return re.test(email);
		}
		if (!validateEmail(form['email'])){
			this.props.notifyAuthFailure(' The email address is in an invalid format.');
			return;
		}
		let {username, password, email } = form;
		this.props.requestSignup(username, password, email);
		
	}
	handleFormChange (event) {
		let form = {
			...this.state.form,
			[event.target.name]: event.target.value
		};
		console.log(form);
		this.setState({form});
	}
	closePopup(e){
		if (e.currentTarget!=e.target){
			return;
		}
		this.setState({
			showLogin:false,
			showSignup:false
		});
	}

	render() {
		return (
			<React.Fragment>
				<div className={css.navbar}>
					<div className={css.logo}>
					DataPortraits
					</div>
					<div className={css.rightMenu}>
						<div className={css.menuItem}>
							<Button label="Log In" onPointerUp={this.showLogin}/>
						</div>
						<div className={css.menuItem}>
							<Button label="Sign Up" onPointerUp={this.showSignup}/>
						</div>                    
					</div>
				</div>
				{this.state.showLogin && 
					<div className={css.background} onPointerUp={this.closePopup}>
						<div className={css.auth}>
							
							<div className={css.header}>
								<span>Log In</span>
								<Button label="X" onPointerUp={this.closePopup}/>
							</div>
							<div className={css.form}>
								<TextField placeholder="Username"/>
								<TextField placeholder="Password"/>
							</div>

							<div className={css.loginOption}>
								<a>Forgot password?</a>
								<Checkbox label="Remember me?" checked/>
							</div>
							<Button label="Log In" stretch/>
						</div>
					</div>
				}
				{this.state.showSignup && 
					<div className={css.background} onPointerUp={this.closePopup}>
						<div className={css.auth}>
							<div className={css.header}>
								<span>Sign Up</span>
								<Button label="X" onPointerUp={this.closePopup}/>
							</div>
							<div className={css.form}>
								<TextField placeholder="Username" name="username" onChange={this.handleFormChange}/>
								<TextField type="password" placeholder="Password" name="password" onChange={this.handleFormChange}/>
								<TextField type="password" placeholder="Confirm Password" name="confirmPassword" onChange={this.handleFormChange}/>
								<TextField placeholder="E-mail Address" name="email" onChange={this.handleFormChange}/>
							</div>
							{this.props.authStatus}
							<Button label="Sign Up" stretch onPointerUp={this.handleSignup}/>
						</div>
					</div>
				}
			</React.Fragment>

		);
	}
}

NavBar.propTypes = {
	username:PropTypes.string,
	authStatus:PropTypes.string,
	requestLogin:PropTypes.func,
	requestSignup:PropTypes.func,
	notifyAuthFailure:PropTypes.func,
	clearAuthStatus:PropTypes.func,
};


const mapStateToProps = (state) => {
	console.log('auth', state.user);
	return {
		username: state.user.username,
		authStatus: state.user.status
	};
};

const mapDispatchToProps = (dispatch) => { 	
	return bindActionCreators({
		requestLogin,
		requestSignup,
		notifyAuthFailure,
		clearAuthStatus
	}, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
