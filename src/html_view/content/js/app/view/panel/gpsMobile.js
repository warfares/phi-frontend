Ext.ns("Phi.view.panel");
/**
* @class Philosophy.view.panel.GPSMobile
* 
* Philosophy conceptual GPS Demo
* Websocket (testing implementation pywebsocket)
* TODO: WebSocket its not full implemented (crossbrowser)
*
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
* */
Phi.view.panel.GPSMobile = Ext.extend(Ext.Panel, {
	title: 'Mobiles',
	layout: 'fit',
	forceLayout: true,

	initComponent: function () {

		var reader = new Ext.data.JsonReader({
			fields: ['Id', 'Code', 'Fleet']
		});

		var renderCarrier = function (val) {
			return '<img src="content/images/icons/lorry-2.png" />';
		};

		var sm = new Ext.grid.CheckboxSelectionModel({
			singleSelect:true 
		});

		var columnModel = new Ext.grid.ColumnModel([
			sm,
			{ header: '...', width: 25, sortable: true, renderer: renderCarrier, dataIndex: 'Id' },
			{ id: 'Code', header: 'Code', width: 220, sortable: true, dataIndex: 'Code' },
			{ header: 'Flota', width: 20, sortable: true, dataIndex: 'Fleet', hidden: true }
		]);

		var proxy = new Ext.data.HttpProxy({
			url: 'List Vehicles',
			method: 'GET'
		});

		var data = [
			{ Id: '221902', Code: 'HE-1233', Fleet: 'Alpha' },
			{ Id: '221903', Code: 'HE-1232', Fleet: 'Alpha' },
			{ Id: '221901', Code: 'HE-1233', Fleet: 'Beta' },
			{ Id: '321902', Code: 'HE-1233', Fleet: 'Beta' },
			{ Id: '421902', Code: 'HE-1233', Fleet: 'Beta' }
		];

		var ds = new Ext.data.GroupingStore({
			reader: reader,
			sortInfo: { field: 'Code', direction: "ASC" },
			groupField: 'Fleet',
			data: data
		});

		var itemText = 'Vehiculos';
		
		var view = new Ext.grid.GroupingView({
			startCollapsed: false,
			groupTextTpl: '<img src="content/images/icons/folder.png" /> {text} <span style="font-weight:normal;">({[values.rs.length]} {[values.rs.length > 1 ? "' + itemText + '" : "' + itemText + '"]})</span>'
		});

		this.onlineButton = new Ext.Button({
			text: 'online',
			iconCls: 'icon-offline',
			enableToggle: true
		});
		
		this.onlineButton.on('toggle', this.online, this);

		//TODO: add online bottom
		var tbar = new Ext.Toolbar({ items: [{ xtype: 'tbfill'}, this.onlineButton] });

		//bottom bar..
		this.lastPositionButton = new Ext.Button({
			text: 'Last Position',
			iconCls: 'icon-gps-last',
			tooltip: { title: Phi.Global.For('Last Trace'), text: Phi.Global.For('Last Trace Desc') }
		});
		this.lastPositionButton.on('click', this.lastPosition, this);

		this.traceButton = new Ext.Button({
			text: 'Trace',
			iconCls: 'icon-gps-trace',
			tooltip: { title: Phi.Global.For('Trace'), text: Phi.Global.For('Trace Desc') }
		});
		this.traceButton.on('click', this.trace, this);

		var bbar = new Ext.Toolbar({ items: [{ xtype: 'tbfill' }, this.lastPositionButton, this.traceButton] });

		this.grid = new Ext.grid.GridPanel({
			loadMask: true,
			ds: ds,
			cm: columnModel,
			sm: sm,
			view: view,
			tbar: tbar,
			bbar: bbar,
			frame: true,
			header: false
		});

		//context menu
		function onGridContextMenu(grid, rowIndex, e) {
			e.stopEvent();
			var coords = e.getXY();
			gridContextMenu.showAt([coords[0], coords[1]]);
			this.grid.getSelectionModel().clearSelections();
			this.grid.getSelectionModel().selectRow(rowIndex);
		};

		this.grid.on('rowcontextmenu', onGridContextMenu, this);

		var gridContextMenu = new Ext.menu.Menu({
			items: [
				{
				    iconCls: 'icon-gps-last',
				    text: 'Last Position',
				    scope: this,
				    handler:this.lastPosition
				}
				,
				{
				    iconCls: 'icon-gps-trace',
				    text: 'Trace',
				    scope: this,
				    handler: this.trace
				}
			]
		});
		//eo context menu
		
		this.addMapIco();
		
		// Start a simple clock task that updates a div once per second
		var updateClock = function(){
		    Phi.Msg('Last Position !!');
		};
		
		this.task = {
			run: updateClock,
		    interval: 2000
		};
		
		this.runner = new Ext.util.TaskRunner();

		Phi.view.panel.GPSMobile.superclass.initComponent.call(this);
		this.add(this.grid);
	}
	,
	addMapIco: function(){
		var html =  '<img src="content/images/gps-icons/gps_icon.png" width="25" height="20">'
		html += '<br><span class="main_container">GPS<span>';
		this.mapOnlineIco = Ext.DomHelper.insertFirst(document.body, { id: 'gps_online_msg' }, true);
		Ext.DomHelper.append(this.mapOnlineIco, { html: html }, true);
		this.mapOnlineIco.hide();
	}
	,
	online: function (b) {
		if(!this.validate()) {
			Ext.MessageBox.alert(Phi.Global.For('Warning'), 'Seleccione un vehiculo' );
			b.toggle(false);
			return false;
		}
		
		this.uiConnected(b.pressed);
		b.pressed ? this.runner.start(this.task) : this.runner.stop(this.task);
	}
	,
	uiConnected: function (state) {
		var sm = this.grid.getSelectionModel();
		
		if (state) {
			Phi.Msg('connected');
			sm.lock();
			this.lastPositionButton.disable();
			this.traceButton.disable();
			this.onlineButton.setIconClass('icon-raster');
			this.mapOnlineIco.show();
		}
		else {
			Phi.Msg('disconnected');
			sm.unlock();
			this.lastPositionButton.enable();
			this.traceButton.enable();
			this.onlineButton.setIconClass('icon-offline');
			this.mapOnlineIco.hide();
		}
	}
	,
	preferences: function () {
		var win = new Phi.view.window.GPSPreference();
		win.show();
	}
	,
	getSelections: function () {
		var sm = this.grid.getSelectionModel();
		return sm.getSelections();
	}
	,
	buildIcon: function (o) {
		var speed = 'go';
		if (o.speed === 0) speed = 'stop';

		var angle = 0;
		var angles = [0, 45, 90, 135, 180, 225, 270, 315];
		var found = false;

		var fc = function (e, i) {
			if (i == 7 && !found) {
				angle = 315;
				return true;
			}

			if (angles[i] <= o.course && o.course < angles[i + 1]) {
				angle = angles[i];
				found = true;
			}
		};

		Ext.each(angles, fc, this);
		var icon = 'gps_' + speed + '_' + angle;
		return icon
	}
	,
	lastPosition: function () {
		
		if(!this.validate()) {
			Ext.MessageBox.alert(Phi.Global.For('Warning'), 'Seleccione un vehiculo' );
			return false;
		}
		
		var s = this.getSelections();
		var id = s[0].data.Id;
		alert(id);
		
		var t = new Phi.model.Trace();
		t.on('lastposition', function (o) {
			this.clear();
			this.draw(o);
			this.zoomPoint(o);
		}, this);
		
		t.on('notfound', function () {
			Ext.MessageBox.alert(Phi.Global.For('Warning'), Phi.Global.For('Data not found'));
		}, this);
		t.getLastPosition(id);
	}
	,
	trace: function () {
		
		if(!this.validate()) {
			Ext.MessageBox.alert(Phi.Global.For('Warning'), 'Seleccione un vehiculo' );
			return false;
		}
				
		var s = this.getSelections();
		var p = {
			id: s[0].data.Id,
			from: this.preferences.trace.from,
			to: this.preferences.trace.to
		};
		
		alert(p.id);

		var t = new Phi.model.Trace();
		t.on('trace', function (list, bound) {
			this.clear();
			Ext.each(list, this.draw, this);
			this.zoomTrace(bound);
		}, this);
		t.on('notfound', function () {
			Ext.MessageBox.alert(Phi.Global.For('Warning'), Phi.Global.For('Data not found'));
		}, this);

		t.getByRange(p.id, p.from, p.to);
	}
	,
	draw: function (o) {
		var icon = this.buildIcon(o);
		Phi.Marker.drawMarker(o.x, o.y, icon);
	}
	,
	zoomPoint: function (o) {
		var center = { lon: o.x, lat: o.y, zoom: 15 }
		Phi.Map.setCenter(center);
	}
	,
	zoomTrace: function (bbox) {
		var bound = new OpenLayers.Bounds(bbox.minx, bbox.miny, bbox.maxx, bbox.maxy);
		Phi.Map.zoomToExtent(bound, true);
	}
	,
	clear: function () {
		Phi.Map.clearAllMarkers();
	}
	,
	validate:function(){
		var s = this.getSelections();
		return (s.length != 1) ? false : true;
	}
}); // eo Phi.view.panel.GPS 
// eof