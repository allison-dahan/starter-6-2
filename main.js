const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

IOhandler
    .zip(zipFilePath, pathUnzipped)
    .then(() => console.log("Extraction Completed"))
    .then(async () => {
        return await IOhandler.readsDir(pathUnzipped);})
    .then((imgs) => {
        const grayScalePromise = imgs.map((img) => IOhandler.grayScale(img, pathProcessed));
        return Promise.all(grayScalePromise);
    })
    .then(() => console.log("All images filtered!"))
    .catch(err => console.log(err))

