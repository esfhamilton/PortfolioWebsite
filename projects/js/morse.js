window.onload=function() {

    document.addEventListener("keydown",keyPush);
    
    const beep = new Audio('../../resources/audio/morse.wav');
    
     
    let btnMorse = document.getElementById("btn-morse");
    let incBool =false;
    
    let temp = document.getElementById("txtBox");
        temp.innerHTML = txt;
    
    btnDownInterval = setInterval(btnDownFunc,1000/300);
    
    btnMorse.onclick = function() {
        temp.innerHTML = txt;
    }
    
    btnMorse.onmousedown = function() {
        timeDown = 0;
        beep.play();
        btnDownInterval = setInterval(btnDownFunc,1000/300);
    };

    btnMorse.onmouseup = function() {
        beep.pause();
        beep.currentTime = 0;
        clearInterval(btnDownInterval);
        
        if(timeDown>100){
            txt+="-";
        }
        else{
            txt+=".";
        }
        
        console.log("STOPPED at: "+timeDown+txt);
    };      

}

timeDown = 0;
txt = "";

function btnDownFunc() {
    timeDown++;
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




