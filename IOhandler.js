/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */

const { pipeline } = require("stream");
const { createReadStream, createWriteStream } = require("fs");
const fs = require("fs/promises");

const AdmZip = require("adm-zip"),
  PNG = require("pngjs").PNG,
  path = require("path");

/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */



const zip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    try {
    const zip = new AdmZip(pathIn);
    zip.extractAllTo(pathOut);
    resolve();
  } catch (err) {
    reject(err);
  }

  })

  }


/**
 * Description: read all the this files from given directory and return Promise containing array of each this file path
 *
 * @param {string} path
 * @return {promise}
 */




const readsDir = async (dir) => {
return new Promise((resolve, reject) => {
  fs.readdir(dir)
    .then((files) => {
      const imgs = files
      .filter(file => path.extname(file) === ".png")
      .map(file => path.join(dir,file))
      resolve(imgs);
    })
})
}

/**
 * Description: Read in this file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */



const grayScale = (filePath, pathProcessed) => {
  return new Promise ((resolve, reject) =>  {
    const fileName = path.basename(filePath);
    const grayscaledDir = path.join(pathProcessed, 'grayscaled'); // Directory for grayscaled images
    const outputPath = path.join(grayscaledDir, fileName);

    fs.mkdir(grayscaledDir, {recursive: true})
    createReadStream(filePath)
  .pipe(
    new PNG({
      filterType: 4,
    })
  )
  .on("parsed", function () {
    for (var i = 0; i < this.data.length; i +=4) {
      let r = this.data[i];
      let g = this.data[i+1];
      let b = this.data[i+2];
      const gray = 0.3 * r + 0.59 * g + 0.11 * b;
     this.data[i] = this.data[i+1] = this.data[i+2] = gray;
   }
  this.pack().pipe(createWriteStream(outputPath)
          .on('finish',() => resolve())
          .on('error', reject));
      })
      .on('error', reject);
  });
};


module.exports = {
  zip,
  readsDir,
  grayScale,
};
