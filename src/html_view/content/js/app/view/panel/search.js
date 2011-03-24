Ext.ns("Phi.view.panel");
/**
* @class Philosophy.view.panel.Search
* 
* Philosophy geocode results panel (Dashboard)
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.panel.Search = Ext.extend(Ext.Panel, {
	title: Phi.Global.For('Search'),
	layout: 'fit',
	border: false,
	collapsible: true,
	autoscroll: true,
	plugins: [Ext.ux.plugins.ToggleCollapsible],
	initComponent: function() {
		var tbar = new Ext.Toolbar({
			items: [
					{ xtype: 'tbfill' },
					{
						iconCls: 'icon-clear',
						text: Phi.Global.For('Clear'),
						tooltip: Phi.Global.For('Clear'),
						scope: this,
						handler: this.clear
					}
			]
		});
		this.tbar = tbar;
		
		Phi.view.panel.Search.superclass.initComponent.call(this);
	}
	,
	onRender: function() {
		Phi.view.panel.Search.superclass.onRender.apply(this, arguments);
		this.body.dom.className = 'main_container';
	}
	,
	setResults:function(records){
		this.clear();
		this.renderHTML(records);
		this.body.highlight('#f6e8b0', { block: true });
	}
	,
	setSearching: function(){
		this.clear();
		var dh = Ext.DomHelper;
		dh.append(this.body, {
			tag: 'center',
			style: 'padding-top:70px;',
			html: '<img src="content/images/loading.gif" width="32" height="32" style="margin-right:8px;" align="absmiddle"/>Searching...'
			}
		);
		this.expand();
	}
	,
	clear: function(){
		this.body.dom.innerHTML = '';
	}
	,
	buildText: function (o) {
        var text = o.StreetType + '. ' + o.StreetName + ' ' + o.StreetNumber + ', ' + o.Municipality;
		if (text.length > 50)
			text = text.substring(0, 50) + '...';
	
        if (o.StreetType == "" && o.StreetName == "" && o.StreetNumber == "" && o.Municipality != "")
            text = '<b>' + o.Municipality + '</b>';

        var regionDesc = "";
        if (o.RegionISO != "RM") regionDesc = "Región de ";

        if (o.Accuracy == 'Municipality')
            text = "<b>Comuna de " + o.Municipality + ', ' + regionDesc + o.Region + '</b>';

        if (o.Accuracy == 'Town'){
            text = o.Town + " / " + o.Municipality + ', ' + regionDesc + o.Region;
			if (text.length > 50)
				text = text.substring(0, 50) + '...';
		}
			
        return text;
    }
	,
	renderHTML: function(records){
		var dh = Ext.DomHelper;
		if (records.length === 0){
			dh.append(this.body, {
				tag: 'center', 
				style: 'padding-top:70px;', 
				html: '<font color=red><b>' + Phi.Global.For('Search Not Found') + '</b></font>'
				}
			);
		}	
		else if (records.length > 0 && records[0].Exact == 'True') {
			var o = records[0];
			dh.append(this.body, {
				tag: 'center', 
				style: 'padding-top:70px;', 
				html: '<font>' + Phi.Global.For('Search Found') + ' : <br/><br/> <b>' + o.StreetName + ' ' + o.StreetNumber + '</b> en <b>' + o.Municipality + '</b></font>'
				}
			);
			this.drawAddress(o); 
		}
		else {	
			var ul = dh.append(this.body, {tag: 'ul', style: 'padding-left:20px; padding-top:10px;'});
			Ext.each(records, function(o){
				var text =  this.buildText(o);	
				var t = new Ext.Template('<li id="{id}"><img src="content/images/markers/pushpin_mini.png" style="vertical-align:middle;margin-right:6px;" /><a  class="main_font_link">{text}</a></li>');
				var li = t.append(ul, { id: Ext.id(), text: text });
				var el = Ext.get(li);
				el.on('click', function () {	
					this.drawAddress(o); 
				}, this);
			}, this);
		}
	}
	,
	drawAddress: function(o) {
	    var lonLat = new OpenLayers.LonLat(o.Longitude, o.Latitude)
	    lonLat.transform(new OpenLayers.Projection("EPSG:32719"), Phi.Map.map.getProjectionObject());

	    var title = o.Region + '/' + o.City;
	    var desc = [];
	    desc.push(o.StreetType);
	    desc.push(o.StreetName);
	    desc.push(o.StreetNumber);
	    desc.push('<br/>');
	    desc.push(o.Municipality);
	    desc = desc.join(' ');

	    Phi.Marker.drawMarker(lonLat.lon, lonLat.lat, 'red', [], title, desc);
	    Phi.Map.map.setCenter(lonLat);
	}
});// eof Phi.view.panel.Search
// eof