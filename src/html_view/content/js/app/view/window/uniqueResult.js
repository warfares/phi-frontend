Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.UniqueResult
* @extends Ext.Window
* 
* Philosophy display group by column for metadata query, widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.UniqueResult = Ext.extend(Ext.Window, {
	width: 260,
	height: 500,
	closeAction: 'close',
	maximizable: false,
	modal: true,
	plain: true,
	layout:'border',
	data: null,

	initComponent: function() {

		var params = {
			layerName: this.layerName,
			column: this.column
		};

		var ds = new Ext.data.Store({
			reader: new Ext.data.JsonReader({fields: ["values"] }),
			data: this.data,
			sortInfo: { field: 'values', direction: "ASC" }
		});

        var cm = new Ext.grid.ColumnModel([
			{ header: Phi.Global.For('Value'), width: 200, sortable: true, dataIndex: 'values' }
		]);

		var view = new Ext.grid.GridView({
			forceFit:false,
			enableRowBody:true,
			ignoreAdd: true,
			emptyText: 'No record found'
		});
		
		var bbar = new Ext.Toolbar({
			items: [{ xtype: 'tbfill' },{xtype: 'tbtext', html:  '<b><em>* first 100 distinct values</em></b>'}]
		});

		this.grid = new Ext.grid.GridPanel({
			region:'center',
			loadMask: true,
			frame: true,
			header: false,
			view: view,
			cm: cm,
			ds: ds,
			bbar: bbar
		});
        
		this.items = [this.grid];
		Phi.view.window.UniqueResult.superclass.initComponent.call(this);
		this.addButton(Phi.Global.For('Close'), this.close, this);
	}
}); // eo Phi.view.window.Legend
// eof