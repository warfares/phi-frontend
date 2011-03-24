Ext.ns("Phi.view.tree");
/**
* @class Philosophy.view.tree.Base 
* @extends Ext.tree.TreePanel
* 
* Philosophy common behavior for checked node tree. 
* TODO: refactor layer action to WMS tree..
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.tree.Base = Ext.extend(Ext.tree.TreePanel, {
	animate: true,
	enableDD: false,
	border: true,
	autoScroll: true,
	rootVisible: false,
	containerScroll: true,
	
	initComponent: function () {
		var _this = this;
		this.root = new Ext.tree.TreeNode({ children: [] });
		this.loader = new Ext.tree.TreeLoader({ preloadChildren: true })
		this.loader.doPreload(this.root);

		this.on('checkchange', function (n, checked) {
			if (n.hasChildNodes()) {
				n.expand();
				n.eachChild(function (c) {
					c.ui.toggleCheck(checked);
					c.fireEvent('checkchange', c, checked);
				});
			}
		});

		Phi.view.tree.Base.superclass.initComponent.apply(this, arguments);
		this.on('beforeappend', this.format, this);
	}
	,
	format: function (tree, parent, node) {
		if (node.isLeaf())
			node.attributes.iconCls = 'icon-layer';
		else
			node.attributes.text = '<b>' + node.attributes.text + '</b>';
	}
	,
	checkAll: function () {
		var f = function () {
			if (!this.attributes.checked) {
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
	,
	checkNodeByLayerId: function (layerId) {
		var f = function () {
			if (this.attributes.layerId == layerId) {
				var n = this;
				this.ensureVisible(
					function () {
						n.attributes.checked = true;
						n.ui.toggleCheck(true);
					}
				);
			}
		}
		// This a complete ugly temporal solution  // TODO: check and find ExtJS Code Bug
		this.root.cascade(f);
		this.root.cascade(f);
	}
	,
	checkNodeById: function (id) {
		var f = function () {
			if (this.attributes.id == id) {
				var n = this;
				this.ensureVisible(
					function () {
						n.attributes.checked = true;
						n.ui.toggleCheck(true);
					}
				);
			}
		}
		// This a complete ugly temporal solution  // TODO: check and find ExtJS Code Bug
		this.root.cascade(f);
		this.root.cascade(f);
	}
	,
	searchNode: function (id) {
		var startNode = this.treeLayer.root;
		t = this;
		var f = function () {
			if (this.attributes.Id == id) {
				var n = this;
				this.ensureVisible(
					function () {
						var m = t.getNodeById(n.id);
						var el = Ext.fly(m.getUI().getEl());
						el.highlight("ffff9c", { duration: 3 });
					}
				);
			}
		}
		startNode.cascade(f);
	}
	,
	searchNodeByLayer: function (layerId) {
		var startNode = this.treeLayer.root;
		t = this;
		var f = function () {
			if (this.attributes.layerId == layerId) {
				var n = this;
				this.ensureVisible(
					function () {
						var m = t.getNodeById(n.id);
						var el = Ext.fly(m.getUI().getEl());
						el.highlight("ffff9c", { duration: 3 });
					}
				);
			}
		}
		startNode.cascade(f);
	}
	,
	//overide Ext tree getChecked
	getChecked: function (aname, atitle, aSRID, startNode) {
		startNode = startNode || this.root;
		var r = [];
		var f = function () {
			if (this.attributes.checked && this.isLeaf()) {
				var nodeName = this.attributes[aname];
				var nodeTitle = this.attributes[atitle];
				var nodeSRID = this.attributes[aSRID];
				var layer = {   
					'name': nodeName,
					'title': nodeTitle, 
					'srid': nodeSRID };
					r.push(layer);
				}
		}
		startNode.cascade(f);
		return r;
	}
	,
	getCheckedIds: function (startNode) {
		startNode = startNode || this.root;
		var r = [];
		var f = function () {
			if (this.attributes.checked && this.isLeaf()) {
				var id = this.attributes['id'];
				r.push(id);
			}
		}
		startNode.cascade(f);
		return r.join(',');
	}
});