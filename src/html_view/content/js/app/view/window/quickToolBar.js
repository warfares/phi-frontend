Ext.ns("Phi.view.window");

// Helper class for organizing the buttons
ButtonPanel = Ext.extend(Ext.Panel, {
	defaultType: 'button',
	baseCls: 'x-plain',
	cls: 'btn-panel',
	region: 'center',
	constructor: function() {

		this.zoomBoxIn = new Ext.Button({
			iconCls: 'icon-zoom-box',
			enableToggle: true,
			toggleGroup: 'control',
			scale: 'medium',
			tooltip: { title: Phi.Global.For('Zoom Box In'), text: Phi.Global.For('Zoom Box In Desc') },
			handler: function(b) {
				Philosophy.Map.deactivateAllControls();
				if (b.pressed)
					Philosophy.Map.activateCustomControl('zoom_box');
			}
		});

		this.zoomBoxOut = new Ext.Button({
			iconCls: 'icon-zoom-box-out',
			enableToggle: true,
			toggleGroup: 'control',
			scale: 'medium',
			tooltip: { title: Phi.Global.For('Zoom Box Out'), text: Phi.Global.For('Zoom Box Out Desc') },

			handler: function(b) {
				Philosophy.Map.deactivateAllControls();
				if (b.pressed)
					Philosophy.Map.activateCustomControl('zoom_box_out');
			}
		});
		this.zoomIn = new Ext.Button({
			iconCls: 'icon-zoom-in',
			scale: 'medium',
			tooltip: { title: Phi.Global.For('Zoom In'), text: Phi.Global.For('Zoom In Desc') },
			handler: function() {
				Philosophy.Map.zoomIn();
			}
		});
		this.zoomOut = new Ext.Button({
			iconCls: 'icon-zoom-out',
			scale: 'medium',
			tooltip: { title: Phi.Global.For('Zoom Out'), text: Phi.Global.For('Zoom Out Desc') },
			handler: function() {
				Philosophy.Map.zoomOut();
			}
		});
		this.zoomInit = new Ext.Button({
			iconCls: 'icon-world',
			scale: 'medium',
			tooltip: { title: Phi.Global.For('Zoom Init'), text: Phi.Global.For('Zoom Init Desc') },
			handler: function() {
				Philosophy.Map.zoomInit();
			}
		});
		this.pan = new Ext.Button({
			iconCls: 'icon-hand',
			enableToggle: true,
			toggleGroup: 'control',
			scale: 'medium',
			tooltip: { title: Phi.Global.For('Pan'), text: Phi.Global.For('Pan Desc') },

			handler: function() {
				Philosophy.Map.deactivateAllControls();
			}
		});
		this.undo = new Ext.Button({
			iconCls: 'icon-undo',
			scale: 'medium',
			disabled: true,
			tooltip: { title: Phi.Global.For('Previous Position and Zoom'), text: Phi.Global.For('Previous Position and Zoom Desc') },
			handler: function() {
				Philosophy.Map.navHistory.previousTrigger();
			}
		});
		this.redo = new Ext.Button({
			iconCls: 'icon-redo',
			scale: 'medium',
			disabled: true,
			tooltip: { title: Phi.Global.For('Later Position and Zoom'), text: Phi.Global.For('Later Position and Zoom Desc') },
			handler: function() {
				Philosophy.Map.navHistory.nextTrigger();
			}
		});

		this.areaInfo = new Ext.Button({
			iconCls: 'icon-area-info',
			enableToggle: true,
			toggleGroup: 'control',
			scale: 'medium',
			tooltip: { title: Phi.Global.For('Layers in Selected Area'), text: Phi.Global.For('Layers in Selected Area Desc') },
			handler: function(b) {
				Philosophy.Map.deactivateAllControls();
				if (b.pressed)
					Philosophy.Map.activateCustomControl('box_layer_info');
			}
		});

		this.info = new Ext.Button({
			iconCls: 'icon-info',
			enableToggle: true,
			toggleGroup: 'control',
			scale: 'medium',
			tooltip: { title: Phi.Global.For('Element Info'), text: Phi.Global.For('Element Info Desc') },
			handler: function(b) {
				Philosophy.Map.deactivateAllControls();
				if (b.pressed)
					Philosophy.Map.activateCustomControl('click_layer_info');
			}
		});

		this.bbox = new Ext.Button({
			iconCls: 'icon-bbox',
			enableToggle: true,
			toggleGroup: 'control',
			scale: 'medium',
			disabled: false,
			tooltip: { title: Phi.Global.For('Coordinates Box'), text: Phi.Global.For('Coordinates Box Desc') },
			handler: function(b) {
				Philosophy.Map.deactivateAllControls();
				if (b.pressed)
					Philosophy.Map.activateCustomControl('box_bound_info');
			}
		});

		this.clickPoint = new Ext.Button({
			iconCls: 'icon-click-point',
			enableToggle: true,
			toggleGroup: 'control',
			scale: 'medium',
			tooltip: { title: Phi.Global.For('Position Coordinate'), text: Phi.Global.For('Position Coordinate Desc') },
			handler: function(b) {
				Philosophy.Map.deactivateAllControls();
				if (b.pressed)
					Philosophy.Map.activateCustomControl('click_point_info');
			}
		});

		this.bbox.on('toggle', function(b, pressed) {
			if (pressed) {
				Philosophy.bboxOutput = new Phi.view.window.MeasureOutPut({ width: 300, height: 100 }) || Philosophy.bboxOutput;
				Philosophy.bboxOutput.show();
			}
			else {
				Philosophy.bboxOutput.close();
				Philosophy.Map.clearAllVectors();
			}
		});

		this.layerSearch = new Ext.Button({
			iconCls: 'icon-binocu',
			scale: 'medium',
			disabled: false,
			tooltip: { title: Phi.Global.For('Layer Search'), text: Phi.Global.For('Layer Search Desc') },
			handler: function() {
				Philosophy.panelLayer.treeWMSLayers.showSearch();
			}
		});

		this.coordinate = new Ext.Button({
			iconCls: 'icon-coo',
			enableToggle: true,
			toggleGroup: 'control',
			scale: 'medium',
			disabled: false,
			tooltip: { title: Phi.Global.For('Draw Coordinates'), text: Phi.Global.For('Draw Coordinate Desc') },
			handler: function() {
				Philosophy.Map.deactivateAllControls();
			}
		});

		this.coordinate.on('toggle', function(b, pressed) {
			if (pressed) {
				Philosophy.drawXY = new Phi.view.window.drawXY() || Philosophy.draXY;
				Philosophy.drawXY.show();
			}
			else {
				Philosophy.drawXY.close();
			}
		});

		this.measure = new Ext.Button({
			iconCls: 'icon-measure-alt',
			enableToggle: true,
			toggleGroup: 'control',
			scale: 'medium',
			tooltip: { title: Phi.Global.For('Measure'), text: Phi.Global.For('Measeure Desc') },
			handler: function(b) {
				Philosophy.Map.deactivateAllControls();
				if (b.pressed) {
					Philosophy.Map.activateMeasureControl('line');
				}
			}
		});

		this.measure.on('toggle', function(b, pressed) {
			if (pressed) {
				Philosophy.val = null;
				Philosophy.Map.setMeasureGlobals(0,'km',1);
				Philosophy.measureOutput = new Phi.view.window.LineMeasureOutput({ order:1}) || Philosophy.measureOutput;
				Philosophy.measureOutput.show();
			}
			else {
				Philosophy.measureOutput.close();
			}
		});

		this.area = new Ext.Button({
			iconCls: 'icon-area-alt',
			enableToggle: true,
			toggleGroup: 'control',
			scale: 'medium',
			tooltip: { title: Phi.Global.For('Area'), text: Phi.Global.For('Area Desc') },
			handler: function(b) {
				Philosophy.Map.deactivateAllControls();
				if (b.pressed) {
					Philosophy.Map.activateMeasureControl('polygon');
				}
			}
		});

		this.area.on('toggle', function(b, pressed) {
			if (pressed) {
				Philosophy.val = null;
				Philosophy.Map.setMeasureGlobals(0,'km',2);
				Philosophy.areaOutput = new Phi.view.window.LineMeasureOutput({ order: 2 }) || Philosophy.areaOutput;
				Philosophy.areaOutput.show();
			}
			else {
				Philosophy.areaOutput.close();
			}
		});

		var items = [this.zoomBoxIn,
			this.zoomBoxOut,
			this.zoomIn,
			this.zoomOut,
			this.zoomInit,
			this.pan,
			this.undo,
			this.redo,
			this.info,
			this.areaInfo,
			this.bbox,
			this.clickPoint,
			this.layerSearch,
			this.coordinate,
			this.measure,
			this.area];

		ButtonPanel.superclass.constructor.call(this, { items: items });
	}
});


/**
* @class Philosophy.view.window.QuickToolBar
* @extends Ext.Window
* 
* Philosophy main quick toolbar, widget
* 
* @author rbarriga
* @version 1.2
* @copyright (c) 2010, by IKOM
* @date      15. July 2010
*/
Phi.view.window.QuickToolBar = Ext.extend(Ext.Window, {
	title: '',
	maximizable: false,
	closable: false,
	resizable: false,
	draggable: false,
	modal: false,
	plain: true,
	bodyStyle: 'padding:2px 2px 2px 2px',
	initComponent: function () {

		this.bp = new ButtonPanel();
		this.items = this.bp;

		Phi.view.window.QuickToolBar.superclass.initComponent.call(this);
	}
	,
	align: function (c) {
		c = c || Ext.get("map");
		this.alignTo(c, 'tr-tr?', [-3, 3]);
	}
	});// eo Phi.view.window.QuickToolBar
	// eof