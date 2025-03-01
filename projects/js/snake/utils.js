export const gridDimension = 22, canvasSize = gridDimension ** 2;

export const isEqual = (pos, pos2) => (pos.x === pos2.x && pos.y === pos2.y);

export const isAvailableSpace = (x,y,trail) => {
    return (!trail.find((trailPos) => isEqual(trailPos, {x,y})) 
            && x >= 0 
            && x < gridDimension
            && y >= 0 
            && y < gridDimension)
}

export const expandNode = (nodePos,applePos,cost,direction,tree,trail) => {
    let { x, y } = nodePos;
    let { x: applePosX, y: applePosY } = applePos;

    // Set directional positions relative to snake head
    let nx, sx, ex, wx, ny, sy, ey, wy;
    nx=sx=x;
    ey=wy=y;
    ny=y-1;
    sy=y+1;
    ex=x+1;
    wx=x-1;
    
    // Manhattan distances from directional positions to apple
    let nd = Math.abs(applePosX-nx)+Math.abs(applePosY-ny);
    let ed = Math.abs(applePosX-ex)+Math.abs(applePosY-ey);
    let sd = Math.abs(applePosX-sx)+Math.abs(applePosY-sy);
    let wd = Math.abs(applePosX-wx)+Math.abs(applePosY-wy);
    
    // Poor distance scores if position results in game over
    if(!isAvailableSpace(nx,ny,trail)) nd=9999;
    if(!isAvailableSpace(ex,ey,trail)) ed=9999;
    if(!isAvailableSpace(sx,sy,trail)) sd=9999;
    if(!isAvailableSpace(wx,wy,trail)) wd=9999;
    
    cost++;
    
    if(direction=="None"){
        return ([[nd,nx,ny,1,'N'],[ed,ex,ey,1,'E'],[sd,sx,sy,1,'S'],[wd,wx,wy,1,'W']]);    
    }
    let addNorth, addEast, addSouth, addWest;
    addNorth=addEast=addSouth=addWest=true;

    for(let i=0;i<tree.length;i++){
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