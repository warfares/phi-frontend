Ext.ns("Philosophy");
/**
* @class Philosophy.Session
* 
* Philosophy current logged user 
* 
* @author #rbarriga
* @version 1.3
* @copyright (c) 2011, by LG
* @date      22. March 2011
* @singleton
*
*/
Philosophy.Session = {
	user: null,
	setUser: function (user) {
		this.user = user;
	}
	,
	getUser: function () {
		return this.user.userName;
	}
	,
	isRole: function (role) {
		var result = false;
		Ext.each(this.user.RolesVO, function (r) {
			if (r.Id === role)
			result = true;
			}, this);
			return result;
	}
};// eo Philosophy.Session
// eof