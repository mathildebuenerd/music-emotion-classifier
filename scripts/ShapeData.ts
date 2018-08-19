// Gathers all functions used to make the dataset ok for tensors

export class ShapeData {
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


    isIterable(obj) {
        console.log(obj);
        // checks for null and undefined
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === 'function';
    }

}