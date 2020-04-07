window.onload=function() {
    
    const beep = new Audio('../../resources/audio/morse.wav');
    
     
    let btnMorse = document.getElementById("btn-morse");    
    
    btnDownInterval = setInterval(btnDownFunc,1000/300);
    clearInterval(btnDownInterval);
    
    btnUpInterval = setInterval(btnUpFunc,1000/300);
    clearInterval(btnUpInterval);
    
    btnMorse.onmousedown = function() {
        beep.play();
        timeDown = 0;
        clearInterval(btnUpInterval);
        btnDownInterval = setInterval(btnDownFunc,1000/300);
    };

    btnMorse.onmouseup = function() {
        beep.pause();
        beep.currentTime = 0;
        timeUp = 0;
        clearInterval(btnDownInterval);
        flag = (timeUp>40 ? false : true);
        flag2 = (timeUp>220 ? false : true);
        btnUpInterval = setInterval(btnUpFunc,1000/300);
        
        letter += (timeDown>50 ? "-":"•");
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


function btnDownFunc() {
    timeDown++;
}

function btnUpFunc() {
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
    console.log(timeUp);
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





