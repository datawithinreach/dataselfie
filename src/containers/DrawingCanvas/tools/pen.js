export const createPenTool = (paper, onPathCreated)=>{
	let tool = new paper.Tool();
	tool.name = 'pen';
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
			}else{
				path.add(e.point);
			}
		},
		mouseup:()=>{
			if (path){
				// path.simplify();				
				onPathCreated(path);				
				path = null;
			}
		}
	});
	return tool;

};

export default {
	create:createPenTool
};