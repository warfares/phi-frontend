Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.SearchUser
* @extends Ext.Window
* 
* Philosophy users search, widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.SearchUser = Ext.extend(Ext.Window, {
	title: '',
	width: 850,
	height: 500,
	plain: true,
	layout: 'border',
	pageSize: 8,
	initComponent: function () {
		this.addEvents(
			'getselectedusers'
		);

		var _this = this;
		
		/* search user grid */
		var reader = new Ext.data.JsonReader({
			root: 'entities',
			totalProperty: 'total',
			fields: ['userName', 'name', 'lastName', 'email']
		});
		
		var renderUserName = function (val, m, record) {
			return '<b>'+ val + '</b>';
		}

		var renderImage = function (val, m, record) {
			var url = "content/images/icons/";
			return'<img src="'+ url +'user_n.png" />';
		};
		
		var sm = new Ext.grid.CheckboxSelectionModel();
		
		this.cm = new Ext.grid.ColumnModel([
			sm,
			{ header: '', width: 30, sortable: false, dataIndex: 'userName', renderer: renderImage },
			{ header: Phi.Global.For('UserName'), width: 100, sortable: true, align: 'left', dataIndex: 'userName', renderer: renderUserName },
			{ header: Phi.Global.For('Name'), width: 120, sortable: true, align: 'left', dataIndex: 'name' },
			{ header: Phi.Global.For('LastName'), width: 120, sortable: true, align: 'left', dataIndex: 'lastName' },
			{ header: Phi.Global.For('Email'), width: 170, sortable: true, align: 'left', dataIndex: 'email' }
		]);

		var proxy = new Ext.data.HttpProxy({
			url: Phi.UriTemplate.getUri('userSearch'),
			method: 'GET'
		});

		var baseParams = {
			userName:'%'
		};
		
		this.ds = new Ext.data.Store({
			baseParams: baseParams,
			reader: reader,
			proxy: proxy,
			sortInfo: { field: 'userName', direction: "ASC" }
		});

		var bbar = new Ext.PagingToolbar({
			store: this.ds,
			pageSize: this.pageSize,
			displayInfo: true,
			displayMsg: '{0} - {1} of {2}',
			emptyMsg: 'No groups to display'
		});

		this.grid = new Ext.grid.GridPanel({
			region: 'center',
			title: Phi.Global.For('Users'),
			loadMask: true,
			ds: this.ds,
			sm:sm,
			cm: this.cm,
			bbar: bbar,
			frame: true,
			header: false,
			border: '0'
		});

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
				text: Phi.Global.For('Details'),
				iconCls: 'icon-search-list',
				scope:_this,
				handler: _this.userDetails
			}
			,
			{
				iconCls: 'icon-add',
				text: Phi.Global.For('Add'),
				tooltip: Phi.Global.For('Add'),
				scope:_this,
				handler: _this.getSelectedUsers
			}
			]
		});
		//eo context menu

		// eof grid
		this.search = new Phi.view.form.SearchUser({ region: 'west', collapsible: true, collapsed: false });
		this.search.on('enter', this.load, this);
		this.search.on('ready', this.load, this);
		this.search.addButton(Phi.Global.For('Search'), function(){
			this.load();
		}, this);

		this.items = [this.search, this.grid];

		Phi.view.window.SearchUser.superclass.initComponent.apply(this, arguments);

		this.addButton(Phi.Global.For('Close'),  this.close, this);
		this.addButton(Phi.Global.For('Add'),  this.getSelectedUsers, this);
		this.load();
	}
	,
	getSelectedUsers:function() {
		var userNames = [];
		var selections = this.getSelections();
		
		if (selections.length < 1) {
			Ext.MessageBox.alert(Phi.Global.For('Warning'), Phi.Global.For('Select One'));
			return false;
		}
		
		Ext.each(selections, function(s){
			userNames.push(s.data.userName);
		}, this);
		
		this.fireEvent('getselectedusers', userNames);
		return userNames;
	}
	,
	userDetails: function(){
		var s = this.getSelections();
		var userName = s[0].data.userName;
		
		var win = new Phi.view.window.UserDetails({ readOnly: true });
		win.show(this);
		win.readEntity(userName);
		win.getEl().fadeIn({ duration: 1 });
	}
	,
	load: function(){
		var params = this.search.getParams();
		this.ds.baseParams = params;
		
		this.ds.load({ 
			params: {start: 0, limit: this.pageSize}
		});
	}
	,
	reload: function(){
		this.ds.reload();
	}
	,
	getSelections: function () {
		var sm = this.grid.getSelectionModel();
		return sm.getSelections();
	}
});// eo Phi.view.window.SearchUser
// eof
