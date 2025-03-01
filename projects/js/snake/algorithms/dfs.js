import { expandNode } from "../utils.js";

export const depthFirstSearch = (headPosX, headPosY, applePosX, applePosY, trail) => {
    
    let nodePos = {x: headPosX, y: headPosY};
    let applePos = {x: applePosX, y: applePosY};
    let tree = expandNode(nodePos,applePos,0,'None',[],trail);
    
    // Exit condition - When path to apple has been found or no paths exist
    let goalReached = false;
    // Exit condition - Monitors no. of iterations, exits loop if too high to avoid crash
    let expansions = 0;
    let direction, shortestDistance;
    while(!goalReached && expansions<7000){
        expansions++;
        shortestDistance=9999;
        
        for(let i=0;i<tree.length;i++){
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
        
        for(let i=0;i<tree.length;i++){  
            // If node is not a wall/ tail/ expanded, shortestDistance = f(x)
            if(tree[i][0]!=9999 && shortestDistance==tree[i][0]){
                tree[i][0] = 9999; // 9999 also shows node has been expanded
                nodePos = {x: tree[i][1], y: tree[i][2]};
                tree = expandNode(nodePos,applePos,tree[i][3],tree[i][4],tree,trail);
                break;
            }
        }
    }

    return(direction);
}