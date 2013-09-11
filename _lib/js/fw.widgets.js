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
/* ------------------------------------------------------------------------------ */
/* initEditors */
/* ------------------------------------------------------------------------------ */
function initEditors() {
	//vars
	var editors = { count:0 },
		$containers = $('.editorContainer'),
		config = {
			customConfig:	'',
			language:		'en-au',
			contentsCss:	'_lib/css/content-viewport.css',
			bodyClass:		'contentViewport',
			toolbar: 		'Basic',
			uiColor: 		'#687475',
			skin:			'flat',
			height:			200,
			toolbar:		[[ 'Cut', 'Copy', 'Paste', '-', 'Bold', 'Underline', 'Italic', '-', 'BulletedList', 'NumberedList' ]]
		};
	
	//exit
	if (!$containers.length) return false;
	
	//init all instances
	$.each($containers, function(idx,ele){
		var $instance = $(ele),
			id = $instance.find('textarea').attr('id');
		if (id) {
			editors['editor'+(idx+1)] = CKEDITOR.replace( id, config );
		}
		editors.count++;
	});	
	
	//return obj to DOM
	return editors;
}
/* ------------------------------------------------------------------------------ */
/* initEditorWithNotes */
/* ------------------------------------------------------------------------------ */
function initEditorWithNotes() {
	//vars
	var $contaienrs = $('.editorWithNotes');
		activeCls = 'notesActive';
	
	//search DOM for as instances
	$.each($contaienrs, function(idx, ele){
		var $instance = $(ele),
			$btnOpen = $instance.find('.btnNotes'),
			$btnClose = $instance.find('.notes .btnClose'),
			notesOpen = $instance.attr('data-notes-open') == '1' ? true : false;
		
		//update instance
		if (notesOpen) {
			$instance.addClass(activeCls);	
		} else {
			$instance.removeClass(activeCls);
		}
		$(window).trigger('resize');
		
		//bind hehavior
		$btnOpen.on('click', function(e){
			e.preventDefault();
			$instance.addClass(activeCls);
			$(window).trigger('resize');	
		});
		$btnClose.on('click', function(e){
			e.preventDefault();
			$instance.removeClass(activeCls);
			$(window).trigger('resize');	
		});
	});
}
/* ------------------------------------------------------------------------------ */
/* initSliders */
/* ------------------------------------------------------------------------------ */
function initSliders() {
	//vars
	var //collection obj
		sliders = { count:0 },
		ns = 'slider',
		
		//selectors
		sliderSelector = '.slider',
		trackSelector = '.sliderTrack',
		markSelector = '.sliderMark',
		labelSelector = '.sliderLabel',
		knobSelector = '.sliderKnob',
		inputSelector = 'input',
		
		//functions
		getStepValues = function($marks){
			var vals = [], val, hasVal, i,
				$mark, steps = $marks.length,
				avg = 100 / (steps-1);
			for ( i=0; i<steps; i++ ) {
				$mark = $marks.eq(i);
				val = $mark.attr('data-value');
				hasVal = (val && val.indexOf('%') != -1) ? true : false;
				//use given value, or calculate average
				if (hasVal) {
					vals.push(val);
				} else {
					vals.push( Math.round(avg * i) + '%' );
				}
			}
			//console.log('StepValues:', vals);
			return vals;
		}
	
	//common functions
	sliders.updateSlider = function(id){
		//vars
		var slider = sliders[ns+id];
		
		//tracks
		$.each(slider.$tracks, function(idx,ele){
			var $track = $(ele),
				dataStep = $track.attr('data-step'),
				step = dataStep ? parseInt(dataStep, 10) : 1,
				val = slider.stepVals[step - 1];
			//update tracks
			$track
				.css('width', val)
				.attr('data-value', val);
		});
				
		//marks / labels
		$.each(slider.$marks, function(idx,ele){
			var $mark = $(ele),
				$label = slider.$labels.eq(idx),
				val = slider.stepVals[idx];
			//update tracks
			$mark
				.css('left', val)
				.attr('data-value', val);
			$label
				.css('left', val)
				.attr('data-value', val);
		});
		
		//knob
		
		//value		
	}
	
	//search DOM for instances
	$.each($(sliderSelector), function(idx, ele){
		var //control obj
			slider,
			
			//elems
			sliderID = idx + 1,
			$slider = $(ele),
			$sliderInput = $slider.find(inputSelector),
			$sliderTracks = $slider.find(trackSelector),
			$sliderMarks = $slider.find(markSelector),
			$sliderLabels = $slider.find(labelSelector),
			$sliderKnob = $slider.find(knobSelector).first(); 
		
		//add instance to control and collection objs
		sliders[ns + sliderID] = slider = {
			//elems
			$el:		$slider,
			$tracks:	$sliderTracks,
			$marks:		$sliderMarks,
			$labels:	$sliderLabels,
			$knob:		$sliderKnob,
			$input:		$sliderInput,
			
			//properties/data
			id:			sliderID,
			snap:		$slider.attr('data-snap') == '1' ? true : false,
			steps:		$sliderMarks.length,
			stepVals:	getStepValues($sliderMarks),
			
			//functions
			init:		function(){ 
							sliders.updateSlider(sliderID);
						}			
		};
		sliders.count++;
		
		//init instance
		slider.init();
	});
	
	//return to DOM
	return sliders;	
}


