export const createEraserTool = (paper, onFilled)=>{
	let tool = new paper.Tool();
	tool.name = 'fill';
    
	function flatten(item) {
		
		if (!item.children) {
			return [item];
		}
		var items = [];		
		// task.call(this, item); //call task function
		function checkPathItem(item) {
			if (item.locked || !item.visible)
				return;
			if (item instanceof paper.Group) {
				var children = item.children;
				for (var j = children.length - 1; j >= 0; j--)
					checkPathItem(children[j]);
				
			}else{
				items.push(item);
				return;
			}
			
    
		}
		for (var i = item.children.length - 1; i >= 0; i--) {
			checkPathItem(item.children[i]);
		}
    
		return items;
	}
	tool.on({
		activate: ()=>{
			console.log('activate', tool.name);
		},
		deactivate:()=>{
			console.log('activate', tool.name);
		},
	
		mouseup:(e)=>{
			
			for (let i=0; i<paper.project.activeLayer.children.length; i++){
				let item =  paper.project.activeLayer.children[i];
				let descendents = flatten(paper.project.activeLayer);
				let found = descendents.find(d=>d.contains(e.point));
				console.log('fill', descendents, found);
				if (found){
					found.fillColor = paper.project.currentStyle.strokeColor;
					onFilled(item);
					break;
				}

				// descendents.forEach(d=>{})
				// if (item.contains(e.point)){// && (item instanceof paper.PathItem||item instanceof paper.Shape)){
				// 	item.fillColor = paper.project.currentStyle.strokeColor;
				// 	onFilled(item);
				// 	break;
				// }
			}
		}
	});
	return tool;
};

export default {
	create:createEraserTool
};