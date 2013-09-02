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
/* ------------------------------------------------------------------------------ */
/* initAccordions */
/* ------------------------------------------------------------------------------ */
function initAccordions() {
	//vars
	var accordions = { count:0 },
		acHeaderCls = 'acHeader',
		acContentCls = 'acContent',
		iconOpenCls = 'fwicon-plus',
		iconCloseCls = 'fwicon-minus',
		speed = 600;
	
	//update collection obj
	accordions.openAC = function(idx){
		var token = 'ac',
			ac = accordions[token + idx];
		if (!ac) return 'no AC instance';
		if (ac.show){
			//console.log('already show');
			return token + idx + ' already show';	
		} else {
			ac.$content.slideDown(speed);
			ac.$iconOpen.hide(0);
			ac.$iconClose.show(0);
			ac.show = true;
			ac.$content.attr('data-show', '1');
			return token + idx + ' opened';
		}
	}
	accordions.closeAC = function(idx){
		var token = 'ac',
			ac = accordions[token + idx];
		if (!ac) return 'no AC instance';
		if (!ac.show){
			//console.log('already NOT show');
			return token + idx + ' already NOT show';	
		} else {
			ac.$content.slideUp(speed);
			ac.$iconOpen.show(0);
			ac.$iconClose.hide(0);
			ac.show = false;
			ac.$content.attr('data-show', '0');
			return token + idx + ' closed';
		}
	}
	accordions.toggleAC = function(idx){
		var token = 'ac',
			ac = accordions[token + idx];
		if (!ac) return 'no AC instance';
		if (ac.show){
			this.closeAC(idx);
		} else {
			this.openAC(idx);
		}
		return token + idx + ' toggled';
	}
	accordions.refreshAC = function(idx){
		var token = 'ac',
			ac = accordions[token + idx];
		if (!ac) return 'no AC instance';
		if (ac.show){
			ac.$content.slideDown(speed);
			ac.$iconOpen.hide(0);
			ac.$iconClose.show(0);
			ac.$content.attr('data-show', '1');
		} else {
			ac.$content.slideUp(speed);
			ac.$iconOpen.show(0);
			ac.$iconClose.hide(0);
			ac.$content.attr('data-show', '0');
		}
		return token + idx + ' refreshed';	
	}
	
	//search DOM for ac instances
	$.each($('.'+acHeaderCls), function(idx, ele){
		var ac,
			$acHeader = $(ele),
			$acContent = $acHeader.next('.'+acContentCls);
		//add instance to control and collection objs
		if ($acContent.length) {
			accordions['ac' + String(idx+1)] = ac = {
				id:			idx + 1,
				$header:	$acHeader,
				$content:	$acContent,
				$iconOpen:	$acHeader.find('.'+iconOpenCls),
				$iconClose:	$acHeader.find('.'+iconCloseCls),
				show:		($acContent.attr('data-show') == '1') ? true : false
			};
			accordions.count++;
		}
		//update instance
		accordions.refreshAC(ac.id);
		//bind hehavior
		ac.$header.on('click', function(){
			accordions.toggleAC(ac.id);	
		});
	});
	
	//return to DOM
	return accordions;	
}