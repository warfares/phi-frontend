Ext.ns("Phi.view.form");
/**
* @class Philosophy.view.form.SearchWorkspace
* 
* Form for search workspaces  
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.form.SearchWorkspace = Ext.extend(Ext.form.FormPanel, {
	labelWidth: 75,
	frame: true,
	title: '',
	bodyStyle: 'padding:5px 5px 5px 5px',
	labelAlign: 'top',
	border:'fit',
	width: 250,

	initComponent: function () {

		this.patternField = new Ext.form.TextField({
			fieldLabel: Phi.Global.For('Name'),
			name: 'pattern',
			width:110
		});

		this.comboPosition = new Phi.view.comboBox.Pattern();

		var cLayO1 = {
			layout: 'column',
			border: false,
			items: [{
				columnWidth: 0.55,
				layout: 'form',
				border: false,
				items: [this.patternField]
			}
			,
			{
				columnWidth: 0.45,
				layout: 'form',
				border: false,
				items: [this.comboPosition]
			}]
		};

		var fs = new Ext.form.FieldSet({
			title: Phi.Global.For('Search params'),
			autoHeight: true,
			layout: 'form',           
			labelAlign: 'top',
			region: 'center',
			items: [cLayO1]
		});

		//Other Parameteres

		this.userPattern = new Ext.form.TextField({
			fieldLabel: Phi.Global.For('User'),
			name: 'pattern',
			width: 110
		});

		this.userPosition = new Phi.view.comboBox.Pattern();

		var cLayO2 = {
			layout: 'column',
			border: false,
			items: [{
				columnWidth: 0.55,
				layout: 'form',
				border: false,
				items: [this.userPattern]
			}
			,
			{
				columnWidth: 0.45,
				layout: 'form',
				border: false,
				items: [this.userPosition]
			}]
		};
		
		var fsOthers = new Ext.form.FieldSet({
			title: Phi.Global.For('Others parameters'),
			collapsible: true,
			collapsed: true,
			autoHeight: true,
			hidden:false,
			layout: 'form',           
			labelAlign: 'top',
			items: [cLayO2]
		});

		this.items = [fs, fsOthers];

		Phi.view.form.SearchWorkspace.superclass.initComponent.call(this);
	}
	,
	getParams: function () {
		var namePattern = this.patternField.getValue();
		var namePosition = this.comboPosition.getValue();

		var userPattern = this.userPattern.getValue();
		var userPosition = this.userPosition.getValue();

		var params = {
			namePattern: namePattern,
			namePosition: namePosition,
			userPattern: userPattern,
			userPosition: userPosition
		};

		return params;
	}
});   // eo Phi.view.form.SearchWorkspace
// eof