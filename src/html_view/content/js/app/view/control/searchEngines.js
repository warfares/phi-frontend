Ext.ns("Philosophy.Search");

Philosophy.Search.GoogleMap = Ext.extend(Object,{
	getResult: function(v,parentModule){		
		var v_split = v.split(':'); 
		window.open('http://maps.google.es/maps?f=q&hl=es&geocode=&q='+v_split[1]+',+Chile&ie=UTF8&z=13&iwloc=addr');
	}
});

Philosophy.Search.Google = Ext.extend(Object,{
	getResult: function(v,parentModule){
		var v_split = v.split(':'); 
		window.open('http://www.google.cl/search?hl=es&q='+v_split[1]);
	}
});

Philosophy.Search.Point = Ext.extend(Object,{
	getResult: function(v,parentModule){
		var c = v.split(';');
		var latLon = Philosophy.Map.transformPoint(c[0], c[1], 'EPSG:4326', 'EPSG:900913');
		Philosophy.Map.setCenter({ lon: latLon.lon, lat: latLon.lat });
		Philosophy.Marker.drawMarker(latLon.lon, latLon.lat, 'red', null,'Input LatLon');
	}
});

Philosophy.Search.Zoom = Ext.extend(Object, {
	getResult: function(v, parentModule) {
		var v_split = v.split(':'); 		
		Philosophy.Map.setZoom(v_split[1]);
	}
});

Philosophy.Search.ZoomIn = Ext.extend(Object,{
	getResult: function(v,parentModule){
		Philosophy.Map.zoomIn();
	}
});

Philosophy.Search.ZoomOut = Ext.extend(Object,{
	getResult: function(v,parentModule){
		Philosophy.Map.zoomOut();
	}
});