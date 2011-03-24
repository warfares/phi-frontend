Ext.ns("Phi.view.panel");
/**
* @class Philosophy.view.panel.GPSPreference
* Philosophy GPS Preferences ..!!
*
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
* */
Phi.view.panel.GPSPreference = Ext.extend(Ext.Panel, {
	title: 'Preferences',
	layout: 'fit',
	forceLayout: true,
	initComponent: function() {

		this.online = {
			followMobile : new Ext.form.Checkbox({ fieldLabel: 'Follow mobile', enableKeyEvents:true })
		};

		this.lastPosition = {
			zoomMobiles : new Ext.form.Checkbox({ fieldLabel: 'Zoom to mobiles', enableKeyEvents:true })
		};

		this.trace = {
			from: new Ext.ux.form.DateTime({
				name: 'from-datetime',
		        fieldLabel:'From',
				dateFormat: 'd/m/Y',
				timeFormat:'H:i',
				timeWidth: 60,
                dateConfig: {
					allowBlank:false,
					width: 50
				},
				timeConfig: {
					allowBlank:false                                 
				}
			}),
			to: new Ext.ux.form.DateTime({
				name: 'to-datetime',
		        fieldLabel:'To',
				dateFormat: 'd/m/Y',
				timeFormat:'H:i',
				timeWidth:60,
				dateConfig: {
					allowBlank:false,
					width: 50
				},
				timeConfig: {
					allowBlank:false                                 
				}
			})
		};

		this.fp = new Ext.FormPanel({
			labelWidth: 90,
			frame: true,
			title: '',
			bodyStyle: 'padding:5px 5px 5px 5px',
			width: 340,
			items: [
			{
				xtype: 'fieldset',
				title: 'Online Mode',
				autoHeight: true,
				defaults: { anchor: '95%', allowBlank: false },
				items: [this.online.followMobile]
			}
			,
			{
				xtype: 'fieldset',
				title: 'Last Position Mode',
				autoHeight: true,
				defaults: { anchor: '95%', allowBlank: true },
				items: [this.lastPosition.zoomMobiles]
			}
			,
			{
				xtype: 'fieldset',
				title: 'Trace Mode',
				autoHeight: true,
				defaults: {  anchor: '95%', allowBlank: true },
				items: [this.trace.from, this.trace.to]
			}
			]
		});

		this.fp.addButton('Apply', this.apply, this);
		this.addEvents('apply');
		this.items = [this.fp];

		this.setPreferences(this.preferences);

		Phi.view.panel.GPSPreference.superclass.initComponent.apply(this);
	}
	,
	apply: function(){
		var p = {
		    online: { followMobile: this.online.followMobile.getValue() },
			lastPosition : {zoomMobiles:this.lastPosition.zoomMobiles.getValue()},
			trace : {from:this.trace.from.getValue(), to: this.trace.to.getValue()}
		};

		this.fireEvent('apply',p);
	}
	,
	setPreferences: function(p) {
		this.online.followMobile.setValue(p.online.followMobile);
		this.lastPosition.zoomMobiles.setValue(p.lastPosition.zoomMobiles); 
		this.trace.from.setValue(p.trace.from); 
		this.trace.to.setValue(p.trace.to);
	}
});