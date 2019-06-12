export default function(classesString, mixins, mixinPrefix) {
  // escape mixin prefix
  const mixinPrefixEscaped = mixinPrefix.replace(
    /[-[\]{}()*+?.,\\^$|#\s]/g,
    "\\$&"
  );

  /*
   * pattern for mixin root name
   * (like CSS class names but allow `+` too)
   */
  const mixinRootNamePattern = "-?[_a-zA-Z]+[_a-zA-Z0-9-+]*";

  // combined pattern
  const mixinPattern = new RegExp(
    `(^|\\s)(${mixinPrefixEscaped}${mixinRootNamePattern})`,
    "g"
  );

  // expand mixins in place
  return classesString.replace(mixinPattern, function(match, p1, p2) {
    return p1 + (mixins[p2] || "");
  });
}
