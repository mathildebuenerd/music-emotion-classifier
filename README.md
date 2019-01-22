# Music Emotion Classifier

## Description 
Classifies musics and sounds into 4 emotions: happy, calm, angry or sad, depending on the music features. With Tensorflow.js.

The classification is based on [a dataset of already classified sounds](https://github.com/danz1ka19/Music-Emotion-Recognition/blob/master/Emotion_features.csv) by danz1ka19.

## Usage

### 1. Extract the features of your sound files
- Download the [Music-Emotion-Recognition](https://github.com/danz1ka19/Music-Emotion-Recognition) repo.
- Create a "Dataset" folder at the root of the folder, and put the mp3 files you want to classify in it.
- Launch the `Feature-Extraction.py` script with the command line (might take few minutes if you have a lot of files).

```python
py Feature-Extraction.py
```

- It generates an `Emotion_features.json` file at the root of the folder.

### 2. Classify the sounds
- Download this repo.
- Place the generated `Emotion_features.json` file in the `toClassify` folder.



## Sources
Based on [this dataset and feature extractor](https://github.com/danz1ka19/Music-Emotion-Recognition) by danz1ka19.