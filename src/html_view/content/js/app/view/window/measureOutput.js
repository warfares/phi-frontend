Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.MeasureOutPut
* @extends Ext.Window
* 
* Philosophy deprecated measure output, widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/

Phi.view.window.MeasureOutPut = Ext.extend(Ext.Window, {
	title: '',
	maximizable: false,
	closable: false,
	resizable: false,
	draggable: true,
	modal: false,
	width: 200, // 150
	height: 53,
	plain: true,
	bodyStyle: 'padding:2px 2px 2px 2px',
	layout: 'border',

	initComponent: function() {
		var _this = this;

		var p = new Ext.Panel({
			title: '',
			region: 'center',
			layout: 'fit',
			items: '',
			autoScroll: true,
			html: '<div style="font-weight:bold;" id="win_measure_output" />'
		});

		this.items = [p];

		Phi.view.window.MeasureOutPut.superclass.initComponent.call(this);
	}
	,
	show: function() {
		Phi.view.window.MeasureOutPut.superclass.show.call(this);
		this.align();
		this.getEl().fadeIn({ duration: 1 });
	}
	,
	align: function(c) {
		c = c || Ext.get("map");
		this.alignTo(c, 't-t?', [-3, 3]);
	}
});             // eo Phi.view.window.MeasureOutPut
// eof