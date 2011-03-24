Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.MarkerData
* @extends Ext.Window
* 
* Philosophy display data for a marker, widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.MarkerData = Ext.extend(Ext.Window, {
	title: Phi.Global.For('Marker Description'),
	width: 250,
	height: 250,
	closeAction: 'close',
	maximizable: false,
	modal: false,
	plain: true,
	layout: 'border',
	marker: null,
    markerLayer: null,
	coordinate: [], // point WSM projection 
	data: [],   // array with generic string data

	initComponent: function() {
		var _this = this;
		this.tbar = new Ext.Toolbar({
			items: [
			{
				text: Phi.Global.For('Delete'),
				iconCls: 'icon-delete',
				tooltip: { title: Phi.Global.For('Delete'), text: Phi.Global.For('Delete marker') },
				handler: function () { _this.deleteMarker() }
			}
			]
		});

		var store = new Ext.data.ArrayStore({ fields: [{ name: 'data'}] });
		store.loadData(_this.buildData());
		var grid = new Ext.grid.GridPanel({
			store: store,
			columns: [{ width: 200, sortable: true, dataIndex: 'data'}]
		});

		var p = new Ext.Panel({
			title: '',
			region: 'center',
			margins: '5 5 5 5',
			layout: 'fit',
			items: [grid],
			autoScroll: true
		});

		this.items = [p];

		Phi.view.window.MarkerData.superclass.initComponent.call(this);

		this.addButton(Phi.Global.For('Close'), function () { _this.close(); });
	}
	,
	deleteMarker: function(){
		var _this = this;
		Ext.MessageBox.show({
			title: Phi.Global.For('Delete'),
			msg: Phi.Global.For('Delete marker from map ?'),
			buttons: Ext.MessageBox.YESNO,
			fn: function(btn, text) {
				if (btn == 'yes') {
					_this.markerLayer.removeMarker(_this.marker);
					_this.marker.destroy();
					_this.close();
				}
			}
		});
	}
	,
	buildData: function() {
		var d = [];
		if (this.data) {
			for (var i = 0; i < this.data.length; i++) {
				d.push([this.data[i]]);
			}
		}
		d.unshift(['<b>' + this.coordinate[1] + '</b>']);
		d.unshift(['<b>' + this.coordinate[0] + '</b>']);
		return d;
	}
});// eo Phi.view.window.markerData
// eof