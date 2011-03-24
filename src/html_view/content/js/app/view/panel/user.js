Ext.ns("Phi.view.panel");
/**
* @class Philosophy.view.panel.User
* 
* Philosophy user detail panel (Dashboard)
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
* 
*/
Phi.view.panel.User = Ext.extend(Ext.Panel, {
	border: false,
	layout: 'fit',
	collapsible: true,
	collapsed: true,
	plugins: [Ext.ux.plugins.ToggleCollapsible],
	title: Phi.Global.For('My Profile'),
	bodyStyle: 'padding:25px',

	initComponent: function () {
		Phi.view.panel.User.superclass.initComponent.call(this);
	}
	,
	load: function () {
		var user = new Phi.model.User();
		user.on('read', this.renderUser, this);
		user.read(Phi.Session.getUser());
	}
	,
	renderUser: function (o) {

		var role_collId = Ext.id();
		var role_h2Id = Ext.id();
		var group_collId = Ext.id();
		var group_h2Id = Ext.id();

		var userId = Ext.id();
		
		this.lblUserName = Phi.Global.For('UserName');
		this.lblName = Phi.Global.For('Name');
		this.lblEmail = Phi.Global.For('Email');

		var tpl = new Ext.XTemplate(
			'<div class="main_container">',
				'<table cellpadding="0" cellspacing="0">',
					'<tr><td width="80"><b>' + this.lblUserName + '</b>:</td><td id="' + userId + '" class="main_font_link">{userName}</td></tr>',
					'<tr><td><b>' + this.lblName + '</b>:</td><td class="main_font">{name}&nbsp;{lastName}</td></tr>',
					'<tr><td><b>' + this.lblEmail + '</b>:</td><td class="main_font">{email}</td></tr>',
				'</table>',
			'<br/>',

			//roles
			'<div id="menu_map-ct">',
				'<div id="' + role_collId + '" class="expanded">',
					'<h2 id="' + role_h2Id + '"><div>Roles</div></h2>',
					'<dl>',
					'<div style="padding:4px;">',
						'<tpl for="roles">',
							'<img src="content/images/icons/role.png" style="float:left;padding-left:5px;"/>&nbsp;<b>{name}</b><br/><span class="main_font">&nbsp;{description}</span><br/><br/>',
						'</tpl>',
					'</div>',
					'<div style="clear:left"></div>',
					'</dl>',
				'</div>',
			'</div>',

            '<br/>',

			//groups
			'<div id="menu_map-ct">',
				'<div id="' + group_collId + '" class="expanded">',
					'<h2 id="' + group_h2Id + '"><div>Groups</div></h2>',
					'<dl>',
					'<div style="padding:4px;">',
						'<tpl for="groups">',
							'<img src="content/images/icons/group.gif" style="float:left;padding-left:5px;"/>&nbsp;<b>{name}</b><br/><span class="main_font">&nbsp;{description}</span><br/><br/>',
						'</tpl>',
					'</div>',
					'<div style="clear:left"></div>',
					'</dl>',
				'</div>',
			'</div>',
			'</div>'
		);
		tpl.compile();
		tpl.overwrite(this.body, o);
		this.body.highlight('#f6e8b0', { block: true });

		// collapse behavior 
		var role_h2 = Ext.get(role_h2Id);
		var role_div = Ext.get(role_collId);
		role_h2.on('click', function () {
			role_div.toggleClass('collapsed');
		}, this);

		var group_h2 = Ext.get(group_h2Id);
		var group_div = Ext.get(group_collId);
		group_h2.on('click', function () {
			group_div.toggleClass('collapsed');
		}, this);

		// user detail 
		var td = Ext.get(userId);
		td.on('click', function () {
			this.showFormUser();
		}, this);
    }
	,
	showFormUser: function () {
		var userName = Philosophy.Session.getUser();
		var win = new Phi.view.window.UserDetails();
		win.show(this);
		win.readEntity(userName);
		win.getEl().fadeIn({ duration: 1 });
	}
});// eo Phi.view.panel.User 
// eof
