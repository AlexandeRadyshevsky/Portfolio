const words = ["JavaScript", "TypeScript", "Vue.Js", "HTML", "Python", "CSS"];  
let index = 0;  
const textElement = document.getElementById("text");  
const typingSpeed = 200;  
const erasingSpeed = 100;  
const pauseBetweenWords = 1000;  
let currentShape = 'roundedSquare';
const shape = document.getElementById("shape");
let lastScrollTop = 0; 
let lastChangeScrollTop = 0;
const scrollThreshold = 300;

function openTelegramChat() {
    window.open('https://t.me/alexanderadyshevsky', '_blank');
}


function changeShape() {
    switch (currentShape) {
        case 'roundedSquare':
            shape.setAttribute('rx', '0');
            shape.setAttribute('transform', 'rotate(45 50 50)');
            currentShape = 'square';
            break;
        case 'square':
            shape.setAttribute('transform', 'rotate(0 50 50)');
            shape.setAttribute('d', 'M50,10 L90,50 L50,90 L10,50 Z'); 
            currentShape = 'diamond';
            break;
        case 'diamond':
            shape.setAttribute('rx', '60');
            shape.setAttribute('d', 'M20,20 h60 v60 h-60 z');
            currentShape = 'roundedSquare';
            break;
    }
}


function updateBackgroundAndTextColors(direction) {
    const h1Elements = document.querySelectorAll('h1');
    const h2Elements = document.querySelectorAll('h2');
    const vectorElements = document.querySelectorAll('.vector');
    const vector2 = document.getElementById('vector2');
    const leftPath = document.getElementById('leftPath');
    const rightPath = document.getElementById('rightPath');

    if (direction === 'down') {
        document.body.style.backgroundColor = 'white';
        document.body.style.color = 'black';
        shape.style.fill = 'black';

        h1Elements.forEach(el => el.style.color = 'black');
        h2Elements.forEach(el => el.style.color = 'black');

        vectorElements.forEach(vector => vector.style.stroke = 'black');
        if (vector2) vector2.style.stroke = 'white';
        
        if (leftPath) leftPath.style.stroke = 'black';
        if (rightPath) rightPath.style.stroke = 'black';
    } else {
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
        shape.style.fill = 'white';

        h1Elements.forEach(el => el.style.color = 'white');
        h2Elements.forEach(el => el.style.color = 'white');

        vectorElements.forEach(vector => vector.style.stroke = 'white');
        if (vector2) vector2.style.stroke = 'black';

        if (leftPath) leftPath.style.stroke = 'white';
        if (rightPath) rightPath.style.stroke = 'white';
    }
}

let isTransparent = false; 

function updateOpacityOnScroll(scrollDirection, scrollTop) {
    const leftPath = document.getElementById('leftPath');

    if (!leftPath) return;

    if (scrollDirection === 'down' && scrollTop >= 600 && !isTransparent) {
        isTransparent = true; 
        leftPath.style.transition = 'opacity 1.5s ease, filter 1s ease'; 
        leftPath.style.filter = 'blur(3px)'; 
        setTimeout(() => {
            leftPath.style.filter = 'blur(0)'; 
            leftPath.style.opacity = 0.2; 
        }, 1000); 
    } else if (scrollDirection === 'up' && scrollTop < 200 && isTransparent) {
        isTransparent = false; 
        leftPath.style.transition = 'opacity 1.5s ease, filter 1s ease'; 
        leftPath.style.opacity = 1; 
        leftPath.style.filter = 'blur(0)'; 
    }
}


window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';

    if (Math.abs(scrollTop - lastChangeScrollTop) >= scrollThreshold) {
        changeShape();
        lastChangeScrollTop = scrollTop;
    }

    updateBackgroundAndTextColors(scrollDirection);
    updateOpacityOnScroll(scrollDirection, scrollTop); 
    lastScrollTop = scrollTop;
});


function typeWord(word) {  
    let charIndex = 0;  
    textElement.textContent = "";  

    const typingInterval = setInterval(() => {  
        if (charIndex < word.length) {  
            textElement.textContent += word.charAt(charIndex);  
            charIndex++;  
        } else {  
            clearInterval(typingInterval);  
            setTimeout(() => eraseWord(word), pauseBetweenWords);  
        }  
    }, typingSpeed);  
}  


function eraseWord(word) {  
    let charIndex = word.length;  

    const erasingInterval = setInterval(() => {  
        if (charIndex > 0) {  
            textElement.textContent = word.substring(0, charIndex - 1);  
            charIndex--;  
        } else {  
            clearInterval(erasingInterval);  
            index = (index + 1) % words.length;  
            setTimeout(() => typeWord(words[index]), pauseBetweenWords);  
        }  
    }, erasingSpeed);  
}


function updateLetterColors() {
    const highlightedLetters = document.querySelectorAll('.highlight-letter');
    const leftPath = document.getElementById('leftPath');
    const rightPath = document.getElementById('rightPath');

    if (!leftPath || !rightPath) return;

    const leftPathRect = leftPath.getBoundingClientRect();
    const rightPathRect = rightPath.getBoundingClientRect();
    
    highlightedLetters.forEach(letter => {
        const letterRect = letter.getBoundingClientRect();
        
        const isOverlappingLeft = !(
            leftPathRect.right < letterRect.left ||
            leftPathRect.left > letterRect.right ||
            leftPathRect.bottom < letterRect.top ||
            leftPathRect.top > letterRect.bottom
        );

        const isOverlappingRight = !(
            rightPathRect.right < letterRect.left ||
            rightPathRect.left > letterRect.right ||
            rightPathRect.bottom < letterRect.top ||
            rightPathRect.top > letterRect.bottom
        );

        letter.style.mixBlendMode = (isOverlappingLeft || isOverlappingRight) ? 'difference' : 'normal';
    });
}


document.addEventListener('DOMContentLoaded', function () {  
    typeWord(words[index]);
});

