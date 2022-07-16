class Visualiser {
    static drawNetwork(context, network) {
        const margin = 50;
        const left = margin;
        const top = margin;
        const width = context.canvas.width - margin*2;
        const height = context.canvas.height - margin*2;

        // Visualiser.drawLevel(context, network.levels[0], left, top, width, height);
        const levelHeight = height/network.levels.length;
        for (let i=network.levels.length-1; i>=0; i--) {
            const levelTop = top + lerp(height-levelHeight, 0, network.levels.length==1?0.5:i/(network.levels.length-1));
            context.setLineDash([7,3]);
            Visualiser.drawLevel(context, network.levels[i], left, levelTop, width, levelHeight, i==network.levels.length-1?['▲', '◄', '►', '▼']:[]);
        } 
    }

    static drawLevel(context, level, left, top, width, height, outputLabels) {
        const right = left+width;
        const bottom = top+height; // vertical axis grows downward

        const {inputs, outputs, weights, biases} = level;

        const nodeRadius = 18;

        // connections
        for (let i=0; i<inputs.length; i++) {
            for (let j=0; j<outputs.length; j++) {
                context.beginPath();
                context.moveTo(Visualiser.#getNodeX(inputs, i, left, right), bottom);
                context.lineTo(Visualiser.#getNodeX(outputs, j, left, right), top);
                context.lineWidth = 2;
                const value = weights[i][j];
                // const alpha = Math.abs(value);
                // const R = value<0 ? 0 : 255;
                // const G = R;
                // const B = value>0 ? 0 : 255;
                // context.strokeStyle = "rgba(" + R + ", " + G + ", " + B + ", " + alpha + ")";
                context.strokeStyle = getRGBA(value);
                context.stroke();
            }
        }

        // nodes 
        for (let i=0; i<inputs.length; i++) {
            const x = Visualiser.#getNodeX(inputs, i, left, right); //lerp(left, right, inputs.length==1?0.5:i/(inputs.length-1));
            context.beginPath();
            context.arc(x, bottom, nodeRadius, 0, Math.PI*2);
            context.fillStyle = "black";
            context.fill();

            context.beginPath();
            context.arc(x, bottom, nodeRadius*0.6, 0, Math.PI*2);
            context.fillStyle = getRGBA(inputs[i]);
            context.fill();
        }
        for (let i=0; i<outputs.length; i++) {
            const x = Visualiser.#getNodeX(outputs, i, left, right); //lerp(left, right, outputs.length==1?0.5:i/(outputs.length-1));
            context.beginPath();
            context.arc(x, top, nodeRadius, 0, Math.PI*2);
            context.fillStyle = "black";
            context.fill();

            context.beginPath();
            context.arc(x, top, nodeRadius*0.6, 0, Math.PI*2);
            context.fillStyle = getRGBA(outputs[i]);
            context.fill();

            context.beginPath();
            context.lineWidth = 2;
            context.arc(x, top, nodeRadius*0.8, 0, Math.PI*2);
            context.strokeStyle = getRGBA(biases[i]);
            context.setLineDash([3, 3]);
            context.stroke();
            context.setLineDash([]);

            if (outputLabels[i]) {
                context.beginPath();
                context.textAlign="center";
                context.textBaseline = "middle";
                context.fillStyle = "black";
                context.strokeStyle = "white";
                context.font=(nodeRadius*1.1)+"px Arial";
                context.fillText(outputLabels[i],x,top+nodeRadius*0.1);
                context.lineWidth=0.5;
                context.strokeText(outputLabels[i],x,top+nodeRadius*0.1);
            }
        }
    }

    static #getNodeX(nodes, idx, left_boundary, right_boundary) {
        return lerp(left_boundary, right_boundary, nodes.length==1?0.5:idx/(nodes.length-1));
    }
}