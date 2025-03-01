import { expandNode } from "../utils.js";

// f(x) = h(x) + g(x)
export const aStarSearch = (headPosX, headPosY, applePosX, applePosY, trail) => {
    let nodePos = {x: headPosX, y: headPosY};
    let applePos = {x: applePosX, y: applePosY};
    let tree = expandNode(nodePos,applePos,0,'None',[],trail);
    let goalReached = false;
    let expansions = 0;
    let direction, shortestDistance, currentCost;

    while(!goalReached && expansions<10000){
        expansions++;
        shortestDistance=9999;
        
        for(let i=0;i<tree.length;i++){
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
        
        for(let i=0;i<tree.length;i++){  
            if(tree[i][0]!=9999 && shortestDistance==(tree[i][0]+tree[i][3])){
                tree[i][0] = 9999; 
                nodePos = {x: tree[i][1], y: tree[i][2]};
                tree = expandNode(nodePos,applePos,tree[i][3],tree[i][4],tree,trail);
                break;
            }
        }
    }

    return(direction);
}