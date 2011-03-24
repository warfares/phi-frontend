Ext.ns("Phi.view.comboBox");
/**
* @class Philosophy.view.comboBox.Role
* 
* combobox with all domain model roles
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
* */
Phi.view.comboBox.Role = Ext.extend(Ext.form.ComboBox, {
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
			'<img src="content/images/icons/role.png" style="float:left;padding-left:5px;"/>',
			'<div style="font-size:10px;color:#444">&nbsp;<b>{name}</b><br/>&nbsp;{description}</div>',
			'</div></tpl>'
		);

		var store = new Ext.data.JsonStore({ fields: ["id", "name", "description"] });

		Ext.apply(this, {
			store: store,
			tpl:tpl,
			itemSelector: 'div.search-item'
		});

		Phi.view.comboBox.Role.superclass.initComponent.call(this);

		var role = new Phi.model.Role();
		role.on('getroles', this.loadRoles, this);
		role.getRoles();

	}
	,
	loadRoles: function (o){
		var roles = o.entities;
		
		if(this.includeAll)
		roles.unshift({id:0, name:'All', description:'All Roles'}); 

		this.store.loadData(roles);

		this.includeAll ?  this.setValue(0) : null;
		this.fireEvent('ready'); 
	}
	}); // eo Phi.view.comboBox.Role
	// eof