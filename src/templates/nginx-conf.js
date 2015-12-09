import fs from "fs-extra";
import {compile} from "handlebars";
import {join} from "path";

import * as c from "../config";

const nginxConfTemplate = fs.readFileSync(
    join(__dirname, "../../templates/nginx.conf"), "utf8"
);
const link = compile(nginxConfTemplate);

export function getNginxConf () {
    return link({
        workerProcesses: c.NGINX_CPU_CORES,
        workerConnections: c.NGINX_WORKER_CONNECTIONS,
        workerRlimitNofile: c.NGINX_CPU_CORES * c.NGINX_WORKER_CONNECTIONS,
        mimeTypesPath: c.NGINX_MIME_TYPES_PATH,
        logPath: c.NGINX_LOG_PATH,
        sitesPath: c.NGINX_SITES_PATH
    });
}
