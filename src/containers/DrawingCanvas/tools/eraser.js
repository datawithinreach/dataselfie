export const createEraserTool = (paper, onRemoved)=>{
	let tool = new paper.Tool();
	tool.name = 'eraser';
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
					segments: [e.point],
					strokeWidth: 2,
					strokeColor: '#9e9e9e',
					opacity: 1,
					dashArray:[5,5]
				});
			}else{
				path.add(e.point);
			}
		},
		mouseup:()=>{
			if (path){

				let removed = [];
				// remove items only in the active layer
				paper.project.activeLayer.children.forEach(child=>{
					if (path==child){
						return;
					}							
					if (child.intersects(path)){
						removed.push(child);
					}
					// intersects with group?
					if (child instanceof paper.Group &&
                        child.getItems().some(d=>d.intersects(path))){
						removed.push(child);
					}
				});
				onRemoved(removed);
				
				removed.forEach(item=>item.remove()); //remove from canvas
				path.remove();
				path = null;
			}
		}
	});
	return tool;
};

export default {
	create:createEraserTool
};