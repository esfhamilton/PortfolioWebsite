window.onload=function() {

    document.addEventListener("keydown",keyPush);
    
    const beep = new Audio('../../resources/audio/morse.wav');
    
     
    let btnMorse = document.getElementById("btn-morse");
    let incBool =false;
    
    
    
    btnDownInterval = setInterval(btnDownFunc,1000/300);
    clearInterval(btnDownInterval);
    
    btnUpInterval = setInterval(btnUpFunc,1000/300);
    clearInterval(btnUpInterval);
    
/*    btnMorse.onclick = function() {
        if(timeUp>80){
            txt += morseToText(letter);
            letter="";
            temp.innerHTML = txt;
        }
    }*/
    
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
        btnUpInterval = setInterval(btnUpFunc,1000/300);
        
        letter += (timeDown>56 ? "-":"•");
        
        console.log("STOPPED at: "+timeDown+txt);
    };      

}

timeDown = 0;
timeUp = 0;
txt = "";
letter = "";
let txtString = document.getElementById("txt");
txtString.innerHTML = txt;
let morseString = document.getElementById("morse");
morseString.innerHTML = letter;

function btnDownFunc() {
    timeDown++;
}

function btnUpFunc() {
    timeUp++;
    if(timeUp>80){
        txt += morseToText(letter);
        letter="";
        txtString.innerHTML = txt;
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

// Called on keydown event 
function keyPush(evt) {
	switch(evt.keyCode) {
		// Left arrow
        case 37:
            evt.preventDefault();
            if(xv!=1){xv=-1;yv=0;}
			break;
        // Up arrow    
		case 38:
            evt.preventDefault();
			if(yv!=1){xv=0;yv=-1};
			break;
        // Right arrow    
		case 39:
            evt.preventDefault();
			if(xv!=-1){xv=1;yv=0};
			break;
        // Down arrow    
		case 40:
            evt.preventDefault();
			if(yv!=-1){xv=0;yv=1};
			break;
	}
}




