import React from 'react';
// import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import TextField from '../../components/TextField';
import TextArea from '../../components/TextArea';
import css from './index.css';
// import bindActionCreators from 'redux'; import css from './index.css'; import
/* // {actions as uiActions} from '../ducks/ui'; Show either PageList or Page
 * depending on the current mode
* and provides an option to navigate between
 * them
 */
export class Form extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	handleTouchStart(e) {
		console.log(e);
	}
	render() {
		return (
			<div className={css.container}>
				<div className={css.menu}>
					<div className={css.menuItem}>Design</div>
					<div className={css.menuItem}>Preview</div>
					<div className={css.menuItem}>Responses</div>
				</div>
				<div className={css.title}>
					<TextField placeholder={'Enter title'} fontSize={24}/>
				</div>
				<div className={css.description}>
					<TextArea placeholder={'Enter description'} fontSize={14}/>
				</div>


				<div className={css.content}>

					<div className={css.questions}>
						<div className={css.question}>
							
						</div>
						<div className={css.question}>

						</div>
						<div className={css.question}>

						</div>
						<div className={css.question}>

						</div>
						<div className={css.question}>

						</div>

						<div className={css.addQuestion}>
							<div className={css.label}>Add question</div>
							<div className={css.typeContainer}>
								<div className={css.type}>
									<div className={css.label}>Date</div>
									<img src="assets/img/type_date.png"/>
								</div>
								<div className={css.type}>
									<div className={css.label}>Short Text</div>
									<img src="assets/img/type_shorttext.png"/>

								</div>
								<div className={css.type}>
									<div className={css.label}>Multiple Choice</div>
									<img src="assets/img/type_multiplechoice.png"/>
								</div>
								<div className={css.type}>
									<div className={css.label}>Checkboxes</div>
									<img src="assets/img/type_checkboxes.png"/>
								</div>
								<div className={css.type}>
									<div className={css.label}>Linear Scale</div>
									<img src="assets/img/type_linearscale.png"/>
								</div>
							</div>
						</div>
					</div>
					<div className={css.drawings}>
						<canvas className={css.canvas}></canvas>
					</div>
				</div>

			</div>
		);
	}
}

Form.propTypes = {};

const mapStateToProps = (state) => {
	return state;
};

// const mapDispatchToProps = (dispatch) => { 	return
// {bindActionCreators(uiActions, dispatch)}; };

export default connect(mapStateToProps)(Form);
