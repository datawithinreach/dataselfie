import React from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { push } from 'react-router-redux';
import css from './index.css';
// import {selectPage, openForm} from 'ducks/ui';
import {deleteForm} from 'ducks/forms';
/* encapsulate react-input-range*/
export class FormThumbnail extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			selected:false,
			confirmDelete:false 
		};
        
		this.handleDelete = this.handleDelete.bind(this);
		this.handleOpen = this.handleOpen.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
        
		this.confirmDelete = this.confirmDelete.bind(this);
		this.cancelDelete = this.cancelDelete.bind(this);
	}
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
	handleSelect(){
		// this.props.selectPage(this.props.id);
		this.setState({selected:!this.state.selected});
	}
    
    
	render() {
		// const otherProps = Object.assign({}, this.props);
		// Object.keys(FormThumbnail.propTypes).forEach(k=>delete otherProps[k]);
		return (
            
			<div 
				className={[css.formThumbnail,
					this.state.selected? css.selected:''].join(' ')}
				style={{
					width: this.props.width + 'px',
					height: this.props.height  + 'px'
				}}
				onMouseUp={this.handleSelect}
				onTouchEnd={this.handleSelect}>
				{this.props.thumbnail?
					<img className={css.formThumbnailImg}
						draggable="false"
						src={this.props.thumbnail}/>:
					<div className={css.empty}>Empty</div>
				}
				{/* {this.state.selected &&
                    <div className={css.overlay} >
                    	<div className={css.deleteBtn}
                    		onMouseUp={this.handleDelete}
                    		onTouchEnd={this.handleDelete}>
                    		<img src="assets/icons/trash.svg"/>
                    	</div>
                    	{this.state.confirmDelete?
                    		<div className={css.confirmPopup}>
                    			<div className={css.confirmDelete}
                    				onMouseUp={this.confirmDelete}
                    				onTouchEnd={this.confirmDelete}>Delete</div>
                    			<div className={css.cancelDelete}
                    				onMouseUp={this.cancelDelete}
                    				onTouchEnd={this.cancelDelete}>Cancel</div>
                    		</div>
                    		:
                    		<div className={css.openBtn}
                    			onMouseUp={this.handleOpen}
                    			onTouchEnd={this.handleOpen}
                    		>Open</div>
                    	}
                    </div>} */}
			</div>
                
		);
	}
}
FormThumbnail.propTypes = {
	id:PropTypes.string,
	x: PropTypes.number,
	y: PropTypes.number,
	width: PropTypes.number,
	height: PropTypes.number,
	thumbnail:PropTypes.string,
	openForm:PropTypes.func,
	deleteForm:PropTypes.func,
};
FormThumbnail.defaultProps  = {
	selected:false
};
    
    
const mapStateToProps = (state, ownProps) => {
	return {
		...state.forms[ownProps.id]
	};
};
    
const mapDispatchToProps = (dispatch) => {
	return {
		...bindActionCreators({
			deleteForm
		}, dispatch),
		openForm:(id)=>{
			// dispatch(openForm(id));
			dispatch(push(`/form/${id}`));
		}
	};
};
    
export default connect(mapStateToProps, mapDispatchToProps)(FormThumbnail);
    