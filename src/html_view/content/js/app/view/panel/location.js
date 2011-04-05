Ext.ns("Phi.view.panel");
/**
* @class Philosophy.view.panel.Location
* 
* Philosophy location panel (Dashboard)
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
* 
*/
Phi.view.panel.Location = Ext.extend(Ext.Panel, {
	border: false,
	layout: 'fit',
	collapsible: true,
	plugins: [Ext.ux.plugins.ToggleCollapsible],
	title: Phi.Global.For('Locations'),

	initComponent: function () {
		var _this = this;

		var reader = new Ext.data.JsonReader({
			root: 'entities',
			totalProperty: 'total',
			fields: ['id', 'name', 'description', 'favorite', 'point', 'date']
		});

		var proxy = new Ext.data.HttpProxy({
			method: 'GET',
			url: Phi.UriTemplate.getUri('userGetLocations')
		});

		var ds = new Ext.data.Store({
			reader: reader,
			proxy: proxy
		});

		//url change by logged user
		ds.on('beforeload', function (store, options) {
			var p = { userName: Phi.Session.getUser() };
			var url = Phi.UriTemplate.getUri('userGetLocations', '?' + Ext.urlEncode(p));
			store.proxy.conn.url = url;
		});

		var renderImage = function (val, m, record) {
			var f = record.get('favorite');
			var url = "content/images/markers/";
			return f ? '<img src="'+ url +'pushpinyellow_mini.png" />' : '<img src="'+ url +'pushpin_mini.png" />';
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
			{ header: '', width: 25, dataIndex: 'id', renderer: renderImage },
			{ header: Phi.Global.For('name'), width: 250, sortable: true, dataIndex: 'name', renderer:renderText }
		]);
		
		var tbar = new Ext.Toolbar({
			items: [{
				iconCls: 'icon-add',
				text: Phi.Global.For('Add'),
				tooltip: Phi.Global.For('Add'),
				handler: function () { _this.addLocation(); }
			}
			,
			{
				iconCls: 'icon-delete',
				text: Phi.Global.For('Delete'),
				tooltip: Phi.Global.For('Delete'),
				handler: function () {
					Ext.Msg.confirm(Phi.Global.For('Delete'), Phi.Global.For('Are you sure ?'), function (btn, text) {
						if (btn == 'yes') {
							_this.deleteLocation();
						}
					});
				}
			}
			,
			{ xtype: 'tbfill' }
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
				delegate: '.x-grid3-row',
				width:250,
				trackMouse: true,
				renderTo: document.body,
				listeners: {
					beforeshow: function updateTipBody(tip) {
						var rowIndex = tip.triggerElement.rowIndex;
						var date = _this.grid.store.getAt(rowIndex).get('date');
						var name = _this.grid.store.getAt(rowIndex).get('name');
						var fav = _this.grid.store.getAt(rowIndex).get('favorite');
						
						var sdate = new Date(date).format('dddd, mmmm d, yyyy  HH:MM:ss');
						
						var url = "content/images/markers/";
						var img = fav ? '<img src="'+ url +'pushpinyellow_mini.png" />' : '<img src="'+ url +'pushpin_mini.png" />';
						
						var html = '<div style="float:left;width:20px;height:20px; margin-top:3px;">' + img +'</div>'
						html += '<div><b>' + name + '</b><br/>' + sdate + '</div><span style="clear:both;" />';
						tip.body.update(html);
					}
				}
			});
		});

		this.grid.on('rowdblclick', this.apply, this);
		this.grid.on('rowcontextmenu', onGridContextMenu);
        //eo grid locations

		//Adding context menu
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
				handler: function () { _this.showFormLocation(); }
			}
			,
			{
				iconCls: 'icon-delete',
				text: Phi.Global.For('Delete'),
				handler: function () { _this.deleteLocation(); }
			}
			,
			{
				iconCls: 'icon-favorite',
				text: Phi.Global.For('Favorite'),
				handler: function () { _this.favorite(); }
			}
			]
		});
        //eo context menu

		Phi.view.panel.Location.superclass.initComponent.call(this);
		this.add(this.grid);
    }
    ,
	favorite: function () {
		var s = this.getSelections();
		var id = s[0].data.id;
		var favorite = s[0].data.favorite;

		var location = new Phi.model.Location();
		location.on('favorite', function () {
			Phi.mainToolbar.loadFavorites();
			this.load(); 
		}, this);
		location.favorite(id, !favorite);       
	}
	,
	addLocation: function () {
		var container = Ext.get('map');
		Phi.Util.popupMessage('', Phi.Global.For('Click on map'), container);
		Phi.Map.deactivateAllControls();
		Phi.Map.activateCustomControl('click_add_location');
	}
	,
	deleteLocation: function () {
		var s = this.getSelections();

		if (s.length < 1) {
			Ext.MessageBox.alert(Phi.Global.For('Warning'), Phi.Global.For('Select One'));
			return false;
		}

		var id = s[0].data.id;

		var location = new Phi.model.Location();
		location.on('remove', function(){
			this.load();
			Phi.Msg(Phi.Global.For('location deleted'));
		}, this);
		location.remove(id);
	}
    ,
	showFormLocation: function () {
		
		var s = this.getSelections();

		if (s.length < 1) {
			Ext.MessageBox.alert(Phi.Global.For('Warning'), Phi.Global.For('Select One'));
			return false;
		}

		var id = s[0].data.id;

		var me = this;
		var win = new Phi.view.window.Location({
			create: false,
			opener: me
		});

		win.show(this);
		win.read(id);
		win.getEl().fadeIn({ duration: 1 });
	}
    ,
	apply: function () {
		var s = this.getSelections();

		var name = s[0].data.name;
		var desc = s[0].data.description;
		var favorite = s[0].data.favorite;
		var p = s[0].data.point;

		var point = {
			lon: p.x,
			lat: p.y,
			zoom: p.z
		};

		var color = favorite ? 'yellow' : 'white';
		Phi.Marker.drawMarker(point.x, point.y, color, [name], name, desc);
		var container = Ext.get('map');
		Phi.Map.setCenter(point);
		Phi.Util.popupMessage(name, '', container);
	}
	,
	load: function () {
		this.grid.store.load({ params: { start: 0, limit: 8} });
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
}); //eo Phi.view.panel.Location 
// eof