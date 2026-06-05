const swiper = new Swiper('.mySwiper', {
    loop: true,
    speed: 700,

    autoplay: {
        delay: 4500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    keyboard: { enabled: true },
    effect: 'fade',
    fadeEffect: { crossFade: true },
});
const currentEl = document.getElementById('slideCurrentNum');
const totalEl = document.getElementById('slideTotalNum');

const realTotal = swiper.slides.length - (swiper.loopedSlides || 0) * 2;
totalEl.textContent = realTotal > 0 ? realTotal : swiper.slides.length;

function updateCounter() {
    currentEl.textContent = swiper.realIndex + 1;
}

swiper.on('slideChange', updateCounter);
updateCounter();