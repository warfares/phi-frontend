Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.drawXY 
* @extends Ext.Window
* 
* Philosophy draw x, y  on map (marker), widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.drawXY = Ext.extend(Ext.Window, {
    title: Philosophy.Globalization.For('Draw coordinate') + ' [EPSG:4326]',
    width: 360,
    autoHeight: true,
    closable: true,
    maximizable: false,
    modal: false,
    plain: true,

    initComponent: function () {

        var _this = this;

        this.projCombo = new Phi.view.comboBox.Projection({ fieldLabel: 'SRID' });

        this.projCombo.on('select', function (combo, record) {
            var title = Philosophy.Globalization.For('Draw coordinate') + ' [EPSG: ' + record.data.value + ']';
            _this.setTitle(title);
        });

        this.markerCombo = new Phi.view.comboBox.Marker();

        this.inputX = new Ext.form.NumberField({ fieldLabel: 'X' });
        this.inputY = new Ext.form.NumberField({ fieldLabel: 'Y' });

        // Optional Input.
        this.markerTitle = new Ext.form.TextField({ fieldLabel: Philosophy.Globalization.For('Title') });
        this.markerDesc = new Ext.form.TextField({ fieldLabel: Philosophy.Globalization.For('Description') });

        this.form = new Ext.FormPanel({
            labelWidth: 75,
            frame: true,
            title: '',
            bodyStyle: 'padding:5px 5px 5px 5px',
            width: 340,
            items: [{
                        xtype: 'fieldset',
                        title: Philosophy.Globalization.For('Coordinate Information'),
                        autoHeight: true,
                        defaults: { anchor: '95%', allowBlank: false },
                        items: [this.inputX, this.inputY]
                    }
                    ,
                    {
                        xtype: 'fieldset',
                        title: Philosophy.Globalization.For('Optional Data'),
                        collapsible: true,
                        collapsed: true,
                        autoHeight: true,
                        defaults: { anchor: '95%', allowBlank: true },
                        items: [this.projCombo, this.markerCombo, this.markerTitle, this.markerDesc]
                    } ]
        });

        this.items = [this.form];
        Phi.view.window.drawXY.superclass.initComponent.call(this);
        this.addButton(Philosophy.Globalization.For('Close'), function () { _this.close(); });
        this.addButton(Philosophy.Globalization.For('Submit'), function () { _this.drawMarker(); });
    }
    ,
    show: function () {
        Phi.view.window.drawXY.superclass.show.call(this);
        this.align();
        this.getEl().fadeIn({ duration: 1 });
    }
    ,
    align: function (c) {
        c = c || Ext.get("map");
        this.alignTo(c, 't-t?', [-3, 3]);
    }
    ,
    close: function () {
        Philosophy.mapQuickToolBar.bp.pan.toggle(true);
        Phi.view.window.drawXY.superclass.close.call(this);
    }
    ,
    drawMarker: function () {

        if (this.form.getForm().isValid()) {

            var proj = this.projCombo.getValue();
            var markerId = this.markerCombo.getValue();
            var x = this.inputX.getValue();
            var y = this.inputY.getValue();
            var z = 12;
            var markerTitle = this.markerTitle.getValue();
            var markerDesc = this.markerDesc.getValue();

            if (proj != 'WSM') {
                var lonLat = Philosophy.Map.transformPoint(x, y, 'EPSG:' + proj, 'EPSG:900913');
                x = lonLat.lon;
                y = lonLat.lat;
            }

            Philosophy.Marker.drawMarker(x, y, markerId, null, markerTitle, markerDesc);
            Philosophy.Map.setCenter({ lon: x, lat: y, zoom: z });
        }
    }
});       // eo Phi.view.window.drawXY
// eof
