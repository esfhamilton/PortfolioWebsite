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
    let btnDFS = document.getElementById("btn-dfs");
    let btnHamiltonian = document.getElementById("btn-hamiltonian");
    let btn_aStar = document.getElementById("btn-aStar");
    
    // Sets up game based on selected algorithm
    modeSetup("None");
    btnManual.onclick =function(){modeSetup("Manual");};
    
    btnHamiltonian.onclick =function(){modeSetup("Hamiltonian");};
    
    btnBFS.onclick =function(){modeSetup("BFS");};
    
    btnDFS.onclick =function(){modeSetup("DFS");};
    
    btn_aStar.onclick =function(){modeSetup("aStar");};
    
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
    
    if(mode!="None"){
        wait(200);    
    }
    
    /*  FOR WORKING ON 3 2 1 COUNTDOWN
        if(mode=="Manual"){
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
    // Mode must be selected
    if(mode!="None"){
        // Condition for ending game either losing or winning
        if(0<tail && tail<(cs+1)) {
            time++;
            document.getElementById("timeVal").innerHTML = time;
            document.getElementById("sizeVal").innerHTML = tail;

            // Decides on which algorithm to use based on button pressed
            switch(mode){

                // Hamiltonian Cycle 
                case "Hamiltonian":
                    hamiltonianCycle();
                    break;

                 // Best-First Search
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
                
                // Depth-first search 
                case "DFS":
                    direction = depthFirstSearch();
                    switch(direction) {
                        case 'N':
                            xv=0;yv=-1;            
                            break;
                        case 'E':
                            xv=1;yv=0;
                            break;
                        case 'S':
                            xv=0;yv=1;
                            break;
                        case 'W':
                            xv=-1;yv=0;
                            break; 
                    }
                    break; 
                    
                // A*
                case "aStar":
                    direction = aStarSearch();
                    switch(direction) {
                        case 'N':
                            xv=0;yv=-1;            
                            break;
                        case 'E':
                            xv=1;yv=0;
                            break;
                        case 'S':
                            xv=0;yv=1;
                            break;
                        case 'W':
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
        is the Hamiltonian Cycle. 
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
    
    /*// Manhattan distances from directional positions to apple
    nd = Math.abs(ax-nx)+Math.abs(ay-ny);
    ed = Math.abs(ax-ex)+Math.abs(ay-ey);
    sd = Math.abs(ax-sx)+Math.abs(ay-sy);
    wd = Math.abs(ax-wx)+Math.abs(ay-wy);*/
    
    // Alt-formula for distances, snake moves diagonally 
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
    
    // Starts off shortestDistance at max value
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

function expandNode(x,y,cost,direction,tree){
    
    // Set directional positions relative to snake head
    nx=sx=x;
    ey=wy=y;
    ny=y-1;
    sy=y+1;
    ex=x+1;
    wx=x-1;
    
    // Manhattan distances from directional positions to apple
    nd = Math.abs(ax-nx)+Math.abs(ay-ny);
    ed = Math.abs(ax-ex)+Math.abs(ay-ey);
    sd = Math.abs(ax-sx)+Math.abs(ay-sy);
    wd = Math.abs(ax-wx)+Math.abs(ay-wy);
    
    /*// Alt-formula for distances, snake moves diagonally 
    nd = Math.sqrt(Math.pow((nx-ax),2)+Math.pow((ny-ay),2));
    ed = Math.sqrt(Math.pow((ex-ax),2)+Math.pow((ey-ay),2));
    sd = Math.sqrt(Math.pow((sx-ax),2)+Math.pow((sy-ay),2));
    wd = Math.sqrt(Math.pow((wx-ax),2)+Math.pow((wy-ay),2));*/
    
    // Poor distance score if wall or tail
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
    
    cost++;
    
    if(direction=="None"){
        return ([[nd,nx,ny,1,'N'],[ed,ex,ey,1,'E'],[sd,sx,sy,1,'S'],[wd,wx,wy,1,'W']]);    
    }
    addNorth=addEast=addSouth=addWest=true;

    for(i=0;i<tree.length;i++){
        if(nx==tree[i][1] && ny==tree[i][2]){
            addNorth=false;
        }
        if(ex==tree[i][1] && ey==tree[i][2]){
            addEast=false;
        }
        if(sx==tree[i][1] && sy==tree[i][2]){
            addSouth=false;
        }
        if(wx==tree[i][1] && wy==tree[i][2]){
            addWest=false;
        }
    }
    
    if(addNorth){tree.push([nd,nx,ny,cost,direction]);}
    if(addEast){tree.push([ed,ex,ey,cost,direction]);}
    if(addSouth){tree.push([sd,sx,sy,cost,direction]);}
    if(addWest){tree.push([wd,wx,wy,cost,direction]);}
    
    return(tree); 
}

function depthFirstSearch() {
    
     /* 
        tree contains nested arrays each consisting of:
        [0] : Heuristic for distance to apple (h(x))
        [1] : x-position of node
        [2] : y-position of node
        [3] : Number of expansions from root node - The actual cost of the path (g(x))
        [4] : Root direction expanded from
    */
    let tree = expandNode(px,py,0,'None',[]);
    
    // Exit condition - When path to apple has been found or no paths exist
    let goalReached = false;
    // Exit condition - Monitors no. of iterations, exits loop if too high to avoid crash
    let expansions = 0;
    
    while(!goalReached && expansions<7000){
        expansions++;
        shortestDistance=9999;
        
        for(i=0;i<tree.length;i++){
            if(shortestDistance>tree[i][0]){
                shortestDistance = tree[i][0];
                direction = tree[i][4];
            }
        }
        
        // Either a path has been found or snake is doomed
        if(shortestDistance==0 || shortestDistance==9999){
            goalReached = true;
            break;
        }
        
        for(i=0;i<tree.length;i++){  
            // If node is not a wall/ tail/ expanded, shortestDistance = f(x)
            if(tree[i][0]!=9999 && shortestDistance==tree[i][0]){
                tree[i][0] = 9999; // 9999 also shows node has been expanded
                tree = expandNode(tree[i][1],tree[i][2],tree[i][3],tree[i][4],tree);
                break;
            }
        }
    }
    // Returns an integer in range 0-3 mapping to a NESW direction
    return(direction);
}

function aStarSearch() {

    /* 
        tree contains nested arrays each consisting of:
        [0] : Heuristic for distance to apple (h(x))
        [1] : x-position of node
        [2] : y-position of node
        [3] : Number of expansions from root node - The actual cost of the path (g(x))
        [4] : Root direction expanded from
    */
    let tree = expandNode(px,py,0,'None',[]);
    
    // Exit condition - When path to apple has been found or no paths exist
    let goalReached = false;
    // Exit condition - Monitors no. of iterations, exits loop if too high to avoid crash
    let expansions = 0;
    
    // The main loop for the A* algorithm f(x) = h(x) + g(x)
    while(!goalReached && expansions<7000){
        expansions++;
        shortestDistance=9999;
        
        for(i=0;i<tree.length;i++){
            // checks shortestDistance is greater than f(x)
            if(shortestDistance>(tree[i][0]+tree[i][3])){
                shortestDistance = tree[i][0]+tree[i][3];
                direction = tree[i][4];
                currentCost = tree[i][3];
            }
        }
        
        // Either a path has been found or snake is doomed
        if((shortestDistance-currentCost)==0 || shortestDistance==9999){
            goalReached = true;
            break;
        }
        
        for(i=0;i<tree.length;i++){  
            // If node is not a wall/ tail/ expanded, shortestDistance = f(x)
            if(tree[i][0]!=9999 && shortestDistance==(tree[i][0]+tree[i][3])){
                tree[i][0] = 9999; // 9999 also shows node has been expanded
                tree = expandNode(tree[i][1],tree[i][2],tree[i][3],tree[i][4],tree);
                break;
            }
        }
    }

    // Returns an integer in range 0-3 mapping to a NESW direction
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




