import { expandNode } from "../utils.js";

export const depthFirstSearch = (headPosX, headPosY, applePosX, applePosY, trail) => {
    
    let nodePos = {x: headPosX, y: headPosY};
    let applePos = {x: applePosX, y: applePosY};
    let tree = expandNode(nodePos,applePos,0,'None',[],trail);
    
    let goalReached = false;
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
        
        if(shortestDistance==0 || shortestDistance==9999){
            goalReached = true;
            break;
        }
        
        for(let i=0;i<tree.length;i++){  
            if(tree[i][0]!=9999 && shortestDistance==tree[i][0]){
                tree[i][0] = 9999;
                nodePos = {x: tree[i][1], y: tree[i][2]};
                tree = expandNode(nodePos,applePos,tree[i][3],tree[i][4],tree,trail);
                break;
            }
        }
    }

    return(direction);
}