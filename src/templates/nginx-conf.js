import fs from "fs-extra";
import {compile} from "handlebars";

import * as c from "../config";

const template = compile(
    fs.readFileSync(`${__dirname}/nginx.conf`, "utf8")
);

export function getNginxConf () {
    return template({
        workerProcesses: c.NGINX_CPU_CORES,
        workerConnections: c.NGINX_WORKER_CONNECTIONS,
        workerRlimitNofile: c.NGINX_CPU_CORES * c.NGINX_WORKER_CONNECTIONS,
        mimeTypesPath: c.NGINX_MIME_TYPES_PATH,
        logPath: c.NGINX_LOG_PATH,
        sitesPath: c.NGINX_SITES_PATH
    });
}
