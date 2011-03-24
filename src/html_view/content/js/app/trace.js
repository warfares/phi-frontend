Ext.ns("Philosophy.model");
/**
* @class Philosophy.model.Trace
* @extends Ext.util.Observable
* 
* Philosophy Trace its a cross domain (JSONP) (proxy) for 
* phi.gps service ..(UltraGPS DATA) !!
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
*
*/
Philosophy.model.Trace = Ext.extend(Ext.util.Observable, {
	initComponent: function (config) {
		this.server = config.server || GPSSERVER; // TODO fix this ; ?? 

		this.addEvents(
			/**
			* @event async cross domain lastposition OK 
			*/
			'lastposition',
			/**
			* @event async cross domain trace OK 
			*/
			'trace',
			/**
			* @event not found result event 
			*/
			'notfound'

		);
		Philosophy.model.Trace.superclass.initComponent.call(config);
	}
	,
	/**
	* Get traces in date range  
	* @param {String} id carrier (key)
	* @param {Date} from initial date 
	* @param {Date} to ending date
	* */
	getByRange: function (id, from, to) {
		var params = {
			carrierId: id,
			from: from,
			to: to
		};

		Ext.ux.JSONP.request(GPSSERVER + '/svc/trace.svc/rest/GetByRange', {
			callbackKey: 'callback',
			params: params,
			scope:this,
			callback: function (r) {
				if (r.Success) {
					var list = [];
					Ext.each(r.List, function (t) {
						var o = { x: t.X, y: t.Y, angle: t.Angle, speed: t.Speed };
						list.push(o);
					}, this);

					var bound = {
						minx: r.Bound.P1.X,
						miny: r.Bound.P1.Y,
						maxx: r.Bound.P2.X,
						maxy: r.Bound.P2.Y
					};
					this.fireEvent('trace', list, bound);
				}
				else
				this.fireEvent('notfound');
			}
		});
	}
	,
	/**
	* Get the last position  
	* @param {String} id carrier (key)
	* */
	getLastPosition: function (id) {
		var me = this;
		Ext.ux.JSONP.request(GPSSERVER + '/svc/trace.svc/rest/GetLastPosition', {
			callbackKey: 'callback',
			params: { carrierId: '697763163' },
			callback: function (r) {
				if (r.Success) {
					var t = r.Trace;
					var o = { x: t.X, y: t.Y, angle: t.Angle, speed: t.Speed };
					me.fireEvent('lastposition', o);
				}
				else
				me.fireEvent('notfound');
			}
		});
	}
});