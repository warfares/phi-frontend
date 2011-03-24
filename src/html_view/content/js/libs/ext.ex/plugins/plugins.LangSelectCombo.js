// vim: ts=4:sw=4:nu:fdc=4:nospell
/**
 * Ext.ux.LangSelectCombo - Combo pre-configured for language selection
 * 
 * @author    Ing. Jozef Sakáloš <jsakalos@aariadne.com>
 * @copyright (c) 2008, by Ing. Jozef Sakáloš
 * @date      21. March 2008
 * @version   $Id: Ext.ux.LangSelectCombo.js 185 2008-04-15 16:34:58Z jozo $
 */

/*global Ext */

/**
 * @class Ext.ux.LangSelectCombo
 * @extends Ext.ux.IconCombo
 */

Ext.ux.LangSelectCombo = Ext.extend(Ext.ux.IconCombo, {
	selectLangText:'Select Language'
	,lazyRender:true
	,lazyInit:true
	,langVariable:'locale'
	,typeAhead:true
	,initComponent:function() {
		
		Ext.apply(this, {
			store:new Ext.data.SimpleStore({
				id:0
				,fields:[
					 {name:'langCode', type:'string'}
					,{name:'langName', type:'string'}
					,{name:'langCls', type:'string'}
				]
				,data:[					
					 ['Deutsch', 'Deutsch', 'ux-flag-de']
					//,['French', 'French', 'ux-flag-fr']					
					,['English', 'English', 'ux-flag-us']									
					,['Spanish', 'Spanish', 'ux-flag-es']					
				]
			})
			,valueField:'langCode'
			,displayField:'langName'
			,iconClsField:'langCls'
			,triggerAction:'all'
			,mode:'local'
			,forceSelection:true
            ,fieldLabel: this.selectLangText

		}) // eo apply

		// call parent
		Ext.ux.LangSelectCombo.superclass.initComponent.apply(this, arguments);

	} // eo function initComponent

	
}) // eo extend

// eof