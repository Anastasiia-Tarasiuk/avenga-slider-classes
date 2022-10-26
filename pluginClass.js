export class Plugin {
    // #mainContainer;

    constructor({ sliderContainerClass = ".container", slides = [], isDotsContainerShown = true }) {
        this.sliderContainerClass = sliderContainerClass;
        this.slides = slides;
        this.isDotsContainerShown = isDotsContainerShown;
        this.mainContainer = document.querySelector(this.sliderContainerClass);
        this.globalIndex = 0;
        this.dotEls = null;
        this.dotsContainer = null;
        this.slidesArray = null;
        this.slideNumberEls = null; 
        this.dotsContainer = null;

        this.renderSides(); 
    }
    
    createSlide(index) {
        const slidesList = document.createElement("ul");
        slidesList.classList.add("slide-list");

        
        const slideItem  = document.createElement("li");
        slideItem.classList.add("slide-item", "animation");
        slidesList.appendChild(slideItem);
        
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");
        
        const slideImage = document.createElement("img");
        
        slideImage.setAttribute("src", this.slides[index].imagePath);
        slideImage.setAttribute("alt", this.slides[index].imageText);
        
        slideImage.classList.add("slide-image");
        
        const slideNumber = document.createElement("span");
        slideNumber.classList.add("slide-number");
        
        const slideCaption = document.createElement("p");
        slideCaption.classList.add("slide-caption"); 
        
        slideCaption.textContent = this.slides[index].imageCaption;
        
        imageContainer.appendChild(slideImage);
        imageContainer.appendChild(slideNumber);
        imageContainer.appendChild(slideCaption);
        
        slideItem.appendChild(imageContainer);

        this.mainContainer.appendChild(slidesList);
    }
    
    renderSides() {
        if (this.slides.length > 0) {
            for (let i = 0; i < this.slides.length; i++) {
                this.createSlide(i);
            }

            this.slidesArray = [...document.querySelectorAll(".slide-item")];
            this.slideNumberEls = document.querySelectorAll(".slide-number");
            this.slidesArray[this.globalIndex].classList.add("is-active-slide"); 
        }
 
        this.prepareControls();

        if (this.isDotsContainerShown && this.slides.length > 0) {
            this.renderDots(this.slidesArray);
            this.dotEls[this.globalIndex].classList.add("add-dot-bg-color");
        }

        this.changeSliderNumbers();

        document.addEventListener("keydown", this.onArrowKeyPress.bind(this));
    }

    prepareControls() {
        const nextButton = document.createElement("button");
        const prevButton = document.createElement("button"); 

        // renders dots container according to default options
        if (this.isDotsContainerShown) {
            this.dotsContainer = document.createElement("div");  
            this.dotsContainer.classList.add("dots-container");
            this.mainContainer.appendChild(this.dotsContainer);
            this.dotsContainer.addEventListener("click", this.onDotClick.bind(this));
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

        this.mainContainer.appendChild(nextButton);
        this.mainContainer.appendChild(prevButton);

        nextButton.addEventListener("click", this.onButtonClick.bind(this));
        prevButton.addEventListener("click", this.onButtonClick.bind(this));
        nextButton.addEventListener("dblclick", this.disableDoubleClickOnButton.bind(this));
        prevButton.addEventListener("dblclick", this.disableDoubleClickOnButton.bind(this));
    }


    moveSlides(prevIndex) {
        if (this.slides.length > 0) {
            this.slidesArray[this.globalIndex].classList.add("is-active-slide");
            this.slidesArray[prevIndex].classList.remove("is-active-slide");
        }
    }

    renderDots(arr) {
        arr.map(el => {
            const dot = document.createElement("div");
            dot.classList.add("dot");
            document.querySelector(".dots-container").appendChild(dot);
        })

        this.dotEls = document.querySelectorAll(".dot");
    }

    changeSliderNumbers() {
        // sets content only if slide exist
        if (this.slides.length > 0) {
            this.slideNumberEls[this.globalIndex].textContent = `${1 + this.globalIndex}/${this.slides.length}`;
        }
    }

    changeDotColor(prevIndex) {
        this.dotEls = document.querySelectorAll(".dot");
        if (this.slides.length > 0) {
            this.dotEls[prevIndex].classList.remove("add-dot-bg-color");
            this.dotEls[this.globalIndex].classList.add("add-dot-bg-color");
        }
    }

    onButtonClick(e) {
        const directionAttributeValue = JSON.parse(e.currentTarget.getAttribute("data-direction"));
        let nextStep = directionAttributeValue ? 1 : -1;
        let prevIndex = this.globalIndex;
        
        this.globalIndex = this.globalIndex + nextStep;
        
        // checks if globalIndex stays in possible range
        if (this.globalIndex > (this.slides.length - 1)) {
            this.globalIndex = 0;
        }
        
        if (this.globalIndex < 0) {
            this.globalIndex = this.slides.length - 1;
        }

        this.moveSlides(prevIndex);
        this.changeSliderNumbers();
        this.changeDotColor(prevIndex);
    }


    onDotClick(e) {
        const chosenDot = e.target;
        const indexOfChosenDot = [...chosenDot.parentElement.children].indexOf(chosenDot);
        const current = this.slidesArray[this.globalIndex];
        let next = this.slidesArray[indexOfChosenDot];
        
        this.dotEls[this.globalIndex].classList.remove("add-dot-bg-color");
        
        this.globalIndex = indexOfChosenDot;
        
        //doesn't allow switch classes by click on the same dot
        if (current !== next) {
            next.classList.add("is-active-slide");
            current.classList.remove("is-active-slide");
        }
        
        this.dotEls[this.globalIndex].classList.add("add-dot-bg-color");
        this.changeSliderNumbers();
    }


    onArrowKeyPress(e) {
        // checks if arrow key was pressed and invokes button events
        if (e.code === "ArrowRight") {
            document.querySelector(".next").click();
        }
        
        if (e.code === "ArrowLeft") {
            document.querySelector(".prev").click();
        }
    }

    disableDoubleClickOnButton(e) {
        e.stopPropagation();
    }


}
