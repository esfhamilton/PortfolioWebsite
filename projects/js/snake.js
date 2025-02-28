window.onload=function() {
    setupCanvas();
    setupControls();
    setupSpeedSlider();
    setupButtons();
    setupAlgorithm("None");
}

let canv, ctx, speedValue = 10, mainCall;
const gridDimension = 22, canvasSize = gridDimension ** 2;
let algorithm = "None", time = 0, headPosX = 9, headPosY = 9, applePosX = 15, applePosY = 15;
let velocityX = 0, velocityY = 0, trail = [], tailSize = 4;

const setupCanvas = () => {
    canv = document.getElementById("gc");
    ctx = canv.getContext("2d");
};

const setupControls = () => {
    document.addEventListener("keydown", keyPush);
};

const setupSpeedSlider = () => {
    const slider = document.getElementById("speedSlider");
    const output = document.getElementById("speedVal");
    output.innerHTML = slider.value;

    slider.oninput = function () {
        speedValue = this.value;
        output.innerHTML = speedValue === "100" ? "MAX" : speedValue;
        restartGame();
    };
};

const setupButtons = () => {
    const algorithms = ["Manual", "BFS", "DFS", "Hamiltonian", "Hamiltonian2", "aStar"];
    algorithms.forEach(algo => {
        const btn = document.getElementById(`btn-${algo.toLowerCase()}`);
        btn.onclick = () => startAlgorithm(algo);
        btn.onmouseover = () => showDescription(algo);
        btn.onmouseout = () => restartGame();
    });
};

const startAlgorithm = (selectedAlgorithm) => {
    setupAlgorithm(selectedAlgorithm);
    restartGame();
};

const showDescription = (algo) => {
    mouseOverState();
    const descriptions = {
        "Manual": "This algorithm is only as good as the player.",
        "BFS": "Best-first search takes a greedy approach only exploring adjacent nodes.",
        "DFS": "Depth-first search explores complete paths but can trap itself in loops.",
        "Hamiltonian": "A cycle that traverses every grid node, ensuring eventual completion.",
        "Hamiltonian2": "A faster Hamiltonian variant introducing shortcuts.",
        "aStar": "A* search considers both heuristic and true cost for better pathfinding but can still trap itself."
    };
    drawMultilineText(descriptions[algo], canv.width / 2, canv.height / 2, 25);
};

const drawMultilineText = (text, x, y, lineHeight) => {
    const lines = text.split(" ");
    let line = "";
    let yOffset = 0;

    lines.forEach(word => {
        let testLine = line + word + " ";
        let measure = ctx.measureText(testLine);
        if (measure.width > canv.width - 20) {
            ctx.fillText(line, x, y + yOffset);
            line = word + " ";
            yOffset += lineHeight;
        } else {
            line = testLine;
        }
    });
    ctx.fillText(line, x, y + yOffset);
};

const restartGame = () => {
    clearCanvas();
    clearInterval(mainCall);
    if (speedValue > 0) mainCall = setInterval(game, 1000 / speedValue);
};

const mouseOverState = () => {
    clearCanvas();
    clearInterval(mainCall);
    ctx.fillStyle = "#4cd6ff";
    ctx.font = "25px Determination Mono";
    ctx.textAlign = "center";
};

const clearCanvas = () => {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canv.width, canv.height);
};    

const setupAlgorithm = (newAlgorithm) => {
    algorithm = newAlgorithm;
    time = 0;
    headPosX = headPosY = 9;
    applePosX = applePosY = 15;
    velocityX = velocityY = 0;
    trail = [];
    tailSize = 4;
    clearCanvas();
    ctx.fillStyle = "white";
    ctx.font = "35px Determination Mono";
    ctx.textAlign = "center";
    ctx.fillText("Select an algorithm", canv.width / 2, canv.height / 2);
};

const game = () => {
    if (algorithm === "None") return;
    if (tailSize <= 0) return gameOver();
    if (tailSize == canvasSize) return gameComplete();
    clearCanvas();
    time++;
    document.getElementById("timeVal").innerHTML = time;
    document.getElementById("sizeVal").innerHTML = tailSize + 1;
    updateDirection();
    moveSnake();
    drawSnake();
    drawApple();
};

const gameOver = () => {
    clearCanvas();
    ctx.fillStyle = "red";
    ctx.fillText("Game Over", canv.width / 2, canv.height / 2);
};

const gameComplete = () => {
    clearCanvas();
    ctx.fillStyle="lime"; 
    ctx.fillText("Game Complete", canv.width/2, canv.height/2);
}

const updateDirection = () => {
    const directionFunctions = {
        "Hamiltonian": hamiltonianCycle,
        "Hamiltonian2": hamiltonianCycle2,
        "BFS": bestFirstSearch,
        "DFS": depthFirstSearch,
        "aStar": aStarSearch
    };
    if (algorithm in directionFunctions) updateVelocity(directionFunctions[algorithm]());
    else if (algorithm === "Manual" && velocityX === velocityY) velocityX = 1;
};

const moveSnake = () => {
    headPosX += velocityX;
    headPosY += velocityY;
    if (headPosX < 0 || headPosX >= gridDimension || headPosY < 0 || headPosY >= gridDimension) tailSize = 0;
    trail.push({ x: headPosX, y: headPosY });
    while (trail.length > tailSize) trail.shift();
    if (applePosX === headPosX && applePosY === headPosY) eatApple();
};

const drawSnake = () => {
    ctx.fillStyle = "lime";
    trail.forEach(pos => ctx.fillRect(pos.x * gridDimension, pos.y * gridDimension, gridDimension - 2, gridDimension - 2));
};

const drawApple = () => {
    ctx.fillStyle = "red";
    ctx.fillRect(applePosX * gridDimension, applePosY * gridDimension, gridDimension - 2, gridDimension - 2);
};

const eatApple = () => {
    tailSize++;
    if (tailSize < canvasSize) {
        let availableSpaces = getAvailableSpaces();
        let newApplePosition = availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
        applePosX = newApplePosition.x;
        applePosY = newApplePosition.y;
    }
};

const updateVelocity = (direction) => {
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
}

const isEqual = (pos, pos2) => (pos.x === pos2.x && pos.y === pos2.y);

const isAvailableSpace = (x,y) => {
    return (!trail.find((trailPos) => isEqual(trailPos, {x,y})) 
            && !(headPosX === x && headPosY ===y)
            && x >= 0 
            && x < gridDimension
            && y >= 0 
            && y < gridDimension)
}

const getAvailableSpaces = () => {
    let availableSpaces = [];
    for(x=0; x<gridDimension; x++){
        for(y=0; y<gridDimension; y++){
            if(isAvailableSpace(x,y)) availableSpaces.push({x: x, y: y})
        }
    }
    return availableSpaces;
}

const wait = (ms) => {
    var d = new Date();
    var d2 = null;
    do { d2 = new Date();} 
    while(d2-d < ms);
}

let cyclicalPositionMap = [{x:0,y:0}];
for(let y=0; y<gridDimension; y++){
    if(y % 2 === 0){
        for(let x=1; x<gridDimension; x++){
            cyclicalPositionMap.push({x,y});
        }   
    }
    else {
        for(let x=gridDimension-1; x>0; x--){
            cyclicalPositionMap.push({x,y});
        }
    }    
}
for (let y = gridDimension - 1; y > 0; y--) {
    cyclicalPositionMap.push({ x: 0, y });
}

const getPositionIndex = (posToFind) => cyclicalPositionMap.findIndex((pos) => isEqual(pos, posToFind));

const hamiltonianCycle = () => {
    let headPosition = {x:headPosX, y:headPosY};
    let headPosIndex = getPositionIndex(headPosition);
    let nextPosition = headPosIndex === cyclicalPositionMap.length-1 ? cyclicalPositionMap[0] : cyclicalPositionMap[headPosIndex+1];

    if(headPosition.x === nextPosition.x){
        if(headPosition.y-1 === nextPosition.y) return 'N';
        return 'S';
    }
    if(headPosition.x-1 === nextPosition.x) return 'W';
    return 'E';
}

const hamiltonianCycle2 = () => {
    let headPosition = { x: headPosX, y: headPosY };
    let headPosIndex = getPositionIndex(headPosition);
    let applePosIndex = getPositionIndex({ x: applePosX, y: applePosY });
    let tailPosIndex = trail.length > 0 ? getPositionIndex(trail[0]) : -1;

    let nextPosition = cyclicalPositionMap[(headPosIndex + 1) % cyclicalPositionMap.length];

    // Shortcuts are only optimise early/mid game
    if(tailSize < canvasSize*0.7){
        let skippedPosition = { x: headPosX, y: headPosY + 1 };    
        let skippedPosIndex = getPositionIndex(skippedPosition);

        if (skippedPosIndex !== -1 && isAvailableSpace(skippedPosition.x, skippedPosition.y)) {
            if (skippedPosIndex < tailPosIndex && (skippedPosIndex < applePosIndex || headPosIndex > applePosIndex)) {
                nextPosition = skippedPosition;
            }
        }
    }

    const directions = {
        "0,-1": "N",
        "1,0": "E",
        "0,1": "S",
        "-1,0": "W" 
    };
    
    let moveKey = `${nextPosition.x - headPosition.x},${nextPosition.y - headPosition.y}`;
    return directions[moveKey];
};

const bestFirstSearch = () => {
    // Set directional positions relative to snake head
    nx=sx=headPosX;
    ey=wy=headPosY;
    ny=headPosY-1;
    sy=headPosY+1;
    ex=headPosX+1;
    wx=headPosX-1;

    // Manhattan distances from directional positions to apple
    nd = Math.abs(applePosX-nx)+Math.abs(applePosY-ny);
    ed = Math.abs(applePosX-ex)+Math.abs(applePosY-ey);
    sd = Math.abs(applePosX-sx)+Math.abs(applePosY-sy);
    wd = Math.abs(applePosX-wx)+Math.abs(applePosY-wy);
    
    // Poor distance scores if position results in game over
    if(!isAvailableSpace(nx,ny)) nd=9999;
    if(!isAvailableSpace(ex,ey)) ed=9999;
    if(!isAvailableSpace(sx,sy)) sd=9999;
    if(!isAvailableSpace(wx,wy)) wd=9999;
    
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

    const directionMap = {
        0: "N",
        1: "E",
        2: "S",
        3: "W"
    }
    
    return(directionMap[direction]);
}

/* 
    Returns nested arrays, each consisting of:
    [0] : Heuristic for distance to apple (h(x))
    [1] : x-position of node
    [2] : y-position of node
    [3] : Number of expansions from root node - The actual cost of the path (g(x))
    [4] : Root direction expanded from
*/
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
    
    // Poor distance scores if position results in game over
    if(!isAvailableSpace(nx,ny)) nd=9999;
    if(!isAvailableSpace(ex,ey)) ed=9999;
    if(!isAvailableSpace(sx,sy)) sd=9999;
    if(!isAvailableSpace(wx,wy)) wd=9999;
    
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
    
    let tree = expandNode(headPosX,headPosY,0,'None',[]);
    
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

    return(direction);
}

const aStarSearch = () => {
    let tree = expandNode(headPosX,headPosY,0,'None',[]);
    let goalReached = false;
    let expansions = 0;
    
    // The main loop for the A* algorithm f(x) = h(x) + g(x)
    while(!goalReached && expansions<10000){
        expansions++;
        shortestDistance=9999;
        
        for(i=0;i<tree.length;i++){
            // Checks shortestDistance is greater than f(x)
            if(shortestDistance>(tree[i][0]+tree[i][3])){
                shortestDistance = tree[i][0]+tree[i][3];
                direction = tree[i][4];
                currentCost = tree[i][3];
            }
        }
        
        // Exit if path found or cannot be found
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

    return(direction);
}

const willCollideWithTrail = (xOffset, yOffset) => {
    if(trail.find((pos) => isEqual(pos, {x: headPosX+xOffset, y: headPosY+yOffset}))) return true;
    return false;
}

const keyPush = (evt) => {
    const keyMap = { 37: [-1, 0], 38: [0, -1], 39: [1, 0], 40: [0, 1] };
    if (evt.keyCode in keyMap) {
        evt.preventDefault();
        if (!willCollideWithTrail(...keyMap[evt.keyCode])) {
            [velocityX, velocityY] = keyMap[evt.keyCode];
        }
    }
};