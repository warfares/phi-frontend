Ext.ns("Phi.view.comboBox");
/**
* @class Philosophy.view.comboBox.Pattern
* 
* combobox with string search pattern
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
* */
Phi.view.comboBox.Pattern = Ext.extend(Ext.form.ComboBox, {
	displayField: 'name',
	valueField: 'value',
	mode: 'local',
	allowBlank: false,
	width:90,
	forceSelection: true,
	selectOnFocus: true,
	triggerAction: 'all',
	allowBlank: false,
	editable: false,

	initComponent: function() {
		var _this = this;

		var store = new Ext.data.SimpleStore({
			fields: ['value', 'name'],
			data: [
				['0', Philosophy.Globalization.For('Contain')],
				['1', Philosophy.Globalization.For('Begin')],
				['2', Philosophy.Globalization.For('End')],
				['3', Philosophy.Globalization.For('Exact')]
			]
		});

		Ext.apply(this, {store: store});

		Phi.view.comboBox.Pattern.superclass.initComponent.call(this);

		this.setValue('0');
	}
}); // eo Phi.view.comboBox.Pattern
// eof