Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.DrawCoordinate 
* @extends Ext.Window
* 
* Philosophy upload 'coordinate file' in different formats(csv, txt, xls, etc) and draw on map, widget 
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.DrawCoordinate = Ext.extend(Ext.Window, {
	title: Phi.Global.For('Draw Coordinates'),
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
			emptyText: Phi.Global.For('Select an File'),
			fieldLabel: Phi.Global.For('File') + ' <b>(csv,txt,xls,xlsx)</b>',
			name: 'file',
			buttonText: '',
			buttonCfg: { iconCls: 'upload-icon' }
		});

		this.projCombo = new Phi.view.comboBox.Projection({ fieldLabel: Phi.Global.For('Projection Source') });
		this.markCombo = new Phi.view.comboBox.Marker();

		this.fp = new Ext.FormPanel({
			fileUpload: true,
			region: 'center',
			labelAlign: 'top',
			width: 500,
			frame: true,
			bodyStyle: 'padding: 10px 10px 0 10px;',
			labelWidth: 50,
			defaults: { anchor: '95%', allowBlank: false, msgTarget: 'side' },
			items: [this.fuField, this.projCombo, this.markCombo]
		});
		this.items = [this.fp];
		
		// just a trick for post only stream (WCF restriction)
		this.fp.on('beforeaction', function(form, action) {
			if (action.type == 'submit') {
				Ext.Ajax.StreamResponse = false;
				_this.projCombo.disable();
				_this.markCombo.disable();
			}
		});
		
		this.fp.on('actioncomplete', function(form, action) {
			if (action.type == 'submit') {
				_this.projCombo.enable();
				_this.markCombo.enable();
			}
		});

		this.fp.on('actionfailed', function(form, action) {
			if (action.type == 'submit') {
				_this.projCombo.enable();
				_this.markCombo.enable();
			}
		});

		Phi.view.window.DrawCoordinate.superclass.initComponent.call(this);

		this.addButton(Phi.Global.For('Close'), this.close, this);
		this.addButton(Phi.Global.For('Upload'), function() {
			Philosophy.Map.clearAllMarkers();
			this.upload();
			}, this);
		}
		,
		upload: function() {
			var _this = this;
			if (this.fp.getForm().isValid() && this.validate()) {

				var q = {
					SRID: this.projCombo.getValue(),
					type: this.getFileDetails().type
				}
				var queryString = Ext.urlEncode(q);

				this.fp.getForm().submit({
					url: Phi.UriTemplate.getUri('utilParseFile', '?' + queryString),
					waitTitle: Phi.Global.For('Wait...'),
					waitMsg: Phi.Global.For('Uploading your file...'),
					success: function(fp, o) {
						Ext.MessageBox.show({
							maximizable: false,
							closable: false,
							resizable: false,
							title: '',
							msg: _this.buildSuccessMsg(o.result),
							width: 300,
							buttons: Ext.MessageBox.OK
						});
						_this.draw(o.result);
						_this.close();

					},
					failure: function(fp, o) {
						var errorMsg = o.result.errorMsg;
						Ext.MessageBox.alert(Phi.Global.For('Warning'), errorMsg);

					}
				});
			}
	}
	,
	draw: function(response, marker) {
		var markers = response.markers;
		var bbox = response.bbox;
		var markerId = this.markCombo.getValue();
		var fileName = this.fuField.getValue();

		if (Philosophy.Map.map.getLayersByName(fileName).length != 0) {
			Ext.Msg.alert(Phi.Global.For('Error'), Phi.Global.For('A file with the same name is already uploaded'));
		} else {
			var markerLayer = new OpenLayers.Layer.Markers(this.getFileDetails().name, { projection: Philosophy.Map.map.displayProjection });
			Philosophy.Map.map.addLayer(markerLayer);
			for (i = 0; i < markers.length; i++) {
				Philosophy.Marker.drawMarker(markers[i].Point.X, markers[i].Point.Y, markerId, markers[i].Data, fileName,null, markerLayer);   
			}
			Philosophy.panelLayer.treeOverlay.addLayer(markerLayer);

			var bound = new OpenLayers.Bounds(bbox.minx, bbox.miny, bbox.maxx, bbox.maxy);
			Philosophy.Map.zoomToExtent(bound, true);
		}
	}
	,
	buildSuccessMsg: function(response) {

		var file = this.getFileDetails().name;
		var type = response.type;
		var totalPoints = response.markers.length;

		var html = '<div class="main_container">';
		html += "<b>"
		html += Phi.Global.For('File successfully processed');
		html += "</b>&nbsp;<img src='content/images/icons/tick.png'/><br/><br/>";
		html += "<table>";
		html += "    <tr><td width='100'><b>" + Phi.Global.For('File') + "</b></td><td>" + file + "</td></tr>";
		html += "    <tr><td><b>" + Phi.Global.For('Type') + "</b></td><td>" + type + "</td></tr>";
		html += "    <tr><td><b>" + Phi.Global.For('Points') + "</b></td><td>" + totalPoints + "</td></tr>";
		html += "</table>";
		html += '</div>';
		return html;
	}
	,
	validate: function() {

		var file = this.getFileDetails();
		var errorMsg = Phi.Global.For('The file <b>') + file.name + Phi.Global.For('</b>: must be <b>txt, xls, xslx</b>');

		if (!file.ext) {
			Ext.MessageBox.alert(Phi.Global.For('Warning'), errorMsg);
			return false
		}

		if (file.type == "TXT" || file.type == "XLS" || file.type == "XLSX" || file.type == "CSV")
			return true
		else {
			Ext.MessageBox.alert(Phi.Global.For('Warning'), errorMsg);
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
});                                     // eo Phi.view.window.Legend
// eof