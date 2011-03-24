Ext.ns("Phi.view.comboBox");
/**
* @class Philosophy.view.comboBox.Marker
* 
* combobox with markers options 
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
* */
Phi.view.comboBox.Marker = Ext.extend(Ext.ux.IconCombo, {
	fieldLabel: Philosophy.Globalization.For('Marker'),
	displayField: 'name',
	valueField: 'value',
	iconClsField: 'cls',
	mode: 'local',
	forceSelection: true,
	triggerAction: 'all',
	selectOnFocus: true,
	allowBlank: false,
	editable: false,
	initComponent: function() {

		var store = new Ext.data.SimpleStore({
			fields: ['value', 'name', 'cls'],
			data: [
			['point4red', 'Point 4 Red', 'icon-point4-red'],
			['point5red', 'Point 5 Red', 'icon-point5-red'],
			['point6red', 'Point 6 Red', 'icon-point6-red'],
			['point4yellow', 'Point 4 Yellow', 'icon-point4-yellow'],
			['point5yellow', 'Point 5 Yellow', 'icon-point5-yellow'],
			['point6yellow', 'Point 6 Yellow', 'icon-point6-yellow'],
			['googleMarker', 'Google Marker', 'icon-google-marker']
			]
		});

		Ext.apply(this, {
			store: store
		});

		Phi.view.comboBox.Marker.superclass.initComponent.call(this);

		this.setValue('point4red');
	}
});// eo Phi.view.comboBox.Marker
// eof