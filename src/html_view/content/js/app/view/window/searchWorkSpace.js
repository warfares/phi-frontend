Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.SearchWorkSpace
* @extends Ext.Window
* 
* Philosophy search workspace by user, widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.SearchWorkSpace = Ext.extend(Ext.Window, {
	title: '',
	width: 800,
	height: 400,
	pageSize: 4,
	plain: true,
	layout: 'border',
	initComponent: function () {

		var _this = this;

		// results grid
		var reader = new Ext.data.JsonReader({
			root: 'entities',
			totalProperty: 'total',
			fields: ['id', 'name', 'layers', 'overlays', 'baseLayer', 'public', 'date', 'point', 'userName']
		});

		var proxy = new Ext.data.HttpProxy({
			method: 'GET',
			url: Phi.UriTemplate.getUri('userSearchWorkspace')
		});

		var paramSearch = {
			namePattern: '',
			namePosition: '0',
			userPattern: '',
			userPosition: '0',
			userName: Phi.Session.getUser()
		};

		var ds = new Ext.data.Store({
			baseParams: paramSearch,
			reader: reader,
			proxy: proxy,
			sortInfo: { field: 'name', direction: "ASC" }
		});

		var cm = new Ext.grid.ColumnModel([
			{ header: '', width: 25, dataIndex: 'name', renderer: _this.renderWS },
			{ header: Phi.Global.For('Name'), width: 150, sortable: true, dataIndex: 'name' },
			{ header: Phi.Global.For('User'), width: 200, sortable: true, dataIndex: 'userName', renderer: _this.renderUser },
			{ header: Phi.Global.For('Date'), width: 100, sortable: true, dataIndex: 'date', renderer: _this.renderDate }
		]);

		var ptbar = new Ext.PagingToolbar({
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
			view: view,
			bbar: ptbar,
			region: 'center'
		});

		this.grid.on('rowdblclick', function (grid, rowIndex) {
			Ext.fly(grid.getView().getRow(rowIndex)).frame("C3DAF9", 1, { duration: 2 });
			this.setWorkSpace();
		}, this);
        //eo result grid

        //context menu
		function onGridContextMenu(grid, rowIndex, e) {
			e.stopEvent();
			var coords = e.getXY();
			_this.rowIndex = rowIndex;

			grid.getSelectionModel().clearSelections();
			grid.getSelectionModel().selectRow(rowIndex);
			gridContextMenu.showAt([coords[0], coords[1]]);
		}

		this.grid.addListener('rowcontextmenu', onGridContextMenu);

		var gridContextMenu = new Ext.menu.Menu({
			items: [{
				iconCls: 'icon-accept',
				text: Phi.Global.For('Apply'),
				handler: function () { _this.apply(); }
			}]
		});
		//eo context menu

		this.searchWSForm = new Phi.view.form.SearchWorkspace({ region: 'west' });
		this.searchWSForm.addButton(Phi.Global.For('Search'), this.load, this);

		this.searchWSForm.patternField.on('specialkey', function (f, e) {
			if (e.getKey() == e.ENTER)
			this.load();
		}, this);

		this.items = [this.searchWSForm, this.grid];

		Phi.view.window.SearchWorkSpace.superclass.initComponent.call(this);

		this.addButton(Phi.Global.For('Close'), this.close, this);
		this.addButton(Phi.Global.For('Apply'), this.apply, this);
	}
	,
	onRender: function () {
		Phi.view.window.SearchWorkSpace.superclass.onRender.apply(this, arguments);
		this.load();
	}
	,
	renderWS: function (val, m, record) {
		return '<img src="content/images/icons/cup.png" />';
	}
	,
	renderUser: function (val, m, record) {
		
		return record.data.userName;
		/*var user = record.data.userVO.UserName;
		var name = record.data.userVO.Name;
		var lastName = record.data.userVO.LastName;
		var output = '<div style="float:left;"><b>[' + user + ']</b></div><div>  - ' + name + ' ' + lastName + '</div>';
		return output;*/
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
		var params = this.searchWSForm.getParams();
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
	,
	apply: function () {

		var s = this.getSelections();
		if (s.length !== 1) {
			Ext.MessageBox.alert(Phi.Global.For('Warning'), Phi.Global.For('Select one row'));
			return false;
		}
		
		// Layers       
		var treeWMSLayer = Phi.panelLayer.treeWMSLayers;
		treeWMSLayer.uncheckAll();
		var l = s[0].data.layers.split(',');

		if (l.length > 0) {
			for (x = 0; x < l.length; x++)
				treeWMSLayer.checkNodeByLayerId(l[x]);

			treeWMSLayer.applyChanges();
		}

		// raster
		// added rasters
		var treeRaster = Phi.panelLayer.treeRaster;
		var r = s[0].data.overlays.split(',');

		treeRaster.uncheckAll();

		if (r.length > 0) {
			for (x = 0; x < r.length; x++)
				treeRaster.checkNodesByLayerName(r[x]);
		}

		// baseLayer
		var baselayer = s[0].data.baselayer;
		if (baselayer) {
			Phi.mainToolbar.baseLayerCombo.setValue(baseLayer);
			Phi.mainToolbar.baseLayerCombo.setBaseLayerByName(baseLayer);
		};

		//Center
		var p = s[0].data.point;

		var point = {
			lon: p.x,
			lat: p.y,
			zoom:10 // TODO 
		};

		Phi.Map.setCenter(point);
	}
});// eo Phi.view.window.SearchWorkSpace
// eof