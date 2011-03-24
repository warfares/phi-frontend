Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.LineMeasureOutput
* @extends Ext.Window
* 
* Philosophy measure aoutput, widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.LineMeasureOutput = Ext.extend(Ext.Window, {
	height : 120,
	width : 200,
	border: false,
	closable: false,
	layout : 'accordion', // 2
	layoutConfig : { // 3
		titleCollapse: true,  
		animate: true
		//activeOnTop: true  
	},
	
    initComponent: function() {
        var _this = this;
	    var units = [[],['m','km'],['m','km','ha']];
        var measureType = [[],['Linear Measure'],['Polygonal Measure']];
        
		var panel = new Ext.Panel({
			title: Philosophy.Globalization.For(measureType[this.order]),
			html: '<div style="font-weight:bold;" id="win_measure_output">0',
			frame : true
		});
	
		var unitsCombo = new Ext.form.ComboBox({
            typeAhead: true,
            triggerAction: 'all',
			fieldLabel : Philosophy.Globalization.For('Select Unit'),
            mode: 'local',
			anchor : '-5',
            store: units[this.order],
            displayField: 'units',
            valueField: 'id',
            emptyText:Philosophy.Globalization.For('To Convert')

        });
		
		var form = new Ext.FormPanel({
			title 		: Philosophy.Globalization.For('Change Measure Units'),
			bodyStyle 	: 'padding: 5px',
			defaultType : 'field',
			labelWidth 	: 50,
			items 		: [unitsCombo]
		})

		this.items = [panel,form];
        Phi.view.window.LineMeasureOutput.superclass.initComponent.call(this);
		
		unitsCombo.on("select", _this.convert);
    }
    ,
    show: function() {
        Phi.view.window.LineMeasureOutput.superclass.show.call(this);
        this.align();
        this.getEl().fadeIn({ duration: 1 });
    }
	,
    convert: function(f, r, i) {
        val = String(r.get(f.displayField));
        Philosophy.val = val;
        Philosophy.Map.convert(Philosophy.Measure, Philosophy.Units, Philosophy.Order, Philosophy.val);
        Philosophy.Map.renderMeasureVal(Philosophy.Measure, Philosophy.Units, Philosophy.Order);
    }
    ,
    align: function(c) {
        c = c || Ext.get("map");
        this.alignTo(c, 't-t?', [-3, 3]);
    }
});             // eo Phi.view.window.MeasureOutPut
// eof