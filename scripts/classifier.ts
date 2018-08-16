'use strict';

import * as dataset from "../data/Emotion_data.json";
import * as toClassify from "../toClassify/Emotion_features.json";

// const Classifier = (p) => {
let data;
let songsToClassify;
const featuresList = [
    "tempo",
    "total_beats",
    "average_beats",
    "chroma_stft_mean",
    "chroma_stft_std",
    "chroma_stft_var",
    "chroma_cq_mean",
    "chroma_cq_std",
    "chroma_cq_var",
    "chroma_cens_mean",
    "chroma_cens_std",
    "chroma_cens_var",
    "melspectrogram_mean",
    "melspectrogram_std",
    "melspectrogram_var",
    "mfcc_mean",
    "mfcc_std",
    "mfcc_var",
    "mfcc_delta_mean",
    "mfcc_delta_std",
    "mfcc_delta_var",
    "rmse_mean",
    "rmse_std",
    "rmse_var",
    "cent_mean",
    "cent_std",
    "cent_var",
    "spec_bw_mean",
    "spec_bw_std",
    "spec_bw_var",
    "contrast_mean",
    "contrast_std",
    "contrast_var",
    "rolloff_mean",
    "rolloff_std",
    "rolloff_var",
    "poly_mean",
    "poly_std",
    "poly_var",
    "tonnetz_mean",
    "tonnetz_std",
    "tonnetz_var",
    "zcr_mean",
    "zcr_std",
    "zcr_var",
    "harm_mean",
    "harm_std",
    "harm_var",
    "perc_mean",
    "perc_std",
    "perc_var",
    "frame_mean",
    "frame_std",
    "frame_var"
]; // all sound features, inputs
let featuresMinMax = [];


setup();

function setup() {
    console.log("hello");

    data = loadJSON(dataset, () => {
        songsToClassify = loadJSON(toClassify, () => {
            let songs = [];
            for (let i=0; i<featuresList.length; i++) {
                getMinMaxValues(featuresList[i]);
            }
            console.log(featuresMinMax);
        });
    });



}

function loadJSON(url, callback) {

    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', url, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = () => {
        if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
        }
    };
    xobj.send(null);
}


function getMinMaxValues(feature) {
    let maxValue = 0;
    let minValue = 0;
    let counter = 0;

    for (const song in data) {
        let value = data[song][feature];
        if (counter === 0) {
            maxValue = value;
            minValue = value;
        }
        if (value > maxValue) {
            maxValue = value;
        }
        if (value < minValue) {
            minValue = value;
        }
        counter++;
    }

    featuresMinMax.push({
        "feature": feature,
        "min": minValue,
        "max": maxValue
    });
}



