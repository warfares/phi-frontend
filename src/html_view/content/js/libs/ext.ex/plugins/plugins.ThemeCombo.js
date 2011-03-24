// vim: ts=4:sw=4:nu:fdc=4:nospell
/**
  * Ext.ux.ThemeCombo - Combo pre-configured for themes selection
  * 
  * @author    Ing. Jozef Sak�lo� <jsakalos@aariadne.com>
  * @copyright (c) 2008, by Ing. Jozef Sak�lo�
  * @date      30. January 2008
  * @version   $Id: Ext.ux.ThemeCombo.js 668 2008-02-01 01:02:54Z jozo $
  */


Ext.ux.ThemeCombo = Ext.extend(Ext.form.ComboBox, {
    // configurables
     themeBlueText: 'Blue Theme'
    ,themeGrayText: 'Gray Theme'        
    ,themePurpleText: 'Purple Theme'    
    ,themeSlateText: 'Slate Theme'        
    ,selectThemeText: 'Select Theme'
    ,lazyRender:true
    ,lazyInit:true
    ,cssPath: 'Content/js/ext-2.2.1/resources/css/' // mind the trailing slash

    // {{{
    ,initComponent:function() {

        Ext.apply(this, {
            store: new Ext.data.SimpleStore({
                 fields: ['themeFile', 'themeName']
                ,data: [
                     ['xtheme-default.css', this.themeBlueText]
                    ,['xtheme-gray.css', this.themeGrayText]                                        
                    ,['xtheme-purple.css', this.themePurpleText]
                    ,['xtheme-slate.css', this.themeSlateText]                  
                ]
            })
            ,valueField: 'themeFile'
            ,displayField: 'themeName'
            ,triggerAction:'all'
            ,mode: 'local'
            ,forceSelection:true
            ,editable:false
            ,fieldLabel: this.selectThemeText
        }); // end of apply

        // call parent
        Ext.ux.ThemeCombo.superclass.initComponent.apply(this, arguments);
    } // end of function initComponent
    // }}}
    // {{{
    ,onSelect:function() {
        // call parent
        Ext.ux.ThemeCombo.superclass.onSelect.apply(this, arguments);
        
        // set theme
        var theme = this.getValue();
        Ext.util.CSS.swapStyleSheet('theme', this.cssPath + theme);

        if(Ext.state.Manager.getProvider()) {
            Ext.state.Manager.set('theme', theme);
        }
    } // end of function onSelect
    // }}}

}); // end of extend 