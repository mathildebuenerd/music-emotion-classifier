'use strict';

// Import data
import * as dataset from "../data/Emotion_data.json";
import * as toClassify from "../toClassify/Emotion_features.json";

// Import functions to convert data
import * as SD from "./ShapeData";
const ShapeData = new SD.ShapeData;


// const Classifier = (p) => {
let data = {};
let songsToClassify = {};
let dataInputs = []; // The output of dataInputs[0] is dataOutputs[0]
let labelList = ["sad", "happy", "relax", "angry"];
let labels = []; // hot encoded values 0, 1, 2 or 3
let normalizedData = [];

let model;

setup();

function setup(): void {

    loadJSON(dataset.default) // We have to use .default to load the url correctly with parcel
        .then((jsonDataset) => {
            data = JSON.parse(jsonDataset);
            // let test = isIterable(data);
            // console.log(test);


            // train(xs, ys).then( (result) => {
            //     console.log(result);
            // });

            // console.log(xs.shape);
            // console.log(xs);
            // console.log(labels)
            // makeInputs();
            return loadJSON(toClassify.default);
        })
        .then((jsonSongs) => {
            songsToClassify = JSON.parse(jsonSongs);
            let toClassify = ShapeData.makeUnclassifiedSongsForTensors(songsToClassify);
            let songNames = toClassify[0];
            let songFeatures = toClassify[1];
            console.log(songFeatures);

            // ---|-- Building the model ------|-----
            // ---v----------------------------v-----

            let newData = ShapeData.makeDatasetForTensors(data);
            dataInputs = newData[0];
            let dataOutputs = newData[1]; // the outputs are "relax", "calm"...

            for (let i=0; i<dataOutputs.length; i++) {
                labels.push(labelList.indexOf(dataOutputs[i][0])); // in the label list we put the hot encoded values like 0, 1, 2 or 3
            }

            normalizedData = ShapeData.normalizeData(data, dataInputs);


            let xs = tf.tensor2d(normalizedData);
            let labelsTensor = tf.tensor1d(labels, "int32"); // makes a tensor with the labels
            let ys = tf.oneHot(labelsTensor, labelList.length); // defines the outputs
            labelsTensor.dispose(); // for memory management, as we don't need anymore, we use dispose()
            // console.log(xs.shape);
            // console.log(ys.shape);
            // xs.print();
            // ys.print();

            model = tf.sequential();
            let hiddenLayer = tf.layers.dense({
                units: 16,
                activation: "sigmoid",
                inputDim: 54
            });
            let outputLayer = tf.layers.dense({
                units: 4,
                activation: "softmax"
            });
            model.add(hiddenLayer);
            model.add(outputLayer);

            // Create an optimizer
            const learningRate = 0.2;
            const myOptimizer = tf.train.sgd(learningRate);

            model.compile({
                optimizer: myOptimizer,
                loss: "categoricalCrossentropy"
            });

        })
        .catch((err) => console.log(err));
    // songsToClassify = loadJSON(toClassify, () => {

}

async function train(xs, ys) {

    const options = {
        epochs: 50, // number of times it iterates over training data
        validationSplit: 0.1,
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





