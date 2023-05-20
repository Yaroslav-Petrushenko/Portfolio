class Grain {
    constructor(el) {
        /**
         * Options
         * Increase the pattern size if visible pattern
         */
        this.patternSize = 150;
        this.patternScaleX = 1;
        this.patternScaleY = 1;
        this.patternRefreshInterval = 3; // 8
        this.patternAlpha = 15; // int between 0 and 255,

        /**
         * Create canvas
         */
        this.canvas = el;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale(this.patternScaleX, this.patternScaleY);

        /**
         * Create a canvas that will be used to generate grain and used as a
         * pattern on the main canvas.
         */
        this.patternCanvas = document.createElement('canvas');
        this.patternCanvas.width = this.patternSize;
        this.patternCanvas.height = this.patternSize;
        this.patternCtx = this.patternCanvas.getContext('2d');
        this.patternData = this.patternCtx.createImageData(this.patternSize, this.patternSize);
        this.patternPixelDataLength = this.patternSize * this.patternSize * 4; // rgba = 4

        /**
         * Prebind prototype function, so later its easier to user
         */
        this.resize = this.resize.bind(this);
        this.loop = this.loop.bind(this);

        this.frame = 0;

        window.addEventListener('resize', this.resize);
        this.resize();

        window.requestAnimationFrame(this.loop);
    }

    resize() {
        this.canvas.width = window.innerWidth * devicePixelRatio;
        this.canvas.height = window.innerHeight * devicePixelRatio;
    }

    update() {
        const {
            patternPixelDataLength,
            patternData,
            patternAlpha,
            patternCtx
        } = this;

        // put a random shade of gray into every pixel of the pattern
        for (let i = 0; i < patternPixelDataLength; i += 4) {
            // const value = (Math.random() * 255) | 0;
            const value = Math.random() * 255;

            patternData.data[i] = value;
            patternData.data[i + 1] = value;
            patternData.data[i + 2] = value;
            patternData.data[i + 3] = patternAlpha;
        }

        patternCtx.putImageData(patternData, 0, 0);
    }

    draw() {
        const {
            ctx,
            patternCanvas,
            canvas,
            viewHeight
        } = this;
        const {
            width,
            height
        } = canvas;

        // clear canvas
        ctx.clearRect(0, 0, width, height);

        // fill the canvas using the pattern
        ctx.fillStyle = ctx.createPattern(patternCanvas, 'repeat');
        ctx.fillRect(0, 0, width, height);
    }

    loop() {
        // only update grain every n frames
        const shouldDraw = ++this.frame % this.patternRefreshInterval === 0;
        if (shouldDraw) {
            this.update();
            this.draw();
        }

        window.requestAnimationFrame(this.loop);
    }
}

const el = document.querySelector('.grain');
const grain = new Grain(el);

// slider
const slides = document.querySelectorAll('.skill-name');
const left = document.querySelector('.left');
const right = document.querySelector('.right');
let currentSlide = 0;

function showSlide(index) {
    slides.forEach((slide) => {
        slide.classList.remove('active');
    });
    // sliderBar.style.height = slides[index].offsetHeight + 'px';
    slides[index].classList.add('active');
}

left.addEventListener('click', e => {
    e.preventDefault();
    currentSlide++;
    if (currentSlide === slides.length) {
        currentSlide = 0;
    }
    showSlide(currentSlide);
}) 

right.addEventListener('click', e => {
    e.preventDefault();
    currentSlide--;
    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    showSlide(currentSlide);
}) 

showSlide(currentSlide);
// cursor 

// // Створити новий елемент для курсора
// const bodyElement = document.body;
// bodyElement.style.cursor = 'none';

// let customCursor = document.createElement('div');
// // Застосувати стилі до елемента курсора
// customCursor.style.width = '20px';
// customCursor.style.height = '20px';
// customCursor.style.borderRadius = '50%';
// customCursor.style.backgroundColor = 'blue';
// customCursor.style.position = 'fixed';
// customCursor.style.zIndex = '9999';
// customCursor.style.pointerEvents = 'none';

// // Додати елемент курсора до body
// document.body.appendChild(customCursor);

// // Встановити функцію для оновлення позиції курсора
// document.addEventListener('mousemove', function (event) {
//     let mouseX = event.clientX;
//     let mouseY = event.clientY;

//     // Оновити позицію курсора
//     customCursor.style.left = mouseX + 'px';
//     customCursor.style.top = mouseY + 'px';
// });