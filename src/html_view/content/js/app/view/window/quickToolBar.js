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
				Phi.Map.deactivateAllControls();
				if (b.pressed){
					Phi.Map.activateCustomControl('zoom_box');
					Phi.hint.setBody(Phi.Global.For('hint_zoom_box_in'));
					Phi.hint.show();
				}
				else{
					Phi.hint.hide();
				}
			}
		});

		this.zoomBoxOut = new Ext.Button({
			iconCls: 'icon-zoom-box-out',
			enableToggle: true,
			toggleGroup: 'control',
			scale: 'medium',
			tooltip: { title: Phi.Global.For('Zoom Box Out'), text: Phi.Global.For('Zoom Box Out Desc') },

			handler: function(b) {
				Phi.Map.deactivateAllControls();
				if (b.pressed){
					Phi.Map.activateCustomControl('zoom_box_out');
					Phi.hint.setBody(Phi.Global.For('hint_zoom_box_out'));
					Phi.hint.show();
				}
				else{
					Phi.hint.hide();
				}
			}
		});
		this.zoomIn = new Ext.Button({
			iconCls: 'icon-zoom-in',
			scale: 'medium',
			tooltip: { title: Phi.Global.For('Zoom In'), text: Phi.Global.For('Zoom In Desc') },
			handler: function() {
				Phi.Map.zoomIn();
			}
		});
		this.zoomOut = new Ext.Button({
			iconCls: 'icon-zoom-out',
			scale: 'medium',
			tooltip: { title: Phi.Global.For('Zoom Out'), text: Phi.Global.For('Zoom Out Desc') },
			handler: function() {
				Phi.Map.zoomOut();
			}
		});
		this.zoomInit = new Ext.Button({
			iconCls: 'icon-world',
			scale: 'medium',
			tooltip: { title: Phi.Global.For('Zoom Init'), text: Phi.Global.For('Zoom Init Desc') },
			handler: function() {
				Phi.Map.zoomInit();
			}
		});
		this.pan = new Ext.Button({
			iconCls: 'icon-hand',
			enableToggle: true,
			toggleGroup: 'control',
			scale: 'medium',
			tooltip: { title: Phi.Global.For('Pan'), text: Phi.Global.For('Pan Desc') },

			handler: function(b) {
				Phi.Map.deactivateAllControls();
				if (b.pressed){
					Phi.hint.setBody(Phi.Global.For('hint_pan'));
					Phi.hint.show();
				}
				else{
					Phi.hint.hide();
				}
			}
		});
		this.undo = new Ext.Button({
			iconCls: 'icon-undo',
			scale: 'medium',
			disabled: true,
			tooltip: { title: Phi.Global.For('Previous Position and Zoom'), text: Phi.Global.For('Previous Position and Zoom Desc') },
			handler: function() {
				Phi.Map.navHistory.previousTrigger();
			}
		});
		this.redo = new Ext.Button({
			iconCls: 'icon-redo',
			scale: 'medium',
			disabled: true,
			tooltip: { title: Phi.Global.For('Later Position and Zoom'), text: Phi.Global.For('Later Position and Zoom Desc') },
			handler: function() {
				Phi.Map.navHistory.nextTrigger();
			}
		});

		this.areaInfo = new Ext.Button({
			iconCls: 'icon-area-info',
			enableToggle: true,
			toggleGroup: 'control',
			scale: 'medium',
			tooltip: { title: Phi.Global.For('Layers in Selected Area'), text: Phi.Global.For('Layers in Selected Area Desc') },
			handler: function(b) {
				Phi.Map.deactivateAllControls();
				if (b.pressed){
					Phi.Map.activateCustomControl('box_layer_info');
					Phi.hint.setBody(Phi.Global.For('hint_layer_info'));
					Phi.hint.show();
				}
				else{
					Phi.hint.hide();
				}
			}
		});

		this.info = new Ext.Button({
			iconCls: 'icon-info',
			enableToggle: true,
			toggleGroup: 'control',
			scale: 'medium',
			tooltip: { title: Phi.Global.For('Element Info'), text: Phi.Global.For('Element Info Desc') },
			handler: function(b) {
				Phi.Map.deactivateAllControls();
				if (b.pressed){
					Phi.Map.activateCustomControl('click_layer_info');
					Phi.hint.setBody(Phi.Global.For('hint_geom_info'));
					Phi.hint.show();
				}
				else{
					Phi.hint.hide();
				}
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
				Phi.Map.deactivateAllControls();
				if (b.pressed){
					Phi.Map.activateCustomControl('box_bound_info');
					Phi.hint.setBody(Phi.Global.For('hint_box_bound_info'));
					Phi.hint.show();
				}
				else{
					Phi.hint.hide();
				}
			}
		});

		this.clickPoint = new Ext.Button({
			iconCls: 'icon-click-point',
			enableToggle: true,
			toggleGroup: 'control',
			scale: 'medium',
			tooltip: { title: Phi.Global.For('Position Coordinate'), text: Phi.Global.For('Position Coordinate Desc') },
			handler: function(b) {
				Phi.Map.deactivateAllControls();
				if (b.pressed){
					Phi.Map.activateCustomControl('click_point_info');
					Phi.hint.setBody(Phi.Global.For('hint_click_point_info'));
					Phi.hint.show();
				}
				else{
					Phi.hint.hide();
				}
			}
		});

		this.bbox.on('toggle', function(b, pressed) {
			if (pressed) {
				Phi.bboxOutput = new Phi.view.window.MeasureOutPut({ width: 300, height: 100 }) || Philosophy.bboxOutput;
				Phi.bboxOutput.show();
			}
			else {
				Phi.bboxOutput.close();
				Phi.Map.clearAllVectors();
			}
		});

		this.layerSearch = new Ext.Button({
			iconCls: 'icon-binocu',
			scale: 'medium',
			disabled: false,
			tooltip: { title: Phi.Global.For('Layer Search'), text: Phi.Global.For('Layer Search Desc') },
			handler: function() {
				Phi.panelLayer.treeWMSLayers.showSearch();
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
				Phi.Map.deactivateAllControls();
			}
		});

		this.coordinate.on('toggle', function(b, pressed) {
			if (pressed) {
				Phi.drawXY = new Phi.view.window.drawXY() || Philosophy.draXY;
				Phi.drawXY.show();
			}
			else {
				Phi.drawXY.close();
			}
		});

		this.measure = new Ext.Button({
			iconCls: 'icon-measure-alt',
			enableToggle: true,
			toggleGroup: 'control',
			scale: 'medium',
			tooltip: { title: Phi.Global.For('Measure'), text: Phi.Global.For('Measeure Desc') },
			handler: function(b) {
				Phi.Map.deactivateAllControls();
				if (b.pressed){
					Phi.Map.activateMeasureControl('line');
					Phi.hint.setBody(Phi.Global.For('hint_measure_line'));
					Phi.hint.show();
				}
				else{
					Phi.hint.hide();
				}
			}
		});

		this.measure.on('toggle', function(b, pressed) {
			if (pressed) {
				Phi.val = null;
				Phi.Map.setMeasureGlobals(0,'km',1);
				Phi.measureOutput = new Phi.view.window.LineMeasureOutput({ order:1}) || Philosophy.measureOutput;
				Phi.measureOutput.show();
			}
			else {
				Phi.measureOutput.close();
			}
		});

		this.area = new Ext.Button({
			iconCls: 'icon-area-alt',
			enableToggle: true,
			toggleGroup: 'control',
			scale: 'medium',
			tooltip: { title: Phi.Global.For('Area'), text: Phi.Global.For('Area Desc') },
			handler: function(b) {
				Phi.Map.deactivateAllControls();
				if (b.pressed){
					Phi.Map.activateMeasureControl('polygon');
					Phi.hint.setBody(Phi.Global.For('hint_measure_area'));
					Phi.hint.show();
				}
				else{
					Phi.hint.hide();
				}
			}
		});
		
		this.area.on('toggle', function(b, pressed) {
			if (pressed) {
				Phi.val = null;
				Phi.Map.setMeasureGlobals(0,'km',2);
				Phi.areaOutput = new Phi.view.window.LineMeasureOutput({ order: 2 }) || Philosophy.areaOutput;
				Phi.areaOutput.show();
			}
			else {
				Phi.areaOutput.close();
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