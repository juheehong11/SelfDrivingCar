class NeuralNetwork {
    constructor(neuronCounts) {
        this.levels = [];
        for (let i=0; i<neuronCounts.length-1; i++) {
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i+1]));
        }
    }

    static feedForward(givenInputs, network) {
        let outputs = Level.feedForward(givenInputs, network.levels[0]);
        for (let i=1; i<network.levels.length; i++) {
            outputs = Level.feedForward(outputs, network.levels[i]);
        }
        return outputs;
    }

    static mutate(network, amount=1) { // "mutate" network
        network.levels.forEach(level => {
            for (let i=0; i<level.biases.length; i++) {
                level.biases[i] = lerp(level.biases[i], Math.random()*2-1, amount);
            }
            for (let i=0; i<level.weights.length; i++) {
                for (let j=0; j<level.weights[i].length; j++) {
                    level.weights[i][j] = lerp(level.weights[i][j], Math.random()*2-1, amount);
                }
            }
        });
    }
}



class Level {
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount); // values we get from car sensors
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights = [];
        for (let i=0; i<inputCount; i++) {
            this.weights[i] = new Array(outputCount); // each input node connected to all the output nodes 
        }

        Level.#randomise(this);
    }

    static #randomise(level) {
        for (let i=0; i<level.inputs.length; i++) { // for each input
            for (let j=0; j<level.outputs.length; j++) { // loop through every output.
                // for each input-output pair
                level.weights[i][j] = Math.random()*2-1; // range between -1 and 1
            }
        }

        for (let i=0; i<level.biases.length; i++) {
            level.biases[i] = Math.random()*2-1;
        }
    }

    static feedForward(givenInputs, level) {
        for (let i=0; i<level.inputs.length; i++) {
            level.inputs[i] = givenInputs[i];
        }

        for (let i=0; i<level.outputs.length; i++) {
            let sum = 0;
            for (let j=0; j<level.inputs.length; j++) {
                sum += level.inputs[j]*level.weights[j][i];
            }

            if (sum + level.biases[i] > 0) {
                level.outputs[i] = 1;
            } else {
                level.outputs[i] = 0;
            }
        }
        return level.outputs;
    }
}