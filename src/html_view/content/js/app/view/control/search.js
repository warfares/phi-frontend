Ext.ns("Philosophy.Control");

Phi.Control.Search = Ext.extend(Ext.form.TriggerField, {
	validationEvent: false,
	validateOnBlur: false,
	triggerClass: 'x-form-search-trigger',
	width: 260,
	emptyText: Phi.Global.For('Search with Ultramap'),
	
	initComponent: function() {
		
		Phi.Control.Search.superclass.initComponent.call(this);
		this.onTriggerClick = this.search;
		this.on('specialkey', function(f, e) { if (e.getKey() == e.ENTER) this.search(); }, this);
	}
	,
	onRender: function() {
		Phi.Control.Search.superclass.onRender.apply(this, arguments);

		var t = new Ext.ToolTip({
			target: this.el,
			title: Phi.Global.For('Address Search'),
			width: 400,
			html: this.createToolTipMsg(),
			trackMouse: true
		});
	}
	,
	createToolTipMsg: function() {
		var html = [];
		html.push(Phi.Global.For('Ultramap Geocoding address seach service'));
		html.push('<br/><br/>');
		html.push(Phi.Global.For('also the following commands are available'));
		html.push('<br/><br/>');
		html.push('<table width="400">');
		html.push('<tr><td ><b class="main_font_blue">gm:</b>[dato]</td> <td>');
		html.push(Phi.Global.For('Address search in google maps'));
		html.push(',<i> i.e: gm:Alameda 132');
		html.push('</i></td></tr>');
		html.push('<tr><td ><strong class="main_font_blue">gs:</strong>[)');
		html.push(Phi.Global.For('data'));
		html.push(']</td>');
		html.push('<td>Busqueda de dato en Google,<i> ej: gs:GIS</i></td></tr>');
		html.push('<tr><td><span class="main_font_blue"><b>z-</b>,<b>z+</b>,<b>z:</b></span>[')
		html.push(Phi.Global.For('number'));
		html.push(']</td> <td>');
		html.push(Phi.Global.For('Change the zoom level'));
		html.push('</td></tr>');
		html.push('<tr><td>[numero]<b class="main_font_blue">;</b>[');
		html.push(Phi.Global.For('number'));
		html.push(']</td> <td>');
		html.push(Phi.Global.For('Coordinate'));
		html.push('Lon, Lat,<em> i.e: -70.123;-33 </em></td></tr>');
		html.push('</table>');
		return html.join('');
	}
	,
	search: function() {
		// first regular expression actions 
		var v = this.getRawValue().trim();
		var match = this.searchRegExp(v);

		// ultramap not command match -> search
		if (!match) {
			var location =  v;
			var geocode = new Phi.Geocode();
			geocode.on('beforesearch', function(){
				Phi.Msg('Searching: ' + location);
				Phi.panelSearch.setSearching();
			}, this);
			geocode.on('search', function(r){ 
				Phi.panelSearch.setResults(r); 
			},this);
			var address = {location: location};
			geocode.search(address)
		}
	}
	,
	searchRegExp: function(v) {
		var regexp = [
			{
				engine: new Philosophy.Search.Point(),
				regex: /^(-{0,1}[0-9]*?.[0-9]*);(-{0,1}[0-9]*?.[0-9]*)$/
			},
			{
				engine: new Philosophy.Search.Zoom(),
				regex: /^z:\d$/i
			},
			{
				engine: new Philosophy.Search.ZoomIn(),
				regex: /^z\+$/i
			},
			{
				engine: new Philosophy.Search.ZoomOut(),
				regex: /^z\-$/i
			},
			{
				engine: new Philosophy.Search.GoogleMap(),
				regex: /^gm:.*$/i
			},
			{
				engine: new Philosophy.Search.Google(),
				regex: /^gs:.*$/i
			}
			];
		
		var found = false;
		Ext.each(regexp, function(r){
			var regex = r.regex;
			var engine = r.engine;
			var match = regex.test(v);
			if (match) {
				engine.getResult(v);
				found = true;
			};
		}, this)
		return found;
    }
});	// eo Philosophy.Control.Search
// eof