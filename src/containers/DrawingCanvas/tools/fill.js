export const createEraserTool = (paper)=>{
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
			var children = item.children;
    
			if (!children) {
				items.push(item);
				return;
			}
			for (var j = children.length - 1; j >= 0; j--)
				checkPathItem(children[j]);
    
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
			let items = flatten(paper.project.activeLayer);
			for (let i=0; i<items.length; i++){
				let item =  items[i];
				if (item.contains(e.point)){// && (item instanceof paper.PathItem||item instanceof paper.Shape)){
					console.log(item, paper.project.currentStyle);
					item.fillColor = paper.project.currentStyle.strokeColor;
					break;
				}
			}
		}
	});
	return tool;
};

export default {
	create:createEraserTool
};