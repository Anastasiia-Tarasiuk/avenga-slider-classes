import { Slide } from "./slideClass.js";

export function SlidePlugin(options) {
    const defaultOptions = {
        sliderContainerClass: ".container",
        slides: [],
        isDotsContainerShown: true,
    }

    options = { ...defaultOptions, ...options };
    
    if (options.sliderContainerClass[0] !== ".") {
        options.sliderContainerClass = "." + options.sliderContainerClass;
    }

    // default values  
    const mainContainer = document.querySelector(options.sliderContainerClass);
    const _this = this;
    let globalIndex = 0;
    let dotEls = null;
    
    this.renderSlide = function (index) {
        const slidesList = document.createElement("ul");
        slidesList.classList.add("slide-list");

        mainContainer.appendChild(slidesList);

        const imagePath = options.slides[index].imagePath;
        const imageText = options.slides[index].imageText;
        const imageCaption = options.slides[index].imageCaption;

        const slide = new Slide(imagePath, imageText, imageCaption);
        const slideItem = slide.createSlide();

        slidesList.appendChild(slideItem);
    }
    
    // does't render slides if nothing set to imagePath option
    if (options.slides.length > 0) {
        for (let i = 0; i < options.slides.length; i++) {
            this.renderSlide(i);
        }
    }
    
    const slidesArray = [...document.querySelectorAll(".slide-item")];
    const slideNumberEls = document.querySelectorAll(".slide-number");  

    // does't add to slides 'is-active-slide' class if nothing set to imagePath option
    if (options.slides.length > 0) {
        slidesArray[globalIndex].classList.add("is-active-slide"); 
    }

    this.prepareControls = function () {
        const nextButton = document.createElement("button");
        const prevButton = document.createElement("button"); 

        // renders dots container according to default options
        if (options.isDotsContainerShown) {
            const dotsContainer = document.createElement("div");  
            dotsContainer.classList.add("dots-container");
            mainContainer.appendChild(dotsContainer);
            dotsContainer.addEventListener("click", _this.onDotClick);
        }

        nextButton.classList.add("next");
        prevButton.classList.add("prev");

        nextButton.setAttribute("data-direction", "true");
        prevButton.setAttribute("data-direction", "false");

        nextButton.innerHTML = `
            <svg class="next-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="40">
                <path
                    d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z" />
            </svg>`
        prevButton.innerHTML = `
            <svg class="prev-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="40">
                <path
                    d="M0 256C0 397.4 114.6 512 256 512s256-114.6 256-256S397.4 0 256 0S0 114.6 0 256zM297 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L120 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l214.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L409 239c9.4 9.4 9.4 24.6 0 33.9L297 385z" />
            </svg>`

        mainContainer.appendChild(nextButton);
        mainContainer.appendChild(prevButton);

        nextButton.addEventListener("click", _this.onButtonClick);
        prevButton.addEventListener("click", _this.onButtonClick);
        nextButton.addEventListener("dblclick", _this.disableDoubleClickOnButton);
        prevButton.addEventListener("dblclick", _this.disableDoubleClickOnButton);
    }

    this.moveSlides = function (prevIndex) {
        if (options.slides.length > 0) {
            slidesArray[globalIndex].classList.add("is-active-slide");
            slidesArray[prevIndex].classList.remove("is-active-slide");
        }
    }

    this.renderDots = function (arr) {
        arr.map(el => {
            const dot = document.createElement("div");
            dot.classList.add("dot");
            document.querySelector(".dots-container").appendChild(dot);
        })

        dotEls = document.querySelectorAll(".dot");
    }

    this.changeSliderNumbers = function () {
        // sets content only if slide exist
        if (options.slides.length > 0) {
            slideNumberEls[globalIndex].textContent = `${1 + globalIndex}/${options.slides.length}`;
        }
    }

    this.changeDotColor = function(prevIndex) {
        dotEls = document.querySelectorAll(".dot");
        if (options.slides.length > 0) {
            dotEls[prevIndex].classList.remove("add-dot-bg-color");
            dotEls[globalIndex].classList.add("add-dot-bg-color");
        }
    }

    this.onButtonClick = function(e) {
        const directionAttributeValue = JSON.parse(e.currentTarget.getAttribute("data-direction"));
        let nextStep = directionAttributeValue ? 1 : -1;
        let prevIndex = globalIndex;
        
        globalIndex = globalIndex + nextStep;
        
        // checks if globalIndex stays in possible range
        if (globalIndex > (options.slides.length - 1)) {
            globalIndex = 0;
        }
        
        if (globalIndex < 0) {
            globalIndex = options.slides.length - 1;
        }

        _this.moveSlides(prevIndex);
        _this.changeSliderNumbers();
        _this.changeDotColor(prevIndex);
    }

    this.onDotClick = function(e) {
        const chosenDot = e.target;
        const indexOfChosenDot = [...chosenDot.parentElement.children].indexOf(chosenDot);
        const current = slidesArray[globalIndex];
        let next = slidesArray[indexOfChosenDot];
        
        dotEls[globalIndex].classList.remove("add-dot-bg-color");
        
        globalIndex = indexOfChosenDot;
        
        //doesn't allow switch classes by click on the same dot
        if (current !== next) {
            next.classList.add("is-active-slide");
            current.classList.remove("is-active-slide");
        }
        
        dotEls[globalIndex].classList.add("add-dot-bg-color");
        _this.changeSliderNumbers();
    }
    
    this.onArrowKeyPress = function(e) {
        // checks if arrow key was pressed and invokes button events
        if (e.code === "ArrowRight") {
            document.querySelector(".next").click();
        }
        
        if (e.code === "ArrowLeft") {
            document.querySelector(".prev").click();
        }
    }

    this.disableDoubleClickOnButton = function(e) {
        e.stopPropagation();
    }

    // default values   
    this.prepareControls();

    if (options.isDotsContainerShown && options.slides.length > 0) {
        this.renderDots(slidesArray);
    }

    if (options.isDotsContainerShown && options.slides.length > 0) {
        dotEls[globalIndex].classList.add("add-dot-bg-color");
    }

    document.addEventListener("keydown", _this.onArrowKeyPress);
    this.changeSliderNumbers();
}

