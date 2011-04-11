Ext.onReady(function () {
	
	Ext.QuickTips.init();
	Ext.Container.prototype.bufferResize = false;

	// init load mask remove...
	Ext.get('loading-mask').remove();
	Ext.get('loading').remove();

	//Ajax (singleton) load indicator
	var loadMsg = Ext.DomHelper.insertFirst(document.body, { id: Ext.id(), cls: 'loading_load' }, true);
	var htmlLoad = '<img src="content/images/loading_blue.gif" style="float:left;width:16px;" align="middle" />';
	htmlLoad += '<span class="main_text">Loading...</span>';
	Ext.DomHelper.append(loadMsg, { html:htmlLoad }, true);
	loadMsg.alignTo(document.body, 'br-br?', [-3, 3]);
	loadMsg.hide();

	Ext.Ajax.on('beforerequest', function () { loadMsg.show(); }, this);
	Ext.Ajax.on('requestcomplete', function () { loadMsg.hide(); }, this);
	Ext.Ajax.on('requestexception', function (conn, response, options) {
		loadMsg.hide();
		Ext.MessageBox.alert(Phi.Global.For('Warning'), Phi.Global.For('Problem in call'));
	}, this);


	//main toolbar (north)
	Phi.mainToolbar = new Phi.view.toolbar.MainToolbar({ region: 'north', height: 30 });

	// main map Panel (center)
	Phi.mapContainer = new Ext.Panel({
		region: 'center',
		html: '<div id="map" style="width:100%; height:100%;" />'
	});

	// dasboard and panels def. (west)
	Phi.panelUser = new Phi.view.panel.User();
	Phi.panelLayer = new Phi.view.panel.Layer();
	Phi.panelGPS = new Phi.view.panel.GPS();
	Phi.panelMap = new Phi.view.panel.Map();
	Phi.panelWorkSpace = new Phi.view.panel.WorkSpace();
	Phi.panelLocation = new Phi.view.panel.Location();
	Phi.panelSearch = new Phi.view.panel.Search();

	Phi.dashBoard = new Ext.Panel({
		region: 'west',
		title: Phi.Global.For('DashBoard'),
		layout: 'accordion',
		collapsible: true,
		collapseMode: Phi.Theme.dashBoardCollapseMode,
		collapsed: Phi.Theme.dashBoardCollapsed,
		useSplitTips: true,
		autoScroll: true,
		animate: true,
		width: 310,
		items: [
			Phi.panelUser,
			Phi.panelLayer,
			Phi.panelGPS,
			Phi.panelMap,
			Phi.panelWorkSpace,
			Phi.panelLocation,
			Phi.panelSearch]
	});

	//GLOBAL: main layout definition (border layout:north, west,center)
	Phi.viewport = new Ext.Viewport({
		layout: 'border',
		defaults: {
			border: 0,
			split: false,
			margins: '0 0 0 0'
		},
		items: [Phi.mainToolbar, Phi.dashBoard, Phi.mapContainer]
	});
	
	//global hint def.
	Phi.hint = new Ext.ux.Hint();
	Phi.hint.setFooter(Phi.Global.For('hint_footer'));
	Phi.hint.on('check', function(v){
		Phi.mainToolbar.toggleHint(v.chk);
	}, this)


	// quick toolbar (this will show after login)
	Phi.mapQuickToolBar = new Phi.view.window.QuickToolBar({
		width: '52',
		height: '400',
		autoHeight: false
	});
	//viewport OK...
	
	// authentication
	var login = new Phi.view.window.Login();
	var user = new Phi.model.User();
	user.on('isauth', function(status, user){
		if(status)
			login.logged(status,'', user)
		else
			login.show();
	}, this);
	user.isauth();
	

	
	Phi.Map.googleEnabled = false;
	Phi.Map.umapEnabled = false;
	Phi.Map.omsEnabled = true;
	Phi.Map.Init();

	Phi.mapContainer.on('resize', function () {
		if (Phi.mapQuickToolBar.isVisible())
			Phi.mapQuickToolBar.align();

		Phi.Map.map.updateSize();
		loadMsg.alignTo(document.body, 'br-br?', [-3, 3]);
	});
});// eo function onReady
// eof
