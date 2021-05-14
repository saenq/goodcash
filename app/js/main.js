$(function () {
    function toggleMobileMenu(isTrue) {
        $('.mobile-menu').toggleClass('mobile-menu--active', isTrue);
        $('body').toggleClass('mobile-menu__overflow', isTrue);
        isTrue ? $('body').append('<div class="mobile-menu__blocker"></div>') : $('.mobile-menu__blocker').remove();
    }

    $('.mobile-menu__btn--show').on('click', () => toggleMobileMenu(true));
    $('.mobile-menu__btn--hide').on('click', () => toggleMobileMenu(false));
    $('.menu__link').on('click', () => toggleMobileMenu(false));
    $('body').on('click', '.mobile-menu__blocker', () => toggleMobileMenu(false));


    // mockup animation
    $(window).on('scroll', function (event) {
        let wHeight = $(window).height();
        let sBottom = $(this).scrollTop() + wHeight;
        let block = $('.bonus__mockup-screen');
        let blockHeight = block.height();
        let blockPos = block.offset().top + ((wHeight / 2) + (blockHeight / 2));
        let endBreakpoint = blockPos + blockHeight;

        if (sBottom > blockPos && sBottom < endBreakpoint) {
            let pct = 100 / ((endBreakpoint - blockPos) / (sBottom - blockPos));
            block.css('background-position-y', `${pct}%`)
        }
    });
});

window.onload = () => {
    const swiper = new Swiper('.partners__slider-container', {
        loop: true,
        slidesPerView: 2,
        slidesPerGroup: 2,
        speed: 600,
        spaceBetween: 20,
        autoplay: true,
        navigation: {
            nextEl: '.partners__btn-next',
            prevEl: '.partners__btn-prev',
        },
        pagination: {
            el: ".partners__pagination",
            bulletClass: "partners__pagination-item",
            bulletActiveClass: "partners__pagination-item--active",
            clickable: true,
        },
        breakpoints: {
            577: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 40
            },
            769: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 40
            },
            961: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                spaceBetween: 80
            },
            // when window width is >= 480px
            1201: {
                slidesPerView: 4,
                slidesPerGroup: 4,
                spaceBetween: 40
            },
            // when window width is >= 640px
            1441: {
                slidesPerView: 4,
                slidesPerGroup: 4,
                spaceBetween: 80,
            }
        }
    });


    //// cards animation
    // настройки
    let options = {
        threshold: 1
    }

    // функция обратного вызова
    let callback = function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            } else {
                entry.target.classList.remove('animated');
            }
        })
    }

    // наблюдатель
    let observer = new IntersectionObserver(callback, options);

    let target = document.querySelector('.offer__cards');
    observer.observe(target)

    //// end cards animation

    smoothscroll.polyfill();
}