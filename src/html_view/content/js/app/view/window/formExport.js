Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.FormExport 
* @extends Ext.Window
* 
* Philosophy export layer, widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.FormExport = Ext.extend(Ext.Window, {
	title: Phi.Global.For('Export'),
	width: 400,
	height: 300,
	closeAction: 'close',
	maximizable: false,
	modal: true,
	layout: 'border',
	maximizable: false,
	resizable: false,

	initComponent: function () {
		var _this = this;

		// map format combo 
		var data = [['application/pdf', 'PDF', 'icon-file-pdf'],
		['image/jpeg', 'JPEG', 'icon-file-image'],
		['image/gif', 'GIF', 'icon-file-image'],
		['image/png', 'PNG', 'icon-file-image'],
		['image/png', 'PNG (optimal 256 color palette)', 'icon-file-image'],
		['image/tiff', 'TIFF', 'icon-file-image'],
		['image/tiff8', 'TIFF (optimal 256 color palette)', 'icon-file-image'],
		['image/svg', 'SVG', 'icon-file-image'],
		['application/vnd.google-earth.kml', 'KML', 'icon-file-image']];

		var storeFormat = new Ext.data.SimpleStore({
			fields: ['value', 'name', 'class'],
			data: data
		});

		this.comboFormat = new Ext.ux.IconCombo({
			fieldLabel: Phi.Global.For('Format'),
			store: storeFormat,
			valueField: 'value',
			displayField: 'name',
			iconClsField: 'class',
			editable: false,
			mode: 'local',
			triggerAction: 'all',
			emptyText: Phi.Global.For('Select a export format'),
			selectOnFocus: true,
			allowBlank: false
		});

		// export layer format combo
		var dataLayerFormat = [
			['SHAPE-ZIP', 'SHAPE'],
			['GML2', 'GML2'],
			['GML3', 'GML3'],
			['OGR-KML', 'KML'],
			['json', 'JSON'],
			['CSV', 'CSV'],
			['OGR-TAB', 'TAB'],
			['OGR-MIF', 'MIF'],
			['OGR-TAB', 'TAB']
		];

		var storeLayerFormat = new Ext.data.SimpleStore({
			fields: ['value', 'name'],
			data: dataLayerFormat
		})

		this.comboLayerFormat = new Ext.form.ComboBox({
			fieldLabel: Phi.Global.For('Format'),
			store: storeLayerFormat,
			valueField: 'value',
			displayField: 'name',
			editable: false,
			mode: 'local',
			triggerAction: 'all',
			emptyText: Phi.Global.For('Select a export format'),
			selectOnFocus: true,
			allowBlank: false
		});
		//

		this.comboLayer = new Phi.view.comboBox.Layer();

		var formMapPanel = new Ext.FormPanel({
			xid: 0,
			title: Phi.Global.For('Map Export'),
			labelWidth: 150,
			defaults: { width: 240 },
			labelAlign: 'top',
			region: 'center',
			bodyStyle: 'padding:5px',
			frame: true,
			items: [this.comboFormat]
		});

		var formLayerPanel = new Ext.FormPanel({
			xid: 1,
			title: Phi.Global.For('Layer Export'),
			labelWidth: 150,
			defaults: { width: 240 },
			labelAlign: 'top',
			region: 'center',
			bodyStyle: 'padding:5px',
			frame: true,
			items: [this.comboLayerFormat, this.comboLayer]
		});

		this.tabPanel = new Ext.TabPanel({
			title: '',
			region: 'center',
			margins: '5 5 5 5',
			activeTab: 0,
			plain: true,
			defaults: { autoScroll: true },
			items: [formMapPanel, formLayerPanel]
		});


		this.items = [this.tabPanel];
		Phi.view.window.FormExport.superclass.initComponent.call(this);

		this.addButton(Phi.Global.For('Close'), function () { _this.close(); });
		this.addButton(Phi.Global.For('Export'), function () { _this.exportAction(); });

		//default values 
		this.comboFormat.setValue('application/pdf');
		this.comboLayerFormat.setValue('SHAPE-ZIP');
	}
	,
	exportAction: function () {
		var panel = this.tabPanel.getActiveTab();

		if (!panel.form.isValid()) {
			Ext.MessageBox.alert(Phi.Global.For('Warning'), Phi.Global.For('Check form'));
			return;
		}

		if (panel.xid == 0)
			this.exportMap();

		if (panel.xid == 1)
			this.exportLayer();
	}
	,
	exportMap: function () {

		var format = this.comboFormat.getValue();
		var bound = Philosophy.Map.map.getExtent();
		var bbox = bound.left + ',' + bound.bottom + ',' + bound.right + ',' + bound.top;
		var size = Philosophy.Map.map.getSize();

		var query = {
			request: 'GetMap',
			version: '1.1.1',
			format: format,
			style: '',
			layers: Philosophy.Layer.getWMSLayers(Philosophy.Config.wmsNameSpace),
			srs: 'EPSG:900913',
			bbox: bbox,
			width: size.w,
			height: size.h
		}

		var wmsUrl = Philosophy.Config.wmsUrl + Ext.urlEncode(query);
		window.open(wmsUrl);
	}
	,
	exportLayer: function () {
		var layer = Philosophy.Config.wmsNameSpace + ':' + this.comboLayer.getValue().split('.')[1]; // NOTE fix this 
		var format = this.comboLayerFormat.getValue();

		var query = {
			request: 'getfeature',
			service: 'wfs',
			version: '1.1.0',
			typename: layer,
			outputFormat: format
		}

		var wfsUrl = Philosophy.Config.wfsUrl + Ext.urlEncode(query);
		window.open(wfsUrl);
	}
});  // eo Phi.view.window.FormExport 
// eof