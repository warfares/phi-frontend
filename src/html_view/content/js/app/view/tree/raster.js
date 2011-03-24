Ext.ns("Phi.view.tree");
/**
* @class Philosophy.view.tree.Raster 
* @extends Ext.tree.TreePanel
* 
* Philosophy display rasters (TMS) layers widget (tree)
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.tree.Raster = Ext.extend(Ext.tree.TreePanel, {
	title: Phi.Global.For('Raster'),
	animate: true,
	enableDD: false,
	border: true,
	autoScroll: true,
	rootVisible: false,
	containerScroll: true,

	initComponent: function () {
		
		this.root = new Ext.tree.TreeNode({ children: [] });

		this.treeLoader = new Ext.tree.TreeLoader({ preloadChildren: true })
		this.treeLoader.doPreload(this.root);

		this.on('checkchange', function (n, checked) {
			if (n.hasChildNodes()) {
				n.expand();
				n.eachChild(function (c) {
					c.ui.toggleCheck(checked);
					c.fireEvent('checkchange', c, checked);
				});
			}
			else {
				var layerName = n.attributes['layerName'];
				this.toggleVisibility(checked, layerName);
			}
		}, this);

		var contextMenu = new Ext.menu.Menu();
		var _this = this;
		contextMenu.add({ 
			iconCls: 'icon-zoom', 
			text: Phi.Global.For('Zoom'), 
			handler: _this.zoomRaster 
		});
		this.contextMenu = contextMenu;

		this.on('contextmenu', function (node, e) {
			if (node.isLeaf()) {
				node.select();
				var c = node.getOwnerTree().contextMenu;
				c.node = node;
				c.showAt(e.getXY());
			}
		});
		
		this.tbar = new Ext.Toolbar({ items: ['-', { xtype: 'tbfill' }, '-'] });
		Phi.view.tree.Raster.superclass.initComponent.apply(this, arguments);
		this.on('beforeappend', this.format, this);
	}
	,
	format: function (tree, parent, node) {
		if (node.isLeaf())
		node.attributes.iconCls = 'icon-raster';
	}
	,
	zoomRaster: function () {
		var point = this.parentMenu.node.attributes['point'];
		Phi.Map.setCenter(point);
	}
	,
	toggleVisibility: function (v, layerName) {
		var l = Philosophy.Map.map.getLayersByName(layerName);
		l[0].setVisibility(v)
	}
	,
	getLayersString: function () {
		var l = this.getChecked('layerName');
		return l.join(',');
	}
	,
	uncheckAll: function () {
		var startNode = this.root;

		var f = function () {
			if (this.attributes.checked) {
				this.attributes.checked = false;
				this.ui.toggleCheck(false);
			}
		}
		startNode.cascade(f);
	}
	,
	checkNodesByLayerName: function (layerName) {
		var f = function () {
			if (this.attributes.layerName === layerName) {
				var n = this;
				this.ensureVisible(
					function () {
						n.attributes.checked = true;
						n.ui.toggleCheck(true);
					}
				);
			}
		}
		this.root.cascade(f);
	}
	,
	buildTree: function () {
		var rasters = Philosophy.Map.map.getLayersBy('internalId', 'internal_raster');
		var children = [];

		Ext.each( rasters, function(r, i) {
			var point = { lon: r.rasterObject.point.x, lat: r.rasterObject.point.y, zoom: 10 };
			var node = { 
				Id: i +1, 
				layerName: 'raster-layer-' + i, 
				checked: r.rasterObject.visible, 
				text: r.rasterObject.name, 
				leaf: true, 
				incoCls: "icon-raster",
				point: point 
			};
			children.push(node);
		});

		var rastertree = [
		{
			Id: 0,
			checked: false,
			text: "<b>Raster</b>",
			leaf: false,
			expanded: true,
			children: children
		}
		];
		return rastertree;
	}
	,
	addRaster: function () {
		var data = this.buildTree();
		var r = new Ext.tree.TreeNode({ children: data });
		this.setRootNode(r);
		this.treeLoader.doPreload(r);
	}
});
