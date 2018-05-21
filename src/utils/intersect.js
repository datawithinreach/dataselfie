//https://bl.ocks.org/bricof/f1f5b4d4bc02cad4dea454a3c5ff8ad7

let between = (a, b1, b2)=>{
	if ((a >= b1) && (a <= b2)) { return true; }
	if ((a >= b2) && (a <= b1)) { return true; }
	return false;
};
  
export let lineIntersect = (line1, line2)=>{
	var x1 = line1[0][0], x2 = line1[1][0], x3 = line2[0][0], x4 = line2[1][0];
	var y1 = line1[0][1], y2 = line1[1][1], y3 = line2[0][1], y4 = line2[1][1];
	var pt_denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
	var pt_x_num = (x1*y2 - y1*x2) * (x3 - x4) - (x1 - x2) * (x3*y4 - y3*x4);
	var pt_y_num = (x1*y2 - y1*x2) * (y3 - y4) - (y1 - y2) * (x3*y4 - y3*x4);
	if (pt_denom == 0) { //parallel
		return false; 
	}
	else { 
		let x = pt_x_num / pt_denom;
		let y = pt_y_num / pt_denom;
		if (between(x, x1, x2) && between(y, y1, y2) 
			&& between(x, x3, x4) && between(y, y3, y4)) {
			return true; 
		}else { 
			return false; 
		}
	}
};

export default (path1, path2)=>{
	if (path1.length<1 || path2.length<1){
		return false;
	}
	for (let i=1; i<path1.length; i++){
		let line1 = [path1[i], path1[i-1]];
		
		for (let j=1; j<path2.length; j++){
			let line2 = [path2[j], path2[j-1]];
			if (lineIntersect(line1, line2)) return true;
		}
	}
	return false;
	
};