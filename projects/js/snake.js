window.onload=function() {
    // Gets canvas in html
	canv=document.getElementById("gc");
	ctx=canv.getContext("2d");
    document.addEventListener("keydown",keyPush);
    
    // Speed modifier
    let slider = document.getElementById("speedSlider");
    let output = document.getElementById("speedVal");
    output.innerHTML = slider.value;

    
    // Initial speed variable
    let speedValue = 20;
    
    // Buttons
    let btnManual = document.getElementById("btn-manual");
    let btnBFS = document.getElementById("btn-bfs");
    let btnHamiltonian = document.getElementById("btn-hamiltonian");
    
    // Sets up game based on selected algorithm
    modeSetup("None");
    btnManual.onclick =function(){modeSetup("Manual");};
    
    btnBFS.onclick =function(){modeSetup("BFS");};
    
    btnHamiltonian.onclick =function(){modeSetup("Hamiltonian");};

    
    
    // Call game() 20 times per second by default
	let mainCall = setInterval(game,1000/speedValue); 
    
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

function clearCanvas() {
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canv.width,canv.height);
}

function modeSetup(mode) {
    clearCanvas();
    // Update global variable for mode 
    this.mode=mode; 
    // Reset game data
    time=0;
    px=py=9;
    gs=tc=22;
    cs = 484;
    ax=ay=15;
    xv=yv=0;
    trail=[];
    tail = 5; 
    // Style settings for text displays on canvas
    ctx.fillStyle="white"; 
    ctx.font = "50px Determination Mono";
    ctx.textAlign = "center";
    wait(1000);
    /*if(mode=="Manual"){
        ctx.fillText("Manual test",canv.width/2, canv.height/2);    
        console.log("TEST")
    }*/
}

// Variable to decide which snake algorithm is used
mode="None";
// Update these values in modeSetup, call mode Setup in each click function
// Game timer
time=0;
// Player starting position
px=py=9;
// Grid size & tile count (gs*gs must equal canvas size)
gs=tc=22;
// Canvas size
cs = 484;
// Apple starting position 
ax=ay=15;
// Velocity
xv=yv=0;
trail=[];
tail = 5; 

// Main game function, called repeatedly based on speedValue
function game() {
    
    if(mode!="None"){
        if(0<tail && tail<(cs+1)) {
            time++;
            document.getElementById("timeVal").innerHTML = time;

            // Decides on which algorithm to use based on button pressed
            switch(mode){

                // Hamiltonian Cycle 
                case "Hamiltonian":
                    hamiltonianCycle();
                    break;

                 // Best First Search
                case "BFS":
                    direction = bestFirstSearch();
                    switch(direction) {
                        case 0:
                            xv=0;yv=-1;            
                            break;
                        case 1:
                            xv=1;yv=0;
                            break;
                        case 2:
                            xv=0;yv=1;
                            break;
                        case 3:
                            xv=-1;yv=0;
                            break; 
                    }
                    break;

                // Manual Mode
                case "Manual":
                    if(xv==yv){
                        xv=1;
                    }
            }

            // Wraps snake, can change this to end game on touching wall
            /*if(px<0) {
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
            }*/

            // Ends game if touching wall
            if(px<0||px>tc-1||py<0||py>tc-1) {
                tail=0;
            }

            // Clears canvas with each call
            clearCanvas();

            // Generates snake
            ctx.fillStyle="lime";
            for(var i=0;i<trail.length;i++) {
                ctx.fillRect(trail[i].x*gs,trail[i].y*gs,gs-2,gs-2);
                // Condition for snake head touching tail
                if(trail[i].x==px && trail[i].y==py) {
                    if(tail==cs){
                        tail=(cs+1); // Flags game complete
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
            clearCanvas();
            ctx.fillStyle="red"; 
            ctx.fillText("Game Over",canv.width/2, canv.height/2);
        } 
        // Game Complete
        else {
            clearCanvas();
            ctx.fillStyle="lime"; 
            ctx.fillText("Game Complete",canv.width/2, canv.height/2);
        }
    }
    
    else{
        ctx.font = "35px Determination Mono";
        ctx.fillText("Select an algorithm",canv.width/2, canv.height/2);
    }
}



function countdown() {
    clearCanvas();
    ctx.fillStyle="white"; 
    ctx.font = "50px Determination Mono";
    ctx.textAlign = "center";
    ctx.fillText("TEST",canv.width/2, canv.height/2);
}

function wait(ms) {
    var d = new Date();
    var d2 = null;
    do { d2 = new Date();} 
    while(d2-d < ms);
}

function hamiltonianCycle() {
    /*
        Behold the dirty block of code which
        is the Hamiltonian Circuit. 
        There are much cleaner ways of programming this,
        but hey it gets the job done.
    */
    if(px==9&&py==9){xv=1;yv=0;}
    if(px==tc-1&&py==9){xv=0;yv=-1;}
    if(px==tc-1&&py==8){xv=-1;yv=0;}
    if(px==1&&py==8){xv=0;yv=-1;}
    if(px==1&&py==7){xv=1;yv=0;}
    if(px==tc-1&&py==7){xv=0;yv=-1;}
    if(px==tc-1&&py==6){xv=-1;yv=0;}
    if(px==1&&py==6){xv=0;yv=-1;}
    if(px==1&&py==5){xv=1;yv=0;}
    if(px==tc-1&&py==5){xv=0;yv=-1;}
    if(px==tc-1&&py==4){xv=-1;yv=0;}
    if(px==1&&py==4){xv=0;yv=-1;}
    if(px==1&&py==3){xv=1;yv=0;}
    if(px==tc-1&&py==3){xv=0;yv=-1;}
    if(px==tc-1&&py==2){xv=-1;yv=0;}
    if(px==1&&py==2){xv=0;yv=-1;}
    if(px==1&&py==1){xv=1;yv=0;}
    if(px==tc-1&&py==1){xv=0;yv=-1;}
    if(px==tc-1&&py==0){xv=-1;yv=0;}
    if(px==0&&py==0){xv=0;yv=1;}
    if(px==0&&py==tc-1){xv=1;yv=0;}
    if(px==tc-1&&py==tc-1){xv=0;yv=-1;}
    if(px==tc-1&&py==20){xv=-1;yv=0;}
    if(px==1&&py==20){xv=0;yv=-1;}
    if(px==1&&py==19){xv=1;yv=0;}
    if(px==tc-1&&py==19){xv=0;yv=-1;}
    if(px==tc-1&&py==18){xv=-1;yv=0;}
    if(px==1&&py==18){xv=0;yv=-1;}
    if(px==1&&py==17){xv=1;yv=0;}
    if(px==tc-1&&py==17){xv=0;yv=-1;}
    if(px==tc-1&&py==16){xv=-1;yv=0;}
    if(px==1&&py==16){xv=0;yv=-1;}
    if(px==1&&py==15){xv=1;yv=0;}
    if(px==tc-1&&py==15){xv=0;yv=-1;}
    if(px==tc-1&&py==14){xv=-1;yv=0;}
    if(px==1&&py==14){xv=0;yv=-1;}
    if(px==1&&py==13){xv=1;yv=0;}
    if(px==tc-1&&py==13){xv=0;yv=-1;}
    if(px==tc-1&&py==12){xv=-1;yv=0;}
    if(px==1&&py==12){xv=0;yv=-1;}
    if(px==1&&py==11){xv=1;yv=0;}
    if(px==tc-1&&py==11){xv=0;yv=-1;}
    if(px==tc-1&&py==10){xv=-1;yv=0;}
    if(px==1&&py==10){xv=0;yv=-1;}
    if(px==1&&py==9){xv=1;yv=0;}
}

function bestFirstSearch() {
    
    // Set directional positions relative to snake head
    nx=sx=px;
    ey=wy=py;
    ny=py-1;
    sy=py+1;
    ex=px+1;
    wx=px-1;
    
    // Distances from each direction to apple
    nd = Math.sqrt(Math.pow((nx-ax),2)+Math.pow((ny-ay),2));
    ed = Math.sqrt(Math.pow((ex-ax),2)+Math.pow((ey-ay),2));
    sd = Math.sqrt(Math.pow((sx-ax),2)+Math.pow((sy-ay),2));
    wd = Math.sqrt(Math.pow((wx-ax),2)+Math.pow((wy-ay),2));
    
    // Adds poor distance score (9999) to direction which collides with tail or wall
    for(var i=0; i <trail.length;i++){
        if (nx==trail[i].x && ny==trail[i].y || ny==-1 || ny==tc){
            nd=9999;
        }
        if (ex==trail[i].x && ey==trail[i].y || ex==-1 || ex==tc){
            ed=9999;
        }
        if (sx==trail[i].x && sy==trail[i].y || sy==-1 || sy==tc){
            sd=9999;
        }
        if (wx==trail[i].x && wy==trail[i].y || wx==-1 || wx==tc){
            wd=9999;
        }
    } 
    
    distances = [nd,ed,sd,wd];
    
    shortestDistance = 9999;
    direction=0;
    
    // Chooses lowest distance and stores value corresponding to distance
    for (d=0;d<distances.length;d++){
        if(shortestDistance>distances[d]){
            shortestDistance = distances[d];
            direction = d;
        }
    }
    
    // Returns an integer in range 0-3 mapping to a favoured direction
    return(direction);
}

// Controls for changing direction if playing/ testing
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




