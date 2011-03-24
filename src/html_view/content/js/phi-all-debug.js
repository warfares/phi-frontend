(function() {
	var jsfiles = new Array(
		'config.js',
		'util.js',
		'layer.js',
		'marker.js',
		'session.js',
		'data/location.js',
		'lang/de.js',
		'lang/en.js',
		'lang/es.js',
		'globalization.js',
		'geocode.js',
		'trace.js',
		'view/combobox/baseLayer.js',
		'view/combobox/layer.js',
		'view/combobox/marker.js',
		'view/combobox/pattern.js',
		'view/combobox/projection.js',
		'view/combobox/role.js',
		'view/combobox/group.js',
		'view/combobox/userGroup.js',
		'view/slider/baseLayer.js',
		'view/menu/layer.js',
		'view/menu/marker.js',
		'view/control/searchEngines.js',
		'view/control/search.js',
		'view/form/searchLayer.js',
		'view/form/searchWorkspace.js',
		'view/form/searchUser.js',
		'view/toolbar/mainToolbar.js',
		'view/panel/user.js',
		'view/panel/layer.js',
		'view/panel/gpsMobile.js',
		'view/panel/gpsPreference.js',
		'view/panel/gps.js',
		'view/panel/workspace.js',
		'view/panel/location.js',
		'view/panel/map.js',
		'view/panel/search.js',
		'view/panel/resumeLayer.js',
		'view/tree/base.js',
		'view/tree/WMSLayers.js',
		'view/tree/raster.js',
		'view/tree/overlay.js',
		'view/tree/wsUsers.js',		
		'view/window/colorPicker.js',
		'view/window/controlpanel.js',
		'view/window/location.js',
		'view/window/login.js',	
		'view/window/userDetails.js',
		'view/window/passwordChange.js',
		'view/window/formAppSettings.js',
		'view/window/formExport.js',
		'view/window/uniqueResult.js',
		'view/window/searchLayer.js',
		'view/window/searchUser.js',
		'view/window/searchWorkSpace.js',
		'view/window/drawCoordinate.js',
		'view/window/convertCoordinate.js',
		'view/window/KMLUpload.js',
		'view/window/quickToolBar.js',
		'view/window/markerData.js',
		'view/window/links.js',
		'view/window/lineMeasureOutput.js',
		'view/window/measureOutput.js',
		'view/window/drawXY.js',
		'view/window/layerDetail.js',
		'view/window/genericLayerGrid.js',
		'view/window/genericGeomGrid.js',
		'view/window/convertXY.js',
		'view/window/queryBuilder.js',
		'view/window/queryResult.js',
		'view/window/sqlDescription.js',
		'view/window/workspace.js',
		'view/window/workspaceUsers.js',
		'view/window/printModule.js',
		'openlayer-control/clickAddLocation.js',
		'openlayer-control/clickLayerInfo.js',
		'openlayer-control/clickPointInfo.js', 
		'openlayer-control/boxBoundInfo.js',
		'openlayer-control/boxLayerInfo.js',           
		'map.js',
		'main.js' 
		); // etc.

		var agent = navigator.userAgent;
		var docWrite = (agent.match("MSIE") || agent.match("Safari"));
		if(docWrite) {
			var allScriptTags = new Array(jsfiles.length);
		}
		var host = "content/js/" + "app/";   

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
	}
	)();