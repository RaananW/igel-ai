/*
Node binding for the ai binding.
There is a slight issue with typings when using openAI, so this is will stay commented out at the moment.
*/

// import * as fs from "fs";
// import * as http from "http";
// import axios from 'axios';

export function saveFile(_url: string, _filename = "./image.png") {
    // // check if the URL is a base64 url
    // if (url.startsWith("data:image")) {
    //     // remove the base64 header
    //     const base64 = url.split(';base64,').pop();
    //     if (!base64) {
    //         throw new Error("Invalid base64 image");
    //     }
    //     fs.writeFileSync(filename, base64, { encoding: 'base64' });
    // } else {
    //     // save the file

    //     const file = fs.createWriteStream(filename);
    //     http.get(url, function (response) {
    //         response.pipe(file);
    //         file.on('finish', function () {
    //             file.close();  // close() is async, call cb after close completes.
    //         });
    //     }).on('error', function (err) { // Handle errors
    //         console.log(err);
    //     });
    // }
    throw new Error("Not implemented");
}

export function loadFile(
    _url: string,
    _base64?: boolean
): Promise<string | ArrayBuffer> {
    // const image = await axios.get(url, { responseType: 'arraybuffer' });
    // if (base64) {
    //     return Buffer.from(image.data, 'binary').toString('base64');
    // } else {
    //     return image.data;
    // }
    throw new Error("Not implemented");
}

export function imageToFileObject(_image: string | ArrayBuffer): Promise<any> {
    throw new Error("Not implemented");
}
