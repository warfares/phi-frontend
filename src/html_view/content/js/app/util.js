Ext.ns("Philosophy");
/**
* @class Philosophy.Util 
* 
* Philosophy common core utilities and functions. 
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
* @singleton
*
*/
Philosophy.Util = {
	popupMessageContainer: null
	,
	popupMessage: function (title, message, container) {

		container = container || document.body;

		var createBox = function (t, m) {
			return ['<div class="msg">',
			'<div class="popupMessage"><b>', t, '</b><br/>', m, '</div>',
			'</div>'].join('');
		};

		this.popupMessageContainer = Ext.DomHelper.insertFirst(document.body, { id: 'msg-div' }, true);

		this.popupMessageContainer.alignTo(container, 'c-c', [0, -100]);
		var box = Ext.DomHelper.append(this.popupMessageContainer, { html: createBox(title, message) }, true);
		box.fadeIn({ endOpacity: .75 }).pause(2).fadeOut({ remove: true });
	}
	,
	clone: function (o) {
		if (!o || 'object' !== typeof o) {
			return o;
		}
		var c = 'function' === typeof o.pop ? [] : {};
		var p, v;
		for (p in o) {
			if (o.hasOwnProperty(p)) {
				v = o[p];
				if (v && 'object' === typeof v) {
					c[p] = this.clone(v);
				}
				else {
					c[p] = v;
				}
			}
		}
		return c;
	}
	,
	buildColumnModel: function (metadata) {

		var render = function (val, m, record) {
			return '<img src="content/images/icons/vector.png" />';
		}
		var m = [];
		m.push({ header: '', width: 25, renderer: render });

		for (i = 0; i < metadata.length; i++) {
			var h = metadata[i] == 'wkt' ? true : false;
			var column = { header: metadata[i], dataIndex: metadata[i], hidden: h };
			m.push(column);
		}
		var cm = new Ext.grid.ColumnModel(m);
		return cm;
	}
	,
	buildDataStore: function (metadata) {
		var reader = new Ext.data.JsonReader({ root: 'Rows', totalProperty: 'Count', fields: metadata });
		var proxy = new Ext.data.HttpProxy({
			method: 'GET',
			url: Philosophy.UriTemplate.getUri('geoService', 'geoGetQueryData')
		});

		var ds = new Ext.data.Store({
			proxy: proxy,
			reader: reader
		});
		return ds;
	}
	,
	getAppCfg: function () {
		var _this = this;
		var cfg = {
			theme: _this.readCookie("theme") || 'xtheme-gray.css',
			language: _this.readCookie("language") || 'Spanish'
		};
		return cfg
	}
	,
	setAppCfg: function (cfg) {
		var theme = cfg.theme;
		var language = cfg.language;
		this.createCookie('theme', theme, 60);
		this.createCookie('language', language, 60);
	}
	,
	createCookie: function (name, value, days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			var expires = "; expires=" + date.toGMTString();
		}
		else var expires = "";
		document.cookie = name + "=" + value + expires + "; path=/";
	}
	,
	readCookie: function (name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	}
	,
	eraseCookie: function (name) {
		createCookie(name, "", -1);
	}
	,
	swapExtTheme: function (theme) {
		var cssPath = 'content/js/ext-2.2.1/resources/css/'
		Ext.util.CSS.swapStyleSheet('theme', cssPath + theme);
		if (Ext.state.Manager.getProvider()) {
			Ext.state.Manager.set('theme', theme);
		}
	}
	,
	fixWCFJsonDate: function (v) {
		return new Date(parseFloat(v.slice(6, 19)));
	}
	,
	encode64: function (input) {
		input = escape(input);
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;

		var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

		do {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while (i < input.length);
		return output;
	    }
	,
	decode64: function (input) {
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;

		var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

		var base64test = /[^A-Za-z0-9\+\/\=]/g;
		if (base64test.exec(input)) {
			Ext.Msg.alert("Warning", "The document contains invalid characters. Errors can occur when decoding it.");
		}
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		do {
			enc1 = keyStr.indexOf(input.charAt(i++));
			enc2 = keyStr.indexOf(input.charAt(i++));
			enc3 = keyStr.indexOf(input.charAt(i++));
			enc4 = keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
			} while (i < input.length);

			return unescape(output);
		}
	,
	mapPGTypes: function(t){
		var PGtypes = {
			'timestamp with time zone':'date',
			'boolean':'boolean',
			'double precision':'number',
			'real':'number',
			'bigint':'number',
			'integer':'number',
			'numeric':'number',
			'smallint':'number',
			'character varying':'string',
			'char':'string',
			'boolean':'string',
			'anyarray':'string',
			'text':'string',
			'name':'string'
		};
		return PGtypes[t];
	}
};   // eo Philosophy.Util
//

Philosophy.Msg = Philosophy.Util.popupMessage;