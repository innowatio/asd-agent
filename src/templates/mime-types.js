import fs from "fs-extra";
import {join} from "path";

const mimeTypesTemplate = fs.readFileSync(
    join(__dirname, "../../templates/mime.types"), "utf8"
);

export function getMimeTypes () {
    return mimeTypesTemplate;
}
