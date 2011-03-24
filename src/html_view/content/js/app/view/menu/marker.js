Ext.ns("Phi.view.menu");
/**
* @class Philosophy.view.menu.Marker
* 
* Philosophy Marker quick access menu 
* 
* (raster - default location - favorites locations)
*
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.menu.Marker = Ext.extend(Ext.menu.Menu, {

	initComponent: function () {
		Phi.view.menu.Marker.superclass.initComponent.call(this);

		this.locationMenu = new Ext.menu.Menu();
		this.rasterMenu = new Ext.menu.Menu();

		this.add({ text: Phi.Global.For('Raster'), menu: this.rasterMenu });
		this.add({ text: Phi.Global.For('Predefined Locations'), menu: this.staticMenu(Phi.data.Location) });
		this.add({ text: Phi.Global.For('User Locations'), menu: this.locationMenu });
	}
	,
	staticItem: function (text, x, y, z, iconId, title, html) {
		var i = {
			icon: Phi.Marker.icons[iconId].path || Phi.Marker.icons['white'].path,
			text: text,
			handler: function () {
				Philosophy.Marker.drawMarker(x, y, iconId, null, title, html);
				var container = Ext.get('map');
				Phi.Map.setCenter({ lon: x, lat: y, zoom: z });
				Phi.Util.popupMessage(text, '', container);
			}
		};
		return i;
	}
	,
	staticMenu: function (data) {
		var menu = new Ext.menu.Menu();
		for (i = 0; i < data.length; i++) {
			l = data[i];
			menu.add(this.staticItem(l.title, l.x, l.y, l.z, l.color, l.title, l.description));
		}
		return menu;
	}
	,
	loadRaster: function () {
		this.rasterMenu.removeAll();
		var rasters = Phi.Map.map.getLayersBy('internalId', 'internal_raster');
		Ext.each(rasters, function (r, i) {
			var o = r.rasterObject;
			this.rasterMenu.add(this.staticItem(o.name, o.point.x, o.point.y, 10, "blue", o.name, o.description));
		}, this);
	}
	,
	locationLoad: function () { 
		var userName = Phi.Session.getUser();
		var user = new Phi.model.User();
		user.on('getfavoriteslocations', this.setLocations, this);
		user.getFavoritesLocations(userName);
	}
	,
	setLocations: function (locations) {
		this.locationMenu.removeAll();
		var HandlerFactory = function (point, name, desc) {
			return function () {
				var container = Ext.get('map');
				Phi.Marker.drawMarker(point.lon, point.lat, 'yellow', [name], name, desc);
				Phi.Map.setCenter(point);
				Phi.Util.popupMessage(name, '', container);
			}
		};
		Ext.each(locations, function (l) {
			var name = l.name;
			var desc = l.description;
			var point = l.point;

			var point = {
				lat: point.x,
				lon: point.y,
				zoom: 10
			};

			var handler = HandlerFactory(point, name, desc);
			var l = new Ext.menu.Item({
				icon: Phi.Marker.icons['yellow'].path,
				text: name,
				handler: handler
			});

			this.locationMenu.add(l);
		}, this);
	}
});// eo Phi.view.menu.Marker
// eof