Ext.ns("Philosophy");
/**
* @class Philosophy.Map 
*
* Main Philosophy map (Openlayer) wrapper
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
* @singleton
*
*/
Philosophy.Map = {
	/**
	* Property: map
	* {<OpenLayers.Map>} Main map object
	*/
	map: null,
	/**
	* Property: baseLayer
	* {<OpenLayers.Layer>} Current selected base layer
	*/
	baseLayer: null,
	/**
	* Property: wmsLayer
	* {<OpenLayers.Layer.WMS>} WMS (Web Map Service) Layer
	*/
	wmsLayer: null,
	/**
	* Property: vectorLayer
	* {<OpenLayers.Layer.Vector>} Vector layer
	*/
	vectorLayer: null,
	/**
	* Property: markerLayer
	* {<OpenLayers.Layer.Marker>} Marker layer
	*/
	markerLayer: null,
	/**
	* Property: rasterLayers
	* Array(<OpenLayers.Layer.TMS>) array with raster (OL TMS) layer
	*/
	rasterLayers: [],
	/**
	* Property: measureControls
	* {Dictionary(<OpenLayer.Control>)} Dictionary of OpenLayers Measure Controls
	*/
	measureControls: null,
	/**
	* Property: vectorControls
	* {Dictionary(<OpenLayer.Control>)} Dictionary of OpenLayers Vector Controls
	*/
	vectorControls: null,
	/**
	* Property: customControls
	* {Dictionary(<OpenLayer.Control>)} Dictionary of OpenLayers Custom Controls
	* see : openlayer-control folder..
	*/
	customControls: null,
	/**
	* Property: mousePosition
	* {<OpenLayers.Control.MousePosition>} Mouse Postion Control
	*/
	mousePosition: null,
	/**
	* Property: graticule
	* {<OpenLayers.Control.Graticule>} Graticule Control
	*/
	graticule: null,
	/**
	* Property: navigation history control
	* {<OpenLayers.Control.NavigationHistory>} Mouse Postion Control
	*/
	navHistory: null,
	/**
	* Method: Init
	* initializes the map, layers and controls of openlayers
	*
	*/
	Init: function () {

		var _this = this;

		//avoid pink tiles 
		OpenLayers.Util.MISSING_TILE_URL = 'content/images/none.png';
		OpenLayers.Util.onImageLoadError = function () {
			this.src = OpenLayers.Util.MISSING_TILE_URL;
		};

		OpenLayers.IMAGE_RELOAD_ATTEMPTS = 3;
		OpenLayers.Util.onImageLoadErrorColor = 'transparent';
		//eo avoid pink tiles         

		var options = {
			units: 'm',
			numZoomLevels: 19,
			maxExtent: new OpenLayers.Bounds(-2.003750834E7, -2.003750834E7, 2.003750834E7, 2.003750834E7),
			maxResolution: 156543.03390625,
			projection: new OpenLayers.Projection('EPSG:900913'),
			displayProjection: new OpenLayers.Projection('EPSG:4326'),
			controls: [],
			eventListeners: {
				'changebaselayer': _this.onChangeBaseLayer,
				'zoomend': _this.onChangeZoom,
				'mousemove': _this.onMouseMove
			}
		};

		this.map = new OpenLayers.Map('map', options);

		Philosophy.Layer.appliedLayers = Philosophy.Config.initWMSLayer;
		var wmsLayer = new OpenLayers.Layer.WMS(
			"wms-layer",
			Phi.Config.wmsProxyCache,
			{
				layers: Phi.Layer.getWMSLayers(Phi.Config.wmsNameSpace),
				styles: '',
				srs: 'EPSG:900913',
				format: 'image/png',
				tiled: 'true',
				mode: '24bit',
				alpha : 'true',
				transparent: 'true'
			},
			{
				'opacity': 1, 'isBaseLayer': false, 'wrapDateLine': true
			}
		);
		//updating the init layer
		Philosophy.panelLayer.panelResume.update();

		var styleDefault = Philosophy.Theme.defaultStyleVector;
		var styleSelected = Philosophy.Theme.selectStyleVector;

		var style = { 'default': styleDefault, select: styleSelected };
		var styleMap = new OpenLayers.StyleMap(style);

		var vectorLayer = new OpenLayers.Layer.Vector('vector-layer', { styleMap: styleMap });
		var markerLayer = new OpenLayers.Layer.Markers('marker-layer');

		//baselayers 
		this.baseLayer = wmsLayer;
		this.initBaseLayers();

        //overlays
		this.map.addLayer(wmsLayer);
		this.map.addLayer(vectorLayer);
		this.map.addLayer(markerLayer);

		//layers reference 
		this.wmsLayer = wmsLayer;
		this.vectorLayer = vectorLayer;
		this.markerLayer = markerLayer;

		//Global control        
		this.mousePosition = new OpenLayers.Control.MousePosition();
		this.graticule = new OpenLayers.Control.Graticule({ visible: false, labelled: true, targetSize: 200 });
		this.navHistory = new OpenLayers.Control.NavigationHistory();

		// navHistory events...(to handle my custom buttons)
		this.navHistory.onPreviousChange = this.onPreviousChange;
		this.navHistory.onNextChange = this.onNextChange;

		var gp = new OpenLayers.Control.GooglePanZoomBar();

		this.map.onCustomAction = this.onCustomAction; // (TODO: this not a map event.. )

		//common controls
		this.map.addControl(new OpenLayers.Control.Navigation());
		this.map.addControl(gp);
		this.map.addControl(new OpenLayers.Control.Scale());
		this.map.addControl(this.graticule);
		this.map.addControl(this.mousePosition);
		this.map.addControl(this.navHistory);

		//custom controls
		this.addMeasureControls();
		this.addVectorControls();
		this.addCustomControls();

		//init values
		this.map.setBaseLayer(this.baseLayer);
		this.zoomInit();

		// values after init
		this.setDisplayProjection("EPSG:32719");

		//minor effects over the google zoom pan bar !!
		if (!Ext.isIE) {
			var e = Ext.get(gp.div);
			e.setOpacity(0.8, true);
			e.on('mouseenter', function () { this.setOpacity(1, true); });
			e.on('mouseleave', function () { this.setOpacity(0.8, true); });
		}
	}
	,
	initRaster: function (rasters) {

		function overlay_getTileURL(bounds) {
			var res = this.map.getResolution();
			var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
			var y = Math.round((bounds.bottom - this.tileOrigin.lat) / (res * this.tileSize.h));
			var z = this.map.getZoom();

			var opt = this.getOptions();
			if (opt.rasterBound.intersectsBounds(bounds) && z >= opt.mapMinZoom && z <= opt.mapMaxZoom)
				return this.url + z + '/' + x + '/' + y + '.' + this.type;
			else
				return OpenLayers.Util.MISSING_TILE_URL;
		};

		var rasterLayer = function (name, url, minZ, maxZ, visibility, bound, o) {
			mapMinZoom = minZ || 11;
			mapMaxZoom = maxZ || 18;
			return new OpenLayers.Layer.TMS(name, url, {
				type: 'png',
				getURL: overlay_getTileURL,
				alpha: true,
				mapMinZoom: minZ,
				mapMaxZoom: maxZ,
				isBaseLayer: false,
				visibility: visibility,
				rasterBound: bound,
				rasterObject: o,
				internalId: 'internal_raster'
			});
		};

		Ext.each(rasters, function (r, i) {
			var bound = new OpenLayers.Bounds(r.min.x, r.min.y, r.max.x, r.max.y);
			var l = rasterLayer('raster-layer-' + i, r.url, r.minz, r.maxz, r.visible, bound, r);
			this.map.addLayer(l);
			this.rasterLayers.push(l);
		}, this);
		
		var n = this.map.getNumLayers();
		this.map.raiseLayer(this.wmsLayer, n );
		this.map.raiseLayer(this.vectorLayer, n + 1);
		this.map.raiseLayer(this.markerLayer, n + 2);
		
	}
	,
	load: function () {
		this.loadRaster();
	}
	,
	unload: function () {
		this.unloadRaster();
	}
	,
	loadRaster: function () {
		var userName = Phi.Session.getUser();
		var r = new Phi.model.User();
		r.on('getrasters', function (rasters) {
			this.initRaster(rasters);
			Phi.panelLayer.treeRaster.addRaster();
			Phi.mainToolbar.markerMenu.menu.loadRaster();
		}, this);

		r.getRasters(userName);
	}
	,
	unloadRaster: function () {
		var rasters = Phi.Map.map.getLayersBy('internalId', 'internal_raster');
		Ext.each(rasters, function (r, i) {
			Phi.Map.map.removeLayer(r);
		});
	}
	,
	initBaseLayers: function () {
		if (this.googleEnabled)
			this.initGoogleMaps();

		if (this.microsoftEnabled)
			this.initVE();

		if (this.omsEnabled)
			this.initOMS();
			
		if (this.umapEnabled)
			this.initUMAP();
	}
	,
	initGoogleMaps: function () {
		var googleLayer = function (type, name, level) {
			return new OpenLayers.Layer.Google(name, { 
				type: type, 
				sphericalMercator: true, 
				internalId: 'google', 
				icon: 'icon-google', 
				numZoomLevels: level 
			});
		};

		this.map.addLayer(googleLayer(G_NORMAL_MAP, 'Google Normal', 19));
		this.map.addLayer(googleLayer(G_SATELLITE_MAP, 'Google Satellite', 19));
		this.map.addLayer(googleLayer(G_HYBRID_MAP, 'Google Hybrid', 19));
		this.map.addLayer(googleLayer(G_PHYSICAL_MAP, 'Google Physical', 16));
	}
	,
	initVirtualEarth: function () {
		var velayer = OpenLayers.Layer.VirtualEarth;
		var veroad = new velayer("Bing Roads", { type: VEMapStyle.Road, sphericalMercator: true, internalId: 've', icon: 'icon-bing' });
		var veaer = new velayer("Bing Aerial", { type: VEMapStyle.Aerial, sphericalMercator: true, internalId: 've', icon: 'icon-bing' });
		var vehyb = new velayer("Bing Hybrid", { type: VEMapStyle.Hybrid, sphericalMercator: true, internalId: 've', icon: 'icon-bing' });

		this.map.addLayer(veroad);
		this.map.addLayer(veaer);
		this.map.addLayer(vehyb);
	}
	,
	initUMAP: function () {
		var l = ['base', 'parks', 'water', 'roads', 'labels'];
		var umap = new OpenLayers.Layer.UMapGTile("UltraMap Normal", 
			['http://beta.ultramap.cl'], 
			{ internalId: 'ultramap', icon: 'icon-umap', layers: l }
		);
		this.map.addLayer(umap);
	}
	,
	initOMS: function () {
		var osmMapnik = new OpenLayers.Layer.OSM("OSM Mapnik")
		osmMapnik.icon = 'icon-osm'
		// var osmArender = new OpenLayers.Layer.OSM.Osmarender("OSM arender ", { numZoomLevels: 18, icon: 'icon-osm' });

		this.map.addLayer(osmMapnik);
		//this.map.addLayer(osmArender);
	}
	,
	// control Events 
	onCustomAction: function () {
		Phi.Map.deactivateAllControls();
		Phi.mapQuickToolBar.bp.pan.toggle(true);
	}
	,
	onPreviousChange: function (state) {
		if (state) {
			Philosophy.mapQuickToolBar.bp.undo.enable();
		} else if (!state) {
			Philosophy.mapQuickToolBar.bp.undo.disable();
		}
	}
	,
	onNextChange: function (state) {
		if (state) {
			Philosophy.mapQuickToolBar.bp.redo.enable(); ;
		} else if (!state) {
			Philosophy.mapQuickToolBar.bp.redo.disable(); ;
		}
	}
	,
	// map Events    
	onMouseMove: function (evt) {

	}
	,
	onChangeBaseLayer: function (layer) {
		Philosophy.Map.baseLayer = layer.layer;
	}
	,
	onChangeZoom: function () {
		//var zoom = this.getZoom();
	}
	,
	/********************************************************/
	/*                                                      */
	/*                  Methods                        		*/
	/*                                                      */
	/*                                                      */
	/********************************************************/
	zoomInit: function () {
		this.setCenter(Philosophy.Theme.initCenter);
	}
	,
	getInstance: function () {
		return this.map;
	}
	,
	redrawMainLayer: function (layers) {
		this.mainLayer.mergeNewParams({ layers: layers });
		this.mainLayer.redraw();
	}
	,
	redrawMainLayer: function (layers) {
		this.wmsLayer.mergeNewParams({ layers: layers });
	}
	,
	getZoom: function () {
		return this.map.getZoom();
	}
	,
	setZoom: function (zoom) {
		this.map.zoomTo(zoom);
	}
	,
	zoomIn: function (zoom) {
		this.map.zoomIn();
	}
	,
	zoomOut: function (zoom) {
		this.map.zoomOut();
	}
	,
	zoomToExtent: function (bound) {
		this.map.zoomToExtent(bound)
	}
	,
	setCenter: function (center) {
		var lonLat = new OpenLayers.LonLat(center.lon, center.lat);
		this.map.setCenter(lonLat, center.zoom);
	}
	,
	deactivateAllControls: function () {
		this.deactivateMeasureControl();
		this.deactivateVectorControl();
		this.deactivateCustomControl();
	}
	,
	setVectorColor: function (s) {

		var styleSelected = Philosophy.Theme.selectStyleVector;
		var style = { 'default': s, select: styleSelected };
		var styleMap = new OpenLayers.StyleMap(style);

		this.vectorLayer.styleMap = styleMap;
		this.vectorLayer.redraw();
	}
	,
	addVectorControls: function () {

		var del = function (feature) {
			feature.destroy();
		};

		var controls = {
			point: new OpenLayers.Control.DrawFeature(this.vectorLayer, OpenLayers.Handler.Point),
			line: new OpenLayers.Control.DrawFeature(this.vectorLayer, OpenLayers.Handler.Path),
			polygon: new OpenLayers.Control.DrawFeature(this.vectorLayer, OpenLayers.Handler.Polygon),
			regular: new OpenLayers.Control.DrawFeature(this.vectorLayer, OpenLayers.Handler.RegularPolygon, { handlerOptions: { sides: 5} }),
			modify: new OpenLayers.Control.ModifyFeature(this.vectorLayer),
			drag: new OpenLayers.Control.DragFeature(this.vectorLayer, OpenLayers.Handler.Drag),
			del: new OpenLayers.Control.SelectFeature(this.vectorLayer, { onSelect: del, box: true })
		};

		for (var key in controls) {
			this.map.addControl(controls[key]);
		}

		this.vectorControls = controls;
	}
	,
	activateVectorControl: function (type) {
		var control = this.vectorControls[type];
		control.activate();
	}
	,
	deactivateVectorControl: function () {
		var controls = this.vectorControls;
		for (var key in controls) {
			controls[key].deactivate();
		}
	}
	,
	addMeasureControls: function () {
		var _this = this;

		sketchSymbolizers = {
			'Point': {
				pointRadius: 4,
				graphicName: 'square',
				fillColor: 'white',
				fillOpacity: 1,
				strokeWidth: 1,
				strokeOpacity: 1,
				strokeColor: '#333333'
			},
			'Line': {
				strokeWidth: 3,
				strokeOpacity: 1,
				strokeColor: '#666666',
				strokeDashstyle: 'dash'
			},
			'Polygon': {
				strokeWidth: 2,
				strokeOpacity: 1,
				strokeColor: '#666666',
				fillColor: 'white',
				fillOpacity: 0.3
			}
		};

		var style = new OpenLayers.Style();
		style.addRules([new OpenLayers.Rule({ symbolizer: sketchSymbolizers })]);
		var styleMap = new OpenLayers.StyleMap({ 'default': style });

		var options = {
			handlerOptions: {
				style: 'default', // this forces default render intent
				layerOptions: { styleMap: styleMap },
				persist: true
			}
		};

		var controls = {
			line: new OpenLayers.Control.Measure(OpenLayers.Handler.Path, options),
			polygon: new OpenLayers.Control.Measure(OpenLayers.Handler.Polygon, options)
		};

		var control;

		for (var key in controls) {
			control = controls[key];
			control.events.on({
				'measure': _this.handleMeasurements,
				'measurepartial': _this.handleMeasurements
			});
			this.map.addControl(control);
		}

		this.measureControls = controls;
	}
	,
	activateMeasureControl: function (type) {
		var control = this.measureControls[type];
		control.activate();
	}
	,
	deactivateMeasureControl: function () {
		var controls = this.measureControls;
		for (var key in controls) {
			controls[key].deactivate();
		}
	}
	,
	handleMeasurements: function (event) {
		var units = event.units;
		var order = event.order;
		var measure = event.measure;
		val = Philosophy.val;
		Philosophy.Map.convert(measure, units, order, val);
		if (val != null) { units = val; }
		Philosophy.Map.renderMeasureVal(Philosophy.Measure, Philosophy.Units, Philosophy.Order);
	}
	,
	convert: function (measure, units, order, val) {
		var dicSquares = {
			'kmkm': '1',
			'kmm': '1000000',
			'kmha': '100',
			'mm': '1',
			'mkm': '0.000001',
			'mha': '0.0001',
			'hakm': '0.01',
			'ham': '10000',
			'haha': '1'
		};
		var dicLinear = {
			'kmkm': '1',
			'kmm': '1000',
			'mm': '1',
			'mkm': '0.001'
		};
		if (val == null) {
			Philosophy.Map.setMeasureGlobals(measure, units, order);
			//return measure;
		} else {

			if (order == 1) {
				factor = parseFloat(dicLinear[units + val]);
			} else {
				factor = parseFloat(dicSquares[units + val]);
			}
			Philosophy.Map.setMeasureGlobals(measure * factor, val, order);
		}

	}
	,
	renderMeasureVal: function (measure, units, order) {
		var out = "";
		if (order == 1) {
			out += measure.toFixed(3) + ' ' + units;
		} else {
			power = '<sup>' + order + '</sup>';
			if (units == 'ha') {
				power = '';
			}
			out += measure.toFixed(3) + ' ' + units + power;
		}

		var e = document.getElementById('win_measure_output');
		e.innerHTML = out;
	}
	,
	calcVincenty: function (geometry) {
		var dist = 0;
		for (var i = 1; i < geometry.components.length; i++) {
			var first = geometry.components[i - 1];
			var second = geometry.components[i];
			dist += OpenLayers.Util.distVincenty(
				{ lon: first.x, lat: first.y },
				{ lon: second.x, lat: second.y }
			);
		}
		return dist;
	}
	,
	setMeasureGlobals: function (measure, units, order) {
		Philosophy.Measure = measure;
		Philosophy.Units = units;
		Philosophy.Order = order;
	}
	,
	parseWKT: function (geomWKT) {

		var wkt = new OpenLayers.Format.WKT();

		var features = wkt.read(geomWKT);
		var bounds;
		if (features) {
			if (features.constructor != Array) {
				features = [features];
			}
			for (var i = 0; i < features.length; ++i) {
				if (!bounds) {
					bounds = features[i].geometry.getBounds();
				}
				else {
					bounds.extend(features[i].geometry.getBounds());
				}
			}
			Philosophy.Map.vectorLayer.addFeatures(features);
		}
		else {
			alert('Not valid WKT');
		}
	}
	,
	addCustomControls: function () {
		var controls = {
			click_layer_info: new OpenLayers.Control.ClickLayerInfo(),
			click_point_info: new OpenLayers.Control.ClickPointInfo(),
			click_add_location: new OpenLayers.Control.ClickAddLocation(),
			box_layer_info: new OpenLayers.Control.BoxLayerInfo(),
			box_bound_info: new OpenLayers.Control.BoxBoundInfo(),
			zoom_box: new OpenLayers.Control.ZoomBox(),
			zoom_box_out: new OpenLayers.Control.ZoomBox({ out: true }),
			zoom_out: new OpenLayers.Control.ZoomOut()
		};

		for (var key in controls) {
			this.map.addControl(controls[key]);
		}

		this.customControls = controls;
	}
	,
	activateCustomControl: function (type) {
		var control = this.customControls[type];
		control.activate();
	}
	,
	deactivateCustomControl: function () {
		var controls = this.customControls;
		for (var key in controls) {
			controls[key].deactivate();
		}
	}
	,
	setDisplayProjection: function (proj) {
		this.map.removeControl(this.mousePosition);
		var mp = new OpenLayers.Control.MousePosition({ displayProjection: new OpenLayers.Projection(proj) });
		this.mousePosition = mp;
		this.map.addControl(mp);
	}
	,
	transformPoint: function (x, y, source, target) {
		var lonLat = new OpenLayers.LonLat(x, y);
		lonLat.transform(new OpenLayers.Projection(source), new OpenLayers.Projection(target));
		return lonLat
	}
	,
	WsmToDispProj: function (x, y) {
		var lonLat = new OpenLayers.LonLat(x, y);
		lonLat.transform(new OpenLayers.Projection("EPSG:900913"), Philosophy.Map.mousePosition.displayProjection);
		return lonLat
	}
	,
	clearAllMarkers: function () {
		this.markerLayer.clearMarkers();
	}
	,
	clearAllVectors: function () {
		this.vectorLayer.destroyFeatures();
	}
	,
	setRasterLayersOpacity: function (opacity) {
		for (i = 0; i < this.rasterLayers.length; i++) {
			l = this.rasterLayers[i];
			l.setOpacity(opacity);
		}
	}
};
// eo Philosophy.Map