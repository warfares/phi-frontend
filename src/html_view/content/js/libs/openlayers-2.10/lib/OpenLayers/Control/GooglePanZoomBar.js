/**
 * @requires OpenLayers/Control/PanZoomBar.js
 */

/**
 * Class: OpenLayers.Control.GooglePanZoomBar
 * 
 * PanZoomBar With Google V3 style 
 *
 * Inherits from:
 *  - <OpenLayers.Control.PanZoomBar>
 */
OpenLayers.Control.GooglePanZoomBar = OpenLayers.Class(OpenLayers.Control.PanZoomBar, {

    /** 
     * APIProperty: zoomStopWidth
     */
    zoomStopWidth: 7,

    /** 
     * APIProperty: zoomStopHeight
     */
    zoomStopHeight: 11,
	
	
    /**
     * Constructor: OpenLayers.Control.PanZoomBar
     */ 
    initialize: function() {
        OpenLayers.Control.PanZoomBar.prototype.initialize.apply(this, arguments);
    },
    
    /**
    * Method: draw 
    *
    * Parameters:
    * px - {<OpenLayers.Pixel>} 
    */
    draw: function(px) {
        // initialize our internal div
        OpenLayers.Control.prototype.draw.apply(this, arguments);
        px = this.position.clone();

        // place the controls
        this.buttons = [];
		
		// matrix differente sizes.
		var sz = new OpenLayers.Size(17,18);
		var sz1 = new OpenLayers.Size(19,18);
		var sz2 = new OpenLayers.Size(17,19);
		var sz3 = new OpenLayers.Size(19,19);
			
		var plus = new OpenLayers.Size(19,23);
		var minus = new OpenLayers.Size(19,22);
		
        var centered = new OpenLayers.Pixel(px.x, px.y);

		this._addButton("panupleft", "g-tl.png", centered, sz);
        this._addButton("panleft", "g-l.png", centered.add(0,sz.h), sz);
        this._addButton("pandownleft", "g-bl.png", centered.add(0,sz.h * 2), sz2);
		
		
		this._addButton("panup", "g-t.png", centered.add(sz.w, 0), sz);
		this._addButton("custom", "g-c.png", centered.add(sz.w, sz.h),sz);
		this._addButton("pandown", "g-b.png", centered.add(sz.w, sz.h * 2),sz2);
		
		this._addButton("panupright", "g-tr.png", centered.add(sz.w * 2, 0), sz1);
		this._addButton("panright", "g-r.png", centered.add(sz.w * 2, sz.h),sz1);
		this._addButton("pandownright", "g-br.png", centered.add(sz.w * 2,sz.h * 2),sz3);
			
			
		this._addButton("zoomin", "g-zoom-plus-mini.png", centered.add( sz.w, plus.h*3+5),plus);
        centered = this._addZoomBar(centered.add(sz.w + 5, plus.h*4+5));		
        this._addButton("zoomout", "g-zoom-minus-mini.png", centered.add(-5, 0), minus);
        return this.div;
    },

    /** 
    * Method: _addZoomBar
    * 
    * Parameters:
    * location - {<OpenLayers.Pixel>} where zoombar drawing is to start.
    */
    _addZoomBar:function(centered) {
        var imgLocation = OpenLayers.Util.getImagesLocation();
        
        var id = this.id + "_" + this.map.id;
        var zoomsToEnd = this.map.getNumZoomLevels() - 1 - this.map.getZoom();
        var slider = OpenLayers.Util.createAlphaImageDiv(id,
                       centered.add(-4, zoomsToEnd * this.zoomStopHeight), 
                       new OpenLayers.Size(17,13), 
                       imgLocation+"g-slider.png",
                       "absolute");
        this.slider = slider;
        
        this.sliderEvents = new OpenLayers.Events(this, slider, null, true,
                                            {includeXY: true});
        this.sliderEvents.on({
            "mousedown": this.zoomBarDown,
            "mousemove": this.zoomBarDrag,
            "mouseup": this.zoomBarUp,
            "dblclick": this.doubleClick,
            "click": this.doubleClick
        });
        
        var sz = new OpenLayers.Size();
        sz.h = this.zoomStopHeight * this.map.getNumZoomLevels();
        sz.w = this.zoomStopWidth;
        var div = null;
        
        if (OpenLayers.Util.alphaHack()) {
            var id = this.id + "_" + this.map.id;
            div = OpenLayers.Util.createAlphaImageDiv(id, centered,
                                      new OpenLayers.Size(sz.w, 
                                              this.zoomStopHeight),
                                      imgLocation + "g-zoombar.png", 
                                      "absolute", null, "crop");
            div.style.height = sz.h + "px";
        } else {
            div = OpenLayers.Util.createDiv(
                        'OpenLayers_Control_PanZoomBar_Zoombar' + this.map.id,
                        centered,
                        sz,
                        imgLocation+"g-zoombar.png");
        }
        
        this.zoombarDiv = div;
        
        this.divEvents = new OpenLayers.Events(this, div, null, true, 
                                                {includeXY: true});
        this.divEvents.on({
            "mousedown": this.divClick,
            "mousemove": this.passEventToSlider,
            "dblclick": this.doubleClick,
            "click": this.doubleClick
        });
        
        this.div.appendChild(div);

        this.startTop = parseInt(div.style.top);
        this.div.appendChild(slider);

        this.map.events.register("zoomend", this, this.moveZoomBar);

        centered = centered.add(0, 
            this.zoomStopHeight * this.map.getNumZoomLevels());
        return centered; 
    },
	 /**
     * Method: buttonDown
     *
     * Parameters:
     * evt - {Event} 
     */
    buttonDown: function (evt) {
        if (!OpenLayers.Event.isLeftClick(evt)) {
            return;
        }
        switch (this.action) {
            case "panup": 
                this.map.pan(0, -this.getSlideFactor("h"));
                break;
            case "pandown": 
                this.map.pan(0, this.getSlideFactor("h"));
                break;
            case "panleft": 
                this.map.pan(-this.getSlideFactor("w"), 0);
                break;
            case "panright": 
                this.map.pan(this.getSlideFactor("w"), 0);
                break;			
			case "panupleft": 
                this.map.pan(-this.getSlideFactor("w"), -this.getSlideFactor("h"));
                break;			
            case "pandownleft": 
                this.map.pan(-this.getSlideFactor("w"), this.getSlideFactor("h"));
                break;
            case "panupright": 
                this.map.pan(this.getSlideFactor("w"), -this.getSlideFactor("h"));
                break;
            case "pandownright": 
                this.map.pan(this.getSlideFactor("w"), this.getSlideFactor("h"));
                break;			
			case "zoomin": 
                this.map.zoomIn(); 
                break;
            case "zoomout": 
                this.map.zoomOut(); 
                break;
            case "custom": 
                this.map.onCustomAction(); 
                break;
        }
        OpenLayers.Event.stop(evt);
    }
	,
    CLASS_NAME: "OpenLayers.Control.GooglePanZoomBar"
});