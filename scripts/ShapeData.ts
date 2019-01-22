// Gathers all functions used to make the dataset ok for tensors

export class ShapeData {

    featuresList = [
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

    // I want to be able to ignore certain features, like total_beats, because it could be irrelevant
    // But for now it makes a mess with the arrays, so don't use it
    featuresToIgnore = [
        // "total_beats",
        // "chroma_stft_std"
    ];


    makeDatasetForTensors(data: object): Array<Array<any>> {
        let dataInputs = [];
        let dataOutputs = [];
        for (const singleSong in data) {
            let newArray = this.convertObjectToArray(data[singleSong]);
            const input = newArray.splice(4); // all the features
            const output = newArray.splice(2, 1); // the label like "relax" or "happy"
            dataInputs.push(input);
            dataOutputs.push(output);
        }

        dataInputs = this.removeFeatures(dataInputs);

        return [
            dataInputs,
            dataOutputs
        ];
    };

    makeUnclassifiedSongsForTensors(originalData, songsToClassify: object) {
        let enumFeatures = this.convertObjectToArray(songsToClassify);
        let numberOfSongs = Object.keys(enumFeatures[0]).length;
        let songNames = [];
        let allFeatures = [];

        for (let i=1; i<numberOfSongs+1; i++) {
            let songName = "";
            let singleSongFeatures = [];
            for (let j=0; j<enumFeatures.length; j++) {
                if (j === 0) {
                    songName = enumFeatures[j][i];
                } else {
                    singleSongFeatures.push(enumFeatures[j][i]);
                }
            }
            songNames.push(songName);
            allFeatures.push(singleSongFeatures);
        }

        // console.log("norm", this.normalizeData(originalData, allFeatures));

        allFeatures = this.removeFeatures(allFeatures);

        // We return the normalized features
        return [
            songNames,
            this.normalizeData(originalData, allFeatures)
        ];
    }

    getInputDim(): number {
        return this.featuresList.length - this.featuresToIgnore.length;
    }

    removeFeatures(features: Array<Array<number>>): Array<Array<number>> {

        for (const song in features) {
            // console.log(features[song]);
            for (let f=0; f<this.featuresToIgnore.length; f++) {
                let featureIndex = this.featuresList.indexOf(this.featuresToIgnore[f]);
                features[song].splice(featureIndex, 1);
            }
        }

        return features;
    }

    convertObjectToArray(data: object): Array<Array<any>> {
        // Converts the object to an iterable object
        let newArray = [];
        for(let [key, value] of Object.entries(data)) {
            if (!Object.entries)
                Object.entries = function( obj ){
                    var ownProps = Object.keys( obj ),
                        i = ownProps.length,
                        resArray = new Array(i); // preallocate the Array
                    while (i--)
                        resArray[i] = [ownProps[i], obj[ownProps[i]]];
                    if (i<ownProps.length-3) {
                        return resArray;
                    }
                };
            newArray.push(value); // add each feature to an array
            // console.log(key, value); // "first", "one"
        }
        // Returns an array with
        // [0] List of features
        // [1] Label ("relax", "calm"...)
        return newArray;
    };

    normalizeData(originalData: object, arrayLikeData: object): Array<Array<number>> {

        // console.log(`originaldata: `, originalData);
        // console.log(`arraylikedata: `, arrayLikeData);

        let normalizedData = [];


        let featuresRange = this.getMinMaxValues(originalData);
        // console.log(featuresRange);

        for (const song in arrayLikeData) {
            let singleNormalizedData = [];
            for (let i=0; i<arrayLikeData[song].length; i++) {
                // console.log(`featuresRange[i]`, featuresRange[i].feature);
                let norm = this.normalize(arrayLikeData[song][i], featuresRange[i].min, featuresRange[i].max);
                // console.log(norm);
                singleNormalizedData.push(norm);
            }
            normalizedData.push(singleNormalizedData);
        }

        // for (const song in arrayLikeData) {
        //     let singleNormalizedData = [];
        //     for (let i=0; i<arrayLikeData[song].length; i++) {
        //         let norm = this.normalize(arrayLikeData[song][i], featuresRange[i].min, featuresRange[i].max);
        //         console.log(norm);
        //         singleNormalizedData.push(norm);
        //     }
        //     normalizedData.push(singleNormalizedData);
        // }
        return normalizedData;


    };

    normalize(value: number, minValue: number, maxValue: number): number {
        // console.log(`value: ${value}`, `minValue: ${minValue}`, `maxValue: ${maxValue}`, `result: ${(value-minValue)/(maxValue-minValue)}`)
        return (value-minValue)/(maxValue-minValue);
    }

    getMinMaxValues(data: object): object {

        let featuresMinMax = []; // to store the min and max value used for normalizing the inputs

        for (let i=0; i<this.featuresList.length; i++) {
            let maxValue = 0;
            let minValue = 0;
            let counter = 0;

            for (const song in data) {
                let value = data[song][this.featuresList[i]];

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
                "feature": this.featuresList[i],
                "min": minValue,
                "max": maxValue
            });
        }

        // console.log(`featuresMinMax:`, featuresMinMax)
        return featuresMinMax;

    }


    isIterable(obj) {
        console.log(obj);
        // checks for null and undefined
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === 'function';
    }

}