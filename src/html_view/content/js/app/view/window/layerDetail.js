Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.LayerDetail
* @extends Ext.Window
* 
* Philosophy layer detail, widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.LayerDetail = Ext.extend(Ext.Window, {
	title: Phi.Global.For('Layer Detail'),
	width: 330,
	height: 195,
	closeAction: 'close',
	maximizable: false,
	modal: false,
	plain: true,
	layout: 'fit',
	layer: null,

	initComponent: function () {

		this.panel = new Ext.Panel({
			title: '',
			margins: '5 5 5 5',
			layout: 'fit',
			items: '',
			autoScroll: true
		});

		this.items = [this.panel];
		Phi.view.window.LayerDetail.superclass.initComponent.call(this);
		this.addButton(Phi.Global.For('Close'), this.close, this);
		this.readLayer();
	}
	,
	readLayer: function () { 
		var layer = new Phi.model.Layer();
		layer.on('read', this.buildHTML, this);
		layer.read(this.layer);
	}
	,
	buildHTML: function (l) {

		var legend = Phi.Config.wmsBigLegend + Phi.Config.wmsNameSpace + ':' + this.layer.split('.')[1];
		//var fixDate = Phi.Util.fixWCFJsonDate(l.Date);
		//var date = Ext.util.Format.date(fixDate, 'd/m/Y');

		var html = [];

		html.push('<div id="layer-detail-container" style="float:left;margin-right:3px;">');
		html.push('<img src="' + legend + '" style="border:1px solid #ccc; padding-left:5px;float:left;" />');
		html.push('</div>');

		html.push('<div style="padding-top:10px;">');
		html.push('<table cellpadding="0" cellspacing="0">');
		html.push('<tr><td width="80"><b>name </b>:</td><td class="main_font">' + l.title + '</td></tr>');
		html.push('<tr><td><b>type</b>:</td><td class="main_font">' + l.type + '</td></tr>');
		html.push('<tr><td><b>SRID</b>:</td><td class="main_font">' + l.srid + '</td></tr>');
		html.push('<tr><td><b>date</b>:</td><td class="main_font">' + l.date + '</td></tr>');
		html.push('</table>');
		html.push('</div>');

		this.panel.body.update(html.join(''));
	}

});// eo Phi.view.window.LayerDetail
// eof