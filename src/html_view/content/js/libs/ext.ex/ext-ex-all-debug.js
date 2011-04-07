(function() {
	var jsfiles = new Array(
		'SuperBoxSelect/SuperBoxSelect.js',
		'datetimefield.js',
		'plugins.ToggleCollapsible.js',
		'grid.plugins.GroupCheckboxSelection.js',
		'plugins.ThemeCombo.js',
		'plugins.IconCombo.js',
		'plugins.LangSelectCombo.js',
		'colorpicker.js',
		'form.StaticTextField.js',
		'FileUploadField.js',
		'GridDragDropRowOrder.js',
		'ext.fx.shake.js',
		'MultiselectItemSelector-3.0/Multiselect.js',
		'MultiselectItemSelector-3.0/DDView.js',
		'Ext.ux.JsonP.js',
		'Ext.ux.Query.js',
		'Ext.ux.Hint.js'
	); // etc.

	var agent = navigator.userAgent;
	var docWrite = (agent.match("MSIE") || agent.match("Safari"));
	if(docWrite) {
		var allScriptTags = new Array(jsfiles.length);
	}
	var host = "content/js/" + "libs/ext.ex/plugins/";   

	for (var i=0, len=jsfiles.length; i<len; i++) {
		if (docWrite) {
			allScriptTags[i] = "<script src='" + host + jsfiles[i] + "'></script>"; 
		} else {
			var s = document.createElement("script");
			s.src = host + jsfiles[i];
			var h = document.getElementsByTagName("head").length ? 
			document.getElementsByTagName("head")[0] : 
			document.body;
			h.appendChild(s);
		}
	}
	if (docWrite) {
		document.write(allScriptTags.join(""));
	}
})();