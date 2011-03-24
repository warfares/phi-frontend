Ext.ns("Philosophy");
/**
* @class Philosophy.Marker
* 
* Main app map marker  
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Philosophy.Marker = {
	/**
	* Property: tip
	* {Object} Ext.Tooltip (singleton) used for marker on mouseover event
	*/
	tip : new Ext.ToolTip({
		width: 200,
		title:'dummy',
		html:'dummy text.....',
		trackMouse: true
	})
	,
	/**
	* Constant: icons
	* {Object} Icons dictionary definitions
	*/    
	icons: {
		white: { path: 'content/images/markers/pushpin.png', dimx: 26, dimy: 35 },
		red: { path: 'content/images/markers/pushpinred.png', dimx: 26, dimy: 35 },
		green: { path: 'content/images/markers/pushpingreen.png', dimx: 26, dimy: 35 },
		blue: { path: 'content/images/markers/pushpinblue.png', dimx: 26, dimy: 35 },
		orange: { path: 'content/images/markers/pushpinorange.png', dimx: 26, dimy: 35 },
		purple: { path: 'content/images/markers/pushpinpurple.png', dimx: 26, dimy: 35 },
		yellow: { path: 'content/images/markers/pushpinyellow.png', dimx: 26, dimy: 35 },
		googleMarker: { path: 'content/images/markers/google_marker.png', dimx: 37, dimy: 34 },
		point4red: { path: 'content/images/markers/point4_red.png', dimx: 4, dimy: 4 },
		point5red: { path: 'content/images/markers/point5_red.png', dimx: 5, dimy: 5 },
		point6red: { path: 'content/images/markers/point6_red.png', dimx: 6, dimy: 6 },
		point4yellow: { path: 'content/images/markers/point4_yellow.png', dimx: 4, dimy: 4 },
		point5yellow: { path: 'content/images/markers/point5_yellow.png', dimx: 5, dimy: 5 },
		point6yellow: { path: 'content/images/markers/point6_yellow.png', dimx: 6, dimy: 6 },

		gps_go_0: { path: 'content/images/gps-icons/arrow_green_0.png', dimx: 16, dimy: 16 },
		gps_go_45: { path: 'content/images/gps-icons/arrow_green_45.png', dimx: 16, dimy: 16 },
		gps_go_90: { path: 'content/images/gps-icons/arrow_green_90.png', dimx: 16, dimy: 16 },
		gps_go_135: { path: 'content/images/gps-icons/arrow_green_135.png', dimx: 16, dimy: 16 },
		gps_go_180: { path: 'content/images/gps-icons/arrow_green_180.png', dimx: 16, dimy: 16 },
		gps_go_225: { path: 'content/images/gps-icons/arrow_green_225.png', dimx: 16, dimy: 16 },
		gps_go_270: { path: 'content/images/gps-icons/arrow_green_270.png', dimx: 16, dimy: 16 },
		gps_go_315: { path: 'content/images/gps-icons/arrow_green_315.png', dimx: 16, dimy: 16 },

		gps_stop_0: { path: 'content/images/gps-icons/arrow_red_0.png', dimx: 16, dimy: 16 },
		gps_stop_45: { path: 'content/images/gps-icons/arrow_red_45.png', dimx: 16, dimy: 16 },
		gps_stop_90: { path: 'content/images/gps-icons/arrow_red_90.png', dimx: 16, dimy: 16 },
		gps_stop_135: { path: 'content/images/gps-icons/arrow_red_135.png', dimx: 16, dimy: 16 },
		gps_stop_180: { path: 'content/images/gps-icons/arrow_red_180.png', dimx: 16, dimy: 16 },
		gps_stop_225: { path: 'content/images/gps-icons/arrow_red_225.png', dimx: 16, dimy: 16 },
		gps_stop_270: { path: 'content/images/gps-icons/arrow_red_270.png', dimx: 16, dimy: 16 },
		gps_stop_315: { path: 'content/images/gps-icons/arrow_red_315.png', dimx: 16, dimy: 16 }
	}    
	,   
	/**
	* Method: drawMarker
	* Draw Marker in Philosophy.Map.MarkerLayer. 
	* X,Y  Coordinates must have the map projection.
	*
	* Parameters: 
	* x    - {Float} X coordinate.
	* y    - {Float} Y coordinate.
	* iconId   - {String} optional icon dictionary id
	* data     - {Array(String)} optional generic data collection  
	* title    - {String} optional marker title
	* html     - {String} optional html marker general description (used in tooltip)
	* 
	* Returns:
	* {OpenLayer.marker} Drawed marker.
	*
	*/        
	drawMarker: function(x, y, iconId, data, title, html, markerLayer) {
		var icondef = this.icons[iconId] || this.icons['white'];
		var lonLat = new OpenLayers.LonLat(x, y);
		var size = new OpenLayers.Size(icondef.dimx, icondef.dimy);
		var offset = new OpenLayers.Pixel(-(size.w / 2), -size.h);
		var marker = new OpenLayers.Marker(lonLat, new OpenLayers.Icon(icondef.path, size, offset));
		
		var markerLayer = markerLayer || Philosophy.Map.markerLayer; 
		markerLayer.addMarker(marker);

		marker.events.register('mousedown', marker, function(evt) {
			//display projection
			var disp = Philosophy.Map.WsmToDispProj(x, y);
			var win = new Phi.view.window.MarkerData({ 
				marker: marker, 
				markerLayer: markerLayer,
				data: data, 
				coordinate:[disp.lon,disp.lat] });
				win.show(this);
				OpenLayers.Event.stop(evt);
		});

		marker.events.register('mouseover', marker, function(evt) {
			//display projection
			var disp = Philosophy.Map.WsmToDispProj(x, y);

			// default values 
			var nt = title || 'Marker';
			var nh = html || '<b>x:</b>' + disp.lon + '<br/><b>y:</b>' + disp.lat; 

			var div = marker.icon.imageDiv;
			var tt = Philosophy.Marker.tip;
			tt.initTarget(div);
			tt.showAt([0,0]); // this fix x,y target init position 
			tt.setTitle(nt);
			tt.body.update(nh);

			OpenLayers.Event.stop(evt);
		});
		return marker;
	}
};
// eo Philosophy markers

