Ext.ns("Phi.view.form");
/**
* @class Philosophy.view.form.SearchLayer
* 
* Form for search layers  
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.form.SearchLayer = Ext.extend(Ext.form.FormPanel, {
	labelWidth: 75,
	frame: true,
	title: '',
	bodyStyle: 'padding:5px 5px 5px 5px',
	labelAlign: 'top',
	width: 250,

	initComponent: function () {
		
		this.patternField = new Ext.form.TextField({
			fieldLabel: Phi.Global.For('Description'),
			name: 'pattern',
			width: 120
		});

		this.comboPosition = new Phi.view.comboBox.Pattern();

		var fs = new Ext.form.FieldSet({
			title: Phi.Global.For('Search params'),
			labelAlign: 'top',
			autoHeight: true,
			layout: 'column',
			items: [this.patternField, this.comboPosition]
		});

		//Other Parameteres
		var storeType = new Ext.data.SimpleStore({
			fields: ['value', 'name', 'cls'],
			data: [['%', 'all', 'icon-all'],
				['multilinestring', 'multilinestring', 'icon-g-line'],
				['multipolygon', 'multipolygon','icon-g-poly'],
				['point', 'point', 'icon-g-point' ]]
		});

		this.comboType = new Ext.ux.IconCombo({
			store: storeType,
			fieldLabel: Phi.Global.For('Type'),
			displayField: 'name',
			valueField: 'value',
			iconClsField: 'cls',
			value: '%',
			mode: 'local',
			anchor: '95%',
			forceSelection: true,
			triggerAction: 'all',
			emptyText: Phi.Global.For('Select Operator'),
			selectOnFocus: true,
			editable: false            
		});

		var fsOthers = new Ext.form.FieldSet({
			title: Phi.Global.For('Others parameters'),
			collapsible: true,
			collapsed: true,
			autoHeight: true,
			items: [this.comboType]
		});

		this.items = [fs, fsOthers];

		Phi.view.form.SearchLayer.superclass.initComponent.call(this);
	}
	,
	getParams: function () {
		var pattern = this.patternField.getValue();
		var position = this.comboPosition.getValue();
		var type = this.comboType.getValue();

		var params = {
			pattern: pattern,
			position: position,
			type: type
		};

		return params;
	}
});    // eo Phi.view.form.SearchLayer
// eof