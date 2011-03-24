Ext.ns("Phi.view.panel");
/**
* @class Philosophy.view.panel.ResumeLayer
* 
* Philosophy resume layers panel (Dashboard)
* display current applied layers.
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
* 
*/
Phi.view.panel.ResumeLayer = Ext.extend(Ext.Panel, {
	title: Phi.Globalization.For('Layer Resume'),
	layout: 'fit',
	forceLayout: true,
	initComponent: function () {

		var _this = this;

		this.tbar = new Ext.Toolbar({
			items: [
			{
				text: Phi.Globalization.For('Search'),
				iconCls: 'icon-search-list',
				tooltip: { title: Phi.Globalization.For('Search'), text: Phi.Globalization.For('Search Desc') },
				handler: this.showSearch
			}
			,
			{ xtype: 'tbfill' }
			, 
			{
				text: '',
				iconCls: 'icon-delete',
				scope: this,
				handler: this.removeLayers,
				text: 'Remove'
			}
			,
			{
				text: '',
				iconCls: 'icon-zoom',
				handler: this.zoomLayers,
				text: 'Zoom'
			}
			]
		});

		var store = new Ext.data.JsonStore({
			idProperty: 'name',
			fields: ['name', 'title', 'srid']
		});

		var dd = new Ext.ux.dd.GridDragDropRowOrder({
			copy: false,
			scrollable: true
		});

		dd.on('afterrowmove', function () {
			_this.apply();
		});

		this.grid = new Ext.grid.GridPanel({
			store: store,
			enableDragDrop: true,
			ddGroup: 'GridDD',
			plugins: [dd],
			columns: [
				{ header: '', width: 30, sortable: false, renderer: _this.renderLegend, dataIndex: 'name' },
				{ header: Phi.Globalization.For('Layers'), width: 240, sortable: true, dataIndex: 'title'}]
		});

		this.grid.on('sortchange', function () {
			this.apply();
		}, this);

        // context Menu 
		function onGridContextMenu(grid, rowIndex, e) {
			e.stopEvent();
			var coords = e.getXY();
			_this.layerContextMenu.showAt([coords[0], coords[1]]);
			_this.grid.getSelectionModel().clearSelections();
			_this.grid.getSelectionModel().selectRow(rowIndex);

			_this.layerContextMenu.layerName = _this.getlayerNameFromSelection();
			_this.layerContextMenu.rowIndex = rowIndex;
		}

		this.grid.addListener('rowcontextmenu', onGridContextMenu);
		this.layerContextMenu = new Phi.view.menu.Layer({ enableRemoveLayer: true });
		this.layerContextMenu.on('removeLayer', function (layerName, node, rowIndex) {
			this.removeLayer(rowIndex);
		},this);

		this.items = [this.grid];

		Phi.view.panel.ResumeLayer.superclass.initComponent.call(this);
		this.update();
    }
	,
	zoomLayers: function() {
		
		var zoom = function(bbox){
			var bound = new OpenLayers.Bounds(bbox.xmin, bbox.ymin, bbox.xmax, bbox.ymax);
			Phi.Map.zoomToExtent(bound, true);
		};
		
		var group = new Geo.core.Group();
		group.on('staticbbox', zoom, this);
		group.getStaticBBox(Phi.Layer.appliedLayers);
	}
	,
	showSearch: function () {
		var win = new Phi.view.window.SearchLayer();
		win.show();
	}
	,
	update: function () {
		this.grid.store.loadData(Phi.Layer.appliedLayers);
	}
	,
	renderLegend: function (val, m, record) {
		var src = Phi.Config.wmsLegend + Phi.Config.wmsNameSpace + ':' + val.split('.')[1];
		return '<img src="' + src + '" style="border:1px solid #ccc;" />';
	}
	,
	getlayerNameFromSelection: function () {
		var s = this.grid.getSelectionModel().getSelections();
		return s[0].data.name;
	}
	,
	getlayersFromStore: function () {
		var _this = this;
		var layers = [];

		for (var i = 0, len = _this.grid.store.getTotalCount(); i < len; i++) {
			var r = _this.grid.store.getAt(i);
			var name = r.get('name');
			var title = r.get('title');
			var srid = r.get('srid');
			var layer = { 'name': name, 'title': title, 'srid':srid };
			layers.push(layer);
		}
		return layers;
	}
	,
	apply: function () {
		var _this = this;
		var container = Ext.get('map');
		Phi.Util.popupMessage(Phi.Globalization.For('Updating...'), '', container);

		var layers = _this.getlayersFromStore();
		Phi.Layer.appliedLayers = layers;
		Phi.Map.redrawMainLayer(Philosophy.Layer.getWMSLayers(Philosophy.Config.wmsNameSpace));
	}
	,
	removeLayer: function (rowIndex) {

		// validation 
		var layers = this.getlayersFromStore();

		if (layers.length === 1) {
			Ext.MessageBox.alert(Phi.Globalization.For('Warning'), Phi.Globalization.For('Cant remove one layer'));
			return;
		}

		var r = this.grid.store.getAt(rowIndex);
		var name = r.get('name');

		for (i = 0; i < Phi.Layer.appliedLayers.length; i++) {
			if (Phi.Layer.appliedLayers[i].name === name) {
				Phi.Layer.appliedLayers.remove(Phi.Layer.appliedLayers[i]);
				break;
			}
		}

		this.update();
		this.apply();
	}
	,
	removeLayers: function(){
		
		// validation 
		var layers = this.getSelections();

		if (layers.length === Phi.Layer.appliedLayers.length) {
			Ext.MessageBox.alert(Phi.Globalization.For('Warning'), Phi.Globalization.For('Cant remove all layers'));
			return;
		}
		
		Ext.each(layers, function(l){
			var name = l.data.name;
			var al = Phi.Layer.getLayerById(name);
			if (al)
				Phi.Layer.appliedLayers.remove(al);
		});

		this.update();
		this.apply();
	}
	,
	getSelections: function () {
		var sm = this.grid.getSelectionModel();
		return sm.getSelections();
	}
});  // eo Phi.view.panel.ResumeLayer
// eof
