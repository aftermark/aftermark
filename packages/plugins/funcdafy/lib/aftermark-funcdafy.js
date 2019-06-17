'use strict';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

/*
 * Get mixin definitions at any level of the class map.
 * Note that all mixins are global in scope -- nesting the
 * mixin definition under a specific DOM node in the
 * class map does NOT limit its scope to that node.
 */
function getMixins (obj, mixinPrefix) {
  var extractMixinDefsFromObject = function extractMixinDefsFromObject(obj) {
    var mixins = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return Object.entries(obj).reduce(function (accumulatedMixins, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          val = _ref2[1];

      if (_typeof(val) === "object") {
        /*
         * if current entry is an object,
         * re-run parent function recursively
         */
        extractMixinDefsFromObject(val, accumulatedMixins);
      } else if (key[0] === mixinPrefix) {
        /*
         * if current entry key starts with mixin prefix,
         * add it to the mixin definitions
         */
        mixins[key] = val;
      }

      return accumulatedMixins;
    }, mixins);
  };

  return extractMixinDefsFromObject(obj);
}

function expandMixins (classesString, mixins, mixinPrefix) {
  // escape mixin prefix
  var mixinPrefixEscaped = mixinPrefix.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  /*
   * pattern for mixin root name
   * (like CSS class names but allow `+` too)
   */

  var mixinRootNamePattern = "-?[_a-zA-Z]+[_a-zA-Z0-9-+]*"; // combined pattern

  var mixinPattern = new RegExp("(^|\\s)(".concat(mixinPrefixEscaped).concat(mixinRootNamePattern, ")"), "g"); // expand mixins in place

  return classesString.replace(mixinPattern, function (match, p1, p2) {
    return p1 + (mixins[p2] || "");
  });
}

/*
 * Built-in method `typeof()` is famously problematic;
 * this method is not perfectly precise, but good enough
 * for our purposes
 */
function getVarType (val) {
  return val ? typeof val === "string" ? "string" : _typeof(val) === "object" ? Array.isArray(val) // even arrays are objects, so distinguish here
  ? "array" : "object" : null : null;
}

function applyClasses (dom, classMap) {
  var config = {
    mixinPrefix: "+"
  };
  var mixins = getMixins(classMap, config.mixinPrefix);
  processClassMap(classMap);
  return dom;

  function processClassMap(obj) {
    var selectorTree = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    Object.keys(obj).forEach(function (selector) {
      // process as selector if it's not a mixin definition
      if (selector.trim()[0] !== config.mixinPrefix) {
        var newSelectorTree = selectorTree + " " + selector;
        var val = obj[selector];
        var valType = getVarType(val);
        valType === "string" ? applyClasses(val, newSelectorTree) : valType === "array" ? processArray(val, newSelectorTree) : valType === "object" ? processClassMap(val, newSelectorTree) : null;
      }
    });
  }

  function processArray(arr, selectorTree) {
    arr.forEach(function (val) {
      var valType = getVarType(val);
      valType === "string" ? applyClasses(val, selectorTree) : valType === "object" ? processClassMap(val, selectorTree) : null;
    });
  }

  function applyClasses(classesString, selectorTree) {
    // expand mixins and separate classes into an array
    var classes = expandMixins(classesString, mixins, config.mixinPrefix).split(/\s+/); // apply classes

    var els = dom.window.document.querySelectorAll(selectorTree);
    els && classes && els.forEach(function (el) {
      var _el$classList;

      (_el$classList = el.classList).add.apply(_el$classList, _toConsumableArray(classes));
    });
  }
}

var fs = require("fs");

var path = require("path");

var yaml = require("js-yaml");

module.exports = function (dom, options) {
  if (!options.classMapFile) {
    throw new Error("Missing required option `classMapFile` with a path to a valid JSON or YAML class map.");
  } else {
    var classMapFilePathBase = options.configFilePath || "";
    var classMapFilePath = path.join(classMapFilePathBase, options.classMapFile);

    try {
      var classMap = yaml.safeLoad(fs.readFileSync(classMapFilePath, "utf8")); // loads either YAML or JSON

      return applyClasses(dom, classMap);
    } catch (e) {
      throw new Error(e);
    }
  }
};
