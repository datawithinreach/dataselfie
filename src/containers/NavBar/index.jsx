import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import css from './index.css';
import Button from 'components/Button';
import TextField from 'components/TextField';
import Checkbox from 'components/Checkbox';
import { push } from 'react-router-redux';
import {requestLogin, requestSignup, requestLogout, clearAuthStatus, notifyAuthFailure, resendConfirmEmail} from 'ducks/auth';

export class NavBar extends React.Component {
	constructor(props){
		super(props);
		this.showLogin = this.showLogin.bind(this);
		this.closePopup = this.closePopup.bind(this);
		this.showSignup = this.showSignup.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleSignup = this.handleSignup.bind(this);
		this.handleFormChange = this.handleFormChange.bind(this);
		this.resendConfirmEmail = this.resendConfirmEmail.bind(this);
		this.state = {
			showLogin:false,
			showSignup:false,
			form:{}
		};
	}
	showLogin(){
		this.setState({showLogin:true, showSignup:false, form:{ remember:true}});
		this.props.clearAuthStatus();
	}
	showSignup(){
		this.setState({showSignup:true, showLogin:false, form:{}});
		this.props.clearAuthStatus();
	}
	handleLogin(){
		let form = this.state.form;
		console.log(form);
		let names = ['username', 'password'];
		for (let i=0; i<names.length; i++){
			let value = form[names[i]];
			if (!value || value==''){
				this.props.notifyAuthFailure(`Please fill in ${names[i]}`);
				return;
			}
		}
		let {username, password, remember} = form;
		this.props.requestLogin(username, password, remember);
	}
	resendConfirmEmail(){
		let {username=null} = this.state.form;
		if (!username){
			this.props.notifyAuthFailure('Please fill in username');
			return;
		}
		this.props.resendConfirmEmail(username);
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
		if (form['password'].length<8){
			this.props.notifyAuthFailure('Password must be at least 8 characters in length.');
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
		let {username, password, email} = form;
		this.props.requestSignup(username, password, email);
		
	}
	handleFormChange (event) {
		let form = {
			...this.state.form,
			[event.target.name]: event.target.type == 'checkbox'? event.target.checked: event.target.value
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
		let {authStatus=null, username= null} = this.props;
		let notConfirmed = authStatus?authStatus.includes('not activated your account'):null;
		return (
			<React.Fragment>
				<div className={css.navbar}>
					<Button link href='/' filled>DataSelfie</Button>
					{!username? 
						<div className={css.rightMenu}>
							<div className={css.menuItem}>
								<Button onPointerUp={this.showLogin} outlined>Log In</Button>
							</div>
							<div className={css.menuItem}>
								<Button onPointerUp={this.showSignup} outlined>Sign Up</Button>
							</div>                    
						</div>:<div className={css.rightMenu}>
							<div className={css.menuItem}>
								<Button onPointerUp={this.props.viewForms} outlined>My Forms</Button>
							</div>
							<div className={css.menuItem}>
								<Button onPointerUp={this.props.requestLogout} outlined>Log Out of {username}</Button>
							</div>
						</div>
					}
				</div>
				
				{this.state.showLogin && !username &&
					<div className={css.background} onPointerUp={this.closePopup}>
						<div className={css.auth}>
							
							<div className={css.header}>
								<span>Log In</span>
								<Button onPointerUp={this.closePopup} outlined>X</Button>
							</div>
							<div className={css.form}>
								<TextField placeholder="Username" name="username" onChange={this.handleFormChange}/>
								<TextField type="password" placeholder="Password" name="password" onChange={this.handleFormChange}/>
							</div>

							<div className={css.loginOption}>
								<a>Forgot password?</a>
								<Checkbox label="Remember me?" name="remember" defaultChecked={this.state.form.remember} onChange={this.handleFormChange}/>
							</div>
							<div className={css.message}>{this.props.authStatus}</div>
							{notConfirmed&&
								<div className={css.resend}>Did not get the email?
									<a onPointerUp={this.resendConfirmEmail}>Resend</a>
								</div>
							}
							<Button stretch  onPointerUp={this.handleLogin} outlined>Log In</Button>
						</div>
					</div>
				}
				{this.state.showSignup && !username &&
					<div className={css.background} onPointerUp={this.closePopup}>
						<div className={css.auth}>
							<div className={css.header}>
								<span>Sign Up</span>
								<Button onPointerUp={this.closePopup} outlined>X</Button>
							</div>
							<div className={css.form}>
								<TextField placeholder="Username" name="username" onChange={this.handleFormChange}/>
								<TextField type="password" placeholder="Password" name="password" onChange={this.handleFormChange}/>
								<TextField type="password" placeholder="Confirm Password" name="confirmPassword" onChange={this.handleFormChange}/>
								<TextField placeholder="E-mail Address" name="email" onChange={this.handleFormChange}/>
							</div>
							<div className={css.loginOption}>
								<div>Already registered? <a onPointerUp={this.showLogin}>Login</a></div>
							</div>
							<div className={css.message}>{this.props.authStatus}</div>
							<Button stretch onPointerUp={this.handleSignup} outlined>Sign Up</Button>
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
	resendConfirmEmail:PropTypes.func,
	requestLogout:PropTypes.func,
	viewForms:PropTypes.func,
};


const mapStateToProps = (state) => {
	let username = state.auth.username;//? state.auth.username : sessionStorage.getItem('username');
	return {
		username,
		authStatus: state.auth.status
	};
};

const mapDispatchToProps = (dispatch) => { 	
	return {
		...bindActionCreators({
			requestLogin,
			requestSignup,
			notifyAuthFailure,
			clearAuthStatus,
			resendConfirmEmail		
		}, dispatch),
		requestLogout:()=>{
			sessionStorage.removeItem('username');
			localStorage.removeItem('username');
			dispatch(requestLogout());
			dispatch(push('/'));
		},
		viewForms:()=>{
			dispatch(push('/forms'));
		}

	};
};
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
