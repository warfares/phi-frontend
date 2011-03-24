Ext.ns("Phi.view.comboBox");
/**
* @class Philosophy.view.comboBox.Group
* 
* combobox with all domain model groups
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
* */
Phi.view.comboBox.Group = Ext.extend(Ext.form.ComboBox, {
	displayField: 'name',
	valueField: 'id',
	mode: 'local',
	forceSelection: false,
	triggerAction: 'all',
	selectOnFocus: true,
	allowBlank: true,
	editable: false,
	includeAll: false,
	initComponent: function () {

		this.addEvents(
			'ready'
		);

		var tpl = new Ext.XTemplate(
			'<tpl for="."><div class="search-item" style="font-family:Arial;padding:5px 5px 4px 1px;">',
			'<img src="content/images/icons/group.gif" style="float:left;padding-left:5px;"/>',
			'<div style="font-size:10px;color:#444">&nbsp;<b>{name}</b><br/>&nbsp;{description}</div>',
			'</div></tpl>'
		);

		var store = new Ext.data.JsonStore({ fields: ["id", "name", "description"] });

		Ext.apply(this, {
			store: store,
			tpl:tpl,
			itemSelector: 'div.search-item'
		});

		Phi.view.comboBox.Group.superclass.initComponent.call(this);

		var group = new Phi.model.Group();
		group.on('getgroups', this.loadGroups, this);
		group.getGroups();

	}
	,
	loadGroups: function (o){
		var groups = o.entities;
		if(this.includeAll)
		groups.unshift({id:0, name:'All', description:'All Groups'}); 

		this.store.loadData(groups);

		this.includeAll ?  this.setValue(0) : null;
		this.fireEvent('ready'); 
	}
	}); // eo Phi.view.comboBox.Group
// eof