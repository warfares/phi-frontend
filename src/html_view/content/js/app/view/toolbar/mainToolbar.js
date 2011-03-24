Ext.ns('Phi.view.toolbar');
/**
* @class Philosophy.view.toolbar.MainToolbar
* 
* Philosophy Main app toolbar (north)
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.toolbar.MainToolbar = Ext.extend(Ext.Toolbar, {
	initComponent: function () {
		var _this = this;
		this.searchField = new Philosophy.Control.Search();
		this.markerMenu = this.markerMenu();
		this.projMenu = new Phi.view.comboBox.Projection({ width: 150, initProjValue: '32719' });

		this.projMenu.on('select', function (combo, record, index) {
			var proj = record.data.epsg;
			Philosophy.Map.setDisplayProjection(proj);
		});

		this.baseLayerCombo = new Phi.view.comboBox.BaseLayer();
		this.alphaSlider = new Phi.view.slider.BaseLayer();

		Phi.view.toolbar.MainToolbar.superclass.initComponent.call(this);

		this.add(this.searchField);
		this.add(this.markerMenu);
		this.add('-');
		this.add(this.projMenu);
		this.add('-');
		this.add(this.baseLayerCombo);
		this.add('');
		this.add(' ');
		this.add(this.alphaSlider);
		this.add(' ');
		this.add({
			iconCls: 'icon-grid',
			enableToggle: true,
			tooltip: { 
				title: Phi.Global.For('Grid'), 
				text: Phi.Global.For('Show/Hide grid coordinates <br/> over the map') 
			},
			handler: function () {
				var v = !Phi.Map.graticule.gratLayer.getVisibility();
				Phi.Map.graticule.gratLayer.setVisibility(v);
			}
		});
		this.add({ xtype: 'tbfill' });

		this.add([
			{
				text: Phi.Global.For('Print'),
				tooltip: { 
					title: Phi.Global.For('Print'), 
					text: Phi.Global.For('Print Visible view') 
				},
				iconCls: 'icon-printer',
				handler: function () {
					
					
						var printProvider = new GeoExt.data.PrintProvider({
							method: "POST",
							url: 'http://dev.phi/geoserver/pdf/',
							autoLoad: true
						});

						printProvider.on('loadcapabilities', function(a){
							a.capabilities.createURL = 'http://dev.phi/geoserver/pdf/create.json';
							a.capabilities.printURL = 'http://dev.phi/geoserver/pdf/print.pdf';

							var printPage = new GeoExt.data.PrintPage({
								printProvider: printProvider,
								customParams: {
									mapTitle: "fffff",
									comment: "This is a simple map printed from GeoExt."
								}
							});
							
							var win = new Phi.view.window.PrintModule({
								printProvider:printProvider,
								printPage:printPage
							});
							win.show();
						}, this);
				}
			}
			,
			{
				text: Phi.Global.For('Control Panel'),
				tooltip: { 
					title: Phi.Global.For('Control Panel'), 
					text: Phi.Global.For('Configuration tool as <br/> personal data, administration, etc...') 
				},
				iconCls: 'icon-control-panel',
				handler: function () {
					var win = new Phi.view.window.ControlPanel();
					win.show(this);
				}
			}
			,
			{
				text: Phi.Global.For('Sign out'),
				tooltip: { title: Phi.Global.For('Sign Out'), text: Phi.Global.For('Close current session') },
				iconCls: 'icon-key',
				handler: function () {
					Ext.MessageBox.show({
						title: Phi.Global.For('Logout'),
						msg: Phi.Global.For('Are you sure ?'),
						animEl: 'logOut',
						buttons: Ext.MessageBox.YESNO,
						scope: this,
						fn: function (btn, text) {
							if (btn == 'yes') { _this.logOut(); }
						}
					});
				}
			}
	]);
	}
	,
	load: function () {
		this.loadFavorites();
		this.baseLayerCombo.loadBaseLayers();
	}
	,
	markerMenu: function () {
		this.menu = new Phi.view.menu.Marker();
		var markerMenu = {
			iconCls: 'icon-group-locations',
			tooltip: { 
				title: Phi.Global.For('Favorites'), 
				text: Phi.Global.For('Quick Access to <br/> Raster, Places and favorite locations') 
			},
			text: '',
			menu: this.menu
		};
		return markerMenu;
	}
	,
	loadFavorites: function () {
		this.menu.locationLoad();
	}
	,
	logOut: function () {
		//destroy env_session 
		var user = new Phi.model.User();
		user.on('logout', function(o){
			window.location.reload();
		}, this);
		user.logout();
	}
}); // eo Phi.view.toolbar