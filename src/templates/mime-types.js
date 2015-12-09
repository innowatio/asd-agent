import fs from "fs-extra";

const mimeTypes = fs.readFileSync(`${__dirname}/mime.types`, "utf8");

export function getMimeTypes () {
    return mimeTypes;
}
