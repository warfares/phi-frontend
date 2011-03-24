Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.FormPassword 
* @extends Ext.Window
* 
* Philosophy change password (backend mode), widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.PasswordChange = Ext.extend(Ext.Window, {	
	title:Phi.Global.For('Password'),	
	width:400, 
	height:200,	
	closeAction: 'close',
	maximizable: false,
	modal: true,
	plain: true,
	layout: 'fit',
	userName: null,

	initComponent: function() {
		var _this = this
		this.form = new Ext.FormPanel({
			labelWidth: 150,
			defaults: {width: 180},
			defaultType: 'textfield',
			frame: true,
			bodyStyle: 'padding:5px 15px 0',
			items : [
			{
				xtype:'fieldset',
				id:'fieldset-password',
				title: Phi.Global.For('Password'),
				autoHeight:true,
				autoWidth:true, 	
				labelWidth: 150,
				defaults: {width: 150},
				defaultType: 'textfield',
				items : [
				{
					name: 'userName',
					value: _this.userName,
					xtype: 'hidden'
				}
				,
				{
					name: 'password',
					fieldLabel: Phi.Global.For('Password'),
					inputType: 'password',
					allowBlank: false,
					scope:_this,
					validator: _this.validLengthPassword
				}
				,
				{
					name: 're-password',
					fieldLabel: 'Re-'+ Phi.Global.For('Password'),
					inputType: 'password',
					allowBlank: false,
					scope: _this,
					validator: _this.validPassword
				}
				]
			}
			]
		});

		this.items = [this.form];
		Phi.view.window.PasswordChange.superclass.initComponent.call(this);
		
		this.addButton(Phi.Global.For('Submit'), this.changePassword, this);
		this.addButton(Phi.Global.For('Cancel'), this.close, this);
		
	}
	,
	changePassword: function() {
		var vo = this.form.form.getValues(false);
		var user = new Phi.model.User();

		if (this.form.form.isValid()) {
			user.on('setpassword', this.close, this);
			user.setPassword(vo.userName, vo.password);
		}
		else
			Ext.MessageBox.alert(Phi.Global.For('Warning'), Phi.Global.For('Check form'));
	}
	,
	validLengthPassword: function(){

		var password = this.scope.form.form.findField('password').getValue();

		if (password.length < 4) {
			return Phi.Global.For('At least 4 characters');
		}
		return true;
	}
	,
	validPassword: function(){
		var password = this.scope.form.form.findField('password').getValue();
		var rePassword = this.scope.form.form.findField('re-password').getValue();
		
		if (password != rePassword) {
			return Phi.Global.For('Passwords are not equal');
		}		
		return true;
	}
}); // eo Phi.view.window.FormPassword
// eof