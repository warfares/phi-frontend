Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.SQLDescription
* @extends Ext.Window
* 
* Philosophy sql description, widget
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.SQLDescription = Ext.extend(Ext.Window, {	
	title:'SQL Description',
	width: 400,
	height:300,
	closeAction: 'close',
	maximizable: false,
	layout:'border',
	modal:true,
	query: null,
	initComponent: function() {

		var textQueryDesc = new Ext.ux.form.StaticTextField({
			anchor: '100%',
			height: 180,
			readOnly: true
		});
		
		var form = new Ext.FormPanel({
			labelAlign: 'top',
			region: 'center',
			bodyStyle: 'padding:5px',
			width: 400,
			frame:true,
			items: [textQueryDesc]
		});

		this.items = [form];

		Phi.view.window.SQLDescription.superclass.initComponent.call(this);
		this.addButton(Phi.Globalization.For('Close'), this.close, this);

		this.on('show', function(){ textQueryDesc.setRawValue(this.renderSQL());},this);
	}
	,
	renderSQL:function(){
		var setTextColor = function (t, c) {
			return '<span style="color:' + c + ';">' + t + '</span>';
		};

		var query = Phi.Util.clone(this.query);

		var sql = setTextColor('SELECT ','blue');
		sql += setTextColor(query.fields,'gray');
		sql += '<br/>';
		sql += setTextColor('FROM ','blue');
		sql += setTextColor(query.layerName,'gray');
		sql += '<br/>';

		if (query.criteria){
				sql += setTextColor('WHERE ','blue');
				Ext.each(query.criteria, function(c){
					Ext.each(c.entryValues,function(v,i){
						var color = c.columnDataType === 'number' ? 'orange' : 'green';
						c.operatorTemplate = c.operatorTemplate.replace('{'+ i +'}', setTextColor(v,color));
					});
					sql += setTextColor(c.andOr,'blue') + ' ';
					sql += setTextColor(c.columnName,'gray') + ' ';
					sql += setTextColor(c.operatorTemplate,'blue');
					sql += '<br/>';
				});
		};
		return sql;
	}
}); // eo Phi.view.window.SQLDescription
// eof