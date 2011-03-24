Ext.ns("Phi.view.panel");
/**
* @class Philosophy.view.panel.Layer
* 
* Philosophy layers panel (Dashboard)
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*  
*/
Phi.view.panel.Layer = Ext.extend(Ext.Panel, {
	border: false,
	layout: 'fit',
	collapsible: true,
	plugins: [Ext.ux.plugins.ToggleCollapsible],
	title: Phi.Global.For('Layers'),

	initComponent: function () {

		this.treeWMSLayers = new Phi.view.tree.WMSLayers();
		this.treeRaster = new Phi.view.tree.Raster();
		this.treeOverlay = new Phi.view.tree.Overlay();
		this.panelResume = new Phi.view.panel.ResumeLayer();

		this.tabPanel = new Ext.TabPanel({
			activeTab: 0,
			deferredRender: false,
			width: 600,
			height: 250,
			plain: true,
			defaults: { autoScroll: true },
			items: [this.treeWMSLayers, this.treeRaster, this.treeOverlay, this.panelResume]
		});

		this.items = [this.tabPanel];
		Phi.view.panel.Layer.superclass.initComponent.call(this);
	}
	,
	showResume: function () {
		this.tabPanel.activate(this.panelResume);
	}
	,
	load: function () {
		this.treeWMSLayers.load();
	}
});  // eo Phi.view.panel.Layer 
// eof