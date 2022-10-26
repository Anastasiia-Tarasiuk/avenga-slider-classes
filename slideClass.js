export class Slide {
    constructor( imagePath, imageText, imageCaption ) {
        this.imagePath = imagePath;
        this.imageText = imageText;
        this.imageCaption = imageCaption;
    }
 
    createSlide() {
        const slideItem  = document.createElement("li");
        slideItem.classList.add("slide-item", "animation");

        const imageContainer = document.createElement("div");
        imageContainer.classList.add("image-container");

        const slideImage = document.createElement("img");
        slideImage.setAttribute("src", this.imagePath);
        slideImage.setAttribute("alt", this.imageText);
        slideImage.classList.add("slide-image");

        const slideNumber = document.createElement("span");
        slideNumber.classList.add("slide-number");
        
        const slideCaption = document.createElement("p");
        slideCaption.classList.add("slide-caption"); 
        slideCaption.textContent = this.imageCaption;

        imageContainer.appendChild(slideImage);
        imageContainer.appendChild(slideNumber);
        imageContainer.appendChild(slideCaption);
        
        slideItem.appendChild(imageContainer);

        return slideItem;
    }
}
