import fs from "fs-extra";
import {compile} from "handlebars";

const template = compile(
    fs.readFileSync(`${__dirname}/site.conf`, "utf8")
);

export function getSiteConf ({fullDomain, rootDirectory}) {
    return template({
        fullDomain,
        rootDirectory
    });
}
