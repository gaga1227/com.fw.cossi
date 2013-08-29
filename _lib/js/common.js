/* ------------------------------------------------------------------------------ */
/* webfonts */
/* ------------------------------------------------------------------------------ */
WebFontConfig = { 
	google: 		{ families: [ 'Merriweather:400,700:latin', 'Montserrat:400,700:latin' ] },
	loading: 		function() { console.log('[WF] loading'); 	WebFontUtils.onWFLoading(); },
	active: 		function() { console.log('[WF] active'); 	WebFontUtils.onWFActive(); 	 WebFontUtils.onWFComplete(); },
	inactive: 		function() { console.log('[WF] inactive'); 	WebFontUtils.onWFInactive(); WebFontUtils.onWFComplete(); },
	fontloading: 	function( familyName, fvd ) { console.log( '[WF] ' + familyName, fvd, 'loading' ); },
	fontactive: 	function( familyName, fvd ) { console.log( '[WF] ' + familyName, fvd, 'active' ); },
	fontinactive: 	function( familyName, fvd ) { console.log( '[WF] ' + familyName, fvd, 'inactive' ); },
	timeout: 		5000
};
WebFontUtils = {
	onWFLoading: 	function()	{
									//show loader
									
								},
	onWFComplete: 	function()	{
									//hide loader
									
									//isotope tiles
									if ( $('body#home').length || $('body.landing').length ) {
										$isotope = new initIsotope();
									}
								},
	onWFActive: 	function()	{},
	onWFInactive: 	function()	{}
}
/* ------------------------------------------------------------------------------ */
/* initIsotope */
/* ------------------------------------------------------------------------------ */
function initIsotope(){
	//vars
	var $container = $('.isotopeContainer'),
		colW = 320,
		isotopeIsOn = false;
	//update handler
	function update(){
		//check mq
		var isotopeRequired = Modernizr.mediaqueries ? !Modernizr.mq(mqStates.max400) : $(window).width() > 400;
		//toggle isotope
		if (isotopeRequired) {
			//check flag
			if (isotopeIsOn) return '[isotope] already on';
			//update flag
			isotopeIsOn = true;
			//imagesLoaded
			$container.imagesLoaded(function(){
				//isotope
				$container.isotope({
					itemSelector:	'.item.tile',
					layoutMode:		'masonry',
					masonry:		{ 
										columnWidth: colW,
										cornerStampSelector: '.corner-stamp'
									}
				}, function($items){
					console.log('[isotope] anim complete');	
				});
				console.log('[isotope] initialised');				
			});	
		} else {
			//check flag
			if (!isotopeIsOn) return '[isotope] already off';
			//update flag
			isotopeIsOn = false;
			//destroy
			$container.isotope('destroy');
			console.log('[isotope] destroyed');
		}	
	}
	//init call
	update();
	//bind update to window resize
	$(window).bind('resize', update);
	//return global obj
	return $container;
}
/* ------------------------------------------------------------------------------ */
/* initClickLoading */
/* ------------------------------------------------------------------------------ */
function initClickLoading(){
	//vars
	var $container = $('.isotopeContainer'),
		$btnLoad = $('#btnLoadMore'),
		loadingCls = 'loading',
		errorCls = 'error',
		url = 'ajax-items.html';
	
	//loadMoreItem
	function loadMoreItem(targetURL){
		//vars
		var request,
			thisObj = this,
			url = targetURL;
	
		//abort if no url or in request already
		if (!url || this.inRequest) return false;
	
		//otherwise set in request status and show loader
		this.inRequest = true;
	
		//show loader
		$btnLoad.removeClass(errorCls);
		$btnLoad.addClass(loadingCls);
	
		//make request call
		request = $.ajax({
			url:		url,
			type:		'GET',
			dataType:	'html',
			success:	function(data, textStatus, jqXHR) {
							//alert('getPage: success');
							console.log('[loadMoreItem]: success');
							//apply data
							addNewItems(data);
						},
			complete:	function(jqXHR, textStatus) {
							//alert('getPage: complete');
							console.log('[loadMoreItem]: complete');
							thisObj.inRequest = false;
							//hide loader
							$btnLoad.removeClass(loadingCls);
						},
			error:		function(jqXHR, textStatus, errorThrown) {
							//alert('getPage: error', textStatus, errorThrown);
							console.log('[loadMoreItem]: error', textStatus, errorThrown);
							$btnLoad.addClass(errorCls);
						}
		});
	}	
	
	//addNewItems
	function addNewItems(data){
		//console.log(data);
		var $newItems = $(data),
			isotopeRequired = Modernizr.mediaqueries ? !Modernizr.mq(mqStates.max400) : $(window).width() > 400;
		//adding to DOM
		$container.append($newItems)
		if (isotopeRequired) {
			$container.imagesLoaded(function(){
				$container.isotope('appended', $newItems);
			});
		}
	}
	
	//bind behavior
	$btnLoad.click(function(e){
		e.preventDefault();
		loadMoreItem(url);
	});
}
/* ------------------------------------------------------------------------------ */
/* initBannerSlides */
/* ------------------------------------------------------------------------------ */
function initBannerSlides(){
	//vars
	var //cache elems
		$banner = $('#banner'),
		$slides = $banner.find('.slide'),
		$btnPrev = $banner.find('.btnPrev'),
		$btnNext = $banner.find('.btnNext'),
		$line = $banner.find('.headline > span:eq(0)'),
		$lineAlt = $banner.find('.headline > span.alt:eq(0)'),	
		$btnMore = $banner.find('.btnMore'),
		
		//settings
		autoplay = ($banner.attr('data-autoplay')=='1') ? true : false,
		pauseonhover = Modernizr.touch ? false : true,
		effect = 'fade',
		
		//static
		animCls1 = 'animated',
		animCls2 = animCls1 + ' delay1',
		animCls3 = animCls1 + ' delay2',
		
		//function
		toggleAnim = function(forwardFlag, show){
			var effectCls = forwardFlag ? ' fadeInLeft' : ' fadeInRight',
				effectClsAll = ' fadeInLeft fadeInRight',
				hasBtnMore = !Modernizr.mq(mqStates.max640);
			
			if (show) {
				$line.addClass(animCls1 + effectCls);
				$lineAlt.addClass(animCls2 + effectCls);
				if (hasBtnMore) $btnMore.addClass(animCls3 + effectCls);
			} else {
				$line.removeClass(animCls1 + effectClsAll);
				$lineAlt.removeClass(animCls2 + effectClsAll);
				if (hasBtnMore) $btnMore.removeClass(animCls3 + effectClsAll);
			}
		},
		
		//callbacks
		onBefore = function( currSlide, nextSlide, opts, forwardFlag ){
			//get nextSlide data
			var $nextSlide = $(nextSlide),
				line = $nextSlide.attr('data-line'),
				lineAlt = $nextSlide.attr('data-line-alt'),
				href = $nextSlide.attr('data-href'),
				effectCls = forwardFlag ? ' fadeInLeft' : ' fadeInRight';
			
			//apply data
			$line.text(line);
			$lineAlt.text(lineAlt);
			$btnMore.attr('href', href);		
			
			//anim
			toggleAnim(forwardFlag, true);
		}, 
		onAfter = function( currSlide, nextSlide, opts, forwardFlag ){			
			//anim
			toggleAnim(forwardFlag, false);
		}, 
	
		//initiation call to player obj
		slideshowObj = $banner.cycle({
			fx:     	effect, 
			speed:  	1500, 
			timeout: 	8000,
			nowrap:		0,
			prev:   	$btnPrev, 
			next:   	$btnNext,
			slideExpr:	$slides,
			before:		onBefore,
			after:		onAfter
		});
	
	//autoplay
	slideshowObj.cycle(autoplay ? 'resume' : 'pause', false);
	
	//pause on hover
	if ( autoplay && pauseonhover ) {
		$banner.hover( function(e){
			slideshowObj.cycle('pause', true);
		}, function(e){
			slideshowObj.cycle('resume');
		} );	
	}
	
	//return slideshow player obj
	return slideshowObj;	
}
/* ------------------------------------------------------------------------------ */
/* initHomeFilter */
/* ------------------------------------------------------------------------------ */
function initHomeFilter(){
	//vars
	var $container = $('#filterTabs'),
		$tabs = $('.btnTab'),
		hasTouch = Modernizr.touch;
		
	//handlers
	onHover = function($tab, hoverOn) {
		var idx = $tab.attr('id').substr(6,1),
			hoverCls = 'hover' + idx;
		//exit if hover on active tab
		if ($tab.attr('class').indexOf('selected') != -1) {
			return false;
		}
		//update hover class
		$container.removeClass('hover1 hover2 hover3');
		if (hoverOn) $container.addClass(hoverCls);
	}
	onTabClick = function(e){
		e.preventDefault();
		var $tab = $(this),
			idx = $tab.attr('id').substr(6,1),
			selector = $tab.attr('data-filter'),
			activeCls = 'active' + idx;
		//update active class
		$container.removeClass('active1 active2 active3 hover1 hover2 hover3');
		$container.addClass(activeCls);
		//update selected state
		$tabs.removeClass('selected');
		$tab.addClass('selected');
		//isotope filter
		if ($isotope.length) $isotope.isotope({ filter: selector });
	}
	
	//hover
	if (!hasTouch) {
		$tabs.hover( function(e){
			onHover($(this), true);	
		}, function(e){
			onHover($(this), false);	
		});
	}
	
	//bind behavior
	$container.on('click', '.btnTab', onTabClick);	
}
/* ------------------------------------------------------------------------------ */
/* init */
/* ------------------------------------------------------------------------------ */
var BannerSlides, $isotope, SelectNav, Slideshows, StaticAudios, StaticVideos;
function init(){
	//layout assistance
	insertFirstLastChild('#navItems, #sideNav, #sideNav ul');
	
	//interactions	
	SelectNav = new initSelectNav();
	
	//template specific functions
	if 		( $('body#home').length ) 		{ initHome(); }
	else if ( $('body.landing').length ) 	{ initLanding(); }
	else {
		//media
		Slideshows = new initSlideshows();
		StaticAudios = new initStaticAudios();
		StaticVideos = new initStaticVideos();
		//form
		initDatepicker();
	}
	
	//debug
	displayDebugInfo('#debugInfo');
}
function initHome(){
	//banner slideshow
	BannerSlides = new initBannerSlides();
	//filter
	initHomeFilter();
}
function initLanding(){
	//initClickLoading
	initClickLoading();
}
/* DOM Ready */
$(document).ready(function(){
	console.log('DOM Ready');
	initWebFontLoader();
	Platform.addDOMClass();
	init();	
});