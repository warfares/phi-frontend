Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.colorPicker 
* @extends Ext.Window
* 
* Philosophy vector layer color picker widget 
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.colorPicker = Ext.extend(Ext.Window, {
	title: 'Color',
	width: 370,
	height: 300,
	closeAction: 'close',
	maximizable: false,
	modal: true,
	plain: true,
	layout: 'border',

	initComponent: function() {

		this.colorPicker = new Ext.ux.ColorPicker({
			region: 'center',
			title: 'ColorPanel',
			collapsible: false
		});

		this.items = this.colorPicker;
		Phi.view.window.colorPicker.superclass.initComponent.call(this);
		
		this.addButton(Phi.Globalization.For('Cancel'), this.close, this);
		this.addButton(Phi.Globalization.For('Submit'), this.setColor, this);
		
    }
	,
	setColor:function(){
			var hColor = '#' + this.colorPicker.getHex();
			var style ={ 
				strokeColor: hColor,
				fillColor:hColor,
				fillOpacity: 0.5,
				strokeOpacity: 1,
				strokeWidth: 1,
				pointRadius: 4
			};                                
			Phi.Map.setVectorColor(style);
			this.close();
	}
});// eo Phi.view.window.colorPicker 
// eof