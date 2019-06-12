import getMixins from "./getMixins";
import expandMixins from "./expandMixins";
import getVarType from "./getVarType";

export default function(dom, classMap) {
  const config = {
    mixinPrefix: "+"
  };

  let mixins = getMixins(classMap, config.mixinPrefix);
  processClassMap(classMap);
  return dom;

  function processClassMap(obj, selectorTree = "") {
    Object.keys(obj).forEach(selector => {
      // process as selector if it's not a mixin definition
      if (selector.trim()[0] !== config.mixinPrefix) {
        const newSelectorTree = selectorTree + " " + selector;
        const val = obj[selector];
        const valType = getVarType(val);

        valType === "string"
          ? applyClasses(val, newSelectorTree)
          : valType === "array"
          ? processArray(val, newSelectorTree)
          : valType === "object"
          ? processClassMap(val, newSelectorTree)
          : null;
      }
    });
  }

  function processArray(arr, selectorTree) {
    arr.forEach(val => {
      const valType = getVarType(val);

      valType === "string"
        ? applyClasses(val, selectorTree)
        : valType === "object"
        ? processClassMap(val, selectorTree)
        : null;
    });
  }

  function applyClasses(classesString, selectorTree) {
    // expand mixins and separate classes into an array
    const classes = expandMixins(
      classesString,
      mixins,
      config.mixinPrefix
    ).split(/\s+/);

    // apply classes
    const els = dom.window.document.querySelectorAll(selectorTree);
    els &&
      classes &&
      els.forEach(el => {
        el.classList.add(...classes);
      });
  }
}
