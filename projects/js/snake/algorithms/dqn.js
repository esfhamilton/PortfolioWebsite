import { isAvailableSpace } from "../utils.js";

const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [15], units: 24, activation: 'relu' }));
model.add(tf.layers.dense({ units: 24, activation: 'relu' }));
model.add(tf.layers.dense({ units: 4, activation: 'linear' }));
model.compile({ optimizer: tf.train.adam(), loss: 'meanSquaredError' });

export const chooseAction = (state, headPosX, headPosY, trail, epsilon) => {
    const possibleMoves = [
        { dir: 'N', dx: 0, dy: -1 },
        { dir: 'E', dx: 1, dy: 0 },
        { dir: 'S', dx: 0, dy: 1 },
        { dir: 'W', dx: -1, dy: 0 }
    ];
    
    const safeMoves = possibleMoves.filter(({ dx, dy }) =>
        isAvailableSpace(headPosX + dx, headPosY + dy, trail)
    );

    if (Math.random() < epsilon) {
        return safeMoves.length > 0 
            ? safeMoves[Math.floor(Math.random() * safeMoves.length)].dir 
            : 'N';
    }

    return tf.tidy(() => {
        const stateTensor = tf.tensor2d([state]);
        const qValues = model.predict(stateTensor);
        const qArray = qValues.dataSync();

        let bestMove = 'N', bestValue = -Infinity;
        safeMoves.forEach(({ dir }) => {
            const actionIdx = ['N', 'E', 'S', 'W'].indexOf(dir);
            if (qArray[actionIdx] > bestValue) {
                bestValue = qArray[actionIdx];
                bestMove = dir;
            }
        });

        return bestMove;
    });
};

export const trainModel = async (batch) => {
    if (batch.length === 0) return;

    let states, nextStates, targetsTensor;

    await tf.tidy(() => {
        states = tf.keep(tf.tensor2d(batch.map(e => e.prevState)));
        nextStates = tf.tensor2d(batch.map(e => e.newState));

        const qValues = model.predict(states);
        const nextQValues = model.predict(nextStates);
        const targets = qValues.arraySync();
        batch.forEach((e, idx) => {
            const actionIdx = ['N', 'E', 'S', 'W'].indexOf(e.action);
            targets[idx][actionIdx] = e.reward + 0.9 * Math.max(...nextQValues.arraySync()[idx]);
        });
        targetsTensor = tf.keep(tf.tensor2d(targets));

        qValues.dispose();
        nextQValues.dispose();
    });

    await model.fit(states, targetsTensor, { epochs: 3 });

    states.dispose();
    targetsTensor.dispose();
};