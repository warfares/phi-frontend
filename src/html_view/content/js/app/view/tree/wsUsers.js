Ext.ns("Phi.view.tree");
/**
* @class Philosophy.view.tree.WSUsers 
* @extends Phi.view.tree.Base
* 
* Philosophy users by workspace (tree)
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.tree.WSUsers = Ext.extend(Ext.tree.TreePanel, {
	animate: true,
	enableDD: false,
	border: true,
	autoScroll: true,
	rootVisible: false,
	containerScroll: true,
	ownner:null, // workspace ownner

	initComponent: function () {
		var _this = this;
		this.bbar = new Ext.Toolbar({
			items: [
			{
				text: Phi.Global.For('All'),
				iconCls: 'icon-check-all',
				scope: this,
				handler: this.checkAll
			}
			,
			{
				text: Phi.Global.For('None'),
				iconCls: 'icon-uncheck-all',
				scope: this,
				handler: this.uncheckAll
			}
			]
		});

		this.root = new Ext.tree.TreeNode({ children: [] });
		this.loader = new Ext.tree.TreeLoader({ preloadChildren: true })
		this.loader.doPreload(this.root);

		Phi.view.tree.WSUsers.superclass.initComponent.apply(this, arguments);
		this.on('beforeappend', this.format, this);
	}
	,
	load: function (id) {
		var ws = new Phi.model.Workspace();
		ws.on('getusers', function (users) {
			var n = new Ext.tree.TreeNode({ children: users });
			this.setRootNode(n);
			this.loader.doPreload(n);
			}, this);
			ws.getUsers(id);
		}
	,
	format: function (tree, parent, node) {     
		if (node.isLeaf()){
			if (node.attributes.entityId === this.owner)
				node.attributes.checked = null;

			node.attributes.iconCls = node.attributes.text != this.owner ? 'icon-user-color' : 'icon-user-color-a';
		}
		else {
			node.attributes.checked = null;
			node.attributes.iconCls = 'icon-workspace';
			node.attributes.text = '<b>' + node.attributes.text + '</b>';
		}
	}
	,
	checkAll: function () {
		var _this = this;
		var f = function () {
			if (!this.attributes.checked && this.attributes.text != _this.owner && this.isLeaf()) {
				this.attributes.checked = true;
				this.ui.toggleCheck(true);
			}
		}
		this.root.cascade(f);
	}
	,
	uncheckAll: function () {
		var f = function () {
			if (this.attributes.checked) {
				this.attributes.checked = false;
				this.ui.toggleCheck(false);
			}
		}
		this.root.cascade(f);
	}
});