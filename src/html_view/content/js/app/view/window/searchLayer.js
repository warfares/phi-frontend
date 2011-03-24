Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.SearchLayer
* @extends Ext.Window
* 
* Philosophy search layers by user, widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.SearchLayer = Ext.extend(Ext.Window, {
	title: '',
	width: 800,
	height: 400,
	pageSize: 100,
	plain: true,
	layout: 'border',
	initComponent: function () {

		var _this = this;

		// results grid
		var reader = new Ext.data.JsonReader({
			root: 'entities',
			totalProperty: 'total',
			fields: ["name", "title", "type", "srid", 'date']
		});

		var proxy = new Ext.data.HttpProxy({
			method: 'GET',
			url: Philosophy.UriTemplate.getUri('userSearchLayer')
		});

		var paramSearch = {
			pattern: '',
			position: '0',
			userName: Phi.Session.getUser()
		};

		var ds = new Ext.data.Store({
			baseParams: paramSearch,
			reader: reader,
			proxy: proxy,
			sortInfo: { field: 'title', direction: "ASC" }
		});

		var sm = new Ext.grid.CheckboxSelectionModel();

		var cm = new Ext.grid.ColumnModel([
			sm,
			{ header: '', width: 25, dataIndex: 'Name', renderer: _this.renderLeaf },
			{ header: Phi.Global.For('Title'), width: 150, sortable: true, dataIndex: 'title' },
			{ header: Phi.Global.For('Type'), width: 100, sortable: true, dataIndex: 'type', renderer: _this.renderType },
			{ header: Phi.Global.For('SRID'), width: 100, sortable: true, dataIndex: 'srid'},            
			{ header: Phi.Global.For('Date'), width: 100, sortable: true, dataIndex: 'date', renderer: _this.renderDate }
		]);

		var bbar = new Ext.PagingToolbar({
			store: ds,
			pageSize: this.pageSize,
			displayInfo: true,
			displayMsg: '{0} - {1} of {2}',
			emptyMsg: Phi.Global.For('Empty')
		});

		var view = new Ext.grid.GridView({
			forceFit: false,
			enableRowBody: true,
			ignoreAdd: true,
			emptyText: Phi.Global.For('Empty')
		});

		this.grid = new Ext.grid.GridPanel({
			title: '',
			width: 470,
			frame: true,
			ds: ds,
			cm: cm,
			sm: sm,
			view: view,
			bbar: bbar,
			region: 'center'
		});
		//eof result grid

        // layer contextMenu 
		function onGridContextMenu(grid, rowIndex, e) {
			e.stopEvent();
			var coords = e.getXY();
			_this.layerContextMenu.showAt([coords[0], coords[1]]);
			var layerName = _this.grid.store.getAt(rowIndex).get('name');
			_this.layerContextMenu.layerName = layerName;
			_this.layerContextMenu.rowIndex = rowIndex;
		}

		this.grid.addListener('rowcontextmenu', onGridContextMenu);

		this.layerContextMenu = new Phi.view.menu.Layer({
			enableCheckLayer: true
		});

		this.layerContextMenu.on('checkLayer', function (layerName, node, rowIndex) {
			_this.grid.getSelectionModel().clearSelections();
			_this.grid.getSelectionModel().selectRow(rowIndex);
		});
		//eof layer contextMenu

		this.searchLayerForm = new Phi.view.form.SearchLayer({ region: 'west' });
		this.searchLayerForm.addButton(Phi.Global.For('Search'), function () { _this.load(); });

		this.searchLayerForm.patternField.on('specialkey', function (f, e) {
			if (e.getKey() == e.ENTER) {
				_this.load();
			}
		}, this);
		
		this.items = [this.searchLayerForm, this.grid];

		Phi.view.window.SearchLayer.superclass.initComponent.call(this);

		this.addButton(Phi.Global.For('Close'), this.close, this);
		this.addButton(Phi.Global.For('Apply'), this.apply, this);
    }
	,
	onRender: function () {
		Phi.view.window.SearchLayer.superclass.onRender.apply(this, arguments);
		this.load();
	}
	,
	show: function () {
		Phi.view.window.SearchLayer.superclass.show.call(this);
		this.getEl().fadeIn({ duration: 1 });
	}
	,
	getCMLayerName: function () {
		var i = this.gridContextMenu.rowIndex;
		var r = this.grid.store.getAt(i);
		return r.get('name');
	}
	,
	apply: function () {

		var layers = this.getCheckedLayers();

		if (layers.length < 1) {
			Ext.MessageBox.alert(Phi.Global.For('Warning'), Phi.Global.For('Select at least one layer'));
			return;
		}

		var container = Ext.get('map');
		Phi.Util.popupMessage(Phi.Global.For('Apply msg'), '', container);

		Phi.Layer.appliedLayers = layers;
		Phi.Map.redrawMainLayer(Phi.Layer.getWMSLayers(Phi.Config.wmsNameSpace));

		Phi.panelLayer.panelResume.update();
		Phi.panelLayer.showResume();
	}
	,
	getCheckedLayers: function () {
		var sm = this.grid.getSelectionModel();
		var selections = sm.getSelections();

		var layers = [];

		for (i = 0; i < selections.length; i++) {
			var name = selections[i].data.name;
			var title = selections[i].data.title;
			var srid = selections[i].data.srid;
			var layer = { 'name': name, 'title': title, 'srid':srid };
			layers.push(layer);
		}
		return layers;
	}
    ,
	renderTitle: function (val, m, record) {
		return '<b>' + val + '</b>';
	}
	,
	renderLeaf: function (val, m, record) {
		return '<img src="content/images/icons/shape_move_forwards.png" />';
	}
	,
	renderType: function (val, m, record) {

		var img = "point.png";
		if (val === 'multilinestring')
			img = 'line.png';

		if (val === 'multipolygon')
			img = 'poly.png';

		return '<img src="content/images/icons/' + img + '" /> ' + val;
	}
	,
	renderDate: function (val, m, record) {

		var d1 = val;
		var d2 = new Date();

		var m = d2 - d1;
		var mPerYear = 1000 * 60 * 60 * 24 * 365.26;
		var diff = m / mPerYear;

		var color = diff > 3 ? '#ff8888' : '#000';
		var date = Ext.util.Format.date(d1, 'd/m/Y');

		return '<span style="color:' + color + ';">' + date + '</span>';
	}
    ,
	load: function () {
		var params = this.searchLayerForm.getParams();
		params.userName = Phi.Session.getUser();
		this.grid.store.baseParams = params;
		this.grid.store.load({ params: { start: 0, limit: this.pageSize} });
	}
	,
	reload: function () {
		this.grid.store.reload();
	}
	,
	getSelections: function () {
		var sm = this.grid.getSelectionModel();
		return sm.getSelections();
	}
}); // eo Phi.view.window.SearchLayer
// eof

// TODO try to extend... no override..
Ext.override(Ext.grid.CheckboxSelectionModel, {
	onMouseDown : function(e, t){
		if(e.button === 0 ){
			e.stopEvent();
			var row = e.getTarget('.x-grid3-row');
			if(row){
				var index = row.rowIndex;
				if(this.isSelected(index)){
					this.deselectRow(index);
				}else{
					this.selectRow(index, true);
				}
			}
		}
	}
});