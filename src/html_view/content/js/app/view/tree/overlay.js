Ext.ns("Phi.view.tree");
/**
* @class Philosophy.view.tree.Overlay 
* @extends Ext.tree.TreePanel
* 
* Philosophy overlay Marker Vector, WMS etc.. (Openlayer) widget (tree)
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.tree.Overlay = Ext.extend(Ext.tree.TreePanel, {
	title: Phi.Global.For('Overlay'),
	animate: true,
	enableDD: false,
	border: true,
	autoScroll: true,
	rootVisible: false,
	containerScroll: true,

	initComponent: function () {
		
		var _this = this;
		this.marker_layers = [];
		this.vector_layers = [];
		this.selected_layer = null;

		// default layers left 
		this.marker_layers.push({
			Id: 4, 
			layerName: 'marker-layer', 
			text: 'Marcadores base', 
			checked: true, 
			leaf: true, 
			iconCls: "icon-overlay-alt" 
		});
		this.vector_layers.push({ 
			Id: 5, layerName: 'vector-layer', 
			text: 'Vectores Base', 
			checked: true, 
			leaf: true, 
			iconCls: "icon-overlay-alt" 
		});

		this.children = [];

		//left 
		this.children.push({ 
			Id: 1, 
			layerName: 'wms-layer', 
			text: Phi.Global.For('Web Map Service'), 
			checked: true, 
			leaf: true, 
			iconCls: "icon-overlay-alt" 
		});

		//Node 
		this.children.push({ 
			Id: 2, 
			text: Phi.Global.For('Markers'), 
			checked: true, 
			leaf: false, 
			expanded: true, 
			children: 
			this.marker_layers 
		});
			
        this.children.push({ 
			Id: 3, 
			text: Phi.Global.For('Vectors'), 
			checked: true, 
			leaf: false, 
			expanded: true, 
			children: 
			this.vector_layers 
		});

		this.data = [{ 
			Id: 0, 
			checked: true, 
			text: "<b>" + Phi.Global.For('Overlay') + "</b>", 
			leaf: false, 
			expanded: true, 
			children: this.children
		}];

		this.root = new Ext.tree.TreeNode({ children: this.data, expanded: true });
		this.treeLoader = new Ext.tree.TreeLoader({ preloadChildren: true })
		this.treeLoader.doPreload(this.root);

		this.on('checkchange', function (n, checked) {
			if (n.hasChildNodes()) {
				n.expand();
				n.eachChild(function (c) {
					c.ui.toggleCheck(checked);
				});
			}
			else {
				var layerName = n.attributes['layerName'];
				var l = Phi.Map.map.getLayersByName(layerName);
				l[0].setVisibility(checked);
			}
		});

		/*
		this.on('contextmenu', function (node, e) {
			if (node.isLeaf()) {
				node.select();
				var layerName = node.attributes['layerName'];
				if (layerName === 'wms-layer') return
				if (layerName === 'marker-layer') return
				if (layerName === 'vector-layer') return
				//do something eventually
				//c.contextNode = node;
				//c.showAt(e.getXY());
			}
		});
		*/
		
		this.tbar = new Ext.Toolbar({ items: ['-', { xtype: 'tbfill' }, '-'] });
		Phi.view.tree.Overlay.superclass.initComponent.apply(this, arguments);
	}
	,
	toggleVisibility: function (v, layerName) {
		var l = Phi.Map.map.getLayersByName(layerName);
		l[0].setVisibility(v)
	}
});
