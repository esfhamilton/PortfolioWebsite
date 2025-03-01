import { isAvailableSpace } from "../utils.js";

export const bestFirstSearch = (headPosX, headPosY, applePosX, applePosY, trail) => {
    const positions = {
        N: { x: headPosX, y: headPosY - 1 },
        E: { x: headPosX + 1, y: headPosY },
        S: { x: headPosX, y: headPosY + 1 },
        W: { x: headPosX - 1, y: headPosY },
    };

    let bestDirection = "N";
    let minDistance = Infinity;

    for (const [dir, { x, y }] of Object.entries(positions)) {
        if (!isAvailableSpace(x, y, trail)) continue;
        let distance = Math.abs(applePosX - x) + Math.abs(applePosY - y);
        if (distance < minDistance) {
            minDistance = distance;
            bestDirection = dir;
        }
    }

    return bestDirection;
};