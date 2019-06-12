/*
 * Built-in method `typeof()` is famously problematic;
 * this method is not perfectly precise, but good enough
 * for our purposes
 */

export default function(val) {
  return val
    ? typeof val === "string"
      ? "string"
      : typeof val === "object"
      ? Array.isArray(val) // even arrays are objects, so distinguish here
        ? "array"
        : "object"
      : null
    : null;
}
