
export const createSelectionTool = (paper, onChanged, onSelected)=>{
	let tool = new paper.Tool();
	tool.name = 'selection';
    
	paper.settings.handleSize=10;
	let mode = null;
	// let hitSize = 4.0;
	let selectionBoundsShape = null;
	let selectionPath = null;
	let selectedItems = null;
	let pivot = null, corner = null, originalSize = null, originalContent=null;
	var sx = 1.0, sy = 1.0;
	// let selectedItems = null;
	// function translateCheck(event){
	// 	let transHit = null;
	// 	// Hit test items.
	// 	if (event.point){
	// 		// hit test with guides first
	// 		transHit = paper.project.activeLayer.hitTest(event.point,
	// 			{ fill:true, stroke:true, tolerance: hitSize });
	// 		return transHit?transHit.item:null;
	// 	}
	// 	return null;
	// }
	function scaleCheck(event){
		let hitSize = 6.0; // a cursor positioned closer than rotation operation
		let scaleHit = null;

		if (!selectionBoundsShape)
			return;
		let bounds = selectionBoundsShape.bounds;
		// Hit test with selection bounding box
		if (event.point)
			scaleHit = selectionBoundsShape.hitTest(event.point,
				{ bounds: true, guides: true, tolerance: hitSize });
		if (scaleHit && scaleHit.type == 'bounds') {
			// show a scale cursor based on the hit location
			// Normalize the direction so that corners are at 45° angles.
			let dir = event.point.subtract(bounds.center);
			dir.x /= bounds.width*0.5;
			dir.y /= bounds.height*0.5;
			return scaleHit;
		}
		return null;
	}
	function clearSelectionBounds() {
		// $log.debug("clearSelectionBounds");
		if (selectionBoundsShape)
			selectionBoundsShape.remove();
		selectionBoundsShape = null;
	}
	function getSelectionBounds(selectedItems) {
		var bounds = null;
		for (var i = 0; i < selectedItems.length; i++) {
			if (bounds == null)
				bounds = selectedItems[i].bounds.clone();
			else
				bounds = bounds.unite(selectedItems[i].bounds);
		}
		return bounds;
	}
	// function getSelectedItems(){
	//     let items = paper.project.selectedItems;//project.selectedItems;
	//     let items = [];
	// 	for (let i = 0; i < items.length; i++) {
	//         if (items[i].locked || !items[i].visible)
	//             continue;
            
	// }
	function updateSelectionState(selectedItems) {
		clearSelectionBounds();
		let selectionBounds = getSelectionBounds(selectedItems);
		if (selectionBounds != null) {
			var rect =  new paper.Path.Rectangle(selectionBounds);
			rect.name = 'selectionBounds';
			rect.strokeColor   = null;
			rect.fillColor     = null;
			rect.strokeWidth   = 0;
			rect.selected = true;
			rect.guide = true;
			selectionBoundsShape = rect;
		}
		paper.project.view.update();
	}

	let oppositeCorner = {
		'top-left': 'bottom-right',
		'top-center': 'bottom-center',
		'top-right': 'bottom-left',
		'right-center': 'left-center',
		'bottom-right': 'top-left',
		'bottom-center': 'top-center',
		'bottom-left': 'top-right',
		'left-center': 'right-center',
	};
	// function dragSelect(p1, p2) {
	// 	let rect = new paper.Path.Rectangle(p1, p2);

	// 	// Create pixel perfect dotted rectable for drag selections.
	// 	// var half = new paper.Point(0.5 / paper.view.zoom, 0.5 / paper.view.zoom);
	// 	// var start = p1.add(half);
	// 	// var end = p2.add(half);
	// 	// var rect = new paper.CompoundPath();
	// 	// rect.moveTo(start);
	// 	// rect.lineTo(new paper.Point(start.x, end.y));
	// 	// rect.lineTo(end);
	// 	// rect.moveTo(start);
	// 	// rect.lineTo(new paper.Point(end.x, start.y));
	// 	// rect.lineTo(end);
	// 	rect.fillColor = new paper.Color(0, 0, 0, 0);
	// 	rect.strokeColor = '#757575';
	// 	rect.strokeWidth = 1.0;// / paper.view.zoom;
	// 	// rect.dashOffset = 1 / paper.view.zoom;
	// 	rect.dashArray = [8,4];// / paper.view.zoom, 2.0 / paper.view.zoom];
	// 	rect.removeOn({
	// 		drag: true,
	// 		up: true
	// 	});
	// 	rect.guide = true;
	// 	return rect;
	// }
	function findItemById(id) {
		if (id == -1) return null;
    
		function findItem(item) {
			if (item.id == id)
				return item;
			if (item.children) {
				for (var j = item.children.length - 1; j >= 0; j--) {
					var it = findItem(item.children[j]);
					if (it != null)
						return it;
				}
			}
			return null;
		}
		let layer = paper.project.activeLayer;
		for (var i = 0, l = layer.children.length; i < l; i++) {
			var item = layer.children[i];
			var it = findItem(item);
			if (it != null)
				return it;
		}
		return null;
	}
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
	function captureSelectionState(selected) {
		// console.log(captureSelectionState, selected);
		let originalContent = [];

		// selected = selected.reduce((acc, item)=>acc.concat(flatten(item)), []);
		for (var i = 0; i < selected.length; i++) {
			var item = selected[i];
			var orig = {
				id: item.id,
				json: item.exportJSON({ asString: false }),
				selectedSegments: []
			};
			originalContent.push(orig);
		}
		return originalContent;
	}
	function restoreSelectionState(originalContent) {
		// TODO: could use findItemById() instead.
		for (var i = 0; i < originalContent.length; i++) {
			var orig = originalContent[i];
			var item = findItemById(orig.id);
			if (!item) continue;
			// HACK: paper does not retain item IDs after importJSON,
			// store the ID here, and restore after deserialization.
			var id = item.id;
			item.importJSON(orig.json);
			item._id = id;
		}
	}
	tool.on({
		activate: ()=>{
			console.log('activate', tool.name);
			onSelected(null);
		},  
		deactivate:()=>{
			console.log('activate', tool.name);
			if (selectionPath){
				selectionPath.remove();
				selectionPath=null;
				selectedItems=null;
				clearSelectionBounds();
			}
			onSelected(null);
			// deselect all
		},
		mousedown:(e)=>{
			// deselect all
			// paper.project.deselectAll();
			let hit = scaleCheck(e);
			if (hit){
				mode='scale';
				console.log('scale hit', hit.name);
				originalContent = captureSelectionState(selectedItems);
				// originalContent = {};
				// selectedItems.forEach(item=>{//save original
				// 	originalContent[item.id] = {
				// 		scaling: item.scaling.clone(),
				// 		position: item.position.clone()
				// 	};
				// });
				let pivotName 	= paper.Base.camelize(oppositeCorner[hit.name]);
				let cornerName 	= paper.Base.camelize(hit.name);
				// $log.debug(pivotName + ", " + cornerName)
				let bounds = selectionBoundsShape.bounds;
				pivot 	= bounds[pivotName].clone();
				corner 	= bounds[cornerName].clone();
				originalSize	= corner.subtract(pivot);

			}else if (selectionPath && (selectionPath.contains(e.point)||
                selectionBoundsShape.contains(e.point))){
				mode='move';
			}else{
				if (selectionPath){
					selectionPath.remove();
					selectionPath = null;
				}
				mode='lasso-select';
				selectionPath = new paper.Path({
					segments: [e.point],
					strokeWidth:1,
					strokeColor: '#757575',
					dashArray:[8, 4],
					guide:true
				});
			}
		},
		mousedrag:(e)=>{
			if (mode=='move'){
				var delta = e.point.subtract(e.lastPoint);
				for (var i = 0; i < selectedItems.length; i++) {
					selectedItems[i].position = selectedItems[i].position.add(delta);
				}
			}else if (mode=='lasso-select'){
				// dragSelect(e.downPoint, e.point);
				selectionPath.add(e.point);
			}else if (mode=='scale'){
				var p = pivot;
				var o = originalSize;
				corner = corner.add(e.delta);

				var size = corner.subtract(p);
				sx = 1.0, sy = 1.0;
				if (Math.abs(o.x) > 0.0000001)
					sx = size.x / o.x;
				if (Math.abs(o.y) > 0.0000001)
					sy = size.y / o.y;
				restoreSelectionState(originalContent);
				for (let i = 0; i < selectedItems.length; i++) {
					var item = selectedItems[i];
					item.scale(sx,sy, p);
					// item.position = item.position.add(e.delta.multiply(0.5));
					// item.scaling = new paper.Point(sx, sy);
					// console.log(item.id, item.scaling, item.position);
				}
			}
		},
		mouseup:()=>{
			if (mode=='lasso-select'){
				selectionPath.closed = true;
				selectedItems = [];
				let items = paper.project.activeLayer.children;
				for (let i=0; i<items.length; i++){
					let item = items[i];
					if (selectionPath.equals(item)){
						continue;
					}
					let descendents = flatten(item);
					if (descendents.some(descendent=>selectionPath.intersects(descendent)) || selectionPath.contains(item.bounds)){
						selectedItems.push(item);
					}
				}
				if (selectedItems.length==0){
					selectionPath.remove();
					selectionPath=null;
					selectedItems=null;
					clearSelectionBounds();
					onSelected(null);
				}else{
					updateSelectionState(selectedItems);
					onSelected(selectedItems.filter(item=>item.guide==false));
					selectedItems.push(selectionPath);
					selectedItems.push(selectionBoundsShape);
				}
			}else if (mode=='scale'){
				onChanged(selectedItems.filter(item=>item!=selectionPath && item!=selectionBoundsShape), mode, sx,sy,pivot);
			}else if (mode=='move'){
				
				onChanged(selectedItems.filter(item=>item!=selectionPath && item!=selectionBoundsShape), mode);
			}
			mode=null;
			
		}
	});
	return tool;
};

export default {
	create:createSelectionTool
};