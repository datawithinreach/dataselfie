import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {createResponse} from 'ducks/responses';
import classNames from 'utils/classNames';
import TextField from 'components/TextField';
import RadioGroup from 'components/RadioGroup';

import css from './index.css';


class Viewer extends Component {
	constructor(props){
		super(props);
		this.state = {
			curStep: -1,
			response:{},
			showError:false
		};
		this.changeStep = this.changeStep.bind(this);
		this.nextItem = this.nextItem.bind(this);
		this.prevItem = this.prevItem.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.handleIdChange = this.handleIdChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	static getDerivedStateFromProps (){
		// restart the form
		return  {
			curStep: -1,
			response:{},
			showError:false
		};
	}

	changeStep(e){
		console.log('changeStep',e.target);
		this.setState({curStep:parseInt(e.target.dataset.step)});
	}
	prevItem(){
		if (this.state.curStep-1>=-1){
			this.setState({curStep:this.state.curStep-1});
		}			
	}
	nextItem(){
		if (this.state.curStep+1<this.props.items.length){
			this.setState({curStep:this.state.curStep+1});
		}	
	}
	getCurItem(){
		let {curStep} = this.state;
		let {items} = this.props;
		return curStep>=0 && curStep<items.length? items[curStep]:null;
	}
	handleSelect(event){
		console.log('selected',event.target.value);
		let curItem = this.getCurItem();
		this.setState({response:{
			...this.state.response,
			[curItem.id]:event.target.value
		}});
	}
	handleIdChange(event){
		console.log('handleIdChange',event.target.value);
		let response = {
			...this.state.response,
			id:event.target.value
		};
		console.log('response', response);
		this.setState({response});
	}
	handleSubmit(){
		let {response} = this.state;
		let {items} = this.props;
		if (response.id && items.every(item=>response[item.id])){
			console.log('submitting', this.state.response);			
			this.props.createResponse(this.props.formId, {response});
		}else{
			let missing =  items.length - items.filter(item=>response[item.id]).length;
			missing += (response.id?0:1);
			this.setState({showError:true, error:`There ${missing>1?'are':'is'} ${missing} missing fields in this form.`});

			setTimeout(() => {
				console.log('hide error');
				this.setState({showError:false});
			}, 2000);
		}
		
	}
	render() {
		let {curStep, response} = this.state;
		console.log('response',response.id);
		let {items} = this.props;
		let curItem = this.getCurItem();
		return (
			<div>
				<div className={css.progress}>
					<div className={classNames(css.start,css.marker,{[css.current]:-1==curStep,  [css.incomplete]: -1<curStep && response.id==null})} data-step={-1} onMouseUp={this.changeStep}>
					0
					</div>
					{items.map((item, i)=>
						<Fragment key={i}>
							<div className={css.bar}/>
							<div className={classNames(css.marker,{[css.current]:i==curStep, [css.incomplete]: i<curStep && response[this.props.items[i].id]==null})} 
								data-step={i} onMouseUp={this.changeStep}>
								{i+1}
							</div>
						</Fragment>
					)
					}
				</div>
				<div className={css.content}>
					<div className={classNames(css.error,{[css.showError]:this.state.showError==true})}>
						{this.state.error}
					</div>
					{curStep==-1&&(	
						<Fragment>
							{/* <div>
								<div className={css.button} onMouseUp={this.prevItem}>
									<i className="fas fa-arrow-left"></i>
								</div>
								<div className={css.button} onMouseUp={this.nextItem}>
									<i className="fas fa-arrow-right"></i>
								</div>
							</div> */}
							<div className={css.title}>{this.props.title}</div>
							<br/>
							<div>{this.props.description}</div>
							<br/>				
							{/* <div>Please write down any identifier for your response such as a name or date.</div>									 */}
							<TextField placeholder='ID, e.g., name or date'	
								value={response.id? response.id: ''}
								onChange={this.handleIdChange}/>
						</Fragment>
						
					)}
					{curStep!=-1&&(
						<Fragment>
							<div className={css.question}>
								<div>{curItem.question}</div>
							</div>
							<RadioGroup items={curItem.choices}
								checked={response[curItem.id]} 
								onChange={this.handleSelect}/>
							{/* <div className={css.choices}>
								{curItem&&curItem.choices.map((choice)=>
									<div key={choice.id} className={css.choice}>		
										<div>{choice.text}</div>
									</div>
								)}
								
							</div> */}
						</Fragment>
					)}
				</div>
				{curStep>=0&&
					<div className={css.button} onMouseUp={this.prevItem}>
						<i className="fas fa-arrow-left"></i> Prev
					</div>
				}
				{curStep<(items.length-1) &&
					<div className={css.button} onMouseUp={this.nextItem}>
						<i className="fas fa-arrow-right"></i> Next
					</div>
				}
				{curStep==(items.length-1) &&
					<div className={css.button} onMouseUp={this.handleSubmit}>
						Submit
					</div>
				}
			</div>
		);
	}
}

Viewer.propTypes = {
	formId:PropTypes.string,
	title:PropTypes.string,
	description:PropTypes.string,
	items:PropTypes.array,
	createResponse:PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
	let formId = ownProps.formId;
	let form = state.forms[formId];
	let items = form.items.map(iid=>{
		let item = state.items[iid];
		return {
			...item,
			choices: item.choices.map(cid=>state.choices[cid])
		};
	});
	console.log('items', items);
	return {
		...form,
		items
	};
};

const mapDispatchToProps = (dispatch) => { 	
	return bindActionCreators({
		createResponse
	}, dispatch);
};

export default connect(mapStateToProps,mapDispatchToProps)(Viewer);
