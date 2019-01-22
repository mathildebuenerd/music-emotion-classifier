// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"data\\Emotion_data.json":[function(require,module,exports) {
module.exports="/Emotion_data.e4259c96.json";
},{}],"toClassify\\Emotion_features.json":[function(require,module,exports) {
module.exports="/Emotion_features.09a2a8d7.json";
},{}],"scripts\\ShapeData.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ShapeData = function () {
    function ShapeData() {
        this.featuresList = ["tempo", "total_beats", "average_beats", "chroma_stft_mean", "chroma_stft_std", "chroma_stft_var", "chroma_cq_mean", "chroma_cq_std", "chroma_cq_var", "chroma_cens_mean", "chroma_cens_std", "chroma_cens_var", "melspectrogram_mean", "melspectrogram_std", "melspectrogram_var", "mfcc_mean", "mfcc_std", "mfcc_var", "mfcc_delta_mean", "mfcc_delta_std", "mfcc_delta_var", "rmse_mean", "rmse_std", "rmse_var", "cent_mean", "cent_std", "cent_var", "spec_bw_mean", "spec_bw_std", "spec_bw_var", "contrast_mean", "contrast_std", "contrast_var", "rolloff_mean", "rolloff_std", "rolloff_var", "poly_mean", "poly_std", "poly_var", "tonnetz_mean", "tonnetz_std", "tonnetz_var", "zcr_mean", "zcr_std", "zcr_var", "harm_mean", "harm_std", "harm_var", "perc_mean", "perc_std", "perc_var", "frame_mean", "frame_std", "frame_var"];
        this.featuresToIgnore = [];
    }
    ShapeData.prototype.makeDatasetForTensors = function (data) {
        var dataInputs = [];
        var dataOutputs = [];
        for (var singleSong in data) {
            var newArray = this.convertObjectToArray(data[singleSong]);
            var input = newArray.splice(4);
            var output = newArray.splice(2, 1);
            dataInputs.push(input);
            dataOutputs.push(output);
        }
        dataInputs = this.removeFeatures(dataInputs);
        return [dataInputs, dataOutputs];
    };
    ;
    ShapeData.prototype.makeUnclassifiedSongsForTensors = function (originalData, songsToClassify) {
        var enumFeatures = this.convertObjectToArray(songsToClassify);
        var numberOfSongs = Object.keys(enumFeatures[0]).length;
        var songNames = [];
        var allFeatures = [];
        for (var i = 1; i < numberOfSongs + 1; i++) {
            var songName = "";
            var singleSongFeatures = [];
            for (var j = 0; j < enumFeatures.length; j++) {
                if (j === 0) {
                    songName = enumFeatures[j][i];
                } else {
                    singleSongFeatures.push(enumFeatures[j][i]);
                }
            }
            songNames.push(songName);
            allFeatures.push(singleSongFeatures);
        }
        allFeatures = this.removeFeatures(allFeatures);
        return [songNames, this.normalizeData(originalData, allFeatures)];
    };
    ShapeData.prototype.getInputDim = function () {
        return this.featuresList.length - this.featuresToIgnore.length;
    };
    ShapeData.prototype.removeFeatures = function (features) {
        for (var song in features) {
            for (var f = 0; f < this.featuresToIgnore.length; f++) {
                var featureIndex = this.featuresList.indexOf(this.featuresToIgnore[f]);
                features[song].splice(featureIndex, 1);
            }
        }
        return features;
    };
    ShapeData.prototype.convertObjectToArray = function (data) {
        var newArray = [];
        for (var _i = 0, _a = Object.entries(data); _i < _a.length; _i++) {
            var _b = _a[_i],
                key = _b[0],
                value = _b[1];
            if (!Object.entries) Object.entries = function (obj) {
                var ownProps = Object.keys(obj),
                    i = ownProps.length,
                    resArray = new Array(i);
                while (i--) {
                    resArray[i] = [ownProps[i], obj[ownProps[i]]];
                }if (i < ownProps.length - 3) {
                    return resArray;
                }
            };
            newArray.push(value);
        }
        return newArray;
    };
    ;
    ShapeData.prototype.normalizeData = function (originalData, arrayLikeData) {
        var normalizedData = [];
        var featuresRange = this.getMinMaxValues(originalData);
        for (var song in arrayLikeData) {
            var singleNormalizedData = [];
            for (var i = 0; i < arrayLikeData[song].length; i++) {
                var norm = this.normalize(arrayLikeData[song][i], featuresRange[i].min, featuresRange[i].max);
                singleNormalizedData.push(norm);
            }
            normalizedData.push(singleNormalizedData);
        }
        return normalizedData;
    };
    ;
    ShapeData.prototype.normalize = function (value, minValue, maxValue) {
        return (value - minValue) / (maxValue - minValue);
    };
    ShapeData.prototype.getMinMaxValues = function (data) {
        var featuresMinMax = [];
        for (var i = 0; i < this.featuresList.length; i++) {
            var maxValue = 0;
            var minValue = 0;
            var counter = 0;
            for (var song in data) {
                var value = data[song][this.featuresList[i]];
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
    };
    ShapeData.prototype.isIterable = function (obj) {
        console.log(obj);
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === 'function';
    };
    return ShapeData;
}();
exports.ShapeData = ShapeData;
},{}],"scripts\\classifier.ts":[function(require,module,exports) {
'use strict';

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = this && this.__generator || function (thisArg, body) {
    var _ = { label: 0, sent: function sent() {
            if (t[0] & 1) throw t[1];return t[1];
        }, trys: [], ops: [] },
        f,
        y,
        t,
        g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
    }), g;
    function verb(n) {
        return function (v) {
            return step([n, v]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) {
            try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0:case 1:
                        t = op;break;
                    case 4:
                        _.label++;return { value: op[1], done: false };
                    case 5:
                        _.label++;y = op[1];op = [0];continue;
                    case 7:
                        op = _.ops.pop();_.trys.pop();continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                            _ = 0;continue;
                        }
                        if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                            _.label = op[1];break;
                        }
                        if (op[0] === 6 && _.label < t[1]) {
                            _.label = t[1];t = op;break;
                        }
                        if (t && _.label < t[2]) {
                            _.label = t[2];_.ops.push(op);break;
                        }
                        if (t[2]) _.ops.pop();
                        _.trys.pop();continue;
                }
                op = body.call(thisArg, _);
            } catch (e) {
                op = [6, e];y = 0;
            } finally {
                f = t = 0;
            }
        }if (op[0] & 5) throw op[1];return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = this && this.__importStar || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) {
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    }result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dataset = __importStar(require("../data/Emotion_data.json"));
var toClassify = __importStar(require("../toClassify/Emotion_features.json"));
var SD = __importStar(require("./ShapeData"));
var ShapeData = new SD.ShapeData();
var labelList = ["sad", "happy", "relax", "angry"];
document.querySelector("#submit").addEventListener('click', function () {
    var epochs = parseInt(document.querySelector("#epochs").value);
    var learningRate = parseFloat(document.querySelector("#learningRate").value);
    var validationSplit = parseFloat(document.querySelector("#validationSplit").value);
    var unitsHiddenLayer = parseInt(document.querySelector("#epochs").value);
    var hiddenLayerActivation = String(document.querySelector("#hiddenLayerActivation").value);
    var outputLayerActivation = String(document.querySelector("#outputLayerActivation").value);
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
function classify(options) {
    if (options === void 0) {
        options = {
            epochs: 30,
            learningRate: 0.3,
            validationSplit: 0.2,
            unitsHiddenLayer: 50,
            hiddenLayerActivation: "relu",
            outputLayerActivation: "softmax"
        };
    }
    var epochs = options.epochs;
    var learningRate = options.learningRate;
    var validationSplit = options.validationSplit;
    var unitsHiddenLayer = options.unitsHiddenLayer;
    var hiddenLayerActivation = options.hiddenLayerActivation;
    var outputLayerActivation = options.outputLayerActivation;
    var data = {};
    var songsToClassify = {};
    var dataInputs = [];
    var labels = [];
    var normalizedData = [];
    var model;
    loadJSON(dataset.default).then(function (jsonDataset) {
        data = JSON.parse(jsonDataset);
        return loadJSON(toClassify.default);
    }).then(function (jsonSongs) {
        songsToClassify = JSON.parse(jsonSongs);
        var toClassify = ShapeData.makeUnclassifiedSongsForTensors(data, songsToClassify);
        var songNames = toClassify[0];
        var songFeatures = toClassify[1];
        var newData = ShapeData.makeDatasetForTensors(data);
        dataInputs = newData[0];
        var dataOutputs = newData[1];
        for (var i = 0; i < dataOutputs.length; i++) {
            labels.push(labelList.indexOf(dataOutputs[i][0]));
        }
        normalizedData = ShapeData.normalizeData(data, dataInputs);
        var xs = tf.tensor2d(normalizedData);
        var labelsTensor = tf.tensor1d(labels, "int32");
        var ys = tf.oneHot(labelsTensor, labelList.length);
        labelsTensor.dispose();
        var inputDim = ShapeData.getInputDim();
        model = tf.sequential();
        var hiddenLayer = tf.layers.dense({
            units: unitsHiddenLayer,
            activation: hiddenLayerActivation,
            inputDim: inputDim
        });
        var outputLayer = tf.layers.dense({
            units: 4,
            activation: outputLayerActivation
        });
        model.add(hiddenLayer);
        model.add(outputLayer);
        var learningR = learningRate;
        var myOptimizer = tf.train.sgd(learningR);
        model.compile({
            optimizer: myOptimizer,
            loss: "categoricalCrossentropy",
            metrics: ["accuracy"]
        });
        train(xs, ys).then(function (result) {
            tf.tidy(function () {
                var classifiedSongs = [];
                for (var song in songFeatures) {
                    var toGuess = tf.tensor2d([songFeatures[song]]);
                    var results = model.predict(toGuess);
                    var argMax = results.argMax(1);
                    var index = argMax.dataSync()[0];
                    var label = labelList[index];
                    model.getWeights();
                    classifiedSongs.push({
                        songName: songNames[song],
                        label: label,
                        labelIndex: index
                    });
                    console.log("I think that " + songNames[song] + " is a " + label + " song");
                }
                console.log("Classified songs:", classifiedSongs);
            });
        });
    }).catch(function (err) {
        return console.log(err);
    });
    function train(xs, ys) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            epochs: epochs,
                            validationSplit: validationSplit,
                            shuffle: true,
                            callbacks: {
                                onTrainBegin: function onTrainBegin() {
                                    return console.log("training start");
                                },
                                onTrainEnd: function onTrainEnd() {
                                    return console.log("training complete");
                                },
                                onEpochEnd: function onEpochEnd(num, logs) {
                                    console.log("Epoch: " + num);
                                    console.log(logs);
                                }
                            }
                        };
                        return [4, model.fit(xs, ys, options)];
                    case 1:
                        return [2, _a.sent()];
                }
            });
        });
    }
    function makeInputs() {
        var features = [];
        for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
            var singleSong = data_1[_i];
            for (var _a = 0, _b = data[singleSong]; _a < _b.length; _a++) {
                var singleFeature = _b[_a];
                console.log(data[singleSong][singleFeature]);
            }
        }
    }
    function loadJSON(url) {
        return new Promise(function (resolve, reject) {
            var xobj = new XMLHttpRequest();
            xobj.overrideMimeType("application/json");
            xobj.open('GET', url, true);
            xobj.onreadystatechange = function () {
                if (xobj.readyState == 4 && xobj.status == 200) {
                    resolve(xobj.responseText);
                }
            };
            xobj.send(null);
            xobj.onerror = function () {
                return reject(xobj.statusText);
            };
        });
    }
}
},{"../data/Emotion_data.json":"data\\Emotion_data.json","../toClassify/Emotion_features.json":"toClassify\\Emotion_features.json","./ShapeData":"scripts\\ShapeData.ts"}],"node_modules\\parcel-bundler\\src\\builtins\\hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '65517' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["node_modules\\parcel-bundler\\src\\builtins\\hmr-runtime.js","scripts\\classifier.ts"], null)
//# sourceMappingURL=/classifier.d15b2d9b.map