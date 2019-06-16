const fs = require("fs");
import { getOutputFile } from "./getOutputFile";

export function exportFile(file, outputDir, updatedDom) {
  const outputFile = getOutputFile(file, outputDir);

  fs.writeFile(outputFile, updatedDom.serialize(), function(error) {
    if (error) {
      throw error;
    }
  });
}
