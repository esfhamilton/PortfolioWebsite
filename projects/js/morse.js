window.onload=function() {
    
    let btnMorse = document.getElementById("btn-morse");    
    
    // Declares the Intervals
    var downIntervalVar = setInterval(downIntervalFunc,1000/300);
    clearInterval(downIntervalVar);
    var upIntervalVar = setInterval(upIntervalFunc,1000/300);
    clearInterval(upIntervalVar);
    
    // Check if touch Device as different functions are required
    var isTouch = ('ontouchstart' in document.documentElement);

    // Accomodates for device and runs main functions
    if (isTouch) {
        
        btnMorse.addEventListener('touchstart',touchdown);
        btnMorse.addEventListener('touchend',touchup);
        
        function touchdown(ev){
            onDown();
            clearInterval(upIntervalVar);
            downIntervalVar = setInterval(downIntervalFunc,1000/300);
        }

        function touchup(ev){
            onUp();
            clearInterval(downIntervalVar);
            flag = (timeUp>40 ? false : true);
            flag2 = (timeUp>220 ? false : true);
            upIntervalVar = setInterval(upIntervalFunc,1000/300);

            letter += (timeDown>50 ? "-":"•");
        }
    }
    else {

        btnMorse.onmousedown = function() {
            onDown();
            clearInterval(upIntervalVar);
            downIntervalVar = setInterval(downIntervalFunc,1000/300);
        };

        btnMorse.onmouseup = function() {
            onUp();
            clearInterval(downIntervalVar);
            flag = (timeUp>40 ? false : true);
            flag2 = (timeUp>220 ? false : true);
            upIntervalVar = setInterval(upIntervalFunc,1000/300);

            letter += (timeDown>50 ? "-":"•");
        };   
    }; 
}

timeDown = 0;
timeUp = 0;
txt = "";
letter = "";
flag = true;
flag2 = true;
let txtString = document.getElementById("txt");
txtString.innerHTML = txt;
let morseString = document.getElementById("morse");
const beep = new Audio('../../resources/audio/morse.wav');


function onDown(){
    beep.play();
    timeDown = 0;
}

function onUp(){
    beep.pause();
    beep.currentTime = 0;
    timeUp = 0; 
}

function downIntervalFunc() {
    timeDown++;
}

function upIntervalFunc() {
    timeUp++;
    morseString.innerHTML = letter;
    if(timeUp>40 && flag){
        flag=false;
        
        txt = (txt.length>100?"":txt);
        
        txt += morseToText(letter);
        letter="";
        txtString.innerHTML = txt;
    }
    
    if(timeUp>220 && flag2){
        txt+=" ";
        flag2=false;
    }
}

/*
    Mappings for dots and dashes to characters based on International Morse Code
*/
function morseToText(letter) {
    mapping = {"•-":"A",
               "-•••":"B",
               "-•-•":"C",
               "-••":"D",
               "•":"E",
               "••-•":"F",
               "--•":"G",
               "••••":"H",
               "••":"I",
               "•---":"J",
               "-•-":"K",
               "•-••":"L",
               "--":"M",
               "-•":"N",
               "---":"O",
               "•--•":"P",
               "--•-":"Q",
               "•-•":"R",
               "•••":"S",
               "-":"T",
               "••-":"U",
               "•••-":"V",
               "•--":"W",
               "-••-":"X",
               "-•--":"Y",
               "--••":"Z",
               "•----":"1",
               "••---":"2",
               "•••--":"3",
               "••••-":"4",
               "•••••":"5",
               "-••••":"6",
               "--•••":"7",
               "---••":"8",
               "----•":"9",
               "-----":"0"};
    if(mapping[letter]==undefined){
        return(" ")
    }else{
        return(mapping[letter]);
    }
}





