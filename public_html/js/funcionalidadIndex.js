var interfaz = (function() {
	//DOM CACHE
	var $mainMenu = $('#mainMenu');
	var $logo = $mainMenu.find('#logo');
	var $main = $('#main');
	var $alimentacion = $('#alimentacion');
	var $frame = $alimentacion.find('#frame');
	var $imgContainer = $frame.find('#imgContainer');
	var $navBar = $frame.find('#navBar');
	var $about = $('#about');
	var $faq = $('#faq');
	var $faqNav = $faq.find('nav');
	var $preguntas = $faq.find('#preguntas');
	var $footer = $('footer');
	var $lightBox = $('#lightBox');

	//VARIABLES EXTRA
	var cantImagenes = imagenes.length;
	var pages = Math.ceil(cantImagenes / 3);
	console.log(pages);
	var currentPage = 1;
	var templatePreguntas = $('#templateQuestions').html();

	$faqNav.on('click', 'a', _faqRender);
	$preguntas.on('click', 'a', _linkToggle);
	$imgContainer.on('click', 'img', _imgLightbox);
	$navBar.on('click', 'a', _carrouselSlider);
	$lightBox.on('click', _closeLightBox);
	$(document).on('keyup', _closeLightBox);
	$(window).bind('mousewheel DOMMouseScroll scroll', _navMenuController);

	_render();

	function _render() {
		for (var i=1; i <= pages; i++) {
			$navBar.append('<a href="#" data-page="'+i+'"> </a>');
		}
		for (var j=0; j < cantImagenes; j++) {
			$imgContainer.prepend('<img src="'+imagenes[j]+'">')
		}
		$.ajax({
		type: 'GET',
		url: baseURL + 'home/getQuestions',
		dataType: 'json',
		success: function(json) {
				$.each(json, function(indice, obj) {
					$preguntas.append(Mustache.render(templatePreguntas, obj));
				});
			}
		})
	}

	function _navMenuController() {
		if ( $(this).scrollTop() > 1 ) {
			$mainMenu.addClass('scrolled');
			if ($(this).scrollTop() <= $alimentacion.offset().top -100 ) {
				$mainMenu.find('h2').html('Verde que te Quiero Verde');
			} else if ($(this).scrollTop() >= $alimentacion.offset().top -100 ) {
				$mainMenu.find('h2').html('Consejos para tu alimentacion diaria.');
			}
		} else {
			$mainMenu.removeClass('scrolled');
		}
	}

	function _faqRender(e) {
		e.preventDefault();
		$(this).parent().find('.active').removeClass('active');
		$(this).addClass('active');
		var posicion = $(this).data('posicion');
		$faq.find('div.active').removeClass('active');
		$faq.find('[data-posicion="'+posicion+'"]').addClass('active');
	}

	function _linkToggle(e) {
		e.preventDefault();
		var id = $(this).data('id');
		if ( $(this).next().hasClass('active') ) {
			$preguntas.find('p.active').slideUp().removeClass('active');
		} else {
			$preguntas.find('p.active').slideUp().removeClass('active');
			$preguntas.find('p[data-id="'+id+'"]').addClass('active');
			$preguntas.find('p[data-id="'+id+'"]').slideDown();
		}

	}

	function _carrouselSlider(e) {
		e.preventDefault();
		currentPage = $(this).data('page');
		var marginLeft = ( currentPage == 1 ? 0 : ((currentPage - 1) * 100)-5);
		console.log(marginLeft);
		$(this).parent().find('.active').removeClass('.active');
		$(this).addClass('active');
		$imgContainer.animate({
			marginLeft: -marginLeft+"vw",
		}, 2000);
	}

	function _imgLightbox() {
		$(this).clone().appendTo($lightBox);
		$lightBox.addClass('visible');
	}

	function _closeLightBox(e) {
		$lightBox.removeClass('visible');
		$lightBox.empty();
		if (e.keyCode == 27) {
			$lightBox.removeClass('visible');
			$lightBox.empty();
		}
	}

})();












$(function () {
	$('a[href*="#"]:not([href="#"])').click(function () {
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length) {
				$('html, body').animate({
					scrollTop: target.offset().top
				}, 1100);
				return false;
			}
		}
		;
	});

});
