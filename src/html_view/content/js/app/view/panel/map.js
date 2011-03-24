Ext.ns("Phi.view.panel");
/**
* @class Philosophy.view.panel.Map
* 
* Philosophy map tools Panel (Dashboard)
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
* 
*/
Phi.view.panel.MenuPanel = Ext.extend(Ext.DataView, {
	autoHeight: true,
	frame: true,
	multiSelect: false,
	singleSelect: true,
	overClass: 'over',
	selectedClass: 'selected',
	itemSelector: 'dd',
	tpl: new Ext.XTemplate(
		'<div id="menu_map-ct">',
		'<tpl for=".">',
		'<div class="collapsed">',
		'<h2><div>{title}',
		'</div></h2>',
		'<dl>',
		'<tpl for="app">',
		'<dd ext:control="{control}" ext:action="{action}" >',
		'<img src="{icon}" title="{tooltip}" ></img>',
		'</dd>',
		'</tpl>',
		'<div style="clear:left"></div>',
		'</dl>',
		'</div>',
		'</tpl>',
		'</div>'
	),
	onClick: function (e) {

		var group = e.getTarget('h2', 3, true);
		if (group) {
			group.up('div').toggleClass('collapsed');
		} else {
			var t = e.getTarget('dd', 5, true);
			if (t) {

				var action = t.getAttributeNS('ext', 'action');
				var control = t.getAttributeNS('ext', 'control');

				Philosophy.Map.deactivateAllControls();

				switch (action) {
					case "navigation":

					switch (control) {
						case "zoomIn":
							Phi.Map.zoomIn();
						break
						case "zoomOut":
							Phi.Map.zoomOut();
						break;
						case "zoomBoxIn":
							Phi.Map.activateCustomControl('zoom_box');
						break;
						case "zoomBoxOut":
							Phi.Map.activateCustomControl('zoom_box_out');
						break;
					}

					break;
					case "color":
						var win = new Phi.view.window.colorPicker({ x: 100, y: 100 });
						win.show(this);
					break;

					case "vector":
						Phi.Map.activateVectorControl(control);
					break;

					case "vectorClear":
					
					Ext.MessageBox.show({
						title: '',
						msg: Phi.Global.For('Clear already draw geometries ?'),
						buttons: Ext.MessageBox.YESNO,
						fn: function (btn, text) {
							if (btn == 'yes') {
								Philosophy.Map.vectorLayer.destroyFeatures();
							}
						}
					});
					break;
				}
			}
		}
		return Phi.view.window.MenuPanel.superclass.onClick.apply(this, arguments);
	}
});   // Phi.view.panel.MenuPanel

Phi.view.panel.Map = Ext.extend(Ext.Panel, {
	border: false,
	collapsible: true,
	plugins: [Ext.ux.plugins.ToggleCollapsible],
	title: Phi.Global.For('Tools'),
	layout: 'fit',
	winLegend: null,

	initComponent: function() {

		var menuData = [
		{
			title: Phi.Global.For('Navigation'),
			app: [
			{
				action: 'navigation',
				control: 'zoomIn',
				icon: 'content/images/menuicons/zoom_in_alt.png',
				tooltip: Phi.Global.For('Zoom In')
			}
			,
			{
				action: 'navigation',
				control: 'zoomOut',
				icon: 'content/images/menuicons/zoom_out_alt.png',
				tooltip: Phi.Global.For('Zoom Out')
			}
			,
			{
				action: 'navigation',
				control: 'zoomBoxIn',
				icon: 'content/images/menuicons/zoom_in.png',
				tooltip: Phi.Global.For('Zoom Box In')
			}
			,
			{
				action: 'navigation',
				control: 'zoomBoxOut',
				icon: 'content/images/menuicons/zoom_out.png',
				tooltip: Phi.Global.For('Zoom Box Out')
			}
			,                     
			{
				icon: 'content/images/menuicons/pan_off.png',
				tooltip: Phi.Global.For('Pan')
			}
			]
		}
		,
		{
			title: Phi.Global.For('Vector'),
			app: [  {
				action: 'color',
				icon: 'content/images/menuicons/color_alt.png',
				tooltip: Phi.Global.For('Color Selection')
			}
			,
			{
				action: 'vector',
				control: 'point',
				icon: 'content/images/menuicons/draw_point_off.png',
				tooltip: Phi.Global.For('Draw Point')
			}
			,
			{
				action: 'vector',
				control: 'line',
				icon: 'content/images/menuicons/draw_line_off.png',
				tooltip: Phi.Global.For('Draw Polyline')
			}
			,
			{
				action: 'vector',
				control: 'polygon',
				icon: 'content/images/menuicons/draw_polygon_off.png',
				tooltip: Phi.Global.For('Draw Polygon')
			}
			,

			{
				action: 'vector',
				control: 'regular',
				icon: 'content/images/menuicons/regular.png',
				tooltip: Phi.Global.For('Draw Regular Polygon')

			}
			,
			{
				action: 'vector',
				control: 'drag',
				icon: 'content/images/menuicons/move_feature_off.png',
				tooltip: Phi.Global.For('Drag Polygon')
			}
			,
			{
				action: 'vector',
				control: 'modify',
				icon: 'content/images/menuicons/modify.png',
				tooltip: Phi.Global.For('Modify Polygon')

			}
			,
			{
				action: 'vector',
				control: 'del',
				icon: 'content/images/menuicons/delete.png',
				tooltip: Phi.Global.For('Delete One By One Polygon')
			}
			,
			{
				action: 'vectorClear',
				icon: 'content/images/menuicons/delete_all.png',
				tooltip: Phi.Global.For('Clear All')
			}

			]
		}
		];

		var store = new Ext.data.JsonStore({
			fields: ['title', 'app'],
			data: menuData
		});

		var menuPanel = new Phi.view.panel.MenuPanel({ store: store });
		this.items = menuPanel; 

		Phi.view.panel.Map.superclass.initComponent.call(this);

	}
});  // eo Phi.view.panel.Map
// eof