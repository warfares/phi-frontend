Ext.ns('Philosophy.Globalization');

Philosophy.Globalization.Languages = {
	'English': Philosophy.Globalization.Dictionaries.English,
	'Spanish': Philosophy.Globalization.Dictionaries.Spanish,
	'Deutsch': Philosophy.Globalization.Dictionaries.Deutsch
};

var language = Philosophy.Util.readCookie('language') || 'Spanish';
Philosophy.Globalization.Dictionary = Philosophy.Globalization.Languages[language];

Philosophy.Globalization.For = function(phrase) {
	//If phrase found, then return globalization for phrase
	if (phrase in Philosophy.Globalization.Dictionary) {
		return Philosophy.Globalization.Dictionary[phrase];
	}
	//If phrase not found, then return phrase without globalization
	return phrase;
};

Philosophy.Globalization.ChangeTo = function(Language) {
	if (Language in Philosophy.Globalization.Languages) {
		Philosophy.Globalization.Dictionary = Philosophy.Globalization.Languages[Language];
	}
};

//alias
Phi.Global = Phi.Globalization;
