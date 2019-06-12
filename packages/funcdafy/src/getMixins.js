/*
 * Get mixin definitions at any level of the class map.
 * Note that all mixins are global in scope -- nesting the
 * mixin definition under a specific DOM node in the
 * class map does NOT limit its scope to that node.
 */

export default function(obj, mixinPrefix) {
  const extractMixinDefsFromObject = (obj, mixins = {}) =>
    Object.entries(obj).reduce((accumulatedMixins, [key, val]) => {
      if (typeof val === "object") {
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

  return extractMixinDefsFromObject(obj);
}
