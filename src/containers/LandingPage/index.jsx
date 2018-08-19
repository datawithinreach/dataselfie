import React from 'react';
import {connect} from 'react-redux';
// import PropTypes from 'prop-types';
import css from './index.css';
import Button from 'components/Button';

export class LandingPage extends React.Component {
	render() {
		return (
			<div className={css.container}>
				<div className={css.section}>
					<div className={css.subsection}>
						<div className={css.header}>Empowering People to Create a Personalized Visuals to Represent Data</div>
						<div className={css.description}>Create a questionnaire to ask questions about qualitative and nuanced aspects of ourselves and to design a personalized visual vocabulary to represent the collected data.</div>
						<br></br>
						<Button label="Sign Up" style={{marginLeft:0}}/>
						<Button label="See Examples" style={{marginLeft:0}}/>
					</div>
					<div className={css.subsection}>
						<video autoPlay muted loop>
							<source src="assets/videos/teaser.mp4" type="video/mp4"/>
						</video>
					</div>
				</div>
			</div>
	
		);
	}
}

LandingPage.propTypes = {};


const mapStateToProps = (state) => {
	return state;
};

// const mapDispatchToProps = (dispatch) => {
// 	return {bindActionCreators(uiActions, dispatch)};
// };

export default connect(mapStateToProps)(LandingPage);
