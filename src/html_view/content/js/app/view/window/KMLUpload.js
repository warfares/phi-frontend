Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.KMLUpload
* @extends Ext.Window
* 
* Philosophy KML upload, widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.KMLUpload = Ext.extend(Ext.Window, {
	title: Philosophy.Globalization.For('KML Upload'),
	width: 400,
	height: 300,
	closeAction: 'close',
	maximizable: false,
	modal: false,
	plain: true,
	layout: 'border',
	initComponent: function() {
		var _this = this;

		this.fuField = new Ext.ux.form.FileUploadField({
			xtype: 'fileuploadfield',
			id: 'file',
			emptyText: Philosophy.Globalization.For('Select an File'),
			fieldLabel: Philosophy.Globalization.For('File')+ ' <b>(kml)</b>',
			name: Philosophy.Globalization.For('file'),
			buttonText: '',
			buttonCfg: { iconCls: 'upload-icon' }
		});

		this.fp = new Ext.FormPanel({
			fileUpload: true,
			region: 'center',
			labelAlign: 'top',
			width: 500,
			frame: true,
			bodyStyle: 'padding: 10px 10px 0 10px;',
			labelWidth: 50,
			defaults: { anchor: '95%', allowBlank: false, msgTarget: 'side' },
			items: [this.fuField]
		});
		this.items = [this.fp];

		// just a trick for post only stream (WCF restriction)
		this.fp.on('beforeaction', function(form, action) {
			if (action.type == 'submit') {
				Ext.Ajax.StreamResponse = false;
			}
		});

		Phi.view.window.KMLUpload.superclass.initComponent.call(this);

		this.addButton(Philosophy.Globalization.For('Close'), this.close);
		this.addButton(Philosophy.Globalization.For('Upload'), this.upload);
	}
	,
	upload: function() {
		var _this = this;
		if (this.fp.getForm().isValid() && this.validate()) {
			this.fp.getForm().submit({
				url: Philosophy.UriTemplate.getUri('utilService', 'utilProxyTextFile'),
				waitTitle: Philosophy.Globalization.For('Wait...'),
				waitMsg: Philosophy.Globalization.For('Uploading your file...'),
				success: function(fp, o) {
					_this.addKMLLayer(o);
				},
				failure: function(fp, o) {
					var errorMsg = o.result.errorMsg;
					Ext.MessageBox.alert(Philosophy.Globalization.For('Warning'), errorMsg);
				}
			});
		}
	}
	,
	addKMLLayer: function(o) {
		var _this = this;
		var filename = o.result.targetFilename;
		var desc = o.result.sourceFilename;

		var url = Philosophy.Config.kmlFileUrl + filename;

		var kml = new OpenLayers.Layer.GML(desc, url, {
			format: OpenLayers.Format.KML,
			projection: new OpenLayers.Projection("EPSG:4326"),
			eventListeners: {
				'featuresadded': _this.zoomToDataExtent
			},
			formatOptions: {
				extractStyles: true,
				extractAttributes: true
			}
		});
		Philosophy.Map.map.addLayer(kml);
		Philosophy.panelLayer.treeOverlay.addLayer(kml);        
	}
	,
	zoomToDataExtent: function(o) {
		var maxExtent = null;
		var features = o.features;

		if (features && (features.length > 0)) {
			maxExtent = new OpenLayers.Bounds();
			for (var i = 0, len = features.length; i < len; i++) {
				maxExtent.extend(features[i].geometry.getBounds());
			}
		}
		Philosophy.Map.zoomToExtent(maxExtent, true);
	}
	,
	validate: function() {
		var file = this.getFileDetails();
		var errorMsg = Philosophy.Globalization.For('The file <b>') + file.name + Philosophy.Globalization.For('</b> must be <b>kml</b>');

		if (!file.ext) {
			Ext.MessageBox.alert(Philosophy.Globalization.For('Warning'), errorMsg);
			return false
		}

		if (file.type === "KML")
			return true
		else {
			Ext.MessageBox.alert(Philosophy.Globalization.For('Warning'), errorMsg);
			return false
		}
		return false
	}
	,
	getFileDetails: function() {
		var fileName = this.fuField.getValue();
		var f = fileName.split('.');
		var len = f.length;
		var ext = (len == 1) ? false : true;

		var file = {
			name: fileName,
			type: f[len - 1].toUpperCase(),
			ext: ext
		}
		return file;
	}
});   // eo Phi.view.window.KMLUpload
// eof