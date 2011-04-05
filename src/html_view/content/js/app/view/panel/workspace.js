Ext.ns("Phi.view.panel");
/**
* @class Philosophy.view.panel.WorkSpace
* 
* Phi workspace panel (Dashboard)
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
* 
*/

Phi.view.panel.WorkSpace = Ext.extend(Ext.Panel, {
	border: false,
	layout: 'fit',
	collapsible: true,
	plugins: [Ext.ux.plugins.ToggleCollapsible],
	title: Phi.Global.For('WorkSpace'),

	initComponent: function () {
		var _this = this;

		var reader = new Ext.data.JsonReader({
			root: 'entities',
			totalProperty: 'total',
			fields: ['id', 'name', 'baseLayer', 'layers', 'overlays', 'point', 'userName', 'date']
		});

		var proxy = new Ext.data.HttpProxy({
			method: 'GET',
			url: Phi.UriTemplate.getUri('workspaceGetByOwner')
		});

		var ds = new Ext.data.Store({
			reader: reader,
			proxy: proxy
		});
		
		//url change by logged user
		ds.on('beforeload', function (store, options) {
			var p = { userName: Phi.Session.getUser() };
			var url = Phi.UriTemplate.getUri('workspaceGetByOwner', '?' + Ext.urlEncode(p));
			store.proxy.conn.url = url;
		});

		//TODO change this !!... 
		var render = function (val, m, record) {
			var url = 'content/images/icons/'
			return '<img src="'+ url + 'cup.png" />';
		};

		var renderText = function (val, m, record) {
			var strDate = record.get('date');
			var date = new Date(strDate);
			var relDate = Phi.Util.relativeTime(date);
			
			var name = record.get('name');
			out = '<span style="float:left">' + name + '</span>';
			out += '<sup class="main_font" style="float:right;font-size:9px;">' + relDate + '</sup>';
			return out;
		};

		var cm = new Ext.grid.ColumnModel([
			{ header: '', width: 25, dataIndex: 'id', renderer: render },
			{ header: Phi.Global.For('name'), width: 250, sortable: true, dataIndex: 'name', renderer: renderText }
		]);

		var tbar = new Ext.Toolbar({
			items: [
			{
				iconCls: 'icon-add',
				text: Phi.Global.For('Add'),
				tooltip: Phi.Global.For('Add'),
				handler: _this.addEntity
			}
			,
			{
				iconCls: 'icon-delete',
				text: Phi.Global.For('Delete'),
				tooltip: Phi.Global.For('Delete'),
				handler: function () {
					Ext.Msg.confirm(Phi.Global.For('Delete'), Phi.Global.For('Are you sure ?'), function (btn, text) {
						if (btn == 'yes') {
							_this.deleteEntity();
						}
					});
				}
			}
			,
			{ xtype: 'tbfill' }
			,
			{
				text: Phi.Global.For('Search'),
				iconCls: 'icon-search-list',
				tooltip: Phi.Global.For('Search'),
				handler: function () {
					var win = new Phi.view.window.SearchWorkSpace();
					win.show();
					win.getEl().fadeIn({ duration: 1 });
				}
			}
			]
        });

		var bbar = new Ext.PagingToolbar({
			store: ds,
			pageSize: 8,
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
			width: 345,
			autoHeight: true,
			frame: true,
			ds: ds,
			cm: cm,
			view: view,
			tbar: tbar,
			bbar: bbar
		});
		
		//tootltip
		this.grid.on('render', function() {
			_this.grid.tip = new Ext.ToolTip({
				view: _this.grid.getView(),
				target: _this.grid.getView().mainBody,
				width:250,
				delegate: '.x-grid3-row',
				trackMouse: true,
				renderTo: document.body,
				listeners: {
					beforeshow: function updateTipBody(tip) {
						var rowIndex = tip.triggerElement.rowIndex;
						var date = _this.grid.store.getAt(rowIndex).get('date');
						var name = _this.grid.store.getAt(rowIndex).get('name');
						
						var sdate = new Date(date).format('dddd, mmmm d, yyyy  HH:MM:ss');
						
						var url = "content/images/icons/";
						var img = '<img src="'+ url + 'cup.png" />';
						
						var html = '<div style="float:left;width:20px;height:20px; margin-top:3px;margin-right:2px;">' + img +'</div>'
						html += '<div><b>' + name + '</b><br/>' + sdate + '</div><span style="clear:both;" />';
						tip.body.update(html);
					}
				}
			});
		});

		this.grid.on('rowdblclick', this.apply, this);
		this.grid.on('rowcontextmenu', onGridContextMenu, this);
		//eo grid

		//context menu
		function onGridContextMenu(grid, rowIndex, e) {
			e.stopEvent();
			var coords = e.getXY();
			grid.getSelectionModel().clearSelections();
			grid.getSelectionModel().selectRow(rowIndex);
			gridContextMenu.showAt([coords[0], coords[1]]);
		}
		
		var gridContextMenu = new Ext.menu.Menu({
			items: [
			{
				iconCls: 'icon-accept',
				text: Phi.Global.For('Apply'),
				handler: function () { _this.apply(); }
			}
			,
			{
				iconCls: 'icon-edit',
				text: Phi.Global.For('Edit'),
				handler: function(){ _this.showWorkspace(); }
			}
			,
			{
				iconCls: 'icon-delete',
				text: Phi.Global.For('Delete'),
				handler: function(){_this.deleteEntity();}
			}
			,
			{
				iconCls: 'icon-user-color',
				text: Phi.Global.For('Users'),
				handler: function(){_this.showUsers();}
			}
			]
		});
		//eo context menu

		Phi.view.panel.WorkSpace.superclass.initComponent.call(this);
		this.add(this.grid);
	}
	,
	addEntity: function () {
		var win = new Phi.view.window.Workspace({
			create: true,
			x: 100,
			y: 100
		});
		win.show();
	}
	,
	deleteEntity: function () {
		var s = this.getSelections();

		if (s.length < 1) {
			Ext.MessageBox.alert(Phi.Global.For('Warning'), Phi.Global.For('Select One'));
			return false;
		}
		var id = s[0].data.id;

		var ws = new Phi.model.Workspace();
		ws.on('remove', function(){
			this.load();
			Phi.Msg(Phi.Global.For('location deleted'));
		}, this);
		ws.remove(id);
	}
	,
	showWorkspace: function () {
		var s = this.getSelections();
		if (s.length < 1) {
			Ext.MessageBox.alert(Phi.Global.For('Warning'), Phi.Global.For('Select One'));
			return false;
		}

		var id = s[0].data.id;
		var win = new Phi.view.window.Workspace({ create: false });
		win.show();
		win.readEntity(id);
		win.getEl().fadeIn({ duration: 1 });
	}
	,
	showUsers: function () {
		var s = this.getSelections();
		if (s.length < 1) {
			Ext.MessageBox.alert(Phi.Global.For('Warning'), Phi.Global.For('Select One'));
			return false;
		}

		var id = s[0].data.id;
		var name = s[0].data.name;
		var owner = s[0].data.userName;
		
		var win = new Phi.view.window.WorkspaceUsers({
			workspaceId: id,
			workspaceName: name,
			owner: owner
		});
		win.show();
		win.getEl().fadeIn({ duration: 1 });
	}
    ,
	apply: function () {
		var s = this.getSelections();
		if (s.length < 1) {
			Ext.MessageBox.alert(Phi.Global.For('Warning'), Phi.Global.For('Select One'));
			return false;
		}

		// Layers       
		var treeWMSLayers = Phi.panelLayer.treeWMSLayers;
		treeWMSLayers.uncheckAll();
		var l = s[0].data.layers.split(',');

		// added layers
		if (l.length > 0) {
			for (x = 0; x < l.length; x++)
			treeWMSLayers.checkNodeByLayerId(l[x]);
			treeWMSLayers.applyChanges();
		}

		// added rasters
		var treeRaster = Phi.panelLayer.treeRaster;
		var r = s[0].data.overlays.split(',');

		treeRaster.uncheckAll();
		if (r.length > 0) {
			for (x = 0; x < r.length; x++)
			treeRaster.checkNodesByLayerName(r[x]);
		}

		//baseLayer 
		var baselayer = s[0].data.baselayer;
		if (baselayer) {
			Phi.mainToolbar.baseLayerCombo.setValue(baselayer);
			Phi.mainToolbar.baseLayerCombo.setBaseLayerByName(baselayer);
		};

		//Center
		var p = s[0].data.point;
		
		var point = {
			lon: p.x,
			lat: p.y,
			zoom: p.z
		};

		Phi.Map.setCenter(point);
	}
	,
	load: function () {
		var userName = Phi.Session.getUser();
		this.grid.baseParams = { userName: userName };
		this.grid.store.load({ params: { userName: userName, start: 0, limit: 8} });
	}
	,
	reload: function () {
		var userName = Phi.Session.getUser();
		this.grid.baseParams = { userName: userName };
		this.grid.store.reload();
	}
	,
	getSelections: function () {
		var sm = this.grid.getSelectionModel();
		return sm.getSelections();
	}
});// eo Phi.view.panel.Layer 
// eof