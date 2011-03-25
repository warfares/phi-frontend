Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.MetadataResult
* @extends Ext.Window
* 
* Philosophy metadata query results , widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.QueryResult = Ext.extend(Ext.Window, {
	width: 800,
	height: 500,
	closeAction: 'close',
	maximizable: false,
	modal: true,
	plain: true,
	layout:'border',
	ds: null, // external def.
	cm: null, // external def.
	paging: false,      // allow grid paging (query service (ex metadata service) requiered paging capability)
	pageSize: 100,		// number of result
	extent: false,      // zoom to extent on draw vector geomtries, requiered layer
	query: null,        // query note: {layerName:str,fields:str,criteria:obj}

	initComponent: function() {

		var _this = this;

		tbar = new Ext.Toolbar({
		items: [
				{
					iconCls: 'icon-select_all',
					text: Phi.Global.For('Select All'),
					tooltip: Phi.Global.For('Select All'),
					scope: this,
					handler: this.selectAll 
				}
				,
				{
					iconCls: 'icon-pencil',
					text: Phi.Global.For('Draw'),
					tooltip: Phi.Global.For('Draw'),
					scope:this,
					handler: this.validateDraw
				}
				,
				{ xtype: 'tbfill' }
				,
				{
					iconCls: 'icon-database-sql',
					text: 'SQL',
					tooltip: 'SQL Description',
					scope: this,
					handler: this.showSQL
				}
			]
		});

		var view = new Ext.grid.GridView({
			forceFit:false,
			enableRowBody:true,
			ignoreAdd: true,
			emptyText: Phi.Global.For('No record found')
		});

		//paging property 
		if(this.paging){
			var pgtbar = new Ext.PagingToolbar({ 
				store: this.ds,
				pageSize: this.pageSize,
				displayInfo: true,
				displayMsg: '{0} - {1} of {2}',
				emptyMsg: "No groups to display"
			});
			
			//fix for pagging (no getting values from proxy)
			pgtbar.doLoad = function(start){
				_this.load(start);
			}
			this.pgtbar = pgtbar;
			
			pgtbar.onLoad = function(store, r, o,start){
				var start = start || 0;
				pgtbar.cursor = start;
				var d = pgtbar.getPageData(), ap = d.activePage, ps = d.pages;

				pgtbar.afterTextItem.setText(String.format(pgtbar.afterPageText, d.pages));
				pgtbar.inputItem.setValue(ap);
				pgtbar.first.setDisabled(ap == 1);
				pgtbar.prev.setDisabled(ap == 1);
				pgtbar.next.setDisabled(ap == ps);
				pgtbar.last.setDisabled(ap == ps);
				pgtbar.refresh.enable();
				pgtbar.updateInfo();
				pgtbar.fireEvent('change', this, d);
			}
		}
		else 
			var pgtbar = '';

		//eo paging property
		this.grid = new Ext.grid.GridPanel({
			region:'center',
			loadMask: true,
			frame: true,
			header: false,
			tbar: tbar,
			bbar: pgtbar, 
			view: view,
			ds: this.ds,
			cm: this.cm
		});

		//grid context menu
		function onGridContextMenu(grid, rowIndex, e) {
			e.stopEvent();
			var coords = e.getXY();
			_this.rowIndex = rowIndex;

			grid.getSelectionModel().clearSelections();
			grid.getSelectionModel().selectRow(rowIndex);
			gridContextMenu.showAt([coords[0], coords[1]]);
		}

		this.grid.on('rowcontextmenu', onGridContextMenu);
		
		var gridContextMenu = new Ext.menu.Menu({
			items: [
			{
				iconCls: 'icon-pencil',
				text: Phi.Global.For('Draw'),
				scope : this,
				handler: this.validateDraw
			}
			,
			{
				iconCls: 'icon-pencil',
				text: Phi.Global.For('WKT'),
				scope:this,
				handler:this.showWKT
			}
			]
		});
		//eo context menu 

		this.items = [this.grid];
		Phi.view.window.QueryResult.superclass.initComponent.call(this);
		this.addButton(Phi.Global.For('Close'), this.close, this);
	}
	,            
	load:function(start){
		var layer = new Geo.core.Layer();
		layer.on('query', function(result){  
			this.ds.loadData(result);
			this.pgtbar.updateInfo();
			
			this.pgtbar.onLoad(this.ds,'','',start);
		},this);
		layer.query(this.query.layerName,this.query.fields, this.query.criteria, true, start, this.pageSize);
	}
	,
	showSQL: function(){
		var win = new Phi.view.window.SQLDescription({ query: this.query });
		win.show();
	}
	,
	validateDraw: function(wkt){
		
		
		if (wkt.length < 1) {
			Ext.MessageBox.alert(Phi.Global.For('Warning'), Phi.Global.For('Select at least one row'));
			return null;
		}

		Ext.MessageBox.show({
			title: '',
			msg: Phi.Global.For('Clear already draw geometries ?'),
			buttons: Ext.MessageBox.YESNO,
			scope:this,
			fn: function(btn, text) {
				if (btn === 'yes'){
					Phi.Map.vectorLayer.destroyFeatures();
					this.drawGeometries();
				}
				else(btn === 'no')
					this.drawGeometries();
			}
		});
	}
	,
	buildWKTQuery: function(){
		
		var selections = this.getSelections();
		var values = [];
		Ext.each(selections, function(s,i){
			values.push(s.data.gid);
		}, this);

		var c = {
			rowID : 0,
			andOr : '',
			columnName : 'gid',
			operatorTemplate : 'in ({0})',
			entryValues: [values.join(',')]
		};
		
		var criteria = [];
		criteria.push(c);
		
		var query = {
			layerName:this.query.layerName,
			fields: 'gid',
			criteria: criteria
		}
		return query
	}
	,
	drawGeometries:function(){
		
		var query = this.buildWKTQuery();
		var layer = new Geo.core.Layer();
		layer.on('query', function(result){
			var wkt = [];
			Ext.each(result.entities,function(e){
				wkt.push(e.wkt);
		 	}, this);
			
			Ext.each(wkt, Phi.Map.parseWKT, this);
		},this);
		
		layer.query(query.layerName,query.fields, query.criteria, true, 0, this.pageSize, true);
	}
	,                     
	showWKT:function(){
		
		var query = this.buildWKTQuery();
		var layer = new Geo.core.Layer();
		layer.on('query', function(result){
			
			var value = result.entities[0].wkt;
			
			Ext.MessageBox.show({
				title: 'WKT',
				value : value,
				width : 600,
				minHeight:400,
				height: 400,
				buttons: Ext.MessageBox.OK,
				multiline: true
			});
		},this);
		layer.query(query.layerName,query.fields, query.criteria, true, 0, this.pageSize, true);
	}
    ,
	selectAll: function (){
		this.grid.getSelectionModel().selectAll();
	}
	,
	getSelections: function() {
		var grid = this.grid;
		var sm = grid.getSelectionModel();
		return sm.getSelections();
	}
}); // eo Phi.view.window.MetadataResult
// eof