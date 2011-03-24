Ext.ns("Phi.view.panel");
/**
* @class Philosophy.view.panel.GPS
* 
* Philosophy GPS (demo) panel (Dashboard)
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
* 
*/
Phi.view.panel.GPS = Ext.extend(Ext.Panel, {
	border: false,
	layout: 'fit',
	collapsible: true,
	plugins: [Ext.ux.plugins.ToggleCollapsible],
	title: Phi.Global.For('GPS'),

	initComponent: function () {
		//init values 
		var to = new Date();
		var from = to.add(Date.HOUR, -2);

		var p = {
			online: { followMobile: true },
			lastPosition: { zoomMobiles: true },
			trace: { from: from, to: to }
		};

		this.GPSMobile = new Phi.view.panel.GPSMobile({ preferences: p });
		this.GPSPreference = new Phi.view.panel.GPSPreference({ preferences: p });

		this.GPSPreference.on('apply', function (preferences) {
			this.GPSMobile.preferences = preferences;
			Phi.Msg(Phi.Global.For('Applied GPS Properties'));
			this.tabPanel.setActiveTab(this.GPSMobile);
		}, this);

		this.tabPanel = new Ext.TabPanel({
			activeTab: 0,
			deferredRender: false,
			width: 600,
			height: 250,
			plain: true,
			defaults: { autoScroll: true },
			items: [this.GPSMobile, this.GPSPreference]
		});

		this.items = [this.tabPanel];

		Phi.view.panel.GPS.superclass.initComponent.call(this);
    }
});  // eo Phi.view.panel.GPS
// eof