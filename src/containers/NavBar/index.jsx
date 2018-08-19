import React from 'react';
import {connect} from 'react-redux';
// import PropTypes from 'prop-types';
import css from './index.css';
import Button from 'components/Button';
import TextField from 'components/TextField';
import Checkbox from 'components/Checkbox';
export class NavBar extends React.Component {
	constructor(props){
		super(props);
		this.showLogin = this.showLogin.bind(this);
		this.closePopup = this.closePopup.bind(this);
		this.showSignup = this.showSignup.bind(this);
		this.handleLogin = this.handleLogin.bind(this);
		this.handleSignup = this.handleSignup.bind(this);
		this.state = {
			showLogin:false,
			showSignup:false,
		};
	}
	showLogin(){
		this.setState({showLogin:true});
	}
	showSignup(){
		this.setState({showSignup:true});
	}
	handleLogin(){

	}
	handleSignup(event){
		console.log(event);
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
								<TextField placeholder="Username"/>
								<TextField type="password" placeholder="Password"/>
								<TextField type="password" placeholder="Confirm Password"/>
								<TextField placeholder="E-mail Address"/>
							</div>

							<Button label="Sign Up" stretch/>
						</div>
					</div>
				}
			</React.Fragment>

		);
	}
}

NavBar.propTypes = {};


const mapStateToProps = (state) => {
	return state;
};

// const mapDispatchToProps = (dispatch) => {
// 	return {bindActionCreators(uiActions, dispatch)};
// };

export default connect(mapStateToProps)(NavBar);
