Ext.ns("Philosophy.model");
/**
* @class Philosophy.model.Geocode
* @extends Ext.util.Observable
* 
* Philosophy Gocode its a cross domain (JSONP) (proxy) for 
* ultramap // google geocode service ..!!
* 
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Philosophy.Geocode = Ext.extend(Ext.util.Observable, {
	initComponent: function (config) {
		this.server = config.server || GEOCODESERVER; // TODO fix this ; ?? 
		
		this.addEvents(
			/**
			* @event before call 
			*/
			'beforesearch',
			/**
			* @event async cross domain gecode service OK 
			*/
			'search',
			/**
			* @event not found result event 
			*/
			'notfound'
		);
		Philosophy.Geocode.superclass.initComponent.call(config);
	}
	,
	buildBaseParams: function (address) {
		
		var baseParams = {
			key: Phi.Config.geocodingApiKey,
			output: 'json',
			street_number_tolerance: 200,
		    include_neighbors: 'true'
		};
		
		if (!address.location){	
			address.municipality != '' ? (baseParams.municipality = address.municipality) : null;
			address.streetName != '' ? (baseParams.street_name = address.streetName) : null;
			address.streetNumber != '' ? (baseParams.street_number = address.streetNumber) : null;
			address.streetIntersection != '' ? (baseParams.street_intersection = address.streetIntersection) : null;
		}
		else 
			baseParams.location = address.location;
		
		return baseParams;
	}
	,
	/**
	* Get geocoding address  
	* @param {Object} address definition
	* */
	search: function (address) {
		var params = this.buildBaseParams(address);
		var me = this;
		
		me.fireEvent('beforesearch');

		Ext.ux.JSONP.request(GEOCODESERVER, {
			callbackKey: 'callback',
			params: params,
			callback: function (r) {
				if (r) { 
					me.fireEvent('search', r.ResultSet.Result);
				}
				else
				me.fireEvent('notfound');
			}
		});
	}
});