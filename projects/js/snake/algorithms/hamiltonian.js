import { gridDimension, canvasSize, isEqual, isAvailableSpace } from "../utils.js";

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

const directions = {
    "0,-1": "N", "1,0": "E",
    "0,1": "S", "-1,0": "W" 
};

export const hamiltonianCycle = (headPosX, headPosY) => {
    let headPosition = {x:headPosX, y:headPosY};
    let headPosIndex = getPositionIndex(headPosition);
    let nextPosition = headPosIndex === cyclicalPositionMap.length-1 ? cyclicalPositionMap[0] : cyclicalPositionMap[headPosIndex+1];
    let moveKey = `${nextPosition.x - headPosition.x},${nextPosition.y - headPosition.y}`;
    return directions[moveKey];
}

export const hamiltonianCycle2 = (headPosX, headPosY, applePosX, applePosY, trail) => {
    let headPosition = { x: headPosX, y: headPosY };
    let headPosIndex = getPositionIndex(headPosition);
    let applePosIndex = getPositionIndex({ x: applePosX, y: applePosY });
    let tailPosIndex = trail.length > 0 ? getPositionIndex(trail[0]) : -1;

    let nextPosition = cyclicalPositionMap[(headPosIndex + 1) % cyclicalPositionMap.length];

    // Shortcuts only optimise early & mid game
    if(trail.length < canvasSize*0.7){
        let skippedPosition = { x: headPosX, y: headPosY + 1 };    
        let skippedPosIndex = getPositionIndex(skippedPosition);
        if (skippedPosIndex !== -1 && isAvailableSpace(skippedPosition.x, skippedPosition.y, trail)) {
            if (skippedPosIndex < tailPosIndex && (skippedPosIndex < applePosIndex || headPosIndex > applePosIndex)) {
                nextPosition = skippedPosition;
            }
        }
    }
    let moveKey = `${nextPosition.x - headPosition.x},${nextPosition.y - headPosition.y}`;
    return directions[moveKey];
};

const getPositionIndex = (posToFind) => cyclicalPositionMap.findIndex((pos) => isEqual(pos, posToFind));