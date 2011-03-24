Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.PrintModule
* @extends Ext.Window
* 
* Philosophy GeoExt print module input, widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.PrintModule = Ext.extend(Ext.Window, {
	width: 450,
	autoHeight: true,
	closeAction: 'close',
	maximizable: false,
	modal: true,
	plain: true,

	initComponent: function() {
				
		var _this = this;
		
		this.form = new Ext.FormPanel({
			labelWidth: 75,
			frame: true,
			title: '',
			bodyStyle: 'padding:5px 5px 5px 5px',
			width: 430,
			items: [{
				xtype: 'fieldset',
				title: Phi.Global.For('Document description'),
				autoHeight: true,
				defaults: { anchor: '95%'},
				items: [
					{
						xtype: "textfield",
						name: "mapTitle",
						value: "",
						fieldLabel: "title",
						plugins: new GeoExt.plugins.PrintPageField({
							printPage: _this.printPage
						})
					}
					,
					{
						xtype: "textarea",
						name: "comment",
						value: "",
						fieldLabel: "Comment",
						plugins: new GeoExt.plugins.PrintPageField({
							printPage: _this.printPage
						})
					}
				]
			}
			,
			{
				xtype: 'fieldset',
				title: Philosophy.Globalization.For('Optional Data'),
				collapsible: true,
				collapsed: true,
				autoHeight: true,
				defaults: { anchor: '95%', allowBlank: true },
				items: [
					{
						xtype: "combo",
						store: _this.printProvider.layouts,
						displayField: "name",
						fieldLabel: "Layout",
						typeAhead: true,
						mode: "local",
						triggerAction: "all",
						plugins: new GeoExt.plugins.PrintProviderField({
							printProvider: _this.printProvider
						})
					}, 
					{
						xtype: "combo",
						store: _this.printProvider.dpis,
						displayField: "name",
						fieldLabel: "Resolution",
						tpl: '<tpl for="."><div class="x-combo-list-item">{name} dpi</div></tpl>',
						typeAhead: true,
						mode: "local",
						triggerAction: "all",
						plugins: new GeoExt.plugins.PrintProviderField({
							printProvider: _this.printProvider
						}),
						// the plugin will work even if we modify a combo value
						setValue: function(v) {
							v = parseInt(v) + " dpi";
							Ext.form.ComboBox.prototype.setValue.apply(this, arguments);
						}
					}
					, 
					{
						xtype: "combo",
						store: _this.printProvider.scales,
						displayField: "name",
						fieldLabel: "Scale",
						typeAhead: true,
						mode: "local",
						triggerAction: "all",
						plugins: new GeoExt.plugins.PrintPageField({
							printPage: _this.printPage
						})
					}
					, 
					{
						xtype: "textfield",
						name: "rotation",
						fieldLabel: "Rotation",
						plugins: new GeoExt.plugins.PrintPageField({
							printPage: _this.printPage
						})
					}
				
				]
				}]
		});
			
		this.items = [this.form];
		Phi.view.window.PrintModule.superclass.initComponent.call(this);
		this.addButton(Phi.Global.For('Print'), this.print, this);
		this.addButton(Phi.Global.For('Close'), this.close, this);
	}
	,
	print: function(){
		this.printPage.fit(Phi.Map.map, true);
		this.printProvider.print(Phi.Map.map, this.printPage, true);
		
	}
}); // eo Phi.view.window.Legend
// eof