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
		openCls = 'open',
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
			ac.$header.addClass(openCls);
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
			ac.$header.removeClass(openCls);
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
			ac.$header.addClass(openCls);
		} else {
			ac.$content.slideUp(speed);
			ac.$iconOpen.show(0);
			ac.$iconClose.hide(0);
			ac.$content.attr('data-show', '0');
			ac.$header.removeClass(openCls);
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
		ac.$header.on('click', function(e){
			e.preventDefault();
			accordions.toggleAC(ac.id);	
		});
	});
	
	//return to DOM
	return accordions;	
}
/* ------------------------------------------------------------------------------ */
/* initSecAside */
/* ------------------------------------------------------------------------------ */
function initSecAside() {
	//vars
	var asides = { count:0 },
		asideCls = 'secAside',
		activeCls = 'active',
		isIE7 = $('html').hasClass('ie7'),
		footerHeight = $('#footer').outerHeight(),
		getWindowHeight = function(){
			return $(window).height();
		};
	
	//update collection obj
	asides.openAS = function(idx){
		var token = 'as',
			as = asides[token + idx];
		if (!as) return 'no AS instance';
		if (as.active){
			//console.log('already active');
			return token + idx + ' already active';	
		} else {
			as.$el.addClass(activeCls);
			as.active = true;
			asides.refreshAS(as.id);
			return token + idx + ' activated';
		}
	}
	asides.closeAS = function(idx){
		var token = 'as',
			as = asides[token + idx];
		if (!as) return 'no AS instance';
		if (!as.active){
			//console.log('already NOT active');
			return token + idx + ' already NOT active';	
		} else {
			as.$el.removeClass(activeCls);
			as.active = false;
			return token + idx + ' de-activated';
		}
	}
	asides.toggleAS = function(idx){
		var token = 'as',
			as = asides[token + idx],
			$win = $(window);
		if (!as) return 'no AS instance';
		if (as.active){
			this.closeAS(idx);
			$win.unbind('resize.aside');
		} else {
			this.openAS(idx);
			$win.bind('resize.aside', function(e){
				asides.refreshAS(as.id);
			});
		}
		return token + idx + ' toggled';
	}
	asides.refreshAS = function(idx){
		var token = 'as',
			as = asides[token + idx],
			newHeight,
			paddings;
		if (!as) return 'no AS instance';
		
		//update content height
		//paddings = Math.abs(as.$content.height() - as.$content.innerHeight());
		newHeight = getWindowHeight() - as.gapTop - as.gapBtm - ( as.$header.length ? as.$header.height() : 0 );// - ( isIE7 ? paddings : 0);
		as.$content.height( newHeight );
		//console.log( getWindowHeight(), as.gapTop, as.gapBtm, as.$header.height());
				
		return token + idx + ' refreshed';	
	}
	
	//search DOM for as instances
	$.each($('.'+asideCls), function(idx, ele){
		var as,
			$aside = $(ele),
			$asHeader = $aside.find('> .header'),
			$asContent = $aside.find('> .scroller'),
			$asBtn = $aside.find('> .btnTrigger'),
			topGap = parseInt($aside.css('top'), 10);
		//add instance to control and collection objs
		asides['as' + String(idx+1)] = as = {
			id:			idx + 1,
			$el:		$aside,
			$header:	$asHeader,
			$content:	$asContent,
			$btn:		$asBtn,
			active:		$aside.hasClass(activeCls),
			gapTop:		topGap,
			gapBtm:		footerHeight//topGap
		};
		asides.count++;
		
		//bind hehavior
		as.$btn.on('click', function(e){
			e.preventDefault();
			asides.toggleAS(as.id);	
		});
	});
	
	//return to DOM
	return asides;	
}
/* ------------------------------------------------------------------------------ */
/* initBtnSwitch */
/* ------------------------------------------------------------------------------ */
function initBtnSwitch(){
	var	$switches = $('.btnSwitch'),
		activeCls = 'checked';
	
	if (!$switches.length) {
		return 'no switch ctrl found!';
	}
	
	//event handler
	function updateSwitch($tgt, toggle){
		var $switch = $tgt,
			$chkbox = $switch.find('input'),
			checked = toggle ? !$chkbox.prop('checked') : $chkbox.prop('checked');
		if (checked) {
			$switch.addClass(activeCls);
		} else {
			$switch.removeClass(activeCls);
		}
		$chkbox.prop('checked', checked);
		//console.log($chkbox.attr('id'), $chkbox.prop('checked'));
	}
	
	//bind button event
	$switches.on('click', function(e){
		e.preventDefault();
		var $switch = $(this);
		updateSwitch($switch, true);
	});
	
	/*
	$switches.on('swipeLeft swipeRight', function(e){
		var $switch = $(this),
			checked = $switch.find('input').prop('checked'),
			type = e.type;
		if ( (type == 'swipeLeft' && checked) || (type == 'swipeRight' && !checked) ) {
			updateSwitch($switch, true);
		}
	});
	*/
	
	//init states
	$.each($switches, function(idx,ele){
		updateSwitch($(ele), false);
	});	
}
/* ------------------------------------------------------------------------------ */
/* initBtnCheck */
/* ------------------------------------------------------------------------------ */
function initBtnCheck(){
	var	$checks = $('.btnCheck'),
		activeCls = 'checked';
	
	if (!$checks.length) {
		return 'no check ctrl found!';
	}
	
	//event handler
	function updateCheck($tgt, toggle){
		var $check = $tgt,
			$chkbox = $check.find('input'),
			checked = toggle ? !$chkbox.prop('checked') : $chkbox.prop('checked');
		if (checked) {
			$check.addClass(activeCls);
		} else {
			$check.removeClass(activeCls);
		}
		$chkbox.prop('checked', checked);
		//console.log($chkbox.attr('id'), $chkbox.prop('checked'));
	}
	
	//bind button event
	$checks.on('click', function(e){
		e.preventDefault();
		var $check = $(this);
		updateCheck($check, true);
	});
	
	//init states
	$.each($checks, function(idx,ele){
		updateCheck($(ele), false);
	});	
}