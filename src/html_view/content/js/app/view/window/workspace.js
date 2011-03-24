Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.FormWorkSpace
* @extends Ext.Window
* 
* Philosophy workspace detail, widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.Workspace = Ext.extend(Ext.Window, {
	title: Phi.Global.For('WorkSpace Detail'),
	width: 400,
	height: 270,
	closeAction: 'close',
	maximizable: false,
	modal: true,
	plain: true,
	layout: 'border',
	create: true, // used for create or update instance.
	readOnly: false, // just for read only instance.

	initComponent: function () {
		var _this = this;
		
		this.formPanel = new Ext.FormPanel({
			defaultType: 'textfield',
			frame: true,
			bodyStyle: 'padding:5px 15px 0',
			region: 'center',
			margins: '5 5 5 0',
			layout: 'fit',
			labelWidth: 150,
			defaults: { width: 180 },
			items: [
			{
				xtype: 'fieldset',
				title: Phi.Global.For('Description'),
				autoHeight: true,
				autoWidth: true,
				labelWidth: 150,
				defaults: { width: 150 },
				defaultType: 'textfield',
				items: [
				{
					name: 'id',
					hidden: true,
					hideLabel: true,
					value: 0
				}
				,
				{
					name: 'name',
					fieldLabel: Phi.Global.For('Name'),
					allowBlank: false,
					emptyText: Phi.Global.For('Field Required'),
					readOnly: _this.readOnly
				}
				,
				{
					name: 'description',
					fieldLabel: Phi.Global.For('Description'),
					xtype: 'textarea',
					maxLength: 200,
					maxLengthText: Phi.Global.For('Only 200 characters'),
					emptyText: Phi.Global.For('Field Required'),
					readOnly: _this.readOnly
				}
				]
			}
			]
		});

		this.items = [this.formPanel];
		Phi.view.window.Workspace.superclass.initComponent.call(this);
		
		this.addButton(Phi.Global.For('Cancel'), this.close, this);
		
		if(!_this.readOnly)
			this.addButton(Phi.Global.For('Submit'), this.createEntity, this);
	}
	,
	readEntity: function (id) {
		var ws = new Phi.model.Workspace();
		ws.on('read', function (values) {
			this.formPanel.form.setValues(values);
		}, this)
		ws.read(id);
	}
	,
	createEntity: function () {

		var center = Phi.Map.map.getCenter();
		var point = {
			x: center.lon,
			y: center.lat,
			z: Phi.Map.map.getZoom()
		};

		var vo = this.formPanel.form.getValues(false);
		vo.point = point;
		vo.layers = Phi.Layer.getLayerIdString();
		vo.overlays = Phi.panelLayer.treeRaster.getLayersString();
		vo.baselayer = Phi.mainToolbar.baseLayerCombo.getValue();

		if (this.formPanel.form.isValid()) {
			if (this.create) {
				vo.userName = Phi.Session.getUser();
				var ws = new Phi.model.Workspace();
				ws.on('create', this.success, this);
				ws.create(vo);
			}
			else {
				var ws = new Phi.model.Workspace();
				ws.on('update', this.success, this);
				ws.update(vo);
			}
		}
		else 
			Ext.MessageBox.alert(Phi.Global.For('Warning'), Phi.Global.For('Check form'));
	}
	,
	success: function () {
		var p = Phi.panelWorkSpace;
		p.reload();
		this.close();
	}
});// eo Phi.view.window.FormWorkspace
// eof