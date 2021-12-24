$(document).ready(function () {
	var w = $(window).outerWidth();
	var isMobile = ('ontouchstart' in window);
	const BREAKPOINT_md1 = 1343;
	const BREAKPOINT_md2 = 992.98;
	const BREAKPOINT_md3 = 767.98;
	const BREAKPOINT_552 = 551.98;
	const BREAKPOINT_md4 = 479.98;

	// Изменение ширины окна браузера
	$(window).resize(function(){
		w = $(window).outerWidth();
		initSlider();
	});

	// Логика dropdown
	function dropdown() {
		const DROPDOWN_SLIDE_DURATION = 300;
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

	// Прокрутка в самое начало страницы
	$(".js-goto-top").click(function(){
		$('html, body').animate({scrollTop: 0},500);
	});

	// Задаем рейтинг продукта в звездочках
	$(".js-rating").each(function(){
		let rating = $(this).data('rating');
		let pathSprite = $(this).data('path-sprite');
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


	// Узнать есть ли видосики в блоке с отзывами
	setTimeout(function() {
		$(".js-detect-grid .imageFeedback__item video").each(function(){
			let duration = $(this)[0].duration.toFixed(0);
			let m = duration % 60;
			let min = Math.floor(duration / 60);
			let result = (min < 10 ? '0' : '') + min + ':' + (m < 10 ? '0' : '') + m;
	 		
	 		let html = '<span class="imageFeedback__duration">'+result+'</span>';
	 		html += '<span class="btnRound imageFeedback__playVideo">';
			html += '<svg class="w16"><use xlink:href="img/sprite/icons-sprite.svg#play"/></svg>';
			html += '</span>';
	 		$(this).closest('button').append(html);
	 	});
	}, 2000);

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

	$('.sliderBig').slick({
		prevArrow: $('.product .sliderBtn.btn-prev'),
		nextArrow: $('.product .sliderBtn.btn-next'),
		dots: true
	});

	$('.sliderPreview').slick({
		arrows: false,
		slidesToShow: 5,
	});


///////////////////////////////////////////////////////////////////////////////
	
	$(".burger").click(function(){
		$(this).toggleClass('active');
	});
	
});