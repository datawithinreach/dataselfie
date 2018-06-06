//https://github.com/mathieudutour/autodraw

import stencils from 'assets/stencils.json';

var API_ENDPOINT = 'https://inputtools.google.com/request?ime=handwriting&app=autodraw&dbg=1&cs=1&oe=UTF-8';

function boundingRect (shapes) {
	var res = shapes.reduce(function (prev, shape) {
		return shape.reduce(function (prev2, point) {
			if (point.x > prev2.maxX) {
				prev2.maxX = point.x;
			} else if (point.x < prev2.minX) {
				prev2.minX = point.x;
			}
			if (point.y > prev2.maxY) {
				prev2.maxY = point.y;
			} else if (point.y < prev2.minY) {
				prev2.minY = point.y;
			}
			return prev2;
		}, prev);
	}, {
		minX: Infinity,
		maxX: -Infinity,
		minY: Infinity,
		maxY: -Infinity
	});
	shapes.forEach(shape=>shape.forEach(point=>{
		point.x -= res.minX;
		point.y -= res.minY; 
	}));
	return {
		width: res.maxX - res.minX,
		height: res.maxY - res.minY
	};
}

function getResults (data) {
	var regex = /SCORESINKS: (.*) Service_Recognize:/;
	return JSON.parse(data[1][0][3].debug_info.match(regex)[1]);
}

export default function (shapes, frame, startDate) {

	
	if (!Array.isArray(shapes[0])) {
		shapes = [shapes];
	}

	if (typeof frame === 'number') {
		startDate = frame;
		frame = undefined;
	}

	if (!startDate) {
		startDate = 0;
	}

	var ink = shapes.map(function (shape) {
		return shape.reduce(function (prev, point) {
			prev[0].push(point.x);
			prev[1].push(point.y);
			if (point.timestamp) {
				prev[2].push(point.timestamp - startDate);
			}
			return prev;
		}, [[], [], []]);
	});

	if (!frame) {
		frame = boundingRect(shapes);
		console.log(shapes,frame);
	}
	let body = JSON.stringify({
		input_type: 0,
		requests: [{
			language: 'autodraw',
			writing_guide: frame,
			ink: ink
		}]
	});
	console.log(body);
	return fetch(API_ENDPOINT,
		{
			method:'POST',
			body,
			headers: {
				'content-type': 'application/json'
			},
		} ).catch(function (error) {  
		console.log('Request failure: ', error);  
	})
		.then(response=>response.json())
		.then(function (data) {
			if (data[0] !== 'SUCCESS') {
				throw new Error(data);
			}
			var results = getResults(data);
			return results.map(function (result) {
				// var escapedName = result[0].replace(/ /g, '-');
				// console.log(escapedName, stencils[escapedName]);
				return {
					name: result[0],
					confidence: result[1],
					icons: (stencils[result[0]] || []).map(icon => icon.src)
				};
			});
		});
}