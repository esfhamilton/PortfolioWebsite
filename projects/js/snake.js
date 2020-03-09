window.onload=function() {
    // Gets canvas in html
	canv=document.getElementById("gc");
	ctx=canv.getContext("2d");
    document.addEventListener("keydown",keyPush);
    
    // Initial speed variable
     speedValue = 20;
    
    // Call game() 20 times per second by default
	var mainCall = setInterval(game,1000/speedValue); 
    
    // Slider changes call frequency based on value
    slider.oninput = function() {
        clearInterval(mainCall);
        speedValue = this.value;
        
        // Display for value
        if (this.value == 100){
            output.innerHTML = 'MAX';
        } else{
            output.innerHTML = this.value;
        }
        
        // Stop if 0, max speed if 100
        if (speedValue==100){
            mainCall = setInterval(game,1000/0);
        } else if (speedValue>0) {
            speedValue *= 2;
            mainCall = setInterval(game,1000/speedValue);
        }
        
        // Clears focus from slider (may remove this later)
        slider.blur();
    }
}

// Game timer
time=0;
// Player starting position
px=py=10;
// Grid size & tile count (gs*gs must equal canvas size)
gs=tc=23;
// Canvas size
cs = 529;
// Apple starting position 
ax=ay=15;
// Velocity
xv=yv=0;
trail=[];
tail = 5; // Set to 5 after testing

// ##########
incrementer = 0;
// Function is called based on time in setInterval()
function game() {
    
    // This will break in manual mode as snake will immediately crash into itself
    if(0<tail && tail<530) {
        time++;
        document.getElementById("timeVal").innerHTML = time;


        // ########### The current AI
        xv=1
        yv=0;
        incrementer++;
        if (incrementer == 23){
            xv=0;
            yv=1;
            incrementer=0;
        }

        // ######################

        // Wraps snake, can change this to end game on touching wall
        if(px<0) {
            px= tc-1;
        }
        if(px>tc-1) {
            px= 0;
        }
        if(py<0) {
            py= tc-1;
        }
        if(py>tc-1) {
            py= 0;
        }

        // Background
        ctx.fillStyle="black";
        ctx.fillRect(0,0,canv.width,canv.height);

        // Generates snake
        ctx.fillStyle="lime";
        for(var i=0;i<trail.length;i++) {
            ctx.fillRect(trail[i].x*gs,trail[i].y*gs,gs-2,gs-2);
            if(trail[i].x==px && trail[i].y==py) {
                if(tail==529){
                    tail=530; // Flags game complete
                } else{
                    tail = 0; // Flags game over
                }

            }
        }

        // All elements of snake move to position in front
        trail.push({x:px,y:py});
        while(trail.length>tail) {
        trail.shift();
        }
        
        oax=ax;
        oay=ay;

        // Changes apple position when 'eaten'
        if(ax==px && ay==py) {
            tail++;
            if (tail<cs){
                ax=Math.floor(Math.random()*tc);
                ay=Math.floor(Math.random()*tc);
                let repeatFlag=true;
                while(repeatFlag){
                    repeatFlag = false;
                    for(i=0; i <trail.length;i++){
                        if(trail[i].x==ax && trail[i].y==ay){
                            ax=Math.floor(Math.random()*tc);
                            ay=Math.floor(Math.random()*tc);
                            repeatFlag=true;
                        }  
                    }
                }
            }
        }

        // If tail == X Game complete
        // Game Over
    
        // Position updates based on velocity value
        px+=xv;
        py+=yv;
    
        // Generates apple
        ctx.fillStyle="red";
        ctx.fillRect(ax*gs,ay*gs,gs-2,gs-2);
    } 
    // Game Over
    else if(tail==0) {
        ctx.fillStyle="black";
        ctx.fillRect(0,0,canv.width,canv.height);
        ctx.fillStyle="red"; 
        ctx.font = "50px Determination Mono";
        ctx.textAlign = "center";
        ctx.fillText("Game Over",canv.width/2, canv.height/2);
    } 
    // Game Complete
    else {
        ctx.fillStyle="black";
        ctx.fillRect(0,0,canv.width,canv.height);
        ctx.fillStyle="lime"; 
        ctx.font = "50px Determination Mono";
        ctx.textAlign = "center";
        ctx.fillText("Game Complete",canv.width/2, canv.height/2);
    }
}

// Controls for changing direction if playing/ testing
function keyPush(evt) {
	switch(evt.keyCode) {
		// Left arrow
        case 37:
			xv=-1;yv=0;
			break;
        // Up arrow    
		case 38:
			xv=0;yv=-1;
			break;
        // Right arrow    
		case 39:
			xv=1;yv=0;
			break;
        // Down arrow    
		case 40:
			xv=0;yv=1;
			break;
	}
}

// Speed modifier
let slider = document.getElementById("speedSlider");
let output = document.getElementById("speedVal");
output.innerHTML = slider.value;


