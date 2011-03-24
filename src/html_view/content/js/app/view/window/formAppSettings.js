Ext.ns('Phi.view.window');
/**
* @class Philosophy.view.window.formAppSettings 
* @extends Ext.Window
* 
* Philosophy app settings, widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.formAppSettings = Ext.extend(Ext.Window, {
	layout: 'border',
	title: Philosophy.Globalization.For('Application settings'),
	maximizable: false,
	closable: true,
	resizable: false,
	modal: true,
	width: 300,
	height: 200,
	x: 100,
	y: 100,    
	initComponent: function() {

		var _this = this;

		var themeCombo = new Ext.ux.ThemeCombo({
			name:'Theme', 
			selectThemeText:Philosophy.Globalization.For('Theme')
		});

		var languageCombo = new Ext.ux.LangSelectCombo({
			name:'Language',
			selectLangText:Philosophy.Globalization.For('Language')
		});

		var settingsForm = new Ext.FormPanel({            
			region: 'center',
			frame: true,
			bodyStyle: 'padding:20px 5px 0 15px',
			width: 350,
			labelWidth: 100,
			defaults: { width: 130 },
			defaultType: 'textfield',
			items: [themeCombo, languageCombo]
		});

		this.items = settingsForm;
		this.settingsForm = settingsForm;

		this.buttons = [                       
		{                        
			text: Philosophy.Globalization.For('Submit'),
			handler: function() {

				//validate
				var cfg = _this.getValues()
				Philosophy.Util.setAppCfg(cfg); 

				Ext.MessageBox.show({
					title: '',
					msg: Philosophy.Globalization.For('Restart app now ?'),

					buttons: Ext.MessageBox.YESNO,
					fn: function(btn, text) {
						if (btn == 'yes') {
							window.location.reload()
						}
					}
				});

				_this.close(); 
			}
		}   
		,                                             
		{
			text: Philosophy.Globalization.For('Cancel'),
			handler: function() {
				_this.cancel();
			}
		}                           
		];

		Phi.view.window.formAppSettings.superclass.initComponent.call(this);
	}
	,
	setValues: function(cfg){
		this.settingsForm.getForm().findField("Theme").setValue(cfg.theme),
		this.settingsForm.getForm().findField("Language").setValue(cfg.language)
	}
	,
	getValues: function(){
		var _this = this;
		var cfg = {
			theme: _this.settingsForm.getForm().findField("Theme").getValue(),
			language: _this.settingsForm.getForm().findField("Language").getValue()
		};
		return cfg;
	}
	,
	cancel : function(){
		this.close();
	}      	    
});  // eo Phi.view.window.formAppSettings 
// eof