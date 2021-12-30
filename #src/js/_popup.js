/////////////////// Скрипты для попапов ///////////////////////////

var popup = $(".popup");
var lastOpen = false;

// Показать попапы при клике
$(document).on("click", ".popup-click", function(e){
	e.preventDefault();
	if($(this).hasClass('disabled')){return false;}
	openPopup($(this).data('popupid'), $(this));
});

// Открыть попап
function openPopup(popupID, target) {
	if(lastOpen !== popupID){
		if(lastOpen !== false){close_popup();}
		lastOpen = popupID;
		if(popupID === 'more'){
			calcPositionMore(popupID, target);
		}
		$('#'+popupID).addClass('open');
		if($('#'+popupID).hasClass('p-ib') === false || popupID == 'preview'){
			bodyLock();}
	}else{
		close_popup();
	}
}

// Скрыть попапы при клике вне попапа и вне области вызова попапа
$(document).on(isMobile ? "touchend" : "mousedown", function (e) {
	var popupTarget = $(".popup-click").has(e.target).length;
	// Если (клик вне попапа && попап имеет класс open)
    if (popup.has(e.target).length === 0 && popup.hasClass('open') && popupTarget === 0){
       	close_popup();
    }
});

// Скрыть попап при нажатии на клавишу "Esc"
$(document).on("keydown", function (e) {
	if(e.which === 27){
		close_popup();
	}
});

// Блокировка скролла при открытии попапа
function bodyLock() {
	$body.addClass('lock');
}

// Разблокировка скролла при закрытии попапа
function bodyUnLock() {
	$body.removeClass('lock');
}

// Закрыть popup
function close_popup() {
	$(".popup").removeClass('open');
	bodyUnLock();
	lastOpen = false;
}

// Закрыть попапа при нажатии на кнопки "Close"
$(".js-popup-close").click(function(e){
	e.preventDefault();
	close_popup();
});

////////////////////////////////////////////////////////////////////////////////
//////////////////////// Функции для hover попапов /////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var closePopup = false;
var popupH = false;
var timeout1 = false;
var timeout2 = false;
var srcPopups = ".example";

// Показать ховер попапы
$(document).on(isMobile ? "click" : "mouseenter", srcPopups, function(e){
	var coordinates = $(this).offset();
	if($(this).hasClass('example')){
		popupH = $('#example');
		coordinates.left -= 0;
		coordinates.top -= popupH.height() + 10;
	}
	if(isMobile === false){
		clearTimeout(timeout2);
		clearTimeout(timeout1);
		timeout1 = setTimeout(function() {
			showPopupHover(coordinates);
		}, 0);
	}else{
		showPopupHover(coordinates);
	}
});

// Показать hover попап
function showPopupHover(coordinates){
	if(closePopup !== false){
		closePopup.offset({top: 0, left: 0}).removeClass('open');
		closePopup = false;
	}
	if(popupH !== false){
		closePopup = popupH;
		popupH.offset(coordinates).addClass('open');
	}
}

// Закрыть hover попап
function closePopupHover(){
	if(closePopup !== false){
		closePopup.offset({top: 0, left: 0}).removeClass('open');
		closePopup = false;
	}
}

if(isMobile === false){
	// Скрыть ховер попапы
	$(document).on("mouseleave", srcPopups + ", .popup-live", function(){
		timeout2 = setTimeout(function() {
			closePopupHover();
		}, 200);
	});

	// Переход на открытый попап
	$(document).on("mouseenter", ".popup-live", function(){
		clearTimeout(timeout2);
	});
}