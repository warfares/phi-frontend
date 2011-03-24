Ext.ns("Phi.view.tree");
/**
* @class Philosophy.view.tree.WMSLayers
* @extends Philosophy.view.tree.Base
* 
* Philosophy Nodes(layers) by User selection widget !!
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.tree.WMSLayers = Ext.extend(Phi.view.tree.Base, {
	title: Phi.Global.For('Layers'),
	initComponent: function () {

		this.tbar = new Ext.Toolbar({
			items: [
			{
				text: Phi.Global.For('Search'),
				iconCls: 'icon-search-list',
				tooltip: { title: Phi.Global.For('Search'), text: Phi.Global.For('Search Desc') },
				handler: this.showSearch
			}
			,
			{ xtype: 'tbfill' }
			,
			{
				text: Phi.Global.For('Apply'),
				tooltip: { title: Phi.Global.For('Apply'), text: Phi.Global.For('Apply Desc') },
				iconCls: 'icon-accept',
				scope:this,
				handler: this.applyChanges
			}
			]
		});

		this.contextMenu = new Phi.view.menu.Layer({ enableCheckLayer: true });
		this.contextMenu.on('checkLayer', function (layerName, node) {
			this.uncheckAll();
			node.attributes.checked = true;
			node.ui.toggleCheck(true);
		}, this);

		this.on('contextmenu', function (node, e) {
			if (node.isLeaf()) {
				node.select();
				var c = node.getOwnerTree().contextMenu;
				c.layerName = node.attributes.layerId;
				c.node = node;
				c.showAt(e.getXY());
			}
		});

		Phi.view.tree.WMSLayers.superclass.initComponent.apply(this, arguments);
	}
	,
	load: function () {
		var user = new Philosophy.model.User();
		user.on('getnodes', function (nodes) {
			var nodes = new Ext.tree.TreeNode({ children: nodes });
			this.setRootNode(nodes);
			this.loader.doPreload(nodes);

			}, this);
		user.getNodes(Phi.Session.getUser());
	}
	,
	applyChanges: function () {
		var layers = this.getChecked('layerId', 'text', 'srid');

		if (layers.length < 1) {
			Ext.MessageBox.alert(Phi.Global.For('Warning'), Phi.Global.For('Select at least one layer'));
			return;
		}

		var container = Ext.get('map');
		Phi.Util.popupMessage(Phi.Global.For('Apply msg'), '', container);

		Phi.Layer.appliedLayers = layers;
		Phi.Map.redrawMainLayer(Philosophy.Layer.getWMSLayers(Philosophy.Config.wmsNameSpace));


		Phi.panelLayer.panelResume.update();
		Phi.panelLayer.showResume()
	}
	,
	showSearch: function () {
		var win = new Phi.view.window.SearchLayer();
		win.show();
	}
});