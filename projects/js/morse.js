window.onload=function() {

    document.addEventListener("keydown",keyPush);
    
     
    let btnMorse = document.getElementById("btn-morse");
    let incBool =false;
    
    interval = setInterval(incrementingFunc,1000/300);
    
    btnMorse.onclick = function() {
        let temp = document.getElementById("temp");
        temp.innerHTML = "Alright hen, have some patience, there's still work to be done. \n A watched Morse Simulator never boils."
    }
    
    btnMorse.onmousedown = function() {
        incrementor = 0;
        incBool=true;
        interval = setInterval(incrementingFunc,1000/300);
    };

    btnMorse.onmouseup = function() {
        clearInterval(interval);
        console.log("STOPPED at: "+incrementor);
    };      

}

incrementor = 0;

function incrementingFunc() {
    incrementor++;
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




