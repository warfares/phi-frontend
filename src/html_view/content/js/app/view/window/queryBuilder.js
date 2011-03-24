Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.QueryBuilder
* @extends Ext.Window
* 
* Phi metadata query builder, widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.QueryBuilder = Ext.extend(Ext.Window, {
	title: Phi.Globalization.For('Layer Query'),
	width: 550,
	height: 340,
	closeAction: 'close',
	maximizable: false,
	layout: 'border',
	x: 100,
	y: 100,
	modal: true,
	layerName : null,	// layer physical name (key).
	layerName : null,	// layer description.
	fields: null,	// layers fields obj array.
	pageSize: 100,	// query pageSize.-

	initComponent: function () {
		
		/* grid types */
		var reader = new Ext.data.JsonReader({
			fields: ['text', 'type', 'pgtype']
		});

		this.sm = new Ext.grid.CheckboxSelectionModel({
			checkOnly:true,
			header:''
		});
		
		this.sm.on('rowdeselect', function(sm, rowIndex, record){
			if(record.data.text === 'gid')
				sm.selectRow(rowIndex, true);
		}, this);

		var renderField = function(v){
			return (v === 'gid') ? '<b>' + v + '</b>' : v;
		};

		var renderKey = function(v) {
			var img_key = '<img src="content/images/icons/key.png" />'
			var img_blank = '';
			return (v ==='gid') ? img_key : img_blank;
		};

		var cm = new Ext.grid.ColumnModel([
			this.sm,
			{ id: 'text', header: '...', width: 27, sortable: true, dataIndex: 'text', renderer:renderKey},
			{ id: 'text', header: 'Field', width: 260, sortable: true, dataIndex: 'text', renderer:renderField},
			{ id: 'type', header: 'Type', width: 200,  sortable: true, dataIndex: 'pgtype'}
		]);

		var ds = new Ext.data.Store({
			reader: reader,
			data: this.fields
		});
		
		this.grid = new Ext.grid.GridPanel({
			title: 'Fields',
			loadMask: true,
			ds: ds,
			cm: cm,
			sm: this.sm,
			frame: true,
			header: false
		});
		/* oef grid type */
		
		//context menu
		this.rowId = ''; //global for handler..
		
		function onGridContextMenu(grid, rowIndex, e) {
			e.stopEvent();
			var coords = e.getXY();
			gridContextMenu.showAt([coords[0], coords[1]]);
			
			var row = grid.store.data.items[rowIndex];
			var colName = grid.store.fields.keys[0];
			var val = row.data[colName];
			this.rowId = val;
		};

		this.grid.on('viewready', function(){ this.sm.selectAll(); },this);
		this.grid.on('rowcontextmenu', onGridContextMenu, this);

		var gridContextMenu = new Ext.menu.Menu({
			items: [
				{
					iconCls: 'icon-search-list',
					text: 'Values',
					scope: this,
					handler:this.showFieldValues
				}
			]
		});
		//eo context menu

		/* form restrictions */
		this.query = new Ext.ux.QueryBuilder({
			fields:this.fields,
			addIconCls:'icon-add',
			removeIconCls:'icon-delete'
		});

		var formRestrictions = new Ext.FormPanel({
			title : 'Restrictions <text class="main_font_green">[optional]</text>',
			frame: true,
			bodyStyle: 'padding:5px',
			width: 600,
			labelWidth:80,
			items: [this.query]
		});
		/* eof form restrictions */

		var textField = new Ext.form.TextField({
			width:200,
			readOnly:true,
			value:this.layerName
		});
		
		var tbar = new Ext.Toolbar({
			height:30,
			items: [
			textField,
			{
				iconCls: 'icon-search-list',
				tooltip: 'Layer detail',
				scope:this,
				handler: this.showLayerDetail
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
		
		this.tbar = tbar;
		
		this.tabPanel = new Ext.TabPanel({
			activeTab: 0,
			region: 'center',
			width: 600,
			height: 250,
			deferredRender:false,
			defaults: { autoScroll: true },
			items: [this.grid, formRestrictions]
		});

		this.items = [this.tabPanel];

		Phi.view.window.QueryBuilder.superclass.initComponent.call(this);
		
		this.addButton(Phi.Globalization.For('Cancel'), this.close, this);
		this.addButton(Phi.Globalization.For('Execute'), this.executeQuery, this);
	}
	,
	onRender: function() {
		Phi.view.window.QueryBuilder.superclass.onRender.apply(this, arguments);
	}
	,
	showLayerDetail:function(){
		var layerName = this.parentMenu.layerName;
		var win = new Phi.view.window.LayerDetail({ layer: layerName });
		win.show();
	}
	,
	showFieldValues:function(){
		var l = new Geo.core.Metadata();
		l.on('distinct_values', function(result){ 
			var data = result.entities;
			var win = new Phi.view.window.UniqueResult({
				data:data
			});
			win.show();
		}, this);
		l.getDistinctValues(this.rowId,'public.rm_curvas',100);
	}
	,
	showSQL: function(){
		
		var fields =  this.getSelectedFields();
		var criteria = this.getCriteriaValues();
		
		var query = {
			layerName : this.layerName,
			fields : fields,
			criteria : criteria
		};
		
		var win = new Phi.view.window.SQLDescription({
			query: query
		});
		win.show();
	}
	,
	getSelectedFields: function () {
		var selections = this.sm.getSelections();
		var f = [];
		Ext.each(selections, function(s){ f.push(s.data.text); });
		return f.join(',');
	}
	,
	getCriteriaValues: function(){
		return this.query.getValue();
	}
	,
	executeQuery: function(){
		
		var fields =  this.getSelectedFields();
		var criteria = this.getCriteriaValues();
		
		var layer = new Geo.core.Layer();
		layer.on('query', function(result){
			this.showResult(result,this.layerName,fields, criteria);
		},this);
		layer.query(this.layerName,fields, criteria, true, 0, this.pageSize);
	}
	,
	showResult: function(data, layerName, fields, criteria){
		
		var query = {
			layerName : layerName,
			fields : fields,
			criteria : criteria
		};
		
		var md = this.getSelectedFields().split(',');
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
			paging: true,
			pageSize: this.pageSize,
			extent: true,
			query: query
		});

		win.show();
	}
});// eo Phi.view.window.queryBuilder
// eof
