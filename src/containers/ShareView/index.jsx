import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {updateForm} from 'ducks/forms';
import Button from 'components/Button';
import Switch from 'components/Switch';
import TextField from 'components/TextField';
import RadioGroup from 'components/RadioGroup';

import classNames from 'utils/classNames';
import css from './index.css';

const propTypes = {
	formId:PropTypes.string,
	public:PropTypes.bool,
	reminder:PropTypes.object,
	subscribers:PropTypes.array,
	updateForm:PropTypes.func,
	username:PropTypes.string,
};

const defaultProps = {
	subscribers:[]
};

export class ShareView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email:null			
		};
		this.repeatCycles = ['daily', 'weekly', 'monthly'];
		this.days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
		let today = new Date();
		this.repeatOptions = { 
			daily: null,
			weekly:[...this.days],
			monthly:[`day ${today.getDate()}`, `the first ${this.days[today.getDay()]}`]
		};
		
		if (props.reminder && props.reminder.repeatCycle=='monthly'){
			let exists = this.repeatOptions.monthly.find(o=>o==props.reminder.repeatOption);
			if (!exists){
				this.repeatOptions.monthly.push(props.reminder.repeatOption);
			}
		}

		this.handlePublicShare = this.handlePublicShare.bind(this);
		this.handleReminderOn = this.handleReminderOn.bind(this);
		this.addSubscriber = this.addSubscriber.bind(this);
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.handleReleaseError = this.handleReleaseError.bind(this);
		this.handleSelectRepeatCycle = this.handleSelectRepeatCycle.bind(this);
		this.handleSelectRepeatOption = this.handleSelectRepeatOption.bind(this);
		
		
	}
	handlePublicShare(e){
		let checked = e.target.checked;
		console.log('handlePublicShare', checked);
		this.props.updateForm(this.props.formId, { public: checked});
	}
	handleReminderOn(e){
		let checked = e.target.checked;
		
		let reminder = null;
		if (checked){
			reminder = {// default setting
				repeatCycle:'weekly',
				repeatOption:'Mon'
			};
		}
		console.log('handleReminderOn', checked, reminder);
		// this.props.updateForm({ reminder});
		this.props.updateForm(this.props.formId, { reminder});
	}
	addSubscriber(){
		let email = this.state.email;
		function validateEmail(email) {
			var re = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
			return re.test(email);
		}
		if (!validateEmail(email)){
			this.setState({showError:true, error:' The email address is in an invalid format.'});
			return;
		}
		console.log('add subscriber', email);
		let subscribers = this.props.subscribers.concat(email);
		this.props.updateForm(this.props.formId, { subscribers});
		//email check
		// duplicate check
	}
	deleteSubscriber(email){
		let subscribers = this.props.subscribers.filter(e=>e!=email);
		console.log('deleted', subscribers);
		this.props.updateForm(this.props.formId, { subscribers });
	}
	handleSelectRepeatCycle(event){
		let repeatCycle = event.target.value;
		let repeatOption = this.repeatOptions[repeatCycle]?this.repeatOptions[repeatCycle][0]:null;
		let reminder = {
			...this.props.reminder,
			repeatCycle,
			repeatOption			
		};
		
		console.log('handleSelectRepeatCycle', reminder);
		this.props.updateForm(this.props.formId, { reminder});
	}
	handleSelectRepeatOption(event){
		let reminder = {
			...this.props.reminder,
			repeatOption:event.target.value
		};
		console.log('handleSelectRepeatOption', reminder);
		this.props.updateForm(this.props.formId, { reminder});
	}
	
	handleEmailChange(e){
		this.setState({email:e.target.value});
		// this.props.updateQuestion(this.props.questionId, {text:event.target.value});
	}
	handleReleaseError(){
		this.setState({showError:false});
	}

	render() {
		return (
			<div className={css.container}>
				<div className={css.section}>
					<div className={css.header}>
                        Link
					</div>
					<Switch checked={this.props.public} onChange={this.handlePublicShare} label="Share Public?" style={{marginLeft:'0px'}}/>
					<div className={css.flex}>
						<TextField value={window.location.href.replace('edit', 'view')} style={{flexGrow:1, marginRight:'10px'}}/>
						<Button link href={`/forms/view/${this.props.formId}`} outlined target='_blank'>Go to the Link</Button>
					</div>
					<div className={css.note}>
						* &nbsp;{this.props.public?'Anyone with the link can access and fill out the form.'
							:'Only you can access to the form.'}
					</div>
					
				</div>
				<div className={css.section}>
					<div className={css.header}>
                        Reminder
					</div>
					<Switch checked={this.props.reminder!=null} onChange={this.handleReminderOn} label="On?" style={{marginLeft:'0px'}}/>

					{this.props.reminder&&
					<React.Fragment>
						<div className={css.subsection}>
							<div className={css.repeatCycle}>
								Repeat <RadioGroup items={this.repeatCycles}
									checked={this.props.reminder.repeatCycle} 
									onChange={this.handleSelectRepeatCycle} name="cycle" getLabel={d=>d} getValue={d=>d} horizontal/>
							</div>
							{this.repeatOptions[this.props.reminder.repeatCycle] &&
								<div className={css.repeatOption}>
									On <RadioGroup items={this.repeatOptions[this.props.reminder.repeatCycle]}
										checked={this.props.reminder.repeatOption} 
										onChange={this.handleSelectRepeatOption} name="option"  getLabel={d=>d} getValue={d=>d} horizontal/>
								</div>
							}
							
						</div>
						<div className={css.subsection}>
							<div className={css.subheader}>
								Subscriber Emails
							</div>
							<div className={classNames(css.error,{[css.showError]:this.state.showError==true})}>
								{this.state.error}
								<a style={{marginLeft:'10px'}} onPointerUp={this.handleReleaseError}>Clear</a>
							</div>
							<div className={css.flex}>
								<TextField placeholder="Email" style={{flexGrow:1, marginRight:'10px'}} onChange={this.handleEmailChange}/>
								<Button onPointerUp={this.addSubscriber} outlined>Add Subscriber</Button>
							</div>
							
							<div className={css.list}>
								<div className={css.listItem}>
									<div className={css.email} style={{color:'#bdbdbd'}}>{this.props.username}</div>
									<Button disabled>
										<i className="far fa-trash-alt"></i>
									</Button>
								</div>
								{this.props.subscribers.map((email,i)=>(
									<div className={css.listItem} key={i}>
										<div className={css.email}>{email}</div>
										<Button onPointerUp={this.deleteSubscriber.bind(this, email)}>
											<i className="far fa-trash-alt"></i>
										</Button>
									</div>
									
								))}
							</div>
						</div>
					</React.Fragment>
					}
				</div>

			</div>
		);
	}
}

ShareView.propTypes = propTypes;
ShareView.defaultProps = defaultProps;


const mapStateToProps = (state, ownProps) => {
	let formId = ownProps.formId;
	let form = state.forms[formId];

	return {
		...form,
		username:state.auth.username
	};
};

const mapDispatchToProps = (dispatch) => { 	
	return bindActionCreators({
		updateForm
	}, dispatch);
};

export default connect(mapStateToProps,mapDispatchToProps)(ShareView);
