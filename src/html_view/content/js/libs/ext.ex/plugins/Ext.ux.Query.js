/**
 * @class Ext.ux.QueryBuilder
 * @extends Ext.BoxComponent
 *
 * Enable SQL WHERE clause generation
 *
 * @author    Ing. Leonardo D'Onofrio
 * @version   1.0
 * @date      September 2010
**/
Ext.ns('Ext.ux');


Ext.ux.QueryBuilder = Ext.extend(Ext.BoxComponent, {
	constructor: function(config){
		config = config || {};
		Ext.ux.QueryBuilder.superclass.constructor.call(this, config);
	}
	,
	initComponent: function(){
		this.fields = this.fields || [];
		this.searchFields = [];
		
		Ext.each(this.fields, function(item){
			this.searchFields.push([item.id, item.text, item.type]);
		}, this);
		
		this.sqlOperators = [
			['equals', '= {0}'],
			['not equal', '<> {0}'],
			['greater than', '> {0}'],
			['greater than or equals ', '>= {0}'],
			['less than', '< {0}'],
			['less than or equals', '<= {0}'],
			['in', 'in ({0})'],
			['between', "BETWEEN {0} AND {1}"]
		];
		
		this.sqlBooleanOperators = [
			['is', '= {0}']
		];
		
		this.sqlListOperators = [
			['is', "= '{0}'"]
		];
		
		this.sqlStringOperators = [
			['equals', "= '{0}'"],
			['not equal', "<> '{0}'"],
			['begins with', "LIKE '{0}%'"],
			['ends with', "LIKE '%{0}'"],
			['contains', "LIKE '%{0}%'"],
			['in', 'in ({0})']
		];
		
		this.sqlDateOperators = [
			['on', "= '{0}'"],
			['not on', "<> '{0}'"],
			['after', "> '{0}'"],
			['on or after', ">= '{0}'"],
			['before ', "< '{0}'"],
			['on or before', "<= '{0}'"],
			['between', "BETWEEN '{0}' AND '{1}'"]
		];
		
		this.autoKey = 0;
		
		this.rowStates = [{	
			rowID: 1, 
			andOr: '', 
			columnName: '', 
			columnAlias: '', 
			columnDataType: '', 
			operatorText: '', 
			operatorTemplate: '', 
			entryValues: []
		}];
		
		this.rowTemplate = new Ext.Template(
			'<tr id="row{rowID}" valign="top">',
			'<td width=25>',
			'<div style="display:inline;width:30px" id="removeBox{rowID}"></div>',
			'</td>',
			'<td width=30>',
			'<div style="display:inline" id="andOr{rowID}"></div>',
			'</td>',
			'<td width=135>',
			'<div style="display:inline" id="fieldNameBox{rowID}">',
			'</div>',
			'</td>',
			'<td width=140>',
			'<div style="display:inline" id="operatorBox{rowID}">',
			'</div>',
			'</td width=140>',
			'<td>',
			'<div id="valueBox{rowID}" style="display:inline">',
			'</div>',
			'</td>',
			'</tr>'
		);
		this.betweenBoxTemplate = new Ext.Template(
			'<table cellspacing="0" id="betweenBox{rowID}">',
			'<tr>',
			'<td>',
			'<div style="display:inline" id="betweenValueBox1_{rowID}">',
			'</div>',
			'</td>',
			'</tr>',
			'<tr>',
			'<td>',
			'<div><span>&nbsp;{betweenText}&nbsp;</span></div>',
			'</td>',
			'</tr>',
			'<tr>',
			'<td>',
			'<div id="betweenValueBox2_{rowID}" style="display:inline">',
			'</div>',
			'</td>',
			'</tr>',
			'</table>'
		);
		Ext.ux.QueryBuilder.superclass.initComponent.apply(this, arguments);
	}
	,
	onRender: function(){
		Ext.ux.QueryBuilder.superclass.onRender.apply(this, arguments);
		var tpl =  '<div>'
		+ '<table cellspacing="3">'
		+ '<tbody id="container' + this.id + '">'
		+ '</tbody>'
		+ '</table>'
		'</div>';
		this.el.insertHtml('afterBegin', tpl);
		this.containerEl = Ext.get('container' + this.id);
		this.rowTemplate.compile();
		this.betweenBoxTemplate.compile();
		this.addNewRow();
		if (this.value) {
			this.setValue(this.value);
		}
	}
	,
	onDestroy: function(){
		while(this.rowStates[0]) {
			this.removeRow(this.rowStates[0].rowID);
		}
		this.containerEl.remove();
		Ext.ux.QueryBuilder.superclass.onDestroy.apply(this, arguments);
	}
	,
	getFieldConfig: function(id){
		var config;
		Ext.each(this.fields, function(item, index){
			if (item.id == id) {
				config = item.config;
			}
		}, this);
			
		config = config || {};
		return config;
	}
	,
	loadSqlOperator: function(dataType, store){
		switch(dataType){
			case 'boolean':
			store.loadData(this.sqlBooleanOperators);
			break;
			case 'list':
			store.loadData(this.sqlListOperators);
			break;
			case 'date':
			store.loadData(this.sqlDateOperators);
			break;
			case 'string':
			store.loadData(this.sqlStringOperators);
			break;
			default:
			store.loadData(this.sqlOperators);
			break;
		}
	}
	,
	isNumeric: function(txt) {
		var regexp = /^-{0,1}\d*\.{0,1}\d+$/;
		return regexp.test(txt);
	}
	,
	getNewKey: function(){
		this.autoKey++;
		return this.autoKey;
	}
	,
	getRowStateIndex: function(rowID){
		var rowStateIndex = -1;
		for(var i = 0; i <= this.rowStates.length; i++){
			if(this.rowStates[i].rowID == rowID){
				rowStateIndex = i;
				break;
			}
		}
		return rowStateIndex;
	}
	,
	setRowStateValue: function(rowID, entryValues){
		var indx = this.getRowStateIndex(rowID);
		if(rowID > 1){
			this.rowStates[indx].andOr = Ext.getCmp('andOrCombo' + rowID).getValue();
		}
		this.rowStates[indx].entryValues = entryValues;
	}
	,
	addNewEntryField: function(dataType, rowID, config){ //Adds a single entry field
		switch(dataType){
			case 'number':
			new Ext.form.NumberField(Ext.apply(config, {
				id: 'searchValueTextField' + rowID,
				width: 125,
				renderTo: 'valueBox' + rowID,
				listeners:{
					blur: function(field){
						var rowID = field.id.replace('searchValueTextField', '');
						this.setRowStateValue(rowID, [Ext.getCmp('searchValueTextField' + rowID).getValue()]);
					},
					scope: this
				},
				allowBlank: false,
				emptyText: 'Enter number...',
				submitValue: false
			}));
			break;
			case 'date':
			new Ext.form.DateField(Ext.apply(config, {
				id: 'searchValueTextField' + rowID,
				width: 125,
				renderTo: 'valueBox' + rowID,
				listeners:{
					blur: function(field){
						var rowID = field.id.replace('searchValueTextField', '');
						this.setRowStateValue(rowID, [Ext.getCmp('searchValueTextField' + rowID).getRawValue()]);
					},
					scope: this
				},
				allowBlank: false,
				emptyText: '[Select date]',
				editable: false,
				submitValue: false
			}));
			break;
			case 'boolean':
			new Ext.form.ComboBox(Ext.apply(config, {
				id: 'searchValueTextField' + rowID,
				allowBlank: false,
				emptyText: '[Select true or false]',
				store: new Ext.data.SimpleStore({
					autoDestroy: true,
					fields: [
					{name: 'txt'},
					{name: 'val'}
					],
					data: [['True','1'], ['False', '0']]
					}),
					displayField: 'txt',
					valueField: 'val',
					typeAhead: true,
					width: 125,
					mode: 'local',
					forceSelection: true,
					triggerAction: 'all',
					selectOnFocus: true,
					editable: false,
					submitValue: false,
					listeners:{
						blur: function(field){
							var rowID = field.id.replace('searchValueTextField', '');
							this.setRowStateValue(rowID, [Ext.getCmp('searchValueTextField' + rowID).getValue()]);
						},
						scope: this
					},
					renderTo: 'valueBox' + rowID
					}));
					break;
			case 'list':
			new Ext.form.ComboBox(Ext.apply(config, {
				id: 'searchValueTextField' + rowID,
				allowBlank: false,
				emptyText: '[Select value]',
				typeAhead: true,
				width: 125,
				mode: 'local',
				forceSelection: true,
				triggerAction: 'all',
				selectOnFocus: true,
				editable: false,
				submitValue: false,
				listeners:{
      blur: function(field){
       var rowID = field.id.replace('searchValueTextField', '');
       this.setRowStateValue(rowID, [Ext.getCmp('searchValueTextField' + rowID).getValue()]);
      },
      scope: this
     },
     renderTo: 'valueBox' + rowID
    }));
    break;
   default:
    new Ext.form.TextField(Ext.apply(config, {
     id:'searchValueTextField' + rowID,
     allowBlank: false,
     emptyText: 'Enter text...',
     submitValue: false,
     width: 125,
     listeners:{
      blur: function(field){
       var rowID = field.id.replace('searchValueTextField', '');
       this.setRowStateValue(rowID, [Ext.getCmp('searchValueTextField' + rowID).getValue()]);
      },
      scope: this
     },
     renderTo: 'valueBox' + rowID
    }));
    break;
  }
 }
 ,
 //Adds two entry fields
 addNewEntryField2: function(dataType, rowID, betweenText, config){ 
  this.betweenBoxTemplate.append('valueBox' + rowID, {'rowID': rowID, 'betweenText': betweenText});
  switch(dataType){
   case 'number':
    new Ext.form.NumberField(Ext.apply(config, {
     id: 'searchValueTextField1_' + rowID,
     width: 125,
     allowBlank: false,
     emptyText: 'Enter from number...',
     submitValue: false,
     renderTo: 'betweenValueBox1_' + rowID
    }));
    new Ext.form.NumberField(Ext.apply(config, {
     id: 'searchValueTextField2_' + rowID,
     width: 125,
     allowBlank: false,
     emptyText: 'Enter to number...',
     submitValue: false,
     listeners:{
      blur: function(field){
       var rowID = field.id.replace('searchValueTextField2_', '');
       this.setRowStateValue(rowID, [Ext.getCmp('searchValueTextField1_' + rowID).getValue(), Ext.getCmp('searchValueTextField2_' + rowID).getValue()]);
      },
      scope: this
     },
     renderTo: 'betweenValueBox2_' + rowID
    }));
    break;
   case 'date':
    new Ext.form.DateField(Ext.apply(config, {
     id: 'searchValueTextField1_' + rowID,
     width: 125,
     allowBlank: false,
     emptyText: '[Select from date]',
     editable: false,
     submitValue: false,
     renderTo: 'betweenValueBox1_' + rowID
    }));
    new Ext.form.DateField(Ext.apply(config, {
     id: 'searchValueTextField2_' + rowID,
     width: 125,
     allowBlank: false,
     emptyText: '[Select to date]',
     editable: false,
     submitValue: false,
     listeners:{
      blur: function(field){
       var rowID = field.id.replace('searchValueTextField2_', '');
       this.setRowStateValue(rowID, [Ext.getCmp('searchValueTextField1_' + rowID).getRawValue(), Ext.getCmp('searchValueTextField2_' + rowID).getRawValue()]);
      },
      scope: this
     },
     renderTo: 'betweenValueBox2_' + rowID
    }));
    break;
   default:
    new Ext.form.TextField(Ext.apply(config, {
     id: 'searchValueTextField1_' + rowID,
     width: 125,
     allowBlank: false,
     emptyText: 'Enter from text...',
     submitValue: false,
     renderTo: 'betweenValueBox1_' + rowID
    }));
    new Ext.form.TextField(Ext.apply(config, {
     id: 'searchValueTextField2_'+ rowID,
     width: 125,
     allowBlank: false,
     emptyText: 'Enter to text...',
     submitValue: false,
     listeners:{
      blur: function(field){
       var rowID = this.id.replace('searchValueTextField2_', '');
       this.setRowStateValue(rowID, [Ext.getCmp('searchValueTextField1_' + rowID).getValue(), Ext.getCmp('searchValueTextField2_' + rowID).getValue()]);
      },
      scope: this
     },
     renderTo: 'betweenValueBox2_' + rowID
    }));
    break;
  }
 }
	,
	addNewRow: function(){
		var _this = this;
		this.getNewKey();
		if(this.autoKey != 1){
			var r = {
				rowID: this.autoKey, 
				andOr: '', 
				columnName: '', 
				columnAlias: '', 
				columnDataType: '', 
				operatorText: '', 
				operatorTemplate: ''
			};
			this.rowStates.push(r);
		}
		
		this.rowTemplate.append(this.containerEl, {rowID: this.autoKey});
		//var addIconCls = (this.addIconCls || 'add');
		//var removeIconCls = (this.removeIconCls || 'remove');
		
		if(this.autoKey == 1){

			new Ext.Button({
				id: 'addRowButton' + this.autoKey,
				iconCls: this.addIconCls,
				tooltip: 'Add new condition',
				renderTo: 'removeBox' + this.autoKey,
				handler: function(){
					this.addNewRow();
				},
				scope: this
			});
			Ext.fly('andOr' + this.autoKey).insertHtml('afterBegin', '<div style="width: 50px">&nbsp;</div>');
		} else {
			new Ext.Button({
				id: 'removeRowButton' + this.autoKey,
				iconCls: this.removeIconCls,
				tooltip: 'Delete this condition',
				renderTo: 'removeBox' + this.autoKey,
				handler: function(btn, e){
					var rowID = btn.id.replace('removeRowButton', '');
					this.removeRow(rowID);
				},
				scope: this
			});
			new Ext.form.ComboBox({
				id: 'andOrCombo'+ this.autoKey,
				store: new Ext.data.SimpleStore({
					autoDestroy: true,
					fields: [{name: 'val'}],
					data: [['AND'], ['OR']]
					}),
					displayField: 'val',
					valueField: 'val',
					typeAhead: true,
					width: 50,
					mode: 'local',
					forceSelection: true,
					triggerAction: 'all',
					value: 'AND',
					selectOnFocus: true,
					editable: false,
					submitValue: false,
					renderTo: 'andOr' + this.autoKey,
					scope: this,
					listeners: {
						select: function(field){
							var rowID = field.id.replace('andOrCombo', '');
							var indx = _this.getRowStateIndex(rowID);
							_this.rowStates[indx].andOr = field.getValue();
						}
					}
			});
		}
		
		new Ext.form.ComboBox({
			id: 'fieldNameCombo' + this.autoKey,
			store: new Ext.data.SimpleStore({
				idIndex: 0,
				fields: [
				{name: 'columnName', type: 'string'},
				{name: 'columnAlias', type: 'string'},
				{name: 'dataType'}
				],
				data: this.searchFields
		}),
		displayField: 'columnAlias',
		allowBlank: false,
		valueField: 'columnName',
		typeAhead: true,
		width: 130,
		mode: 'local',
		forceSelection: true,
		triggerAction: 'all',
		emptyText: '[Select variable]',
		selectOnFocus: true,
		editable: false,
		submitValue: false,
   listeners:{
	select: function(field){
		var rowID = field.id.replace('fieldNameCombo', '');
		var indx = this.getRowStateIndex(rowID);
		this.rowStates[indx].columnName = field.getValue();
		this.rowStates[indx].columnAlias = field.store.getById(field.getValue()).get('columnAlias');
		this.rowStates[indx].columnDataType = field.store.getById(field.getValue()).get('dataType');
		var datatype = field.store.getById(field.getValue()).get('dataType');
		var opCombo = Ext.getCmp('operatorsCombo' + rowID);
		opCombo.clearValue();
		this.loadSqlOperator(datatype, opCombo.store);
     switch (datatype) {
      case 'string':
       opCombo.setValue("= '{0}'");
       break;
      case 'number':
      case 'croptype':
       opCombo.setValue('= {0}');
       break;
      case 'date':
       opCombo.setValue("= '{0}'");
       break;
      case 'list':
       opCombo.setValue("= '{0}'");
       break;
      case 'boolean':
      default:
       opCombo.setValue("= {0}");
       break;
     }
     opCombo.fireEvent('select', opCombo);
    },
    scope: this
   },
   renderTo: 'fieldNameBox' + this.autoKey
  });
  new Ext.form.ComboBox({
   id: 'operatorsCombo' + this.autoKey,
   store: new Ext.data.SimpleStore({
    fields: [
     {name: 'txt', type:'string'},
     {name: 'val'}
    ],
    data: this.sqlOperators
   }),
   displayField: 'txt',
   valueField: 'val',
   typeAhead: true,
   allowBlank: false,
   editable: false,
   submitValue: false,
   width: 140,
   mode: 'local',
   forceSelection: true,
   triggerAction: 'all',
   emptyText: '[Select operator]',
   selectOnFocus: true,
   renderTo: 'operatorBox'+ this.autoKey,
   listeners:{
    select: function(field){
     var rowID = field.id.replace('operatorsCombo', '');
     var thisRowState = {};
     var indx = this.getRowStateIndex(rowID);
     this.rowStates[indx].operatorText = field.getRawValue();
     this.rowStates[indx].operatorTemplate = field.getValue();
     thisRowState = this.rowStates[indx];
     var searchFieldCombo = Ext.getCmp('fieldNameCombo' + rowID);
     var searchValCmp = Ext.getCmp('searchValueTextField' + rowID);
     var searchValCmp1 = Ext.getCmp('searchValueTextField1_' + rowID);
     if(field.getRawValue() == 'between'){
      if(searchValCmp){
       searchValCmp.destroy();
      }
      if(searchValCmp1){
       var currentXtype1 = searchValCmp1.getXType();
       var removeCmp1 = false;
       switch(currentXtype1){
        case 'numberfield':
         if(thisRowState.columnDataType != 'number'){
          removeCmp1 = true;
         }
         break;
        case 'textfield':
         if(thisRowState.columnDataType != 'string'){
          removeCmp1 = true;
         }
         break;
        case 'combo':
         removeCmp1 = true;
         break;
        case 'datefield':
         if(thisRowState.columnDataType != 'date'){
          removeCmp1 = true;
         }
         break;
       }
       if(removeCmp1) {
        searchValCmp1.destroy();
        Ext.getCmp('searchValueTextField2_' + rowID).destroy();
        this.addNewEntryField2(thisRowState.columnDataType, rowID, 'AND', this.getFieldConfig(searchFieldCombo.getValue()));
       }
      } else {
       this.addNewEntryField2(thisRowState.columnDataType, rowID, 'AND', this.getFieldConfig(searchFieldCombo.getValue()));
      }
     } else {
      if(searchValCmp1) { //remove entry fields used for BETWEEN operator
       searchValCmp1.destroy();
       Ext.getCmp('searchValueTextField2_' + rowID).destroy();
       var els = Ext.select('#betweenBox' + rowID, false);
       els.removeElement('betweenBox' + rowID, true);
      }
      if(searchValCmp) {
       var currentXtype = searchValCmp.getXType();
       var removeCmp = false;
       switch(currentXtype){
        case 'numberfield':
         if(field.getRawValue()== 'in'){
          removeCmp = true;
         } //allow text input for number field.
         else if(thisRowState.columnDataType != 'number'){
          removeCmp = true;
         }
         break;
        case 'textfield':
         if(thisRowState.columnDataType != 'string'){
          removeCmp = true;
         }
         break;
        case 'combo':
         removeCmp = true;//cannot re-use combobox
         break;
        case 'datefield':
         if(thisRowState.columnDataType != 'date'){
          removeCmp = true;
         }
         break;
       }
       if(removeCmp) {
        searchValCmp.destroy();
        if(field.getRawValue() == 'in' && thisRowState.columnDataType == 'number'){
         this.addNewEntryField('string', rowID, this.getFieldConfig(searchFieldCombo.getValue()));
        } else {
         this.addNewEntryField(thisRowState.columnDataType, rowID, this.getFieldConfig(searchFieldCombo.getValue()));
        }
       }
      } else {
       if(field.getRawValue() == 'in' && thisRowState.columnDataType == 'number'){
        this.addNewEntryField('string', rowID, this.getFieldConfig(searchFieldCombo.getValue()));
       } else {
        this.addNewEntryField(thisRowState.columnDataType, rowID, this.getFieldConfig(searchFieldCombo.getValue()));
       }
      }
     }
    },
    scope: this
   }
  });
 },
 removeRow: function(rowID){
  var rowState = {};
  var rowStateIndx = 0;
  for(i = 0; i <= this.rowStates.length; i++){
   if(this.rowStates[i].rowID == rowID){
    rowState = this.rowStates[i];
    rowStateIndx = i;
    break;
   }
  }
  if(rowState.operatorText == "between"){
   if(Ext.getCmp('searchValueTextField1_' + rowID)){
    Ext.destroy(Ext.getCmp('searchValueTextField1_' + rowID));
   }
   if(Ext.getCmp('searchValueTextField2_' + rowID)){
    Ext.destroy(Ext.getCmp('searchValueTextField2_' + rowID));
   }
  } else {
   if(Ext.getCmp('searchValueTextField' + rowID)){
    Ext.destroy(Ext.getCmp('searchValueTextField' + rowID));
   }
  }
  Ext.getCmp('fieldNameCombo' + rowID).destroy();
  Ext.getCmp('operatorsCombo' + rowID).destroy();
  if(rowID > 1){
   Ext.getCmp('andOrCombo' + rowID).destroy();
   Ext.getCmp('removeRowButton' + rowID).destroy();
  }
  //remove the html container element
  var row = Ext.select('#row' + rowID);
  row.removeElement('row' + rowID, true);
  //remove row from rowStates
  this.rowStates.splice(rowStateIndx, 1);
 }
	,
	getValue: function(){
		if (!this.isValid(true)) {
			return false;
		}
		return this.rowStates;
	}
	,
	setValue: function(json_value){
		var array_value = Ext.util.JSON.decode(json_value);
		this.clearValue();
		Ext.each(array_value, function(item, indx){
			//fieldNameCombo, operatorCombo = null;
			if(item.rowID > 1) {
				this.addNewRow();
				Ext.getCmp('andOrCombo'+ (indx + 1)).setValue(item.andOr);
			}
			var fieldNameCombo = Ext.getCmp('fieldNameCombo' + (indx + 1));
			var operatorCombo = Ext.getCmp('operatorsCombo' + (indx + 1));
			fieldNameCombo.setValue(item.columnName);
			fieldNameCombo.fireEvent('select', fieldNameCombo);
			operatorCombo.setValue(item.operatorTemplate);
			operatorCombo.fireEvent('select', operatorCombo);
			if(item.entryValues.length == 1){
				Ext.getCmp('searchValueTextField' + (indx + 1)).setValue(item.entryValues[0]);
				Ext.getCmp('searchValueTextField' + (indx + 1)).fireEvent('blur', Ext.getCmp('searchValueTextField' + (indx + 1)));
			} else if(item.entryValues.length == 2) {
				Ext.getCmp('searchValueTextField1_' + (indx + 1)).setValue(item.entryValues[0]);
				Ext.getCmp('searchValueTextField2_' + (indx + 1)).setValue(item.entryValues[1]);
				Ext.getCmp('searchValueTextField2_' + (indx + 1)).fireEvent('blur', Ext.getCmp('searchValueTextField2_' + (indx + 1)));
			}
		}, this);
	}
	,
	getSqlValue: function(forUser){
		if (forUser === undefined) forUser = false;
		if (!this.isValid(true)) {
			return false;
		}
		var sqlFilter = '';
		for(var i = 0; i < this.rowStates.length; i++){
			var rowData = this.rowStates[i];
			var column = (forUser ? rowData.columnAlias : rowData.columnName);
			if(i > 0) {
				sqlFilter += Ext.getCmp('andOrCombo' + rowData.rowID).getValue() + ' ';
			}
   switch (rowData.operatorText){
    case 'between':
     if(Ext.getCmp('searchValueTextField1_' + rowData.rowID).getXType() == 'datefield'){
      sqlFilter += column + ' ' + String.format(rowData.operatorTemplate, Ext.getCmp('searchValueTextField1_' + rowData.rowID).getValue().format("Y-m-d"), Ext.getCmp('searchValueTextField2_' + rowData.rowID).getValue().format("Y-m-d")) + ' ';
     } else {
      sqlFilter += column + ' ' + String.format(rowData.operatorTemplate, Ext.getCmp('searchValueTextField1_' + rowData.rowID).getValue(), Ext.getCmp('searchValueTextField2_' + rowData.rowID).getValue()) + ' ';
     }
     break;
    case 'in':
     if(rowData.columnDataType == "string"){
      var valueString = column + ' IN (';
      var valueArray = Ext.getCmp('searchValueTextField' + rowData.rowID).getValue().split(',');
      var validValueArray = [];
      for(var k = 0; k < valueArray.length; k++){
       if(valueArray[k].trim() != ''){
        validValueArray.push(valueArray[k].trim());
       }
      }
      for(var j = 0; j < validValueArray.length - 1; j++) {
       valueString += "'" + validValueArray[j] + "', ";
      }
      valueString += "'" + validValueArray[validValueArray.length - 1] + "') ";
      sqlFilter += valueString;
     } else if(rowData.columnDataType == "number"){
      var valueString = column + ' IN (';
      var valueArray = Ext.getCmp('searchValueTextField' + rowData.rowID).getValue().split(',');
      var validValueArray = [];
      for(var k = 0; k < valueArray.length; k++){
       if(this.isNumeric(valueArray[k].trim())){
        validValueArray.push(valueArray[k].trim());
       }
      }
      for(var j = 0; j < validValueArray.length - 1; j++){
       valueString += validValueArray[j] + ", ";;
      }
      valueString += validValueArray[validValueArray.length - 1] + ") ";
      sqlFilter += valueString;
     } else {
      var valueString = column + ' IN (';
      var valueArray = Ext.getCmp('searchValueTextField' + rowData.rowID).getValue().split(',');
      var validValueArray = [];
      for(var k = 0; k < valueArray.length; k++){
       if(valueArray[k].trim() != ''){
        validValueArray.push(valueArray[k].trim());
       }
      }
      for(j= 0; j < validValueArray.length - 1; j++){
       valueString += validValueArray[j] + ", ";;
      }
      valueString += validValueArray[validValueArray.length - 1] + ") ";
      sqlFilter += valueString;
     }
     break;
    default:
     var valField = Ext.getCmp('searchValueTextField' + rowData.rowID);
     if(valField.getXType() == 'datefield'){
      sqlFilter += column + ' ' + String.format(rowData.operatorTemplate, valField.getValue().format("Y-m-d")) + ' ';
     } else {
      sqlFilter += column + ' ' + String.format(rowData.operatorTemplate, valField.getValue()) + ' ';
     }
     break;
   }
  }
  return sqlFilter;
 },
	getUserValue: function(){
		return this.getSqlValue(true);
	}
	,
	clearValue: function(){
		while(this.rowStates[1]) {
			this.removeRow(this.rowStates[1].rowID);
		}
		this.autoKey = 1;
		Ext.each(Ext.ComponentMgr.all.items, function(item, index){
			if  (
				(item.getId().substr(0, 20) == 'searchValueTextField')
				||
				(item.getId().substr(0, 10) == 'andOrCombo')
				||
				(item.getId().substr(0, 14) == 'fieldNameCombo')
				||
				(item.getId().substr(0, 14) == 'operatorsCombo')
			) {
				item.reset();
			}
		});
	}
	,
	validate: function(preventMark){
		if (preventMark === undefined) preventMark = false;
		var valid = true;
		Ext.each(Ext.ComponentMgr.all.items, function(item, index){
			if  (
				(item.getId().substr(0, 20) == 'searchValueTextField')
				||
				(item.getId().substr(0, 10) == 'andOrCombo')
				||
				(item.getId().substr(0, 14) == 'fieldNameCombo')
				||
				(item.getId().substr(0, 14) == 'operatorsCombo')
			) {
				valid = (valid && (!preventMark ? item.validate() : item.isValid(true)));
			}
		});
		return valid;
	}
	,
	isValid: function(preventMark){
		if (preventMark === undefined) preventMark = false;
		return this.validate(preventMark);
	}
	,
	clearInvalid: Ext.emptyFn,
	markInvalid: Ext.emptyFn,
	getName: function() {
		return this.name || this.id || '';
	}
});
Ext.reg('querybuilder', Ext.ux.QueryBuilder);