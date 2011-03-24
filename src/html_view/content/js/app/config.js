Ext.ns("Philosophy");
/**
* @class Philosophy.Config
*
* Philosophy Aplication main configuration 
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
* @singleton
*/

//servers
SERVER = 'http://dev.phi';

Geo.WSGIScriptAlias =  'phi-rest'; 

GEOSERVER = 'http://127.0.0.1:8080';
PROXYSERVER = 'http://127.0.0.1:8080';
GPSSERVER = 'http://10.10.80.6:8090';
GEOCODESERVER = 'http://www.ultramaps.cl/api/rest/v2.0/geocode';


//thirdparty conf
Proj4js.libPath = SERVER + '/content/js/libs/proj4js/lib/';
Ext.BLANK_IMAGE_URL = '/content/images/s.gif';

// const roles !!
ROLEADMIN = 1;
ROLEWRITER = 2;
ROLEREADER = 3;


Philosophy.Config = {
	/**
	* The version of the framework
	* @type String
	*/
	version: '1.2-RC',
	/**
	* WMS namespace definition 
	* @type String
	*/
	wmsNameSpace: 'pelambres',
	/**
	* WMS URL definition 
	* @type String
	*/
	wmsUrl: GEOSERVER + '/geoserver/wms?',
	/**
	* WMS Proxy(cache) URL definition 
	* @type String
	*/
	wmsProxyCache: GEOSERVER + '/geoserver/wms?', //PROXYSERVER + '/gwc_proxy/proxy/wms?',
	/**
	* wfs URL definition 
	* @type String
	*/
	wfsUrl: GEOSERVER + '/geoserver/wfs?',
	wmsLegend : GEOSERVER + '/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=17&HEIGHT=17&LAYER=',
	wmsBigLegend: GEOSERVER + '/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=100&HEIGHT=100&LAYER=',
	/**
	* Init WMS layer  
	* @type String
	*/
	initWMSLayer: [{ 'name': 'public.am_caminos', 'title': 'am_caminos', 'srid':24879 }],
	/**
	* KML storage URL 
	* @type String
	*/
	kmlFileUrl: 'Content/upload-files/kml/',
	/**
	* Files storage URL 
	* @type String
	*/
	linkFileUrl: 'Content/upload-files/link/',
	/**
	* UMAP Geocoding access KEY
	* @type String
	*/
	geocodingApiKey: 'AibKpZl_cZCN_AYsBnsGFRwq0niw0wQvOG3woDP8GzTn67xHTOpcYxWtd3m1pqpN6iFWS-cFpC4IXL6KwDCTIw'
}
Phi = Philosophy;