Ext.ns("Phi.view.comboBox");
/**
* @class Philosophy.view.comboBox.UserGroup
* 
* combobox with all domain model groups by user
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
* */
Phi.view.comboBox.UserGroup = Ext.extend(Ext.form.ComboBox, {
	displayField: 'Name',
	valueField: 'Id',
	mode: 'local',
	forceSelection: false,
	triggerAction: 'all',
	selectOnFocus: true,
	allowBlank: true,
	editable: false,
	userName: null,
	minListWidth: 200,
	initComponent: function () {

		this.addEvents(
			'ready'
		);

		var tpl = new Ext.XTemplate(
			'<tpl for="."><div class="search-item" style="font-family:Arial;padding:5px 5px 4px 1px;">',
			'<img src="content/images/icons/group.gif" style="float:left;padding-left:5px;"/>',
			'<div style="font-size:10px;color:#444">&nbsp;<b>{Name}</b><br/>&nbsp;{Description}</div>',
			'</div></tpl>'
		);

		var store = new Ext.data.JsonStore({ fields: ["Id", "Name", "Description"] });

		Ext.apply(this, {
			store: store,
			tpl: tpl,
			itemSelector: 'div.search-item'
		});

		Phi.view.comboBox.UserGroup.superclass.initComponent.call(this);

		var user = new Philosophy.model.User();
		user.on('getgroups', this.loadGroups, this);
		user.getGroups(this.userName);
	}
	,
	loadGroups: function (groups) {
		this.store.loadData(groups);
		groups.length > 0 ? this.setValue(groups[0].Id) : null;
		this.fireEvent('ready');
	}
	});// eo Phi.view.comboBox.UserGroup
// eof