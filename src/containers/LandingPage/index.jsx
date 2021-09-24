import React from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import css from './index.css';
import Button from 'components/Button';

export class LandingPage extends React.Component {
	render() {
		return (
			<div className={css.container}>
				<div className={css.firstsection}>
					<div className={css.subsection}>
						<div className={css.nosupport}>Sorry, the app is no longer supported.</div>
						<div className={css.header}>Designing a Personalized Visual Questionnaire</div>

						<div className={css.description}>Create a questionnaire to ask questions about qualitative and nuanced aspects of ourselves and to design a personalized visual vocabulary to represent the collected data.</div>
						<br></br>
						<div className={css.pubMaterials}>
							<Button outlined style={{ marginLeft: 0 }} link href="https://www.namwkim.org/assets/files/publications/conference/dataselfie-empowering-people-to-design-personalized-visuals-to-represent-their-data/paper.pdf" target="_blank">Paper</Button>
							<Button outlined link href="https://www.namwkim.org/assets/files/publications/conference/dataselfie-empowering-people-to-design-personalized-visuals-to-represent-their-data/supplement.zip" target="_blank">Supplement</Button>
							<Button outlined link href="https://www.namwkim.org/assets/files/publications/conference/dataselfie-empowering-people-to-design-personalized-visuals-to-represent-their-data/video.mp4" target="_blank">Video</Button>
							<Button outlined link href="https://github.com/playfuldata/dataselfie" target="_blank">Code</Button>
						</div>
						<div className={css.venue}>
							Published in <a href="http://chi2019.acm.org/" target="_blank" rel="noopener noreferrer">CHI 2019</a>
						</div>
						<div className={css.authors}>
							Created by Nam Wook Kim, Hyejin Im, Nathalie Henry Riche, Alicia Wang, Krzysztof Z. Gajos, Hanspeter Pfister
						</div>
						{/* <Button outlined style={{marginLeft:0}}>Sign Up</Button> */}
						{/* <Button href="#examples"outlined style={{marginLeft:0}} link>See Examples</Button> */}
					</div>
					<div className={css.subsection}>
						<video autoPlay muted loop>
							<source src="assets/videos/teaser.m4v" type="video/mp4" />
						</video>
					</div>
				</div>
				{/* <div className={css.section}>
					<div className={css.sectionTitle}>Publication</div>
					<div className={css.publication}>
						<div className={css.pubTitle}>DataSelfie: Empowering People to Design Personalized Visuals to Represent Their Data</div>
						<div className={css.pubAuthors}>Nam Wook Kim, Hyejin Im, Nathalie Henry Riche, Alicia Wang, Krzysztof Z. Gajos, Hanspeter Pfister</div>
						<div className={css.pubVenue}><em>ACM Conference on Human Factors in Computing Systems (CHI), 2019 </em></div>
						<div className={css.pubMaterials}>
							<Button outlined style={{marginLeft:0}} link href="https://www.namwkim.org/assets/files/publications/conference/dataselfie-empowering-people-to-design-personalized-visuals-to-represent-their-data/paper.pdf" target="_blank">Paper</Button>	
							<Button outlined link href="https://www.namwkim.org/assets/files/publications/conference/dataselfie-empowering-people-to-design-personalized-visuals-to-represent-their-data/supplement.zip" target="_blank">Supplement</Button>	
							<Button outlined link href="https://www.namwkim.org/assets/files/publications/conference/dataselfie-empowering-people-to-design-personalized-visuals-to-represent-their-data/video.mp4" target="_blank">Video</Button>	
							<Button outlined link href="https://github.com/namwkim/dataselfie/" target="_blank">Code</Button>	
						</div>
					</div>
				</div> */}
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
