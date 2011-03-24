Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.GenericLayersGrid
* @extends Ext.Window
* 
* Philosophy generic grid layer, widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.GenericLayersGrid = Ext.extend(Ext.Window, {
	closeAction: 'close',
	maximizable: false,
	modal: true,
	plain: true,
	layout: 'border',
	data: null,
	initComponent: function () {

		var ds = new Ext.data.Store({
			data: this.data,
			reader: new Ext.data.JsonReader({ fields: ["name"] })
		});

		var renderLegend = function (val, m, record) {
			var src = Philosophy.Config.wmsLegend + Philosophy.Config.wmsNameSpace + ':' + val.split('.')[1];
			return '<img src="' + src + '" style="border:1px solid #ccc;" />';
		};
		
		var renderLayer = function(val){
			return val.split('.')[1];
		};

		var cm = new Ext.grid.ColumnModel([
			{ header: '', width: 30, sortable: false, renderer: renderLegend, dataIndex: 'name' },
			{ header: Phi.Global.For('Layer'), dataIndex: 'name', width: 140, renderer: renderLayer},
			{ header: '', dataIndex: 'name', hidden: true }
		]);
		
		var view = new Ext.grid.GridView({
			forceFit: false,
			enableRowBody: true,
			ignoreAdd: true,
			emptyText: Phi.Globalization.For('No record found')
		});

		this.grid = new Ext.grid.GridPanel({
			region: 'center',
			loadMask: true,
			frame: true,
			header: false,
			view: view,
			ds: ds,
			cm: cm
		});

		// context Menu 
		function onGridContextMenu(grid, rowIndex, e) {
			e.stopEvent();
			var coords = e.getXY();
			this.layerContextMenu.showAt([coords[0], coords[1]]);
			this.grid.getSelectionModel().clearSelections();
			this.grid.getSelectionModel().selectRow(rowIndex);
			var layerName = this.getlayerNameFromSelection();
			this.layerContextMenu.layerName = layerName;
		}

		this.grid.on('rowcontextmenu', onGridContextMenu, this);
		this.layerContextMenu = new Phi.view.menu.Layer();

		this.items = [this.grid];
		
		Phi.view.window.GenericLayersGrid.superclass.initComponent.call(this);

		this.addButton(Phi.Globalization.For('Close'), this.close, this);
	}
	,
	getlayerNameFromSelection: function () {
		var s = this.grid.getSelectionModel().getSelections();
		return s[0].data.name;
	}
});//eo Phi.view.window.GenericLayersGrid
// eof