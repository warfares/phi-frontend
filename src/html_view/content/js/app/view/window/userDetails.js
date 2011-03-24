Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.FormUser
* @extends Ext.Window
* 
* Phi user detail, widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.UserDetails = Ext.extend(Ext.Window, {
	title: Phi.Global.For('User Detail'),
	x:100,
	y:100,
	width: 500,
	height: 250,
	closeAction: 'close',
	maximizable: false,
	modal: true,
	plain: true,
	layout: 'border',
	readOnly: false,
	initComponent: function () {

		this.addEvents('updated');

		var _this = this;
		
		this.form = new Ext.FormPanel({
			title: '',
			region: 'center',
			margins: '5 5 5 5',
			layout: 'fit',
			labelWidth: 150,
			defaults: { width: 150 },
			defaultType: 'textfield',
			frame: true,
			bodyStyle: 'padding:5px 15px 0',
			items: [{
					xtype: 'fieldset',
					title: Phi.Global.For('Description'),
					autoHeight: true,
					autoWidth: true,
					labelWidth: 150,
					defaults: { width: 220 },
					defaultType: 'textfield',
					items: [
						{
							name: 'userName',
							fieldLabel: Phi.Global.For('UserName'),
							allowBlank: false,
							emptyText: Phi.Global.For('Field Required'),
							readOnly: true
						}
						,
						{
							name: 'name',
							fieldLabel: Phi.Global.For('Name'),
							allowBlank: false,
							emptyText: Phi.Global.For('Field Required'),
							readOnly: _this.readOnly
						}
						,
						{
							name: 'lastName',
							fieldLabel: Phi.Global.For('LastName'),
							allowBlank: false,
							emptyText: Phi.Global.For('Field Required'),
							readOnly: _this.readOnly
						}
						,
						{
							name: 'email',
							fieldLabel: Phi.Global.For('Email'),
							vtype: 'email',
							allowBlank: false,
							emptyText: Phi.Global.For('Field Required'),
							readOnly: _this.readOnly
						}
					]
				}
			]
		});

		this.items = [this.form];
		Phi.view.window.UserDetails.superclass.initComponent.call(this);

		this.addButton(Phi.Global.For('Close'), this.close, this);
		if(!this.readOnly)
			this.addButton(Phi.Global.For('Update'), this.createEntity, this);
	}
	,
	readEntity: function (userName) {
		var user = new Phi.model.User();
		user.on('read', function (o) {
			this.form.form.setValues(o);
		}, this);
		user.read(userName);
	}
	,
	createEntity: function () {
		var vo = this.form.form.getValues(false);
		vo.enabled = true;
		var user = new Phi.model.User();

		if (this.form.form.isValid()) {
			user.on('update', this.success, this);
			user.update(vo);
		}
		else
			Ext.MessageBox.alert(Phi.Global.For('Warning'), Phi.Global.For('Check form'));
	}
	,
	success: function () {
		this.fireEvent('updated');
		Phi.panelUser.load();
		this.close();
	}
}); // eo Phi.view.window.FormUser
// eof