Ext.ns('Phi.view.window');
/**
* @class Philosophy.view.window.Login 
* @extends Ext.Window
* 
* Philosophy Main Login widget 
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.Login = Ext.extend(Ext.Window, {
	layout: 'border',
	title: Phi.Global.For('Login'),
	maximizable: false,
	closable: false,
	resizable: false,
	modal: true,
	width: 300,
	height: 180,
	x: 100,
	y: 100,
	initComponent: function () {
		this.loginForm = new Ext.FormPanel({
			region: 'center',
			frame: true,
			bodyStyle: 'padding:20px 5px 0 15px',
			width: 350,
			labelWidth: 75,
			defaults: { width: 130 },
			defaultType: 'textfield',
			items: [
			{
				fieldLabel: Phi.Global.For('User'),
				name: 'UserName',
				allowBlank: false
			}
			,
			{
				fieldLabel: Phi.Global.For('Password'),
				name: 'Password',
				inputType: 'password',
				allowBlank: false
			}
			]
		});

		this.loginForm.keys = [{
			key: Ext.EventObject.ENTER,
			scope: this,
			fn: function (key, e) { this.login(); }
			}];

			this.items = this.loginForm;
			Phi.view.window.Login.superclass.initComponent.call(this);
			this.addButton(Phi.Global.For('Login'), this.login, this);
	}
	,
	show: function () {
		Phi.view.window.Login.superclass.show.call(this);
		if (this.modal) {
			Phi.Theme.getMainTitles(this.mask);
			this.mask.setOpacity(1);
			this.mask.appendChild(Philosophy.Theme.getWelcomeImage());
		}
	}
	,
	login: function () {
		if (this.loginForm.form.isValid()) {
			var userData = this.loginForm.form.getValues(false);
			var user = new Phi.model.User();
			user.on('login', this.logged, this);
			user.login(userData.UserName, userData.Password);
		}
	}
	,
	logged: function (status, credentials, user) {
		if (status) {
			Phi.Session.setUser(user);
			Phi.mainToolbar.load();
			Phi.panelUser.load();
			Phi.panelWorkSpace.load();
			Phi.panelLocation.load();
			Phi.panelLayer.load();
			Phi.Map.load();

			Phi.mapQuickToolBar.show();
			Phi.mapQuickToolBar.align();
			if(this.isVisible()) {
				this.getEl().fadeOut({ duration: 1 });
				this.mask.fadeOut({ duration: 1, scope:this, callback: this.close });
			}
		}
		else
			this.fail();
	}
	,
	fail: function () {
		this.loginForm.form.reset();
		this.getEl().shake();
	}
});// eof Phi.view.window.Login 
// eof