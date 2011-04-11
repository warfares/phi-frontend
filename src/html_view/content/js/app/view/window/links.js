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
	layerName: null, // selected layer
	initComponent: function () {

		// results grid
		var reader = new Ext.data.JsonReader({
			root: 'entities',
			totalProperty: 'total',
			fields: ["fileName", "filePhysicalName", "description"]
		});
		
		
		var proxy = new Ext.data.HttpProxy({
			method: 'GET',
			url: Phi.UriTemplate.getUri('layerGetFiles')
		});

		var params = {
			layerName:this.layerName
		};

		var ds = new Ext.data.Store({
			baseParams: params,
			reader: reader,
			proxy: proxy,
			sortInfo: { field: 'fileName', direction: "ASC" }
		});

		var cm = new Ext.grid.ColumnModel([
			{ header: '', width: 25, dataIndex: 'fileName', renderer: this.renderAttach },
			{ header: Phi.Global.For('File'), width: 150, sortable: true, dataIndex: 'filePhysicalName' },
			{ header: Phi.Global.For('Description'), width: 350, sortable: true, dataIndex: 'description' }
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
			frame: true,
			height: 300,
			ds: ds,
			cm: cm,
			view: view,
			bbar: bbar
		});

		this.grid.on('rowdblclick', this.downloadFile, this);
		//eo result grid 

		this.items = [this.grid];
		Phi.view.window.Link.superclass.initComponent.call(this);
		this.addButton(Phi.Global.For('Close'), this.close, this);
		this.load();
	}
	,
	renderAttach: function (val, m, record) {

		fileName = record.get("fileName");
		var link = Phi.Config.linkFileUrl + fileName;

		var t = '<a href="' + link + '" target="_blank">';
		t = t + '<img src="content/images/icons/attach.png" />';
		t = t + '</a>';

		return t;
	}
	,
	load: function () {
		var params = { layerName: this.layerName };
		this.grid.store.baseParams = params;
		this.grid.store.load({ params: { start: 0, limit: this.pageSize} });
	}
	,
	downloadFile: function () {
		alert('OK I');
		
		//var load = window.open('./content/layer_metadata/' + layerName + '.htm', '_blank');
	}
});// eo Phi.view.window.Link
// eof