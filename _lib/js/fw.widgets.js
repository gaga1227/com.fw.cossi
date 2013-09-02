/* ------------------------------------------------------------------------------ */
/* initHeaderMenus */
/* ------------------------------------------------------------------------------ */
function initHeaderMenus() {
	//check if DOM elem exists
	if ( !$('#header').length || !$('#menuDeanery').length || !$('#menuSystem').length ) return false;
	
	//vars
	var $btnMenus = $('#header').find('.btnMenu'),
		activeCls = 'active';
	
	//handler
	function updateMenus(e){
		var $this = $(this),
			$that = $this.siblings('.btnMenu');
		$this.toggleClass(activeCls);
		$that.removeClass(activeCls);
	}
	function clickout(e){
		if (!$btnMenus.has(e.target).length) {
			$btnMenus.removeClass(activeCls);	
		}
	}
	
	//bind behavior
	$btnMenus.on('click', updateMenus);
	$('#container').bind('click', clickout);
}