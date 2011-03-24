Ext.ns("Phi.view.window");
/**
* @class Philosophy.view.window.ConvertCoordinate 
* @extends Ext.Window
* 
* Philosophy upload 'coordinate file' in different formats(csv, txt, xls, etc) and transform projection
*  
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Phi.view.window.ConvertCoordinate = Ext.extend(Ext.Window, {
    title: Philosophy.Globalization.For('Convert Coordinates'),
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
            fieldLabel: Philosophy.Globalization.For('File') + ' <b>(csv,txt,xls,xlsx)</b>',
            name: 'file',
            buttonText: '',
            buttonCfg: { iconCls: 'upload-icon' }
        });

        this.sourceProjCombo = new Phi.view.comboBox.Projection({ fieldLabel: Philosophy.Globalization.For('Projection Source') });
        this.targetProjCombo = new Phi.view.comboBox.Projection({ fieldLabel: Philosophy.Globalization.For('Projection Target') });

        this.fp = new Ext.FormPanel({
            fileUpload: true,
            region: 'center',
            labelAlign: 'top',
            width: 500,
            frame: true,
            bodyStyle: 'padding: 10px 10px 0 10px;',
            labelWidth: 50,
            defaults: { anchor: '95%', allowBlank: false, msgTarget: 'side' },
            items: [this.fuField, this.sourceProjCombo, this.targetProjCombo]
        });
        this.items = [this.fp];

        // just a trick for post only stream (WCF restriction)
        this.fp.on('beforeaction', function(form, action) {
            if (action.type == 'submit') {
                Ext.Ajax.StreamResponse = true;
                _this.sourceProjCombo.disable();
                _this.targetProjCombo.disable();
            }
        });

        this.fp.on('actioncomplete', function(form, action) {
            if (action.type == 'submit') {
                _this.sourceProjCombo.enable();
                _this.targetProjCombo.enable();
            }
        });

        this.fp.on('actionfailed', function(form, action) {
            if (action.type == 'submit') {

                _this.sourceProjCombo.enable();
                _this.targetProjCombo.enable();
            }
        });

        Phi.view.window.ConvertCoordinate.superclass.initComponent.call(this);

        this.addButton(Philosophy.Globalization.For('Close'), function () { _this.close(); });
        this.addButton(Philosophy.Globalization.For('Upload'), function () { _this.upload(); });
    }
    ,
    upload: function() {
        var _this = this;
        if (this.fp.getForm().isValid() && this.validate()) {

            var q = {
                sourceSrid: this.sourceProjCombo.getValue(),
                targetSrid: this.targetProjCombo.getValue(),
                type: this.getFileDetails().type
            }

            var queryString = Ext.urlEncode(q);

            this.fp.getForm().submit({
                url: Philosophy.UriTemplate.getUri('utilService', 'utilTransformFile', '?' + queryString),
                //waitMsg: 'Uploading your file...',
                success: function(fp, o) {
                    //_this.close();
                },
                failure: function(fp, o) {
                    alert('fail');
                }
            });
        }
    }
    ,
    validate: function() {

        var sourceSrid = this.sourceProjCombo.getValue();
        var targetSrid = this.targetProjCombo.getValue();

        if (sourceSrid == targetSrid) {
            Ext.MessageBox.alert(Philosophy.Globalization.For('Warning'), Philosophy.Globalization.For('The projections must be different'));
            return false
        }

        var file = this.getFileDetails();
        var errorMsg = Philosophy.Globalization.For('The file <b>') + file.name + Philosophy.Globalization.For('</b>: must be <b>csv, txt, xls, xslx</b>');

        if (!file.ext) {
            Ext.MessageBox.alert(Philosophy.Globalization.For('Warning'), errorMsg);
            return false
        }

        if (file.type == "TXT" || file.type == "XLS" || file.type == "XLSX" || file.type == "CSV")
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
});       // eo Phi.view.window.ConvertCoordinate
// eof