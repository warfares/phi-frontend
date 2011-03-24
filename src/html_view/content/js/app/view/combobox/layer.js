Ext.ns("Phi.view.comboBox");
/**
* @class Philosophy.view.comboBox.Layer
* 
* combobox with all domain model layers by user
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
* */
Phi.view.comboBox.Layer = Ext.extend(Ext.form.ComboBox, {
	fieldLabel: Philosophy.Globalization.For('Layer'),
	displayField: 'Title',
	valueField: 'Name',
	mode: 'local',
	forceSelection: true,
	triggerAction: 'all',
	selectOnFocus: true,
	allowBlank: false,
	editable: false,
	initComponent: function () {

		this.tpl = new Ext.XTemplate(
			'<tpl for=".">'
			+ '<div class="x-combo-list-item ux-icon-combo-item icon-layer">'
			+ '{title}'
			+ '</div></tpl>'
		);

		var store = new Ext.data.Store({
			reader: new Ext.data.JsonReader({ fields: ["name", "title"] }),
			sortInfo: { field: 'name', direction: "ASC" }
		});

		Ext.apply(this, {
			store: store
		});

		Phi.view.comboBox.Layer.superclass.initComponent.call(this);

		var userName = Phi.Session.getUser();
		var user = new Phi.model.User();
		user.on('getlayers', this.loadLayers, this);
		user.getLayers(userName);
	}
	,
	loadLayers: function(layers){
		this.store.loadData(layers);
	}
});  // eo Phi.view.comboBox.Layer
// eof