const fs = require("fs");

export function exportFile(outputFile, updatedDom) {
  fs.writeFile(outputFile, updatedDom.serialize(), function(error) {
    if (error) {
      throw error;
    }
  });
}
