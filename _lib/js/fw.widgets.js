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

	/* -------------------------------------------------------------------------- */
	//vars
	var //collection obj
		sliders = { count:0 },

		//properties
		ns = 'slider',
		hasTouch = Modernizr.touch,
		evtDown = hasTouch ? 'touchstart' : 'mousedown',
		evtUp = hasTouch ? 'touchend' : 'mouseup',
		evtMove = hasTouch ? 'touchmove' : 'mousemove',

		//selectors
		sliderSelector = '.slider',
		trackSelector = '.sliderTrack',
		liveTrackSelector = '.sliderTrack.live',
		indicatorTrackSelector = '.sliderTrack.indicator',
		markSelector = '.sliderMark',
		labelSelector = '.sliderLabel',
		knobSelector = '.sliderKnob',
		inputSelector = 'input',
		overlapCls = 'overlap',
		draggingCls = 'dragging',

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

	/* -------------------------------------------------------------------------- */
	/* utils */

	//getStepColors
	sliders.getStepColors = function(id){
		//vars
		var slider = sliders[ns+id];
		//store step colors for the first time
		$.each(slider.$marks, function(idx,ele){
			var $mark = $(ele);
			if (slider.stepColors.length < slider.$marks.length) {
				slider.stepColors[idx] = $mark.attr('data-color');
			}
		});
	};

	//validateValue
	sliders.validateValue = function(id){
		//vars
		var slider = sliders[ns+id],
			inputVal = parseInt(slider.$input.val(),10),
			indicatorVal = parseInt(slider.$indicatorTrack.attr('data-step'),10);
		//get latest value from DOM
		slider.value = (inputVal > 1) ? inputVal : 1;
		slider.indicatorValue = indicatorVal ? indicatorVal : 0;
		//validate values
		if (slider.value > slider.steps) slider.value = slider.steps;
		if (slider.indicatorValue > slider.steps) slider.indicatorValue = slider.steps;
	};

	//ratioToValue
	sliders.ratioToValue = function(id, ratio){
		//vars
		var slider = sliders[ns+id],
			vals = slider.stepVals.slice(0),
			steps = vals.length,
			stepDiff,
			value;
		//update vals to integer
		while (steps--) {
			vals[steps] = parseInt(vals[steps], 10);
		}
		//find neighbors
		steps = vals.length;
		while (steps-- && steps > 0) {
			stepDiff = vals[steps] - vals[steps-1];
			if (ratio >= (vals[steps-1] + stepDiff/2)) {
				value = steps + 1;
				//console.log('[Range '+steps+']', 'Mark: '+(vals[steps-1] + stepDiff/2), 'Ratio: '+ratio, 'Value: '+value);
				break;
			} else {
				value = steps;
				//console.log('['+steps+']', (vals[steps-1] + stepDiff/2), ratio, value);
			}
		}
		return value;
	};

	/* -------------------------------------------------------------------------- */
	/* setSlider */

	//setSliderByValue
	sliders.setSliderByValue = function(id, val){
		//vars
		var slider = sliders[ns+id];
		slider.$input.val(val);
		slider.$input.trigger('change');
	};

	//setSliderByRatio
	sliders.setSliderByRatio = function(id){
		//vars
		var slider = sliders[ns+id],
			ratio = slider.ratio,
			value;
		//convert ratio to step
		sliders.value = value = sliders.ratioToValue(id, ratio);
		//console.log('ratioToValue ->', value);
		//set value
		sliders.setSliderByValue(id, value);
	};

	/* -------------------------------------------------------------------------- */
	/* update */

	//updateTracks
	sliders.updateTracks = function(id){
		//vars
		var slider = sliders[ns+id];
		//tracks
		$.each(slider.$tracks, function(idx,ele){
			var $track = $(ele),
				dataStep = $track.attr('data-step'),
				step = dataStep ? parseInt(dataStep, 10) : 1,
				val = slider.stepVals[step - 1];
			//skip liveTrack
			if ($track.hasClass('live')) return false;
			//update tracks
			$track
				.css('width', val)
				.attr('data-value', val);
		});
	};

	//updateMarks
	sliders.updateMarks = function(id){
		//vars
		var slider = sliders[ns+id];
		//marks / labels
		$.each(slider.$marks, function(idx,ele){
			var $mark = $(ele),
				$label = slider.$labels.eq(idx),
				val = slider.stepVals[idx],
				step = idx+1,
				norm = passed = current = indicator = false;
			//determine individual mark state
			$mark.removeClass('passed current indicator');
			if (step < slider.value) {
				passed = true;
				$mark.addClass('passed');
			} else if (step == slider.value) {
				current = true;
				$mark.addClass('current');
			} else if (step > slider.value) {
				norm = true;
			}
			if (step == slider.indicatorValue) {
				indicator = true;
				$mark.addClass('indicator');
			}
			//update mark
			$mark
				.css('left', val)
				.attr('data-value', val);
			$label
				.css('left', val)
				.attr('data-value', val);

			//update mark step color
			if ($mark.hasClass('passed') && !$mark.hasClass('indicator')) {
				$mark.css('background-color', slider.stepColors[ slider.value-1 ]);
			} else {
				$mark.css('background-color', '');
			}
		});
	};

	//updateLiveTrack
	sliders.updateLiveTrack = function(id){
		//vars
		var slider = sliders[ns+id],
			val = slider.stepVals[slider.value - 1];
		//livetrack
		slider.$liveTrack
			.attr('data-step', slider.value)
			.css('width', val)
			.attr('data-value', val);
		//livetrack color
		slider.$liveTrack.css('background-color', slider.stepColors[ slider.value-1 ]);
	};

	//updateKnob
	sliders.updateKnob = function(id){
		//vars
		var slider = sliders[ns+id],
			overlap = (slider.value == slider.indicatorValue) ? true : false;
		//knob value
		slider.$knob
			.css('left', slider.stepVals[slider.value-1])
			.attr('data-value', slider.stepVals[slider.value-1])
			.attr('data-step', slider.value);
		//knob overlap
		if (overlap) {
			slider.$knob.addClass(overlapCls);
		} else {
			slider.$knob.removeClass(overlapCls);
		}
		//knob color
		slider.$knob.css('background-color', slider.stepColors[ slider.value-1 ]);
		//value
		slider.$input.val(slider.value);
	};

	/* -------------------------------------------------------------------------- */
	/* interaction */

	//cleanUpDragStyle
	sliders.cleanUpDragStyle = function(id){
		//vars
		var slider = sliders[ns+id];
		slider.$liveTrack.css('background-image','');
	};

	//bindMarks
	sliders.bindMarks = function(id){
		//vars
		var slider = sliders[ns+id];
		//marks
		$.each(slider.$marks, function(idx,ele){
			var $mark = $(ele);
			$mark.off();
			$mark.on('click', function(e){
				e.preventDefault();
				sliders.setSliderByValue(id, idx+1);
			});
		});
	};

	//initDrag
	sliders.initDrag = function(id){
		//vars
		var slider = sliders[ns+id],
			hasTouch = Modernizr.touch,
			$body = $('body'),
			hasCSSGradient = Modernizr.cssgradients,
			gradientSettings = {
				gradientProps:{
					'type'   : 'linear',
					'xStart' : 'left',
					'yStart' : 'top',
					'xEnd'   : 'right',
					'yEnd'   : 'top'
				},
				gradients:[
					{hex:'#000000', pos:0},
					{hex:'#ffffff', pos:100}
				]
			},

			//updateDraggingValue
			updateDraggingValue = function(){
				slider.$liveTrack.css('width', slider.cssRatio);
				slider.$liveTrack.attr('data-value', slider.cssRatio);
				slider.$knob.css('left', slider.cssRatio);
				slider.$knob.attr('data-value', slider.cssRatio);
				//console.log(ns + slider.id, 'domDrag->', slider.cssRatio);
			},

			//updateDraggingBg
			updateDraggingBg = function(){
				//var
				var //value and colors
					ratio = slider.ratio,
					value = sliders.ratioToValue(id, ratio),
					colorStart = slider.stepColors[0],
					colorEnd = slider.stepColors[value-1],
					cssGradient,
					//elems
					$track = slider.$liveTrack,
					$knob = slider.$knob;
					//console.log(ratio, value, colorStart, colorEnd);

				//update gradient
				gradientSettings.gradients[0].hex = colorStart;
				gradientSettings.gradients[1].hex = colorEnd;
				cssGradient = Gradient.generateAll(gradientSettings);

				//update view
				$knob.css('background', colorEnd);
				$track.css('background-color', colorEnd);
				if (hasCSSGradient) $track[0].style.cssText += cssGradient;
			};

		//drag handler
		slider.pagePos = 0;
		slider.domDrag = function(e) {
			//vars
			var pagePos,
				pageX = hasTouch ? e.originalEvent.targetTouches[0].pageX : e.pageX,
				pageY = hasTouch ? e.originalEvent.targetTouches[0].pageY : e.pageY;

			//determine drag position
			pagePos = pageX - slider.$el.offset().left;
			pagePos = Math.min(slider.$el.outerWidth(), pagePos);
			pagePos = Math.max(0, pagePos);

			//convert drag position to ratio
			if (slider.pagePos != pagePos) {
				slider.pagePos = pagePos;
				slider.ratio = slider.pagePos / slider.$el.outerWidth() * 100;
				slider.cssRatio = slider.ratio + '%';
			}

			//update view
			updateDraggingValue();
			updateDraggingBg();
		};

		//binding interaction
		slider.$knob.on(evtDown, function(e) {
			//console.log(evtDown);
			//$(slider.$el.parents('.section')).prev('.secHeader').find('.label').text(evtDown);
			e.preventDefault();
			slider.dragging = true;
			slider.$el.addClass(draggingCls);
			slider.domDrag(e);
		});
		$body.on(evtMove, function(e) {
			//console.log(evtMove);
			//$(slider.$el.parents('.section')).prev('.secHeader').find('.label').text(evtMove);
			if (slider.dragging) {
				slider.domDrag(e);
				return $body.css('cursor', 'pointer');
			}
		})
		.on(evtUp, function(e) {
			//console.log(evtUp);
			//$(slider.$el.parents('.section')).prev('.secHeader').find('.label').text(evtUp);
			if (slider.dragging) {
				slider.dragging = false;
				slider.$el.removeClass(draggingCls);
				sliders.cleanUpDragStyle(id);
				sliders.setSliderByRatio(id);
				return $body.css('cursor', 'auto');
			}
		});
	};

	/* -------------------------------------------------------------------------- */
	/* instances */

	//search DOM for instances
	$.each($(sliderSelector), function(idx, ele){
		var //control obj
			slider,
			sliderID = idx + 1,

			//elems
			$slider = $(ele),
			$sliderInput = $slider.find(inputSelector),
			$sliderTracks = $slider.find(trackSelector),
			$sliderTrackLive = $slider.find(liveTrackSelector),
			$sliderTrackIndicator = $slider.find(indicatorTrackSelector),
			$sliderMarks = $slider.find(markSelector),
			$sliderLabels = $slider.find(labelSelector),
			$sliderKnob = $slider.find(knobSelector).first();

		//add instance to control and collection objs
		sliders[ns + sliderID] = slider = {
			//elems
			$el:			$slider,
			$tracks:		$sliderTracks,
			$liveTrack:		$sliderTrackLive,
			$indicatorTrack:$sliderTrackIndicator,
			$marks:			$sliderMarks,
			$labels:		$sliderLabels,
			$knob:			$sliderKnob,
			$input:			$sliderInput,

			//properties/data
			id:				sliderID,
			steps:			$sliderMarks.length,
			stepVals:		getStepValues($sliderMarks),
			stepColors:		[],
			value:			0,
			indicatorValue: 0,

			//dragging
			dragging:		false,

			//functions
			init:			function(){
								//update on init
								sliders.getStepColors(sliderID);
								sliders.validateValue(sliderID);
								sliders.updateTracks(sliderID);
								sliders.updateMarks(sliderID);
								sliders.updateLiveTrack(sliderID);
								sliders.updateKnob(sliderID);
								sliders.initDrag(sliderID);

								//call slider.update on value change
								this.$input.on('change', this.update);

								//marks as value trigger
								sliders.bindMarks(sliderID);

								console.log(ns + sliderID, 'init->', this.value);
							},
			update:			function(e){
								sliders.validateValue(sliderID);
								sliders.updateMarks(sliderID);
								sliders.updateLiveTrack(sliderID);
								sliders.updateKnob(sliderID);

								console.log(ns + sliderID, 'update->', this.value);
							}
		};
		sliders.count++;

		//init instance
		slider.init();
	});

	//return to DOM
	return sliders;
}
/* ------------------------------------------------------------------------------ */
/* initCharts */
/* ------------------------------------------------------------------------------ */
function initCharts() {

	/* -------------------------------------------------------------------------- */
	//vars
	var //collection obj
		charts = { count:0 },

		//properties
		ns = 'chart',
		hasCanvas = Modernizr.canvas,

		//selectors
		chartSelector = '.chart';

	/* -------------------------------------------------------------------------- */
	/* properties */
	charts.defaultConfig = {
		barColor	:	'#87827b',
		trackColor	:	'#dad6cf',
		scaleColor	:	false,
		lineCap		:	'butt',
		lineWidth	:	12,
		size		:	160,
		rotate		:	0,
		animate		:	hasCanvas ? 3000 : false,
		delay		:	false,
		onStart		:	function(){},
		onStop		:	function(val){},
		onStep		:	function(val){ /*console.log(this.$el)*/ }
	};

	/* -------------------------------------------------------------------------- */
	/* functions */

	/* prepChart */
	charts.prepChart = function(id){
		//vars
		var chart = charts[ns+id];

		//merge chart config with default config
		chart.config = $.extend(chart.config, charts.defaultConfig);
	};

	/* drawChart */
	charts.drawChart = function(id){
		//vars
		var chart = charts[ns+id];
		//init plugin instance and store in instance obj
		chart.$el.easyPieChart(chart.config);
		chart.$easyPieChart = chart.$el.data('easyPieChart');
	};

	/* updateChart */
	charts.updateChart = function(id){
		//vars
		var chart = charts[ns+id];

		//call plugin in instance obj
		chart.$easyPieChart.update( chart.value );
	};

	/* -------------------------------------------------------------------------- */
	/* instances */

	//search DOM for instances
	$.each($(chartSelector), function(idx, ele){
		var //control obj
			chart,
			chartID = idx + 1,

			//elems
			$chart = $(ele);

		//add instance to control and collection objs
		charts[ns + chartID] = chart = {
			//elems
			$el:			$chart,

			//properties/data
			id:				chartID,
			config:			{},
			value:			0,

			//functions
			init:			function(){
								charts.prepChart(chartID);
								charts.drawChart(chartID);

								console.log(ns + chartID, 'init->', this.value);
							},
			update:			function(){
								charts.prepChart(chartID);
								charts.updateChart(chartID);

								console.log(ns + chartID, 'update->', this.value);
							}
		};
		charts.count++;

		//init instance
		chart.init();
	});

	//return to DOM
	return charts;
}
