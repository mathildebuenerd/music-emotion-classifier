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


    makeDatasetForTensors(data: object): Array<Array<any>> {
        let dataInputs = [];
        let dataOutputs = [];
        for (const singleSong in data) {
            let newArray = this.convertObjectToArray(data[singleSong]);
            dataInputs.push(newArray[0]);
            dataOutputs.push(newArray[1]);
        }
        return [
            dataInputs,
            dataOutputs
        ];
    };

    convertObjectToArray(data: object): Array<Array<any>> {
        // Converts the object to an iterable object
        let singleFeature = [];
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
            singleFeature.push(value); // add each feature to an array
            // console.log(key, value); // "first", "one"
        }
        // Returns an array with
        // [0] List of features
        // [1] Label ("relax", "calm"...)
        return [
            singleFeature.splice(4), // I splice the array because the first values are id, song_name, class and label
            singleFeature.splice(2, 1)
        ]
    };

    normalizeData(originalData: object, arrayLikeData: object, type: string): Array<Array<number>> {

        // console.log(originalData);

        let normalizedData = [];
        // Normalize data to a 0-1 range

        // We get the range for each feature
        // It returns an object like that:
        // 0: {
        //     feature: "tempo",
        //         min: 53.83300781,
        //         max: 198.7680288
        // }
        // ...
        let featuresRange = this.getMinMaxValues(originalData);
        // console.log(featuresRange);

        if (type === "inputs") {
            for (const song in arrayLikeData) {
                let singleNormalizedData = [];
                for (let i=0; i<arrayLikeData[song].length; i++) {
                    let norm = this.normalize(arrayLikeData[song][i], featuresRange[i].min, featuresRange[i].max);
                    singleNormalizedData.push(norm);
                }
                normalizedData.push(singleNormalizedData);
            }
            return normalizedData;
        }

    };

    normalize(value: number, minValue: number, maxValue: number): number {
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