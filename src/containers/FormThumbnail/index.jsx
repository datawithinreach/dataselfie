import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { push } from 'react-router-redux';
import css from './index.css';
import {selectForm, openForm} from 'ducks/ui';
import {deleteForm} from 'ducks/forms';
import Button from 'components/Button';
/* encapsulate react-input-range*/
export class FormThumbnail extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			confirmDelete:false 
		};
		
		this.handleDelete = this.handleDelete.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		
		this.confirmDelete = this.confirmDelete.bind(this);
		this.cancelDelete = this.cancelDelete.bind(this);

		// this.handleShowMenu = this.handleShowMenu.bind(this);
		// this.handleHideMenu = this.handleHideMenu.bind(this);
	}
	// handleShowMenu(){
	// 	this.setState({showMenu:true});
	// }
	// handleHideMenu(){
	// 	this.setState({showMenu:false});
	// }
	handleOpen(){
		this.props.openForm(this.props.id);
	}
	handleDelete(){
		this.setState({confirmDelete:true});
	}
	confirmDelete(){
		this.props.deleteForm(this.props.id);
	}
	cancelDelete(){
		this.setState({confirmDelete:false});
	}
	handleSelect(e){
		e.stopPropagation();
		console.log(this.props);
		
		this.props.selectForm(this.props.id);
		// this.setState({selected:!this.state.selected});
	}	
	
	render() {
		// const otherProps = Object.assign({}, this.props);
		// Object.keys(FormThumbnail.propTypes).forEach(k=>delete otherProps[k]);
		console.log('render Thumbnail', this.props.selected);
		return (
			
			<div 
				className={[css.formThumbnail,
					this.props.selected? css.selected:''].join(' ')}
				style={{
					width: this.props.width + 'px',
					height: this.props.height  + 'px'
				}}
				onPointerUp={this.handleSelect}
				// onPointerEnter={this.handleShowMenu} onPointerLeave={this.handleHideMenu}
			>
				<div className={css.title}>{this.props.title}</div>
				{this.props.selected&&<div className={css.overlay} style={{opacity:0.9}}>
					<Button className={css.deleteBtn}
						onPointerUp={this.handleDelete}>
						<i className="fas fa-trash-alt"></i>
						{/* <img src="assets/icons/trash.svg"/> */}
					</Button>
					{this.state.confirmDelete?
						<div className={css.confirmPopup}>
							<Button onPointerUp={this.confirmDelete}>Delete</Button>
							<Button onPointerUp={this.cancelDelete}>Cancel</Button>
						</div>
						:
						<Button onPointerUp={this.handleOpen}>Open</Button>
					}
				</div>}
			</div>
				
		);
	}
}
FormThumbnail.propTypes = {
	id:PropTypes.string,
	x: PropTypes.number,
	y: PropTypes.number,
	title:PropTypes.string,
	width: PropTypes.number,
	height: PropTypes.number,
	selected: PropTypes.bool,
	thumbnail:PropTypes.string,
	openForm:PropTypes.func,
	deleteForm:PropTypes.func,
	selectForm:PropTypes.func
};
FormThumbnail.defaultProps = {
	width:300,
	height: 320
};

	
	
const mapStateToProps = (state, ownProps) => {
	return {
		...state.forms[ownProps.id],
		selected: state.ui.selectedForm==ownProps.id
	};
};
	
const mapDispatchToProps = (dispatch) => {
	return {
		...bindActionCreators({
			selectForm,
			deleteForm
		}, dispatch),
		openForm:(id)=>{
			dispatch(openForm(id));
			dispatch(push(`/forms/edit/${id}`));
		}
	};
};
	
export default connect(mapStateToProps, mapDispatchToProps)(FormThumbnail);
	