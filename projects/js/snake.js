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
      /*  xv=1
        yv=0;
        incrementer++;
        if (incrementer == 23){
            xv=0;
            yv=1;
            incrementer=0;
        }*/

        // ######################
        
        //############ Best First Search
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
        
        // ######################

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

function bestFirstSearch(){
    // nx ny ex ey sx sy wx wy
    // check if ny sy touches vertical walls
    // check if ex wx touches horizontal walls
    // check each position which goes against current velocity is not added to array
    
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
    
    for(var i=0; i <trail.length;i++){
        if (nx==trail[i].x && ny==trail[i].y || ny==-1 || ny==23){
            nd=9999;
        }
        if (ex==trail[i].x && ey==trail[i].y || ex==-1 || ex==23){
            ed=9999;
        }
        if (sx==trail[i].x && sy==trail[i].y || sy==-1 || sy==23){
            sd=9999;
        }
        if (wx==trail[i].x && wy==trail[i].y || wx==-1 || wx==23){
            wd=9999;
        }
    } 
    
    distances = [nd,ed,sd,wd];
    
    shortestDistance = nd;
    direction=0;
    
    for (d=0;d<distances.length;d++){
        if(shortestDistance>distances[d]){
            shortestDistance = distances[d];
            console.log(shortestDistance);
            direction = d;
        }
    }
    console.log(nd,sd,ed,wd);
    console.log(direction);
    return(direction);
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


