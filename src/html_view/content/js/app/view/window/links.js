Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.Link
* @extends Ext.Window
* 
* Philosophy links by layer, widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.Link = Ext.extend(Ext.Window, {
	title: Phi.Global.For('Links'),
	width: 600,
	height: 400,
	closeAction: 'close',
	maximizable: false,
	modal: false,
	plain: true,
	layout: 'anchor',
	x: 100,
	y: 100,
	modal: true,
	pageSize: 25,
	layer: null, // selected layer 
	initComponent: function () {
		var _this = this;

		// results grid
		var reader = new Ext.data.JsonReader({
			root: 'List',
			totalProperty: 'Total',
			fields: ["FileName", "FilePhisycalName", "Description"]
		});

		var proxy = new Ext.data.HttpProxy({
			method: 'GET',
			url: Philosophy.UriTemplate.getUri('layerService', 'linksByLayer')
		});

		var params = {
			layerName: 'cerrocolorado.b_botadero'
		};

		var ds = new Ext.data.Store({
			baseParams: params,
			reader: reader,
			proxy: proxy,
			sortInfo: { field: 'FileName', direction: "ASC" }
		});

		var cm = new Ext.grid.ColumnModel([
			{ header: '', width: 25, dataIndex: 'FileName', renderer: _this.renderAttach },
			{ header: Phi.Global.For('File'), width: 150, sortable: true, dataIndex: 'FilePhisycalName' },
			{ header: Phi.Global.For('Description'), width: 350, sortable: true, dataIndex: 'Description' }
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
			frame: true,
			height: 300,
			ds: ds,
			cm: cm,
			view: view,
			bbar: ptbar,
			listeners: {
				rowdblclick: function (grid, rowIndex) {

				}
			}
		});

		this.grid.on('rowdblclick', this.downloadFile);
		//eo result grid 

		this.items = [this.grid];
		Phi.view.window.Link.superclass.initComponent.call(this);
		this.addButton(Phi.Global.For('Close'), function () { _this.close(); });

		this.load();
	}
	,
	renderAttach: function (val, m, record) {

		fileName = record.get("FileName");
		var link = Philosophy.Config.linkFileUrl + fileName;

		var t = '<a href="' + link + '" target="_blank">';
		t = t + '<img src="content/images/icons/attach.png" />';
		t = t + '</a>';

		return t;
	}
	,
	load: function () {
		var params = { layerName: this.layer };
		this.grid.store.baseParams = params;
		this.grid.store.load({ params: { start: 0, limit: this.pageSize} });
	}
	,
	downloadFile: function () {
		alert('tezt');
	}
});// eo Phi.view.window.Link
// eof