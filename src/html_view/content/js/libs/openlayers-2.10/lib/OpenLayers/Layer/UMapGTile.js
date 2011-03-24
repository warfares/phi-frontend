/* Copyright (c) 2006-2008 MetaCarta, Inc., published under the Clear BSD
 * licence.  See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license. */


/**
 * @requires OpenLayers/Layer/Grid.js
 * @requires OpenLayers/Tile/Image.js
 */

/**
 * Class: OpenLayers.Layer.UMapGTile
 * 
 * Inherits from:
 *  - <OpenLayers.Layer.Grid>
 */
OpenLayers.Layer.UMapGTile = OpenLayers.Class(OpenLayers.Layer.Grid, {


    /** 
    * Constant: CACHE_POLICY_PARAMETER
    * {String} &c= 
    */
    CACHE_POLICY_PARAMETER: "&c=",


    /** 
    * Constant: LAYER_PARAMETER
    * {String} &l= 
    */
    LAYER_PARAMETER: "&l=",


    /**
    * APIProperty: serviceVersion
    * {String}
    */
    serviceVersion: "1.0.0",

    /**
    * APIProperty: isBaseLayer
    * {Boolean}
    */
    isBaseLayer: true,

    /**
    * APIProperty: tileOrigin
    * {<OpenLayers.Pixel>}
    */
    tileOrigin: null,

    /**
    * APIProperty: layers
    * {<Array>}
    */
    layers: [],

    /**
    * APIProperty: cacheAt
    * {<Array>}
    */
    cachePolicy: [],

    /**
    * APIProperty: strLayer
    * {<String>}
    */
    strLayers: '',

    /**
    * APIProperty: strCacheAt
    * {<String>}
    */
    strCachePolicy: '',
    
    
    /** 
    * APIProperty : fixY
    * {<Integer>}
    */
    fixY: 0,


    /**
    * Constructor: OpenLayers.Layer.UMapGTile
    * 
    * Parameters:
    * name - {String}
    * url - {String}
    * options - {Object} Hashtable of extra options to tag onto the layer
    */
    initialize: function(name, url, options) {
        var newArguments = [];
        newArguments.push(name, url, {}, options);
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, newArguments);

        this.layers = this.options.layers;
        this.cachePolicy = this.options.cachePolicy;
        
        this.strLayers = this.getStrLayers();
        this.strCachePolicy = this.getStrCachePolicy();
    },

    /**
    * APIMethod:destroy
    */
    destroy: function() {
        // for now, nothing special to do here. 
        OpenLayers.Layer.Grid.prototype.destroy.apply(this, arguments);
    },


    /**
    * APIMethod: clone
    * 
    * Parameters:
    * obj - {Object}
    * 
    * Returns:
    * {<OpenLayers.Layer.UMapGTile>} An exact clone of this <OpenLayers.Layer.UMapGTile>
    */
    clone: function(obj) {

        if (obj == null) {
            obj = new OpenLayers.Layer.UMapGTile(this.name,
                                           this.url,
                                           this.options);
        }

        //get all additions from superclasses
        obj = OpenLayers.Layer.Grid.prototype.clone.apply(this, [obj]);

        // copy/set any non-init, non-simple values here

        return obj;
    },

    /**
    * Method getStrLayer       
    *
    * Return:{String} A string with layer array join for the url 
    *
    */
    getStrLayers: function() {
       return this.layers ? this.LAYER_PARAMETER + this.layers.join('|') : "";
    },


    /**
    * Method getStrCachePolicy   
    *
    * Return:{String} A string with cache policy  array join for the url 
    *
    */
    getStrCachePolicy: function() {
       return this.cachePolicy ? this.CACHE_POLICY_PARAMETER + this.cachePolicy.join(',') : "";      
    },


    /**
    * Method mergeNewParams
    * Modify parameters for redraw the layer.
    * 
    * Parameters:
    * params - {Object}
    */
    mergeNewParams: function(params) {
        this.layers = params.layers;
        this.cachePolicy = params.cachePolicy;
        this.fixY = params.fixY;
        
        this.strLayers = this.getStrLayers();
        this.strCachePolicy = this.getStrCachePolicy();
    },

    /**
    * Method: getURL
    * 
    * Parameters:
    * bounds - {<OpenLayers.Bounds>}
    * 
    * Returns:
    * {String} A string with the layer's url and parameters and also the 
    *          passed-in bounds and appropriate tile size specified as 
    *          parameters
    */
    getURL: function(bounds) {

        var url = this.url;
        var res = this.map.getResolution();
        var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
        var y = (Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h))) + this.fixY;
        var z = this.map.getZoom();

        var path = "/gtile.ashx?x=" + x + "&y=" + y  + "&z=" + z + "&k=false" + this.strLayers + this.strCachePolicy;

        if (url instanceof Array) {
            url = this.selectUrl(path, url);
        }

        return url + path;
    },

    /**
    * Method: addTile
    * addTile creates a tile, initializes it, and adds it to the layer div. 
    * 
    * Parameters:
    * bounds - {<OpenLayers.Bounds>}
    * position - {<OpenLayers.Pixel>}
    * 
    * Returns:
    * {<OpenLayers.Tile.Image>} The added OpenLayers.Tile.Image
    */
    addTile: function(bounds, position) {
        return new OpenLayers.Tile.Image(this, position, bounds,
                                         null, this.tileSize);
    },

    /** 
    * APIMethod: setMap
    * When the layer is added to a map, then we can fetch our origin 
    *    (if we don't have one.) 
    * 
    * Parameters:
    * map - {<OpenLayers.Map>}
    */
    setMap: function(map) {
        OpenLayers.Layer.Grid.prototype.setMap.apply(this, arguments);
        if (!this.tileOrigin) {
            this.tileOrigin = new OpenLayers.LonLat(this.map.maxExtent.left,
                                                this.map.maxExtent.bottom);
        }
    },

    CLASS_NAME: "OpenLayers.Layer.UMapGTile"
});
