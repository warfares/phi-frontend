/**
 * @class Ext.ux.Hint 
 * @extends Ext.util.Observable
 * 
 * Simple hint panel.
 * <br/>
 * Example:
<pre><code>
var hint = new Ext.ux.Hint();

hint.on('check', somefunction, this);
hint.on('show', somefunction, this);

hint.setFooter(someHTMLFooter);
hint.setBody(someHTMLBody);
hint.show();

</code></pre>
 * 
 * @author rbarriga
 * @version 1.0
 * @copyright (c) 2011, by rbarriga
 * @date      7. April 2011
 */

Ext.ux.Hint = Ext.extend(Ext.util.Observable, {
	enabled: true,
	constructor: function (config) {
		
		var t = new Ext.Template(
			'<div id="{idContainer}" style="{style}">',
			'<span id="{idClose}" style="position:absolute;top:-10px;left:-10px;cursor:pointer;">',
				'<img src="content/images/close_button.png" style="vertical-align:middle;" />',
			'</span>',
			'<div>',
				'<span style="position:absolute;top:10px;left:10px;">',
					'<img src="content/images/lightbulb.png" style="vertical-align:middle;" />',
				'</span>',
				'<span style="position:absolute;top:10px;left:50px;font-size:10px;width:250px;">',
					'<span id="{idResults}"></span>',
					'<br/><br/>',
				'</span>',
				
				'<span id="{idFooter}" style="position:absolute;bottom:30px;left:50px;font-size:10px;width:250px;">',
				'</span>',
				
				'<span style="position:absolute;bottom:10px;left:10px;font-size:10px;width:250px;">',
					'<input id="{idCheck}" type="checkbox" style="vertical-align:middle;position:relative;margin-right:5px;"></input>',
					'Show hint',
				'</span>',
			'</div>',
			
			'</div>'
		);
		var idContainer = Ext.id();
		var idClose = Ext.id();
		var idResults = Ext.id();
		var idFooter = Ext.id();
		var idCheck = Ext.id();
		
		var style = this.buildEmbeddedStyle();

		t.append(window.document.body, { 
			idContainer: idContainer, 
			idClose: idClose, 
			idResults: idResults, 
			idCheck:idCheck, 
			idFooter:idFooter,
			style:style
		});

		this.container = Ext.get(idContainer);
		this.close = Ext.get(idClose);
		this.result = Ext.get(idResults);
		this.chk = Ext.get(idCheck);
		this.footer = Ext.get(idFooter);
		
		this.chk.dom.checked = this.enabled;
		
		this.close.on('click', this.hide, this);
		Ext.isIE ? this.chk.on('click', this.change, this) : this.chk.on('change', this.change, this);
		
		this.addEvents(
			'hide',
			'show',
			'check'
		);
		
		Ext.ux.Hint.superclass.constructor.call(config);
	}
	, 
	buildEmbeddedStyle: function () {
		var style = [];
		style.push('position:absolute;');
		style.push('display:none;');
		style.push('z-index:10000;');
		style.push('font-family:tahoma,arial,san-serif;');
		style.push('color:white;');
		style.push('background: #444;');
		style.push('border:solid 1px #111;');
		style.push('padding:20px;');
		style.push('-moz-box-shadow: 3px 3px -7px #444;');
		style.push('-webkit-box-shadow: 3px 3px 7px #444;');
		style.push('-moz-border-radius: 5px;');
		style.push('-webkit-border-radius: 5px;');
		style.push('width:300px;height:100px;');
		style.push('bottom:40px;right:60px;');
        return style.join('');
    }
	,
	setBody:function(html){
		this.result.update(html);
	}
	,
	setFooter:function(html){
		this.footer.update(html);
	}
	, 
	hide:function(){
			this.container.setVisible(false, {});
			this.fireEvent('hide', this);
	}
	,
	show:function(){
		if(!this.container.isVisible() & this.enabled){
			this.container.fadeIn({ endOpacity: 0.8, duration: 2 });
			this.fireEvent('show', this);
		}
	}
	,
	getValues:function(){
		var v = {
			chk: this.chk.getAttribute('checked')
		}
		return v;
	}
	,
	change: function () {
		var v = this.getValues();
		this.enabled = v.chk;
		this.fireEvent('check', v);
	}	
});// eof Ext.ux.Hint

