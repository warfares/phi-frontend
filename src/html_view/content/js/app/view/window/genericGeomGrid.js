Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.GenericGeomGrid
* @extends Ext.Window
* 
* Philosophy generic grid geom, widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.GenericGeomGrid = Ext.extend(Ext.Window, {
	closeAction: 'close',
	maximizable: false,
	modal: true,
	plain: true,
	layout: 'border',
	data: null,
	initComponent: function () {
		
		this.tbar = new Ext.Toolbar({
			items: [{
				iconCls: 'icon-search-list',
				text: Phi.Global.For('Detail'),
				tooltip: Phi.Global.For('Detail'),
				scope:this,
				handler: this.showDetails
			}
			]
		});

		var ds = new Ext.data.Store({
			data: this.data,
			reader: new Ext.data.JsonReader({root: 'entities', fields: ["id", "layerName"] })
		});

		var render = function (val, m, record) {
			return '<img src="content/images/icons/vector.png" />';
		};

		var renderLayer = function (val){
			return val.split('.')[1];
		};

		var cm = new Ext.grid.ColumnModel([
			{ header: '', width: 25, renderer: render },
			{ header: 'Id', width: 50, dataIndex: 'id' },
			{ header: Phi.Global.For('Layer'), dataIndex: 'layerName', width: 160, renderer: renderLayer}
		]);

		var view = new Ext.grid.GridView({
			forceFit: false,
			enableRowBody: true,
			ignoreAdd: true,
			emptyText: Phi.Global.For('No record found')
		});

		this.grid = new Ext.grid.GridPanel({
			region: 'center',
			loadMask: true,
			frame: true,
			header: false,
			view: view,
			ds: ds,
			cm: cm
		});
		
		this.grid.on('rowdblclick',this.showDetails, this);
		
		function onGridContextMenu(grid, rowIndex, e) {
			e.stopEvent();
			var coords = e.getXY();
			
			grid.getSelectionModel().clearSelections();
			grid.getSelectionModel().selectRow(rowIndex);
			gridContextMenu.showAt([coords[0], coords[1]]);
		}

		this.grid.on('rowcontextmenu', onGridContextMenu);
		
		var gridContextMenu = new Ext.menu.Menu({
			items: [
			{
				iconCls: 'icon-search-list',
				text: Phi.Global.For('Detail'),
				scope : this,
				handler: this.showDetails
			}
			]
		});
		//eo context menu
		
		this.items = [this.grid];
		
		Phi.view.window.GenericGeomGrid.superclass.initComponent.call(this);
		this.addButton(Phi.Global.For('Close'), this.close, this);
	}
	,
	showDetails: function(){
		var s = this.getSelections()
		
		if (s.length < 1) {
			Ext.MessageBox.alert(Phi.Global.For('Warning'), Phi.Global.For('Select at least one row'));
			return null;
		}
		
		s = s[0];
		
		var layerName =  s.data.layerName;
		var gid = s.data.id;

		var c = {
			rowID : 0,
			andOr : '',
			columnName : 'gid',
			operatorTemplate : '= {0}',
			entryValues: [gid]
		};
		var criteria = [];
		criteria.push(c);
	
	
		//layer metadata 
		var l = new Geo.core.Layer();
		l.on('metadata', function(result){
			var fields = [];
			Ext.each(result.entities, function(m) { fields.push(m.name);});
			
			l.on('query', function(result){
				this.showResult(result,layerName,fields, criteria);
			},this);
			l.query(layerName,fields.join(','), criteria, true, 0, 1);
		}, this);

		l.getMetadata(layerName);
	}
	,
	showResult: function(data, layerName, fields, criteria){
		
		var query = {
			layerName : layerName,
			fields : fields,
			criteria : criteria
		};
		
		var md = fields;
		var cm = Phi.Util.buildColumnModel(md);

		var reader = new Ext.data.JsonReader({ root: 'entities', totalProperty: 'total', fields: md });
		var ds = new Ext.data.Store({
			reader: reader,
			data:data
		});

		var win = new Phi.view.window.QueryResult({
			title: 'query',
			ds: ds,
			cm: cm,
			paging: false,
			pageSize: 1,
			extent: true,
			query: query
		});

		win.show();
	}
	,
	getSelections: function () {
		var sm = this.grid.getSelectionModel();
		return sm.getSelections();
	}
});//eo Phi.view.window.GenericGeomGrid
// eof