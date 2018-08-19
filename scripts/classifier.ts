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
let dataOutputs = []; // "relax", "sad", "happy"...
let normalizedData = [];

setup();

function setup(): void {

    loadJSON(dataset.default) // We have to use .default to load the url correctly with parcel
        .then((jsonDataset) => {
            data = JSON.parse(jsonDataset);
            // let test = isIterable(data);
            // console.log(test);
            let newData = ShapeData.makeDatasetForTensors(data);
            dataInputs = newData[0];
            dataOutputs = newData[1];
            // console.log(dataOutputs);
            normalizedData = ShapeData.normalizeData(data, dataInputs, "inputs");
            // makeInputs();
            return loadJSON(toClassify.default);
        })
        .then((jsonSongs) => {
            songsToClassify = JSON.parse(jsonSongs);
            // for (let i=0; i<featuresList.length; i++) {
            //     getMinMaxValues(featuresList[i]);
            // }
            // console.log(featuresMinMax);
        })
        .catch((err) => console.log(err));
    // songsToClassify = loadJSON(toClassify, () => {

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





