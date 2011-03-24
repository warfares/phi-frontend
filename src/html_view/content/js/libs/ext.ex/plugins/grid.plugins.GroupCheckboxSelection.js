Ext.namespace("Ext.ux.grid.plugins");

Ext.ux.grid.plugins.GroupCheckboxSelection = {

	init: function(grid){

		grid.view.groupTextTpl =	
			'<input type="checkbox" ' +
			'class="x-grid-group-checkbox" x-grid-group-hd-text="{text}" /> ' +
			grid.view.groupTextTpl;
	
		grid.on('render', function() {
			Ext.ux.grid.plugins.GroupCheckboxSelection.initBehaviors(grid);
		});
	
		grid.view.on('refresh', function() {
			Ext.ux.grid.plugins.GroupCheckboxSelection.initBehaviors(grid);
		});
	},
	
	initBehaviors: function(grid) {
		var id = "#" + grid.id;
		var behaviors = {};

		// Check/Uncheck all items in group
		behaviors[id + ' .x-grid-group-hd .x-grid-group-checkbox@click'] =
			function(e, target){

				var ds = grid.getStore();
				var sm = grid.getSelectionModel();
				var cm = grid.getColumnModel();
				
				var text = target.getAttribute("x-grid-group-hd-text");
				var parts = text.split(":");
				
				var value = parts[1].trim();
				var header = parts[0].trim();
				var field = cm.getColumnsBy(function(columnConfig, index){
					return (columnConfig.header == header);
				})[0].dataIndex;
				
				var records = ds.query(field, value).items;
				
				for(var i = 0, len = records.length; i < len; i++){
					var row = ds.indexOf(records[i]);
					if (target.checked) {
						sm.selectRow(row, true);
					}
					else {
						sm.deselectRow(row);
					}
				}
			};

		// Avoid group expand/collapse clicking on checkbox
		behaviors[id + ' .x-grid-group-hd .x-grid-group-checkbox@mousedown'] =
			function(e, target){
				e.stopPropagation();
			};
		
		Ext.addBehaviors(behaviors);
	}

};

