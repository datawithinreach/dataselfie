

export const createAutoDrawTool = (paper, onNewPathAdded)=>{
	let tool = new paper.Tool();
	tool.name = 'autodraw';
	let path = null;
	tool.on({
		activate: ()=>{
			console.log('activate', tool.name);
		},
		deactivate:()=>{
			console.log('activate', tool.name);
		},
		mousedrag:(e)=>{
			if (!path){
				path = new paper.Path({
					segments: [e.point]
				});
				let {opacity=1.0} = paper.project.currentStyle;
				path.opacity = opacity;
			}else{
				path.add(e.point);
			}
		},
		mouseup:()=>{
			if (path){
				onNewPathAdded(path);
				path = null;
			}
		}
	});

};

export default {
	create:createAutoDrawTool
};