Ext.ns("Phi.view.window");

Phi.view.window.MenuPanel = Ext.extend(Ext.DataView, {
	autoHeight: true,
	frame: true,
	overClass: 'over',
	itemSelector: 'dd',
	tpl: new Ext.XTemplate(
		'<div id="menu-ct">',
		'<tpl for=".">',
		'<tpl>',
		'<div class="collapsed">',
		'<h2><div>{title}</div></h2>',
		'<dl>',
		'<tpl for="app">',
		'<dd ext:action="{action}"><img src="{icon}"/>',
		'<div><h4>{text}</h4><p>{desc}</p></div>',
		'</dd>',
		'</tpl>',
		'<div style="clear:left"></div>',
		'</dl>',
		'</div>',
		'</tpl>',
		'</tpl>',
		'</div>'
	)
	,
	onClick: function (e) {
		var group = e.getTarget('h2', 3, true);
		if (group) {
			group.up('div').toggleClass('collapsed');
		} else {
			var t = e.getTarget('dd', 5, true);
			if (t) {
				var action = t.getAttributeNS('ext', 'action');

				var win;
				switch (action) {
					case "userProfile":
					win = new Phi.view.window.UserDetails();
					win.show(this);
					win.readEntity(Philosophy.Session.getUser());
				break;

				case "userPassword":
					var userName = Philosophy.Session.getUser();
					win = new Phi.view.window.PasswordChange({
						userName: userName
					});
					win.show(this);
				break;

				case "application":
					win = new Phi.view.window.formAppSettings();
					win.show(this);
					var cfg = Philosophy.Util.getAppCfg();
					win.setValues(cfg);
				break;
				
				case "drawCoordinates":
					var win = new Phi.view.window.DrawCoordinate();
					win.show(this);
				break;
				
				case "KMLUploadFile":
					var win = new Phi.view.window.KMLUpload();
					win.show(this);
				break;
				
				case "convertCoordinate":
					var win = new Phi.view.window.ConvertCoordinate();
					win.show(this);
				break;
				}
            }
        }
        return Phi.view.window.MenuPanel.superclass.onClick.apply(this, arguments);
    }
});



/**
* @class Philosophy.view.window.ControlPanel 
* @extends Ext.Window
* 
* Philosophy main control panel widget 
* 
* @author rbarriga
* @version 1.2
* @copyright (c) 2010, by IKOM
* @date      15. July 2010
*/
Phi.view.window.ControlPanel = Ext.extend(Ext.Window, {
	closeAction: 'close', 
	title: Philosophy.Global.For('Control Panel'),
	iconCls: 'icon-control-panel',
	maximizable: false,
	modal: true,    
	width: 680,
	height: 500,
	autoScroll: true, 
	html: '<div style="background:#ffffff; height:100%"></div>',
	
    initComponent: function() {        
		
		var _this = this;
		
		var menuData = [{
			id:1,
			title: Phi.Global.For('Personal'),
			app: [{
				text: Phi.Global.For('Profile Information'),
				action: 'userProfile',
				icon: 'content/images/temp_img.gif',
				desc: Phi.Global.For('Profiledesc')
			}
			,
			{
				text: Phi.Global.For('Password'),
				action: 'userPassword',
				icon: 'content/images/temp_img_b.gif',
				desc: Phi.Global.For('Passworddesc')
			}]
		}
		,
		{
			id:2,
			title: Phi.Global.For('Administration') ,
			app: [{
				text: Phi.Global.For('Application Settings'),
				action: 'application',
				icon: 'content/images/temp_img_b.gif',
				desc: Philosophy.Global.For('AppAdmindesc')
			}]
		}
		,
		{
			id:3,
			title: Phi.Global.For('Upload Manager') ,
			app: [{
				text: Phi.Global.For('Draw Coordinates'),
				action: 'drawCoordinates',
				icon: 'content/images/draw_points.gif',
				desc: Philosophy.Global.For('UploadFiledesc')
			}
			,
			{
				text: Phi.Global.For('KML Upload'),
				action: 'KMLUploadFile',
				icon: 'content/images/kml_img.png',
				desc: Phi.Global.For('KMLFiledesc')
			}
			,        
			{
				text: Phi.Global.For('Convert Coordinates'),
				action: 'convertCoordinate',
				icon: 'content/images/convert_file.png',
				desc: Phi.Global.For('TransformFiledesc')
			}]
		}];

		var store = new Ext.data.JsonStore({
			idProperty: 'id',
			fields: ['id', 'title', 'app'],
			data: menuData
		});

		this.items = new Phi.view.window.MenuPanel({ store: store });
		Phi.view.window.ControlPanel.superclass.initComponent.call(this); 
		this.addButton(Phi.Global.For('Cancel'), this.close, this);         
	}
 }); // eo Phi.view.window.ControlPanel 
// eof