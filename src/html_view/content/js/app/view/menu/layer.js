Ext.ns("Phi.view.menu");
/**
* @class Philosophy.view.menu.Layer
* 
* Philosophy Layer actions menu (this could be used for example in context menu)
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.menu.Layer = Ext.extend(Ext.menu.Menu, {
	layerName: null,
	layerTitle: null,
	enableCheckLayer: false,
	enableRemoveLayer: false,
	node: null,	// tree case
	rowIndex: null,	// grid case
	initComponent: function () {
		this.addEvents('checkLayer');
		this.addEvents('removeLayer');

		Phi.view.menu.Layer.superclass.initComponent.call(this);

		this.add({ iconCls: 'icon-search-list', text: Phi.Global.For('Layer Details'), handler: this.showDetails });
		this.add({ iconCls: 'icon-map', text: Phi.Global.For('Preview'), handler: this.preview });
		this.add({ iconCls: 'icon-database', text: Phi.Global.For('Query'), handler: this.showQuery });
		this.add({ iconCls: 'icon-zoom', text: Phi.Global.For('Zoom'), handler: this.zoomToExtent });

		if (this.enableCheckLayer)
		this.add({ iconCls: 'icon-tick', text: Phi.Global.For('Check only this'), handler: this.checkLayer });

		this.add({ iconCls: 'icon-link', text: Phi.Global.For('Links'), handler: this.showLinks });

		if (this.enableRemoveLayer)
		this.add({ iconCls: 'icon-delete', text: Phi.Global.For('Remove'), handler: this.removeLayer });

		this.add({ iconCls: 'icon-metadata', text: Phi.Global.For('Metadata'), handler: this.showHtmlMetadata });
		this.add({ iconCls: 'icon-print', text: Phi.Global.For('Export'), menu: this.exportMenu()});
		
	}
	,
	preview: function(){
		var layerName = this.parentMenu.layerName;
		
		var l = layerName.split('.');
		
		var wmsLayer = new OpenLayers.Layer.WMS(
			"wms-layer",
			Phi.Config.wmsProxyCache,
			{
				layers: Phi.Config.wmsNameSpace + ':' + l[1],
				styles: '',
				srs: 'EPSG:900913',
				format: 'image/png',
				tiled: 'true',
				transparent: true
			},
			{
				'opacity': 1, 'isBaseLayer': false, 'wrapDateLine': true
			}
		);
		
		var options = {
				units: 'm',
				numZoomLevels: 19,
				maxExtent: new OpenLayers.Bounds(-2.003750834E7, -2.003750834E7, 2.003750834E7, 2.003750834E7),
				maxResolution: 156543.03390625,
				projection: new OpenLayers.Projection('EPSG:900913'),
				displayProjection: new OpenLayers.Projection('EPSG:4326'),
				controls: []
		};
		
		var layer = new Geo.core.Layer();
		layer.on('staticbbox', function(bbox){
			var bound = new OpenLayers.Bounds(bbox.xmin, bbox.ymin, bbox.xmax, bbox.ymax);
			var win = new Ext.Window({
		            title: "Preview: " + l[1],
		            width: 512,
		            height: 256,
		            layout: "fit",
		            items: [{
						xtype: "gx_mappanel",
						map:options,
		                layers: [new OpenLayers.Layer.OSM(), wmsLayer],
		                extent: bound
		            }]
			});
			win.show();
			
		}, this);
		layer.getStaticBBox(layerName);
	}
	,
	zoomToExtent: function () {
		var layerName = this.parentMenu.layerName;
		
		var layer = new Geo.core.Layer();
		layer.on('staticbbox', function(bbox){
			var bound = new OpenLayers.Bounds(bbox.xmin, bbox.ymin, bbox.xmax, bbox.ymax);
			Phi.Map.zoomToExtent(bound, true);
		}, this);
		layer.getStaticBBox(layerName);
	}
	,
	showDetails: function () {
		var layerName = this.parentMenu.layerName;
		var win = new Phi.view.window.LayerDetail({ layer: layerName });
		win.show();
	}
    ,
	showQuery: function () {
		var layerName = this.parentMenu.layerName;
		var layerTitle = this.parentMenu.layerTitle;
		
		var l = new Geo.core.Layer();
		l.on('metadata', function(result){
			var fields = [];
			Ext.each(result.entities, function(m) {
				fields.push({id:m.name,text:m.name, type:Phi.Util.mapPGTypes(m.type), pgtype:m.type});
			}, this);

			var win = new Phi.view.window.QueryBuilder({
				layerName:layerName,
				layerTitle:layerName,
				fields:fields
			});
			win.show();
		}, this);

		l.getMetadata(layerName);
	}
	,
	checkLayer: function () {
		var layerName = this.parentMenu.layerName;
		var node = this.parentMenu.node;
		var rowIndex = this.parentMenu.rowIndex;

		this.parentMenu.fireEvent('checkLayer', layerName, node, rowIndex);
	}
	,
	removeLayer: function () {
		var layerName = this.parentMenu.layerName;
		var node = this.parentMenu.node;
		var rowIndex = this.parentMenu.rowIndex;

		this.parentMenu.fireEvent('removeLayer', layerName, node, rowIndex);
	}
	,
	showLinks: function () {
		var win = new Phi.view.window.Link({ layerName: this.parentMenu.layerName });
		win.show();
	}
	,
	exportMenu: function () {
		var menu = new Ext.menu.Menu();
		var formats = [['SHAPE-ZIP', 'SHAPE'],
			['GML2', 'GML2'],
			['GML3', 'GML3'],
			['OGR-KML', 'KML'],
			['JSON', 'JSON'],
			['CSV', 'CSV'],
			['OGR-MIF', 'MIF'],
			['OGR-TAB', 'TAB']
		];
		
		Ext.each(formats, function(f){
			menu.add({
				text:f[1],
				format:f[0],
				handler:function(t){
					var layerName = this.parentMenu.parentMenu.layerName;
					var format = t.format;
					var layer = Phi.Config.wmsNameSpace + ':' + layerName.split('.')[1]; // NOTE fix this 

					var query = {
						request: 'getfeature',
						service: 'wfs',
						version: '1.1.0',
						typename: layer,
						outputFormat: format
					}
					var wfsUrl = Phi.Config.wfsUrl + Ext.urlEncode(query);
					alert(wfsUrl);
				}
			});
		}, this);
		return menu;
    }
	,
	showHtmlMetadata: function() {
		var layerName = this.parentMenu.layerName;
		var node = this.parentMenu.node;
		var rowIndex = this.parentMenu.rowIndex;
		var load = window.open('./content/layer_metadata/' + layerName + '.htm', '_blank', 'scrollbars=yes,menubar=no,height=600,width=800,resizable=yes,toolbar=no,location=no,status=no');
	}
});// eo Phi.view.menu.Layer
// eof