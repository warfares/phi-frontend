Ext.ns("Philosophy");
/**
* @class Philosophy.Layer
*
* Philosophy all applied layers (store) 
* <br/>
* Note: one layer looks like this:
*		layer=	{name: 'physical db name',title: 'display name'};
*<br/>Example:
*<pre><code>
* var l = {'name':'public.region', 'title':'Regions'};
* Phi.Layer.appliedLayers.push(l);
*</code></pre>
*
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
* @singleton
*
*/
Philosophy.Layer = {
	/**
	* Property: apliedLayer
	* {Array(Object)} array of "applied" conceptual object or entity layers	
	*
	*	The layer conceptual object or entity in the array its like this:
	*
	*		layer=	{name: physical db name,title: display name, srid: layer srid}
	*
	*		example: {'name':'public.region', 'title':'Regions', 'srid':32719}
	*
	*/
	appliedLayers: [],
	/**
	* Method: getLayers
	* Retrieve applied layers name (key) array 
	*
	* Returns:
	* {Array(String)} Array with layer name
	*
	*/
	getLayers: function () {
		var l = Philosophy.Util.clone(this.appliedLayers);
		var layerName = [];
		for (x = 0; x < l.length; x++)
		layerName.push(l[x].name)

		return layerName;
	}	
	,
	/**
	* Method: getLayerTitles
	* Retrieve applied layers title (description) array 
	*
	* Returns:
	* {Array(String)} Array with layer title
	*
	*/
	getLayerTitles: function () {
		var l = Philosophy.Util.clone(this.appliedLayers);
		var layerTitle = [];
		for (x = 0; x < l.length; x++)
		layerTitle.push(l[x].title)
		return layerTitle;
	}
	,
	/**
	* Method: getWMSLayers
	* Retrieve WMS multilayer string from the applied layers
	*
	* Returns:
	* {String} WMS multilayer string
	*
	*/
	getWMSLayers: function (ns) {
		var l = this.getLayers();
		for (x = 0; x < l.length; x++) {
			l[x] = l[x].split('.')[1];
			l[x] = ns + ":" + l[x];   // TODO this OK but do more clear 
		}
		return l.join(',');
	}
	,
	/**
	* Method: getLayerIdString
	* Retrieve layer name (key) string from the applied layers
	*
	* Returns:
	* {String} layer name (key) string
	*
	*/
	getLayerIdString: function () {
		var l = this.getLayers();
		return l.join(',');
	}
	,
	/**
	* Method: getLayerById
	* Retrieve layer object by id (name) key
	*
	* Returns:
	* {Object} layer, false if not exist
	*
	*/
	getLayerById: function(name){
		for (i = 0; i < this.appliedLayers.length; i++) {
			var layer = this.appliedLayers[i];
			if (layer.name === name)
				return layer;
		}
		return false;
	}
};
// eo Phi Layer