Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.UserRoleMaintainer
* @extends Ext.Window
* 
* Philosophy users by workspace maintainer, widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
//TODO Details readonly.

Phi.view.window.WorkspaceUsers = Ext.extend(Ext.Window, {
	title: '',
	width: 600,
	height: 450,
	x:100,
	y:100,
	plain: true,
	layout: 'border',
	
	workspaceId : 0,
	workspaceName : '',
	owner : '',
	
	pageSize: 8,
	initComponent: function () {

		var _this = this;

		/* tbar */
		var textField = new Ext.ux.form.StaticTextField({
			width:200,
			readOnly:true
		});

		this.tbar = new Ext.Toolbar({
			height:30,
			items: [
			textField,
			{
				iconCls: 'icon-search-list',
				tooltip: 'Workspace detail',
				scope:this,
				handler: this.workspaceDetails
			}
			,
			{ xtype: 'tbfill' }
			,
			{
				iconCls: 'icon-add',
				text: Phi.Global.For('Add'),
				tooltip: Phi.Global.For('Add'),
				scope:this,
				handler: _this.showUserSearch
			}
			,
			{
				iconCls: 'icon-delete',
				text: Phi.Global.For('Delete'),
				tooltip: Phi.Global.For('Delete'),
				scope:this,
				handler: function () {
					Ext.Msg.confirm(Phi.Global.For('Delete'), Phi.Global.For('Are you sure ?'), function (btn, text) {
						if (btn == 'yes') {
							_this.userRemove();
						}
					});
				}
			}
			]
		});
		
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
			return (_this.owner != val) ? '<img src="'+ url +'user_color.png" />' : '<img src="'+ url +'user_color_a.png" />';
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
			url: Phi.UriTemplate.getUri('workspaceGetUsers'),
			method: 'GET'
		});

		var baseParams = {
			id:_this.workspaceId
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
				iconCls: 'icon-delete',
				text: Phi.Global.For('Delete'),
				tooltip: Phi.Global.For('Delete'),
				scope:_this,
				handler: function () {
					Ext.Msg.confirm(Phi.Global.For('Delete'), Phi.Global.For('Are you sure ?'), function (btn, text) {
						if (btn == 'yes') {
							_this.userRemove();
						}
					});
				}
			}
			]
		});
		//eo context menu

		this.items = [this.grid];
		
		Phi.view.window.WorkspaceUsers.superclass.initComponent.apply(this, arguments);
		
		this.on('show', function(){ textField.setRawValue('<b>' + this.workspaceName + '</b>');},this);
		
		
		this.addButton(Phi.Global.For('Close'),  this.close, this);
		this.load();
	}
	,
	load: function(){
		this.ds.load({ 
			params: {start: 0, limit: this.pageSize} 
		});
	}
	,
	reload: function(){
		this.ds.reload();
	}
	,
	userRemove: function(){
		var userNames = [];
		var selections = this.getSelections();
		
		if (selections.length < 1) {
			Ext.MessageBox.alert(Phi.Global.For('Warning'), Phi.Global.For('Select One'));
			return false;
		}
		
		Ext.each(selections, function(s){
			userNames.push(s.data.userName);
		}, this);

		var workspace = new Phi.model.Workspace();
		workspace.on('removeusers', function(){
			this.load();
			Phi.Msg(Phi.Global.For('Users removed'));
		}, this);
		workspace.removeUsers(this.workspaceId,userNames);
	}
	,
	userAdd:function(userNames){
		var workspace = new Phi.model.Workspace();
		workspace.on('addusers', function(){
			this.load();
			Phi.Msg(Phi.Global.For('Users added'));
		}, this);
		workspace.addUsers(this.workspaceId,userNames);
	}
	,
	showUserSearch: function(){

		var win = new Phi.view.window.SearchUser();
		win.on('getselectedusers',this.userAdd, this);
		win.show();
		win.getEl().fadeIn({ duration: 1 });
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
	workspaceDetails: function(){
		var win = new Phi.view.window.Workspace({ readOnly: true });
		win.show();
		win.readEntity(this.workspaceId);
		win.getEl().fadeIn({ duration: 1 });
	}
	,
	getSelections: function () {
		var sm = this.grid.getSelectionModel();
		return sm.getSelections();
	}
});// eo Phi.view.window.WorkspaceUsers
// eof