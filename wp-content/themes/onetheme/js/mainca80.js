;
(function ($, window, document, undefined) {
    "use strict";
    $('[data-bg-image]').each(function(){
        $(this).css({ 'background-image': 'url('+$(this).data('bg-image')+')' });
    });

    $('[data-bg-color]').each(function(){
        $(this).css({ 'background-color': $(this).data('bg-color') });
    });

    $('[data-width]').each(function(){
        $(this).css({ 'width': $(this).data('width') });
    });

    $('[data-height]').each(function(){
        $(this).css({ 'height': $(this).data('height') });
    });

    $('[data-alpha]').each(function(){
        $(this).css({ 'opacity': $(this).data('alpha') });
    });
   

     $('div[data-overlay]').each(function(){
        var $row = $(this);
        var $overlay = $('<div class="vc-row-overlay" style="background-color:'+$row.data('overlay')+'; opacity:'+$row.data('overlay-alpha')+';"></div>');
        $row.prepend( $overlay );
        }); 

     
    /*============================*/
    /* 01 - VARIABLES */
    /*============================*/

    var swipers = [],
        winW, winH, winScr, _isresponsive, smPoint = 768,
        mdPoint = 992,
        lgPoint = 1200,
        addPoint = 1600,
        _ismobile = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i);

    /*========================*/
    /* 02 - PAGE CALCULATIONS */
    /*========================*/
    function pageCalculations() {
        winW = $(window).width();
        winH = $(window).height();
    }


    /*=================================*/
    /* 03 - FUNCTION ON DOCUMENT READY */
    /*=================================*/
    pageCalculations();

    
    /*============================*/
    /* 04 - FUNCTION ON PAGE LOAD */
    /*============================*/

    $(window).on('load', function () {
        //preloader
        $('.wpc-preload').delay(1000).fadeOut(700);
        pageCalculations();
        initSwiper();
        wpc_add_img_bg('.wpc-back-img');
        wpcFirstLetter();
        isotopeInit();
        colEqualH('.equal-height');
        
        cartButtonTop();
    });

    function cartButtonTop() {
        $('.woocommerce .add_to_cart_button').each(function(){
            var _height = $(this).parent().find('a img').height();
            $(this).css('top', _height - 60);
        });
    }

    /***********************************/
    /* 05 - WINDOW SCROLL*/
    /**********************************/
    $(window).on('scroll', function () {
        counters();
        wpcProgress();
    });


    /*==============================*/
    /* 06 - FUNCTION ON PAGE RESIZE */
    /*==============================*/
    $(window).on('resize', function () {
        colEqualH('.equal-height');
        cartButtonTop();        
    });
    
    $(window).on('resize orientationchange', function () {
        resizeCall();
    });
    
    function resizeCall() {
        pageCalculations();
        $('.swiper-container.initialized[data-slides-per-view="responsive"]').each(function () {
            var thisSwiper = swipers['swiper-' + $(this).attr('id')],
                $t = $(this),
                slidesPerViewVar = updateSlidesPerView($t),
                centerVar = thisSwiper.params.centeredSlides;
            thisSwiper.params.slidesPerView = slidesPerViewVar;
            thisSwiper.reInit();
            if (!centerVar) {
                var paginationSpan = $t.find('.pagination span');
                var paginationSlice = paginationSpan.hide().slice(0, (paginationSpan.length + 1 - slidesPerViewVar));
                if (paginationSlice.length <= 1 || slidesPerViewVar >= $t.find('.swiper-slide').length) $t.addClass('pagination-hidden');
                else $t.removeClass('pagination-hidden');
                paginationSlice.show();
            }
        });
    }


    /*==============================*/
    /* 07 - MENU                    */
    /*==============================*/
    var $first_child_link = $('.menu-item-has-children > a').append('<span class="expand-collapse-link"></span>');

    $('.nav-menu-icon').on('click', function (e) {
        $(this).toggleClass('active');
        $('.wpc-navigation').toggleClass('active');
    });

    $first_child_link.find('span').on('click', function (e) {
        $(this).closest('li').toggleClass('active');
    });

    

    // mobile menu
    
    $('.menu-item-has-children>a,.page_item_has_children>a').on('click', function(event){
        if(!$(this).parent().hasClass('expanded')) {
            event.preventDefault();
            $(this).parent().siblings().removeClass('expanded');
            $(this).parent().addClass('expanded');
        }
    });
    $('.expand-collapse-link').on('click', function(event){
        event.preventDefault();
        $(this).parent().toggleClass('expanded');
    });
    // end mobile menu

    /*=====================*/
    /* 08 - SWIPER SLIDERS */
    /*=====================*/
    function initSwiper() {
        var initIterator = 0;
        $('.swiper-container').each(function () {
            var $t = $(this);

            var index = 'swiper-unique-id-' + initIterator;

            $t.addClass('swiper-' + index + ' initialized').attr('id', index);
            $t.find('.pagination').addClass('pagination-' + index);

            var autoPlayVar = parseInt($t.attr('data-autoplay'), 10);
            var mode = $t.attr('data-mode');
            var slidesPerViewVar = $t.attr('data-slides-per-view');

            if (slidesPerViewVar == 'responsive') {
                slidesPerViewVar = updateSlidesPerView($t);
            } else {
                slidesPerViewVar = parseInt(slidesPerViewVar, 10);
            }

            var loopVar = parseInt($t.attr('data-loop'), 10);
            var speedVar = parseInt($t.attr('data-speed'), 10);
            var centerVar = parseInt($t.attr('data-center'), 10);
            swipers['swiper-' + index] = new Swiper('.swiper-' + index, {
                speed: speedVar,
                spaceBetween: 20,
                pagination: '.pagination-' + index,
                loop: loopVar,
                paginationClickable: true,
                autoplay: autoPlayVar,
                slidesPerView: slidesPerViewVar,
                keyboardControl: true,
                calculateHeight: true,
                simulateTouch: true,
                roundLengths: true,
                centeredSlides: centerVar,
                mode: mode || 'horizontal',
                onInit: function (swiper) {
                    $t.find('.swiper-slide').addClass('active');
                },
                onSwiperCreated: function (swiper) {
                    $t.find('.swiper-slide').addClass('active');
                    
                    arrowsBg(swiper, 'swiperCreated' , loopVar);
                },
                onSlideChangeEnd: function (swiper) {
                    var activeIndex = (loopVar === 1) ? swiper.activeLoopIndex : swiper.activeIndex;
                    var qVal = $t.find('.swiper-slide-active').attr('data-val');
                    $t.find('.swiper-slide[data-val="' + qVal + '"]').addClass('active');
                },
                onSlideChangeStart: function (swiper) {
                    $t.find('.swiper-slide.active').removeClass('active');
                    
                    arrowsBg(swiper, 'slideStart' , loopVar);
                }
            });
            swipers['swiper-' + index].reInit();
            if ($t.attr('data-slides-per-view') == 'responsive') {
                var paginationSpan = $t.find('.pagination span');
                var paginationSlice = paginationSpan.hide().slice(0, (paginationSpan.length + 1 - slidesPerViewVar));
                if (paginationSlice.length <= 1 || slidesPerViewVar >= $t.find('.swiper-slide').length) $t.addClass('pagination-hidden');
                else $t.removeClass('pagination-hidden');
                paginationSlice.show();
            }

            if ($t.find('.default-active').length) {
                swipers['swiper-' + index].swipeTo($t.find('.swiper-slide').index($t.find('.default-active')), 0);
            }

            initIterator++;
        });

    }

    function updateSlidesPerView(swiperContainer) {
        if (winW >= addPoint) return parseInt(swiperContainer.attr('data-add-slides'), 10);
        else if (winW >= lgPoint) return parseInt(swiperContainer.attr('data-lg-slides'), 10);
        else if (winW >= mdPoint) return parseInt(swiperContainer.attr('data-md-slides'), 10);
        else if (winW >= smPoint) return parseInt(swiperContainer.attr('data-sm-slides'), 10);
        else return parseInt(swiperContainer.attr('data-xs-slides'), 10);
    }
    
    //function changes arrow background
    function arrowsBg(swiper, mode , loopVar){
        var callBackType = mode;
        //executes when arrows are inside swiper
        if($(swiper.activeSlide()).closest('.swiper-container').find('.wpc-image-arrows').length){
            
            $('.wpc-image-arrows').each(function(){
                var $self = $(this),
                    $swiperEl = $self.closest('.swiper-container'),
                    $swiperSlides = $swiperEl.find('.swiper-slide'),
                    activeIndex = (loopVar === 1) ? swiper.activeLoopIndex : swiper.activeIndex,
                    leftArrow = $self.find('.swiper-arrow-left'),
                    rightArrow = $self.find('.swiper-arrow-right'),
                    prevImage,
                    nextImage;

                    //definition of swiper callback
                    if(callBackType == 'slideStart'){
                        prevImage = $swiperSlides.eq(activeIndex).find('.wpc-back-img').attr('src'),
                        nextImage = $swiperSlides.eq(activeIndex + 2).find('.wpc-back-img').attr('src');    
                    }else if(callBackType == 'swiperCreated'){
                        prevImage = $swiperSlides.eq(activeIndex - 2).find('.wpc-back-img').attr('src'),
                        nextImage = $swiperSlides.eq(activeIndex + 2).find('.wpc-back-img').attr('src');
                    }

                    leftArrow.css('background-image', 'url(' + prevImage +')');
                    rightArrow.css('background-image', 'url(' + nextImage +')');
            });
        }
    }

    //swiper arrows
    $('.swiper-arrow-left').on('click', function () {
        swipers['swiper-' + $(this).closest('.swiper-container').attr('id')].swipePrev();
    });

    $('.swiper-arrow-right').on('click', function () {
        swipers['swiper-' + $(this).closest('.swiper-container').attr('id')].swipeNext();
    });

    $('.swiper-outer-left').on('click', function () {
        swipers['swiper-' + $(this).parent().find('.swiper-container').attr('id')].swipePrev();
    });

    $('.swiper-outer-right').on('click', function () {
        swipers['swiper-' + $(this).parent().find('.swiper-container').attr('id')].swipeNext();
    });
    
    $('.outer-slider-arrows .swiper-outer-left-2').on('click', function () {
        swipers['swiper-' + $(this).parent().parent().find('.swiper-container').attr('id')].swipePrev();
    });

    $('.outer-slider-arrows .swiper-outer-right-2').on('click', function () {
        swipers['swiper-' + $(this).parent().parent().find('.swiper-container').attr('id')].swipeNext();
    });



    /***********************************/
    /* VIDEO*/
    /**********************************/
    $('.cut_video_btn').on("click", function () {
        var video = $(this).data('video');
        $(this).parents('.cut_video_block').addClass('active');
        $(this).siblings('.cut_video_iframe').attr('src', video);
        return false;
    });
    $('.cut_video_close').on("click", function () {
        $(this).parents('.cut_video_block').removeClass('active');
        $(this).siblings('.cut_video_iframe').attr('src', 'about:blank');
        return false;
    });



    /***********************************/
    /* BACKGROUND*/
    /**********************************/

    //sets child image as a background
    function wpc_add_img_bg( img_sel, parent_sel){
    
        if (!img_sel) {
          console.info('no img selector');
          return false;
        }

        var $parent, $imgDataHidden, _this;

        $(img_sel).each(function(){
          _this = $(this);
          $imgDataHidden = _this.data('s-hidden');
          $parent = _this.closest( parent_sel );
          $parent = $parent.length ? $parent : _this.parent();
          $parent.css( 'background-image' , 'url(' + this.src + ')' ).addClass('wpc-back-bg');
            if ($imgDataHidden) {
                _this.css('visibility', 'hidden');
            } else {
                _this.hide();
            }
        });

      }
    


    /***********************************/
    /* COUNTER */
    /**********************************/
    var counters = function () {
        $(".wpc-counter .counter").not('.animated').each(function () {
            if ($(window).scrollTop() >= $(this).offset().top - $(window).height() * 0.9) {
                $(this).addClass('animated').countTo({
                    formatter: function (value, options) {
                        value = value.toFixed(options.decimals);
                        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                        return value;
                      } 
                });
            }
        });
    }
    
    
    
    /***********************************/
    /* MAGNIFIC POPUP */
    /**********************************/
    if ($('.popup-gallery').length) {
		$('.popup-gallery').magnificPopup({
			delegate: '.view-item',
			type: 'image',
			removalDelay: 100,
			mainClass: 'mfp-fade',
			closeBtnInside: false,
			gallery: {
				enabled: true,
			},
			callbacks: {
              	beforeOpen: function() {
                	this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure animated ' + this.st.el.attr('data-effect'));
            	}
            }

		});
	}

    
    /***********************************/
    /* TABS */
    /**********************************/
    $('.tabs-header').on('click', 'li:not(.active)', function() {
        var index_el = $(this).index();

        $(this).addClass('active').siblings().removeClass('active');
        $(this).closest('.tabs').find('.tabs-item').removeClass('active').eq(index_el).addClass('active');
        return false;

    });
    
    
    
    /***********************************/
    /* SKILLS */
    /**********************************/ 
    function wpcProgress(){
        if($('.wpc-skills').length) {
             $('.wpc-skills').not('.animated').each(function(){
                var self = $(this);    
                if($(window).scrollTop() >= self.offset().top - $(window).height() ){
                    self.addClass('animated').find('.timer').countTo();

                    self.find('.line-fill').each(function(){
                        var objel = $(this);
                        var pb_width = objel.attr('data-width-pb');
                        objel.css({'width':pb_width});
                    });
                }
 
             });      
         }
    }    
    
    
    /***********************************/
    /* FIRST LETTER STYLING */
    /**********************************/ 
    function wpcFirstLetter(){
        $(".wpc-first-let").each(function(){
            var self = $(this);
            var elem = self.contents().filter(function () { return this.nodeType == 3 }).first(),
            text = elem.text().trim(),
            first = text.slice(0, 1);
            if (!elem.length)
                return;

            elem[0].nodeValue = text.slice(first.length);
            elem.before('<span class="wpc-letter">' + first + '</span>');
        });
    }
    
    
    
     /***********************************/
    /* ISOTOPE */
    /**********************************/ 
    function isotopeInit(){
        if ($('.izotope-container').length) { 
            var $container = $('.izotope-container');
            
            $('.izotope-container').each(function(){
               var self = $(this);
                var layoutM = self.attr('data-layout') || 'masonry';
                self.isotope({
                    itemSelector: '.item',
                    layoutMode: layoutM,
                    masonry: {
                        columnWidth: '.item'
                    }
                }); 
            });
            
			$('#filters').on('click', '.but', function() {
			 	var izotope_container = $('.izotope-container');

			 	for (var i = izotope_container.length - 1; i >= 0; i--) {
			 		$(izotope_container[i]).find('.item').removeClass('animated');
				}

				$('#filters .but').removeClass('activbut');
				$(this).addClass('activbut');
				var filterValue = $(this).attr('data-filter');
				$container.isotope({filter: filterValue});
                
                
				return false;
			});  
        }    
    }
    
    
    /***********************************/
    /* COLUMN EQUAL HEIGHT */
    /**********************************/ 
    function colEqualH(parent){
        var parentElem = $(parent);
        var cols = parentElem.find('.project-item');
        if($(window).width() >= 480){
            var heights = cols.map(function (){
                return $(this).outerHeight();
            }).get();
            var maxHeight = Math.max.apply(null, heights);
            
            cols.css('height', '100%');
            setTimeout(function(){
                cols.outerHeight(maxHeight);    
            },0);   
        }else{
            cols.css('height', 'auto');   
        }
    }
    
    
    
    /***********************************/
    /* TIME COUNTER */
    /**********************************/ 
    if ($('.wpc-coming-soon').length) {
        $('.wpc-coming-soon').each(function(){
            var self = $(this);
            var endTime = self.attr('data-end');
            
            self.countdown(endTime, function(event) {
                $(this).html(event.strftime('<span class="comming-soon-item"><span class="item-time">%D</span><span class="item-title">DAYS</span></span><span class="comming-soon-item"><span class="item-time">%H</span><span class="item-title">HOURS</span></span><span class="comming-soon-item"><span class="item-time">%M</span><span class="item-title">MINS</span></span><span class="comming-soon-item"><span class="item-time">%S</span><span class="item-title">SEC</span></span>'));
            });
        });    
    }
    
    
    /***********************************/
    /* ACCORDION */
    /**********************************/
    $('.wpc-accordion').on('click', '.panel-title', function(){
        var self = $(this);
        var panelWrap = self.parent();
        panelWrap.find('.panel-collapse').slideToggle('200');
        self.closest('.wpc-accordion').find('.panel-wrap').removeClass('active');
        panelWrap.toggleClass('active');
        panelWrap.siblings().find('.panel-collapse').slideUp('200');
               
    });
    
    
    /***********************************/
    /* LOAD MORE */
    /**********************************/
    $('.wpc-more').on('click', function(){
        var self = $(this),
            hiddenItems = $('.hidden-item');
        
        hiddenItems.slice(0,1).each(function(){
            $(this).fadeIn().removeClass('hidden-item');
        });
        
        if($('.hidden-item').length == 0){
            self.hide();    
        }
        return false;
    });
    
    
    /***********************************/
    /* MAP */
    /**********************************/ 
    if( $('.wpc-map').length ) {
        $('.wpc-map').each(function() {
            initialize(this);
        });
    }
    
    

    
    
    /***********************************/
    /* CART */
    /**********************************/ 
    $('.media-remove').on('click', function(){
        $(this).closest('.wpc-cart-item').remove();
        return false;
    });
    
    
    //buttons
    $('.qchange-btn').on('click', function(e){
        e.preventDefault();
        var self = $(this),
            qchangeWrap = self.parent(),
            changeInp = qchangeWrap.find('.qchange-inp'),
            itemsAmount = +changeInp.val();
        //alert(typeof itemsAmount);
        
        if(self.hasClass('qchange-minus')){
            itemsAmount = itemsAmount == 1 ? 1 : itemsAmount -= 1; 
        }else{
           itemsAmount += 1; 
        }
        
        changeInp.val(itemsAmount);
        
        qResult(self, itemsAmount);
        
    });
    
    //input
    $(".qchange-inp").on('keydown', function (e) {
        var self = $(this);
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) || 
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
    
    $(".qchange-inp").on('keyup', function(){
        var self = $(this);
        qResult(self, +self.val());
    });
    
    //third column result
    function qResult(elem, itemsAmount){
        elem.closest('.wpc-cart-item').find('.quantity-result').text(itemsAmount);
    }
    
     /* login form */
    $('.login-btn').magnificPopup({
        type: 'inline',
        preloader: false,
        mainClass: 'mfp-fade',
        // When elemened is focused, some mobile browsers in some cases zoom in
        // It looks not nice, so we disable it:
        callbacks: {
            beforeOpen: function() {
                if($(window).width() < 700) {
                    this.st.focus = false;
                } else {
                    this.st.focus = '#name';
                }
            }
        }
    });
    /*search pop up*/
    $('a[href="#search"]').on('click', function(event) {                    
        $('#search').addClass('open');
        $('#search > form > input[type="search"]').focus();
    });            
    $('#search, #search button.close').on('click keyup', function(event) {
        if (event.target == this || event.target.className == 'close' || event.keyCode == 27) {
            $(this).removeClass('open');
        }
    });
    /*end search up*/
    

})(jQuery, window, document);