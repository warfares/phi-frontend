Ext.ns('Philosophy.Theme');

Philosophy.Theme = {
	extJsTheme: 'xtheme-slate.css',
	layerSwitcherBackColor: '#667689',
	dashBoardCollapsed: false,
	dashBoardCollapseMode: 'mini',
	bannerCollapsed: true,
	initCenter: { lon: -7132491.98233, lat: -3668977.3571, zoom: 4 },
	getWelcomeImage: function () {
		var img = document.createElement('img');
		img.setAttribute('id', 'mask_img');
		img.setAttribute('src', 'content/js/app/theme/ultragestion/resources/welcome.jpg');
		img.setAttribute('style', 'top:0; left:0; width:100%; height:100%;');
		return img;
	}
	,
	getMainTitles: function (container) {
		var dh = Ext.DomHelper;
		dh.append(container, { tag: 'div', id: 'mask_title', cls: 'title', html: 'Minera Los Pelambres' });
		dh.append(container, { tag: 'div', id: 'mask_subtitle', cls: 'subtitle', html: 'V 1.2' });        
		dh.append(container, { tag: 'div', id: 'mask_footer', cls: 'text_footer', html: 'Philosophy V 1.2 Dev Copyrights © IKOM 2010' });
		return null;
	}
	,
	defaultStyleVector: {
		strokeColor: "#a2754e",
		fillColor: "#80531c",
		fillOpacity: 0.5,
		strokeOpacity: 1,
		strokeWidth: 1,
		pointRadius: 4
	},
	selectStyleVector: {
		fillColor: "aaa",
		fillOpacity: 0.4,
		hoverFillColor: "white",
		hoverFillOpacity: 0.8,
		strokeColor: "777",
		strokeOpacity: 1,
		strokeWidth: 2
	}
};// eo App.Theme