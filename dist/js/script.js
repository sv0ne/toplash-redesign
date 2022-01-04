$(document).ready(function () {
	var w = $(window).outerWidth();
	var isMobile = ('ontouchstart' in window);
	const $body = $('body');
	const BREAKPOINT_md1 = 1343;
	const BREAKPOINT_md2 = 992.98;
	const BREAKPOINT_md3 = 767.98;
	const BREAKPOINT_552 = 551.98;
	const BREAKPOINT_md4 = 479.98;

	// Изменение ширины окна браузера
	$(window).resize(function(){
		w = $(window).outerWidth();
		initSlider();
		dropdownResize();
	});

	//////////////////////////////////////////// Select2 ////////////////////////////////////////////

// Селект похожий на обычный
$('.js-select-once-modify').select2({ 
	minimumResultsForSearch: -1,
	dropdownCssClass: "select2-modify",
});;
	/*Когда у скролла есть wrapScroll ему нужно задать высоту 
так как его дочерний элемент абсолютно позиционирован */
function setHeightWrapScroll() {
	if($('.wrapScroll').length !== 0){
		var scrollHeight = $('.scroll').height();
		$('.wrapScroll').css('height', scrollHeight+'px');
	}
}
setHeightWrapScroll();

/* ВНИМАНИЕ!!! 
	Если кнопки скролла внутри блока .scroll то все ок, а если снаружи то для
	.scroll нужно задать data-scroll-id="" и также и для .scroll__button.btn-prev и 
	для .scroll__button.btn-next.
*/
var ScrollElement = function(elem) {
	var body = elem.find('.scroll__body');
	var scroll = elem.find('.scroll__scroll');
	var wBody = body.width();
	var wScroll = scroll.width();
	var scrollID = elem.data('scroll-id');
	if(scrollID == undefined){ // Если кнопки управления лежат внутри .scroll
		var btn_prev = elem.find('.scroll__button.btn-prev');
		var btn_next = elem.find('.scroll__button.btn-next');
	}else{ // Если кнопки управления лежат где то снаружи
		var btn_prev = $('.js-scroll-button.btn-prev[data-scroll-id='+scrollID+']');
		var btn_next = $('.js-scroll-button.btn-next[data-scroll-id='+scrollID+']');
	}
	
	var overlay_prev = elem.find('.overlayArea-prev');
	var overlay_next = elem.find('.overlayArea-next');

	// Просчитываем количество проскролла и выдаем scrollPosition
	var calcPosition = function (action, direction) {
		var diff = Math.round(scroll.width() - body.width());
		var scrollLeft = Math.round(body.scrollLeft());

		if(action === 'buttonClick'){
			var stepScroll = elem.width() * 80 / 100;
			if(direction === 'next'){
				scrollLeft += stepScroll;
				if(scrollLeft > diff){scrollLeft = diff;}
			}else{
				scrollLeft -= stepScroll;
				if(scrollLeft < 0){scrollLeft = 0;}
			}
		}
		if(scrollLeft === 0){
			scrollPosition('start');
		}else if(scrollLeft === diff){
			scrollPosition('finish');
		}else{
			scrollPosition('center');
		}
		return scrollLeft;
	}

	// Клик по кнопкам (только для DESKTOP)
	var buttonClick = function (direction){
		var scrollLeft = calcPosition('buttonClick', direction);
		body.stop().animate({scrollLeft:scrollLeft}, 500, 'swing');
	}

	// Скрыть показать кнопки в зависимости от положения скролла
	var scrollPosition = function (position) {
		if(position === 'start'){
			if(isMobile === false){
				btn_prev.removeClass('open');
				btn_next.addClass('open');
			}
			overlay_prev.removeClass('open');
			overlay_next.addClass('open');
		}else if (position === 'center'){
			if(isMobile === false){
				btn_prev.addClass('open');
				btn_next.addClass('open');
			}
			overlay_prev.addClass('open');
			overlay_next.addClass('open');
		}else if(position === 'finish'){
			if(isMobile === false){
				btn_prev.addClass('open');
				btn_next.removeClass('open');
			}
			overlay_prev.addClass('open');
			overlay_next.removeClass('open');
		}else if(position === 'not-scroll'){
			if(isMobile === false){
				btn_prev.removeClass('open');
				btn_next.removeClass('open');
			}
			overlay_prev.removeClass('open');
			overlay_next.removeClass('open');
		}
	}

	// Начальное положение скролла (скролл есть или его нет)
	wScroll > wBody ? scrollPosition('start') : scrollPosition('not-scroll');

	if(isMobile){
		btn_prev.removeClass('open');
		btn_next.removeClass('open');
		
	}else{
		btn_next.click(function(){ buttonClick('next'); });
		btn_prev.click(function(){ buttonClick('prev'); });
	}
	body.scroll(function(){calcPosition();});
}

$(".scroll").each(function(){
	if(!(w < BREAKPOINT_md4 && $(this).hasClass('js-not-md4'))){
		new ScrollElement($(this));
	}
});
;

	let isLess_md4;
	// Логика dropdown
	function dropdown() {
		const DROPDOWN_SLIDE_DURATION = 300;
		isLess_md4 = w < BREAKPOINT_md4;
		// Открыть/закрыть dropdown
		$('.js-dropdown-head').click(function(){
			if($(this).closest('.js-dropdown-item').hasClass('less-md4') && w > BREAKPOINT_md4){return false;}
			$(this).closest('.js-dropdown-item').toggleClass('active');
			let active = $(this).closest('.js-dropdown-item').hasClass('active');
			let body = $(this).closest('.js-dropdown-item').find('.js-dropdown-body');
			active ? body.slideDown(DROPDOWN_SLIDE_DURATION) : body.slideUp(DROPDOWN_SLIDE_DURATION);
		});

		// Отследить состояние dropdown
		function initDropdown(slideDuration) {
			let duration = slideDuration === undefined ? DROPDOWN_SLIDE_DURATION : slideDuration;
			$(".js-dropdown-item").each(function(){
				if($(this).hasClass('less-md4') && w > BREAKPOINT_md4){return false;}
				let active = $(this).hasClass('active');
				let body = $(this).find('.js-dropdown-body');
				active ? body.slideDown(duration) : body.slideUp(duration);
			});
		}

		initDropdown(0);
	}
	dropdown();

	// Допалнительная логика dropdown при resize
	function dropdownResize() {
		let temp = w < BREAKPOINT_md4;
		if(temp !== isLess_md4){
			isLess_md4 = temp;
			if(isLess_md4 === false){
				$(".js-dropdown-item.less-md4").each(function(){
					$(this).removeClass('active');
					$(this).find('.js-dropdown-body').slideDown(0);
				});
			}else{
				$(".js-dropdown-item.less-md4").each(function(){
					$(this).find('.js-dropdown-body').slideUp(0);
				});
			}
		}
	}


	// Прокрутка в самое начало страницы
	$(".js-goto-top").click(function(){
		$('html, body').animate({scrollTop: 0},500);
	});

	// Задаем рейтинг продукта в звездочках
	$(".js-rating").each(function(){
		let rating = $(this).data('rating');
		for(let i = 1; i < 6; i++){
			let icon = i <= rating ? "star-fill" : "star";
			$(this).append('<svg><use xlink:href="'+pathSprite+'#'+icon+'"/></svg>');
		}
	});

	// Узнать сколько картинок в отзывах и задать нужную grid-сетку
 	$(".js-detect-grid").each(function(){
 		let countChild = $(this).children().length;
 		$(this).addClass("child-" + countChild);
 	});

 	let iterationsDetectVideoDuration = {count: 0, max: 25};
	// Узнать есть ли видосики в блоке с отзывами
	function detectDurationVideo() {
		if(iterationsDetectVideoDuration.count > iterationsDetectVideoDuration.max){return false;}
		iterationsDetectVideoDuration.count++;
		$(".js-detect-grid .imageFeedback__item video").each(function(){
			let duration = $(this)[0].duration.toFixed(0);
			if(duration === "NaN"){
				setTimeout(function() {detectDurationVideo();}, 1000);
				return false;
			}
			let m = duration % 60;
			let min = Math.floor(duration / 60);
			let result = (min < 10 ? '0' : '') + min + ':' + (m < 10 ? '0' : '') + m;
	 		let html = '<span class="imageFeedback__duration">'+result+'</span>';
	 		html += '<span class="btnRound btnPlayVideo">';
			html += '<svg class="w16"><use xlink:href="img/sprite/icons-sprite.svg#play"/></svg>';
			html += '</span>';
	 		$(this).closest('button').append(html);
	 	});
	}
	setTimeout(function() {detectDurationVideo();}, 10);


/////////////////////////////// Слайдеры //////////////////////////////////////

	let isInitSlick = false;
	// Slick - слайдер
	function initSlider() {
		if(w < BREAKPOINT_md2){
			if(isInitSlick === false){
				isInitSlick = true;
				$('.slider').slick({
					slidesToShow: 2,
					prevArrow: $('.useful .sliderBtn.btn-prev'),
					nextArrow: $('.useful .sliderBtn.btn-next'),
					responsive:[
						{ 
							breakpoint: BREAKPOINT_552,
							settings: {
								slidesToShow: 1,
							}
						}
					]
				});
			}
		}else{
			if(isInitSlick === true){
				isInitSlick = false;
				$('.slider').slick('unslick');
			}
		}
	}
	initSlider();

	// Узнать ID слайда с презентацией
	let slidePresentationID = $('.sliderBig__item .js-presentation-video').parent().index();

	// Слайдер в начале страницы
	$('.js-sliderBig').slick({
		prevArrow: $('.product .sliderBtn.btn-prev'),
		nextArrow: $('.product .sliderBtn.btn-next'),
		//autoplay: true,
		//autoplaySpeed: 3500,
		dots: true
	});

	// Отслеживаем действие -> перелистывание слайда
	$('.js-sliderBig').on('beforeChange', function(event, slick, currentSlide, nextSlide){
	  $('.js-scrollPreview .scrollPreview__item').removeClass('active');
	  $('.js-scrollPreview .scrollPreview__item:eq('+nextSlide+')').addClass('active');
	  let scrollLeft = $('.js-scrollPreview').scrollLeft();
	  let widthScroll = parseInt($('.js-scrollPreview').width());
	  nextSlide = parseFloat(nextSlide);

	  let startVisibility = scrollLeft;
	  let endVisibility = scrollLeft + widthScroll;

	  let leftItem = nextSlide * 96;
	  let rightItem = (nextSlide * 96) + 80;

	  let setScroll = false;
	  if(rightItem > endVisibility){setScroll = rightItem - endVisibility + scrollLeft;}
	  if(leftItem < startVisibility){setScroll = leftItem;}

	  if(setScroll !== false){
	  	$('.js-scrollPreview').animate({scrollLeft: setScroll}, 300);
	  }

	  // Логика автовоспроизведения видео
	  let $video = $(slick.$slides.get(nextSlide)).find('video');
	  let isSlideWithVideo = $video.length;
	  if(isSlideWithVideo === 1){
	  	$video.trigger('play');
	  }else{
	  	$('.sliderBig__item video').trigger('pause');
	  }
	});

	// Клик по слайду в превью блоке
	$(".js-scrollPreview .scrollPreview__item").click(function(){
		var index = $(this).index();
		$('.js-sliderBig').slick('goTo', index);
	});

	// Клик по "как пользоваться", тоесть открыть презентационное видео
	$(".js-view-presentation-video").click(function(){
		$('.js-sliderBig').slick('goTo', slidePresentationID);
	});

/////////////////////////////////////// Отзывы //////////////////////////////////////////

	// Просчитываем где отображать кнопку показать больше
	$(".cardReviews__text .textLay").each(function(){
		var lh = parseFloat($(this).css('line-height'));
		if($(this).height() > (lh * 4)){
			$(this).closest(".cardReviews__text").addClass('hidden');
			$(this).closest(".cardReviews").find('.cardReviews__button').addClass('js-hide-text');
		}
	});

	// Нажатие на кнопку показать больше
	$(document).on("click", ".cardReviews .js-hide-text", function(){
		$(this).toggleClass('active');
		$(this).closest(".cardReviews__content").find(".cardReviews__text").toggleClass('hidden');
	});


///////////////////////////// Логика бургер-меню ///////////////////////////////////////

	const $burger = $(".js-burger");
	const $menu = $(".js-menu");
	const $overlayMenu = $(".js-overlayMenu");
	let isActiveMenu = false;
	// Открыть/закрыть меню / Скрыть меню при клике вне блока меню
	$(document).on(isMobile ? "touchend" : "mousedown", function (e) {
		let isBurger = $burger.has(e.target).length === 1 ? true : false;
		let isChildMenu = $menu.has(e.target).length === 1 ? true : false;
		let isMenu = $(e.target).hasClass("js-menu");
		
		let newStateMenu = isActiveMenu;
		if(isBurger){
			newStateMenu = !newStateMenu;
		}else if(isBurger === false && isMenu === false && isChildMenu === false){
			newStateMenu = false;
		}

		if(newStateMenu !== isActiveMenu){
			isActiveMenu = newStateMenu;
			$burger.toggleClass('active', isActiveMenu);
			$menu.toggleClass('active', isActiveMenu);
			$overlayMenu.toggleClass('active', isActiveMenu);
			if(w < BREAKPOINT_md4){$body.toggleClass('lock', isActiveMenu);}
		}
	});

///////////////////////////////////////////////////////////////////////////////////////

	let isInitStoriesSlider = false;
	// Открыть истории
	$('.js-stories').click(function(e){
		let isItem = $(e.target).parent('.about__item').length;
		console.log(isItem);
		if(isItem === 1){ // Показать сторис
			let id = $(e.target).parent('.about__item').data('id');
			let idCount = $('.stories__item[data-id="'+id+'"]').not('.slick-cloned').length;
			console.log("id: ", id, " idCount: ", idCount);


			$('.js-stories').addClass('active');
			$body.addClass('lock');

			if(isInitStoriesSlider === false){
				$('.js-sliderStories').slick({
					prevArrow: $('.stories__body .sliderBtn.btn-prev'),
					nextArrow: $('.stories__body .sliderBtn.btn-next'),
				});
				$('.js-sliderStories').append(addTimescale(idCount));
			}
			isInitStoriesSlider = true;
		}else{
			//$('.js-stories').removeClass('active');
			//$body.removeClass('lock');
		}
	});

	function addTimescale(count) {
		let oneLine = '<div class="timescale__item"><div class="timescale__left"></div></div>';

		let html = '<div class="timescale">';
		html += '<div class="timescale__lines">';
		for (var i = 0; i < count; i++){html = html + oneLine;}
		html += '</div>';
		html += '<svg class="timescale__control w24 js-stories-pause"><use xlink:href="img/sprite/icons-sprite.svg#pause"/></svg>';
		html += '<svg class="timescale__control volumn w24 js-stories-volumn"><use xlink:href="img/sprite/icons-sprite.svg#volumn"/></svg>';
		html += '</div>';
		return html;
	}

	// Закрыть истории
	$(".js-close-stories").click(function(){
		$('.js-stories').removeClass('active');
	});
});