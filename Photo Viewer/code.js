// use strict in JS code
"use strict";

// global variables
let photos = [];        
let idx = 0;   
let time = null;    
let loaded = false;

/* LAMBDA */
const setMsg = (msg) => { document.getElementById("msg").textContent = msg; };

// setPhoto 
function setPhoto(path) {

    document.getElementById("image").src = path;
    document.querySelector("#imageName").value = path;
}





// loadLocal 
function loadLocal() {
    
    stopSlideShow();
    photos = [];
    idx = 0;
    loaded = false;

    const folder = document.getElementById("folder").value;
    const file = document.getElementById("commonName").value;
    const start = Number(document.getElementById("startNum").value);
    const end = Number(document.getElementById("endNum").value);
    
    if (end < start) {

        setMsg("Error: Invalid Range");
        return;
    }

    else {
        
        for (let i = start; i <= end; i++) {
            
            photos.push(folder + file + i + ".jpg");
        }
        loaded = true;
        setMsg("Photo Viewer System");
        setPhoto(photos[idx]);
    }
}

// loadJson
async function loadJson() {

    stopSlideShow();
    photos = [];
    idx = 0;
    loaded = false;

    const url = document.getElementById("url").value;
    const response = await fetch(url);
    const pics = await response.json();

    for (const item of pics.images) {
        
        photos.push(item.imageURL);
    }

    loaded = true;
    setMsg("Photo Viewer System");
    setPhoto(photos[idx]);
}





// showPrev 
function showPrev() {

    if (!loaded) {

        setMsg("Error: you must load data first");
        return;
    }

    else {

        if (idx === 0) {

            idx = photos.length - 1;
        }

        else { 

            idx = idx - 1;
        }   
        setPhoto(photos[idx]);
    }
}

// showNext
function showNext() {
    if (!loaded) {

        setMsg("Error: you must load data first");
        return;
    }

    else {

        if (idx === photos.length - 1) {

            idx = 0;
        }

        else { 

            idx = idx + 1;
        }   
        setPhoto(photos[idx]);
    }
}

// showFirst
function showFirst() {

    if (!loaded) {
        
        setMsg("Error: you must load data first");
        return;
    }

    else {
        
        idx = 0; 
        setPhoto(photos[idx]);
    }
}

// showLast 
function showLast() {

    if (!loaded) {

        setMsg("Error: you must load data first");
        return;
    }

    else {

        idx = photos.length - 1;
        setPhoto(photos[idx]);
    }
}





// slideShow 
function slideShow() {
    
    if (!loaded) {
        
        setMsg("Error: you must load data first");
        return;
    }
    stopSlideShow();
    time = setInterval(showNext, 1000);
}


// randSlideShow
function randSlideShow() {

    if (!loaded) {
        
        setMsg("Error: you must load data first");
        return;
    }
    stopSlideShow();
    
    time = setInterval(function() {

        // no nextInt() like in Java, gotta use floor to get int and I can not round up due to bounds
        idx = Math.floor(Math.random() * photos.length);
        setPhoto(photos[idx]);
    }, 1000);
}

// stopSlideShow
function stopSlideShow() {
    
    if (time !== null) {
        
        clearInterval(time);
        time = null;
    }
}

// reset
function reset() {

    photos = [];
    idx = 0;
    loaded = false;
    setMsg("");
    stopSlideShow();
    setPhoto("InitialImage.jpg");
}





// main (just like 436 gets takes me back)
function main() {

    setPhoto("InitialImage.jpg");

    document.getElementById("localBtn").onclick = loadLocal;
    document.getElementById("jsonBtn").onclick = loadJson;

    document.getElementById("prevBtn").onclick = showPrev;
    document.getElementById("nextBtn").onclick = showNext;
    document.getElementById("firstBtn").onclick = showFirst;
    document.getElementById("lastBtn").onclick = showLast;

    document.getElementById("slideBtn").onclick = slideShow;
    document.getElementById("randomBtn").onclick = randSlideShow;
    document.getElementById("stopBtn").onclick = stopSlideShow;

    document.getElementById("photoForm").onreset = reset;

    document.getElementById("image").onclick = showNext;
}

window.onload = main;