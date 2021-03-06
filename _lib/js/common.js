/* ------------------------------------------------------------------------------ */
/* webfonts */
/* ------------------------------------------------------------------------------ */
WebFontConfig = { 
	google: { 
		families: 	['Montserrat:400,700:latin'] 
	},
	custom: {
		families: 	['Chaparral:n4,n7'],
		urls: 		['_lib/font/fonts.css']
	},
	loading: 		function() { console.log('[WF] loading'); 	WebFontUtils.onWFLoading(); },
	active: 		function() { console.log('[WF] active'); 	WebFontUtils.onWFActive(); 	 WebFontUtils.onWFComplete(); },
	inactive: 		function() { console.log('[WF] inactive'); 	WebFontUtils.onWFInactive(); WebFontUtils.onWFComplete(); },
	fontloading: 	function( familyName, fvd ) { console.log( '[WF] ' + familyName, fvd, 'loading' ); },
	fontactive: 	function( familyName, fvd ) { console.log( '[WF] ' + familyName, fvd, 'active' ); },
	fontinactive: 	function( familyName, fvd ) { console.log( '[WF] ' + familyName, fvd, 'inactive' ); },
	timeout: 		5000
};
WebFontUtils = {
	onWFLoading: 	function()	{},
	onWFComplete: 	function()	{},
	onWFActive: 	function()	{},
	onWFInactive: 	function()	{}
}
/* ------------------------------------------------------------------------------ */
/* init */
/* ------------------------------------------------------------------------------ */
var Accordions, Asides, Editors, Sliders, Charts;
function init(){
	//layout assistance
	//insertFirstLastChild('');
	
	//page widgets
	initHeaderMenus();
	Accordions = new initAccordions();
	Asides = new initSecAside();
	
	//chart widgets
	Charts = new initCharts();
	
	//form widgets
	initBtnSwitch();
	initBtnCheck();
	Editors = new initEditors();
	initEditorWithNotes();
	Sliders = new initSliders();
	
	//debug
	displayDebugInfo('#debugInfo');
}
/* DOM Ready */
$(document).ready(function(){
	console.log('DOM Ready');
	initWebFontLoader();
	Platform.addDOMClass();
	init();	
});