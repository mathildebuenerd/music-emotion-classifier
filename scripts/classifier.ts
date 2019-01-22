'use strict';

// -------- Options --------



// Import data
import * as dataset from "../data/Emotion_data.json";
import * as toClassify from "../toClassify/Emotion_features.json";

// Import functions to convert data
import * as SD from "./ShapeData";
const ShapeData = new SD.ShapeData;


let labelList = ["sad", "happy", "relax", "angry"];

document.querySelector(`#submit`).addEventListener('click', () => {
    // Get the values from HTML
    const epochs = parseInt((<HTMLInputElement>document.querySelector(`#epochs`)).value);
    const learningRate = parseFloat((<HTMLInputElement>document.querySelector(`#learningRate`)).value);
    const validationSplit = parseFloat((<HTMLInputElement>document.querySelector(`#validationSplit`)).value);
    const unitsHiddenLayer = parseInt((<HTMLInputElement>document.querySelector(`#epochs`)).value);
    const hiddenLayerActivation = String((<HTMLInputElement>document.querySelector(`#hiddenLayerActivation`)).value);
    const outputLayerActivation = String((<HTMLInputElement>document.querySelector(`#outputLayerActivation`)).value);

    classify({
        epochs: epochs,
        learningRate: learningRate,
        validationSplit: validationSplit,
        unitsHiddenLayer: unitsHiddenLayer,
        hiddenLayerActivation: hiddenLayerActivation,
        outputLayerActivation: outputLayerActivation
    });
});

classify();

function classify(options = {
    epochs: 30,
    learningRate: 0.3,
    validationSplit: 0.2,
    unitsHiddenLayer: 50,
    hiddenLayerActivation: "relu",
    outputLayerActivation: "softmax",
}): void {


    const epochs = options.epochs;
    const learningRate = options.learningRate;
    const validationSplit = options.validationSplit;
    const unitsHiddenLayer = options.unitsHiddenLayer;
    const hiddenLayerActivation = options.hiddenLayerActivation;
    const outputLayerActivation = options.outputLayerActivation;

    let data = {};
    let songsToClassify = {};
    let dataInputs = []; // The output of dataInputs[0] is dataOutputs[0]

    let labels = []; // hot encoded values 0, 1, 2 or 3
    let normalizedData = [];
    let model;

    // We have to use .default to load the url correctly with parcel
    loadJSON(dataset.default)
        .then((jsonDataset) => {
            data = JSON.parse(jsonDataset);
            return loadJSON(toClassify.default);
        })
        .then((jsonSongs) => {
            songsToClassify = JSON.parse(jsonSongs);
            let toClassify = ShapeData.makeUnclassifiedSongsForTensors(data, songsToClassify);
            let songNames = toClassify[0];
            let songFeatures = toClassify[1];
            // console.log(songFeatures[0]);

            // ---|-- Building the model ------|-----
            // ---v----------------------------v-----

            let newData = ShapeData.makeDatasetForTensors(data);
            dataInputs = newData[0];
            let dataOutputs = newData[1]; // the outputs are "relax", "calm"...

            for (let i=0; i<dataOutputs.length; i++) {
                // in the label list we put the hot encoded values like 0, 1, 2 or 3
                labels.push(labelList.indexOf(dataOutputs[i][0]));
            }

            // Transform the value of each feature into a 0 to 1 range
            normalizedData = ShapeData.normalizeData(data, dataInputs);
            // console.log(normalizedData);

            let xs = tf.tensor2d(normalizedData);
            let labelsTensor = tf.tensor1d(labels, "int32"); // makes a tensor with the labels
            let ys = tf.oneHot(labelsTensor, labelList.length); // defines the outputs
            labelsTensor.dispose(); // for memory management, as we don't need anymore, we use dispose()

            let inputDim = ShapeData.getInputDim();

            model = tf.sequential();
            let hiddenLayer = tf.layers.dense({
                units: unitsHiddenLayer,
                activation: hiddenLayerActivation,
                inputDim: inputDim
            });
            let outputLayer = tf.layers.dense({
                units: 4,
                activation: outputLayerActivation
            });
            model.add(hiddenLayer);
            model.add(outputLayer);

            // Create an optimizer
            const learningR = learningRate;
            const myOptimizer = tf.train.sgd(learningR);

            model.compile({
                optimizer: myOptimizer,
                loss: "categoricalCrossentropy",
                metrics: ["accuracy"]
            });

            train(xs, ys).then( (result) => {
                // console.log(result);
                tf.tidy( () => {

                    // Array to store the results
                    let classifiedSongs = [];

                    // Loop through all songs
                    for (const song in songFeatures) {
                        const toGuess = tf.tensor2d([songFeatures[song]]); // toGuess = input
                        let results = model.predict(toGuess);
                        let argMax = results.argMax(1);
                        let index = argMax.dataSync()[0];
                        let label = labelList[index];
                        model.getWeights();
                        classifiedSongs.push({
                            songName: songNames[song],
                            label: label,
                            labelIndex: index
                        });
                        console.log(`I think that ${songNames[song]} is a ${label} song`);
                    }

                //    shows the final results
                    console.log(`Classified songs:`, classifiedSongs);
                });

            });


        })
        .catch((err) => console.log(err));
    // songsToClassify = loadJSON(toClassify, () => {

    async function train(xs, ys) {

        const options = {
            epochs: epochs, // number of times it iterates over training data
            validationSplit: validationSplit,
            shuffle: true,
            callbacks: {
                onTrainBegin: () => console.log("training start"),
                onTrainEnd: () => console.log("training complete"),
                onEpochEnd: (num, logs) => {
                    console.log(`Epoch: ${num}`);
                    console.log(logs);
                }
            }
            // shuffle
        };

        return await model.fit(xs, ys, options);
    }

    function makeInputs(): void {
        let features = [];
        for (let singleSong of data) {
            for (let singleFeature of data[singleSong]) {
                console.log(data[singleSong][singleFeature]);
            }
        }
    }

    function loadJSON(url: string): Promise<any> {

        return new Promise((resolve, reject) => {
            let xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
            xobj.onreadystatechange = () => {
                if (xobj.readyState == 4 && xobj.status == 200) {
                    resolve(xobj.responseText);
                }
            };
            xobj.send(null);
            xobj.onerror = () => reject(xobj.statusText);
        });

    }


}






