//////////////////////////////// Логика колеса-крутилки ///////////////////////////////

// Получить случайное число в диапазоне 
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

var chance = [["10%", 30],["275 p.", 30],["8%", 10],["230 p.", 30],["5%", 1],["20%", 5],["180 p.", 10],["12%", 30],["115 p.", 1],["450 p.", 5]];
// Считаем вероятности и выдаем дроп ID
function giveDrop() {
	var lengthChance = 0, dropID;
	var lineChance = [0];
	for(var i = 0; i < chance.length; i++){
		lengthChance += chance[i][1];
		lineChance[i+1] = lengthChance;
	}
	var randomNumber = getRandomIntInclusive(1, lengthChance);
	for (var i = 1; i < lineChance.length; i++) {
		if(randomNumber > lineChance[i-1] && randomNumber <= lineChance[i]){
			dropID = i - 1;
		}
	}
	return dropID;
}

// Возвращает градусы на которых должно остановиться колесо
function degWheel(dropID) {
	var dropStep = 360 / chance.length;
	var percent10 = dropStep * 20 / 100;
	var dropDEGstart = (dropID * dropStep) + percent10;
	var dropDEGend = ((dropID * dropStep) + dropStep) - percent10;
	var dropDEG = getRandomIntInclusive(Math.round(dropDEGstart), Math.round(dropDEGend));
	return dropDEG;
}

// Узнать силу вращения
function speedWheel() {
	if(w < BREAKPOINT_md4){
		var heightRunner = $('#js-runner').width();
		var heightParent = $('#js-gradient').width();
	}else{
		var heightRunner = $('#js-runner').height();
		var heightParent = $('#js-gradient').height();
	}
	
	var diffRunner = heightParent - heightRunner;
	var speed = diffRunner * 100 / heightParent;
	return Math.round(speed);
}

const minWheel = 5;  // Минимально кругов при минимальной скорости
const maxWheel = 30; // Максимально кругов при максимальной скорости
const minTime = 5000; // Минимальное время вращения
const maxTime = 7000; // Максимальное время вращения
// Высчитываем время вращения и конечное аоложение колеса
function positionWheel(speed, dropDEG) {
	var diff = (maxWheel - minWheel) / 100;
	var wheelCount = Math.round(minWheel + (diff * speed));
	var totalDeg = (wheelCount * 360) + dropDEG;

	var diffTime = (maxTime - minTime) / 100;
	var timeCount = Math.round(minTime + (diffTime * speed));
	return [timeCount, totalDeg];
}

// Последовательные действия для колеса-крутилки
function sequentialActionsWheel() {
	blockWheel = true;
	var dropID = giveDrop();
	var dropDEG = degWheel(dropID);
	var speed = speedWheel();
	var position = positionWheel(speed, dropDEG);

	// Вращаем колесо
	$("#animated").attr("style", "--circle-deg:"+position[1]+"deg; --circle-time:"+position[0]+"ms;");
	$("#animated").attr("class", "active");

	// Печатаем значение выпавшего дропа в нужные места и показываем попап "Вы получили скидку"
	$('#js-sv-drop-id').val(dropID);
	$('#js-sv-drop-value').val(chance[dropID][0]);
	$('#js-discount-type').text(chance[dropID][0]);
	setTimeout(function() {
		openPopup('prizeReceive');
	}, position[0] + 100);
	
}

// Нажатие на кнопку "Вращать"
$(document).on("click", "#js-stopRunner", function(e){
	if(blockWheel === false){
		$('#js-runner').addClass('paused');
		sequentialActionsWheel();
	}
});

var blockWheel = true;
// Запускаем все необходимое для правельной работы колеса-крутилки
function initWheel() {
	if(w < BREAKPOINT_md4){
		$('#js-runner').addClass('activeMOB');
	}else{
		$('#js-runner').addClass('activeDESC');
	}
	blockWheel = false;
}

///////// Логика попапа ухода со страницы, получить подарок, анимировать title  //////////////

const IS_USE_LOTTERY_POPUP = true; // Использовать лотерею
const IS_USE_LEAVING_POPUP = false; // Использовать попап при уходе
const IS_USE_TITLE_CHANGER = false; // Использовать анимированный title


const downloadPopupDelay = 15; // задержка (сек.) Загрузить ajax-ом попапы через ХХ сек
const leavingDelay = 60; // задержка (сек.) - После загрузки ajax-ом попапов

// ********* Отслеживаем уход и возвращение на страницу ********** //

var isExistUser;
var timer_leaving;
// Отслеживаем уход со страницы
$(document).on("mouseleave", function(){
	clearTimeout(timer_leaving);
	timer_leaving = setTimeout(function() {userLongGone();}, leavingDelay * 1000);
});


// Пользователь вернулся на страницу
$(document).on("mouseenter", function(){
	clearTimeout(timer_leaving);
	isExistUser = true;
});

// Пользователь отсутствовал указанное количество времени
function userLongGone() {
	isExistUser = false;
	/* Если попапы получения приза загружены и приз до сих пор не получен и попап "Забрать приз" закрыт
		 и попап lottery закрыт и попап prizeReceive закрыт то открыть попап "Забрать приз" */
	if(isLoadedPopupsLottery === true && localStorage.getItem('get-gift') === null && 
		isOpenMicropopupLottery === false && $("#prizeReceive").hasClass('open') === false && $("#lottery").hasClass('open') === false){
		show_hide_micropopupLottery(true);
	}

	// Запустить анимацию title если не запущена
	if(animTitle === false && IS_USE_TITLE_CHANGER === true){animateTitle();}

	// Показать попап при уходе если выполняются условия
	if(sessionStorage.getItem('vizit') == null && isLoadedPopupLeaving === true && $('#userLeaving').hasClass('open') === false && 
		$("#prizeReceive").hasClass('open') === false && $("#lottery").hasClass('open') === false){
		openPopup('userLeaving');
		sessionStorage.setItem('vizit', 'vizit');
	}
}

// ********************** Анимируем title ************************ //

var titleDefault = $('title').text();
var titleAnimate = $('title').data('title');
if(titleAnimate != undefined){
	titleAnimate = titleAnimate.split("||");
}
var titleLoop = 0;
var animTitle = false;
// Анимируем title при условии что приз еще не получен и задан data-title для title
function animateTitle() {
	if(localStorage.getItem('get-gift') == null && titleAnimate != undefined){
		$('title').text(titleAnimate[titleLoop]);
		titleLoop++;
		if(titleLoop >= titleAnimate.length){titleLoop = 0;}
		if(isExistUser === false){
			animTitle = true;
			setTimeout(function() {animateTitle();}, 1500);
		}else{
			animTitle = false;
			$('title').text(titleDefault);
		}
	}
}

// ************** Логика открытия попапов лотереи **************** //

var $micropopupLottery;
var isOpenMicropopupLottery = false;
// Показать/скрыть микропопап "Забрать приз"
function show_hide_micropopupLottery(showPopup) {
	if(showPopup === false){
		$micropopupLottery.addClass('closing-anim');
		setTimeout(function() {
			$micropopupLottery.removeClass('show-anim closing-anim');
		}, 300);
	}else{
		$micropopupLottery.addClass('show-anim');
	}
	isOpenMicropopupLottery = showPopup;
}

// Скрыть микропопап "Забрать приз" при клике на кнопку "Скрыть"
$(document).on("click", ".js-hide-micropopup-lottery", function(){
	show_hide_micropopupLottery(false);
});

// Клик по попапу "Забрать приз"
$(document).on(isMobile ? "touchend" : "mousedown", ".js-micropopup-lottery", function (e) {
	if($(e.target).hasClass('js-hide-micropopup-lottery') === false){
		initWheel();
		openPopup('lottery');
		show_hide_micropopupLottery(false);
	}
});

// ********************* Подгрузка попапов *********************** //

var isLoadedPopupsLottery = false;
var isLoadedPopupLeaving = false;
// Подгрузка попапов лотереи и ухода со страницы методом load через 15 сек
setTimeout(function() {
	$('body').append('<div id="popupsLoaded_1"></div><div id="popupsLoaded_2"></div>');
	// Если пользователь не получил подорок только тогда грузим попапы лотереи 
	if(localStorage.getItem('get-gift') === null && IS_USE_LOTTERY_POPUP === true){
		$("#popupsLoaded_1").load(pathPopups + " #popups-lottery", function(response, status){
			commonAction(status, "ВНИМАНИЕ!!! Ошибка при загрузке попапов лотереи");
			if(status == 'success'){
				// Запоминаем если пользователь получил подарок
				$(".js-get-gift").submit(function(e){
					e.preventDefault();
					localStorage.setItem('get-gift', 'exist');

					let request = $(this).serialize();
					$.ajax({
						url : '/ajax/gen_coupon.php',
						data: request,
						success: function() {
							alert('Мы выслали скидочный купон на вашу почту!');
						}
					});
					$("#prizeReceive").removeClass('open');
				});

				// Показать микропопап лотереи
				$micropopupLottery = $('.js-micropopup-lottery');
				show_hide_micropopupLottery(true);

				// Дополнительная логика
				isLoadedPopupsLottery = true;
			}
		});
	}

	// Если за текущую сессию пользователь при уходе еще не увидел попап #userLeaving
	if(sessionStorage.getItem('vizit') == null && IS_USE_LEAVING_POPUP === true){
		$("#popupsLoaded_2").load(pathPopups + " #userLeaving", function(response, status){
			commonAction(status, "ВНИМАНИЕ!!! Ошибка при загрузке попапа при уходе со страницы");
			if(status == 'success'){
				// Дополнительная логика
				isLoadedPopupLeaving = true;
			}
		});
	}
}, downloadPopupDelay * 1000);

// Общие действия для 2-х load загрузок
function commonAction(status, msg){
	if(status === "error"){
		console.log(msg);
	}else{ // Если попапы успешно загружены
		// Переопределяем попапы
		popup = $(".popup");

		// Перезапускаем валидаторы
		$('.js-validation-form').unbind("submit");
		$(".js-validation-form ._validate").unbind("focus change");
		initValidators();
	}
}