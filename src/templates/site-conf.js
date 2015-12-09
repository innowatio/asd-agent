import fs from "fs-extra";
import {compile} from "handlebars";
import {join} from "path";

const siteConfTemplate = fs.readFileSync(
    join(__dirname, "../../templates/site.conf"), "utf8"
);
const link = compile(siteConfTemplate);

export function getSiteConf ({fullDomain, rootDirectory}) {
    return link({
        fullDomain,
        rootDirectory
    });
}
