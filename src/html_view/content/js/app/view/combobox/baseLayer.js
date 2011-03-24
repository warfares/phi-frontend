Ext.ns("Phi.view.comboBox");
/**
* @class Philosophy.view.comboBox.BaseLayer
* 
* combobox with OpenLayers (Philosophy.Map.map) base layers 
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
* */
Phi.view.comboBox.BaseLayer = Ext.extend(Ext.ux.IconCombo, {
	displayField: 'name',
	valueField: 'value',
	iconClsField: 'cls',
	width:180,
	mode: 'local',
	forceSelection: true,
	triggerAction: 'all',
	selectOnFocus: true,
	allowBlank: false,
	editable: false,
	initComponent: function () {

		var storeLayers = new Ext.data.SimpleStore({ fields: ['value', 'name', 'cls'] });

		Ext.apply(this, {
			store: storeLayers
		});

		this.on('select', function(combo, record, index) {
			var layerName = record.data.value;
			this.setBaseLayerByName(layerName);
		});

		Phi.view.comboBox.BaseLayer.superclass.initComponent.call(this);
	}
	,
	onRender: function() {

		Phi.view.comboBox.BaseLayer.superclass.onRender.apply(this, arguments);

		var t = new Ext.ToolTip({
			target: this.el,
			title: Phi.Global.For('Base Layers'),
			width: 200,
			html: Phi.Global.For('List available base cartography, i.e: Google, OpenStreetMap, Ultramap, etc'),
			trackMouse: true
		});
	}
	,
	setBaseLayerByName: function(layerName) {
		var l = Phi.Map.map.getLayersByName(layerName);
		Phi.Map.map.setBaseLayer(l[0]);
		Phi.Map.map.updateSize();
	}
	,
	loadBaseLayers: function() {
		var data = [];
		for (var i = 0, len = Phi.Map.map.layers.length; i < len; i++) {
			var l = Phi.Map.map.layers[i];
			if (l.isBaseLayer) {
				var item = [l.name, l.name, l.icon];
				data.unshift(item);
			}
		}
		this.store.loadData(data);
		this.setValue(Philosophy.Map.baseLayer.name);
	}
});// eo Phi.view.comboBox.BaseLayer 
// eof