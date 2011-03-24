Ext.ns("Phi.view.slider");
/**
* @class Philosophy.view.slider.BaseLayer
* 
* Philososphy OpenLayer current selected based layer alpha widget 
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.slider.BaseLayer = Ext.extend(Ext.slider.SingleSlider, {
	title: Philosophy.Globalization.For('Alpha'),
	width: 70,
	value: 100,
	increment: 1,
	minValue: 0,
	maxValue: 100,
	initComponent: function () {

		var tip = new Ext.slider.Tip({
			getText: function (thumb) {
				return String.format('<b>{0}% ' + Phi.Global.For('visible') + '</b>', thumb.getValue());
			}
		});

		this.plugins = tip;
		
		this.on('change', function (slider, v) {
			var opacity = v !== 0 ? opacity = v / 100 : 0;
			Phi.Map.baseLayer.setOpacity(opacity);
			Phi.Map.setRasterLayersOpacity(opacity);
		});
		Phi.view.slider.BaseLayer.superclass.initComponent.call(this);

		this.setValue(100);
	}
	,
	onRender: function () {
		Phi.view.slider.BaseLayer.superclass.onRender.apply(this, arguments);

		var t = new Ext.ToolTip({
			target: this.el,
			title: Phi.Global.For('Transparency'),
			width: 200,
			html: Phi.Global.For('Hide selected base layer together with the flights, allowing you to see only the geometries'),
			trackMouse: true
		});
	}
});// eo Phi.view.slider.BaseLayer
// eof