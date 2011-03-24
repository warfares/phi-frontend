Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.Location 
* @extends Ext.Window
* 
* Philosophy location detail, widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.Location = Ext.extend(Ext.Window, {
	title: Phi.Global.For('Location Detail'),
	width: 400,
	height: 400,
	closeAction: 'close',
	maximizable: false,
	modal: true,
	plain: true,
	layout: 'border',
	create: true, // used for create or update instance.
	opener: null, //used for know the opener
	point: null,
	marker: null,

	initComponent: function () {
		this.form = new Ext.FormPanel({
			labelWidth: 150,
			defaults: { width: 180 },
			defaultType: 'textfield',
			frame: true,
			bodyStyle: 'padding:5px 15px 0',
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
					emptyText: Phi.Global.For('Field Required')
				}
				,
				{
					name: 'description',
					fieldLabel: Phi.Global.For('Description'),
					xtype: 'textarea',
					maxLength: 200,
					maxLengthText: Phi.Global.For('Only 200 characters'),
					emptyText: Phi.Global.For('Field Required')
				}
				]
			}
			]
		});

		this.form.addButton(Phi.Global.For('Submit'), this.createOrUpdate, this);
		this.form.addButton(Phi.Global.For('Cancel'), function () {
			this.close();
			if (this.create)
				Phi.Map.markerLayer.removeMarker(this.marker);
		}, this);

		var panel = new Ext.Panel({
			region: 'center',
			margins: '5 5 5 0',
			layout: 'fit',
			items: this.form
		});

		this.items = [panel];
		Phi.view.window.Location.superclass.initComponent.call(this);
	}
	,
	read: function (id) {
		var option = id + '/json';
		var location = new Phi.model.Location();
		location.on('read', function (o) {
			this.form.form.setValues(o);
		}, this);
		location.read(id);
	}
	,
	createOrUpdate: function () {
		var vo = this.form.form.getValues(false);
		vo.favorite = false;
		vo.userName = Phi.Session.getUser();

		var location = new Phi.model.Location();

		if (this.form.form.isValid()) {
			if (this.create) {
				vo.point = {
					x:this.point.Lon,
					y:this.point.Lat
				};
				location.on('create', function () {
					Phi.Map.markerLayer.removeMarker(this.marker);
					Phi.Marker.drawMarker(vo.point.x, vo.point.y, null, null, vo.name, vo.description);
					this.success()                
					}, this);
				location.create(vo);
			}
			else {
				location.on('update', this.success, this);
				location.update(vo);
			}
		}
		else
		Ext.MessageBox.alert(Phi.Global.For('Warning'), Phi.Global.For('Check form'));
	}
	,
	success: function () {
		Phi.panelLocation.reload();
		this.close();
	}
}); // eo Phi.view.window.Location
// eof