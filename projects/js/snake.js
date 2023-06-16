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
    let speedValue = 10;
    
    // Buttons
    let btnManual = document.getElementById("btn-manual");
    let btnBFS = document.getElementById("btn-bfs");
    let btnDFS = document.getElementById("btn-dfs");
    let btnHamiltonian = document.getElementById("btn-hamiltonian");
    let btn_aStar = document.getElementById("btn-aStar");
    
    // Sets up game based on selected algorithm
    modeSetup("None");
    let mainCall;

    const restartGame = () => {
        ctx.font = "50px Determination Mono";
        clearInterval(mainCall);
        if(speedValue>0) mainCall = setInterval(game,1000/speedValue); // Calls game speedValue times per second 
    }
    
    const mouseOverState = () => {
        clearCanvas();
        clearInterval(mainCall);
        ctx.fillStyle="#4cd6ff"; 
        ctx.font = "25px Determination Mono";
        ctx.textAlign = "center";
    }

    btnManual.onclick =function(){
        modeSetup("Manual");
        restartGame();
    };
    
    btnHamiltonian.onclick =function(){
        modeSetup("Hamiltonian");
        restartGame();
    };
    
    btnBFS.onclick =function(){
        modeSetup("BFS");
        restartGame();
    };
    
    btnDFS.onclick =function(){
        modeSetup("DFS");
        restartGame();
    };
    
    btn_aStar.onclick =function(){
        modeSetup("aStar");
        restartGame();
    };
    
    btnManual.onmouseover =function(){
        mouseOverState();
        ctx.fillText("This algorithm is only as good",canv.width/2, canv.height/2-10);
        ctx.fillText("as the player",canv.width/2, canv.height/2+20);
    };
    
    btnManual.onmouseout =function(){
        clearCanvas();
        restartGame();
    };
    
    btnHamiltonian.onmouseover =function(){
        mouseOverState();
        lineSplitter("A Hamiltonian cycle is one in which\na cyclic path traverses every node in\na graph. In this case, each node would\n correspond to a position on the grid.\n\nAs such, the snake will eventually\ncomplete the game but you will be\nwaiting a while, even on max speed",3);
    };

    btnHamiltonian.onmouseout =function(){
        clearCanvas();
        restartGame();
    };
    
    btnBFS.onmouseover =function(){
        mouseOverState();
        lineSplitter("Treating the front of the snake as a\nroot node, BFS checks each adjacent\nnode corresponding to the top,\nbottom, left and right positions.\n\nThe distance to the goal is calculated\nfor each position and the shortest\nroute is picked.\n\n Because the algorithm doesn't search\nfurther than 1 position ahead, it is\nprone to colliding with itself when\nother paths are available.",5);
    };
    
    btnBFS.onmouseout =function(){
        clearCanvas();
        restartGame();
    };
    
    btnDFS.onmouseover =function(){
        mouseOverState();
        lineSplitter("The DFS algorithm is an iterative\nversion of the BFS algorithm which\ncontinues expanding after the root\nnode. This means that a path will be\nfound to the goal, if one exists.\nBecause of this, the snake avoids\ncolliding with itself when another\nopen path is available.\n\nHowever, the snake is still vulnerable\nto coiling around itself into a\nrestricted area in which it will not\nbe able to escape in time, before an\nopening is created.",6);
    };
    
    btnDFS.onmouseout =function(){
        clearCanvas();
        restartGame();
    };
    
    btn_aStar.onmouseover =function(){
        mouseOverState();
        lineSplitter("A* Search is essentially a DFS\nalgorithm except involves calculating\nthe optimal direction based on both a\nheuristic and actual cost.\n\nThe heuristic is the Manhattan\ndistance to the goal and the actual\ncost is how many node expansions are\nrequired to get there.\n\nThe algorithm still falls victim to\nthe limitations of DFS but it finds\nmore optimal paths.",5);
    };
    
    btn_aStar.onmouseout =function(){
        clearCanvas();
        restartGame();
    };
    
    // Slider changes call frequency based on value
    slider.oninput = function() {
        speedValue = this.value;
        
        // Display for value
        if (this.value == 100){
            output.innerHTML = 'MAX';
        } else{
            output.innerHTML = this.value;
        }

        clearInterval(mainCall);
        if(speedValue>0) mainCall = setInterval(game,1000/speedValue);
    }  
}

// Used to prevent having to keep creating multiple fillText lines
const lineSplitter = (txt,startPos) => {
    let spacing = 25;
    let lines = txt.split('\n');

    for (let i = 0; i<lines.length; i++){
        ctx.fillText(lines[i], canv.width/2, canv.height/startPos + (i*spacing) );
    }
}

// Clears canvas of any text or entities etc.
const clearCanvas = () => {
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canv.width,canv.height);
}

const modeSetup = (mode) => {
    clearCanvas();
    // Update global variable for mode 
    this.mode=mode; 
    // Reset game data
    time=0;
    px=py=9;
    applePosX=applePosY=15;
    velocityX=velocityY=0;
    trail=[];
    tail = 5; 
    // Style settings for text displays on canvas
    ctx.fillStyle="white"; 
    ctx.font = "50px Determination Mono";
    ctx.textAlign = "center";
    
    if(mode!="None"){
        wait(300);    
    }
}

const gridSize=22;
const canvasSize=gridSize**2;
mode="None";
time=0;
px=py=9; // Starting position
applePosX=applePosY=15;
velocityX=velocityY=0;
trail=[];
tail = 5; 

const game = () => {

    if(mode!="None"){
        if(0<tail && tail<(canvasSize+1)) {
            clearCanvas();
            time++;
            document.getElementById("timeVal").innerHTML = time;
            document.getElementById("sizeVal").innerHTML = tail;

            switch(mode){

                case "Hamiltonian":
                    hamiltonianCycle();
                    break;

                case "BFS":
                    direction = bestFirstSearch();
                    switch(direction) {
                        case 0:
                            velocityX=0;velocityY=-1;            
                            break;
                        case 1:
                            velocityX=1;velocityY=0;
                            break;
                        case 2:
                            velocityX=0;velocityY=1;
                            break;
                        case 3:
                            velocityX=-1;velocityY=0;
                            break; 
                    }
                    break;
                
                case "DFS":
                    direction = depthFirstSearch();
                    switch(direction) {
                        case 'N':
                            velocityX=0;velocityY=-1;            
                            break;
                        case 'E':
                            velocityX=1;velocityY=0;
                            break;
                        case 'S':
                            velocityX=0;velocityY=1;
                            break;
                        case 'W':
                            velocityX=-1;velocityY=0;
                            break; 
                    }
                    break; 
                    
                case "aStar":
                    direction = aStarSearch();
                    switch(direction) {
                        case 'N':
                            velocityX=0;velocityY=-1;            
                            break;
                        case 'E':
                            velocityX=1;velocityY=0;
                            break;
                        case 'S':
                            velocityX=0;velocityY=1;
                            break;
                        case 'W':
                            velocityX=-1;velocityY=0;
                            break; 
                    }
                    break;

                case "Manual":
                    if(velocityX==velocityY){
                        velocityX=1;
                    }
            }            

            // Ends game if touching wall
            if(px<0||px>gridSize-1||py<0||py>gridSize-1) {
                tail=0;
            }   

            // All elements of snake move to position in front
            trail.push({x:px,y:py});
            while(trail.length>tail) {
                trail.shift();
            }

            px+=velocityX;
            py+=velocityY;

            // Generates snake
            ctx.fillStyle="lime";
            for(var i=0;i<trail.length;i++) {
                ctx.fillRect(trail[i].x*gridSize,trail[i].y*gridSize,gridSize-2,gridSize-2);
                // Condition for snake head touching tail
                if(trail[i].x==px && trail[i].y==py) {
                    if(tail==canvasSize){
                        tail=(canvasSize+1); // Flags game complete
                    } else{
                        tail = 0; // Flags game over
                    }

                }
            }

            // Changes apple position when 'eaten'
            if(applePosX==px && applePosY==py) {
                tail++;
                if (tail<canvasSize){
                    applePosX=Math.floor(Math.random()*gridSize);
                    applePosY=Math.floor(Math.random()*gridSize);
                    let repeatFlag=true;
                    while(repeatFlag){
                        repeatFlag = false;
                        for(i=0; i <trail.length;i++){
                            if(trail[i].x==applePosX && trail[i].y==applePosY){
                                applePosX=Math.floor(Math.random()*gridSize);
                                applePosY=Math.floor(Math.random()*gridSize);
                                repeatFlag=true;
                            }  
                        }
                    }
                }
            }

            // Generates apple
            ctx.fillStyle="red";
            ctx.fillRect(applePosX*gridSize,applePosY*gridSize,gridSize-2,gridSize-2);    
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
        ctx.fillStyle="white"; 
        ctx.fillText("Select an algorithm",canv.width/2, canv.height/2);
    }
}

const wait = (ms) => {
    var d = new Date();
    var d2 = null;
    do { d2 = new Date();} 
    while(d2-d < ms);
}

const hamiltonianCycle = () => {
    if(px==9&&py==9){velocityX=1;velocityY=0;}
    if(px==gridSize-1&&py==9){velocityX=0;velocityY=-1;}
    if(px==gridSize-1&&py==8){velocityX=-1;velocityY=0;}
    if(px==1&&py==8){velocityX=0;velocityY=-1;}
    if(px==1&&py==7){velocityX=1;velocityY=0;}
    if(px==gridSize-1&&py==7){velocityX=0;velocityY=-1;}
    if(px==gridSize-1&&py==6){velocityX=-1;velocityY=0;}
    if(px==1&&py==6){velocityX=0;velocityY=-1;}
    if(px==1&&py==5){velocityX=1;velocityY=0;}
    if(px==gridSize-1&&py==5){velocityX=0;velocityY=-1;}
    if(px==gridSize-1&&py==4){velocityX=-1;velocityY=0;}
    if(px==1&&py==4){velocityX=0;velocityY=-1;}
    if(px==1&&py==3){velocityX=1;velocityY=0;}
    if(px==gridSize-1&&py==3){velocityX=0;velocityY=-1;}
    if(px==gridSize-1&&py==2){velocityX=-1;velocityY=0;}
    if(px==1&&py==2){velocityX=0;velocityY=-1;}
    if(px==1&&py==1){velocityX=1;velocityY=0;}
    if(px==gridSize-1&&py==1){velocityX=0;velocityY=-1;}
    if(px==gridSize-1&&py==0){velocityX=-1;velocityY=0;}
    if(px==0&&py==0){velocityX=0;velocityY=1;}
    if(px==0&&py==gridSize-1){velocityX=1;velocityY=0;}
    if(px==gridSize-1&&py==gridSize-1){velocityX=0;velocityY=-1;}
    if(px==gridSize-1&&py==20){velocityX=-1;velocityY=0;}
    if(px==1&&py==20){velocityX=0;velocityY=-1;}
    if(px==1&&py==19){velocityX=1;velocityY=0;}
    if(px==gridSize-1&&py==19){velocityX=0;velocityY=-1;}
    if(px==gridSize-1&&py==18){velocityX=-1;velocityY=0;}
    if(px==1&&py==18){velocityX=0;velocityY=-1;}
    if(px==1&&py==17){velocityX=1;velocityY=0;}
    if(px==gridSize-1&&py==17){velocityX=0;velocityY=-1;}
    if(px==gridSize-1&&py==16){velocityX=-1;velocityY=0;}
    if(px==1&&py==16){velocityX=0;velocityY=-1;}
    if(px==1&&py==15){velocityX=1;velocityY=0;}
    if(px==gridSize-1&&py==15){velocityX=0;velocityY=-1;}
    if(px==gridSize-1&&py==14){velocityX=-1;velocityY=0;}
    if(px==1&&py==14){velocityX=0;velocityY=-1;}
    if(px==1&&py==13){velocityX=1;velocityY=0;}
    if(px==gridSize-1&&py==13){velocityX=0;velocityY=-1;}
    if(px==gridSize-1&&py==12){velocityX=-1;velocityY=0;}
    if(px==1&&py==12){velocityX=0;velocityY=-1;}
    if(px==1&&py==11){velocityX=1;velocityY=0;}
    if(px==gridSize-1&&py==11){velocityX=0;velocityY=-1;}
    if(px==gridSize-1&&py==10){velocityX=-1;velocityY=0;}
    if(px==1&&py==10){velocityX=0;velocityY=-1;}
    if(px==1&&py==9){velocityX=1;velocityY=0;}
}

const bestFirstSearch = () => {
    
    // Set directional positions relative to snake head
    nx=sx=px;
    ey=wy=py;
    ny=py-1;
    sy=py+1;
    ex=px+1;
    wx=px-1;

    // Manhattan distances from directional positions to apple
    nd = Math.abs(applePosX-nx)+Math.abs(applePosY-ny);
    ed = Math.abs(applePosX-ex)+Math.abs(applePosY-ey);
    sd = Math.abs(applePosX-sx)+Math.abs(applePosY-sy);
    wd = Math.abs(applePosX-wx)+Math.abs(applePosY-wy);
    
    // Adds poor distance score (9999) to direction which collides with tail or wall
    for(var i=0; i <trail.length;i++){
        if (nx==trail[i].x && ny==trail[i].y || ny==-1 || ny==gridSize){
            nd=9999;
        }
        if (ex==trail[i].x && ey==trail[i].y || ex==-1 || ex==gridSize){
            ed=9999;
        }
        if (sx==trail[i].x && sy==trail[i].y || sy==-1 || sy==gridSize){
            sd=9999;
        }
        if (wx==trail[i].x && wy==trail[i].y || wx==-1 || wx==gridSize){
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

const expandNode = (x,y,cost,direction,tree) => {
    
    // Set directional positions relative to snake head
    nx=sx=x;
    ey=wy=y;
    ny=y-1;
    sy=y+1;
    ex=x+1;
    wx=x-1;
    
    // Manhattan distances from directional positions to apple
    nd = Math.abs(applePosX-nx)+Math.abs(applePosY-ny);
    ed = Math.abs(applePosX-ex)+Math.abs(applePosY-ey);
    sd = Math.abs(applePosX-sx)+Math.abs(applePosY-sy);
    wd = Math.abs(applePosX-wx)+Math.abs(applePosY-wy);
    
    // Poor distance score if wall or tail
    for(var i=0; i <trail.length;i++){
        if (nx==trail[i].x && ny==trail[i].y || ny==-1 || ny==gridSize){
            nd=9999;
        }
        if (ex==trail[i].x && ey==trail[i].y || ex==-1 || ex==gridSize){
            ed=9999;
        }
        if (sx==trail[i].x && sy==trail[i].y || sy==-1 || sy==gridSize){
            sd=9999;
        }
        if (wx==trail[i].x && wy==trail[i].y || wx==-1 || wx==gridSize){
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

const depthFirstSearch = () => {
    
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

const aStarSearch = () => {
    /* 
        Tree contains nested arrays each consisting of:
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

const willCollideWithTrail = (xOffset, yOffset) => {
    if(trail.find((t) => (t.x === px+xOffset && t.y === py+yOffset))) return true;
    return false;
}

// Controls for changing direction if playing/ testing
const keyPush = (evt) => {
	switch(evt.keyCode) {
		// Left arrow
        case 37:
            evt.preventDefault();
            if(!willCollideWithTrail(-1,0)){velocityX=-1;velocityY=0;}
			break;
        // Up arrow    
		case 38:
            evt.preventDefault();
			if(!willCollideWithTrail(0,-1)){velocityX=0;velocityY=-1};
			break;
        // Right arrow    
		case 39:
            evt.preventDefault();
			if(!willCollideWithTrail(1,0)){velocityX=1;velocityY=0};
			break;
        // Down arrow    
		case 40:
            evt.preventDefault();
			if(!willCollideWithTrail(0,1)){velocityX=0;velocityY=1};
			break;
	}
}